# Production Issue Tracking System

A MERN Stack application to manage and track production issues in a manufacturing environment. The system allows Production Managers to report issues and Admins to monitor, update, and resolve them.

---

## Features

- User Login (Admin / Production Manager)
- Dashboard
- Add New Issue
- Edit Issue
- Delete Issue
- Update Issue Status
- Search Issues
- Filter by Category
- Responsive UI
- JWT Authentication
- MongoDB Database

---

## Tech Stack

### Frontend

- React
- React Router DOM
- Redux Toolkit
- Tailwind CSS
- React Icons
- React Toastify
- SweetAlert2

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Cookie Parser

---

# Installation

## 1. Clone the repository

```bash
git clone https://github.com/Asyedibrahim/issue-management.git
```

---

## 2. Install Dependencies

### Backend

```bash
npm install
```

### Frontend

```bash
cd frontend
npm install
```

---

## 3. Environment Variables

Create a `.env` file inside the **server** folder.

```env
MONGO_URI=mongodb://127.0.0.1:27017/production_issue_db

JWT_SECRET=your_secret_key
```

---

## 4. Start MongoDB

Make sure MongoDB is running on your machine.

---

## 5. Run the Backend

```bash
npm run dev
```

---

## 6. Run the Frontend

```bash
cd frontend
npm run dev
```

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:4100
```

---

# Folder Structure

```
Production-Issue-System/

client/
│
├── src
│   ├── components
│   ├── pages
│   ├── redux
│   ├── utils
│   └── App.jsx
│
server/
│
├── controllers
├── models
├── routes
├── utils
├── index.js
└── .env
```

---

# User Roles

## Admin

- View Dashboard
- View Issues
- Edit Issue
- Delete Issue
- Update Status

## Production Manager

- View Dashboard
- Create Issue
- View Issues

---

# Dashboard

The dashboard displays:

- Total Issues
- Open Issues
- In Progress Issues
- Resolved Issues

---

# API Endpoints

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/users/login` | Login User |

---

## Dashboard

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/dashboard/stats` | Dashboard Statistics |

---

## Issues

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/issue/search` | Get All Issues |
| POST | `/api/issue/create` | Create New Issue |
| PUT | `/api/issue/:id` | Update Issue |
| DELETE | `/api/issue/:id` | Delete Issue |

---

# Issue Schema

```javascript
{
    title: String,
    category: String,
    description: String,
    priority: String,
    machineName: String,
    reportedBy: String,
    status: String
}
```

---

# User Schema

```javascript
{
    email: String,
    password: String,
    role: "Admin" | "Production Manager"
}
```

---

# Default Status

```
Open
In Progress
Resolved
```

---

# Categories

Issue categories are managed dynamically from the database. Admin can create, update, and use categories without modifying the application code.

Examples of categories include:

- Machine Breakdown
- Quality Issue
- Raw Material
- Maintenance

> **Note:** These are sample categories. The available categories depend on the data stored in the database.

# Priority Levels

- Low
- Medium
- High

---

# Authentication

- JWT
- HTTP Only Cookies
- Protected Routes
- Role Based Authorization

---

# Future Improvements

- Issue Comments
- Assign Issues to Employees
- Email Notifications
- Charts & Analytics
- Issue Attachments
- Export Reports
- Activity Logs

---

# Author

**Syed Ibrahim**

GitHub:
https://github.com/Asyedibrahim