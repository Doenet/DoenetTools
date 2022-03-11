// import { ButtonGroup } from '@blueprintjs/core';
import React from 'react';
import { useRecoilValue } from 'recoil';
import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { searchParamAtomFamily } from '../NewToolRoot';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import { useCourse } from '../../../_reactComponents/Course/CourseActions';

export default function AddDriveItems() {
  const [courseId, parentFolderId] = useRecoilValue(
    searchParamAtomFamily('path'),
  ).split(':');
  let { create } = useCourse(courseId);
  //TODO: add selection information

  return (
    <ButtonGroup vertical>
      <Button
        width="menu"
        onClick={() =>
          console.log("Add Activity")
        }
        value="Add Activity"
      >
        Add Activity
      </Button>
      <Button
        width="menu"
        onClick={() =>
          console.log("Add Bank")
        }
        value="Add Bank"
      />
      <Button
        width="menu"
        onClick={() =>
          create({itemType:"Section",previousDoenetId:"testid",placeInFolderFlag:false})

        }
        value="Add Section"
      >
        Add Section
      </Button>
      
    </ButtonGroup>
    
  );
}
