// import { ButtonGroup } from '@blueprintjs/core';
import React from 'react';
import { useRecoilValue } from 'recoil';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { searchParamAtomFamily } from '../NewToolRoot';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import { useCourse } from '../../../_reactComponents/Course/CourseActions';

export default function AddDriveItems() {
  const [courseId] = useRecoilValue(
    searchParamAtomFamily('path'),
  ).split(':');
  let { create } = useCourse(courseId);

  return (
    <ButtonGroup vertical>
      <Button
        width="menu"
        onClick={() =>
          create({itemType:"activity"})
        }
        value="Add Activity"
      >
        Add Activity
      </Button>
      <Button
        width="menu"
        onClick={() =>
          create({itemType:"bank"})
        }
        value="Add Collection"
      />
      <Button
        width="menu"
        onClick={() =>
          create({itemType:"section"})

        }
        value="Add Section"
      >
        Add Section
      </Button>
      
    </ButtonGroup>
    
  );
}
