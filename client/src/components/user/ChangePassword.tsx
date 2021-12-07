import {useState} from 'react'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import userServices from '../../services/userServices';
import getToken from '../../utils/getToken';
import TextInput from '../reusable/TextInput';
export default function ChangePassword() {
  const [password,setPassword]=useState<string>("");
  const user=useSelector((state:RootState)=>state.user.user);
  const [errorMessage,setErrorMessage]=useState<string>("");
  const [sent,setSent]=useState<boolean>(false);

  const reset=async(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
    e.preventDefault();
    try{
      const token=getToken();
      if(!user||!token){
        setErrorMessage("You aren't authorized for this");
        window.location.href="";
        return;
      }
      const res=await userServices.getResetToken(user._id,token.token,password);
      setSent(true);
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
    <div className="user-window-component">
      <h2>Change your password</h2>
      {!sent?
      <>
        <p className="para">Please confirm your password before you continue</p>
        <p className="error-message other-font">{errorMessage&&errorMessage}</p>
        <TextInput label="" placeHolder="Password..." type="password" value={password} setValue={setPassword} minLength={8} maxLength={15}/>
        <button onClick={reset} className="submit" disabled={password===""}>
            <span className="other-font" style={{zIndex:3,position:"relative"}}>SEND ME THE LINK</span>
        </button>
      </>:
      <>
      <p className="para">Please check your email</p>
      </>
      }

    </div>
  )
}
