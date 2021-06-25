import React from 'react';
import { useRecoilCallback, atom } from 'recoil';
import { selectedMenuPanelAtom } from '../Panels/MenuPanels';

export const myselection = atom({
  key:"myselection",
  default:[]
})

export default function SelectStuff(props){

  const setSelection = useRecoilCallback(({set})=>(selection)=>{
    set(myselection,selection)
    if (selection.length > 0){
      set(selectedMenuPanelAtom,"SelectPanel");
    }else{
      set(selectedMenuPanelAtom,(was)=>{
        if (was === "SelectPanel"){
          return null;
        }
        return was;
      });
    }
  })
  
  return <div style={props.style}>
    <h1>SelectStuff</h1>
    <div><button onClick={()=>setSelection(['a'])}>select a</button></div>
    <div><button onClick={()=>setSelection(['b'])}>select b</button></div>
    <div><button onClick={()=>setSelection(['a','b'])}>select a and b</button></div>
    <div><button onClick={()=>setSelection([])}>Deselect All</button></div>
  </div>
}