import {useRecoilCallback} from "../../_snowpack/pkg/recoil.js";
import {processGradesAtom} from "../ToolPanels/GradebookAssignment.js";
export default function GradebookAssignmentLeave() {
  const setProcess = useRecoilCallback(({set}) => () => {
    set(processGradesAtom, "Assignment Table");
  });
  setProcess();
  return null;
}
