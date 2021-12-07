import React from 'react'
import { IJournal } from '../../../types'
import Entry from './Entry'
import "../../styles/home.css"
export default function EntryDateList({list,date}:{list:IJournal[],date:string}) {
  return (
    <>
    {list!==undefined&&    
    <div className="entry-date">
      <h1 style={{fontFamily:"Mohave, sans-serif"}}>{date}</h1>
      <div className="entry-list">
        {list.map(entry=><Entry key={entry._id} entry={entry}/>)}
      </div>
    </div>
    }
    </>
  )
}
