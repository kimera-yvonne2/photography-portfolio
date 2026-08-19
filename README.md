# Shots by Pato photography portfolio

This repository contains:

- `frontend/` — React and Vite portfolio website
- `backend/` — Django photo API and portfolio admin

## Run locally

Open two terminals.

### Backend

Create a PostgreSQL database named `photography_portfolio` and set the
`POSTGRES_*` environment variables described in
[backend/README.md](backend/README.md), then run:

```powershell
cd backend
.\venv\Scripts\python.exe -m pip install -r requirements.txt
.\venv\Scripts\python.exe manage.py migrate
.\venv\Scripts\python.exe manage.py createsuperuser
.\venv\Scripts\python.exe manage.py runserver
```

Open `http://127.0.0.1:8000/admin/` to upload and arrange photographs.

### Frontend

```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:5173/`.

The frontend reads published photographs from
`http://127.0.0.1:8000/api/photos/`. Until photos have been added in the
Django admin, the landing page retains its built-in fallback photographs.

See [backend/README.md](backend/README.md) for API and configuration details.
