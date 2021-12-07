const formatDate=(date:string)=>{
  const [year,month,day]=date.split("-");
  const newDate=`${day}-${month}-${year}`;
  return newDate;
}

export {formatDate};