import React, {useState, lazy, Suspense} from "../_snowpack/pkg/react.js";
import {
  atom,
  useSetRecoilState,
  useRecoilValue,
  useRecoilCallback
} from "../_snowpack/pkg/recoil.js";
import {useMenuPanelController} from "./Panels/MenuPanel.js";
import {useSupportDividerController} from "./Panels/ContentPanel.js";
import Toast from "./Toast.js";
const layerStackAtom = atom({
  key: "layerStackAtom",
  default: []
});
export const useToolControlHelper = () => {
  const setLayers = useSetRecoilState(layerStackAtom);
  const activateMenuPanel = useMenuPanelController();
  const activateSupportPanel = useSupportDividerController();
  const Assignment = lazy(() => import("./Overlays/Assignment.js"));
  const Editor = lazy(() => import("./Overlays/Editor.js"));
  const Image = lazy(() => import("./Overlays/Image.js"));
  const Calendar = lazy(() => import("./Overlays/Calendar.js"));
  const openOverlay = ({
    type,
    title,
    contentId,
    courseId,
    branchId,
    assignmentId
  }) => {
    switch (type.toLowerCase()) {
      case "editor":
        setLayers((old) => [
          ...old,
          /* @__PURE__ */ React.createElement(Editor, {
            branchId,
            title,
            key: `EditorLayer${old.length + 1}`
          })
        ]);
        break;
      case "assignment":
        setLayers((old) => [
          ...old,
          /* @__PURE__ */ React.createElement(Assignment, {
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
          /* @__PURE__ */ React.createElement(Calendar, {
            branchId,
            contentId,
            key: `CalendarLayer${old.length + 1}`
          })
        ]);
        break;
      case "image":
        setLayers((old) => [
          ...old,
          /* @__PURE__ */ React.createElement(Image, {
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
