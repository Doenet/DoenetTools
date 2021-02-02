import React, {useState, useCallback, useEffect, useRef, useMemo, useContext} from 'react';
import './temp.css';
import axios from "axios";
import './util.css';
import nanoid from 'nanoid';
import {
  HashRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";

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
  useRecoilCallback,
  useGotoRecoilSnapshot
} from 'recoil';



export default function app() {
return <RecoilRoot>
    <Demo />
</RecoilRoot>
};

let textAtom = atom({
  key:"textAtom",
  default:""
})
let historyAtom = atom({
  key:"historyAtom",
  default:[]
})

function EnterText(props){
  let [text,setText] = useState("")
  let setRecoilText = useSetRecoilState(textAtom);

  return <div><input type="text" value={text} onChange={(e)=>{setText(e.target.value)}}/>
  <button onClick={()=>{setRecoilText(text)}}>Set Recoil Text</button></div>

}

function Demo(){
  let temp = useRecoilValue(textAtom)
  const recordSnapshot = useRecoilCallback(({ snapshot, set })=>()=>{
    console.log("here!",snapshot)
    let tAtom = snapshot.getLoadable(textAtom);
    console.log(" textAtom loadable",tAtom.getValue())
    //Edit so snapshot doesn't have historyAtom
    set(historyAtom,(old)=>[...old,snapshot])
  })

  const gotoSnapshot = useGotoRecoilSnapshot();
  const sHistory = useRecoilValue(historyAtom);
  let buttons = sHistory.map((snapshot)=>{
   let newSnapshot = snapshot.map(({set}) => {
      // console.log("snapshot info",info.getLoadable(historyAtom))
      set(historyAtom,sHistory);
    });
  return <div><button onClick={()=>gotoSnapshot(newSnapshot)} >return to {snapshot.getID()}</button></div>})


  return <>
  <EnterText />
  <button onClick={recordSnapshot}>Record Snapshot</button>
  {buttons}
  {temp}

  </>
}
