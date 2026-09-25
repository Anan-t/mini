const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.log("MONGODB_URI not configured. Running without MongoDB.");
            return;
        }

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB Atlas connected");
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        console.log("Server will continue running without MongoDB.");
    }
};

module.exports = connectDB;