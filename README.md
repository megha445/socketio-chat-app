# 💬 Real-Time Chat Application

A full-stack real-time chat application built with MERN stack, Socket.io, and Cloudinary. Features instant messaging, typing indicators, online status tracking, and profile picture uploads.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=flat&logo=socketdotio&logoColor=white)

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based login/signup with bcrypt password hashing
- 💬 **Real-Time Messaging** - Instant message delivery using Socket.io
- 👥 **Online Status** - See which users are online/offline in real-time
- ✍️ **Typing Indicators** - Know when someone is typing a message
- 📷 **Profile Pictures** - Upload and update profile pictures via Cloudinary
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 💾 **Message History** - Persistent chat history stored in MongoDB
- 🎨 **Theme Customization** - Multiple theme options with DaisyUI

## 🛠️ Tech Stack

**Frontend:**
- React 19
- Vite
- Zustand (State Management)
- Socket.io Client
- Axios
- TailwindCSS & DaisyUI
- React Router

**Backend:**
- Node.js
- Express.js
- Socket.io
- MongoDB & Mongoose
- JWT Authentication
- Bcrypt
- Cloudinary (Image uploads)
- Cookie Parser

## 🚀 Installation & Setup

### 🐳 Quick Start with Docker (Recommended)

**Prerequisites:**
- Docker Desktop installed ([Download here](https://www.docker.com/products/docker-desktop))
- MongoDB Atlas account
- Cloudinary account

**Steps:**

1. **Clone repository:**
```bash
git clone https://github.com/megha445/socketio-chat-app.git
cd socketio-chat-app
```

2. **Create `.env` file in root directory:**
```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

3. **Start with Docker:**
```bash
docker-compose up
```

4. **Open application:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

**Useful Docker Commands:**
```bash
# Stop containers
docker-compose down

# Rebuild after code changes
docker-compose up --build

# View logs
docker-compose logs -f

# Run in background
docker-compose up -d
```

---

### 💻 Manual Setup (Without Docker)

### Prerequisites
- Node.js v14 or higher
- MongoDB Atlas account
- Cloudinary account

### Step 1: Clone Repository
```bash
git clone https://github.com/megha445/socketio-chat-app.git
cd socketio-chat-app
```

### Step 2: Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in `backend/` folder:
```env
PORT=3000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

**Cloudinary Setup:**
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard
3. Copy Cloud Name, API Key, and API Secret
4. Paste them in `.env` file

Start backend:
```bash
npm run dev
```

### Step 3: Frontend Setup
Open new terminal:
```bash
cd frontend
npm install
```

Start frontend:
```bash
npm run dev
```

### Step 4: Open Application
Open [http://localhost:5173](http://localhost:5173) in your browser

## 📖 How to Use

1. **Sign Up** - Create account with full name, email, and password
2. **Login** - Enter credentials to access chat
3. **Select User** - Click on any user from the sidebar to start chatting
4. **Send Messages** - Type your message and press Enter or click send
5. **Upload Picture** - Go to Profile → Update profile picture
6. **Change Theme** - Go to Settings → Choose your preferred theme
7. **See Online Users** - Green dot indicates online users
8. **Typing Indicator** - See "typing..." when someone is typing

## 🧪 Testing

### Test with Two Browsers
1. **Open Chrome**: http://localhost:5173
2. **Open Firefox/Incognito**: http://localhost:5173
3. Sign up with different emails on each
4. Login both users
5. Select each other and start chatting
6. See real-time messages and typing indicators!

## 📂 Project Structure
```
socketio-chat-app/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Business logic
│   │   ├── lib/             # Database, Socket.io, Cloudinary, Utils
│   │   ├── middleware/      # JWT authentication
│   │   ├── models/          # User & Message schemas
│   │   ├── routes/          # API routes
│   │   └── index.js         # Entry point
│   ├── .env                 # Environment variables
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── lib/             # Axios setup
│   │   ├── pages/           # Page components
│   │   ├── store/           # Zustand stores
│   │   └── App.jsx          # Main app
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication:
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/check` - Check authentication status
- `PUT /api/auth/updateprofile` - Update profile picture

### Messages (Protected):
- `GET /api/messages/users` - Get all users
- `GET /api/messages/:id` - Get messages with specific user
- `POST /api/messages/send/:id` - Send message to user

## 🔧 Environment Variables

### Backend `.env`
| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | `3000` |
| MONGODB_URI | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster...` |
| JWT_SECRET | Secret key for JWT tokens | `your_secret_key` |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name | `your_cloud_name` |
| CLOUDINARY_API_KEY | Cloudinary API key | `123456789` |
| CLOUDINARY_API_SECRET | Cloudinary API secret | `your_secret` |
| NODE_ENV | Environment mode | `development` or `production` |
| CLIENT_URL | Frontend URL | `http://localhost:5173` |

## 🐛 Troubleshooting

**Problem: MongoDB connection failed**
- ✅ Check if MONGODB_URI is correct
- ✅ Ensure IP is whitelisted in MongoDB Atlas (Network Access → Allow from Anywhere)
- ✅ Verify database user has read/write permissions

**Problem: Socket connection failed**
- ✅ Check if backend is running on port 3000
- ✅ Verify CORS settings in `socket.js`
- ✅ Ensure CLIENT_URL matches frontend URL

**Problem: Images not uploading**
- ✅ Check Cloudinary credentials in `.env`
- ✅ Verify image size is under 10MB
- ✅ Check console for Cloudinary errors

**Problem: Cookies not working (401 errors)**
- ✅ Check if `withCredentials: true` is set in axios
- ✅ Verify CORS origin matches CLIENT_URL
- ✅ In production: Ensure `sameSite: 'none'` and `secure: true`

**Problem: Users not updating in real-time**
- ✅ Check Socket.io connection in browser console
- ✅ Verify Socket.io CORS configuration
- ✅ Ensure multiple tabs/browsers for testing

## 🙏 Acknowledgments

- Socket.io for real-time communication
- MongoDB for database
- Cloudinary for image hosting
- React team for amazing UI library
- TailwindCSS & DaisyUI for beautiful styling

## 👨‍💻 Author

**megha shaym**
- GitHub: [@megha445](https://github.com/megha445)
- Email: vattamvenkatasaimeghashyamredd@gmail.com

---

⭐ **If you found this project helpful, please give it a star!**