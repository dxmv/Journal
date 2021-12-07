import React, { useEffect, useState } from 'react'
import { IJournal } from '../../../types';
import "../../styles/custom.css";
import "../../styles/entryForm.css";
import TextInput from '../reusable/TextInput';
import getToken from '../../utils/getToken'; 
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import entryServices from '../../services/entryServices';
import { useDispatch } from 'react-redux';
import { DELETE_ENTRY } from '../../redux/journalReducer';
import { useNavigate } from 'react-router';

export default function DeleteEntry() {
  const [entry,setEntry]=useState<IJournal|null>(null);
  const [name,setName]=useState<string>("");
  const user=useSelector((state:RootState)=>state.user.user);
  const dispatch=useDispatch();

  const history=useNavigate();

  useEffect(()=>{
    const getEntry=async()=>{
      try{
        const id=window.location.href.split("/")[window.location.href.split("/").length-1 ];
        const token=getToken();
        if(token){
          const res=await entryServices.getEntry(id,token.token);
          await setEntry({...res});
        }
      }
      catch(err){
        console.log("Invalid url");
      }
    };
    getEntry();
  },[])

  const deleteEntry=async(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
    e.preventDefault();
    const owner:any=entry?.user;
    const token=getToken();
    if(owner._id===user?._id&&token){
      const id=window.location.href.split("/")[window.location.href.split("/").length-1 ];
      const res=await entryServices.deleteEntry(id,token.token);
      await dispatch(DELETE_ENTRY(id));
      history("/");
    }
  }

  return (
    <div id="entry-form-page">     
      <form id="entry-form">
        {entry?
          <>
            <h2 className="other-font" style={{textAlign:"center"}}>Before you delete "{entry.title}" please confirm the name: </h2>
            <TextInput placeHolder="Name of the entry..." label="" type="text" value={name} setValue={setName}/>
            <button onClick={deleteEntry} className="submit" disabled={entry.title!==name}>
                <span className="other-font" style={{zIndex:2,position:"relative"}}>DELETE</span>
            </button>
          </>
        :
        <h1 className="other-font" style={{textAlign:"center"}}>The entry wasn't found</h1>
        }
        
      </form>
    </div>
  )
}
