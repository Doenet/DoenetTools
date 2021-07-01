import React from 'react';
import { useRecoilValue } from 'recoil';

import { drivecardSelectedNodesAtom } from '../ToolHandlers/CourseToolHandler'

export default function SelectedCourse(props){

  const selection = useRecoilValue(drivecardSelectedNodesAtom);
  // console.log(">>>selection",selection)
  return <>
  <p>You have selected course '{selection}'</p>
  </>
}