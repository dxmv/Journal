import * as express from "express";
import {Request,Response} from "express";
import entryController from "../controllers/entryController";
import {CustomRequest, IEntry} from "../types";
const entryRoute=express.Router();

// GET download a word document
entryRoute.get("/download",async(req:CustomRequest,res,next)=>{
  try{
    if(req.user){
      const entries=await entryController.getAll(req.user);
      const file=await entryController.createWordDocument(req.user,entries);
      res.download(`D:/JAVA SCRIPT PROJECTS/Journal/server/${file}`);
    }
    else{
      res.status(401).json({
        "msg":"You must be logged in to do this"
      });
    }
  }
  catch(err){
    console.log(err);
    next(err);
  }
})

// GET all entries for a user
entryRoute.get("/",async(req:CustomRequest,res,next)=>{
  try{
    if(req.user){
      const entries=await entryController.getAll(req.user);
      res.status(200).json(entries);
    }
    else{
      res.status(401).json({
        "msg":"You must be logged in to do this"
      });
    }
  }
  catch(err){
    console.log(err);
    next(err);
  }
});

// GET one entry
entryRoute.get("/:id",async(req:CustomRequest,res,next)=>{
  try{
    if(req.user){
      const entry=await entryController.getEntry(req.params.id);
      res.status(200).json(entry);
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


// POST create a new entry
entryRoute.post("/",async(req:CustomRequest,res,next)=>{
  try{
    if(req.user){
      const entry=await entryController.createNew(req.user,req.body);
      if(entry){
        const finalEntry=await entryController.getEntry(entry._id);
        res.status(202).json(finalEntry);
      }
      else{
        res.status(400).json({
          "msg":"Bad input"
        })
      }
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
});


// DELETE delete a entry
entryRoute.delete("/:id",async(req:CustomRequest,res,next)=>{
  try{
    if(req.user){
      const success=await entryController.deleteEntry(req.user,req.params.id);
      if(success){
        res.status(200).json({
          "msg":`Entry ${req.params.id} was deleted successfully`,
        })
      }
      else{
        res.status(403).json({
          "msg":"You are not authorized to do this"
        })
      }
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
});


// PUT change a entry
entryRoute.put("/:id",async(req:CustomRequest,res,next)=>{
  try{
    if(req.user){
      const entry=await entryController.editEntry(req.body,req.params.id);
      const finalEntry=await entryController.getEntry(entry._id);
      res.status(202).json(finalEntry);
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
});



module.exports=entryRoute;