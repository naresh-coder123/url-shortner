
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import mongoose from "mongoose";
import app from "./App.js";


(async () => {
    try {
       
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_name}`);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
   
        app.listen(process.env.PORT || 8000, () => {
            console.log(`⚙️ Server is running at port : ${process.env.PORT}`);
        });

        app.on("error", (error) => {
            console.log("ERRR: ", error);
            throw error;
        });

    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1); // Stop the process if DB fails
    }
})();



