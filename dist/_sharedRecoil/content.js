
import axios from "../_snowpack/pkg/axios.js";
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
} from "../_snowpack/pkg/recoil.js";

export const itemHistoryAtom = atomFamily({
  key:"itemHistoryAtom",
  default: selectorFamily({
    key:"itemHistoryAtom/Default",
    get:(doenetId)=> async ()=>{
      let draft = {};
      let named = [];
      let autoSaves = [];
      if (!doenetId){
        return {draft,named,autoSaves};
      }
      const { data } = await axios.get(
        `/api/loadVersions.php?doenetId=${doenetId}`
      );
        
      draft = data.versions[0];
      for (let version of data.versions){
        if (version.isDraft === '1'){
          continue;
        }
        if (version.isNamed === '1'){
          named.push(version);
          continue;
        }
        autoSaves.push(version);
      }
      return {draft,named,autoSaves};

    }
  })
})


export const fileByContentId = atomFamily({
  key:"fileByContentId",
  default: selectorFamily({
    key:"fileByContentId/Default",
    get:(cid)=> async ()=>{
      if (!cid){
        return "";
      }
      // const local = localStorage.getItem(cid);
      // if (local){ return local}
      try {
        const server = await axios.get(`/media/${cid}.doenet`); 
        return server.data;
      } catch (err) {
        //TODO: Handle 404
        return "Error Loading";
      }
    }
  })
  
})