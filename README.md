# Tutorial Management System (TMS) Backend API Documentation

## Overview

The Tutorial Management System (TMS) Backend is a comprehensive RESTful API built with Node.js, Express, and PostgreSQL. It provides complete functionality for managing users, courses, tutorials, access requests, and educational materials with role-based access control and device-based authentication.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
  - [Authentication APIs](#authentication-apis)
  - [User Management APIs](#user-management-apis)
  - [Course Management APIs](#course-management-apis)
  - [Video Management APIs](#video-management-apis)
  - [Course Material APIs](#course-material-apis)
  - [Access Request APIs](#access-request-apis)
  - [Role Management APIs](#role-management-apis)
  - [Role-Course Assignment APIs](#role-course-assignment-apis)
  - [Receipt Management APIs](#receipt-management-apis)
- [Error Handling](#error-handling)
- [File Uploads](#file-uploads)
- [Rate Limiting](#rate-limiting)
- [Security](#security)

## Features

- 🔐 **Device-based Authentication** - Users can only login from their registered device
- 👥 **Role-based Access Control** - Admin, Instructor, and Student roles
- 📚 **Course Management** - Create, update, and manage courses
- 🎥 **Video Content** - Upload and manage video tutorials
- 📄 **Course Materials** - Upload PDFs, documents, and other educational materials
- 📋 **Access Requests** - Students can request access to courses
- 📝 **Receipt Management** - Upload and manage payment receipts
- 🔍 **Advanced Search** - Search by title, filename, file type
- 📱 **Mobile-friendly** - Responsive API design

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer
- **Security**: bcrypt, CORS
- **Validation**: Input validation and sanitization

## Authentication

The API uses JWT-based authentication with device-based security:

### Registration Flow

1. User registers with email and password
2. Device information is captured and stored
3. Email verification is required
4. User can only login from the registered device

### Login Flow

1. User provides credentials and device info
2. System validates credentials and device match
3. JWT token is issued for authenticated sessions
4. Token must be included in `Authorization: Bearer <token>` header

### Device Security

- Non-admin users can only login from their registered device
- Device fingerprinting prevents unauthorized access
- Admin users can login from any device

## API Endpoints

### Authentication APIs

#### Registration & Verification

- `POST /api/auth/register` - Register a new user account
- `POST /api/auth/verify-email` - Verify user email with token

#### Password Management

- `POST /api/auth/forgot-password` - Request password reset email
- `POST /api/auth/validate-reset-token` - Validate password reset token
- `POST /api/auth/reset-password` - Reset password with valid token

#### Authentication

- `POST /api/auth/login` - Authenticate user and return JWT token
- `POST /api/auth/logout` - Logout user (requires authentication)
- `POST /api/auth/refresh-token` - Refresh JWT access token

#### Profile Management

- `GET /api/auth/profile` - Get current user profile (requires authentication)
- `PUT /api/auth/profile` - Update user profile information (requires authentication)
- `PUT /api/auth/change-password` - Change user password (requires authentication)

### User Management APIs (Admin Only)

- `GET /api/users/get-all-users` - Get all users
- `GET /api/users/get-user-by-id/:id` - Get user by ID
- `PUT /api/users/update-user-by-id/:id` - Update user information
- `DELETE /api/users/delete-user-by-id/:id` - Delete user

### Course Management APIs

#### Admin Operations

- `POST /api/courses/create-course` - Create new course (admin only)
- `GET /api/courses/get-all-courses` - Get all courses (admin only)
- `PUT /api/courses/update-course/:id` - Update course (admin only)
- `DELETE /api/courses/delete-course/:id` - Delete course (admin only)

#### User Operations

- `GET /api/courses/get-course/:id` - Get course by ID (requires authentication)

### Video Management APIs

#### Admin Operations

- `POST /api/videos/create-video` - Create new video (admin only)
- `GET /api/videos/get-all-videos` - Get all videos (admin only)
- `PUT /api/videos/update-video/:id` - Update video (admin only)
- `DELETE /api/videos/delete-video/:id` - Delete video (admin only)

#### User Operations

- `GET /api/videos/get-videos/:course_id` - Get videos by course ID (requires authentication)

### Course Material APIs

#### Admin Operations

- `POST /api/course-materials/create-course-material` - Upload course material (admin only, file upload)
- `GET /api/course-materials/all-course-materials` - Get all course materials (admin only)
- `GET /api/course-materials/search-by-title` - Search materials by title (admin only)
- `GET /api/course-materials/search-by-filename` - Search materials by filename (admin only)
- `GET /api/course-materials/search-by-filetype` - Filter materials by file type (admin only)
- `PUT /api/course-materials/update-course-material/:id` - Update course material (admin only)
- `DELETE /api/course-materials/delete-course-material/:id` - Delete course material (admin only)

#### User Operations

- `GET /api/course-materials/course-material/:id` - Get material by ID (requires authentication)
- `GET /api/course-materials/course/:course_id/materials` - Get materials by course ID (requires authentication)

### Access Request APIs

#### User Operations

- `POST /api/access-requests/access-requests` - Create access request for course (requires authentication)
- `GET /api/access-requests/access-requests` - Get user's access requests (requires authentication)

#### Admin Operations

- `GET /api/access-requests/admin/access-requests` - Get all access requests (admin only)
- `GET /api/access-requests/admin/access-requests/pending` - Get pending requests (admin only)
- `GET /api/access-requests/admin/access-requests/course/:course_id` - Get requests by course (admin only)
- `GET /api/access-requests/admin/access-requests/status/:status` - Get requests by status (admin only)
- `GET /api/access-requests/admin/access-requests/:request_id` - Get request by ID (admin only)
- `PUT /api/access-requests/admin/access-requests/:request_id/status` - Update request status (admin only)
- `DELETE /api/access-requests/admin/access-requests/:request_id` - Delete request (admin only)

### Role Management APIs (Admin Only)

- `GET /api/roles/get-all-roles` - Get all roles
- `POST /api/roles/create-new-role` - Create new role

### Role-Course Assignment APIs (Admin Only)

- `POST /api/role-course/assign-course` - Assign single course to role
- `DELETE /api/role-course/remove-course` - Remove single course from role
- `POST /api/role-course/assign-multiple-courses` - Assign multiple courses to role
- `DELETE /api/role-course/remove-multiple-courses` - Remove multiple courses from role
- `GET /api/role-course/get-all-assignments` - Get all role-course assignments
- `GET /api/role-course/role/:role_id/courses` - Get courses by role ID
- `GET /api/role-course/course/:course_id/roles` - Get roles by course ID

### Receipt Management APIs

#### User Operations

- `POST /api/receipts/upload-receipt` - Upload receipt (requires authentication, file upload)
- `GET /api/receipts/get-my-receipt` - Get user's receipts (requires authentication)

## Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (in development)"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

## File Uploads

### Course Materials

- **Endpoint**: `POST /api/course-materials/create-course-material`
- **File Types**: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, images, videos, audio, ZIP
- **Size Limit**: 10MB
- **Storage**: `uploads/course-materials/` directory

### Receipts

- **Endpoint**: `POST /api/receipts/upload-receipt`
- **File Types**: Images, PDFs
- **Size Limit**: 1MB
- **Storage**: `uploads/receipts/` directory

### Upload Format

```javascript
// Multipart form data
Content-Type: multipart/form-data

// Form fields
course_id: 1
title: "Material Title"
description: "Material Description"
file: [binary file data]
```

## Rate Limiting

Currently, rate limiting is not implemented but can be added using middleware like `express-rate-limit` for production environments.

## Security

### Authentication Security

- JWT tokens with expiration
- Device-based authentication for non-admin users
- Password hashing with bcrypt
- Email verification required

### Data Validation

- Input validation on all endpoints
- SQL injection prevention with parameterized queries
- File type validation for uploads
- File size limits

### CORS Configuration

- CORS enabled for cross-origin requests
- Configurable origin whitelist in production

### Environment Variables

```env
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/database
JWT_SECRET=your-jwt-secret-key
NODE_ENV=development
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL database
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd tms-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run migrate

# Start the development server
npm run dev
```

### Database Setup

1. Create PostgreSQL database
2. Run the schema.sql file to create tables
3. Set up environment variables for database connection

## API Usage Examples

### User Registration

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### User Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Upload Course Material

```bash
curl -X POST http://localhost:3000/api/course-materials/create-course-material \
  -H "Authorization: Bearer <jwt-token>" \
  -F "course_id=1" \
  -F "title=Course Material" \
  -F "description=Material description" \
  -F "file=@material.pdf"
```

## Testing

The API includes comprehensive error handling and validation. Test endpoints are marked with "Tested and working" comments in the route files.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
