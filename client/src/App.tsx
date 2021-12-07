import React, { useEffect } from 'react';
import "./styles/app.css"
import Nav from './components/nav';
import Home from "./components/home/Home";
import {BrowserRouter as Router,Route,Routes as Switch} from "react-router-dom"
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import User from './components/user/User';
import getToken from './utils/getToken';
import { useDispatch, useSelector } from 'react-redux'
import { SET_USER } from './redux/userReducer';
import userServices from './services/userServices';
import EntryForm from './components/entry/EntryForm';
import { RootState } from './redux/store';
import DeleteEntry from './components/entry/DeleteEntry';
import ResetPassword from './components/auth/ResetPassword';

function App() {

  const dispatch=useDispatch();
  const user=useSelector((state:RootState)=>state.user.user);

  // SET THE USER IF THE USER TOKEN IS SAVED IN LOCAL STORAGE
  useEffect(()=>{
    const currentUser=async():Promise<void>=>{
      const value=getToken();
      if(value){
        const user=await userServices.getUser(value.userToken.id);
        await dispatch(SET_USER(user));
      }
    }
    currentUser();
  },[])

  return (
    <Router>
      <div className="App">
        <Nav/>
        <Switch>
          <Route path="/" element={<Home/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/user/:id/" element={<User/>}/>
          <Route path="/new-entry/" element={<EntryForm name="New Entry" edit={false}/>}/>
          <Route path="/edit-entry/:id/" element={<EntryForm name="Edit Entry" edit={true}/>}/>
          <Route path="/delete-entry/:id/" element={<DeleteEntry/>}/>
          <Route path="/reset/:id/" element={<ResetPassword/>}/>
        </Switch>
      </div>
    </Router>    
  );
}

export default App;
