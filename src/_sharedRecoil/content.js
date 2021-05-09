
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
      console.log(">>>itemHistoryAtom branchId",branchId)
      if (!branchId){
        return [];
      }
      const { data } = await axios.get(
        `/api/loadVersions.php?branchId=${branchId}`
      );
      console.log(">>>itemHistoryAtom data",data)
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
      const local = localStorage.getItem(contentId);
      if (local){ return local}

      return await (await axios.get(`/media/${contentId}.doenet`)).data; 
    }
  })
  
})