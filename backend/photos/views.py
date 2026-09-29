import json
import logging

from django.shortcuts import render, get_object_or_404
from django.conf import settings
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST
from django.core.mail import send_mail
from django.core.mail import EmailMessage
from django.contrib.auth import authenticate, login, logout
from .models import Photo, Category, Album, ContactMessage, SiteProfile
from .forms import ContactForm


logger = logging.getLogger(__name__)


@require_GET
def api_root(request):
    """Describe the backend instead of attempting to render missing templates."""
    return JsonResponse(
        {
            'name': 'Photography Portfolio API',
            'status': 'ok',
            'endpoints': {
                'health': request.build_absolute_uri('/api/health/'),
                'photos': request.build_absolute_uri('/api/photos/'),
                'contact': request.build_absolute_uri('/api/contact/'),
            },
        }
    )


def serialize_photo(request, photo):
    return {
        'id': photo.pk,
        'title': photo.title,
        'slug': photo.slug,
        'location': photo.location,
        'description': photo.description,
        'image': request.build_absolute_uri(photo.image.url),
        'thumbnail': (
            request.build_absolute_uri(photo.thumbnail.url)
            if photo.thumbnail else None
        ),
        'category': photo.category.name if photo.category else None,
        'tags': [tag.strip() for tag in photo.tags.split(',') if tag.strip()],
        'camera': photo.camera,
        'lens': photo.lens,
        'aperture': photo.aperture,
        'shutter_speed': photo.shutter_speed,
        'iso': photo.iso,
        'is_featured': photo.is_featured,
        'taken_at': photo.taken_at.isoformat() if photo.taken_at else None,
    }


@require_GET
def api_health(request):
    return JsonResponse({'status': 'ok'})


@require_GET
def api_studio_session(request):
    """Report whether the current session belongs to a studio author."""
    user = request.user
    return JsonResponse({
        'authenticated': user.is_authenticated,
        'authorized': user.is_authenticated and user.is_staff,
        'username': user.get_username() if user.is_authenticated and user.is_staff else '',
    })


@csrf_exempt
@require_POST
def api_studio_login(request):
    """Create a session for a staff user only."""
    try:
        payload = json.loads(request.body or '{}')
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({'detail': 'Invalid request.'}, status=400)

    username = str(payload.get('username', '')).strip()
    password = payload.get('password', '')
    user = authenticate(request, username=username, password=password)
    if user is None or not user.is_staff:
        return JsonResponse({'detail': 'Invalid author credentials.'}, status=403)

    login(request, user)
    return JsonResponse({'authorized': True, 'username': user.get_username()})


@csrf_exempt
@require_POST
def api_studio_logout(request):
    logout(request)
    return JsonResponse({'authorized': False})


@require_GET
def api_photo_list(request):
    photos = Photo.objects.filter(is_published=True).select_related('category')
    featured = request.GET.get('featured')
    if featured and featured.lower() in {'1', 'true', 'yes'}:
        photos = photos.filter(is_featured=True)
    elif featured and featured.lower() in {'0', 'false', 'no'}:
        photos = photos.filter(is_featured=False)
    photos = photos.order_by('order', '-created_at')
    return JsonResponse(
        [serialize_photo(request, photo) for photo in photos],
        safe=False,
    )


@require_GET
def api_photo_detail(request, photo_id):
    photo = get_object_or_404(
        Photo.objects.select_related('category'),
        pk=photo_id,
        is_published=True,
    )
    return JsonResponse(serialize_photo(request, photo))


@csrf_exempt
@require_POST
def api_contact(request):
    try:
        payload = json.loads(request.body or '{}')
    except (json.JSONDecodeError, UnicodeDecodeError):
        return JsonResponse({'errors': {'__all__': ['Invalid JSON body.']}}, status=400)

    form = ContactForm(payload)
    if not form.is_valid():
        return JsonResponse({'errors': form.errors.get_json_data()}, status=400)

    contact_message = form.save()
    notification_sent = False
    if settings.EMAIL_NOTIFICATIONS_ENABLED:
        try:
            EmailMessage(
                subject=f"Portfolio enquiry: {contact_message.subject}",
                body=(
                    f"From: {contact_message.name} <{contact_message.email}>\n\n"
                    f"{contact_message.message}"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[settings.CONTACT_RECIPIENT_EMAIL],
                reply_to=[contact_message.email],
            ).send(fail_silently=False)
            notification_sent = True
        except Exception:
            # Keep the enquiry in the database even if the mail provider is down.
            logger.exception('Unable to send enquiry notification for message %s', contact_message.pk)

    return JsonResponse(
        {
            'status': 'ok',
            'id': contact_message.pk,
            'notification_sent': notification_sent,
        },
        status=201,
    )

def home(request):
    featured_photos = Photo.objects.filter(is_featured=True, is_published=True).order_by('-created_at')[:5]
    latest_photos = Photo.objects.filter(is_published=True).order_by('-created_at')[:10]
    categories = Category.objects.all()
    albums = Album.objects.filter(is_published=True).order_by('-created_at')[:5]
    context = {
        'featured_photos': featured_photos,
        'latest_photos': latest_photos,
        'categories': categories,
        'albums': albums,
    }
    return render(request, 'photos/home.html', context)

def gallery(request):
    photos_list = Photo.objects.filter(is_published=True).order_by('-created_at')
    category_slug = request.GET.get('category')
    if category_slug:
        photos_list = photos_list.filter(category__slug=category_slug)
    paginator = Paginator(photos_list, 12)  # Show 12 photos per page
    page_number = request.GET.get('page')
    photos = paginator.get_page(page_number)
    categories = Category.objects.all()
    context = {
        'photos': photos,
        'categories': categories,
        'active_category': category_slug,
    }
    return render(request, 'photos/gallery.html', context)

def photo_detail(request, slug):
    photo = get_object_or_404(Photo, slug=slug, is_published=True)
    photo.views += 1
    photo.save(update_fields=['views'])
    related = Photo.objects.filter(category=photo.category).exclude(id=photo.id)[:4] if photo.category else []
    context = {
        'photo': photo,
        'related': related,
    }
    return render(request, 'photos/photo_detail.html', context)

def album_list(request):
    albums = Album.objects.filter(is_published=True).order_by('-created_at')
    return render(request, 'photos/album_list.html', {'albums': albums})

def album_detail(request, slug):
    album = get_object_or_404(Album, slug=slug, is_published=True)
    return render(request, 'photos/album_detail.html', {'album': album})

def contact(request):
    if request.method == 'POST':
        form = ContactForm(request.POST)
        if form.is_valid():
            contact_message = form.save()
            send_mail(
                subject=f"Portfolio enquiry:{contact_message.subject}",
                message=f"From: {contact_message.name} <{contact_message.email}>\n\n{contact_message.message}",
                from_email=contact_message.email,
                recipient_list=['your@email.com'],
            )
            return JsonResponse({'status':'ok'})
    else:
        form = ContactForm()
    return render(request, 'photos/contact.html', {'form': form})

def about(request):
    profile = SiteProfile.objects.first()
    return render(request, 'photos/about.html', {'profile': profile})
