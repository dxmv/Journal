import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import userServices from '../../services/userServices';
import { LOCAL_STORAGE_NAME } from '../../utils/constants';
import getToken from '../../utils/getToken';
import TextInput from '../reusable/TextInput';

export default function Account() {
  const [deleteToken,setDeleteToken]=useState<string>("");
  const [deleteUser,setDeleteUser]=useState<boolean>(false);
  const user=useSelector((state:RootState)=>state.user.user);

  const handleSend=async()=>{
    try{
      const token=getToken();
      if (token){
        const res=await userServices.getDeleteToken(token.token);
        setDeleteUser(true);
      }
    }
    catch(e){
      console.log(e);
    }
  }

  const handleDelete=async()=>{
    try{
      if(user){
        const deleted=await userServices.deleteUser(user._id,deleteToken);
        window.localStorage.removeItem(LOCAL_STORAGE_NAME);
        window.location.href="/";
        window.location.reload();
      }
    } 
    catch(e){
      console.log(e);
    }
  }

  return (
    <div className="user-window-component">
      {user?
        <>
          <h1>{user.username}</h1>
          <p className="side-text">ID: {user._id}</p>
          <div className="user-info">
          <p className="para">Full Name: {user.fullName}</p>
            <p className="para">Email: {user.email}</p>
            <p className="para">Journal entries: {user.journal.length}</p>
          </div>
          <div id="delete-account">
            <p className="para" style={{borderBottom:"1px solid black",marginBottom:"0.7rem"}}>ACCOUNT REMOVAL</p>
            {deleteUser?
            <form style={{width:"100%"}}>
              <p className="para">The mail with the code was sent to {user.email}</p>
              <TextInput label="Delete Token:" type="text" value={deleteToken} setValue={setDeleteToken}/>
              <button className="submit" onClick={handleDelete} disabled={deleteToken===""}>
                <span className="para" style={{zIndex:3,position:"relative"}}>DELETE ACCOUNT</span>
              </button>
            </form>
            :
            <>
              <p className="para">Do you want to delete your account?</p>
              <button className="submit" onClick={handleSend}>
                <span className="para" style={{zIndex:3,position:"relative"}}>DELETE ACCOUNT</span>
              </button>
            </>
            }
          </div>
        </>
      :
        <>
          Not logged in
        </>
      }

    </div>
  )
}
