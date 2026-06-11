const mongoose=require("mongoose");
const {Schema,model}=require("mongoose");
const commentSchema=new Schema({
    content:{
        type: String,
        required: true,
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    blogid:{
        type:Schema.Types.ObjectId,
        ref:'blog'
    }
},{timestamps:true})
const comment=mongoose.model("comments",commentSchema);
module.exports=comment;