import React from 'react';
// import { useLocation } from 'react-router';
import { useRecoilCallback, useRecoilValue, useSetRecoilState } from 'recoil';
import { toolViewAtom, searchParamAtomFamily, paramObjAtom } from '../NewToolRoot';
import { globalSelectedNodesAtom } from '../../../_reactComponents/Drive/NewDrive';
import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';

// let encodeParams = p => Object.entries(p).map(kv => 
//   kv.map(encodeURIComponent).join("=")).join("&");

export default function DrivePanel(props){
  console.log(">>>===DrivePanel")
  const path = useRecoilValue(searchParamAtomFamily('path'))
  const setParamObj = useSetRecoilState(paramObjAtom);

  // let location = useLocation();

  // const setPath = useRecoilCallback(({set})=>(path)=>{
  //   let urlParamsObj = Object.fromEntries(new URLSearchParams(location.search));
  //   urlParamsObj['path'] = path;
  //   const url = location.pathname + '?' + encodeParams(urlParamsObj);

  //   window.history.pushState('','',`/new#${url}`)
  //   set(searchParamAtomFamily('path'),path)
  // })

  const setSelections = useRecoilCallback(({set})=>(selections)=>{
    console.log(">>>selections",selections)
    set(selectedMenuPanelAtom,"SelectedDoenetId");
    set(globalSelectedNodesAtom,selections);
  })


  //Keep this to speed up hiding 
  if (props.style?.display === "none"){
    return <div style={props.style}></div>
  }



  
  return <div style={props.style}><h1>drive</h1>
  <p>put drive here</p>
  <div>path: {path}</div>
  <div><button onClick={(e)=>{e.stopPropagation();setParamObj((was)=>{ let newObj = {...was}; newObj['path']='f1'; return newObj; })}}>path to f1</button></div>
  <div><button onClick={(e)=>{e.stopPropagation();setParamObj((was)=>{ let newObj = {...was}; newObj['path']='f2'; return newObj; })}}>path to f2</button></div>
  <div><button onClick={(e)=>{e.stopPropagation();setParamObj((was)=>{ let newObj = {...was}; newObj['path']='f3'; return newObj; })}}>path to f3</button></div>
  <hr />
  {/* set(selectedMenuPanelAtom,"SelectedDoenetId"); //replace selection */}

  <div><button onClick={(e)=>{e.stopPropagation();setSelections(['f1'])}}>select f1</button></div>
  <div><button onClick={(e)=>{e.stopPropagation();setSelections(['f1','f2'])}}>select f1 and f2</button></div>
  </div>
}