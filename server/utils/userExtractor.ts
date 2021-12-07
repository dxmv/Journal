
/*
  This middleware extracts the user from the Authorization request header
  In format:"bearer -token"
*/

import * as jwt from "jsonwebtoken";
import { CustomRequest } from "../types";
const userExtractor=async(req:CustomRequest,res,next)=>{
  try{
    const header=req.headers.authorization;
    if(header){
      const token=header.split(" ")[1];
      const decodedToken=await jwt.verify(token,process.env.SECRET);
      req.user=decodedToken;
    }
    next();
  }
  catch(err){
    next(err);
  }
}
export default userExtractor;