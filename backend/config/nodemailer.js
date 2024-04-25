import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();
const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    service: "gmail",
    auth: {
        user: process.env.USER,
        pass: process.env.PASS
    }
});

export default transport;