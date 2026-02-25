🚀 SmartERP – ERP Management System (Full Stack)
SmartERP is a full-stack ERP (Enterprise Resource Planning) web application built using the MERN stack (MongoDB, Express, React, Node.js).
It supports role-based access control (Admin, Sales, User) and manages core business modules like Products, Customers, Sales Orders, Purchase Orders, GRN, Invoices, and Dashboard analytics.

🌐 Live Demo (Frontend):
👉 https://erp-management-system-three.vercel.app

Login access(for demo):
Admin:
Email:admin@gmail.com
Password:123456

Sales:
Email:sales@gmail.com
Password:123456

User:
Email:user@gmail.com
Password:123456

🛠️ Backend API:
👉 https://erp-management-system-071t.onrender.com

✨ Features
🔐 Authentication & Authorization
Login & Register

Forgot Password

JWT-based authentication

Role-based access control:

Admin – Full access

Sales – Sales Orders, Customers, Invoices (Create only)

User (Inventory) – Products, Purchase Orders, GRN

📊 Dashboard (Real-time)
Total Products

Total Customers

Sales Orders

Purchase Orders

GRNs

Invoices

Revenue Graph (Monthly)

Low Stock Alerts

📦 Product Management
Create / Edit products

Stock tracking

Low-stock alerts on dashboard

Delete only for Admin

👥 Customer Management
Add / Edit customers (Admin, Sales)

Delete customers (Admin only)

🧾 Sales Orders
Create & update sales orders (Admin, Sales)

Delete (Admin only)

Status tracking

🛒 Purchase Orders
Create purchase orders (Admin, User)

Status updates (Pending, Approved, Received)

Link Purchase Orders to GRN

🚚 GRN (Goods Received Note)
Create GRN linked to Purchase Orders

Update GRN (Admin, User)

Delete GRN (Admin only)

💳 Invoice Management
Create invoices (Admin, Sales)

Edit/Delete invoices (Admin only)

PDF Invoice download

Auto update Sales Order status to “Invoiced”

🧑‍💻 Tech Stack
Frontend

React

Axios

React Router

Recharts (Charts)

CSS

Backend

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

PDFKit (Invoice PDF)

Deployment

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas

⚙️ Environment Variables
Backend (backend/.env)
PORT=10000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
Frontend (Vercel → Environment Variables)
REACT_APP_API_URL=https://erp-management-system-071t.onrender.com
🛠️ Local Setup
1️⃣ Clone Repository
git clone https://github.com/FayazBalajipeta/ERP-Management-System.git
cd ERP-Management-System
2️⃣ Backend Setup
cd backend
npm install
npm run dev
3️⃣ Frontend Setup
cd frontend
npm install
npm start
Frontend: http://localhost:3000
Backend: http://localhost:5000

🔑 Sample Roles
Role	Permissions
Admin	Full access
Sales	Sales Orders, Customers, Create Invoice
User (Inventory)	Products, Purchase Orders, GRN
📸 Screenshots (Optional – add later)
Login Page

Dashboard

Products

GRN

Invoice

🚀 Deployment
Frontend deployed on Vercel

Backend deployed on Render

Database hosted on MongoDB Atlas

📚 Learning Outcomes
Full-stack MERN development

JWT authentication & role-based access control

REST API design

MongoDB aggregation (Dashboard stats)

Production deployment (Vercel + Render)

Real-time dashboard updates

CORS & environment variable management

👨‍💻 Author

Fayaz Balajipeta
GitHub: https://github.com/FayazBalajipeta

⭐ Support

If you like this project, please give it a ⭐ on GitHub!
This helps others discover the project and supports my work 🙌
