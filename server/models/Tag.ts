import * as mongoose from "mongoose";
import { ITagModel } from "../types";
const TagSchema=new mongoose.Schema({
  name:{type:String,unique:true}
});

module.exports=mongoose.model<ITagModel>("Tag",TagSchema);