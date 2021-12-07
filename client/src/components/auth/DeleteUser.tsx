import React from 'react'
import "../../styles/login.css"
import "../../styles/custom.css"
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

export default function DeleteUser() {
  const user=useSelector((state:RootState)=>state.user.user);
  return (
    <div className="login-form">
      <form>
        {user?
        <>
          <h1 className="other-font" style={{textAlign:"center"}}>Delete your account</h1>
        </>
        :
        <h1>Please login</h1>
        }
      </form>
    </div>
  )
}
