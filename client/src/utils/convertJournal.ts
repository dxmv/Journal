import { IJournal,JournalMap } from "../../types";



const convert=(journal:IJournal[])=>{
  let myJournal:JournalMap={};
  for(let i=0;i<journal.length;i++){
    const myDate=journal[i].date;
    myJournal[myDate]=[];
  }
  journal.map(entry=>{
    myJournal[entry.date].push(entry);
  })
  return myJournal;
}

export default convert;