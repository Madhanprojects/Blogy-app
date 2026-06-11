const {Router}=require("express");
const multer=require("multer");
const router=Router();
const User=require("../models/user");
const Blog=require("../models/blog");
const Comment=require("../models/comment");
const cloudinary = require("../services/cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "blog-images",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
});

const upload = multer({ storage });
router.get("/edit-Blog/:id", async (req, res) => {
    const id=req.params.id;
    const blog = await Blog.findOne({
        _id: id
    });
    console.log(blog);
    console.log(res.locals.user._id);
    user=res.locals.user;
    if (!blog) {
        return res.redirect("/");
    }
    if((blog.createdBy.toString()===res.locals.user._id.toString())||user.role==='ADMIN') res.render("editBlog", { blog });
    else{
        return res.redirect("/")
    }
    
});
router.post("/edit-Blog/:id",upload.single("coverImage"),
    async (req, res) => {

        const blog = await Blog.findById(req.params.id);
        
        if (!blog) {
            return res.redirect("/");
        }
        const user=res.locals.user;
        if ((blog.createdBy.toString() !== res.locals.user._id.toString())&&user.role==='USER') {
            return res.redirect("/");
        }

        const updateData = {
            title: req.body.title,
            body: req.body.body
        };

        if (req.file) {

            updateData.coverImage = req.file.path;
        }
        if (updateData.coverImage.toLowerCase().includes(".jpg")||updateData.coverImage.toLowerCase().includes(".webp")||updateData.coverImage.toLowerCase().includes(".png")||updateData.coverImage.toLowerCase().includes(".jpeg")) {
            await Blog.updateOne(
            { _id: blog._id },
            {
                $set: updateData
            }
        );
        const curruser=res.locals.user;

        return res.redirect(`/user/profile/${curruser._id}`);
        }   
        return res.redirect(`/user/edit-Blog/${blog._id}`);

        
    }
);
router.get("/add-blog",(req,res)=>{
    res.render("addBlog");
})
router.post('/add-blog', upload.single('coverImage'), async function (req, res) {
  const { title, body } = req.body;
    await Blog.create({
        title,
        body,
        coverImage: req.file.path,
        createdBy: res.locals.user._id
    });

    return res.redirect("/");
});
router.get("/view-user-blogs/:id",async(req,res)=>{
    const id=req.params.id;
    const user=await User.findOne({_id:id});
    const userBlogs=await Blog.find({createdBy:user.id});
    res.render("userBlogs",{curr:user,userBlogs:userBlogs});
})
router.get("/comment/:id",async (req,res)=>{
    const id=req.params.id;
    const blog=await Blog.findOne({_id:id});
    const blogComments=await Comment.find({blogid:id}).populate("createdBy");
    console.log(blogComments);
    res.render("comment",{comments:blogComments,blog:blog});
})
router.post("/comment/:id",async(req,res)=>{
    const id=req.params.id;
    const {content}=req.body;
    const blog=await Blog.findOne({_id:id});
    await Comment.create({
        content,createdBy:res.locals.user._id,blogid:blog.id
    });
    return res.redirect(`/blog/comment/${id}`);
})
router.get("/:id",async(req,res)=>{
    const id=req.params.id;
    const blog=await Blog.findOne({_id:id});
    const curr=await User.findOne({_id:blog.createdBy});
    const nComments=await Comment.countDocuments({blogid:blog.id});
    return res.render("viewBlog",{blog:blog,curr:curr,n:nComments});
})
router.get("/delete/:id",async (req,res)=>{
    const blog=await Blog.findOne({_id:req.params.id});
    const curr=await User.findOne({_id:blog.createdBy});
    const user=res.locals.user;
    if((curr._id.toString()===user._id.toString())||(user.role==='ADMIN')){
        await Blog.deleteOne({_id:req.params.id});
    }
    return res.redirect(`/blog/view-user-blogs/${user._id}`)
})

module.exports=router;