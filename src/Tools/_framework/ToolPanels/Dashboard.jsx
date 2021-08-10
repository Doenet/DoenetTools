import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { pageToolViewAtom, searchParamAtomFamily } from '../NewToolRoot';

export default function Dashboard(props) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const path = useRecoilValue(searchParamAtomFamily('path'));
  const driveId = path.split(':')[0];

  return (
    <div style={props?.style ?? {}}>
      <h1>Welcome to the Dashbaord</h1>
      <Button
        value="Drive"
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
      <Button value="GradeBook" onClick={() => {}} />
    </div>
  );
}
