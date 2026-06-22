from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('gallery/', views.gallery, name='gallery'),
    path('photo/<slug:slug>/', views.photo_detail, name='photo_detail'),
    path('albums/', views.album_list, name='album_list'),
    path('album/<slug:slug>/', views.album_detail, name='album_detail'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
]
