import { faFolderTree } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  itemByDoenetId,
  selectedCourseItems,
  useCourse,
} from '../../../_reactComponents/Course/CourseActions';
import ActionButton from '../../../_reactComponents/PanelHeaderComponents/ActionButton';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { effectivePermissionsByCourseId } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';
import Textfield from '../../../_reactComponents/PanelHeaderComponents/Textfield';
import { searchParamAtomFamily } from '../NewToolRoot';
import { toastType, useToast } from '../Toast';

export default function SelectedSection() {
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const doenetId = useRecoilValue(selectedCourseItems)[0];
  const { canEditContent } = useRecoilValue(
    effectivePermissionsByCourseId(courseId),
  );
  const { label: recoilLabel, isAssigned } = useRecoilValue(
    itemByDoenetId(doenetId),
  );
  const { renameItem, deleteItem } = useCourse(courseId);
  const [itemTextFieldLabel, setItemTextFieldLabel] = useState(recoilLabel);
  const { updateAssignItem } = useCourse(courseId);

  let assignSectionText = 'Assign Section';
  if (isAssigned) {
    assignSectionText = 'Unassign Section';
  }

  useEffect(() => {
    setItemTextFieldLabel(recoilLabel);
  }, [recoilLabel]);

  const handelLabelModfication = () => {
    let effectiveItemLabel = itemTextFieldLabel;
    if (itemTextFieldLabel === '') {
      effectiveItemLabel = recoilLabel;
      if (recoilLabel === '') {
        effectiveItemLabel = 'Untitled';
      }

      setItemTextFieldLabel(effectiveItemLabel);
      addToast('Every item must have a label.');
    }
    //Only update the server when it changes
    if (recoilLabel !== effectiveItemLabel) {
      renameItem(doenetId, effectiveItemLabel);
    }
  };

  const addToast = useToast();
  let heading = (
    <h2 data-cy="infoPanelItemLabel" style={{ margin: '16px 5px' }}>
      <FontAwesomeIcon icon={faFolderTree} /> {recoilLabel}
    </h2>
  );

  if (canEditContent === '1') {
    return (
      <>
        {heading}
        <ActionButton
          width="menu"
          value={assignSectionText}
          onClick={() => {
            let toastText = 'Section Assigned.';
            if (isAssigned) {
              toastText = 'Section Unassigned.';
            }
            updateAssignItem({
              doenetId,
              isAssigned: !isAssigned,
              successCallback: () => {
                addToast(toastText, toastType.INFO);
              },
            });
          }}
        />
        <Textfield
          label="Label"
          vertical
          width="menu"
          value={itemTextFieldLabel}
          onChange={(e) => setItemTextFieldLabel(e.target.value)}
          onKeyDown={(e) => {
            if (e.keyCode === 13) handelLabelModfication();
          }}
          onBlur={handelLabelModfication}
        />
        <br />

        <Button
          width="menu"
          value="Delete Section"
          alert
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();

            deleteItem({ doenetId });
          }}
        />
      </>
    );
  }

  return <>{heading}</>;
}
