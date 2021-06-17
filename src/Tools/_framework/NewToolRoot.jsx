import React, { useState, lazy, Suspense, useRef, useEffect } from 'react';
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
import ContentPanel, { useSupportDividerController } from './Panels/NewContentPanel';
import axios from 'axios';
// import { GlobalStyle } from "../../Tools/DoenetStyle";

import MainPanel from './Panels/MainPanel';
import SupportPanel from './Panels/SupportPanel';
import MenuPanels from './Panels/MenuPanels';
import FooterPanel from './Panels/FooterPanel';
import { animated } from '@react-spring/web';


const ToolContainer = styled(animated.div)`
  display: grid;
  grid-template:
    'menuPanel contentPanel ' 1fr
    'menuPanel footerPanel ' auto
    / auto 1fr auto;
  width: 100vw;
  height: 100vh;
  background-color: #e2e2e2;
  position: fixed;
  top: 0;
  left: 0;
  padding: 0px;
  gap: 0px;
  box-sizing: border-box;
`;

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

export const panelRequestsAtom = atom({
  key: "panelRequestsAtom",
  default:{
    menuPanels:[],
    mainPanel:"",
    supportPanel:[],
  }
})

export default function ToolRoot(props){
  // console.log(">>>DoenetTool props",props)
  const profile = useRecoilValueLoadable(profileAtom)
  const panelRequests = useRecoilValue(panelRequestsAtom);

  useEffect(()=>{
    console.log(">>>panelRequests",panelRequests)
  },[panelRequests])

  if (profile.state === "loading"){ return null;}
    if (profile.state === "hasError"){ 
      console.error(profile.contents)
      return null;}

      console.log(">>>profile.contents",profile.contents)

  return <ProfileContext.Provider value={profile.contents}>
    <Toast />
    <ToolContainer>
      <MenuPanels />
      <ContentPanel 
      main={<MainPanel><h1>main</h1></MainPanel>} 
      support={<SupportPanel><h1>support</h1></SupportPanel>}
      />
      {/* <FooterPanel></FooterPanel> */}
    </ToolContainer>

  </ProfileContext.Provider>
}

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

// export const useToolControlHelper = () => {
//   const setLayers = useSetRecoilState(layerStackAtom);
//   const activateMenuPanel = useMenuPanelController();
//   const activateSupportPanel = useSupportDividerController();
//   const [
//     Content,
//     Assignment,
//     Editor,
//     Image,
//     Calendar,
//     GradebookAssignmentView,
//     GradebookAttemptView,
//   ] = useRef([
//     lazy(() => import('./Overlays/Content')),
//     lazy(() => import('./Overlays/Assignment')),
//     lazy(() => import('./Overlays/Editor')),
//     lazy(() => import('./Overlays/Image')),
//     lazy(() => import('./Overlays/Calendar')),
//     lazy(() => import('./Overlays/GradebookAssignmentView')),
//     lazy(() => import('./Overlays/GradebookAttemptView')),
//   ]).current;
//   const openOverlay = ({
//     type,
//     title,
//     contentId,
//     courseId,
//     doenetId,
//     assignmentId,
//     attemptNumber,
//     userId,
//     driveId,
//     folderId,
//     itemId,
//   }) => {
//     switch (type.toLowerCase()) {
//       case 'gradebookassignmentview':
//         setLayers((old) => [
//           ...old,
//           <GradebookAssignmentView
//             assignmentId={assignmentId}
//             key={`GBAssign${old.length + 1}`}
//           />,
//         ]);
//         break;
//       case 'gradebookattemptview':
//         setLayers((old) => [
//           ...old,
//           <GradebookAttemptView
//             assignmentId={assignmentId}
//             userId={userId}
//             attemptNumber={attemptNumber}
//             key={`GBView${old.length + 1}`}
//           />,
//         ]);
//         break;
//       case 'editor':
//         setLayers((old) => [
//           ...old,
//           <Editor
//             doenetId={doenetId}
//             title={title}
//             driveId={driveId}
//             folderId={folderId}
//             itemId={itemId}
//             key={`EditorLayer${old.length + 1}`}
//           />,
//         ]);
//         break;
//       case 'content':
//         setLayers((old) => [
//           ...old,
//           <Content
//             contentId={contentId}
//             doenetId={doenetId}
//             title={title}
//             key={`ContentLayer${old.length + 1}`}
//           />,
//         ]);
//         break;
//       case 'assignment':
//         setLayers((old) => [
//           ...old,
//           <Assignment
//             doenetId={doenetId}
//             title={title}
//             assignmentId={assignmentId}
//             courseId={courseId}
//             contentId={contentId}
//             key={`AssignmentLayer${old.length + 1}`}
//           />,
//         ]);
//         break;
//       case 'calendar':
//         setLayers((old) => [
//           ...old,
//           <Calendar
//             doenetId={doenetId}
//             contentId={contentId}
//             key={`CalendarLayer${old.length + 1}`}
//           />,
//         ]);
//         break;
//       case 'image':
//         setLayers((old) => [
//           ...old,
//           <Image doenetId={doenetId} key={`ImageLayer${old.length + 1}`} />,
//         ]);
//         break;
//       default:
//     }
//   };

//   const close = () => {
//     setLayers((old) => {
//       const newArray = [...old];
//       newArray.pop();
//       return newArray;
//     });
//   };

//   return {
//     openOverlay,
//     close,
//     activateMenuPanel,
//     activateSupportPanel,
//   };
// };

export const useStackId = () => {
  const getId = useRecoilCallback(({ snapshot }) => () => {
    const currentId = snapshot.getLoadable(layerStackAtom);
    return currentId.getValue().length;
  });
  const [stackId] = useState(() => getId());
  return stackId;
};



// export function ToolRoot({ tool }) {
//   const overlays = useRecoilValue(layerStackAtom);

//   const profile = useRecoilValueLoadable(profileAtom)

//   if (profile.state === "loading"){ return null;}
//     if (profile.state === "hasError"){ 
//       console.error(profile.contents)
//       return null;}

// // console.log(">>>ToolRoot profile.contents",profile.contents)
//   return (
//     <ProfileContext.Provider value={profile.contents}>
//       {/* <GlobalStyle /> */}

//       {tool}
//       <Suspense fallback={<LoadingFallback>Loading...</LoadingFallback>}>
//         {overlays.map((layer, idx) =>
//           idx == overlays.length - 1 ? layer : null,
//         )}
//       </Suspense>
//       <Toast />
//     </ProfileContext.Provider>
//   );
// }
