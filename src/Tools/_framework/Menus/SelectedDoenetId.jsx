import React from 'react';
import { useRecoilValue } from 'recoil';
import { globalSelectedNodesAtom } from '../../../_reactComponents/Drive/NewDrive';


export default function SelectedDoenetId(props){

  const selection = useRecoilValue(globalSelectedNodesAtom);
  console.log(">>> SelectedDoenetId selection",selection)
  return <>
  <p>You have selected ID '{selection}'</p>
  </>
}