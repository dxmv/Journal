import { LOCAL_STORAGE_NAME } from "./constants";

export interface Token{
  userToken:{
    id:string,
    username:string
  },
  token:string
}

const getToken=():Token|null=>{
  const token=localStorage.getItem(LOCAL_STORAGE_NAME);
  return token?JSON.parse(token):null;
}

export default getToken;