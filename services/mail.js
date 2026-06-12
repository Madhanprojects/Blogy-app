const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    family: 4,
    auth: {
        user: "userv9796@gmail.com",
        pass: process.env.pass
    }
});

async function sendOTP(email, otp){
    await transporter.sendMail({
        from: "userv9796@gmail.com",
        to: email,
        subject: "Blogy Email Verification",
        text: `Your OTP is ${otp}`
    });

}

module.exports = {
    sendOTP
};