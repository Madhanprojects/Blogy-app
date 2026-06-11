require("dotenv").config();
const express=require("express");
const app=express();
const path=require("path");
const multer  = require('multer');
const cookieParser=require("cookie-parser");
//routes
const Comment=require("./models/comment");
const Blog=require("./models/blog");
const User=require("./models/user");
//models
const blogRouter=require("./routes/blog");
const authRouter=require("./routes/auth");
const userRouter=require("./routes/user");

//auth
const {validateToken}=require("./services/authentication")
const {Auth,Verify}=require("./middlewares/auth");
//DB connection
const mongoose=require("mongoose");
mongoose.connect(process.env.MONGODB_URL)
.then(()=>console.log("MongoDB connected"))
.catch((e)=>console.log("DB connection Failed"+e));

//middlewares
app.use(express.static(path.join(__dirname, "public")));//for storing using multer
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));


//SSR view engine
app.set("view engine","ejs");
app.set("views",path.resolve("./views"));

//routes initialised

app.use("/blog",Verify,blogRouter);
app.use("/user",Verify,userRouter);
app.use("/",Auth,authRouter);

const { sendOTP } = require("./services/mail");

const port=process.env.port;
app.listen(port,()=>{
    console.log(`server is running on port: ${port}`);
})