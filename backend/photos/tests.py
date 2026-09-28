from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model

from .models import ContactMessage, Photo


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


class ContactApiTests(TestCase):
    def test_valid_message_is_saved(self):
        response = self.client.post(
            reverse('photo-api:contact'),
            data={
                'name': 'Amina',
                'email': 'amina@example.com',
                'subject': 'Portrait session',
                'message': 'I would like to discuss a session in Kampala.',
            },
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json()['status'], 'ok')
        self.assertTrue(ContactMessage.objects.filter(email='amina@example.com').exists())

    def test_invalid_message_returns_field_errors(self):
        response = self.client.post(
            reverse('photo-api:contact'),
            data={'name': '', 'email': 'not-an-email', 'subject': '', 'message': ''},
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn('email', response.json()['errors'])
        self.assertEqual(ContactMessage.objects.count(), 0)

    def test_cors_preflight_allows_contact_post(self):
        response = self.client.options(
            reverse('photo-api:contact'),
            headers={'origin': 'http://localhost:5173'},
        )

        self.assertEqual(response.status_code, 204)
        self.assertIn('POST', response['Access-Control-Allow-Methods'])


class StudioAuthApiTests(TestCase):
    def test_staff_user_can_sign_in_to_studio(self):
        user = get_user_model().objects.create_user(
            username='pato', password='safe-password', is_staff=True,
        )

        response = self.client.post(
            reverse('photo-api:studio-login'),
            data={'username': user.username, 'password': 'safe-password'},
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()['authorized'])
        session = self.client.get(reverse('photo-api:studio-session'))
        self.assertTrue(session.json()['authorized'])

    def test_non_staff_user_cannot_sign_in_to_studio(self):
        get_user_model().objects.create_user(username='visitor', password='safe-password')

        response = self.client.post(
            reverse('photo-api:studio-login'),
            data={'username': 'visitor', 'password': 'safe-password'},
            content_type='application/json',
        )

        self.assertEqual(response.status_code, 403)
        self.assertFalse(self.client.get(reverse('photo-api:studio-session')).json()['authorized'])
