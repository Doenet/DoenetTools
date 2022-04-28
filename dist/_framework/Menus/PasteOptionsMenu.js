import React from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {copiedCourseItems, cutCourseItems, useCourse} from "../../_reactComponents/Course/CourseActions.js";
import ActionButton from "../../_reactComponents/PanelHeaderComponents/ActionButton.js";
import {useToast, toastType} from "../Toast.js";
export default function PasteOptionsMenu() {
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const {pasteItems} = useCourse(courseId);
  const addToast = useToast();
  let cutObjs = useRecoilValue(cutCourseItems);
  let copiedObjs = useRecoilValue(copiedCourseItems);
  if (cutObjs.length == 0 && copiedObjs.length == 0) {
    return /* @__PURE__ */ React.createElement("div", null, "No Items To Paste");
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ActionButton, {
    width: "menu",
    value: "Paste",
    onClick: () => {
      pasteItems({
        successCallback: () => {
          addToast("Items Pasted!", toastType.INFO);
        },
        failureCallback: (message) => {
          addToast(message, toastType.INFO);
        }
      });
    }
  }));
}
