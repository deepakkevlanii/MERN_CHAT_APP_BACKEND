const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const path = require("path");
const app = express();
const colors = require("colors");

dotenv.config();
connectDB();

// Set CORS dynamically based on environment
const allowedOrigin = ['http://localhost:5173', 'https://talk-to-everyone.netlify.app'];

const corsOptions = {
  origin: allowedOrigin,
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// Middleware to set NODE_ENV based on request origin
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin === 'http://localhost:5173') {
    process.env.NODE_ENV = 'development';
  } else if (origin === 'https://talk-to-everyone.netlify.app') {
    process.env.NODE_ENV = 'production';
  }
  next();
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`.yellow.bold)
);

// Socket.io setup
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
    credentials: true,
  },
});
 
io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room", room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;
    if (!chat || !chat.users)
      return console.log("chat or chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) return;
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("disconnect", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
