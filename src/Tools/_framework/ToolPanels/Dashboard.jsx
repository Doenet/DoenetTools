import React, { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState, useRecoilValueLoadable } from 'recoil';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import Card from '../../../_reactComponents/PanelHeaderComponents/Card';
import { pageToolViewAtom, searchParamAtomFamily, profileAtom } from '../NewToolRoot';
import Next7Days from '../Widgets/Next7Days';
import { effectiveRoleAtom } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';
import { suppressMenusAtom } from '../NewToolRoot';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faUser, faChartPie, faTasks } from '@fortawesome/free-solid-svg-icons';


export default function Dashboard(props) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const path = useRecoilValue(searchParamAtomFamily('path'));
  const driveId = path.split(':')[0];
  const effectiveRole = useRecoilValue(effectiveRoleAtom);
  const setSuppressMenus = useSetRecoilState(suppressMenusAtom);
  const loadProfile = useRecoilValueLoadable(profileAtom);
  let profile = loadProfile.contents;

    useEffect(()=>{
      if (effectiveRole === 'student'){
        setSuppressMenus(["ClassTimes"])
      }else{
        setSuppressMenus([])
      }
    },[effectiveRole,setSuppressMenus])

  return (
    <div style={props?.style ?? {}}>
      <div style={{marginLeft: '10px', marginRight: '10px'}}>
        <h1>Welcome!</h1>
        <div style={{display: 'flex', justifyContent: 'space-between', col: '1', width: '850px'}}>
          <Card 
            name='Content' 
            icon={<FontAwesomeIcon icon={faCode}/>}
            value="Content"
            onClick={() => {
              setPageToolView((was) => {
                // console.log(">>>>was",was);
              return { ...was, tool: 'navigation' }
            })}}
          />
          {effectiveRole === 'instructor' ?
          <>
          <Card 
            name='Enrollment' 
            icon={<FontAwesomeIcon icon={faUser}/>}
            value="Enrollment"
            onClick={() =>
              setPageToolView({
                page: 'course',
                tool: 'enrollment',
                view: '',
                params: { driveId },
              })
            }
          />
          <Card 
            name='Surveys' 
            icon={<FontAwesomeIcon icon={faChartPie}/>}
            value="Surveys"
            onClick={() =>
              setPageToolView({
                page: 'course',
                tool: 'surveyList',
                view: '',
                params: { driveId },
              })
            }
          />
          </>
          : null}
          {effectiveRole === 'instructor' ?
          <Card 
            name='Gradebook' 
            icon={<FontAwesomeIcon icon={faTasks}/>}
            value="Gradebook" 
            onClick={() => 
            setPageToolView((was)=>{return {
              page: 'course',
              tool: 'gradebook',
              view: was.view,
              params: { driveId },
              }})
            } 
          />
          :
          <Card 
            name='Gradebook' 
            icon={faTasks}
            value="Gradebook" 
            onClick={() => 
            setPageToolView((was)=>{return {
              page: 'course',
              tool: 'gradebookStudent',
              view: was.view,
              params: { driveId, userId:profile.userId },
              }})

            } 
          />
          }
        </div>
  
        {/* <ButtonGroup vertical>
        <Button
          value="Content"
          onClick={() => {
            setPageToolView((was) => {
              // console.log(">>>>was",was);
            return { ...was, tool: 'navigation' }
          })}}
          
        />
        {effectiveRole === 'instructor' ?
        <>
        <Button
          value="Enrollment"
          onClick={() =>
            setPageToolView({
              page: 'course',
              tool: 'enrollment',
              view: '',
              params: { driveId },
            })
          }
        />
        <Button
          value="Surveys"
          onClick={() =>
            setPageToolView({
              page: 'course',
              tool: 'surveyList',
              view: '',
              params: { driveId },
            })
          }
        />
        </>
        : null }
        {effectiveRole === 'instructor' ?
        <Button value="Gradebook" 
        onClick={() => 
        setPageToolView((was)=>{return {
          page: 'course',
          tool: 'gradebook',
          view: was.view,
          params: { driveId },
          }})
        } 
      />
        : 
        <Button value="Gradebook" 
          onClick={() => 
          setPageToolView((was)=>{return {
            page: 'course',
            tool: 'gradebookStudent',
            view: was.view,
            params: { driveId, userId:profile.userId },
            }})

          } 
        />
         }
        
        </ButtonGroup> */}
      </div>
      <div style={{ marginTop: '10px', margin: '10px'}}>
      <Next7Days driveId={driveId}/>
      </div>
    </div>
  );
}
