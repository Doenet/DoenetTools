import React, { useState } from 'react';
import {
  atom,
  useSetRecoilState,
  useRecoilValue,
  useRecoilCallback,
} from 'recoil';
import Assignment from './Overlays/Assignment';
import Editor from './Overlays/Editor';
import Calendar from './Overlays/Calendar';
import Image from './Overlays/Image';
import Toast from './Toast';
import { useMenuPanelController } from './Panels/MenuPanel';
import { useSupportDividerController } from './Panels/ContentPanel';
// import { GlobalStyle } from "../../Tools/DoenetStyle";

const layerStackAtom = atom({
  key: 'layerStackAtom',
  default: [],
});

export const useToolControlHelper = () => {
  const setLayers = useSetRecoilState(layerStackAtom);
  const activateMenuPanel = useMenuPanelController();
  const activateSupportPanel = useSupportDividerController();

  const openOverlay = ({
    type,
    title,
    contentId,
    courseId,
    branchId,
    assignmentId,
  }) => {
    switch (type.toLowerCase()) {
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

export default function ToolRoot({ tool }) {
  const overlays = useRecoilValue(layerStackAtom);

  return (
    <>
      {/* <GlobalStyle /> */}

      {tool}
      {overlays.map((layer, idx) =>
        idx == overlays.length - 1 ? layer : null,
      )}
      <Toast />
    </>
  );
}
