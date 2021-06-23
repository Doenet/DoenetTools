import React from 'react';
import { useRecoilValue } from 'recoil';

import { myselection } from '../ToolPanels/SelectStuff';

export default function TestControl(props){

  const selection = useRecoilValue(myselection);
  
  return <div style={props.style}>
  <p>You have selected {selection}</p>
  </div>
}