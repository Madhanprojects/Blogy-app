const {Router}=require("express");
const User = require("../models/user");
const Comment=require("../models/comment");
const Blog=require("../models/blog")
const {createTokenForUser,validateToken}=require("../services/authentication");
const router=Router();
const multer=require("multer");
const { createHmac, hash } = require("crypto");
const cloudinary = require("../services/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "profile-images",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
});

const upload = multer({ storage });
router.get("/about",(req,res)=>{
    res.render("about");
})
router.get("/home",async(req,res)=>{
    const allBlogs=await Blog.find({});
    res.render("home",{user: res.locals.user,blogs: allBlogs});
})
router.get("/logout",(req,res)=>{
    res.clearCookie("token");
    res.redirect("/");
})
router.get("/profile/:id",async (req,res)=>{
    const id=req.params.id;
    const user=await User.findOne({_id:id});
    const blog=await Blog.findOne({createdBy:user._id});
    const nblogs=await Blog.countDocuments({createdBy:user._id});
    const nComments=await Comment.countDocuments({createdBy:user._id});
    console.log(res.locals.user);
    res.render("profile",{curr:user,allBlogs:nblogs,allComments:nComments,user:res.locals.user,blog:blog});
})
router.post('/edit-myprofile', upload.single('profileImage'), async function (req, res) {
    console.log(req.file);
    console.log(req.body);
  const { fullName } = req.body;
  if(req.file){
    await User.updateOne(
   { email: res.locals.user.email }, // Filter
   { 
      $set: { fullName: fullName,
        profileUrl:req.file.path
       },
   }
)
  }
  else if(!req.file&&fullName){
    await User.updateOne(
   { email: res.locals.user.email }, // Filter
   { 
      $set: { fullName: fullName,},
   }
)}
   

    return res.redirect("/user/home");
});
router.get("/edit/my-profile",async(req,res)=>{
    const id=res.locals.user._id;
    const user=await User.findOne({_id:id});
    res.render("editprofile",{user:user});
})
module.exports=router;
