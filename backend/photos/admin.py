from django.contrib import admin
from .models import Category, Photo, Album, ContactMessage, SiteProfile 

@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ['title', 'category', 'is_featured', 'is_published', 'created_at']
    list_filter = ['is_featured', 'is_published', 'created_at']
    search_fields = ['title', 'description', 'tags']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['is_featured', 'is_published']
    readonly_fields = ['views']

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Album)
class AlbumAdmin(admin.ModelAdmin):
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ['photos']

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'subject', 'is_read', 'submitted_at']
    list_filter = ['is_read']
    readonly_fields = ['name', 'email', 'subject', 'message', 'submitted_at']

@admin.register(SiteProfile)
class SiteProfileAdmin(admin.ModelAdmin):
    pass

