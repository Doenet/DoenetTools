import React, { useEffect } from 'react';
import {
  useRecoilValue,
  useSetRecoilState,
  useRecoilValueLoadable,
} from 'recoil';
import Card from '../../../_reactComponents/PanelHeaderComponents/Card';
import {
  pageToolViewAtom,
  searchParamAtomFamily,
  profileAtom,
} from '../NewToolRoot';
import Next7Days from '../Widgets/Next7Days';
import { effectivePermissionsByCourseId } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';
import { suppressMenusAtom } from '../NewToolRoot';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faUser, faChartPie } from '@fortawesome/free-solid-svg-icons';

export default function Dashboard(props) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const { canModifyCourseSettings, canManageUsers, dataAccessPermission } =
    useRecoilValue(effectivePermissionsByCourseId(courseId));
  const setSuppressMenus = useSetRecoilState(suppressMenusAtom);
  const loadProfile = useRecoilValueLoadable(profileAtom);
  let profile = loadProfile.contents;

  useEffect(() => {
    setSuppressMenus(canModifyCourseSettings === '1' ? [] : ['ClassTimes']);
  }, [canModifyCourseSettings, setSuppressMenus]);

  return (
    <div style={props?.style ?? {}}>
      <div style={{ marginLeft: '10px', marginRight: '10px' }}>
        <h1>Welcome!</h1>
        <div
          style={{
            display: 'grid',
            gridAutoFlow: 'column dense',
            gridAutoColumns: 'min-content',
            gap: '30px',
            width: '850px',
          }}
        >
          <Card
            name="Content"
            icon={<FontAwesomeIcon icon={faCode} />}
            value="Content"
            onClick={() => {
              setPageToolView((was) => {
                // console.log(">>>>was",was);
                return { ...was, tool: 'navigation' };
              });
            }}
          />
          {canManageUsers === '1' ? (
            <Card
              name="People"
              icon={<FontAwesomeIcon icon={faUser} />}
              value="People"
              onClick={() =>
                setPageToolView({
                  page: 'course',
                  tool: 'people',
                  view: '',
                  params: { courseId },
                })
              }
            />
          ) : null}
          {(dataAccessPermission ?? 'None') !== 'None' ? (
            <Card
              name="Data"
              icon={<FontAwesomeIcon icon={faChartPie} />}
              value="Data"
              onClick={() =>
                setPageToolView({
                  page: 'course',
                  tool: 'data',
                  view: '',
                  params: { courseId },
                })
              }
            />
          ) : null}
          {/* {effectiveRole === 'instructor' ?
          <Card 
            name='Gradebook' 
            icon={<FontAwesomeIcon icon={faTasks}/>}
            value="Gradebook" 
            onClick={() => 
            setPageToolView((was)=>{return {
              page: 'course',
              tool: 'gradebook',
              view: was.view,
              params: { courseId },
              }})
            } 
          />
          :
          <Card 
            name='Gradebook' 
            icon={<FontAwesomeIcon icon={faTasks}/>}
            style={{marginLeft: '-600px'}}
            value="Gradebook" 
            onClick={() => 
            setPageToolView((was)=>{return {
              page: 'course',
              tool: 'gradebookStudent',
              view: was.view,
              params: { courseId, userId:profile.userId },
              }})

            } 
          />
          } */}
        </div>
      </div>
      <div style={{ marginTop: '10px', margin: '10px' }}>
        {/* <Next7Days driveId={courseId}/> */}
      </div>
    </div>
  );
}
