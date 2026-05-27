# 📅 Day-Wise Proof Building Strategy

---

## 🎯 Goal
Build the project in 7 days with clear commits, screenshots, and proof at each stage.

---

## 📆 DAY 1 — Frontend Setup + Auth Pages

### What to Do:
1. Create React app using `create-react-app`
2. Set up folder structure (components, pages, context, api)
3. Install packages: react-router-dom, axios, react-hot-toast, react-icons
4. Build `index.css` with design system
5. Create `Login.js` and `Register.js` pages
6. Create `AuthContext.js`

### Expected Output:
- Beautiful login/register UI visible at `localhost:3000`
- Dark-themed glassmorphism design

### Screenshots to Capture:
- 📸 Login page
- 📸 Register page

### Git Commit Messages:
```
git init
git add .
git commit -m "feat: initialize React project with routing and auth pages"
```

### Common Mistakes:
- ❌ Not installing react-router-dom
- ❌ Forgetting `BrowserRouter` wrapper in `index.js`

---

## 📆 DAY 2 — Backend Setup + Express Server

### What to Do:
1. Create `server/` folder
2. Initialize `npm init`
3. Install: express, mongoose, cors, dotenv, bcryptjs, jsonwebtoken, nodemon
4. Create `server.js` with Express setup
5. Create `config/db.js` for MongoDB connection
6. Create `.env` file (never commit!)
7. Test health check endpoint

### Expected Output:
- Terminal shows: `🚀 Server running on port 5000`
- `http://localhost:5000/api/health` returns JSON

### Screenshots to Capture:
- 📸 Terminal output with server running
- 📸 Browser showing health check response

### Git Commit:
```
git add .
git commit -m "feat: setup Express.js server with MongoDB connection and CORS"
```

### Common Mistakes:
- ❌ Committing `.env` file (add to `.gitignore` first!)
- ❌ Forgetting `require("dotenv").config()` at the top of server.js

---

## 📆 DAY 3 — Database Models

### What to Do:
1. Create `models/User.js` with full schema
2. Create `models/JobApplication.js` with all fields
3. Add validation, indexes, and pre-save hook for password hashing
4. Test models using MongoDB Compass

### Expected Output:
- MongoDB Compass shows `users` and `jobapplications` collections
- Schemas validated by Mongoose

### Screenshots to Capture:
- 📸 MongoDB Compass showing collections
- 📸 User schema in code

### Git Commit:
```
git add .
git commit -m "feat: create Mongoose schemas for User and JobApplication with validation"
```

### Common Mistakes:
- ❌ Forgetting `select: false` on password field
- ❌ Not hashing password before save (use pre-save hook!)

---

## 📆 DAY 4 — Authentication API

### What to Do:
1. Create `controllers/authController.js`
2. Create `routes/authRoutes.js`
3. Create `middleware/authMiddleware.js` (protect function)
4. Create `middleware/errorHandler.js`
5. Register routes in `server.js`
6. Test with Thunder Client / Postman:
   - POST `/api/auth/register`
   - POST `/api/auth/login`
   - GET `/api/auth/me` (with Bearer token)

### Expected Output:
- Register creates user in MongoDB
- Login returns JWT token
- Protected route works with token

### Screenshots to Capture:
- 📸 POST /register in Thunder Client (201 response with token)
- 📸 POST /login response with token
- 📸 GET /me with Authorization header
- 📸 MongoDB user document in Compass

### Git Commit:
```
git add .
git commit -m "feat: implement JWT authentication — register, login, protect middleware"
```

### Common Mistakes:
- ❌ Sending wrong Content-Type in Postman (set to `application/json`)
- ❌ Not including "Bearer " prefix before token in Authorization header

---

## 📆 DAY 5 — Job Application CRUD API + React Integration

### What to Do:
1. Create `controllers/jobController.js` with all CRUD functions
2. Create `routes/jobRoutes.js`
3. Connect frontend Axios to backend
4. Create `AddJob.js` page (form)
5. Create `JobList.js` page (fetch & display)
6. Test full flow: Login → Add Job → See in list

### Expected Output:
- Adding a job from React UI saves to MongoDB
- Job list shows all added applications

### Screenshots to Capture:
- 📸 Add Job form filled out
- 📸 Success toast notification
- 📸 Job appearing in the list
- 📸 MongoDB document with all fields

### Git Commit:
```
git add .
git commit -m "feat: implement Job Application CRUD — create, read, update, delete"
```

### Common Mistakes:
- ❌ CORS error — make sure backend has `cors()` middleware before routes
- ❌ Not including `{ params }` when passing query strings to Axios

---

## 📆 DAY 6 — Dashboard + Filters + UI Polish

### What to Do:
1. Create `Dashboard.js` with stats cards and charts
2. Implement search and filter in `JobList.js`
3. Implement pagination
4. Add status filter tabs
5. Create `JobDetail.js` view page
6. Create `EditJob.js` page
7. Create `Profile.js` page
8. Add `StatusBadge.js` component
9. Make responsive for mobile

### Expected Output:
- Dashboard shows real data from MongoDB
- Charts render with application breakdown
- Search and filters work in real-time

### Screenshots to Capture:
- 📸 Dashboard with charts
- 📸 Filter bar with different statuses selected
- 📸 Job detail page
- 📸 Edit form pre-filled

### Git Commit:
```
git add .
git commit -m "feat: add dashboard analytics, search/filter, pagination, and edit functionality"
```

---

## 📆 DAY 7 — GitHub Upload + Documentation

### What to Do:
1. Review all code, clean up console.logs
2. Create `.env.example` file
3. Ensure `.env` is in `.gitignore`
4. Write `README.md`
5. Take all screenshots
6. Create GitHub repository
7. Push code

### Git Commands:
```bash
# Initialize git (if not done)
git init

# Create GitHub repo first, then:
git remote add origin https://github.com/USERNAME/Job-Application-Tracker-Portal.git

# First push
git push -u origin main

# Future pushes
git add .
git commit -m "docs: add complete README, interview prep, and project documentation"
git push
```

### Screenshots to Capture:
- 📸 GitHub repo main page
- 📸 Commit history showing daily commits
- 📸 README rendered on GitHub

---

## 📊 Summary Table

| Day | Focus | Deliverable |
|-----|-------|-------------|
| 1 | Frontend + Auth UI | Login/Register pages visible |
| 2 | Backend + Server | API health check working |
| 3 | Database Models | MongoDB schema designed |
| 4 | Authentication | JWT auth API working |
| 5 | Job CRUD | Full CRUD from browser to DB |
| 6 | Dashboard + Filters | Charts and search working |
| 7 | GitHub + Docs | Repo live with README |
