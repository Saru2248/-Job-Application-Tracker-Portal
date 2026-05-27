# 💼 Job Application Tracker Portal

> A modern full-stack MERN application for managing and tracking job applications, interviews, offers, and career progress.

---

## 🚀 Overview

The **Job Application Tracker Portal** is a full-stack web application designed to help students, job seekers, and professionals organize their entire job search process in one centralized platform.

Users can:
- Track job applications
- Monitor interview stages
- Manage offers and rejections
- Store company details
- Filter and search applications
- View dashboard analytics

This project demonstrates practical industry-level full-stack development using the MERN stack.

---

# 🌟 Key Features

### 🔐 Authentication & Security
- JWT Authentication
- Secure Login/Register
- Password Hashing using bcrypt
- Protected Routes
- User Session Management

### 📋 Job Application Management
- Add new job applications
- Edit application details
- Delete applications
- Update application status

### 📊 Dashboard Analytics
- Total applications count
- Interview statistics
- Offer tracking
- Rejection tracking
- Application progress overview

### 🔍 Smart Filtering & Search
- Filter by status
- Search by company or role
- Sort applications
- Track interview schedules

### 📱 Responsive Design
- Desktop responsive
- Mobile responsive
- Clean UI/UX
- Modern dashboard design

---

# 🛠️ Tech Stack

## Frontend
- React.js
- React Router DOM
- Axios
- Tailwind CSS / Bootstrap
- React Hooks

## Backend
- Node.js
- Express.js
- REST APIs
- JWT Authentication

## Database
- MongoDB
- Mongoose ODM

## Development Tools
- Git
- GitHub
- VS Code
- Postman
- MongoDB Compass

---

# 🏗️ System Architecture

```text
Frontend (React.js)
        ↓
REST API Calls
        ↓
Backend Server (Node.js + Express.js)
        ↓
Controllers & Middleware
        ↓
MongoDB Database
```

---

# 📂 Project Structure

```text
Job-Application-Tracker-Portal/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   └── App.js
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── docs/
├── README.md
├── .gitignore
└── .env.example
```

---

# ⚡ Core Functionalities

| Functionality | Description |
|---|---|
| User Authentication | Register/Login using JWT |
| Add Applications | Save job applications |
| CRUD Operations | Create, Read, Update, Delete |
| Status Tracking | Applied, Interview, Offer, Rejected |
| Dashboard | Analytics and statistics |
| Search & Filter | Quick application tracking |
| Responsive UI | Mobile + desktop support |

---

# 🔄 Application Workflow

```text
User Login/Register
        ↓
Add Job Application
        ↓
Save to MongoDB
        ↓
Update Application Status
        ↓
Dashboard Analytics Update
        ↓
Track Job Search Progress
```

---

# 🗃️ Database Design

## User Schema

```js
{
  name: String,
  email: String,
  password: String
}
```

## Job Application Schema

```js
{
  companyName: String,
  role: String,
  status: String,
  applicationDate: Date,
  interviewDate: Date,
  notes: String,
  userId: ObjectId
}
```

---

# 🔌 API Endpoints

## Authentication APIs

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login user |

---

## Job APIs

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/jobs | Get all jobs |
| POST | /api/jobs | Create job |
| PUT | /api/jobs/:id | Update job |
| DELETE | /api/jobs/:id | Delete job |

---

# ⚙️ Installation Guide

## Clone Repository

```bash
git clone https://github.com/Saru2248/Job-Application-Tracker-Portal.git
```

---

# Backend Setup

```bash
cd server
npm install
npm run dev
```

Backend runs on:

```bash
http://localhost:5000
```

---

# Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# MongoDB Setup

## Create `.env` File

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

---

# 🧪 Sample Application Status Flow

```text
Wishlist
   ↓
Applied
   ↓
Interview
   ↓
Offer / Rejected
```

---

# 📸 Screenshots

Add these screenshots to improve your GitHub proof:

- Register Page
- Login Page
- Dashboard
- Add Application Form
- Application List
- Edit Application
- Search & Filter
- MongoDB Collections
- API Testing
- GitHub Repository

---

# 🎯 Learning Outcomes

This project helped in understanding:

- MERN Stack Development
- REST API Development
- JWT Authentication
- MongoDB Integration
- CRUD Operations
- Frontend & Backend Integration
- State Management
- Git & GitHub Workflow
- Responsive UI Design

---

# 🚀 Future Enhancements

- Resume Upload
- Email Notifications
- AI Job Recommendations
- Recruiter Dashboard
- Admin Panel
- Application Deadline Reminder
- Dark/Light Theme Toggle

---

# 👨‍💻 Author

## Your Name
Full Stack Developer | MERN Stack Enthusiast

### Connect With Me
- GitHub: https://github.com/Saru2248
- LinkedIn: https://www.linkedin.com/in/sarthak-dhumal-07555a211/

---

# 📌 GitHub Topics

```text
mern-stack
reactjs
nodejs
expressjs
mongodb
jwt-authentication
full-stack-project
job-tracker
portfolio-project
student-project
```

---

# ⭐ Support

If you found this project useful:
- Star the repository
- Fork the project
- Share with others

---

