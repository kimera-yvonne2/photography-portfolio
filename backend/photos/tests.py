from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import reverse

from .models import Photo


GIF_IMAGE = (
    b'GIF87a\x01\x00\x01\x00\x80\x01\x00\x00\x00\x00ccc,'
    b'\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;'
)


class PhotoApiTests(TestCase):
    def make_photo(self, **overrides):
        values = {
            'title': 'Kampala at dusk',
            'slug': 'kampala-at-dusk',
            'location': 'Kampala, Uganda',
            'image': SimpleUploadedFile('photo.gif', GIF_IMAGE, content_type='image/gif'),
        }
        values.update(overrides)
        return Photo.objects.create(**values)

    def test_list_only_returns_published_photos(self):
        shown = self.make_photo(is_featured=True)
        self.make_photo(title='Draft', slug='draft', is_published=False)

        response = self.client.get(reverse('photo-api:photo-list'))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), 1)
        self.assertEqual(response.json()[0]['id'], shown.id)
        self.assertTrue(response.json()[0]['image'].startswith('http://testserver/media/'))

    def test_featured_filter(self):
        self.make_photo(is_featured=True)
        self.make_photo(title='Other', slug='other', is_featured=False)

        response = self.client.get(reverse('photo-api:photo-list'), {'featured': 'true'})

        self.assertEqual(len(response.json()), 1)
        self.assertTrue(response.json()[0]['is_featured'])

    def test_unpublished_detail_returns_not_found(self):
        photo = self.make_photo(is_published=False)
        response = self.client.get(
            reverse('photo-api:photo-detail', kwargs={'photo_id': photo.id})
        )
        self.assertEqual(response.status_code, 404)
