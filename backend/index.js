import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import mongoose from "mongoose";
import app from "./App.js";

// 1. Establish the Connection Logic
const connectDB = async () => {
    try {
        if (mongoose.connection.readyState >= 1) return; // Use existing connection

        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${process.env.DB_name}`
        );
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        // On serverless, we don't always want to kill the process immediately,
        // but for a URL shortener, we can't function without it.
        throw error; 
    }
};

// 2. Local Development Execution
// Vercel ignores this block; it only runs when you type 'npm run dev' locally
if (process.env.NODE_ENV !== 'production') {
    connectDB()
        .then(() => {
            app.listen(process.env.PORT || 8000, () => {
                console.log(`⚙️ Server is running at port : ${process.env.PORT || 8000}`);
            });
        })
        .catch((err) => {
            console.log("Initialization Failed", err);
        });
}

// 3. Export for Vercel
// This allows Vercel to treat 'app' as the entry point for Serverless Functions
export default async (req, res) => {
    await connectDB();
    return app(req, res);
};
