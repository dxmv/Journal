import React, { useState } from 'react'
import "../../styles/userPage.css";
import Account from './Account';
import ChangePassword from './ChangePassword';
import Edit from './Edit';
import {AiFillHome,AiTwotoneSetting,AiTwotoneEdit} from "react-icons/ai";

export default function User() {
  const [page,setPage]=useState<string>("account");
  return (
    <div className="main">
      <div className="user" id="account">
        <div className="user-nav">
          <ul>
            <li className="user-nav-link" onClick={()=>setPage("account")}><AiFillHome size={"1.3rem"} style={{marginRight:"0.4rem"}}/>Account</li>
            <li className="user-nav-link" onClick={()=>setPage("edit")}><AiTwotoneSetting size={"1.3rem"} style={{marginRight:"0.4rem"}}/>Edit</li>
            <li className="user-nav-link" onClick={()=>setPage("change")}><AiTwotoneEdit size={"1.3rem"} style={{marginRight:"0.4rem"}}/>Change Password</li>
          </ul>
        </div>
        <div className="user-window">
          {
            page==="account"?<Account/>:
            page==="edit"?<Edit/>:<ChangePassword/>
          }
        </div>
      </div>
    </div>
  )
}
