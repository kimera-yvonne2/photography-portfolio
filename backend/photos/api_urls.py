from django.urls import path

from . import views


app_name = 'photo-api'

urlpatterns = [
    path('health/', views.api_health, name='health'),
    path('photos/', views.api_photo_list, name='photo-list'),
    path('photos/<int:photo_id>/', views.api_photo_detail, name='photo-detail'),
]
