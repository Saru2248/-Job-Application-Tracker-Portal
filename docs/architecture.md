# 🏗️ System Architecture

---

## 📖 Simple Explanation

Think of the system like a restaurant:

- **Customer (User)** → Opens React app (the menu)
- **Waiter (API)** → Takes the order and brings it to the kitchen
- **Kitchen (Backend/Express)** → Processes the request
- **Recipe Book (Mongoose Models)** → Defines how data should look
- **Refrigerator (MongoDB)** → Stores all the data permanently

---

## 🔧 Technical Architecture

### Request Flow

```
[User Browser]
      │
      │ HTTP Request (GET/POST/PUT/DELETE)
      ▼
[React.js Frontend - localhost:3000]
      │
      │ axios.get('/api/jobs', { headers: { Authorization: 'Bearer JWT_TOKEN' } })
      │
      │ HTTP/JSON
      ▼
[Express.js Server - localhost:5000]
      │
      ├─ CORS Middleware (allows localhost:3000)
      ├─ JSON Parser (parses request body)
      ├─ Router: /api/auth → authRoutes.js
      │            /api/jobs → jobRoutes.js
      │
      ├─ protect Middleware (verifies JWT token)
      │         jwt.verify(token, JWT_SECRET)
      │         User.findById(decoded.id)
      │         req.user = user
      │
      ├─ Controller Function (business logic)
      │         JobApplication.find({ user: req.user.id, ...filters })
      │
      │ Mongoose Query
      ▼
[MongoDB Database]
      │
      │ Returns BSON documents
      ▼
[Controller formats response]
      │
      │ res.json({ success: true, jobs: [...] })
      ▼
[React.js receives response]
      │
      │ setJobs(res.data.jobs)
      ▼
[React re-renders UI with new data]
```

---

## 🗄️ Database Schema

### Users Collection
```json
{
  "_id": "ObjectId('65abc123...')",
  "name": "Priya Sharma",
  "email": "priya@example.com",
  "password": "$2a$12$hashedPasswordHere...",
  "role": "user",
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

### JobApplications Collection
```json
{
  "_id": "ObjectId('65def456...')",
  "user": "ObjectId('65abc123...')",
  "companyName": "Google",
  "jobTitle": "Software Engineer (MERN Stack)",
  "jobDescription": "Building scalable web applications...",
  "location": "Bangalore (Hybrid)",
  "jobType": "Full-time",
  "status": "Interviewing",
  "salaryMin": 1200000,
  "salaryMax": 1800000,
  "salaryCurrency": "INR",
  "appliedDate": "2025-01-10T00:00:00.000Z",
  "interviewDate": "2025-01-20T09:00:00.000Z",
  "offerDeadline": null,
  "jobPortal": "LinkedIn",
  "jobUrl": "https://linkedin.com/jobs/12345",
  "contactName": "Rahul Verma",
  "contactEmail": "rahul.verma@google.com",
  "notes": "Strong React round expected. Prepare System Design.",
  "isPriority": true,
  "skills": ["React", "Node.js", "MongoDB", "System Design"],
  "resumeVersion": "v2-fullstack",
  "createdAt": "2025-01-10T08:45:00.000Z",
  "updatedAt": "2025-01-15T14:20:00.000Z"
}
```

---

## 🔐 Authentication Flow

```
Registration:
User submits name+email+password
         │
         ▼
Backend receives → validates → checks email uniqueness
         │
         ▼
bcrypt.hash(password, 12) → hashed password stored in DB
         │
         ▼
jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '7d' })
         │
         ▼
Token + user info sent back to frontend
         │
         ▼
localStorage.setItem('token', token)
         │
         ▼
User redirected to /dashboard

Login:
User submits email+password
         │
         ▼
User.findOne({ email }).select('+password')
         │
         ▼
bcrypt.compare(enteredPassword, hashedPassword)
         │
         ├─ Match → generate new JWT → return token
         └─ No Match → 401 Unauthorized

Subsequent Requests:
Every API call includes:
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
         │
         ▼
protect middleware:
jwt.verify(token, JWT_SECRET)
User.findById(decoded.id)
req.user = user
next() → route handler executes
```

---

## 📡 API Design Decisions

| Decision | Reasoning |
|----------|-----------|
| REST API | Simple, stateless, widely understood |
| JWT (not sessions) | Stateless, works well with mobile/SPA |
| MongoDB | Flexible schema for varying job fields |
| Mongoose | Validation, hooks, populate() |
| Separate controllers | Separation of concerns |
| Global error handler | Consistent error format |
| index.js router | Single import point |
| `select: false` on password | Security — never expose password hash |

---

## 🎨 Frontend Architecture

```
App.js (Root)
  │
  ├── AuthProvider (Context)
  │     └── Provides: user, token, login, logout, register
  │
  ├── Router
  │     ├── PublicRoutes (Login, Register)
  │     │     └── Redirect to /dashboard if already logged in
  │     │
  │     └── ProtectedRoutes (wrap with ProtectedRoute component)
  │           ├── /dashboard → Dashboard.js
  │           │     └── Fetches /api/jobs/stats
  │           ├── /jobs → JobList.js
  │           │     └── Fetches /api/jobs with filter params
  │           ├── /jobs/add → AddJob.js
  │           │     └── POST /api/jobs
  │           ├── /jobs/:id → JobDetail.js
  │           │     └── GET /api/jobs/:id
  │           ├── /jobs/:id/edit → EditJob.js
  │           │     └── GET + PUT /api/jobs/:id
  │           └── /profile → Profile.js
  │                 └── PUT /api/auth/profile
  │
  └── Toaster (react-hot-toast — global notifications)
```

---

## 🔄 State Management

| State Type | Where Stored | Why |
|-----------|-------------|-----|
| Auth (user, token) | React Context | Global, needed everywhere |
| Jobs list | Local state (useState) | Component-level |
| Form data | Local state (useState) | Component-level |
| Loading states | Local state (useState) | Component-level |
| JWT token | localStorage | Persist across page refresh |

---

## 🌐 Virtual Simulation

### Simulated User: "Ananya Desai" (Fresh Graduate)

She applies to 3 companies:

```
1. TCS — Software Engineer Trainee
   Status: Applied
   Applied: Jan 5, 2025
   Portal: Campus Placement

2. Infosys — Systems Engineer
   Status: Interviewing
   Applied: Jan 8, 2025
   Interview Date: Jan 25, 2025
   Notes: "Prepare aptitude and coding rounds"

3. Wipro — Junior Developer
   Status: Offer
   Applied: Jan 10, 2025
   Offer Deadline: Feb 1, 2025
   Salary: INR 3.5L - 4.5L
```

**Dashboard shows:**
- Total: 3
- Applied: 1, Interviewing: 1, Offer: 1
- Pie chart with 3 equal sections
- Upcoming interview: Infosys on Jan 25

She updates TCS status to "Rejected" after results.
Dashboard updates automatically. She can focus on Infosys.
