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
    const gmail = google.gmail({
        version: "v1",
        auth: oauth2Client
    });

    const message = [
        `To: ${email}`,
        `Subject: Blogy Email Verification`,
        "",
        `Your OTP is ${otp}`
    ].join("\n");

    const encodedMessage = Buffer.from(message)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    const res = await gmail.users.messages.send({
        userId: "me",
        requestBody: {
            raw: encodedMessage
        }
    });

    console.log("MAIL SENT:", res.data.id);
}

module.exports = { sendOTP };