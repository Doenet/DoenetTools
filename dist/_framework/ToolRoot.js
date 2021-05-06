import React, {useState, lazy, Suspense, useRef} from "../_snowpack/pkg/react.js";
import {
  atom,
  useSetRecoilState,
  useRecoilValue,
  useRecoilCallback
} from "../_snowpack/pkg/recoil.js";
import Toast from "./Toast.js";
import {useMenuPanelController} from "./Panels/MenuPanel.js";
import {useSupportDividerController} from "./Panels/ContentPanel.js";
import Cookies from "../_snowpack/pkg/js-cookie.js";
import axios from "../_snowpack/pkg/axios.js";
const layerStackAtom = atom({
  key: "layerStackAtom",
  default: []
});
export const useToolControlHelper = () => {
  const setLayers = useSetRecoilState(layerStackAtom);
  const activateMenuPanel = useMenuPanelController();
  const activateSupportPanel = useSupportDividerController();
  const [
    Content,
    Assignment,
    Editor,
    Image,
    Calendar,
    GradebookAssignmentView,
    GradebookAttemptView
  ] = useRef([
    lazy(() => import("./Overlays/Content.js")),
    lazy(() => import("./Overlays/Assignment.js")),
    lazy(() => import("./Overlays/Editor.js")),
    lazy(() => import("./Overlays/Image.js")),
    lazy(() => import("./Overlays/Calendar.js")),
    lazy(() => import("./Overlays/GradebookAssignmentView.js")),
    lazy(() => import("./Overlays/GradebookAttemptView.js"))
  ]).current;
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
            assignmentId,
            key: `GBAssign${old.length + 1}`
          })
        ]);
        break;
      case "gradebookattemptview":
        setLayers((old) => [
          ...old,
          /* @__PURE__ */ React.createElement(GradebookAttemptView, {
            assignmentId,
            userId,
            attemptNumber,
            key: `GBView${old.length + 1}`
          })
        ]);
        break;
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
      case "content":
        setLayers((old) => [
          ...old,
          /* @__PURE__ */ React.createElement(Content, {
            contentId,
            branchId,
            title,
            key: `ContentLayer${old.length + 1}`
          })
        ]);
        break;
      case "assignment":
        setLayers((old) => [
          ...old,
          /* @__PURE__ */ React.createElement(Assignment, {
            branchId,
            title,
            assignmentId,
            courseId,
            contentId,
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
export const ProfileContext = React.createContext({});
export default function ToolRoot({tool}) {
  const overlays = useRecoilValue(layerStackAtom);
  const [_, setRefresh] = useState(0);
  const profile = JSON.parse(localStorage.getItem("Profile"));
  if (!profile) {
    axios.get("/api/loadProfile.php", {params: {}}).then((resp) => {
      if (resp.data.success === "1") {
        localStorage.setItem("Profile", JSON.stringify(resp.data.profile));
        setRefresh((was) => was + 1);
      }
    }).catch((error) => {
    });
    return null;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ProfileContext.Provider, {
    value: profile
  }, tool, /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement("div", null, "loading...")
  }, overlays.map((layer, idx) => idx == overlays.length - 1 ? layer : null)), /* @__PURE__ */ React.createElement(Toast, null)));
}
