import mongoose from "mongoose";

const userModel = new mongoose.Schema({

    username:{
      type:String,
      required:true,
      unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
      },
    password:{
        type:String,
        required:true
    },
    profilePhoto:{
        type:String,
        default:""
    },
    gender:{
        type:String,
        enum:["male", "female"],
        required:true
    },
    bio: { type: String, default: '' },
    resetOTP: { type: String },
    otpExpiry: { type: Date },
    status: { type: String, default: '' },
    statusUpdatedAt: { type: Date }

}, {timestamps:true});
export const User = mongoose.model("User", userModel);