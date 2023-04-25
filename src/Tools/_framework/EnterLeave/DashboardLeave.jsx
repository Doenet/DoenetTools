// import React from 'react';
import { selectedMenuPanelAtom } from "../Panels/NewMenuPanel";
import {
  globalSelectedNodesAtom,
  clearDriveAndItemSelections,
} from "../../../_reactComponents/Drive/NewDrive";
import { useRecoilCallback } from "recoil";

export default function DashboardLeave() {
  // console.log('>>>>DashbaordLeave');

  const setSelections = useRecoilCallback(({ set }) => () => {
    set(clearDriveAndItemSelections, null);
    set(globalSelectedNodesAtom, []);
    set(selectedMenuPanelAtom, "");
  });
  setSelections();
  return null;
}
