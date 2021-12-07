import axios from "axios";
import { ITag } from "../../types";
const URL="http://localhost:5000/api/tags";


const getAll=async():Promise<ITag[]>=>{
  const res=await axios.get<ITag[]>(URL);
  return res.data;
}

export default {getAll}