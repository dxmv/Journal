import {Model} from "mongoose";
import {ITag,ITagModel} from "../types";
const Tag:Model<ITagModel>=require("../models/Tag");

const getAll=async()=>{
  return await Tag.find({});
};


const getTag=async(id:string)=>{
  return await Tag.findById(id);
}


const createNew=async(tag:ITag,user:any):Promise<ITagModel|null>=>{
  if(user.username===process.env.ADMIN){
    const newTag=await new Tag(tag);
    await newTag.save();
    return newTag;
  }
  return null;
}

const deleteTag=async(id:string,user:any):Promise<boolean>=>{
  try{
    if(user.username===process.env.ADMIN){
      await Tag.findByIdAndDelete(id);
      return true;
    }
      return false;
  }
  catch{
    return false;
  }
}

export default {getAll,getTag,createNew,deleteTag};