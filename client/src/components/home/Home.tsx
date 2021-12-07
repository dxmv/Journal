import { useEffect, useState } from 'react';
import HomeCarousel from './HomeCarousel'
import "../../styles/home.css"
import convert from '../../utils/convertJournal';
import Filter from './Filter';
import {IJournal, JournalMap} from "../../../types";
import EntryDateList from './EntryDateList';
import getToken from '../../utils/getToken';
import entryServices from '../../services/entryServices';
import { useSelector,useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { INITIAL_JOURNAL } from '../../redux/journalReducer';


export default function Home() {
  const [myJournal,setMyJournal]=useState<JournalMap>({});
  const dispatch=useDispatch();
  const user=useSelector((state:RootState)=>state.user.user);


  useEffect(()=>{
    const initialJournal=async():Promise<void>=>{
      const token=getToken();
      if(token){
        const entries=await entryServices.getEntries(token.token);
        const arr=entries.sort((a:IJournal,b:IJournal):number=>{
          const [day,month,year]=a.date.split("-");
          const [day2,month2,year2]=b.date.split("-");
          if(year<year2){
            return 1;
          }
          else if(year>year2){
            return -1;
          }
          if(month<month2){
            return 1;
          }
          else if(month>month2){
            return -1;
          }
          if(day<day2){
            return 1;
          }
          else if(day>day2){
            return -1;
          }
          return 0;
        });
        await dispatch(INITIAL_JOURNAL(arr));
        await setMyJournal(convert(arr));
      }
    }
    initialJournal(); 
  },[])

  return (
    <div className="main">
      {myJournal&&
        <>
          <HomeCarousel/>
          {user?
          <>
            <h1 className="home-header">Your Journal</h1>
            <div className="main-list">
              <Filter setMyJournal={setMyJournal}/>
              <div className="journal-list">
                {Object.keys(myJournal).map((date,i)=>
                  <EntryDateList key={i} list={myJournal[date]} date={date}/>
                )}
              </div>
            </div> 
          </>
          :
          <h1 style={{fontSize:"4rem"}}>Please login</h1>
          }
        </>
      }
    </div>
  )
}
