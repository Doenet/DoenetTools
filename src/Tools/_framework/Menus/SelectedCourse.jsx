import { faChalkboard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useCourse } from '../../../_reactComponents/Course/CourseActions';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import { drivecardSelectedNodesAtom } from '../ToolHandlers/CourseToolHandler';

import {
  AddUser,
  DeleteCourse,
  EditDefaultRole,
  EditImageAndColor,
  EditLabel,
  ManageUsers,
  MangeRoles,
} from '../../../_reactComponents/Course/SettingComponents';
import { effectivePermissionsByCourseId } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';

export default function SelectedCourse() {
  const [courseCardsSelection, setCourseCardsSelection] = useRecoilState(
    drivecardSelectedNodesAtom,
  );

  //DO WE Need view perm check? selection[0]?.canViewCourse
  if (courseCardsSelection.length === 1) {
    return (
      <CourseInfoPanel
        key={`CourseInfoPanel${courseCardsSelection[0].courseId}`}
        courseId={courseCardsSelection[0].courseId}
      />
    );
  } else if (
    courseCardsSelection.length > 1 &&
    courseCardsSelection[0]?.isOwner
  ) {
    //should be aware of all course permissons
    return (
      <>
        <h2> {courseCardsSelection.length} Courses Selected</h2>
        <ButtonGroup vertical>
          <Button
            width="menu"
            value="Duplicate (Soon)"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('>>>This will Duplicate courses');
              setCourseCardsSelection([]);
            }}
          />
          <Button
            width="menu"
            value="Delete Courses (Soon)"
            alert
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('>>>This will Delete multiple courses');
              setCourseCardsSelection([]);
            }}
          />
        </ButtonGroup>
      </>
    );
  }
  return null;
}

const CourseInfoPanel = function ({ courseId }) {
  const { label } = useCourse(courseId);
  const {
    canViewUsers,
    canManageUsers,
    canModifyRoles,
    canModifyCourseSettings,
    isOwner,
  } = useRecoilValue(effectivePermissionsByCourseId(courseId));

  return (
    <>
      <h2 data-test="infoPanelItemLabel">
        <FontAwesomeIcon icon={faChalkboard} /> {label}
      </h2>
      {canModifyCourseSettings === '1' && <EditLabel courseId={courseId} />}
      {canModifyCourseSettings === '1' && (
        <EditImageAndColor courseId={courseId} />
      )}
      <br />
      {canModifyRoles === '1' && <EditDefaultRole courseId={courseId} />}
      {canManageUsers === '1' && <AddUser courseId={courseId} menu />}
      {canViewUsers === '1' && (
        <ManageUsers courseId={courseId} editable={canManageUsers === '1'} />
      )}
      <br />
      {canModifyRoles === '1' && <MangeRoles courseId={courseId} />}
      <br />
      {isOwner === '1' && <DeleteCourse courseId={courseId} />}
    </>
  );
};
