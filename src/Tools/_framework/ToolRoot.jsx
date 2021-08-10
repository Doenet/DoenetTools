import React, { useState, lazy, Suspense, useRef } from 'react';
import {
  atom,
  selector,
  useSetRecoilState,
  useRecoilValue,
  useRecoilCallback,
  useRecoilValueLoadable,
} from 'recoil';
import styled from 'styled-components';
import Toast from './Toast';
import { useMenuPanelController } from './Panels/MenuPanel';
import { useSupportDividerController } from './Panels/ContentPanel';
import axios from 'axios';
// import { GlobalStyle } from "../../Tools/DoenetStyle";

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
  key: 'layerStackAtom',
  default: [],
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
    GradebookAttemptView,
  ] = useRef([
    lazy(() => import('./Overlays/Content')),
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
    doenetId,
    assignmentId,
    attemptNumber,
    userId,
    driveId,
    folderId,
    itemId,
  }) => {
    switch (type.toLowerCase()) {
      case 'gradebookassignmentview':
        setLayers((old) => [
          ...old,
          <GradebookAssignmentView
            doenetId={doenetId}
            key={`GBAssign${old.length + 1}`}
          />,
        ]);
        break;
      case 'gradebookattemptview':
        setLayers((old) => [
          ...old,
          <GradebookAttemptView
            doenetId={doenetId}
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
            doenetId={doenetId}
            title={title}
            driveId={driveId}
            folderId={folderId}
            itemId={itemId}
            key={`EditorLayer${old.length + 1}`}
          />,
        ]);
        break;
      case 'content':
        setLayers((old) => [
          ...old,
          <Content
            contentId={contentId}
            doenetId={doenetId}
            title={title}
            key={`ContentLayer${old.length + 1}`}
          />,
        ]);
        break;
      case 'assignment':
        setLayers((old) => [
          ...old,
          <Assignment
            doenetId={doenetId}
            title={title}
            assignmentId={assignmentId}
            courseId={courseId}
            contentId={contentId}
            key={`AssignmentLayer${old.length + 1}`}
          />,
        ]);
        break;
      case 'calendar':
        setLayers((old) => [
          ...old,
          <Calendar
            doenetId={doenetId}
            contentId={contentId}
            key={`CalendarLayer${old.length + 1}`}
          />,
        ]);
        break;
      case 'image':
        setLayers((old) => [
          ...old,
          <Image doenetId={doenetId} key={`ImageLayer${old.length + 1}`} />,
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

export const profileAtom = atom({
  key: "profileAtom",
  default: selector({
      key: "profileAtom/Default",
      get: async () => {
          try{
              const profile = JSON.parse(localStorage.getItem('Profile'));
              if (profile){
                return profile;
              }
              //It wasn't stored in local storage so load it from server
              const { data } = await axios.get('/api/loadProfile.php')
              localStorage.setItem('Profile', JSON.stringify(data.profile));
              return data.profile
          }catch(error){
              console.log("Error loading user profile", error.message);                
              return {}
          }
      }
  })
})

export default function ToolRoot({ tool }) {
  const overlays = useRecoilValue(layerStackAtom);

  const profile = useRecoilValueLoadable(profileAtom)

  if (profile.state === "loading"){ return null;}
    if (profile.state === "hasError"){ 
      console.error(profile.contents)
      return null;}

// console.log(">>>ToolRoot profile.contents",profile.contents)
  return (
    <ProfileContext.Provider value={profile.contents}>
      {/* <GlobalStyle /> */}

      {tool}
      <Suspense fallback={<LoadingFallback>Loading...</LoadingFallback>}>
        {overlays.map((layer, idx) =>
          idx == overlays.length - 1 ? layer : null,
        )}
      </Suspense>
      <Toast />
    </ProfileContext.Provider>
  );
}

// const [_, setRefresh] = useState(0);

// const profile = JSON.parse(localStorage.getItem('Profile'));

  //Need profile before rendering any tools
  // if (!profile) {
    //If doesn't exist then we need to load the profile from the server
    // axios
    //   .get('/api/loadProfile.php', { params: {} })
    //   .then((resp) => {
    //     if (resp.data.success === '1') {
    //       // console.log(">>>resp.data.profile",resp.data.profile)
    //       localStorage.setItem('Profile', JSON.stringify(resp.data.profile));
    //       setRefresh((was) => was + 1);
    //     }
    //   })
    //   .catch((error) => {
    //     //  Error currently does nothing
    //   });

  //   return null;
  // }