import React, {useState, lazy, Suspense, useRef} from "../_snowpack/pkg/react.js";
import {
  atom,
  selector,
  useSetRecoilState,
  useRecoilValue,
  useRecoilCallback,
  useRecoilValueLoadable
} from "../_snowpack/pkg/recoil.js";
import styled from "../_snowpack/pkg/styled-components.js";
import Toast from "./Toast.js";
import {useMenuPanelController} from "./Panels/MenuPanel.js";
import {useSupportDividerController} from "./Panels/ContentPanel.js";
import axios from "../_snowpack/pkg/axios.js";
const LoadingFallback = styled.div`
  background-color: hsl(0, 0%, 99%);
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2em;
  width: 100vw;
  height: 100vh;
`;
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
    doenetId,
    assignmentId,
    attemptNumber,
    userId,
    driveId,
    folderId,
    itemId
  }) => {
    switch (type.toLowerCase()) {
      case "gradebookassignmentview":
        setLayers((old) => [
          ...old,
          /* @__PURE__ */ React.createElement(GradebookAssignmentView, {
            doenetId,
            key: `GBAssign${old.length + 1}`
          })
        ]);
        break;
      case "gradebookattemptview":
        setLayers((old) => [
          ...old,
          /* @__PURE__ */ React.createElement(GradebookAttemptView, {
            doenetId,
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
            doenetId,
            title,
            driveId,
            folderId,
            itemId,
            key: `EditorLayer${old.length + 1}`
          })
        ]);
        break;
      case "content":
        setLayers((old) => [
          ...old,
          /* @__PURE__ */ React.createElement(Content, {
            contentId,
            doenetId,
            title,
            key: `ContentLayer${old.length + 1}`
          })
        ]);
        break;
      case "assignment":
        setLayers((old) => [
          ...old,
          /* @__PURE__ */ React.createElement(Assignment, {
            doenetId,
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
            doenetId,
            contentId,
            key: `CalendarLayer${old.length + 1}`
          })
        ]);
        break;
      case "image":
        setLayers((old) => [
          ...old,
          /* @__PURE__ */ React.createElement(Image, {
            doenetId,
            key: `ImageLayer${old.length + 1}`
          })
        ]);
        break;
      default:
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
export const profileAtom = atom({
  key: "profileAtom",
  default: selector({
    key: "profileAtom/Default",
    get: async () => {
      try {
        const profile = JSON.parse(localStorage.getItem("Profile"));
        if (profile) {
          return profile;
        }
        const {data} = await axios.get("/api/loadProfile.php");
        localStorage.setItem("Profile", JSON.stringify(data.profile));
        return data.profile;
      } catch (error) {
        console.log("Error loading user profile", error.message);
        return {};
      }
    }
  })
});
export default function ToolRoot({tool}) {
  const overlays = useRecoilValue(layerStackAtom);
  const profile = useRecoilValueLoadable(profileAtom);
  if (profile.state === "loading") {
    return null;
  }
  if (profile.state === "hasError") {
    console.error(profile.contents);
    return null;
  }
  return /* @__PURE__ */ React.createElement(ProfileContext.Provider, {
    value: profile.contents
  }, tool, /* @__PURE__ */ React.createElement(Suspense, {
    fallback: /* @__PURE__ */ React.createElement(LoadingFallback, null, "Loading...")
  }, overlays.map((layer, idx) => idx == overlays.length - 1 ? layer : null)), /* @__PURE__ */ React.createElement(Toast, null));
}
