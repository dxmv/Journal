import React, { useEffect, useState } from 'react'
import TextInput from '../reusable/TextInput'
import CheckBox from '../reusable/CheckBox';
import userServices from '../../services/userServices';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import getToken from '../../utils/getToken';
import { useDispatch } from 'react-redux';
import { SET_USER } from '../../redux/userReducer';

export default function ResetPassword() {
  const dispatch=useDispatch();
  const [errorMessage,setErrorMessage]=useState<string>("");
  const [username,setUsername]=useState<string>("");
  const [password,setPassword]=useState<string>("");
  const [confirm,setConfirm]=useState<string>("");


  const reset=async(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
    e.preventDefault();
    try{
      const user={
        username,
        password
      };
      const res=await userServices.changePassword(window.location.href.split("/")[4],user);
      dispatch(SET_USER(res));
      window.location.href="/";
    }
    catch(err:any){
      if (err.response) {
        const data=err.response.data;
        if(data.msg){
          await setErrorMessage(data.msg);
        }
      }
      await setPassword("");
      await setConfirm("");
    }
  }

  return (
    <div className="login-form">
      <form>
        <h1 className="other-font" style={{textAlign:"center"}}>CHANGE PASSWORD</h1>
        <p className="error-message other-font">{errorMessage&&errorMessage}</p>
        <TextInput label="Username:" type="text" value={username} setValue={setUsername} minLength={4} maxLength={20}/>
        <TextInput label="Password:" type="password" value={password} setValue={setPassword} minLength={8} maxLength={15}/>
        <TextInput label="Confirm Password:" type="password" value={confirm} setValue={setConfirm} minLength={8} maxLength={15}/>
        <button onClick={reset} className="submit" disabled={username===""||password===""||password!=confirm}>
          <span className="other-font" style={{zIndex:3,position:"relative"}}>SAVE</span>
        </button>
      </form>
    </div>
  )
}
