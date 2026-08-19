import json

from django.shortcuts import render, get_object_or_404
from django.conf import settings
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_POST
from django.core.mail import send_mail
from .models import Photo, Category, Album, ContactMessage, SiteProfile
from .forms import ContactForm


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
    send_mail(
        subject=f"Portfolio enquiry: {contact_message.subject}",
        message=(
            f"From: {contact_message.name} <{contact_message.email}>\n\n"
            f"{contact_message.message}"
        ),
        from_email=None,
        recipient_list=[settings.CONTACT_RECIPIENT_EMAIL],
        fail_silently=True,
    )
    return JsonResponse({'status': 'ok', 'id': contact_message.pk}, status=201)

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
