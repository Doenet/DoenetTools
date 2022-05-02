import {selectedMenuPanelAtom} from "../Panels/NewMenuPanel.js";
import {globalSelectedNodesAtom} from "../../_reactComponents/Drive/NewDrive.js";
import {drivecardSelectedNodesAtom} from "../ToolHandlers/CourseToolHandler.js";
import {useRecoilCallback} from "../../_snowpack/pkg/recoil.js";
export default function CourseChooserLeave() {
  const setSelections = useRecoilCallback(({set}) => () => {
    set(selectedMenuPanelAtom, "");
    set(globalSelectedNodesAtom, []);
    set(drivecardSelectedNodesAtom, []);
  });
  setSelections();
  return null;
}
