import React from 'react';
import "../../styles/custom.css";

export default function CheckBox({text,value,setValue}:{text:string,value:boolean,setValue:React.Dispatch<React.SetStateAction<boolean>>}) {
  return (
    <div className="check-box">
      <input type="checkbox" checked={value} onChange={e=>setValue(prev=>!prev)}/>
      <p className="other-font check-box-text">{text}</p>
    </div>
  )
}
