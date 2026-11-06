# FixMate - PG & Hostel Maintenance Tracker

A modern full-stack MERN application for managing, tracking, and resolving PG (Paying Guest) and hostel maintenance issues efficiently.

---

## 🛠️ Tech Stack

### Frontend (`Frontend/`)
- **React.js (v18)** + **Vite**
- **Tailwind CSS** (Modern utility-first styling)
- **React Router DOM (v6)** (Role-based protected client routing)
- **Axios** (HTTP client with JWT request/response interceptors)
- **Lucide React** (Clean modern iconography)

### Backend (`Backend/`)
- **Node.js** + **Express.js** (REST API)
- **MongoDB** + **Mongoose** (Database schemas & relationships)
- **JSON Web Token (JWT)** + **bcryptjs** (Authentication & password security)
- **dotenv** & **cors**

---

## 📂 Project Architecture

```
FixMate/
├── Frontend/
│   ├── public/
│   │   ├── favicon.ico
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   ├── favicon-48x48.png
│   │   ├── android-chrome-192x192.png
│   │   ├── android-chrome-512x512.png
│   │   ├── apple-touch-icon.png
│   │   └── site.webmanifest
│   ├── src/
│   │   ├── assets/
│   │   │   ├── icon.png
│   │   │   └── logo.png
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ComplaintCard.jsx
│   │   │   ├── PublicFooter.jsx
│   │   │   └── DashboardFooter.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── Privacy.jsx
│   │   │   ├── Terms.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── resident/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── NewComplaint.jsx
│   │   │   │   ├── MyComplaints.jsx
│   │   │   │   └── ComplaintDetails.jsx
│   │   │   ├── staff/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   └── MyTasks.jsx
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Complaints.jsx
│   │   │       ├── Staff.jsx
│   │   │       └── Rooms.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── Backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Complaint.js
│   │   │   └── Room.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── complaintController.js
│   │   │   ├── userController.js
│   │   │   └── roomController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── role.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── complaintRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   └── roomRoutes.js
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── seed.js
│   │   └── viewDb.js
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🚀 Local Development Setup

### 1. Backend Setup (`Backend`)
```bash
cd Backend
npm install
npm run seed     # (Optional) Pre-populates demo accounts and sample complaints
npm run dev
```
- API will be live at `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`

#### Environment Variables (`Backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/fixmate
JWT_SECRET=your_jwt_secret_key_here
CLIENT_URL=http://localhost:5173
```

---

### 2. Frontend Setup (`Frontend`)
```bash
cd Frontend
npm install
npm run dev
```
- Client runs at `http://localhost:5173`

#### Environment Variables (`Frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🌐 Production Hosting Guide

### Option A: Hosting Frontend (Vercel / Netlify / Cloudflare Pages)
1. **Root Directory**: `Frontend`
2. **Build Command**: `npm run build`
3. **Output Directory**: `dist`
4. **Environment Variables**:
   - `VITE_API_URL`: `https://your-backend-domain.com/api`

### Option B: Hosting Backend (Render / Railway / Render / DigitalOcean)
1. **Root Directory**: `Backend`
2. **Build Command**: `npm install`
3. **Start Command**: `node src/server.js`
4. **Environment Variables**:
   - `PORT`: `5000` (or platform default)
   - `MONGO_URI`: `mongodb+srv://<user>:<password>@cluster.mongodb.net/fixmate` (MongoDB Atlas connection string)
   - `JWT_SECRET`: A secure random string
   - `CLIENT_URL`: `https://your-frontend-domain.com`

---

## 🔑 Key Features & User Roles

- **Resident**:
  - Submit maintenance requests with categories (plumbing, electrical, carpentry, cleaning, etc.) and priority.
  - Track complaint status (`pending`, `in-progress`, `resolved`, `rejected`) in real time.
- **Staff / Technician**:
  - View assigned hostel maintenance work orders.
  - Update status and add completion remarks directly from the dashboard.
- **Admin**:
  - Master control dashboard monitoring tickets, pending tasks, technicians, and rooms.
  - Assign maintenance tickets to technicians.
  - Add and manage hostel rooms and capacity.
