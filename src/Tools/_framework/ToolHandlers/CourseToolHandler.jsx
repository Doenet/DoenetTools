import React from 'react';
import { useRecoilValue } from 'recoil'
import { searchParamAtomFamily } from '../NewToolRoot';

export default function CourseToolHandler(props){
  console.log(">>>===CourseToolHandler")
  const tool = useRecoilValue(searchParamAtomFamily('tool'))  
  console.log(">>>CourseToolHandler tool",tool)
  return null;

}