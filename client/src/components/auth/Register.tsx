import React, { useState } from 'react'
import TextInput from '../reusable/TextInput'
import "../../styles/login.css";
import "../../styles/custom.css";
import { IUser } from '../../../types';
import userServices from '../../services/userServices';
import { useNavigate } from 'react-router';
import { LOCAL_STORAGE_NAME } from '../../utils/constants';

export default function Register() {
  const [username,setUsername]=useState<string>("");
  const [fullName,setFullName]=useState<string>("");
  const [email,setEmail]=useState<string>("");
  const [password,setPassword]=useState<string>("");
  const [errorMessage,setErrorMessage]=useState<string>("");

  const history=useNavigate();

  const register=async(e:React.FormEvent<HTMLFormElement>):Promise<void>=>{
    e.preventDefault();
    try{
      const user={
        username,
        fullName,
        email,
        password
      }
      const registeredUser=await userServices.createUser(user);
      const res=await userServices.loginUser({username,password});
      if(res.status===202){
        const myUser=res.data;
        localStorage.setItem(LOCAL_STORAGE_NAME,JSON.stringify(myUser));
        history("/");
        window.location.reload();
      }
    }
    catch(err:any){
      if (err.response) {
        const data=err.response.data;
        if(data.msg){
          await setErrorMessage(data.msg);
        }
      }
      await setPassword("");
    }
  }

  return (
    <div className="login-form">
      <form onSubmit={register}>
        <h1 className="other-font" style={{textAlign:"center"}}>REGISTER</h1>
        <p className="error-message other-font">{errorMessage&&errorMessage}</p>
        <TextInput label="Username:" type="text" value={username} setValue={setUsername} minLength={4} maxLength={20}/>
        <TextInput label="Full name:" type="text" value={fullName} setValue={setFullName} maxLength={40}/>
        <TextInput label="Email:" type="email" value={email} setValue={setEmail}/>
        <TextInput label="Password:" type="password" value={password} setValue={setPassword} minLength={8} maxLength={15}/>
        <button className="submit" disabled={username===""||email===""||password===""}>
          <span className="other-font" style={{zIndex:3,position:"relative"}}>REGISTER</span>
        </button>
      </form>
    </div>
  )
}
