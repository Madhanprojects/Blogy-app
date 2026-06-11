const {Router}=require("express");
const User = require("../models/user");
const {createTokenForUser,validateToken}=require("../services/authentication");
const router=Router();
const { createHmac, hash } = require("crypto");
const { findOne } = require("../models/comment");
var Tried=false;
var logTried=false;
const PendingUser = require("../models/pendingUsers");
const { sendOTP } = require("../services/mail");
var verified=null;
var Strongpass=true;
const strongPassword =/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
router.get("/",(req,res)=>{
    verified=null;
    Tried=false;
    Strongpass=true;
    res.redirect("/signup");
})
router.get("/signup",(req,res)=>{
    
    if(res.locals.user)
    {
        res.redirect("/user/home");
    }
    else{
        res.render("signup",{Tried:Tried,Strongpass:Strongpass});
    }
    
});
router.post("/signup",async (req,res)=>{
    const {fullName,email,password}=req.body;
    const verEmail=await User.findOne({email:email});
    if(verEmail!=null&&email===verEmail.email)
    {
        Tried=true;
        return res.redirect("/signup");
    }
    else{
        if (strongPassword.test(password)) {
            const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const otpExpiry = new Date(
            Date.now() + 5 * 60 * 1000
        );

        await PendingUser.deleteOne({ email });

        await PendingUser.create({
            fullName,
            email,
            password,
            otp,
            otpExpiry
        });

        await sendOTP(email, otp);

        return res.redirect(`/verify?email=${email}`);
        } else {
            
            Strongpass=false;
            return res.redirect("/signup")
        }
        
    }
            
});
router.get("/verify", async (req,res)=>{
    Strongpass=true;
    const email = req.query.email;
    res.render("verify",{
        email:email,verified:verified
    });

});

router.post("/verify", async (req,res)=>{

    const { email, otp } = req.body;

    const pendingUser = await PendingUser.findOne({
        email
    });

    if(!pendingUser){
        verified="Verification request not found";
        return res.redirect(`/verify?email=${email}`);
        
    }

    if(pendingUser.otp !== otp){
        verified="OTP invalid";
        return res.redirect(`/verify?email=${email}`);
    }

    if(pendingUser.otpExpiry < Date.now()){
        verified="OTP expired";
        return res.redirect(`/verify?email=${email}`);
    }

    const user = await User.create({
        fullName: pendingUser.fullName,
        email: pendingUser.email,
        password: pendingUser.password
    });

    await PendingUser.deleteOne({
        email
    });

    const token = createTokenForUser(user);

    res.cookie("token", token,{
    httpOnly: true
});

    return res.redirect("/user/home");

});
router.get("/login",(req,res)=>{
    if(res.locals.user)
    {
        res.redirect("/user/home");
    }
    else{
        res.render("login",{logTried:logTried,Strongpass:Strongpass});
    }
});
router.post("/login",async (req,res)=>{
    const {email,password}=req.body;
    const user=await User.findOne({email});
    if(!user){
        logTried=true;
        res.redirect("/login");
    } 
    const hashedPassword = createHmac("sha256", user.salt)
                            .update(password)
                            .digest("hex");
    if(hashedPassword!=user.password){
        logTried=true;
        res.redirect("/login");
    } 
    else{
        const token=createTokenForUser(user);
        res.cookie("token",token,{
    httpOnly: true
});
        return res.redirect("/user/home");
    }
    
});

module.exports=router;
