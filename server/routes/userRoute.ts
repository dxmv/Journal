import * as express from "express";
import {Request,Response} from "express";
import userController from "../controllers/userController";
import {CustomRequest, IDeleteUserTokenModel, IUser} from "../types";
import tokenController from "../controllers/tokenController"
import  transporter from "../utils/email";
const userRoute=express.Router();

interface IChangePassword{
  username:string,
  password:string
}

// GET delete user token
userRoute.get("/deleteToken",async(req:CustomRequest,res,next)=>{
  try{
    if(req.user){
      const user:any=req.user;
      const dbUser=await userController.getById(user.id);
      const token:IDeleteUserTokenModel=await tokenController.createDeleteToken(dbUser);
      transporter.sendMail({
        from: 'dimitrijes1925@gmail.com',
        to: dbUser.email,
        subject: 'Delete your account',
        text: `To delete your account enter this token :${token.token}`
      })
      res.status(200).json({
        "msg":`Code was sent to the email: ${dbUser.email}`,
      })
    }
    else{
      res.status(401).json({
        "msg":"You must be logged in to do this"
      });
    }
  }
  catch(err){
    next(err);
  }
})


// GET all users
userRoute.get("/",async(req:Request,res:Response,next)=>{
  try{
    const users=await userController.getAll();
    res.status(200).json(users);
  }
  catch(err){
    console.log(err);
    next(err);
  }
});


// GET user by id
userRoute.get("/:id",async (req:Request,res:Response,next)=>{
  try{
    const user=await userController.getById(req.params.id);
    if(user==null){
      res.status(404).json({
        "msg":`There are no users with id: ${req.params.id}`,
      })
    }
    else{
      res.status(200).json(user);
    }
  }
  catch(err){
    next(err);
  }
});


// POST new user
userRoute.post("/",async(req:Request,res:Response,next)=>{
  try{
    const reqUser:IUser=req.body;
    const newUser=await userController.createNewUser(reqUser);
    if(newUser==null){
      res.status(400).json({
        "msg":"Invalid data was provided",
      })
    }
    else{
      const finalUser=await userController.getById(newUser._id);
      res.status(201).json(finalUser);
    }
  }
  catch(err){
    next(err);
  }
});

// POST create password reset
userRoute.post("/:id/reset",async(req:CustomRequest,res:Response,next)=>{
  try{
    const sentUser:any=req.user;
    if(sentUser&&sentUser.id==req.params.id){
      const user=await userController.getById(req.params.id);
      const requestPassword:{password:string}=req.body;
      const token=await tokenController.createResetToken(user,requestPassword);
      if(!token){
        res.status(401).json({
          "msg":"Invalid password",
        });
        return
      }
      transporter.sendMail({
        from: 'dimitrijes1925@gmail.com',
        to: user.email,
        subject: 'Delete your password',
        text: `To reset your password click this link : http://localhost:3000/reset/${token.token}`
      })
      res.status(200).json({
        "msg":`Code was sent to the email: ${user.email}`,
      })
    }
    else{
      res.status(401).json({
        "msg":"You aren't authorized to do this",
      })
    }
  }
  catch(e){
    next(e);
  }
});

// DELETE user
userRoute.delete("/:id",async(req:Request,res:Response,next)=>{
  try{
    const token:any=req.body;
    const valid=await tokenController.checkValid(token.token,req.params.id);
    if (!valid) {res.status(403).json({"msg":"The user id and token don't match"}); return}
    const success=await userController.deleteUser(req.params.id);
    if(success){
      res.status(202).json({
        "msg":`User with id: ${req.params.id} was deleted successfully`
      })
    }
    else{
      res.status(404).json({
        "msg":`User with id: ${req.params.id} wasn't found`
      })
    }
  }
  catch(err){
    next(err);
  }
});


// PUT edit user
userRoute.put("/:id",async(req:Request,res:Response,next)=>{
  try{
    const reqUser:IUser=req.body;
    const newUser=await userController.editUser(req.params.id,reqUser);
    if(newUser){
      const finalUser=await userController.getById(newUser._id);
      res.status(200).json(finalUser);
    }
    else{
      res.status(400).json({
        "msg":"Incorrect password"
      })
    }
  }
  catch(err){
    next(err);
  }
});


// PATCH change password
userRoute.patch("/:id",async(req:Request,res:Response,next)=>{
  try{
    const reqUser:IChangePassword=req.body;
    const newUser=await userController.changePassword(req.params.id,reqUser);
    if(newUser){
      res.status(200).json({
        "msg":"Password was changed",
      })
    }
    else{
      res.status(400).json({
        "msg":"The credentials are invalid"
      })
    }
  }
  catch(err){
    console.log(err);
    next(err);
  }
});



module.exports=userRoute;