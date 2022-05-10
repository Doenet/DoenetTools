import React from 'react';
import { useRecoilValue } from 'recoil';
import { AssignmentSettings } from './SelectedActivity';
import { searchParamAtomFamily } from '../NewToolRoot';

export default function AssignmentSettingsMenu() {
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  return (
    <div style={{ paddingTop: '6px', paddingBottom: '6px' }}>
      <AssignmentSettings
        effectiveRole="instructor"
        doenetId={doenetId}
        courseId={courseId}
      />
    </div>
  );
}
