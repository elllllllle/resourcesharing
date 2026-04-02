# ShareMate – Community Resource Sharing Platform

**Assessment 1.2 | IFN636 Software Life Cycle Management | QUT**

---

## Overview

ShareMate is a full-stack web application that enables community members to share resources such as tools, equipment, and household items. Users can browse, post, and manage resource listings, while administrators can oversee all listings and users through a dedicated admin panel.

---

## Public URL

**Backend API:** http://3.106.196.172:5001

---

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | elle_1@gmail.com | 123456 |
| Regular User | elle_2@gmail.com | 123456 |

> The Admin account has access to the Admin Panel, which displays all listings and all registered users.

---

## Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Deployment:** AWS EC2, PM2
- **CI/CD:** GitHub Actions

---

## Project Setup Instructions

### Prerequisites
- Node.js v18+
- npm
- MongoDB Atlas account (or local MongoDB)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/elllllllle/resourcesharing.git
cd resourcesharing
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001
```

Start the backend server:

```bash
npm start
```

The backend will run on `http://localhost:5001`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

The frontend will run on `http://localhost:3000`

### 4. Run Backend Tests

```bash
cd backend
npm test
```

Expected output: **10 passing**

---

## Project Structure

```
sampleapp_IFQ636/
├── .github/
│   └── workflows/
│       ├── ci.yml        # Backend CI - runs tests on push to main
│       └── deploy.yml    # CD - deploys to AWS EC2 on push to main
├── backend/
│   ├── controllers/      # resourceController.js, authController.js
│   ├── models/           # Resource.js, User.js
│   ├── middleware/       # auth.js, isAdmin.js
│   ├── routes/           # resource and auth routes
│   ├── test/             # example_test.js (Mocha/Chai/Sinon)
│   └── server.js
└── frontend/
    └── src/
        └── pages/        # BrowseListings, ListingDetail, Resources, AdminPanel, etc.
```

---

## Features

### User
- Register and log in securely (JWT authentication)
- Browse all community resource listings with search and category filter
- View detailed listing information
- Create, edit, and delete own resource listings
- View personal listings on a dedicated "My Listings" page

### Admin
- Access admin panel showing all listing details including title, category, posted by, posted date, and status
- Access admin panel showing all users registered on the system including joined date and last login

---

## CI/CD Pipeline

- **CI:** GitHub Actions automatically runs 10 backend unit tests on every push to `main`
- **CD:** On successful tests, GitHub Actions SSHs into the AWS EC2 instance and deploys the latest build using PM2

---

## Deployment

- **EC2 Public IP:** 3.106.196.172
- **Backend Port:** 5001
- **Process Manager:** PM2 (`sharemate-backend`)

---

## GitHub Repository

[https://github.com/elllllllle/resourcesharing](https://github.com/elllllllle/resourcesharing)
