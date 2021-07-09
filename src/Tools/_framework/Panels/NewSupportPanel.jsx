import React from 'react';
import styled from 'styled-components';
import { toolViewAtom } from '../NewToolRoot';
import {
  useRecoilCallback,
} from 'recoil';

const SupportWrapper = styled.div`
  overflow: auto;
  grid-area: supportPanel;
  background-color: hsl(0, 0%, 99%);
  height: 100%;
  display: ${({$hide})=> $hide ? 'none' : 'block' }
  // border-radius: 0 0 4px 4px;
`;

const ControlsWrapper = styled.div`
  overflow: auto;
  grid-area: supportControls;
  display: flex;
  gap: 4px;
  background-color: hsl(0, 0%, 99%);
  display: ${({$hide})=> $hide ? 'none' : 'block' }
  // border-radius: 4px 4px 0 0;
  // border-bottom: 2px solid #e3e3e3;

`;

export default function SupportPanel({ hide, children, panelTitles=[], panelIndex }) {
  // console.log(">>>===SupportPanel")
  
  const setSupportPanelIndex = useRecoilCallback(({set})=>(index)=>{
    set(toolViewAtom,(was)=>{
      let newObj = {...was}
      newObj.supportPanelIndex = index
      return newObj
    })
  })

  let panelSelector = null;
  if (panelTitles.length > 0){

    let options = [];
    for (let [i,name] of Object.entries(panelTitles)){
      options.push(<option key={`panelSelector${i}`} value={i}>{name}</option>)
    }

    panelSelector = <select value={panelIndex} onChange={(e)=>{setSupportPanelIndex(e.target.value)}} >
      {options}
    </select>
  }

  return (
    <>
      <ControlsWrapper $hide={hide}>{panelSelector}</ControlsWrapper>
      <SupportWrapper  $hide={hide}>{children}</SupportWrapper>
    </>
  );
}
