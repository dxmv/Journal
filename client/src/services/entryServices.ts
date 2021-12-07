import axios from "axios";
import { IMessage, IUser,IJournal } from "../../types";
const URL="http://localhost:5000/api/entries";

const getEntries=async(token:string):Promise<IJournal[]>=>{
  const res=await axios.get(URL,{
    headers:{
      Authorization:`bearer ${token}`
    }
  });
  return res.data;
}

const getEntry=async(id:string,token:string):Promise<IJournal>=>{
  const res=await axios.get(`${URL}/${id}`,{
    headers:{
      Authorization:`bearer ${token}`
    }
  });
  return res.data;
}

const createEntry=async(entry:Omit<IJournal,"_id"|"user">,token:string):Promise<IJournal>=>{
  const res=await axios.post(URL,entry,{
    headers:{
      Authorization:`bearer ${token}`
    }
  });
  return res.data;
}

const deleteEntry=async(id:string,token:string):Promise<IMessage>=>{
  const res=await axios.delete(`${URL}/${id}`,{
    headers:{
      Authorization:`bearer ${token}`
    }
  });
  return res.data;
}

const editEntry=async(entry:Omit<IJournal,"_id"|"user">,id:string,token:string):Promise<IJournal>=>{
  const res=await axios.put(`${URL}/${id}`,entry,{
    headers:{
      Authorization:`bearer ${token}`
    }
  });
  return res.data;
}

const download=async(token:string):Promise<void>=>{
  axios
  .request({
    url:`${URL}/download`,
    method:"GET",
    responseType: 'blob',
    headers:{
      Authorization:`bearer ${token}`
    }
  })
  .then(({ data }) => {
    const downloadUrl = window.URL.createObjectURL(new Blob([data]));
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', 'file.docx'); //any other extension
    document.body.appendChild(link);
    link.click();
    link.remove();
  });
}

export default {getEntries,createEntry,deleteEntry,editEntry,getEntry,download};