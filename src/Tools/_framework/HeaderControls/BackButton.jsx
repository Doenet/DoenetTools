import React from 'react';
import { useSetRecoilState } from 'recoil';
import { pageToolViewAtom } from '../NewToolRoot';



export default function BackButton(){
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  
  return <button onClick={()=>setPageToolView({back:true})}>Back</button>
}