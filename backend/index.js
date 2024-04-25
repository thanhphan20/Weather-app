import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import apiRoute from "./routes/route.js";

const app = express();
dotenv.config();

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to mongoDB.");
    } catch (error) {
        throw error;
    }
};

mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
});

app.use(cors())
app.use(express.json());

app.use("/api/", apiRoute);

app.listen(5000, async () => {
    connect();
    console.log("Connected to mongo.");
    console.log("http://localhost:5000/")
});