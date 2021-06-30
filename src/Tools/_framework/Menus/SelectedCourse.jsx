import React from 'react';
import { useRecoilValue } from 'recoil';

// import { myselection } from '../ToolPanels/SelectStuff';

export default function SelectedCourse(props){

  // const selection = useRecoilValue(myselection);
  let selection = 'to do'
  return <>
  <p>You have selected course {selection}</p>
  </>
}