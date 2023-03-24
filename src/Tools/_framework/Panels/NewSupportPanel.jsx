import React from 'react';
import styled from 'styled-components';
import {
  useRecoilState,
   useRecoilValue,
} from 'recoil';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { useNavigate } from 'react-router';
import { pageToolViewAtom, searchParamAtomFamily } from '../NewToolRoot';
// import { courseIdAtom } from '../../../_reactComponents/Course/CourseActions';

const SupportWrapper = styled.div`
  overflow: auto;
  grid-area: supportPanel;
  background-color: var(--canvas);
  height: 100%;
  display: ${({$hide})=> $hide ? 'none' : 'block' }
`;

const ControlsWrapper = styled.div`
  overflow: auto;
  grid-area: supportControls;
  column-gap: 10px;
  display: ${({$hide})=> $hide ? 'none' : 'flex' };
  justify-content:flex-end;
  background-color: var(--canvas);
`;



export default function SupportPanel({ hide, children, panelTitles=[], panelIndex }) {
  // console.log(">>>===SupportPanel")
  const navigate = useNavigate();
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'))
  //NEED THE ROOT PATH BEFORE THE ?
  const recoilPageToolView = useRecoilValue(pageToolViewAtom);
  /* const recoilTool = useRecoilValue(searchParamAtomFamily('source')); */
  /* console.log("recoilPageToolView",recoilPageToolView?.page) */
  /* const courseId = useRecoilValue(courseIdAtom) */

  
  /* const setSupportPanelIndex = useRecoilCallback(({set})=>(index)=>{

    console.log(">>>TODO: change SupportPanelIndex to ",index) 
  }) */
  
  /* let panelSelector = null;
  if (panelTitles.length > 0){
    
    let options = [];
    for (let [i,name] of Object.entries(panelTitles)){
      options.push(<option key={`panelSelector${i}`} value={i}>{name}</option>)
    }
    
    panelSelector = <select value={panelIndex} onChange={(e)=>{setSupportPanelIndex(e.target.value)}} >
    {options}
    </select>
  } */
    return (
      <>
      <ControlsWrapper $hide={hide} aria-label="complementary controls" data-test="Support Panel Controls">
        {recoilPageToolView?.page == 'portfolioeditor' ? <Button value="Settings" onClick={()=>navigate(`/portfolio/${doenetId}/settings?referrer=portfolioeditor`)}/> : null }
        <Button value="Documentation" onClick={()=>window.open("/public?tool=editor&doenetId=_DG5JOeFNTc5rpWuf2uA-q")}/>
      </ControlsWrapper>
    <SupportWrapper  $hide={hide} role="complementary" data-test="Support Panel">{children}</SupportWrapper>
    </>
  );
}
