import express from "express";
import { sendEmail, confirmEmail, checkEmailConfirmed, unsubscribe, checkEmailSubscribed } from "../controller/user.js";
import { forecastWeather } from "../controller/weather.js";
const router = express.Router();

router.post('/checkConfirmed', checkEmailConfirmed);
router.post('/checkSubscribed', checkEmailSubscribed);
router.post('/send', sendEmail);
router.patch('/confirm-email/:token', confirmEmail);
router.post('/unsubscribe', unsubscribe);
router.post('/forecast/:city', forecastWeather);

export default router;