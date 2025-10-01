# PeerConnect

A Peer Support Network for Mental Health Accessibility in Underserved Communities.

 PeerConnect is a web-based platform designed to connect individuals in underserved communities with supportive peers and resources. It provides a safe, user-friendly space where users can share experiences, access guidance, and find mental health support.

---

## 📌 Features

- **🔐 User Authentication** – Secure login and registration with JWT.
- **🧑‍🤝‍🧑 Peer Community** – Join community groups and share posts.
- **💬 Real-time Chat** – Peer-to-peer and group chat with WebSockets.
- **😊 Mood Tracking** – Users can log daily moods to improve self-awareness.
- **📊 Admin Dashboard** – Admins can manage users, posts, and flagged content.
- **🌓 Light/Dark Mode** – User-friendly interface with theme switching.
- **🔒 Privacy & Security** – GDPR-aligned data protection and secure storage.

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Context API (state management)
- Material UI (MUI)

### Backend
- Node.js & Express.js
- MongoDB (Mongoose ORM)
- JWT Authentication
- Socket.IO (real-time communication)

### Other Tools
- Git & GitHub (version control)
- Postman (API testing)
- Bcrypt (password hashing)

---

## 📂 Project Structure

```
PeerConnect/
├── backend/
│   ├── controllers/   # Handles app logic
│   ├── models/        # Mongoose schemas
│   ├── routes/        # API endpoints
│   ├── server.js      # Express server
│   └── config/        # Database & JWT config
│
├── frontend/
│   ├── public/        # Static assets
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # App pages (Home, Login, Register, etc.)
│   │   ├── context/    # Global state management
│   │   └── App.js      # Main React app
│
└── README.md
```

---

## ⚙️ Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/PeerConnect.git
   cd PeerConnect
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file with:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   PORT=5000
   ```

   Run the backend:
   ```bash
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```
   The frontend will run on `http://localhost:3000` and the backend on `http://localhost:5000`.

---

## 🧪 Testing

- API testing with Postman
- Manual user acceptance testing

---

## 📅 Project Development Timeline

- UI/UX Mockups
- Frontend & Backend Development
- UI Improvements
- Testing & Debugging
- Final Documentation
- Presentation

---

## 🔒 Data Privacy & Ethics

PeerConnect follows GDPR-aligned principles to ensure:
- User data protection
- Consent-based data collection
- Secure authentication and storage
- Right to privacy and account deletion

---

## 🤝 Contributing

Contributions are welcome! Please fork this repo and create a pull request with detailed explanations of your changes.

---

## 📜 License

MIT License — feel free to use and modify with attribution.

---

## 👨‍💻 Author

Thiwanka Lakmal Dissanayake

Software Engineering Undergraduate (Cardiff Metropolitan University)

Passionate about Full Stack Development & AI

--- 

If you’d like, I can tailor this README further (e.g., add setup commands for Docker, CI/CD workflow, contribution guidelines, or a quick start guide with environment-specific notes).
