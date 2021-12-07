import {Model} from "mongoose";
import {IEntryModel, IUser, IUserModel} from "../types";
import * as bcrypt from "bcrypt";
const User:Model<IUserModel>=require("../models/User");
const Entry:Model<IEntryModel>=require("../models/Entry");
const ResetPassword=require("../models/ResetPassword");

const getAll=async():Promise<Model<IUserModel>[]>=>{
  return await User.find({}).populate("journal","title text date");
}


const getById=async(id:string):Promise<IUserModel|null>=>{
  try{
    const user=await User.findById(id).populate("journal","title text date");
    return user;
  }
  catch{
    return null;
  }
};


const createNewUser=async(user:IUser):Promise<IUserModel|null>=>{
  try{
    if(validateUser(user)){
      const newPassword=await bcrypt.hash(user.password,10);
      const newUser:Omit<IUserModel,"_id">={
        ...user,
        password:newPassword,
        journal:[],
      }
      const finalUser=await new User(newUser);
      await finalUser.save();
      return finalUser;
    }
    else{
      throw new Error("Invalid user information");
    }
  }
  catch{
    return null;
  }
};


const validateUser=(user:IUser):boolean=>{
  if(user.username.length<4||user.username.length>20){ return false; }
  if(user.password.length<8||user.password.length>15){ return false; }
  if(user.email.length<11||!user.email.includes("@")){return false;}
  return true;
}


const deleteUser=async(id:string):Promise<true|false>=>{
  try{
    const user=await User.findById(id);
    if(user.journal){
      for(let i=0;i<user.journal.length;i++){
        await Entry.findByIdAndDelete(user.journal[i]);
      }
    }
    await User.findByIdAndDelete(id);
    return true;
  }
  catch{
    return false;
  }
}


const editUser=async(id:string,user:IUser):Promise<IUserModel|null>=>{
  const dbUser=await User.findById(id);
  const correctPassword=user.password?await bcrypt.compare(user.password,dbUser.password):false;
  if(correctPassword){
    const newUser:Omit<IUserModel,"_id">={...user,journal:dbUser.journal,password:dbUser.password};
    const finalUser=await User.findByIdAndUpdate(id,newUser);
    return finalUser;
  }
  return null;
};


const changePassword=async(id:string,user:{username:string,password:string}):Promise<true|false>=>{
  const token=await ResetPassword.findOne({token:id});
  const dbUser=await User.findOne({username:user.username});
  if(!dbUser._id.equals(token.user)) { return false; }
  const newPassword=await bcrypt.hash(user.password,10);
  const finalUser=await User.findById(dbUser._id);
  finalUser.password=newPassword;
  await finalUser.save();
  return true;
}

export default {getAll,getById,createNewUser,deleteUser,editUser,changePassword};