import React from "../../_snowpack/pkg/react.js";
import {useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {itemByDoenetId, copiedCourseItems, cutCourseItems, selectedCourseItems, useCourse} from "../../_reactComponents/Course/CourseActions.js";
import ActionButton from "../../_reactComponents/PanelHeaderComponents/ActionButton.js";
import {useToast, toastType} from "../Toast.js";
import ActionButtonGroup from "../../_reactComponents/PanelHeaderComponents/ActionButtonGroup.js";
export default function CutCopyPasteMenu() {
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const {copyItems, cutItems, pasteItems} = useCourse(courseId);
  const addToast = useToast();
  let cutObjs = useRecoilValue(cutCourseItems);
  let copiedObjs = useRecoilValue(copiedCourseItems);
  let selectedItems = useRecoilValue(selectedCourseItems);
  let canCopy = true;
  let canCut = true;
  let canPaste = true;
  if (cutObjs.length == 0 && copiedObjs.length == 0) {
    canPaste = false;
  }
  if (selectedItems.length == 0) {
    canCopy = false;
    canCut = false;
  }
  let copyJSX = /* @__PURE__ */ React.createElement(ActionButton, {
    width: "menu",
    value: "Copy",
    disabled: !canCopy,
    onClick: () => {
      copyItems({
        successCallback: () => {
        },
        failureCallback: (message) => {
          addToast(message, toastType.INFO);
        }
      });
    }
  });
  let cutJSX = /* @__PURE__ */ React.createElement(ActionButton, {
    width: "menu",
    value: "Cut",
    disabled: !canCut,
    onClick: () => {
      cutItems({
        successCallback: () => {
        },
        failureCallback: (message) => {
          addToast(message, toastType.INFO);
        }
      });
    }
  });
  let pasteJSX = /* @__PURE__ */ React.createElement(ActionButton, {
    width: "menu",
    value: "Paste",
    disabled: !canPaste,
    onClick: () => {
      pasteItems({
        successCallback: () => {
        },
        failureCallback: (message) => {
          addToast(message, toastType.INFO);
        }
      });
    }
  });
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ActionButtonGroup, {
    width: "menu"
  }, cutJSX, pasteJSX));
}
