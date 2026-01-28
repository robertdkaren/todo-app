# Todo App

A full-stack todo application with Django REST backend and React frontend.

## Features

- User authentication (login/logout)
- Create todos with customizable fields (string, boolean, or number values)
- Drag-and-drop reordering of form fields
- Field order persists per user
- Form validation on both frontend and backend

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm

## Setup

### Backend

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver 0.0.0.0:8002
```

### Frontend (Open a second window and cd to directory where you began - the parent of 'backend' mentioned above)

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev -- --port 5173
```

## Usage

1. Open http://localhost:5173 in your browser (or substitute server dns name for 'localhost')
2. Login with: `testuser` / `Xk9#mP2$vL5nQ8wR`
3. Create todos using the form
4. Drag form fields to reorder them (order is saved)

## Project Structure

```
├── backend/
│   ├── backend/          # Django project settings
│   ├── todos/            # Main app (models, views, serializers)
│   └── manage.py
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── api.js        # API client
│   │   └── App.jsx       # Main app component
│   └── package.json
└── README.md
```

## API Endpoints

- `POST /api/auth/login/` - Login
- `POST /api/auth/logout/` - Logout
- `GET /api/auth/me/` - Current user
- `GET /api/todos/` - List todos
- `POST /api/todos/` - Create todo
- `GET /api/preferences/` - Get user preferences
- `PUT /api/preferences/` - Update preferences (field order)
