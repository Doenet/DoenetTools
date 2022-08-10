import { faChalkboard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useCourse } from '../../../_reactComponents/Course/CourseActions';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import DoenetDriveCardMenu from '../../../_reactComponents/Drive/DoenetDriveCardMenu';
import { useToast, toastType } from '../../_framework/Toast';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import { drivecardSelectedNodesAtom } from '../ToolHandlers/CourseToolHandler';

import {
  DeleteCourse,
  EditDefaultRole,
  EditImageAndColor,
  EditLabel,
} from '../../../_reactComponents/Course/SettingComponents';
import { effectivePermissionsByCourseId } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';
import { pageToolViewAtom } from '../NewToolRoot';
import ActionButton from '../../../_reactComponents/PanelHeaderComponents/ActionButton';
import ActionButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ActionButtonGroup';

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
    isOwner,
    isAdmin,
    canViewUsers,
    dataAccessPermission,
    canModifyCourseSettings,
  } = useRecoilValue(effectivePermissionsByCourseId(courseId));
  const setPageToolView = useSetRecoilState(pageToolViewAtom);

  return (
    <>
      <h2 data-test="infoPanelItemLabel">
        <FontAwesomeIcon icon={faChalkboard} /> {label}
      </h2>
      <ActionButtonGroup vertical>
        <ActionButton
          width="menu"
          value="Enter Course"
          data-test="Enter Course nav button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setPageToolView({
              page: 'course',
              tool: 'dashboard',
              view: '',
              params: {
                courseId,
              },
            });
          }}
        />
        {/* <ActionButton
          width="menu"
          value="Content"
          data-test="content nav button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setPageToolView({
              page: 'course',
              tool: 'navigation',
              view: '',
              params: {
                courseId,
              },
            });
          }}
        />
        {canViewUsers === '1' && (
          <ActionButton
            width="menu"
            value="People"
            data-test="people nav button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setPageToolView({
                page: 'course',
                tool: 'people',
                view: '',
                params: {
                  courseId,
                },
              });
            }}
          />
        )}
        {dataAccessPermission === 'Identified' && (
          <ActionButton
            width="menu"
            value="Data"
            data-test="data nav button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setPageToolView({
                page: 'course',
                tool: 'data',
                view: '',
                params: {
                  courseId,
                },
              });
            }}
          />
        )} */}
      </ActionButtonGroup>
      {canModifyCourseSettings === '1' && <EditLabel courseId={courseId} />}
      {canModifyCourseSettings === '1' && (
        <EditImageAndColor courseId={courseId} />
      )}
      {isAdmin === '1' && <EditDefaultRole courseId={courseId} />}
      {isOwner === '1' && <DeleteCourse courseId={courseId} />}
    </>
  );
};
