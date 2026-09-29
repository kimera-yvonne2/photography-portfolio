# Photography portfolio backend

The backend uses Django, PostgreSQL, and Pillow. It provides a public, read-only
photo API and a private Django admin for managing the portfolio.

## Setup

For a local PostgreSQL database, create it first:

```sql
CREATE DATABASE photography_portfolio;
```

Set the connection values in your shell (replace the password):

```powershell
$env:POSTGRES_DB = "photography_portfolio"
$env:POSTGRES_USER = "postgres"
$env:POSTGRES_PASSWORD = "your-postgres-password"
$env:POSTGRES_HOST = "127.0.0.1"
$env:POSTGRES_PORT = "5432"
```

### Neon

Copy the full connection string from the Neon dashboard into `backend/.env`.
It must include `sslmode=require`; the settings automatically read its host,
database, credentials, and TLS options.

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
```

Use [`.env.example`](.env.example) as the full configuration template. Do not
split a Neon URL into the `POSTGRES_*` values or commit the `.env` file.

Then install the dependencies and initialise Django:

```powershell
cd backend
.\venv\Scripts\python.exe -m pip install -r requirements.txt
.\venv\Scripts\python.exe manage.py migrate
.\venv\Scripts\python.exe manage.py createsuperuser
.\venv\Scripts\python.exe manage.py runserver
```

The API runs at `http://127.0.0.1:8000/` and the admin is available at
`http://127.0.0.1:8000/admin/`.

Uploaded photos are stored under `backend/media/`. They are served by Django
while development mode is enabled.

## API

| Method | URL | Description |
| --- | --- | --- |
| `GET` | `/api/health/` | Health check |
| `GET` | `/api/photos/` | All published photos |
| `GET` | `/api/photos/?featured=true` | Published featured photos |
| `GET` | `/api/photos/<id>/` | One published photo |
| `POST` | `/api/contact/` | Submit a JSON enquiry (`name`, `email`, `subject`, `message`) |

The photo list is ordered first by `display_order`, then by newest creation
date. Draft photos never appear in the public API.

## Configuration

The settings read these optional environment variables:

- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG`
- `DJANGO_ALLOWED_HOSTS`
- `CORS_ALLOWED_ORIGINS`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `POSTGRES_CONN_MAX_AGE`
- `DATABASE_URL` (recommended for Neon; includes `sslmode=require`)
- `CONTACT_RECIPIENT_EMAIL`
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_HOST_USER`, `EMAIL_HOST_PASSWORD`
- `EMAIL_USE_TLS`, `DEFAULT_FROM_EMAIL`

Use `.env.example` as a reference. The backend automatically loads
`backend/.env`; hosting platforms can instead provide the same values as
environment variables. For production, use a strong secret key, disable debug
mode, configure the deployed hosts and origins, and serve uploaded media from
persistent object storage or a web server.

## Enquiry email notifications

Set the `EMAIL_*` values in `.env` with your SMTP provider details. Gmail users
should use `smtp.gmail.com`, port `587`, TLS, and a Google app password rather
than their normal account password. Enquiries are always saved to the database;
if SMTP is unavailable, the API records the enquiry and logs the delivery error.

## Verification

```powershell
.\venv\Scripts\python.exe manage.py check
.\venv\Scripts\python.exe manage.py test
```
