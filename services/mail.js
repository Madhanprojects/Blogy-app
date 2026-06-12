const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
);

oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN
});

async function sendOTP(email, otp) {
    try {
        const accessToken = await oauth2Client.getAccessToken();
        console.log("ACCESS TOKEN RECEIVED:", !!accessToken.token);
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken.token
            }
        });

        const info = await transporter.sendMail({
            from: process.env.EMAIL,
            to: email,
            subject: "Blogy Email Verification",
            text: `Your OTP is ${otp}`
        });

        console.log("MAIL SENT:", info.messageId);
    } catch (err) {
        console.error("MAIL ERROR:", err);
        throw err;
    }
}

module.exports = { sendOTP };