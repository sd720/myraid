# Task Management Application

A production-ready Full Stack Task Management Application with robust security, authentication, and a clean UI.

## Features
- **User Authentication**: JWT-based auth with tokens stored in secure, HttpOnly cookies.
- **Task Management**: Full CRUD operations for tasks (Title, Description, Status).
- **Advanced Querying**: Search by title, filter by status, and pagination.
- **Security**:
    - Password hashing using `bcryptjs`.
    - Sensitive payload fields (Description) encrypted using AES-256.
    - Protected routes on both backend and frontend.
    - Security headers via `helmet` and CORS configuration.
- **UI/UX**: Clean, responsive dashboard built with Next.js and Tailwind CSS.

## Tech Stack
- **Backend**: Node.js, Express, MongoDB, Mongoose.
- **Frontend**: Next.js (App Router), Tailwind CSS, Axios, Lucide React.
- **Authentication**: JWT, Cookie-parser.
- **Security**: AES (CryptoJS), BCryptJS, Helmet, HPP.

## Deployment Strategy
The application is designed to be deployed on platforms like:
- **Frontend**: Vercel or Netlify.
- **Backend**: Render, Railway, or AWS (App Runner).
- **Database**: MongoDB Atlas.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or on Atlas)

### Backend Setup
1. `cd backend`
2. `npm install`
3. Create a `.env` file based on the implementation:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/taskmanager
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   COOKIE_EXPIRE=30
   AES_SECRET_KEY=your_32_char_aes_key
   NODE_ENV=development
   ```
4. `npm start` (Runs with nodemon)

### Frontend Setup
1. `cd frontend`
2. `npm install`
3. Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_AES_SECRET_KEY=your_32_char_aes_key
   ```
4. `npm run dev`

## API Documentation

### Auth Endpoints
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login and receive HttpOnly cookie.
- `GET /api/auth/logout`: Clear authentication cookie.
- `GET /api/auth/me`: Get current user details (Protected).

### Task Endpoints (All Protected)
- `GET /api/tasks`: List tasks (Supports `search`, `status`, `page`, `limit`).
- `POST /api/tasks`: Create a new task (Description is AES encrypted in transit).
- `GET /api/tasks/:id`: Get task details.
- `PUT /api/tasks/:id`: Update task.
- `DELETE /api/tasks/:id`: Delete task.

## Architecture
The application follows a modular architecture:
- **Backend**: Controller-Service pattern for logic, Mongoose models for data, and specialized middlewares for Auth and Encryption.
- **Frontend**: Next.js App Router for layout and routing, Context API for authentication state, and Axios for secure API communication.
