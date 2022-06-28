import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import {
  itemByDoenetId,
  selectedCourseItems,
  useCourse,
} from '../../../_reactComponents/Course/CourseActions';
import { effectivePermissionsByCourseId } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';
import Textfield from '../../../_reactComponents/PanelHeaderComponents/Textfield';
import { searchParamAtomFamily } from '../NewToolRoot';
import { useToast } from '../Toast';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';

export default function SelectedBank() {
  const courseId = useRecoilValue(searchParamAtomFamily('courseId'));
  const doenetId = useRecoilValue(selectedCourseItems)[0];
  const { canEditContent } = useRecoilValue(
    effectivePermissionsByCourseId(courseId),
  );
  const { label: recoilLabel } = useRecoilValue(itemByDoenetId(doenetId));
  const { renameItem } = useCourse(courseId);
  const [itemTextFieldLabel, setItemTextFieldLabel] = useState(recoilLabel);
  let { create, deleteItem } = useCourse(courseId);

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
      <FontAwesomeIcon icon={faLayerGroup} /> {recoilLabel}
    </h2>
  );

  if (canEditContent === '1') {
    return (
      <>
        {heading}
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
        <ButtonGroup vertical>
          <Button
            width="menu"
            onClick={() => create({ itemType: 'page' })}
            value="Add Page"
          />
        </ButtonGroup>
        <br />
        <Button
          width="menu"
          value="Delete Collection"
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

  return null;
}
