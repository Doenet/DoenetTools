import React from 'react';
import styled from 'styled-components';
import {
   useRecoilValue,
} from 'recoil';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { useLoaderData, useNavigate } from 'react-router';
import { pageToolViewAtom, searchParamAtomFamily } from '../NewToolRoot';
import { useCourse } from '../../../_reactComponents/Course/CourseActions';

// export async function action({ request, params }) {
//   const formData = await request.formData();
//   let formObj = Object.fromEntries(formData);
//   console.log("formObj",formObj)
//   return true;
// }

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



export default function SupportPanel({ hide, children }) {
   /* console.log(">>>===SupportPanel") */
   const data = useLoaderData();
  const navigate = useNavigate();
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'))
  const recoilPageToolView = useRecoilValue(pageToolViewAtom);
  const { compileActivity, updateAssignItem } = useCourse(data?.courseId);


    return (
      <>
      <ControlsWrapper $hide={hide} aria-label="complementary controls" data-test="Support Panel Controls">
        {recoilPageToolView?.page == 'portfolioeditor' && data?.public == '1' ? <Button style={{background: "#ff7b00"}} value="Update Public Activity" onClick={()=>{
            compileActivity({
        activityDoenetId: doenetId,
        isAssigned: true,
        courseId:data?.courseId,
        // successCallback: () => {
        //   addToast('Activity Assigned.', toastType.INFO);
        // },
      });
      updateAssignItem({
        doenetId,
        isAssigned: true,
        successCallback: () => {
          //addToast(assignActivityToast, toastType.INFO);
        },
      });
        }}/> : null }
        {recoilPageToolView?.page == 'portfolioeditor' ? <Button value="Settings" onClick={()=>navigate(`/portfolio/${doenetId}/settings?referrer=portfolioeditor`)}/> : null }
        <Button value="Documentation" onClick={()=>window.open("/public?tool=editor&doenetId=_DG5JOeFNTc5rpWuf2uA-q")}/>
      </ControlsWrapper>
    <SupportWrapper  $hide={hide} role="complementary" data-test="Support Panel">{children}</SupportWrapper>
    </>
  );
}
