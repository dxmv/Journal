import {Model} from "mongoose";
import {IDeleteUserToken,IResetPasswordModel,IUserModel} from "../types";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import {v1} from "uuid";
const DeleteToken=require("../models/DeleteToken");
const ResetPassword=require("../models/ResetPassword");

const createDeleteToken=async(user:IUserModel):Promise<any>=>{
  const token=await jwt.sign({username:user.username,email:user.email},process.env.SECRET);
  const newDelete:IDeleteUserToken={
    token,
    user:user._id
  }
  const final=await new DeleteToken(newDelete);
  await final.save();
  return final;
}

const checkValid=async(token:string,userId:string):Promise<boolean>=>{
  try{
    const dbToken=await DeleteToken.findOne({token:token});
    return dbToken.user==userId;
  }
  catch{
    return false;
  }
}

const createResetToken=async(user:IUserModel,password:{password:string}):Promise<any|null>=>{
  // Check if passwords match
  const correct=await bcrypt.compare(password.password,user.password);
  console.log(correct);
  if(!correct) return null;
  const newToken={
    user:user._id,
    token:v1()
  }
  const resetToken=await new ResetPassword(newToken);
  await resetToken.save();
  return resetToken;
}

export default {createDeleteToken,checkValid,createResetToken};