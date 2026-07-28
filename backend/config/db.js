const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 3000 });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.warn(`Primary MongoDB Connection failed (${error.message}). Attempting local fallback...`);
        try {
            const localConn = await mongoose.connect("mongodb://127.0.0.1:27017/MaternityHub", { serverSelectionTimeoutMS: 3000 });
            console.log(`Fallback Local MongoDB Connected: ${localConn.connection.host}`);
        } catch (localErr) {
            console.warn("Database unavailable. Frontend and Backend will run with resilient default sample data.");
        }
    }
};

module.exports = connectDB;