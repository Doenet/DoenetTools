import {selectedMenuPanelAtom} from "../Panels/NewMenuPanel.js";
import {globalSelectedNodesAtom, clearDriveAndItemSelections} from "../../_reactComponents/Drive/NewDrive.js";
import {useRecoilCallback} from "../../_snowpack/pkg/recoil.js";
export default function DashboardLeave() {
  const setSelections = useRecoilCallback(({set}) => () => {
    set(clearDriveAndItemSelections, null);
    set(globalSelectedNodesAtom, []);
    set(selectedMenuPanelAtom, "");
  });
  setSelections();
  return null;
}
