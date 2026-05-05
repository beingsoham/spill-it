# SpillIt

SpillIt is a React + Vite client with a Node/Express API that uses Supabase for auth and data. The client is a routed SPA with a feed, explore, notifications, and profile UI. The server provides REST endpoints for posts, comments, likes, trending, and notifications.

## Repo layout

- client/  React + Vite app
- server/  Express API server (ESM)

## Quick start (dev)

1) Install deps

- Client:
  - cd client
  - npm install
- Server:
  - cd server
  - npm install

2) Configure env

Client: client/.env
- VITE_SUPABASE_URL=your_supabase_url
- VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
- VITE_API_URL=http://localhost:4000

Server: server/.env
- PORT=4000
- SUPABASE_URL=your_supabase_url
- SUPABASE_SERVICE_KEY=your_supabase_service_key
- CLIENT_URL=http://localhost:5173

3) Run

- Server:
  - cd server
  - npm run dev
- Client:
  - cd client
  - npm run dev

Client runs on http://localhost:5173
Server runs on http://localhost:4000

## Features

Client
- Feed with infinite scroll and realtime updates
- Post modal with categories and media preview
- Comments with realtime updates
- Profile pages and stats
- Explore search and categories
- Notifications list
- Trending sidebar with hot tags and posts

Server
- Posts: list, get, create, delete, flag
- Comments: list, create, delete
- Likes: toggle
- Users: public profile, update me, follow/unfollow
- Trending: top posts and tags
- Notifications: list and mark all read

## API endpoints (summary)

- GET /api/posts
- GET /api/posts/:id
- POST /api/posts
- DELETE /api/posts/:id
- POST /api/posts/:id/flag

- GET /api/posts/:postId/comments
- POST /api/posts/:postId/comments
- DELETE /api/posts/:postId/comments/:commentId

- POST /api/likes/:postId

- GET /api/users/:username
- PATCH /api/users/me
- POST /api/users/:id/follow

- GET /api/trending/posts
- GET /api/trending/tags

- GET /api/notifications
- PATCH /api/notifications/read-all

## Notes

- The server expects a valid Supabase auth token on protected routes.
- The client injects the access token on API calls via Axios interceptors.
- Trending scores are refreshed by a cron job on the server.

## Mobile testing

If you open the client on a phone, update VITE_API_URL to your PC LAN IP and allow that origin in server CORS if needed. Then restart both dev servers.
