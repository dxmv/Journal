import * as mongoose from "mongoose";
import { IResetPasswordModel } from "../types";

const ResetPasswordSchema=new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
  token:{type:String,required:true}
});

ResetPasswordSchema.index({"createdAt": 1}, {expireAfterSeconds: 3600 });

module.exports=mongoose.model<IResetPasswordModel>("ResetPassword",ResetPasswordSchema);