const { Server } = require('socket.io');
const http = require('http');
const express = require('express');
const { User } = require('../models/user.model.js');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.NODE_ENV === 'production'
            ? process.env.CLIENT_URL
            : 'http://localhost:5173',
        credentials: true,
    },
});

function getReceiverSocketId(userId) {
    return userSocketMap[userId] || null;
}

// Used to store online users
const userSocketMap = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    const userId = socket.handshake.query.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} connected with socket ID: ${socket.id}`);
        
        // Emit to ALL users that someone came online
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
        
        // Notify all other users to refresh their user list
        socket.broadcast.emit("userStatusChanged", {
            userId,
            status: "online"
        });
    }

    // Handle typing indicator
    socket.on('typing', (data) => {
        const receiverSocketId = getReceiverSocketId(data.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('userTyping', {
                senderId: userId,
                isTyping: true
            });
        }
    });

    socket.on('stopTyping', (data) => {
        const receiverSocketId = getReceiverSocketId(data.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('userTyping', {
                senderId: userId,
                isTyping: false
            });
        }
    });

    socket.on('disconnect', async () => {
        console.log('User disconnected:', socket.id);
        
        if (userId) {
            // Update lastSeen in database
            try {
                await User.findByIdAndUpdate(userId, {
                    lastSeen: new Date()
                });
            } catch (error) {
                console.error('Error updating lastSeen:', error);
            }

            delete userSocketMap[userId];
            
            // Emit to ALL users that someone went offline
            io.emit("getOnlineUsers", Object.keys(userSocketMap));
            
            // Notify all other users to refresh their user list
            io.emit("userStatusChanged", {
                userId,
                status: "offline"
            });
        }
    });
});

module.exports = { io, server, app, getReceiverSocketId };