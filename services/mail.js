const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "userv9796@gmail.com",
        pass: process.env.pass
    }
});
transporter.verify((err, success) => {
    if (err) {
        console.error("VERIFY ERROR:", err);
    } else {
        console.log("SMTP READY");
    }
});
async function sendOTP(email, otp) {
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