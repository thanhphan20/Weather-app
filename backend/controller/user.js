import transport from "../config/nodemailer.js";
import dotenv from "dotenv";
import jwt from 'jsonwebtoken';
import User from "../model/User.js";

dotenv.config();

export const sendEmail = async (req, res) => {
    const confirmToken = jwt.sign(req.body.email, process.env.JWT_SECRET);
    const confirmLink = `${process.env.PROD_URL ? process.env.PROD_URL : process.env.LOCAL_URL}/${confirmToken}`;

    const mailOptions = {
        from: process.env.USER,
        to: req.body.email,
        subject: 'Confirm your email',
        html: `
            <p>Please click on the following link to verify your email address: </p>
            <a href="${confirmLink}">${confirmLink}</a>
        `
    };

    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            // alert('An error happend when sending confirm email');
            console.log('An error happend when sending confirm email: ', error);
        } else {
            // alert('A confirm email has been sent');
            console.log('A confirm email has been sent: ', info.response);
        }
    });
};

export const confirmEmail = async (req, res) => {
    const confirmToken = req.params.token;
    try {
        const decoded = jwt.verify(confirmToken, process.env.JWT_SECRET);
        const email = decoded;
        let user = await User.findOne({ email });
        if (!user) {
            const newUser = new User({ email: email, confirmed: true, subscribed: true });
            await newUser.save();
        }
        return res.status(200).json({ message: 'Email confirmed.' });
    } catch (error) {
        console.error('An error happend when confirm email:', error);
        return res.status(500).json({ message: 'An error happend when confirm email.' });
    }
};

export const checkEmailConfirmed = async (req, res) => {
    const email = req.body.email;
    try {
        const user = await User.findOne({ email, confirmed: true });
        if (user) {
            return res.status(200).json({ message: 'Email confirmed.' });
        } else {
            return res.status(201).json({ message: 'Email not confirmed.' });
        }
    } catch (error) {
        console.error('An error happend when checking', error);
        return res.status(500).json({ message: 'An error happend when checking.' });
    }
};

export const checkEmailSubscribed = async (req, res) => {
    const email = req.body.email;
    try {
        const user = await User.findOne({ email, subscribed: true });
        if (user) {
            return res.status(200).json({ message: 'Email subscribed.' });
        } else {
            return res.status(201).json({ message: 'Email not subscribed.' });
        }
    } catch (error) {
        console.error('An error happend when checking', error);
        return res.status(500).json({ message: 'An error happend when checking.' });
    }
};

export const unsubscribe = async (req, res) => {
    const email = req.body.email;
    try {
        const user = await User.findOneAndUpdate({ email }, { subscribed: false });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ message: 'Unsubscribed successfully' });
    } catch (error) {
        console.error('An error occurred while unsubscribing user:', error);
        return res.status(500).json({ message: 'An error occurred while unsubscribing user' });
    }
};