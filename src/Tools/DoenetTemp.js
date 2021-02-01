import React, { useEffect, ErrorBoundary, useState,useRef } from "react";
import Tool, { openOverlayByName } from "../imports/Tool/Tool";
import Drive, { globalSelectedNodesAtom } from "../imports/Drive";
import AddItem from "../imports/AddItem";
import Switch from "../imports/Switch";
// import Button from "../imports/Button";
import {
  atom,
  useSetRecoilState,
  useRecoilValue,
  selector,
  atomFamily,
  useRecoilState
} from "recoil";
import { BreadcrumbContainer } from "../imports/Breadcrumb";
import { supportVisible } from "../imports/Tool/SupportPanel";
import DoenetViewer from './DoenetViewer';


// function delaySaveDraft(doenetML,timeout) {


//   // var timeout;
//   // var timeout, promise,cancel;
//   var latestDoenetML = doenetML;
//   // console.log({timeout})

//   function myalert(){
//     timeout.current = setTimeout(function(){
//           alert(latestDoenetML)
//           timeout.current = null;
//         },5000)

//   }
//   console.log({timeout:timeout.current})
//   if (timeout.current === null){
//     myalert();
//   }
//   console.log({timeout:timeout.current})

  // cancel = function(){clearTimeout(timeout)}


  // console.log(">>>latestDoenetML",latestDoenetML);

  // promise = new Promise(function(resolve,reject){
  //   timeout = setTimeout(function(){
  //     resolve(doenetML)
  //   },4000)
  // })


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
