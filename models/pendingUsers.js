const { Schema, model } = require("mongoose");

const pendingUserSchema = new Schema({
    fullName: String,
    email: String,
    password: String,
    otp: String,
    otpExpiry: Date
}, {
    timestamps: true
});

module.exports = model(
    "pendingUsers",
    pendingUserSchema
);