from django.shortcuts import render, get_object_or_404
from django.core.paginator import Paginator
from django.http import JsonResponse
from django.core.mail import send_mail
from .models import Photo, Category, Album, ContactMessage, SiteProfile
from .forms import ContactForm

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