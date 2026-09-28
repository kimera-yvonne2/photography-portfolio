from django.urls import path

from . import views


app_name = 'photo-api'

urlpatterns = [
    path('health/', views.api_health, name='health'),
    path('studio/session/', views.api_studio_session, name='studio-session'),
    path('studio/login/', views.api_studio_login, name='studio-login'),
    path('studio/logout/', views.api_studio_logout, name='studio-logout'),
    path('photos/', views.api_photo_list, name='photo-list'),
    path('photos/<int:photo_id>/', views.api_photo_detail, name='photo-detail'),
    path('contact/', views.api_contact, name='contact'),
]
