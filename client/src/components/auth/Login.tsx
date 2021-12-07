import { useState } from 'react'
import "../../styles/login.css"
import "../../styles/custom.css"
import TextInput from '../reusable/TextInput'
import {Link} from "react-router-dom";
import userServices from '../../services/userServices';
import { LOCAL_STORAGE_NAME } from '../../utils/constants';
import { useNavigate } from 'react-router';


export default function Login() {
  const [username,setUsername]=useState<string>("");
  const [password,setPassword]=useState<string>("");
  const [errorMessage,setErrorMessage]=useState<string>("");

  const history=useNavigate();

  const login=async(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
    try{
      e.preventDefault();
      const user={
        username,
        password
      }
      const res=await userServices.loginUser(user);
      const myUser=res.data;
      await localStorage.setItem(LOCAL_STORAGE_NAME,JSON.stringify(myUser));
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
    }
  };

  return (
    <div className="login-form">
      <form>
        <h1 className="other-font" style={{textAlign:"center"}}>LOGIN</h1>
        <p className="error-message other-font">{errorMessage&&errorMessage}</p>
        <TextInput label="Username:" type="text" value={username} setValue={setUsername} minLength={4} maxLength={20}/>
        <TextInput label="Password:" type="password" value={password} setValue={setPassword} minLength={8} maxLength={15}/>
        <button onClick={login} className="submit" disabled={username===""||password===""}><span className="other-font" style={{zIndex:3,position:"relative"}}>LOGIN</span></button>
        <p className="other-font" style={{textAlign:"center",marginTop:"4px"}}>Need an account? <Link className="other-font link" to="/register">Sign up</Link></p>
      </form>
    </div>
  )
}
