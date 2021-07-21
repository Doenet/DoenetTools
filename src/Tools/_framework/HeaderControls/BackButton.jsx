import React from 'react';
import { useSetRecoilState } from 'recoil';
import { pageToolViewAtom } from '../NewToolRoot';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';



export default function BackButton(){
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  
  return <Button onClick={()=>setPageToolView({back:true})} value='Back' />
}