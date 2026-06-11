const mongoose=require("mongoose");
const {Schema,model}=require("mongoose");
const blogSchema=new Schema({
    title: {
        type: String,
        required: true,
    },
    body:{
        type: String,
        required: true,
    },
    coverImage:{
        type: String,
        required: true,
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'user',
    },
},{timestamps:true})
const blog=mongoose.model("blogs",blogSchema);
module.exports=blog;