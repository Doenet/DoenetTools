import React from 'react';

import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import { useCreateCourse } from '../../../_reactComponents/Course/CourseActions';


const CreateCourse = (props) =>{

  const {createCourse} = useCreateCourse();

  return <div style={props.style}>
  <ButtonGroup vertical>
    <Button width="menu" value="Create New Course" onClick={createCourse} data-test="createCourse">Create New Course</Button>
  </ButtonGroup>
 
  </div>
}
export default CreateCourse;