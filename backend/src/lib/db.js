const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();    

exports.connectDB = async () => {
    try {
        if(!process.env.MONGODB_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }
        const conn=await mongoose.connect(process.env.MONGODB_URI);
        console.log('conected to MongoDB:', conn.connection.host);
    } catch (error) {
        console.error('MongoDB connection failed:', error);
        process.exit(1); // Exit process with failure
    }
}