import React,{ useState,useEffect} from 'react'
import TextInput from '../reusable/TextInput'
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import {Multiselect} from "multiselect-react-dropdown";
import tagServices from '../../services/tagServices';
import { IJournal, ITag } from '../../../types';
import "../../styles/custom.css";
import "../../styles/entryForm.css";
import { formatDate } from '../../utils/formatDate';
import entryServices from '../../services/entryServices';
import getToken from "../../utils/getToken";
import { useDispatch } from 'react-redux';
import { ADD_ENTRY, EDIT_ENTRY } from '../../redux/journalReducer';
import {  useNavigate } from 'react-router';


export default function EntryForm({name,edit}:{name:string,edit:boolean}) {
  const [tags,setTags]=useState<ITag[]>([]);

  // FORM STATE
  const [title,setTitle]=useState<string>("");
  const [selectedTags,setSelected]=useState<ITag[]>([]);
  const [text,setText]=useState<string>("");
  const [errorMessage,setErrorMessage]=useState<string>("");

  // REDUX USER
  let user=useSelector((state:RootState)=>state.user.user);
  const dispatch=useDispatch();

  const history=useNavigate();

  useEffect(()=>{
    // GETTING ALL TAGS FOR SELECT LIST
    const getAllTags=async()=>{
      const res=await tagServices.getAll();
      setTags([...res]);
    }

    // FILL OUT THE FORM IF USER WANTS TO EDIT AN ENTRY
    const getEntry=async():Promise<void>=>{
      const id=window.location.href.split("/")[window.location.href.split("/").length-1 ];
      const token=getToken();
      if(token){
        const entry=await entryServices.getEntry(id,token.token);
        const owner:any=entry.user;
        if(owner._id!==token.userToken.id){
          setErrorMessage("You don't own this entry");
          setTimeout(()=>{
            window.history.back();
          },1000);
        }
        else{
          await setTitle(entry.title);
          await setText(entry.text);
          console.log(entry.tags);
          await setSelected(()=>[...entry.tags]);
          console.log(selectedTags);
        }
      }
      else{
        user=null;
      }
    };
    getAllTags();
    if(edit){
      getEntry();
    }
  },[]);

  const createNew=async(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
    try{
      e.preventDefault();
      const currentDate=new Date().toISOString();
      const entry:Omit<IJournal,"_id"|"user">={
        title,
        date:formatDate(currentDate.substring(0,10)),
        text,
        tags:selectedTags
      }
      const token=getToken();
      if(token){
        const res=await entryServices.createEntry(entry,token.token);
        await dispatch(ADD_ENTRY(res));
        history("/");
      }
    }
    catch(err:any){
      if (err.response) {
        const data=err.response.data;
        if(data.msg){
          await setErrorMessage(data.msg);
        }
      }
    }
  }

  const editEntry=async(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
    try{
      e.preventDefault();
      const currentDate=new Date().toISOString();
      const entry:Omit<IJournal,"_id"|"user">={
        title,
        date:formatDate(currentDate.substring(0,10)),
        text,
        tags:selectedTags
      }
      console.log(entry);
      const token=getToken();
      if(token){
        const id=window.location.href.split("/")[window.location.href.split("/").length-1 ];
        const res=await entryServices.editEntry(entry,id,token.token);
        await dispatch(EDIT_ENTRY(res,id));
        history("/");
      }
    }
    catch(err:any){
      if (err.response) {
        const data=err.response.data;
        if(data.msg){
          await setErrorMessage(data.msg);
        }
      }
    }
  }

  const handleSelect=(selectedList:ITag[], selectedItem:ITag)=>setSelected([...selectedList])

  const handleDelete=(selectedList:ITag[],selectedItem:ITag)=>{
    const arr=[...selectedTags];
    arr.splice(arr.findIndex(tag=>tag._id===selectedItem._id),1);
    setSelected([...arr]);
  };

  return (
    <div id="entry-form-page">     
      <form id="entry-form">
        {user
          ?
          <>
            <h1 className="other-font" style={{textAlign:"center"}}>{name}</h1>
            <p className="error-message other-font">{errorMessage&&errorMessage}</p>
            <TextInput label="Title" type="text" value={title} setValue={setTitle} minLength={8} maxLength={20}/>
            <div className="other-font" style={{marginTop:"1.6rem"}}>
              <label className="other-font form-label">Tags</label>
              <Multiselect
                selectionLimit={3}
                selectedValues={selectedTags} 
                options={tags} 
                displayValue="name" 
                placeholder="Tags..."
                onSelect={handleSelect}
                onRemove={handleDelete}
                style={{border:"3px solid black"}}
              />
            </div>
            <div style={{marginTop:"1.6rem",display:"flex",flexDirection:"column"}}>
              <label className="other-font form-label">Text</label>
              <textarea
                rows={10}
                minLength={20}
                style={{resize:"none",padding:"4px 2px",fontSize:"1rem",marginTop:"0.3rem",borderColor:"black"}}
                className="other-font form-input"
                onChange={(e)=>setText(e.target.value)}
                value={text}
              />
            </div>
            <button onClick={edit?editEntry:createNew} className="submit" disabled={title===""||selectedTags.length===0||text===""||text.length<20}>
                <span className="other-font" style={{zIndex:2,position:"relative"}}>SAVE</span>
            </button>
          </>
          :
          <p>You must be logged in to do this.</p>
        }
      </form>
      :
      
    </div>
  )
}
