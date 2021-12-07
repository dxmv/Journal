import React from 'react'
import { IJournal } from '../../../types'
import "../../styles/home.css"
import {HiOutlineDotsVertical} from "react-icons/hi";
import DropDownMenu from '../reusable/DropDownMenu';

export default function Entry({entry}:{entry:IJournal}) {
  return (
    <div className="journal-item">
      <div style={{display:"flex",justifyContent:"space-between"}}>
        <h2 style={{fontSize:"1.9rem"}}>{entry.title}</h2>
        <DropDownMenu icon={<HiOutlineDotsVertical style={{fontSize:"1.2rem"}}/>} id={entry._id}/>
      </div>
      <p className="journal-item-para">
        {entry.text}
      </p>
      <p style={{fontFamily:"Mohave, sans-serif",color:"#e63946"}}>
        Tags: {entry.tags.map((c,indx)=>indx===0?c.name:", "+c.name)}
      </p>
    </div>
  )
}
