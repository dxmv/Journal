import {useEffect, useState} from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { IUser } from '../../../types';
import TextInput from '../reusable/TextInput'
import userServices from '../../services/userServices';
import { useDispatch } from 'react-redux';
import { SET_USER } from '../../redux/userReducer';

export default function Edit() {
  const dispatch=useDispatch();
  const user=useSelector((state:RootState)=>state.user.user);

  const [username,setUsername]=useState<string>("");
  const [email,setEmail]=useState<string>("");
  const [password,setPassword]=useState<string>("");
  const [confirmPassword,setConfirmPassword]=useState<string>("");
  const [fullName,setFullName]=useState<string>("");
  const [errorMessage,setErrorMessage]=useState<string>("");

  useEffect(()=>{
    if(user){
      setUsername(user.username);
      setEmail(user.email);
      setFullName(user.fullName);
    }
  },[])


  const editUser=async(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
    e.preventDefault();
    setErrorMessage("");
    try{
      if(password!==confirmPassword){
        setPassword("");
        setConfirmPassword("");
        throw new Error("The passwords must match");
      }
      const newUser:Omit<IUser,"_id"|"journal">={
        username,
        fullName,
        email,
        password
      }
      if(user){
        const res=await userServices.editUser(user?._id,newUser);
        dispatch(SET_USER(res));
      }

    }
    catch(err:any){
      if (err.response) {
        const data=err.response.data;
        if(data.msg){
          await setErrorMessage(data.msg);
        }
      }
      else{
        await setErrorMessage(err.message);
      }
      await setPassword("");
      await setConfirmPassword("");
    }
  }
  console.log(errorMessage);
  return (
    <div className="user-window-component" id="user-form">
      <h2>Edit your account</h2>
      <p className="error-message other-font" style={{textAlign:"left"}}>{errorMessage&&errorMessage}</p>
      <TextInput label="Username:" type="text" value={username} setValue={setUsername} minLength={4} maxLength={20}/>
      <TextInput label="Email:" type="email" value={email} setValue={setEmail}/>
      <TextInput label="Full name:" type="text" value={fullName} setValue={setFullName}/>
      <TextInput label="Password:" type="password" value={password} setValue={setPassword} minLength={8} maxLength={15}/>
      <TextInput label="Confirm Password:" type="password" value={confirmPassword} setValue={setConfirmPassword} minLength={8} maxLength={15}/>
      <button onClick={editUser} style={{maxWidth:"60%"}} className="submit" disabled={username===""||email===""||fullName===""||password===""||confirmPassword===""}>
        <span className="other-font" style={{zIndex:3,position:"relative"}}>SAVE</span>
      </button>
    </div>
  )
}
