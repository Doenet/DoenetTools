import React, { useState, lazy, Suspense, useRef } from 'react';
import {
  atom,
  useSetRecoilState,
  useRecoilValue,
  useRecoilCallback,
} from 'recoil';
import Toast from './Toast';
import { useMenuPanelController } from './Panels/MenuPanel';
import { useSupportDividerController } from './Panels/ContentPanel';
import Cookies from 'js-cookie';
import axios from 'axios';

//import Toast from './Toast';
// import { GlobalStyle } from "../../Tools/DoenetStyle";

const layerStackAtom = atom({
  key: 'layerStackAtom',
  default: [],
});

export const useToolControlHelper = () => {
  const setLayers = useSetRecoilState(layerStackAtom);
  const activateMenuPanel = useMenuPanelController();
  const activateSupportPanel = useSupportDividerController();
  const [
    Assignment,
    Editor,
    Image,
    Calendar,
    GradebookAssignmentView,
    GradebookAttemptView,
  ] = useRef([
    lazy(() => import('./Overlays/Assignment')),
    lazy(() => import('./Overlays/Editor')),
    lazy(() => import('./Overlays/Image')),
    lazy(() => import('./Overlays/Calendar')),
    lazy(() => import('./Overlays/GradebookAssignmentView')),
    lazy(() => import('./Overlays/GradebookAttemptView')),
  ]).current;
  const openOverlay = ({
    type,
    title,
    contentId,
    courseId,
    branchId,
    assignmentId,
    attemptNumber,
    userId,
  }) => {
    switch (type.toLowerCase()) {
      case 'gradebookassignmentview':
        setLayers((old) => [
          ...old,
          <GradebookAssignmentView
            assignmentId={assignmentId}
            key={`GBAssign${old.length + 1}`}
          />,
        ]);
        break;
      case 'gradebookattemptview':
        setLayers((old) => [
          ...old,
          <GradebookAttemptView
            assignmentId={assignmentId}
            userId={userId}
            attemptNumber={attemptNumber}
            key={`GBView${old.length + 1}`}
          />,
        ]);
        break;
      case 'editor':
        setLayers((old) => [
          ...old,
          <Editor
            branchId={branchId}
            title={title}
            key={`EditorLayer${old.length + 1}`}
          />,
        ]);
        break;
      case 'assignment':
        setLayers((old) => [
          ...old,
          <Assignment
            branchId={branchId}
            assignmentId={assignmentId}
            courseId={courseId}
            key={`AssignmentLayer${old.length + 1}`}
          />,
        ]);
        break;
      case 'calendar':
        setLayers((old) => [
          ...old,
          <Calendar
            branchId={branchId}
            contentId={contentId}
            key={`CalendarLayer${old.length + 1}`}
          />,
        ]);
        break;
      case 'image':
        setLayers((old) => [
          ...old,
          <Image branchId={branchId} key={`ImageLayer${old.length + 1}`} />,
        ]);
        break;
      default:
        console.error('Unknown Overlay Name');
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
    activateSupportPanel,
  };
};

export const useStackId = () => {
  const getId = useRecoilCallback(({ snapshot }) => () => {
    const currentId = snapshot.getLoadable(layerStackAtom);
    return currentId.getValue().length;
  });
  const [stackId] = useState(() => getId());
  return stackId;
};

export const ProfileContext = React.createContext({});

export default function ToolRoot({ tool }) {
  const overlays = useRecoilValue(layerStackAtom);
  const [_, setRefresh] = useState(0);

  const profile = JSON.parse(localStorage.getItem('Profile'));

  //Need profile before rendering any tools
  if (!profile) {
    //If doesn't exist then we need to load the profile from the server
    axios
      .get('/api/loadProfile.php', { params: {} })
      .then((resp) => {
        console.log(resp);
        if (resp.data.success === '1') {
          // console.log(">>>resp.data.profile",resp.data.profile)
          localStorage.setItem('Profile', JSON.stringify(resp.data.profile));
          setRefresh((was) => was + 1);
        }
      })
      .catch((error) => {
        console.log(error);
        //  Error currently does nothing
      });

    return null;
  }

  return (
    <>
      <ProfileContext.Provider value={profile}>
        {/* <GlobalStyle /> */}

        {tool}
        <Suspense fallback={<div>loading...</div>}>
          {overlays.map((layer, idx) =>
            idx == overlays.length - 1 ? layer : null,
          )}
        </Suspense>
        <Toast />
      </ProfileContext.Provider>
    </>
  );
}
