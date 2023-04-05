import React from 'react';
import styled from 'styled-components';
import {
   useRecoilValue,
} from 'recoil';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { redirect, useLoaderData, useNavigate } from 'react-router';
import { pageToolViewAtom, searchParamAtomFamily } from '../NewToolRoot';
import { useCourse } from '../../../_reactComponents/Course/CourseActions';
import { Form } from 'react-router-dom';

export async function loader({ request }){
  const url = new URL(request.url);
  const doenetId = url.searchParams.get("doenetId");
  const response = await fetch(`/api/getPortfolioActivityData.php?doenetId=${doenetId}`);
  const data = await response.json();
  
return data.activityData;
}

export async function action({ request }) {
  const formData = await request.formData();
  let formObj = Object.fromEntries(formData);
  if (formObj._action == "Remix"){
    let response = await fetch(`/api/duplicatePortfolioActivity.php?doenetId=${formObj.doenetId}`);
    let respObj = await response.json();
  
    const { nextActivityDoenetId, nextPageDoenetId } = respObj;
    return redirect(`/portfolioeditor/${nextActivityDoenetId}?tool=editor&doenetId=${nextActivityDoenetId}&pageId=${nextPageDoenetId}`);
  }
  return true;
}

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

  let canRemix = false;
  if (recoilPageToolView?.page == 'public' &&
    data?.userCanViewSource == '1'
  ){
    canRemix = true;
  }
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

        {canRemix ? <Form method="post">
        <Button style={{marginTop:"8px"}} value="Remix"  /> 
      <input type="hidden" name="_action" value="Remix" />
      <input type="hidden" name="doenetId" value={doenetId} />
      </Form>
      : null }
      
      {recoilPageToolView?.page == 'portfolioeditor' ? <Button value="Settings" onClick={()=>navigate(`/portfolio/${doenetId}/settings?referrer=portfolioeditor`)}/> : null }
      <Button value="Documentation" onClick={()=>window.open("/public?tool=editor&doenetId=_DG5JOeFNTc5rpWuf2uA-q")}/>
      </ControlsWrapper>
      <SupportWrapper  $hide={hide} role="complementary" data-test="Support Panel">{children}</SupportWrapper>
      </>
      );
    }
