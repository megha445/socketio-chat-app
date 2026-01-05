const { User } = require('../models/user.model.js');
const { Message } = require('../models/message.model.js');
const cloudinary = require('../lib/cloudinary.js');
const { io, getReceiverSocketId } = require('../lib/socket.js');

exports.getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const users = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');
        
        // Get unread message counts for each user
        const usersWithUnreadCounts = await Promise.all(
            users.map(async (user) => {
                const unreadCount = await Message.countDocuments({
                    senderId: user._id,
                    receiverId: loggedInUserId,
                    isRead: false
                });
                
                return {
                    ...user.toObject(),
                    unreadCount,
                    lastSeen: user.lastSeen
                };
            })
        );
        
        res.status(200).json(usersWithUnreadCounts);
    } catch (error) {
        console.error("Error fetching users for sidebar:", error);
        res.status(500).json({ error: "Error fetching users" });
    }
}

exports.getMessagesByUserId = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;
        
        const messages = await Message.find({
            $or: [
                { senderId: senderId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 });

        // Mark messages as read when fetching them
        await Message.updateMany(
            {
                senderId: userToChatId,
                receiverId: senderId,
                isRead: false
            },
            {
                $set: { isRead: true }
            }
        );

        // Emit event to sender so they know their messages were read
        const senderSocketId = getReceiverSocketId(userToChatId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("messagesRead", { 
                readBy: senderId.toString() 
            });
        }

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error.message);
        res.status(500).json({ error: "Error fetching messages" });
    }
}

exports.sendMessage = async (req, res) => {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    try {
        let imageUrl;
        console.time("upload");
        if (image) {
            const uploadImage = await cloudinary.uploader.upload(image);
            imageUrl = uploadImage.secure_url;
        }
        console.timeEnd("upload");
        
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
            isRead: false
        });
        console.time("save");
        const savedMessage = await newMessage.save();
        console.timeEnd("save");
        // Emit to receiver with the new message
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", savedMessage);
        }
        console.time("response");
        res.status(201).json(savedMessage);
        console.timeEnd("response");

    } catch (error) {
        console.error("Error sending message:", error.message);
        res.status(500).json({ error: "Error sending message" });
    }
}