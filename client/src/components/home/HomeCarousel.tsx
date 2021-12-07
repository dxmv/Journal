import React, { useState } from 'react'
import carouselInfo from '../../utils/carouselInfo'
import { MdArrowForward,MdArrowBack } from "react-icons/md";
import entryServices from '../../services/entryServices';
import getToken from '../../utils/getToken';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';



export default function HomeCarousel() {
  const [index,setIndex]=useState<number>(0);
  const user=useSelector((state:RootState)=>state.user.user);

  const handleChange=(e:React.MouseEvent<SVGElement, MouseEvent>)=>{
    if (!(e.target instanceof SVGElement)) {
      return;
    }
    if(!e.target.dataset.arrow){
      return;
    }
    const direction=e.target.dataset.arrow;
    if(direction==="back"){
      setIndex((prev)=>{
        if(prev===0){
          return carouselInfo.length-1;
        }
        return prev-1;
      });
    }
    else{
      setIndex((prev)=>{
        if(prev===carouselInfo.length-1){
          return 0;
        }
        return prev+1;
      })
    }
  }

  const onDownload=async(e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
    e.preventDefault();
    const token=getToken();
    if (token){
      await entryServices.download(token.token);
    }
  }

  return (
    <div className="carousel">
      <div className="carousel-arrow">
        <MdArrowBack className="arrow" onClick={(e)=>handleChange(e)} data-arrow="back"/>
      </div>
      <div className="carousel-content">
        <p className="carousel-text">
          {carouselInfo[index].text}
        </p>
        {
          carouselInfo[index].link&&user&&
          <button onClick={onDownload} className="carousel-link">
            <span className="other-font" style={{zIndex:3,position:"relative"}}>{carouselInfo[index].link}</span>
          </button>
        }
      </div>
      <div className="carousel-arrow">
        <MdArrowForward className="arrow" onClick={e=>handleChange(e)} data-arrow="next"/>
      </div>
    </div>
  )
}
