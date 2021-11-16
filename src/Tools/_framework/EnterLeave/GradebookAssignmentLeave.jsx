import { useRecoilCallback } from 'recoil';
import { processGradesAtom } from "../ToolPanels/GradebookAssignment";

export default function GradebookAssignmentLeave() {
  // console.log('>>>>GradebookAssignmentLeave');

  const setProcess = useRecoilCallback(({set})=>()=>{
    set(processGradesAtom, 'Assignment Table');
  })
  setProcess()
  return null;
}
