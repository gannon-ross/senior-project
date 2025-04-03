# Adult Airlines User Registration System

## Overview

This README documents the user registration system implemented for Adult Airlines. The system provides secure authentication, email verification, and role-based access control for the airline reservation platform.

## Table of Contents

- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security](#security)
- [Implementation Details](#implementation-details)

## Architecture

The system follows a modern client-server architecture with clear separation of concerns:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  React Frontend │────▶│  Express API    │────▶│  MySQL Database │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Frontend Architecture

```
src/
├── components/           # UI components
│   ├── Login.jsx         # User login form
│   ├── Registration.jsx  # User registration form
│   └── EmailVerification.jsx # Email verification
├── context/
│   └── AuthContext.jsx   # Authentication state management
├── services/
│   └── api.js            # API communication layer
└── pages/
    ├── Home.jsx          # Landing page with login
    └── Dashboard.jsx     # User dashboard (role-based)
```

### Backend Architecture

```
server/
├── config/
│   └── db.js             # Database configuration
├── controllers/
│   └── authController.js # Authentication logic
├── middleware/
│   └── auth.js           # JWT authentication middleware
├── models/
│   └── User.js           # User data model
├── routes/
│   └── auth.js           # API routes
└── services/
    └── emailService.js   # Email sending service
```

## Features

- **User Registration**: Secure sign-up with validation
- **Email Verification**: Two-step verification process
- **Authentication**: JWT-based secure login
- **Role-Based Access**: Different views for customers and agents
- **Profile Management**: User information management
- **Password Security**: Bcrypt hashing for passwords
- **Error Handling**: Comprehensive error management

## Tech Stack

### Frontend
- React 19.1.0
- React Router 7.4.1
- Context API for state management
- Tailwind CSS for styling

### Backend
- Node.js
- Express 5.1.0
- MySQL2 for database access
- JSON Web Tokens (JWT) for authentication
- Bcrypt for password hashing
- Nodemailer for email services

### Database
- MySQL

## Installation

### Prerequisites
- Node.js (v18+)
- MySQL Server
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/adult-airlines.git
   cd adult-airlines
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```
   DB_HOST=your-db-host
   DB_USER=your-db-user
   DB_PASSWORD=your-db-password
   DB_NAME=your-db-name
   DB_PORT=3306

   JWT_SECRET=your-jwt-secret
   JWT_EXPIRES_IN=7d

   EMAIL_SERVICE=gmail
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   EMAIL_FROM=Adult Airlines <your-email@gmail.com>

   PORT=3001
   ```

4. **Initialize the database**
   ```bash
   npm run init-db
   ```

## Usage

### Development

1. **Start the backend server**
   ```bash
   npm run server
   ```

2. **Start the frontend development server**
   ```bash
   npm run dev
   ```

3. **Access the application**
   Open your browser and navigate to `http://localhost:5173`

### Production

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm run start
   ```

## API Documentation

### Authentication Endpoints

| Endpoint | Method | Description | Request Body | Response |
|----------|--------|-------------|--------------|----------|
| `/api/auth/register` | POST | Register a new user | `{ email, password, first_name, last_name, role }` | `{ success, message, token, user }` |
| `/api/auth/verify-email` | POST | Verify email address | `{ email, code }` | `{ success, message, user }` |
| `/api/auth/login` | POST | Authenticate user | `{ email, password }` | `{ success, message, token, user }` |
| `/api/auth/me` | GET | Get current user | - | `{ success, user }` |

### Request & Response Examples

#### Register a new user

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "first_name": "John",
  "last_name": "Doe",
  "role": "customer"
}
```

Response:
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email for verification code.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 13,
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "role": "customer",
    "created_at": "2025-04-03T10:15:30.000Z"
  }
}
```

## Database Schema

### Users Table

| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary key, auto-increment |
| name | VARCHAR(100) | User's full name |
| email | VARCHAR(100) | Unique email address |
| password_hash | VARCHAR(255) | Bcrypt-hashed password |
| role | ENUM('customer', 'agent') | User role |
| created_at | TIMESTAMP | Account creation timestamp |

## Security

The system implements several security best practices:

- **Password Hashing**: All passwords are hashed using bcrypt with a salt factor of 10
- **JWT Authentication**: Secure, stateless authentication using signed tokens
- **Input Validation**: Comprehensive validation on both client and server
- **CORS Protection**: Configured Cross-Origin Resource Sharing
- **HTTP-Only Cookies**: Secure cookie storage for tokens
- **Email Verification**: Two-step verification process
- **Role-Based Access Control**: Restricted access based on user roles

## Implementation Details

### Authentication Flow

The authentication process follows these steps:

1. **Registration**:
   - User submits registration form with email, password, name, etc.
   - Server validates input and checks for existing email
   - Password is hashed using bcrypt
   - User record is created in database
   - Verification code is generated
   - JWT token is issued
   - User is redirected to verification page

2. **Email Verification**:
   - User enters verification code
   - Server validates the code
   - User's email is marked as verified
   - User gains full access to the application

3. **Login**:
   - User submits email and password
   - Server validates credentials
   - JWT token is issued
   - User is redirected to dashboard based on role

### User Model Implementation

The User model handles database operations and provides methods for:

- Creating new users with secure password hashing
- Finding users by email or ID
- Verifying email codes
- Validating user credentials

```javascript
// Example: User creation method
static async create(userData) {
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  // Insert into database
  const [result] = await pool.query(
    `INSERT INTO users (email, password_hash, name, role)
     VALUES (?, ?, ?, ?)`,
    [
      userData.email,
      hashedPassword,
      `${userData.first_name} ${userData.last_name}`,
      userData.role || 'customer'
    ]
  );

  // Return user data with verification code
  // ...
}
```

---

Developed for Adult Airlines Reservation System