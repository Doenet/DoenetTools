import React from 'react';
// import Button from '../../../_reactComponents/PanelHeaderComponents/Button';
import { showCompletedAtom, showOverdueAtom } from '../Widgets/Next7Days';
import Switch from '../Switch';
import { useRecoilState } from 'recoil';

export default function CurrentContent(){
  const [overdue,setOverdue] = useRecoilState(showOverdueAtom);
  const [completed,setCompleted] = useRecoilState(showCompletedAtom);

  return <div>
    Show Completed <Switch checked={completed} onChange={(e)=>{
      setCompleted(e.target.checked);
      }} />
    Show Overdue <Switch checked={overdue} onChange={(e)=>{
      setOverdue(e.target.checked);
    }} />
  </div>
}