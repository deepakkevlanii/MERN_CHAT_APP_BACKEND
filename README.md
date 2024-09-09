# Chat App

This is a real-time chat application built using the **MERN stack** (MongoDB, Express, React, Node.js) with **WebSocket** for real-time communication, and **Tailwind CSS** for responsive design.

## Key Features

- **Real-time Messaging**: Implemented using WebSocket to enable instant communication between users.
- **Responsive UI**: Built with Tailwind CSS for a mobile-friendly and fast interface.
- **Authentication**: JSON Web Tokens (JWT) are used for secure authentication.
- **MERN Stack**: Utilizes MongoDB for database management, Express.js and Node.js for the backend, and React for the frontend.
- **MongoDB Atlas**: Hosted on MongoDB Atlas, a cloud-based NoSQL database service.
- **State Management**: React hooks and context for efficient state management.
- **WebSocket**: For real-time data transfer between client and server.

## Environment Variables

The application uses the following environment variables. Be sure to replace the dummy values with your actual credentials and secrets when deploying the app.

```bash
PORT=5000
MONGO_URI=mongodb+srv://dummyUser:dummyPassword@cluster0.example.mongodb.net/?retryWrites=true&w=majority&appName=chatApp
JWT_SECRET=SuperSecretKey
NODE_ENV=production
