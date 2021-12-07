import axios from "axios";
import { IMessage, IUser } from "../../types";
import { Token } from "../utils/getToken";
import { AxiosResponse } from "axios";
const URL="http://localhost:5000/api/users";

interface IChangePassword{
  password:string,
  username:string,
}

const getUser=async(id:string):Promise<IUser>=>{
  const res=await axios.get<IUser>(`${URL}/${id}`);
  return res.data;
}

const createUser=async(user:Omit<IUser,"_id"|"journal">):Promise<IUser>=>{
  const res=await axios.post<IUser>(URL,user);
  return res.data;
}

const deleteUser=async(id:string,deleteToken:string):Promise<IMessage>=>{
  const res=await axios.delete<IMessage>(`${URL}/${id}`,{data:{token:deleteToken}});
  return res.data;
}

const editUser=async(id:string,user:Omit<IUser,"_id"|"journal">):Promise<IUser>=>{
  const res=await axios.put<IUser>(`${URL}/${id}`,user);
  return res.data;
}

const changePassword=async(id:string,user:IChangePassword):Promise<IUser>=>{
  const res=await axios.patch<IUser>(`${URL}/${id}`,{username:user.username,password:user.password});
  return res.data;
}

const loginUser=async(user:{password:string,username:string}):Promise<AxiosResponse<Token, any>>=>{
  const res=await axios.post<Token>("http://localhost:5000/api/login",user);
  return res;
}

const getDeleteToken=async(token:string)=>{
  const res=await axios.get(`${URL}/deleteToken`,{
    headers:{
      Authorization:`bearer ${token}`
    }
  });
  return res.data;
}

const getResetToken=async(id:string,token:string,password:string)=>{
  const res=await axios.post(`${URL}/${id}/reset`,{password},{
    headers:{
      Authorization:`bearer ${token}`
    }
  });
  return res.data;
}

export default {getUser,createUser,deleteUser,editUser,changePassword,loginUser,getDeleteToken,getResetToken};