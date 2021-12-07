import {Model} from "mongoose";
import {IEntry, IEntryModel,IUserModel,ITagModel, ITag} from "../types";
import { Document, Packer, Paragraph, HeadingLevel,AlignmentType,TextRun } from "docx";
import tagController from "./tagController";
import { Header } from "docx/build/file/header/header";
const Entry:Model<IEntryModel>=require("../models/Entry");
const User:Model<IUserModel>=require("../models/User");
const Tag:Model<ITagModel>=require("../models/Tag");
const fs=require("fs");
const bcrypt=require("bcrypt");


const getAll=async(user:any)=>{
  return await Entry.find({user:user.id}).populate("tags","name").populate("user","username email");
}


const getEntry=async(id:string):Promise<IUserModel>=>{
  return await Entry.findById(id).populate("tags","name").populate("user","username email");
};


const createNew=async(user:any,entry:Omit<IEntryModel,"user"|"_id">):Promise<IEntryModel|null>=>{
  const validEntry=await isValid(entry);
  if(validEntry){
    const tagIds=await convertTags(entry.tags);
    const newEntry:Omit<IEntryModel,"_id">={
      ...entry,
      user:user.id,
      tags:tagIds
    };
    const finalEntry=await new Entry(newEntry);
    await finalEntry.save();
    const dbUser=await User.findById(user.id);
    dbUser.journal=[...dbUser.journal,finalEntry._id];
    await dbUser.save();
    return finalEntry;
  }
  return null;
}

const deleteEntry=async(user:any,id:string):Promise<boolean>=>{
  try{
    const entry=await Entry.findById(id);
    if(entry.user!=user.id){
      return false;
    }
    await Entry.findByIdAndDelete(id);
    return true;
  }
  catch{
    return false;
  }
}

const editEntry=async(entry:Omit<IEntryModel,"user"|"_id">,id:string)=>{
  const dbEntry=await Entry.findById(id);
  dbEntry.title=entry.title;
  dbEntry.tags=entry.tags;
  dbEntry.text=entry.text;
  dbEntry.date=entry.date;
  await dbEntry.save();
  return dbEntry;
}


const isValid=async(entry:Omit<IEntryModel,"user"|"_id">):Promise<boolean>=>{
  const validTags=async(entryTags:any)=>{
    const tags=await (await tagController.getAll()).map(tag=>tag.name);
    const selectedTagNames=entryTags.map(tag=>tag.name);
    for(let i=0;i<selectedTagNames.length;i++){
      if(!tags.includes(selectedTagNames[i])){
        return false;
      }
    }
    return true;
  }

  if(entry.title.length<8){
    return false;
  }
  if(entry.text.length<20){
    return false;
  }
  if(entry.tags.length>3){
    return false;
  }
  const isValidTags=await validTags(entry.tags);
  if(!isValidTags){
    return false;
  }
  return true;
}

const convertTags=async(tags:any):Promise<string[]>=>{
  const arr:string[]=[];
  for(let i=0;i<tags.length;i++){
    arr.push(tags[i]._id);
  }
  return arr;
}

const createWordDocument=async(user:any,entries:IEntryModel[]):Promise<string>=>{
  // Hashing the file name
  let fileName=await bcrypt.hash(`${user.username}-${new Date().toLocaleString}`,10);
  fileName=fileName.replace(/[^a-zA-Z ]/g, "");
  const filePath=`word/${fileName}.docx`;

  // Converting entry properties to word text
  const paragraphs=[];
  for(let entry of entries){
    const header = new Paragraph({
      text: `${entry.title}\n${entry.date}`,
      heading: HeadingLevel.HEADING_1,
      alignment:AlignmentType.CENTER
    });
    const paragraph = new Paragraph({
      text: `${entry.text}`,
      alignment:AlignmentType.CENTER
    });
    paragraphs.push(header);
    paragraphs.push(paragraph);
  }

  // Creating new word document
  const doc = new Document({
    sections: [{
        properties: {},
        children: [...paragraphs],
    }],
  });

  // Saving the document
  const buffer=await Packer.toBuffer(doc);
  fs.writeFileSync(filePath, buffer);
  
  return filePath;
}

export default {getAll,createNew,getEntry,deleteEntry,editEntry,createWordDocument};