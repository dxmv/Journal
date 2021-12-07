import {IUserModel} from "../types";
import * as mongoose from "mongoose";

const UserSchema=new mongoose.Schema({
  username:{type:String,unique:true,minlength:4,},
  fullName:{type:String,maxlength:40},
  email:{type:String,unique:true,minlength:11},
  password:{type:String},
  journal:[{type:mongoose.Schema.Types.ObjectId,ref:"Entry"}],
});

module.exports=mongoose.model<IUserModel>("User",UserSchema);