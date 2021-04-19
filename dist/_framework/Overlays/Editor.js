import React, {useEffect, useState, useRef} from "react";
import Tool from "../Tool.js";
import {useToolControlHelper} from "../ToolRoot.js";
import axios from "axios";
import sha256 from "crypto-js/sha256";
import CryptoJS from "crypto-js";
import VisibilitySensor from "react-visibility-sensor";
import Button from "../temp/Button.js";
import {nanoid} from "nanoid";
import {
  useRecoilValue,
  atom,
  atomFamily,
  selector,
  selectorFamily,
  useSetRecoilState,
  useRecoilState,
  useRecoilValueLoadable,
  useRecoilStateLoadable,
  useRecoilCallback
} from "recoil";
import {Controlled as CodeMirror} from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/xml/xml";
import "codemirror/theme/xq-light.css";
import "./Editor.css";
export const fileByContentId = atomFamily({
  key: "fileByContentId",
  default: selectorFamily({
    key: "fileByContentId/Default",
    get: (contentId) => async () => {
      if (!contentId) {
        return "";
      }
      return await axios.get(`/media/${contentId}.doenet`);
    }
  })
});
const editorDoenetMLAtom = atom({
  key: "editorDoenetMLAtom",
  default: ""
});
const viewerDoenetMLAtom = atom({
  key: "viewerDoenetMLAtom",
  default: {updateNumber: 0, doenetML: ""}
});
const itemHistoryAtom = atomFamily({
  key: "itemHistoryAtom",
  default: selectorFamily({
    key: "itemHistoryAtom/Default",
    get: (branchId) => async () => {
      if (!branchId) {
        return [];
      }
      const {data} = await axios.get(`/api/loadVersions.php?branchId=${branchId}`);
      console.log(">>>data", data);
      return data.versions;
    }
  })
});
const getSHAofContent = (doenetML) => {
  if (doenetML === void 0) {
    return;
  }
  let contentId = sha256(JSON.stringify(doenetML)).toString(CryptoJS.enc.Hex);
  return contentId;
};
const versionHistorySelectedAtom = atom({
  key: "versionHistorySelectedAtom",
  default: ""
});
const EditingVersionIdAtom = atom({
  key: "EditingVersionIdAtom",
  default: ""
});
function ReturnToEditingButton(props) {
  const selectedVersionId = useRecoilValue(versionHistorySelectedAtom);
  const returnToEditing = useRecoilCallback(({snapshot, set}) => async () => {
    set(versionHistorySelectedAtom, "");
    let loadableDoenetML = await snapshot.getPromise(fileByContentId(props.branchId));
    const doenetML = loadableDoenetML.data;
    set(editorDoenetMLAtom, doenetML);
    set(viewerDoenetMLAtom, (was) => {
      let newObj = {...was};
      newObj.doenetML = doenetML;
      newObj.updateNumber = was.updateNumber + 1;
      return newObj;
    });
  });
  if (selectedVersionId === "") {
    return null;
  }
  return /* @__PURE__ */ React.createElement(Button, {
    callback: () => returnToEditing(),
    value: "Return to editing"
  });
}
function VersionHistoryPanel(props) {
  const versionHistory = useRecoilValueLoadable(itemHistoryAtom(props.branchId));
  const selectedVersionId = useRecoilValue(versionHistorySelectedAtom);
  const [editingVersionId, setEditingVersionId] = useRecoilState(EditingVersionIdAtom);
  const saveNamedVersion = useRecoilCallback(({snapshot, set}) => async (branchId, versionId, newTitle) => {
    set(itemHistoryAtom(branchId), (was) => {
      let newHistory = [...was];
      let newVersion;
      for (const [i, version] of was.entries()) {
        if (versionId === version.versionId) {
          newVersion = {...version};
          newVersion.title = newTitle;
          newHistory.splice(i, 1, newVersion);
        }
      }
      let newDBVersion = {
        ...newVersion,
        isNewTitle: "1",
        branchId
      };
      axios.post("/api/saveNewVersion.php", newDBVersion);
      return newHistory;
    });
  });
  const versionHistorySelected = useRecoilCallback(({snapshot, set}) => async (version) => {
    set(versionHistorySelectedAtom, version.versionId);
    let loadableDoenetML = await snapshot.getPromise(fileByContentId(version.contentId));
    const doenetML = loadableDoenetML.data;
    set(editorDoenetMLAtom, doenetML);
    set(viewerDoenetMLAtom, (was) => {
      let newObj = {...was};
      newObj.doenetML = doenetML;
      newObj.updateNumber = was.updateNumber + 1;
      return newObj;
    });
  });
  const [editingTitleText, setEditingTitleText] = useState("");
  if (versionHistory.state === "loading") {
    return null;
  }
  if (versionHistory.state === "hasError") {
    console.error(versionHistory.contents);
    return null;
  }
  let versions = [];
  console.log(">>> versionHistory", versionHistory);
  console.log(">>> versionHistory.getValue()", versionHistory.getValue());
  for (let version of versionHistory.contents) {
    let titleText = version.title;
    let titleStyle = {};
    if (version.isDraft === "1") {
      titleText = "Current Version";
    }
    let drawer = null;
    let versionStyle = {};
    if (selectedVersionId === version.versionId) {
      versionStyle = {backgroundColor: "#b8d2ea"};
      titleStyle = {border: "1px solid black", padding: "1px"};
      drawer = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Button, {
        value: "Make a copy"
      })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Button, {
        value: "Delete Version"
      })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Button, {
        value: "Use as Current Version"
      })));
      if (version.isDraft === "1") {
        drawer = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Button, {
          value: "Make a copy"
        })));
      }
    }
    let title = /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", {
      onClick: () => {
        if (selectedVersionId === version.versionId) {
          setEditingVersionId(version.versionId);
          setEditingTitleText(titleText);
        }
      },
      style: titleStyle
    }, titleText));
    if (editingVersionId === version.versionId) {
      title = /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("input", {
        autoFocus: true,
        onBlur: () => {
          setEditingVersionId("");
          saveNamedVersion(props.branchId, version.versionId, editingTitleText);
        },
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            setEditingVersionId("");
            saveNamedVersion(props.branchId, version.versionId, editingTitleText);
          }
        },
        onChange: (e) => {
          setEditingTitleText(e.target.value);
        },
        value: editingTitleText,
        type: "text"
      }));
    }
    let jsx = /* @__PURE__ */ React.createElement(React.Fragment, {
      key: `history${version.versionId}`
    }, /* @__PURE__ */ React.createElement("div", {
      onClick: () => {
        if (version.versionId !== selectedVersionId) {
          versionHistorySelected(version);
        }
      },
      style: versionStyle
    }, title, /* @__PURE__ */ React.createElement("div", null, version.timestamp)));
    if (version.isDraft === "1") {
      versions.unshift(jsx);
    } else {
      versions.push(jsx);
    }
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, versions);
}
function buildTimestamp() {
  const dt = new Date();
  return `${dt.getFullYear().toString().padStart(2, "0")}-${(dt.getMonth() + 1).toString().padStart(2, "0")}-${dt.getDate().toString().padStart(2, "0")} ${dt.getHours().toString().padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}:${dt.getSeconds().toString().padStart(2, "0")}`;
}
function TextEditor(props) {
  const [editorDoenetML, setEditorDoenetML] = useRecoilState(editorDoenetMLAtom);
  const [selectedVersionId, setSelectedVersionId] = useRecoilState(versionHistorySelectedAtom);
  const saveDraft = useRecoilCallback(({snapshot, set}) => async (branchId) => {
    const doenetML = await snapshot.getPromise(editorDoenetMLAtom);
    const oldVersions = await snapshot.getPromise(itemHistoryAtom(props.branchId));
    let newVersion;
    for (const [i, version] of oldVersions.entries()) {
      if (version.isDraft === "1") {
        newVersion = {...version};
        break;
      }
    }
    newVersion.contentId = getSHAofContent(doenetML);
    newVersion.timestamp = buildTimestamp();
    let oldVersionsReplacement = [...oldVersions];
    oldVersionsReplacement[0] = newVersion;
    set(itemHistoryAtom(props.branchId), oldVersionsReplacement);
    set(fileByContentId(branchId), {data: doenetML});
    let newDBVersion = {
      ...newVersion,
      doenetML,
      branchId: props.branchId
    };
    axios.post("/api/saveNewVersion.php", newDBVersion);
  });
  const autoSave = useRecoilCallback(({snapshot, set}) => async () => {
    const doenetML = await snapshot.getPromise(editorDoenetMLAtom);
    const contentId = getSHAofContent(doenetML);
    const timestamp = buildTimestamp();
    const versionId = nanoid();
    let newVersion = {
      contentId,
      versionId,
      timestamp,
      isDraft: "0",
      isNamed: "0",
      title: "Autosave"
    };
    let newDBVersion = {
      ...newVersion,
      doenetML,
      branchId: props.branchId
    };
    const oldVersions = await snapshot.getPromise(itemHistoryAtom(props.branchId));
    set(itemHistoryAtom(props.branchId), [...oldVersions, newVersion]);
    set(fileByContentId(newVersion.contentId), {data: doenetML});
    axios.post("/api/saveNewVersion.php", newDBVersion);
  });
  const timeout = useRef(null);
  let editorRef = useRef(null);
  const autosavetimeout = useRef(null);
  let textValue = editorDoenetML;
  function clearSaveTimeouts() {
    if (timeout.current !== null) {
      clearTimeout(timeout.current);
      timeout.current = null;
      saveDraft(props.branchId);
    }
    if (autosavetimeout.current !== null) {
      clearTimeout(autosavetimeout.current);
    }
  }
  useEffect(() => {
    return () => {
      clearSaveTimeouts();
      setSelectedVersionId("");
    };
  }, []);
  if (selectedVersionId !== "") {
    clearSaveTimeouts();
    if (editorRef.current) {
      editorRef.current.options.readOnly = true;
    }
  } else {
    if (editorRef.current) {
      editorRef.current.options.readOnly = false;
    }
  }
  const editorInit = useRecoilValue(editorInitAtom);
  if (!editorInit) {
    return null;
  }
  const options = {
    mode: "xml",
    autoRefresh: true,
    theme: "xq-light",
    lineNumbers: true,
    indentUnit: 4,
    smartIndent: true,
    matchTags: true,
    matchBrackets: true,
    lineWrapping: true,
    extraKeys: {
      Tab: (cm) => {
        var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
        cm.replaceSelection(spaces);
      },
      Enter: (cm) => {
        cm.replaceSelection("\n");
        setTimeout(() => cm.execCommand("indentAuto"), 1);
      },
      "Ctrl-Space": "autocomplete"
    }
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(VisibilitySensor, {
    onChange: (visible) => {
      if (visible) {
        editorRef.current.refresh();
      }
    }
  }, /* @__PURE__ */ React.createElement(CodeMirror, {
    className: "CodeMirror",
    editorDidMount: (editor) => {
      editorRef.current = editor;
    },
    value: textValue,
    options,
    onBeforeChange: (editor, data, value) => {
      if (selectedVersionId === "") {
        setEditorDoenetML(value);
        if (timeout.current === null) {
          timeout.current = setTimeout(function() {
            saveDraft(props.branchId);
            timeout.current = null;
          }, 3e3);
        }
        if (autosavetimeout.current === null) {
          autosavetimeout.current = setTimeout(function() {
            autoSave();
            autosavetimeout.current = null;
          }, 6e4);
        }
      }
    }
  })));
}
function DoenetViewerUpdateButton() {
  const editorDoenetML = useRecoilValue(editorDoenetMLAtom);
  const setViewerDoenetML = useSetRecoilState(viewerDoenetMLAtom);
  const selectedVersionId = useRecoilValue(versionHistorySelectedAtom);
  if (selectedVersionId !== "") {
    return null;
  }
  return /* @__PURE__ */ React.createElement(Button, {
    value: "Update",
    callback: () => {
      setViewerDoenetML((old) => {
        let newInfo = {...old};
        newInfo.doenetML = editorDoenetML;
        newInfo.updateNumber = old.updateNumber + 1;
        return newInfo;
      });
    }
  });
}
function NameCurrentVersionControl(props) {
  const saveVersion = useRecoilCallback(({snapshot, set}) => async (branchId) => {
    const doenetML = await snapshot.getPromise(editorDoenetMLAtom);
    const timestamp = buildTimestamp();
    const contentId = getSHAofContent(doenetML);
    const versionId = nanoid();
    let newVersion = {
      title: "Named",
      versionId,
      timestamp,
      isDraft: "0",
      isNamed: "1",
      contentId
    };
    let newDBVersion = {
      ...newVersion,
      doenetML,
      branchId
    };
    const oldVersions = await snapshot.getPromise(itemHistoryAtom(branchId));
    set(itemHistoryAtom(branchId), [...oldVersions, newVersion]);
    set(fileByContentId(contentId), {data: doenetML});
    axios.post("/api/saveNewVersion.php", newDBVersion);
  });
  const selectedVersionId = useRecoilValue(versionHistorySelectedAtom);
  if (selectedVersionId !== "") {
    return null;
  }
  return /* @__PURE__ */ React.createElement(Button, {
    value: "Save Version",
    callback: () => saveVersion(props.branchId)
  });
}
function TempEditorHeaderBar(props) {
  return /* @__PURE__ */ React.createElement("div", {
    style: {height: "24px"}
  }, /* @__PURE__ */ React.createElement(NameCurrentVersionControl, {
    branchId: props.branchId
  }));
}
function DoenetViewerPanel() {
  const viewerDoenetML = useRecoilValue(viewerDoenetMLAtom);
  const editorInit = useRecoilValue(editorInitAtom);
  if (!editorInit) {
    return null;
  }
  let attemptNumber = 1;
  let requestedVariant = {index: attemptNumber};
  let assignmentId = "myassignmentid";
  let solutionDisplayMode = "button";
  return null;
}
const editorInitAtom = atom({
  key: "editorInit",
  default: false
});
export default function Editor({branchId, title}) {
  let initDoenetML = useRecoilCallback(({snapshot, set}) => async (contentId) => {
    const response = await snapshot.getPromise(fileByContentId(contentId));
    const doenetML = response.data;
    set(editorDoenetMLAtom, doenetML);
    const viewerObj = await snapshot.getPromise(viewerDoenetMLAtom);
    const updateNumber = viewerObj.updateNumber + 1;
    set(viewerDoenetMLAtom, {updateNumber, doenetML});
    set(editorInitAtom, true);
  });
  const setEditorInit = useSetRecoilState(editorInitAtom);
  useEffect(() => {
    initDoenetML(branchId);
    return () => {
      setEditorInit(false);
    };
  }, []);
  return /* @__PURE__ */ React.createElement(Tool, null, /* @__PURE__ */ React.createElement("headerPanel", {
    title
  }, /* @__PURE__ */ React.createElement(ReturnToEditingButton, {
    branchId
  })), /* @__PURE__ */ React.createElement("mainPanel", null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(DoenetViewerUpdateButton, null))), /* @__PURE__ */ React.createElement("supportPanel", {
    isInitOpen: true
  }, /* @__PURE__ */ React.createElement(TempEditorHeaderBar, {
    branchId
  }), /* @__PURE__ */ React.createElement(TextEditor, {
    branchId
  })), /* @__PURE__ */ React.createElement("menuPanel", {
    title: "Version history"
  }, /* @__PURE__ */ React.createElement(VersionHistoryPanel, {
    branchId
  })));
}
