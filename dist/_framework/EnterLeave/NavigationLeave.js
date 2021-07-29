import {selectedMenuPanelAtom} from "../Panels/NewMenuPanel.js";
import {globalSelectedNodesAtom} from "../../_reactComponents/Drive/NewDrive.js";
import {useRecoilCallback} from "../../_snowpack/pkg/recoil.js";
export default function NavigationLeave() {
  console.log(">>>===NavigationLeave");
  const setSelections = useRecoilCallback(({set}) => () => {
    set(selectedMenuPanelAtom, "");
    set(globalSelectedNodesAtom, []);
  });
  setSelections();
  return null;
}
