# Photography portfolio backend

The backend uses Django, PostgreSQL, and Pillow. It provides a public, read-only
photo API and a private Django admin for managing the portfolio.

## Setup

Create a PostgreSQL database first:

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

Use `.env.example` as a reference. Environment files are not automatically
loaded, so set the values in the hosting platform or shell. For production,
use a strong secret key, disable debug mode, configure the deployed hosts and
origins, and serve uploaded media from persistent object storage or a web
server.

## Verification

```powershell
.\venv\Scripts\python.exe manage.py check
.\venv\Scripts\python.exe manage.py test
```
