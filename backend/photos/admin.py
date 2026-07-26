from django.contrib import admin
from django.utils.html import format_html
from .models import Category, Photo, Album, ContactMessage, SiteProfile 

@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ['thumbnail_preview', 'title', 'category', 'is_featured', 'is_published', 'order', 'created_at']
    list_filter = ['is_featured', 'is_published', 'created_at']
    search_fields = ['title', 'description', 'tags']
    prepopulated_fields = {'slug': ('title',)}
    list_editable = ['is_featured', 'is_published', 'order']
    readonly_fields = ['views']

    @admin.display(description='Image')
    def thumbnail_preview(self, obj):
        image = obj.thumbnail or obj.image
        if not image:
            return '—'
        return format_html(
            '<img src="{}" alt="" style="width:64px;height:48px;object-fit:cover;border-radius:3px">',
            image.url,
        )

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


admin.site.site_header = 'Shots by Pato'
admin.site.site_title = 'Portfolio admin'
admin.site.index_title = 'Portfolio management'

