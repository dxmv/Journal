import { IJournal } from "../../types";

// STATE
interface IJournalState{
  journal:IJournal[],
}
const initialState:IJournalState={
  journal:[],
}

// ACTIONS
interface Initial{
  type:"INITIAL_JOURNAL",
  payload:IJournal[]
}
interface IAddEntry{
  type:"ADD_ENTRY",
  payload:IJournal
}
interface IDeleteEntry{
  type:"DELETE_ENTRY",
  id:string
}
interface IEditEntry{
  type:"EDIT_ENTRY",
  payload:IJournal,
}
export const ADD_ENTRY=(entry:IJournal):IAddEntry=>{
  return{
    type:"ADD_ENTRY",
    payload:entry
  }
}
export const DELETE_ENTRY=(id:string):IDeleteEntry=>{
  return{
    type:"DELETE_ENTRY",
    id,
  }
}
export const EDIT_ENTRY=(entry:IJournal,id:string):IEditEntry=>{
  return{
    type:"EDIT_ENTRY",
    payload:entry
  }
}
export const INITIAL_JOURNAL=(journal:IJournal[]):Initial=>{
  return{
    type:"INITIAL_JOURNAL",
    payload:journal
  }
};

type Action=IAddEntry|IDeleteEntry|IEditEntry|Initial;

const journalReducer=(state=initialState,action:Action):IJournalState=>{
  switch(action.type){
    case "INITIAL_JOURNAL":
      return{
        ...state,
        journal:[...action.payload]
      }
    case "ADD_ENTRY":
      return {
        ...state,
        journal:[...state.journal,action.payload]
      };
    case "DELETE_ENTRY":
      return{
        ...state,
        journal:[
          ...state.journal.slice(0, state.journal.findIndex(entry=>entry._id===action.id)),
          ...state.journal.slice(state.journal.findIndex(entry=>entry._id===action.id) + 1)
        ]
      }
    case "EDIT_ENTRY":
      const arr=[...state.journal];
      const index=arr.findIndex(entry=>entry._id===action.payload._id);
      arr[index]=action.payload;
      return{
        ...state,
        journal:arr
      }
    default:
      return state;
  }
}

export default journalReducer;