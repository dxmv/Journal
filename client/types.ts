export interface IJournal{
  title:string,
  text:string,
  date:string,
  _id:string,
  tags:ITag[],
  user:string
}


export interface JournalMap{
  [key:string]:IJournal[],
}


export interface IUser{
  username:string,
  fullName:string,
  email:string,
  password:string,
  _id:string,
  journal:string[]
}


export interface ITag{
  name:string,
  _id:string
}

export interface IMessage{
  msg:string
}
