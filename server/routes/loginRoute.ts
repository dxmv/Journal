import * as express from "express";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { IUserModel } from "../types";
import { Model } from "mongoose";
const User:Model<IUserModel>=require("../models/User");
const loginRoute=express.Router();

loginRoute.post("/",async(req,res,next)=>{
  try{
    const user:{username:string,password:string}=req.body;
    if(! (await User.exists({username:user.username}))) {
      res.status(401).json({
        "msg":"Invalid username"
      });
    }
    const dbUser=await User.findOne({username:user.username});
    const correct=await bcrypt.compare(user.password,dbUser.password);
    if(!correct){
      res.status(401).json({
        "msg":"Incorrect password"
      });
    }
    const userToken=JSON.stringify({
      username:user.username,
      id:dbUser._id
    });
    const token=await jwt.sign(userToken,process.env.SECRET);
    res.status(202).json({token,userToken:JSON.parse(userToken)});
  }
  catch(e){
    next(e);
  }
});

module.exports=loginRoute;