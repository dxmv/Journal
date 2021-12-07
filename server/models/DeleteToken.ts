import * as mongoose from "mongoose";
import {IDeleteUserTokenModel } from "../types";

const TokenSchema=new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
  token:{type:String,required:true}
});

TokenSchema.index({"createdAt": 1}, {expireAfterSeconds: 3600 });

module.exports=mongoose.model<IDeleteUserTokenModel>("DeleteUserToken",TokenSchema);