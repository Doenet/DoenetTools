import {
  faFileExport,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { useRecoilValue } from 'recoil';
import { authorItemByDoenetId, selectedCourseItems, useCourse } from '../../../_reactComponents/Course/CourseActions';
import { searchParamAtomFamily } from '../NewToolRoot';

export default function SelectedOrder() {
  const doenetId = useRecoilValue(selectedCourseItems)[0];
  const itemObj = useRecoilValue(authorItemByDoenetId(doenetId));
  const courseId = useRecoilValue(searchParamAtomFamily('couresId'))
  let { create } = useCourse(courseId);

  let heading = (<h2 data-cy="infoPanelItemLabel" style={{ margin: "16px 5px" }} >
  <FontAwesomeIcon icon={faFileExport} /> {itemObj.label} 
</h2>)

  return <>
  {heading}
  <ButtonGroup vertical>
      <Button
        width="menu"
        onClick={() =>
          create({itemType:"order"})
        }
        value="Add Order"
      />
      <Button
        width="menu"
        onClick={() =>
          create({itemType:"page"})
        }
        value="Add Page"
      />
    </ButtonGroup>
  </>;
}

