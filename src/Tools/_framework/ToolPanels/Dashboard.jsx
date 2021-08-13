import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import { pageToolViewAtom, searchParamAtomFamily } from '../NewToolRoot';

export default function Dashboard(props) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const path = useRecoilValue(searchParamAtomFamily('path'));
  const pageToolView = useRecoilValue(pageToolViewAtom) 
  const role = pageToolView.view;
  const driveId = path.split(':')[0];

  return (
    
    <div style={props?.style ?? {}}>
      <div style={{marginLeft: '10px', marginRight: '10px'}}>
        <h1>Welcome!</h1>
        <ButtonGroup vertical>
        <Button
          value="Content"
          onClick={() => {
            setPageToolView((was) => ({ ...was, tool: 'navigation' }));
          }}
        />
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
        <Button value="GradeBook" 
          onClick={() => 
          setPageToolView({
            page: 'course',
            tool: 'gradebook',
            view: '',
            params: { driveId },
            })
          } 
        />
        </ButtonGroup>
      </div>
      <div style={{border: '2px solid black', borderRadius: '5px', marginTop: '10px', height: '560px', margin: '10px'}}>
        <p 
        style={{marginLeft: '18px'}}
        // style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', }}
        >More coming soon!</p>
      </div>
    </div>
  );
}
