import { Request } from "express"
import { JwtPayload } from "jsonwebtoken"

export interface IUser{
  username:String,
  fullName:string,
  email:string,
  password:string,
}


export interface IUserModel extends IUser{
  _id:string,
  journal:string[]
}


export interface IEntry{
  title:string,
  text:string,
  date:string
}


export interface IEntryModel extends IEntry{
  _id:string,
  tags:string[],
  user:string
}


export interface CustomRequest extends Request{
  user?:JwtPayload|string,
}


export interface ITag{
  name:string,
}


export interface ITagModel extends ITag{
  _id:string
}

export interface IDeleteUserToken{
  user:string,
  token:string,
}
export interface IDeleteUserTokenModel extends IDeleteUserToken{
  _id:string
}

export interface IResetPassword{
  user:string,
  token:string
}
export interface IResetPasswordModel extends IResetPassword{
  _id:string
}