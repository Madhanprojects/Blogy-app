const { Timestamp } = require("bson");
const { createHmac,randomBytes} = require('crypto');
const {Schema,model}=require("mongoose");
const userSchema=Schema({
    fullName:{
        type:  String,
        required: true,
    },
    email:{
        type: String,

        required: true,
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required: true,
    },
    profileUrl:{
        type:String,
        default: "https://res.cloudinary.com/dwiesfgni/image/upload/v1781207339/image_emrz1x.png",
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER",
    },
},
{timestamps:true},
)
userSchema.pre("save",function(){
    const user=this;
    if(!user.isModified("password")) return;
    const salt=randomBytes(16).toString("hex");
    const hashedPassword=createHmac('sha256', salt).update(user.password).digest("hex");
    this.salt=salt;
    this.password=hashedPassword;
})
const User = model("user", userSchema);
module.exports=User;