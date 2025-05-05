# Learning Management System (LMS)

A full-stack Learning Management System with role-based access control, approval workflows, and comprehensive features for Admins, Teachers, and Students.

## Features

### Admin
- Dashboard with overview statistics
- Teacher account approval management
- Course approval management
- Review approval management

### Teacher
- Dashboard with course statistics
- Course creation and management
- View student enrollments and reviews

### Student
- Browse approved courses
- Enroll in courses
- Submit course reviews (pending admin approval)
- Track enrolled courses and review status

## Tech Stack

### Backend
- Node.js & Express
- MongoDB with Mongoose
- JWT for authentication

### Frontend
- React with TypeScript
- TanStack Query for data fetching & state management
- React Router for navigation
- Tailwind CSS with Shadcn UI components

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Backend Setup
1. Create a MongoDB database (locally or on MongoDB Atlas)
2. Navigate to the backend directory:
   ```
   cd backend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file in the backend directory with:
   ```
   PORT=4000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=1d
   ```
5. Start the development server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Usage

1. Access the application at `http://localhost:5173`
2. Create accounts with different roles:
   - Admin
   - Teacher
   - Student
3. Login with the appropriate role to access the role-specific dashboard

### Workflows

1. **Teacher Registration Flow**:
   - Teacher registers
   - Admin approves teacher account
   - Teacher can create courses

2. **Course Creation Flow**:
   - Teacher creates course
   - Admin approves course
   - Students can view and enroll in approved courses

3. **Review Submission Flow**:
   - Student enrolls in a course
   - Student submits a review
   - Admin approves review
   - Review becomes visible to all users

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Admin Endpoints
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/teachers` - Get teachers with optional status filter
- `PATCH /api/admin/teachers/:id/status` - Update teacher status
- `GET /api/admin/courses` - Get courses with optional status filter
- `PATCH /api/admin/courses/:id/status` - Update course status
- `GET /api/admin/reviews` - Get reviews with optional status filter
- `PATCH /api/admin/reviews/:id/status` - Update review status

### Teacher Endpoints
- `GET /api/teacher/profile` - Get teacher profile
- `PATCH /api/teacher/profile` - Update teacher profile
- `POST /api/teacher/courses` - Create a new course
- `GET /api/teacher/courses` - Get teacher's courses
- `GET /api/teacher/courses/:id` - Get a specific course with enrollments and reviews
- `PATCH /api/teacher/courses/:id` - Update a course

### Student Endpoints
- `GET /api/student/profile` - Get student profile
- `PATCH /api/student/profile` - Update student profile
- `GET /api/student/courses` - Get all approved courses
- `GET /api/student/courses/:id` - Get a specific course with reviews
- `POST /api/student/courses/:id/enroll` - Enroll in a course
- `GET /api/student/enrollments` - Get enrolled courses
- `POST /api/student/courses/:id/reviews` - Submit a review
- `GET /api/student/reviews` - Get student's reviews 