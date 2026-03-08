# Leave Management System

A web application for managing employee leave requests with role-based access control.

## Features

### Employee Features
- User registration and login
- Apply for leave (sick, vacation, personal, other)
- View leave request status (Pending, Approved, Rejected)

### Employer Features
- View all employee leave requests
- Approve or reject leave requests

## Tech Stack

- **Frontend**: Vue.js 3, Tailwind CSS, Pinia (state management), Vue Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas

## Project Structure

```
HuskyVoice_Assignment/
├── backend/               # Express.js API
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Auth & role middleware
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── utils/             # Validation utilities
│   ├── .env               # Environment variables
│   ├── server.js          # Entry point
│   └── package.json
│
├── frontend/              # Vue.js SPA
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── router/        # Vue Router config
│   │   ├── stores/        # Pinia stores
│   │   └── views/         # Page components
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── AGENTS.md
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   
   Open `.env` file and update the MongoDB connection string:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secret_key
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

   The API will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The application will run on `http://localhost:3000`

## API Endpoints

| Method | Endpoint                 | Description         | Access    |
|--------|--------------------------|---------------------|-----------|
| POST   | `/api/auth/signup`       | Register new user   | Public    |
| POST   | `/api/auth/login`        | Authenticate user   | Public    |
| GET    | `/api/auth/me`           | Get current user    | Protected |
| GET    | `/api/leave`             | Get user's leaves   | Employee  |
| POST   | `/api/leave`             | Create leave request| Employee  |
| GET    | `/api/leave/all`         | Get all leaves      | Employer  |
| PUT    | `/api/leave/:id/approve` | Approve leave       | Employer  |
| PUT    | `/api/leave/:id/reject`  | Reject leave        | Employer  |

## User Roles

- **employee**: Can create and view their own leave requests
- **employer**: Can view all leave requests and approve/reject them

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

## Usage

1. Start both backend and frontend servers
2. Open `http://localhost:3000` in your browser
3. Sign up as either Employee or Employer
4. Employees can submit leave requests
5. Employers can view and manage all requests
