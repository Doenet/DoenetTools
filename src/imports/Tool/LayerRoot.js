import React, { useState } from "react";
import {
  atom,
  useSetRecoilState,
  useRecoilValue,
  useRecoilCallback,
} from "recoil";
import Assignment from "./Overlays/Assignment";
import Editor from "./Overlays/Editor";
import Calendar from "./Overlays/Calendar";
import Image from "./Overlays/Image";
import "./temp.css";

const layerStackAtom = atom({
  key: "layerStackAtom",
  default: [],
});

export const useLayerControlHelper = () => {
  const setLayers = useSetRecoilState(layerStackAtom);
  const open = (name, branchId, courseId, assignmentId) => {
    switch (name.toLowerCase()) {
      case "editor":
        setLayers((old) => [
          ...old,
          <Editor
            branchId={branchId}
            contentId={courseId}
            key={`EditorLayer${old.length + 1}`}
          />,
        ]);
        break;
      case "assignment":
        setLayers((old) => [
          ...old,
          <Assignment
            branchId={branchId}
            contentId={courseId}
            assignmentId={assignmentId}
            key={`AssignmentLayer${old.length + 1}`}
          />,
        ]);
        break;
      case "calendar":
        setLayers((old) => [
          ...old,
          <Calendar
            branchId={branchId}
            contentId={courseId}
            key={`CalendarLayer${old.length + 1}`}
          />,
        ]);
        break;
      case "image":
        setLayers((old) => [
          ...old,
          <Image
            branchId={branchId}
            contentId={courseId}
            key={`ImageLayer${old.length + 1}`}
          />,
        ]);
        break;
      default:
        console.error("Unknown Overlay Name");
      // throw new Error("Unknown Overlay Name");
    }
  };

  const close = () => {
    setLayers((old) => {
      const newArray = [...old];
      newArray.pop();
      return newArray;
    });
  };
  return { open, close };
};

export const useStackId = () => {
  const getId = useRecoilCallback(({ snapshot }) => () => {
    const currentId = snapshot.getLoadable(layerStackAtom);
    return currentId.getValue().length;
  });
  const [stackId] = useState(() => getId());
  return stackId;
};

export default function LayerRoot({ baseLayer }) {
  const overlays = useRecoilValue(layerStackAtom);

  return (
    <>
      {baseLayer}
      {overlays.map((layer) => layer)}
    </>
  );
}
