import { atom } from "recoil";

export const viewerDoenetMLAtom = atom({
  key: "viewerDoenetMLAtom",
  default: "",
});

export const textEditorDoenetMLAtom = atom({
  key: "textEditorDoenetMLAtom",
  default: "",
});

export const textEditorLastKnownCidAtom = atom({
  key: "textEditorLastKnownCidAtom",
  default: "",
});

export const updateTextEditorDoenetMLAtom = atom({
  key: "updateTextEditorDoenetMLAtom",
  default: "",
});

// TODO: change to pageId
//Boolean initialized editor tool start up
export const editorPageIdInitAtom = atom({
  key: "editorPageIdInitAtom",
  default: "",
});

export const refreshNumberAtom = atom({
  key: "refreshNumberAtom",
  default: 0,
});

export const editorViewerErrorStateAtom = atom({
  key: "editorViewerErrorStateAtom",
  default: false,
});
