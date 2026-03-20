# Collabify — Team Task Management App

A full-stack project management tool where teams can create projects, manage tasks, and collaborate with role-based access control.

## Tech Stack

**Backend:** Node.js, Express, Prisma ORM, PostgreSQL  
**Frontend:** React, Tailwind CSS, React Router v6, Axios  
**Auth:** JWT (JSON Web Tokens), bcrypt

## Features

- JWT-based authentication (register, login, protected routes)
- Create and manage projects
- Role-based access: Owner, Collaborator, Viewer
- Add and remove team members by email
- Create, assign, update, and delete tasks
- Task deadlines and status tracking

## Project Structure
```
/backend
  /controllers    ← route handlers
  /services       ← business logic
  /routes         ← Express routers
  /middlewares    ← JWT auth guard
  /config         ← Prisma client
  app.js
  server.js

/frontend
  /src
    /components   ← React components
    /context      ← AuthContext
    /services     ← Axios instance
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file:
```
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your_secret_here
JWT_EXPIRES_IN=7d
PORT=5000
```
```bash
npx prisma migrate dev
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173`, API at `http://localhost:5000`.

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register a new user |
| POST | /api/auth/login | Login, returns JWT |
| GET | /api/auth/profile | Get current user |
| GET | /api/projects | Get all user projects |
| POST | /api/projects | Create a project |
| GET | /api/projects/:id | Get project details |
| DELETE | /api/projects/:id | Delete project |
| POST | /api/projects/add-member | Add member by email |
| DELETE | /api/projects/:id/members/:userId | Remove member |
| GET | /api/tasks/project/:projectId | Get project tasks |
| POST | /api/tasks | Create task |
| PATCH | /api/tasks/:id/status | Update task status |
| PATCH | /api/tasks/:id/assign | Assign task to user |
| DELETE | /api/tasks/:id | Delete task |

## Status

Work in progress. See project status doc for what's next.