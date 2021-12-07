import React,{useEffect, useState} from 'react'
import "../../styles/custom.css";


export default function TextInput({label,placeHolder,type,regex,value,setValue,minLength,maxLength,disabled}:
  {label:String,placeHolder?:string,regex?:string,type:string,value:string,setValue:React.Dispatch<React.SetStateAction<string>>,minLength?:number,maxLength?:number,disabled?:boolean}) {
  const [error,setError]=useState<boolean>(false);
  const [errorMessage,setErrorMessage]=useState<string>("");
  const validation=regex?new RegExp(regex):null;

  useEffect(()=>{
    if(value!==""){
      if(minLength&&value.length<minLength){
        setError(true);
        setErrorMessage(`This field must contain at least ${minLength} characters`);
      }
      else if(maxLength&&value.length>maxLength){
        setError(true);
        setErrorMessage(`This field can't be more than ${maxLength} characters`);
      }
      else{
        setError(false);
        setErrorMessage("");
      }
      if(regex&&validation){
        if(!validation.exec(value)){
          setError(true);
          setErrorMessage("This field is not in correct format");
        }
        else{
          setError(false);
          setErrorMessage("");
        }
      }
    }
  },[value,minLength,regex,validation]);

  const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>setValue(e.target.value);
  return (
    <div className="text-input">
      {label!==""&&<label className="other-font form-label">{label}</label>}
      {placeHolder?<input className="other-font form-text-input" type={type} value={value} placeholder={placeHolder} onChange={handleChange} disabled={disabled?true:false}/>:<input className="other-font form-text-input" type={type} value={value} onChange={handleChange} disabled={disabled}/>}
      {error&&<p className="other-font error">{errorMessage}</p>}
    </div>
  )

}
