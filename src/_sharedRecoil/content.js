
import axios from "axios";
import { 
  // useRecoilValue, 
  // atom, 
  atomFamily,
  selectorFamily,
  // useSetRecoilState,
  // useRecoilState,
  // useRecoilValueLoadable,
  // useRecoilStateLoadable, 
  // useRecoilCallback
} from "recoil";

export const itemHistoryAtom = atomFamily({
  key:"itemHistoryAtom",
  default: selectorFamily({
    key:"itemHistoryAtom/Default",
    get:(branchId)=> async ()=>{
      if (!branchId){
        return [];
      }
      const { data } = await axios.get(
        `/api/loadVersions.php?branchId=${branchId}`
      );
      return data.versions
    }
  })
})


export const fileByContentId = atomFamily({
  key:"fileByContentId",
  default: selectorFamily({
    key:"fileByContentId/Default",
    get:(contentId)=> async ()=>{
      if (!contentId){
        return "";
      }
    
    const ls = localStorage.getItem(contentId);
      if (ls){ return ls}
      return await axios.get(`/media/${contentId}.doenet`) 
    }
  })
  
})