import { useEffect, useState } from "react";
import "../../styles/home.css";
import {ITag, JournalMap} from "../../../types";
import convert from "../../utils/convertJournal";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import tagServices from "../../services/tagServices";

export default function Filter({setMyJournal}:{setMyJournal:React.Dispatch<React.SetStateAction<JournalMap>>}) {
  const [title,setTitle]=useState<string>("");
  const [category,setCategory]=useState<string>("None");
  const [time,setTime]=useState<string>("none");
  const [categories,setCategories]=useState<ITag[]>([]);
  const journal=useSelector((state:RootState)=>state.journal).journal;

  useEffect(()=>{
    const getTags=async():Promise<void>=>{
      const res=await tagServices.getAll();
      await setCategories([...res,{name:"None",_id:"1"}]);
    };
    getTags();
  },[])

  useEffect(()=>{
    if(title!==""){
      const arr=convert(journal.filter(entry=>entry.title.startsWith(title)));
      setMyJournal(arr);
    }
    else{
      setMyJournal(convert(journal));
    }
  },[title,setMyJournal]);

  useEffect(()=>{
    if(time==="none"){
      setMyJournal(convert(journal));
      return;
    }
    else if(time==="day"){
      const arr=convert(journal.filter(entry=>{
        const day=entry.date.split("-")[0];
        return Number(day)===new Date().getDate();
      }));
      setMyJournal(arr);
      return;
    }
    else if(time==="month"){
      const arr=convert(journal.filter(entry=>{
        const month=entry.date.split("-")[1];
        return Number(month)===new Date().getMonth()+1;
      }));
      setMyJournal(arr);
      return;
    }
    else{
      const arr=convert(journal.filter(entry=>{
        const year=entry.date.split("-")[2];
        return Number(year)===new Date().getFullYear();
      }));
      setMyJournal(arr);
      return;
    }
  },[time,setMyJournal]);

  useEffect(()=>{
    if(category==="None"){
      setMyJournal(convert(journal));
    }
    else{
      const arr=convert(journal.filter(entry=>entry.tags.map(tag=>tag.name).includes(category)));
      setMyJournal(arr);
    }
  },[category,setMyJournal])


  return (
    <div className="filter">
      <h3 className="filter-label">Created</h3>
      <select className="filter-input" value={time} onChange={(e)=>setTime(e.target.value)}>
      <option value="none" className="filter-input">None</option>
        <option value="day" className="filter-input">This Day</option>
        <option value="month" className="filter-input">This Month</option>
        <option value="year" className="filter-input">This Year</option>
      </select>
      <h3 className="filter-label">Category</h3>
      <select className="filter-input" value={category} onChange={(e)=>setCategory(e.target.value)}>
        {categories.map(c=><option key={c._id} value={c.name} className="filter-input">{c.name}</option>)}
      </select>
      <h3 className="filter-label">Search</h3>
      <input value={title} onChange={(e)=>setTitle(e.target.value)} className="filter-input" type="text" placeholder="Search by title..."/>
    </div>
  )
}
