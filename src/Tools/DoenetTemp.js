import React, {useRef} from 'react';
// import Date from '../imports/PanelHeaderComponents/Date.js';
import GlobalFont from '../fonts/GlobalFont.js';
import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
  RecoilRoot,
  useSetRecoilState,
  useRecoilValueLoadable,
  useRecoilStateLoadable,
  useRecoilState,
  useRecoilValue,
} from "recoil";
//   // var timeout;
//   // var timeout, promise,cancel;
//   var latestDoenetML = doenetML;
//   // console.log({timeout})

export function app() {
return (
<>
<GlobalFont/>
{/* <Date/> */}
</>
);
}

  // return {promise,
  //         cancel}
// }

let doenetMLAtom = atom({
  key:"doenetMLAtom",
  default:""
})


let saveSelector = selector({
  key:"saveSelector",
  set: ({get,set})=>{
    const doenetML = get(doenetMLAtom);
    console.log(">>>doenetML",doenetML)
  }
})

export default function Temp() {

  // let delaySave = delaySaveDraft("Done!")
  const [doenetML,setDoenetML] = useRecoilState(doenetMLAtom)
  const setSave = useSetRecoilState(saveSelector);
  const timeout = useRef(null);


  return <><textarea value={doenetML} onChange={(e)=>{
    setDoenetML(e.target.value);
    if (timeout.current === null){
      timeout.current = setTimeout(function(){
        setSave()
        timeout.current = null;
      },3000)
    }
  }}
    onBlur={()=>{
      if (timeout.current !== null){
        clearTimeout(timeout.current)
        timeout.current = null;
        setSave();
      }
    }}
  />
  {/* <button onClick={()=>{
    // delaySaveDraft(doenetML,timeout)
    delaySaveDraft();
    // delaySave.promise.then((result)=>{
      // alert(result)
    // })
  }}>Create Promise</button>
  <button onClick={()=>{
    // delaySave.cancel();
  }}>Cancel</button> */}
  </>
  
}
