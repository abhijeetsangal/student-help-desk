# 🎓 CampusAssist – Student Help Desk

**CampusAssist** is a web-based student help desk application designed to simplify communication between students and college administration. It provides an AI-powered chatbot for instant assistance and a query management system that allows students to raise issues and track their progress.

Built as a college mini-project using **React, Node.js, Express, MongoDB, and the Google Gemini API**.

## ✨ Features

### 👨‍🎓 Student
- **User Authentication:** Student registration and login.
- **AI Assistant:** Get instant answers to college-related questions using Google Gemini.
- **Submit Queries:** Raise questions or complaints through the platform.
- **Query Tracking:** View submitted queries and monitor their status.
- **Theme Support:** Switch between light and dark mode.

### 🛠️ Admin
- **Admin Dashboard:** View and manage student queries.
- **Query Management:** View all submitted student queries.
- **Status Updates:** Mark queries as Pending, In Progress, or Resolved.

## 🧰 Tech Stack

| Technology | Purpose |
|---|---|
| React + Vite | Frontend |
| Tailwind CSS | Styling |
| Node.js | Backend runtime |
| Express.js | REST API |
| MongoDB | Database |
| Mongoose | Database modeling |
| Google Gemini API | AI chatbot |
| JWT | Authentication |

## 📁 Project Structure

```text
student-help-desk/
├── client/                 # React frontend
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── AdminDashboard.jsx
│       │   ├── Chatbot.jsx
│       │   └── QuerySection.jsx
│       ├── App.jsx
│       └── index.css
├── server/                 # Express backend
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── scripts/
│       ├── app.js
│       └── server.js
├── .gitignore
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/abhijeetsangal/student-help-desk.git
cd student-help-desk
```

### 2. Set up the backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=your_gemini_model
CLIENT_URL=http://localhost:5173

ADMIN_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
```

Add your MongoDB connection string, Gemini API key, and other required values. Use a strong JWT secret and admin password.

### 3. Create the admin account

From the `server` directory, run:

```bash
node src/scripts/seedAdmin.js
```

Use the admin credentials configured in your environment variables.

### 4. Start the backend

```bash
npm run dev
```

The backend should run at `http://localhost:5000`.

### 5. Set up the frontend

Open a **new terminal** from the project root:

```bash
cd client
npm install
```

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

## 🔐 Environment Variables & Security

- Keep API keys, database credentials, and JWT secrets private.
- Never commit `.env` files to GitHub.
- The included `.gitignore` files should exclude environment files and dependency folders.

## 🚀 Possible Future Improvements

- Email notifications when query statuses change.
- A frequently asked questions section.
- File attachments for student queries.
- Basic analytics for administrators.

## 👨‍💻 Developer

**Abhijeet Sangal**

- GitHub: [@abhijeetsangal](https://github.com/abhijeetsangal)
- Repository: [student-help-desk](https://github.com/abhijeetsangal/student-help-desk)

---

⭐ If you find this project useful, consider giving the repository a star.
