# WeeklyFit — Frontend

A personalised weekly fitness planner powered by AI. Users get a custom workout and meal plan for every day of the week, log their daily progress, and track the week at a glance on the dashboard.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Forms | React Hook Form + Zod |
| State | React Context (UserContext, PlanContext) |

## Features

- **Authentication** — sign up / log in with JWT, protected and guest routes
- **AI Plan Generation** — generates a full 7-day workout + meal plan via the backend AI endpoint; regenerates (PUT) if a plan already exists
- **Daily Log** — mark each day as Done / Unable / Missed; enforces sequential logging (can't log today until all previous days are logged)
- **Dashboard** — today's snapshot pulled from the live plan, weekly progress bar and day-dot summary using real log statuses
- **Profile** — view and edit user details
- **Subscription** — subscription management page

## Project Structure

```
src/
├── components/
│   ├── AuthForm.tsx          # Shared sign-up / login form
│   ├── EditProfileModal.tsx
│   ├── GuestRoute.tsx        # Redirects logged-in users away from /login
│   ├── Layout.tsx            # Navbar + Outlet wrapper
│   ├── Navbar.tsx            # Nav with logout button
│   ├── ProfileCard.tsx
│   ├── ProtectedRoute.tsx    # Redirects unauthenticated users to /login
│   └── Spinner.tsx
├── context/
│   ├── PlanContext.tsx        # aiResult + dailyLogs shared across pages
│   └── UserContext.tsx        # user, token, logout
├── libs/
│   └── types.ts              # Zod schemas + shared TypeScript types
└── pages/
    ├── DashboardPage.tsx
    ├── GeneratePage.tsx
    ├── HomePage.tsx
    ├── LandingPage.tsx
    ├── LoginPage.tsx
    ├── ProfilePage.tsx
    └── SubscribePage.tsx
```

## Getting Started

### Prerequisites

- Node.js 18+
- The WeeklyFit backend running on `http://localhost:3001`

### Install & Run

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Other Scripts

```bash
npm run build     # production build
npm run preview   # preview the production build locally
npm run lint      # ESLint
```

## API Endpoints Used

| Method | Endpoint | Description |
|---|---|---|
| POST | `/users/signup` | Register |
| POST | `/users/login` | Login |
| GET | `/users/me` | Fetch current user |
| POST | `/aiResult/generate` | Generate a new weekly plan |
| PUT | `/aiResult/generate` | Regenerate (update) existing plan |
| GET | `/aiResult/result` | Fetch the user's latest plan |
| GET | `/aiResult/results` | Fetch all past plans (dashboard) |
| GET | `/dailyLogs` | Fetch the current week's log |
| POST | `/dailyLogs` | Submit a daily log entry |

## Environment

No `.env` file is required for the frontend. The backend base URL is currently hardcoded to `http://localhost:3001`. To point to a different API, search for that string and replace it.
