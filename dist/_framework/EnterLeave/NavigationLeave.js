import {selectedMenuPanelAtom} from "../Panels/NewMenuPanel.js";
import {useRecoilCallback} from "../../_snowpack/pkg/recoil.js";
import {authorItemByDoenetId, copiedCourseItems, cutCourseItems, selectedCourseItems} from "../../_reactComponents/Course/CourseActions.js";
export default function NavigationLeave() {
  const clearSelections = useRecoilCallback(({set, snapshot}) => async () => {
    let selectedDoenentIds = await snapshot.getPromise(selectedCourseItems);
    for (let doenetId of selectedDoenentIds) {
      set(authorItemByDoenetId(doenetId), (prev) => {
        let next = {...prev};
        next.isSelected = false;
        return next;
      });
    }
    set(selectedCourseItems, []);
    set(selectedMenuPanelAtom, "");
    let cutObjs = await snapshot.getPromise(cutCourseItems);
    for (let cutObj of cutObjs) {
      set(authorItemByDoenetId(cutObj.doenetId), (prev) => {
        let next = {...prev};
        next["isBeingCut"] = false;
        return next;
      });
    }
    set(cutCourseItems, []);
    set(copiedCourseItems, []);
  });
  clearSelections();
  return null;
}
