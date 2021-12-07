import { IUser } from "../../types";
//INITIAL STATE
interface IUserState{
  user:IUser|null,
}
const initialState:IUserState={
  user:null
}

// ACTION TYPES
interface ISetUser{
  type:"SET_USER",
  payload:IUser
}
interface IDeleteUser{
  type:"DELETE_USER"
}

// ACTION TYPE FOR REDUCER FUNCTION
type Action=ISetUser|IDeleteUser;

// ACTIONS
export const SET_USER=(user:IUser):ISetUser=>{
  return{
    type:"SET_USER",
    payload:user
  };
};


export const DELETE_USER=():IDeleteUser=>{
  return{
    type:"DELETE_USER"
  }
};

const userReducer=(state=initialState,action:Action)=>{
  switch(action.type){
    case "SET_USER":
      return {
        ...state,
        user:action.payload
      };
    case "DELETE_USER":
      return{
        ...state,
        user:null
      };
    default:
      return state
  }
}

export default userReducer;