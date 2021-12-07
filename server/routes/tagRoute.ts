import * as express from "express";
import tagController from "../controllers/tagController";
import { CustomRequest } from "../types";
const tagRoute=express.Router();


// GET all tags
tagRoute.get("/",async(req,res,next)=>{
  try{
    const tags=await tagController.getAll();
    res.status(200).json(tags);
  }
  catch(e){
    next(e);
  }
});


// POST new tag with verification (add ADMIN to .env file)
tagRoute.post("/",async(req:CustomRequest,res,next)=>{
  try{
    if(req.user)
    {
      const tag=await tagController.createNew(req.body,req.user);
      if(tag){
        const finalTag=await tagController.getTag(tag._id);
        res.status(201).json(finalTag);
      }
      else{
        res.status(403).json({
          "msg":"You aren't authorized to do this"
        })
      }
    }
    else{
      res.status(401).json({
        "msg":"You must be logged in to do this"
      })
    }
  }
  catch(e){
    next(e);
  }
})


// DELETE a tag with verification (add ADMIN to .env file)
tagRoute.delete("/:id",async(req:CustomRequest,res,next)=>{
  try{
    if(req.user)
    {
      const tag=await tagController.deleteTag(req.params.id,req.user);
      if(tag){
        res.status(202).json({
          "msg":`Tag with id ${req.params.id} was successfully deleted`
        });
      }
      else{
        res.status(403).json({
          "msg":"You aren't authorized to do this"
        })
      }
    }
    else{
      res.status(401).json({
        "msg":"You must be logged in to do this"
      })
    }
  }
  catch(e){
    next(e);
  }
})

module.exports=tagRoute
