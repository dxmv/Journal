import React, { useState } from 'react'
import { IconType } from 'react-icons'

export default function DropDownMenu({icon,id}:{icon:React.ReactElement<any, any>,id:string}) {
  const [open,setOpen]=useState<boolean>(false);

  // document.addEventListener("click",()=>{
  //   if(open){
  //     setOpen(false);
  //   }
  // })

  return (
    <div onClick={()=>setOpen(prev=>!prev)} style={{position:"relative"}}>
      {icon}
      {open&&
      <div style={{position:"absolute",border:"1px solid black",width:"6rem",backgroundColor:"#f1faee",display:"flex",flexDirection:"column"}}>
        <a style={{borderBottom:"1px solid black",fontFamily:"Mohave, sans-serif",padding:"8px 5px",textDecoration:"none",color:"black"}} href={`/edit-entry/${id}`}>Edit</a>
        <a style={{fontFamily:"Mohave, sans-serif",padding:"8px 5px",textDecoration:"none",color:"black"}} href={`/delete-entry/${id}`}>Delete</a>
      </div>
      }
    </div>
  )
}
