import React, {useState, lazy, Suspense} from "../_snowpack/pkg/react.js";
import {
  atom,
  useSetRecoilState,
  useRecoilValue,
  useRecoilCallback
} from "../_snowpack/pkg/recoil.js";
import Assignment from "./Overlays/Assignment.js";
import Editor from "./Overlays/Editor.js";
import Calendar from "./Overlays/Calendar.js";
import Image from "./Overlays/Image.js";
import Toast from "./Toast.js";
import GradebookAssignmentView from "./Overlays/GradebookAssignmentView.js";
import GradebookAttemptView from "./Overlays/GradebookAttemptView.js";
import {useMenuPanelController} from "./Panels/MenuPanel.js";
import {useSupportDividerController} from "./Panels/ContentPanel.js";
const layerStackAtom = atom({
  key: "layerStackAtom",
  default: []
});
export const useToolControlHelper = () => {
  const setLayers = useSetRecoilState(layerStackAtom);
  const activateMenuPanel = useMenuPanelController();
  const activateSupportPanel = useSupportDividerController();
  const Assignment2 = lazy(() => import("./Overlays/Assignment.js"));
  const Editor2 = lazy(() => import("./Overlays/Editor.js"));
  const Image2 = lazy(() => import("./Overlays/Image.js"));
  const Calendar2 = lazy(() => import("./Overlays/Calendar.js"));
  const openOverlay = ({
    type,
    title,
    contentId,
    courseId,
    branchId,
    assignmentId,
    attemptNumber,
    userId
  }) => {
    switch (type.toLowerCase()) {
      case "gradebookassignmentview":
        setLayers((old) => [
          ...old,
          /* @__PURE__ */ React.createElement(GradebookAssignmentView, {
            assignmentId
          })
        ]);
        break;
      case "gradebookattemptview":
        console.log(assignmentId, userId, attemptNumber);
        setLayers((old) => [
          ...old,
          /* @__PURE__ */ React.createElement(GradebookAttemptView, {
            assignmentId,
            userId,
            attemptNumber
          })
        ]);
        break;
      case "editor":
        setLayers((old) => [
          ...old,
          /* @__PURE__ */ React.createElement(Editor2, {
            branchId,
            title,
            key: `EditorLayer${old.length + 1}`
          })
        ]);
        break;
      case "assignment":
        setLayers((old) => [
          ...old,
          /* @__PURE__ */ React.createElement(Assignment2, {
            branchId,
            assignmentId,
            courseId,
            key: `AssignmentLayer${old.length + 1}`
          })
        ]);
        break;
      case "calendar":
        setLayers((old) => [
          ...old,
          /* @__PURE__ */ React.createElement(Calendar2, {
            branchId,
            contentId,
            key: `CalendarLayer${old.length + 1}`
          })
        ]);
        break;
      case "image":
        setLayers((old) => [
          ...old,
          /* @__PURE__ */ React.createElement(Image2, {
            branchId,
            key: `ImageLayer${old.length + 1}`
          })
        ]);
        break;
      default:
        console.error("Unknown Overlay Name");
    }
  };
  const close = () => {
    setLayers((old) => {
      const newArray = [...old];
      newArray.pop();
      return newArray;
    });
  };
  return {
    openOverlay,
    close,
    activateMenuPanel,
    activateSupportPanel
  };
};
export const useStackId = () => {
  const getId = useRecoilCallback(({snapshot}) => () => {
    const currentId = snapshot.getLoadable(layerStackAtom);
    return currentId.getValue().length;
  });
  const [stackId] = useState(() => getId());
  return stackId;
};
export default function ToolRoot({tool}) {
  const overlays = useRecoilValue(layerStackAtom);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, tool, /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement("div", null, "loading...")
  }, overlays.map((layer, idx) => idx == overlays.length - 1 ? layer : null)), /* @__PURE__ */ React.createElement(Toast, null));
}
