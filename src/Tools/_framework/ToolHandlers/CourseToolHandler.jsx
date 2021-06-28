import React from 'react';
import { useRecoilValue } from 'recoil'
import { searchParamAtomFamily } from '../NewToolRoot';

export default function CourseToolHandler(props){
  console.log(">>>===CourseToolHandler")
  const view = useRecoilValue(searchParamAtomFamily('view'))  
  console.log(">>>CourseToolHandler view",view)
  return null;

}