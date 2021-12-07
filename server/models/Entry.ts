import * as mongoose from "mongoose";
import { IEntryModel } from "../types";

const EntrySchema=new mongoose.Schema({
  title:{type:String,minlength:8,},
  text:{type:String,minlength:20},
  date:String,
  tags:[{type:mongoose.Schema.Types.ObjectId,ref:"Tag"}],
  user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
});

module.exports=mongoose.model<IEntryModel>("Entry",EntrySchema);