import React, {useRef, useEffect} from "../../_snowpack/pkg/react.js";
import {editorDoenetIdInitAtom, textEditorDoenetMLAtom, updateTextEditorDoenetMLAtom} from "./EditorViewer.js";
import {
  atom,
  useRecoilValue,
  useSetRecoilState,
  useRecoilCallback
} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {currentDraftSelectedAtom} from "../Menus/VersionHistory.js";
import CodeMirror from "../CodeMirror.js";
import {itemHistoryAtom, fileByContentId} from "../ToolHandlers/CourseToolHandler.js";
import axios from "../../_snowpack/pkg/axios.js";
import {nanoid} from "../../_snowpack/pkg/nanoid.js";
import {CIDFromDoenetML} from "../../core/utils/cid.js";
export const editorSaveTimestamp = atom({
  key: "",
  default: null
});
function buildTimestamp() {
  const dt = new Date();
  return `${dt.getFullYear().toString().padStart(2, "0")}-${(dt.getMonth() + 1).toString().padStart(2, "0")}-${dt.getDate().toString().padStart(2, "0")} ${dt.getHours().toString().padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}:${dt.getSeconds().toString().padStart(2, "0")}`;
}
export default function DoenetMLEditor(props) {
  console.log(">>>===DoenetMLEditor");
  const setEditorDoenetML = useSetRecoilState(textEditorDoenetMLAtom);
  const updateInternalValue = useRecoilValue(updateTextEditorDoenetMLAtom);
  const paramDoenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const initilizedDoenetId = useRecoilValue(editorDoenetIdInitAtom);
  const isCurrentDraft = useRecoilValue(currentDraftSelectedAtom);
  let editorRef = useRef(null);
  let timeout = useRef(null);
  let autosavetimeout = useRef(null);
  const saveDraft = useRecoilCallback(({snapshot, set}) => async (doenetId) => {
    const isCurrentDraft2 = await snapshot.getPromise(currentDraftSelectedAtom);
    if (isCurrentDraft2) {
      const doenetML = await snapshot.getPromise(textEditorDoenetMLAtom);
      const oldVersions = await snapshot.getPromise(itemHistoryAtom(doenetId));
      let newDraft = {...oldVersions.draft};
      const contentId = await CIDFromDoenetML(doenetML);
      newDraft.contentId = contentId;
      newDraft.timestamp = buildTimestamp();
      set(itemHistoryAtom(doenetId), (was) => {
        let asyncDraft = {...was.draft};
        asyncDraft.contentId = contentId;
        asyncDraft.timestamp = newDraft.timestamp;
        let asyncReplacement = {...was};
        asyncReplacement.draft = asyncDraft;
        return asyncReplacement;
      });
      set(fileByContentId(contentId), doenetML);
      let newDBVersion = {
        ...newDraft,
        doenetML,
        doenetId
      };
      try {
        const {data} = await axios.post("/api/saveNewVersion.php", newDBVersion);
        if (data.success) {
          set(editorSaveTimestamp, new Date());
        } else {
          console.log("ERROR", data.message);
        }
      } catch (error) {
        console.log("ERROR", error);
      }
    }
  }, []);
  const autoSave = useRecoilCallback(({snapshot, set}) => async (doenetId) => {
    const doenetML = await snapshot.getPromise(textEditorDoenetMLAtom);
    const contentId = await CIDFromDoenetML(doenetML);
    const timestamp = buildTimestamp();
    const versionId = nanoid();
    let newVersion = {
      contentId,
      versionId,
      timestamp,
      isDraft: "0",
      isNamed: "0",
      isReleased: "0",
      title: "Autosave"
    };
    let newDBVersion = {
      ...newVersion,
      doenetML,
      doenetId
    };
    set(itemHistoryAtom(doenetId), (was) => {
      let newVersions = {...was};
      newVersions.autoSaves = [newVersion, ...was.autoSaves];
      return newVersions;
    });
    set(fileByContentId(contentId), doenetML);
    try {
      const resp = await axios.post("/api/saveNewVersion.php", newDBVersion);
      if (resp.data.success) {
        set(editorSaveTimestamp, new Date());
      } else {
        console.log("ERROR", resp.data.message);
      }
    } catch (error) {
      console.log("ERROR", error);
    }
  });
  useEffect(() => {
    return () => {
      if (initilizedDoenetId !== "") {
        saveDraft(initilizedDoenetId);
        if (timeout.current !== null) {
          clearTimeout(timeout.current);
        }
        if (autosavetimeout.current !== null) {
          autoSave(initilizedDoenetId);
          clearTimeout(autosavetimeout.current);
        }
        autosavetimeout.current = null;
        timeout.current = null;
      }
    };
  }, [initilizedDoenetId, saveDraft, autoSave]);
  if (paramDoenetId !== initilizedDoenetId) {
    return null;
  }
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(CodeMirror, {
    key: "codemirror",
    editorRef,
    setInternalValue: updateInternalValue,
    readOnly: !isCurrentDraft,
    onBeforeChange: (value) => {
      setEditorDoenetML(value);
      if (timeout.current === null) {
        timeout.current = setTimeout(function() {
          saveDraft(initilizedDoenetId);
          timeout.current = null;
        }, 3e3);
      }
      if (autosavetimeout.current === null) {
        autosavetimeout.current = setTimeout(function() {
          autoSave(initilizedDoenetId);
          autosavetimeout.current = null;
        }, 6e4);
      }
    }
  }));
}
