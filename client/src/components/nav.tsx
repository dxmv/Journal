import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from '../redux/store';
import "../styles/nav.css";
import { LOCAL_STORAGE_NAME } from '../utils/constants';

export default function Nav() {
  const user=useSelector((state:RootState)=>state.user).user;

  const logOut=async()=>{
    await localStorage.removeItem(LOCAL_STORAGE_NAME);
    window.location.href="/";
  }

  return (
    <div className="nav">
      <div className="big-nav-item">
        <Link style={{color:"black",textDecoration:"none"}} to="/">
          <h1>Meditations</h1>
        </Link>
      </div>
      {user
      ?
      <>
        <div className="small-nav-item">
          <Link style={{color:"black",textDecoration:"none"}} className="nav-button" to="/new-entry/">
            ADD A NEW ENTRY
          </Link>
        </div>
        <div className="small-nav-item">
          <Link style={{color:"black",textDecoration:"none"}} className="nav-button" to={`/user/${user._id}`}>
            {user.username}
          </Link>
        </div>
        <div className="small-nav-item">
          <Link style={{color:"black",textDecoration:"none"}} className="nav-button" to="/" onClick={logOut}>
            Log Out
          </Link>
        </div>
      </>  
      :
      <>
        <div className="small-nav-item">
          <Link style={{color:"black",textDecoration:"none"}} className="nav-button" to="/login">
            Log In
          </Link>
        </div>
        <div className="small-nav-item">
          <Link style={{color:"black",textDecoration:"none"}} className="nav-button" to="/register">
            Register
          </Link>
        </div>
      </>
      }


    </div>
  )
}
