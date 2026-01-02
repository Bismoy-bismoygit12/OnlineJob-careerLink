# CareerLink - Online Job Portal

A full-stack online job portal application built with Node.js, Express, MongoDB, and React.

## Features

### User Roles
- **Student**: Create profile, browse jobs, apply for positions
- **Company**: Post jobs, view applications, manage candidates
- **Admin**: Manage users, approve companies, view platform statistics

### Student Features
- Personal profile management with image upload
- Education history (BSC/MSC with CGPA validation)
- Skills management (predefined list with years of experience)
- Work experience tracking
- Resume generation and PDF upload
- Browse and filter jobs (Full-time/Part-time)
- Track applied jobs with status
- Notifications for application updates

### Company Features
- Company profile with logo upload
- Job posting with skill requirements
- View and manage applications
- Approve/reject applications
- View student resumes
- Application notifications

### Admin Features
- View all students and companies
- Approve/reject company registrations
- Platform statistics dashboard
- User management

## Tech Stack

### Backend
- Node.js + Express
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing
- Multer for file uploads

### Frontend
- React
- React Router
- Axios for API calls
- Context API for state management

## Project Structure

```
OnlinePortal/
├── backend/
│   ├── models/          # Mongoose models
│   ├── controllers/     # Business logic
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & validation
│   ├── utils/           # Utilities (upload config)
│   ├── uploads/         # Uploaded files
│   ├── server.js        # Express server
│   └── db.js            # MongoDB connection
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── layouts/     # Layout components
│   │   ├── services/    # API services
│   │   ├── context/     # Context providers
│   │   └── App.js       # Main app component
│   └── package.json
└── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running on localhost:27017)
- npm or yarn

### Backend Setup

1. Install dependencies:
```bash
npm install
```

2. Ensure MongoDB is running:
```bash
# MongoDB should be running on localhost:27017
# Database name: OnlinePortal
```

3. Start the backend server:
```bash
npm run server
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

### Running Both Servers

From the root directory:
```bash
npm run dev
```

This will run both backend and frontend concurrently.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/forgot-password` - Forgot password

### Student Routes (requires authentication)
- `GET /api/student/profile` - Get profile
- `PUT /api/student/profile/personal-details` - Update personal details
- `POST /api/student/profile/image` - Upload profile image
- `POST /api/student/education` - Add education
- `GET /api/student/jobs` - Browse jobs
- `POST /api/student/jobs/:jobId/apply` - Apply for job
- `GET /api/student/jobs/applied` - Get applied jobs
- `GET /api/student/notifications` - Get notifications

### Company Routes (requires authentication)
- `GET /api/company/profile` - Get company profile
- `PUT /api/company/profile` - Update profile
- `POST /api/company/jobs` - Create job posting
- `GET /api/company/jobs` - Get company jobs
- `GET /api/company/applications` - Get all applications
- `PUT /api/company/applications/:id/approve` - Approve application

### Admin Routes (requires authentication)
- `GET /api/admin/students` - Get all students
- `GET /api/admin/companies` - Get all companies
- `PUT /api/admin/companies/:id/approve` - Approve company
- `GET /api/admin/statistics` - Get platform statistics

## Authentication

- JWT tokens are stored in localStorage
- Tokens expire after 7 days
- Protected routes require valid JWT token
- Role-based access control enforced on backend

## Validation Rules

### Email
- Must be a valid Gmail address (ends with @gmail.com)

### Password
- Minimum 6 characters
- Can contain letters, numbers, and symbols

### CGPA
- Numbers only (decimal allowed)
- Range: 0-10
- Validated on both frontend and backend

### Skills
- Must be selected from predefined list:
  - Java, Python, C / C++, JavaScript
  - MERN Stack, Full Stack
  - Frontend Developer, Backend Developer
  - DSA, Database (MongoDB, MySQL)

## File Uploads

Uploaded files are stored in:
- Profile images: `backend/uploads/profiles/`
- Company logos: `backend/uploads/logos/`
- Resumes: `backend/uploads/resumes/`

Files are served statically at `/uploads/*`

## Database Schema

### Collections
- `users` - User accounts
- `studentprofiles` - Student profile data
- `companyprofiles` - Company profile data
- `jobs` - Job postings
- `applications` - Job applications
- `notifications` - User notifications

## Development Notes

- Backend uses CommonJS (require/module.exports)
- Frontend uses ES6 modules
- CORS enabled for local development
- File size limit: 5MB per upload
- All dates stored in UTC

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check connection string in `backend/db.js`
- Verify database name is `OnlinePortal`

### CORS Errors
- Ensure backend CORS middleware is enabled
- Check API URL in frontend `services/api.js`

### File Upload Issues
- Ensure `backend/uploads/` directory exists
- Check file size limits (5MB)
- Verify file type restrictions

## License

This project is for educational purposes.

## Author

CareerLink Development Team

