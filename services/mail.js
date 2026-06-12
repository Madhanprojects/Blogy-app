const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOTP(email, otp) {
    await resend.emails.send({
        from: "userv9796@gmail.com",
        to: email,
        subject: "Blogy Email Verification",
        text: `Your OTP is ${otp}`
    });
}

module.exports = { sendOTP };