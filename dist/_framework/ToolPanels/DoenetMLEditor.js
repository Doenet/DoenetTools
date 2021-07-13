import React, {useRef} from "../../_snowpack/pkg/react.js";
import {editorDoenetIdInitAtom, textEditorDoenetMLAtom} from "./EditorViewer.js";
import {
  useRecoilValue,
  useRecoilState,
  useRecoilCallback
} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import CodeMirror from "../CodeMirror.js";
import {itemHistoryAtom, fileByContentId} from "../ToolHandlers/CourseToolHandler.js";
import sha256 from "../../_snowpack/pkg/crypto-js/sha256.js";
import CryptoJS from "../../_snowpack/pkg/crypto-js.js";
import axios from "../../_snowpack/pkg/axios.js";
import {nanoid} from "../../_snowpack/pkg/nanoid.js";
const getSHAofContent = (doenetML) => {
  if (doenetML === void 0) {
    return;
  }
  let contentId = sha256(doenetML).toString(CryptoJS.enc.Hex);
  return contentId;
};
function buildTimestamp() {
  const dt = new Date();
  return `${dt.getFullYear().toString().padStart(2, "0")}-${(dt.getMonth() + 1).toString().padStart(2, "0")}-${dt.getDate().toString().padStart(2, "0")} ${dt.getHours().toString().padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}:${dt.getSeconds().toString().padStart(2, "0")}`;
}
export default function DoenetMLEditor(props) {
  console.log(">>>===DoenetMLEditor");
  const [editorDoenetML, setEditorDoenetML] = useRecoilState(textEditorDoenetMLAtom);
  const paramDoenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const initilizedDoenetId = useRecoilValue(editorDoenetIdInitAtom);
  let editorRef = useRef(null);
  let timeout = useRef(null);
  let autosavetimeout = useRef(null);
  const saveDraft = useRecoilCallback(({snapshot, set}) => async (doenetId) => {
    const doenetML = await snapshot.getPromise(textEditorDoenetMLAtom);
    const oldVersions = await snapshot.getPromise(itemHistoryAtom(doenetId));
    let newDraft = {...oldVersions.draft};
    const contentId = getSHAofContent(doenetML);
    newDraft.contentId = contentId;
    newDraft.timestamp = buildTimestamp();
    let oldVersionsReplacement = {...oldVersions};
    oldVersionsReplacement.draft = newDraft;
    set(itemHistoryAtom(doenetId), oldVersionsReplacement);
    set(fileByContentId(contentId), doenetML);
    localStorage.setItem(contentId, doenetML);
    let newDBVersion = {
      ...newDraft,
      doenetML,
      doenetId
    };
    axios.post("/api/saveNewVersion.php", newDBVersion);
  });
  const autoSave = useRecoilCallback(({snapshot, set}) => async (doenetId) => {
    const doenetML = await snapshot.getPromise(textEditorDoenetMLAtom);
    const contentId = getSHAofContent(doenetML);
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
    const oldVersions = await snapshot.getPromise(itemHistoryAtom(doenetId));
    let newVersions = {...oldVersions};
    newVersions.autoSaves = [newVersion, ...oldVersions.autoSaves];
    set(itemHistoryAtom(doenetId), newVersions);
    set(fileByContentId(contentId), doenetML);
    axios.post("/api/saveNewVersion.php", newDBVersion).then((resp) => {
      console.log(">>>resp autoSave", resp.data);
    });
  });
  if (props.style.display === "none") {
    return /* @__PURE__ */ React.createElement("div", {
      style: props.style
    });
  }
  if (paramDoenetId !== initilizedDoenetId) {
    return /* @__PURE__ */ React.createElement("div", {
      style: props.style
    });
  }
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement(CodeMirror, {
    editorRef,
    value: editorDoenetML,
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
