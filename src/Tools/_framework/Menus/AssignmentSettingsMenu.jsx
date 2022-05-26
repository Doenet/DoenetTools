import React from 'react';
import { useRecoilValue } from 'recoil';
import { AssignmentSettings } from './SelectedActivity';
import { searchParamAtomFamily } from '../NewToolRoot';
import { courseIdAtom } from '../../../_reactComponents/Course/CourseActions';
import { AssignUnassignActivity } from '../../../_reactComponents/Activity/SettingComponents';

export default function AssignmentSettingsMenu() {
  const doenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const courseId = useRecoilValue(courseIdAtom);
  return (
    <div style={{ paddingTop: '6px', paddingBottom: '6px' }}>
      <AssignUnassignActivity doenetId={doenetId} courseId={courseId} />
      <br />
      <AssignmentSettings
        effectiveRole="instructor"
        doenetId={doenetId}
        courseId={courseId}
      />
    </div>
  );
}
