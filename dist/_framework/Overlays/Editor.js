import React, {useEffect, useState, useRef} from "../../_snowpack/pkg/react.js";
import Tool from "../Tool.js";
import axios from "../../_snowpack/pkg/axios.js";
import sha256 from "../../_snowpack/pkg/crypto-js/sha256.js";
import CryptoJS from "../../_snowpack/pkg/crypto-js.js";
import VisibilitySensor from "../../_snowpack/pkg/react-visibility-sensor.js";
import Button from "../temp/Button.js";
import {nanoid} from "../../_snowpack/pkg/nanoid.js";
import {
  useRecoilValue,
  atom,
  atomFamily,
  selectorFamily,
  useSetRecoilState,
  useRecoilState,
  useRecoilValueLoadable,
  useRecoilCallback
} from "../../_snowpack/pkg/recoil.js";
import DoenetViewer from "../../viewer/DoenetViewer.js";
import {Controlled as CodeMirror} from "../../_snowpack/pkg/react-codemirror2.js";
import "../../_snowpack/pkg/codemirror/lib/codemirror.css.proxy.js";
import "../../_snowpack/pkg/codemirror/mode/xml/xml.js";
import "../../_snowpack/pkg/codemirror/theme/xq-light.css.proxy.js";
import "./Editor.css.proxy.js";
import {
  itemHistoryAtom,
  fileByContentId
} from "../../_sharedRecoil/content.js";
import CollapseSection from "../../_reactComponents/PanelHeaderComponents/CollapseSection.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {
  faExternalLinkAlt
} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {
  faClipboard
} from "../../_snowpack/pkg/@fortawesome/free-regular-svg-icons.js";
import {useToast} from "../Toast.js";
import {CopyToClipboard} from "../../_snowpack/pkg/react-copy-to-clipboard.js";
import {folderDictionary} from "../../_reactComponents/Drive/Drive.js";
const editorDoenetMLAtom = atom({
  key: "editorDoenetMLAtom",
  default: ""
});
const viewerDoenetMLAtom = atom({
  key: "viewerDoenetMLAtom",
  default: {updateNumber: 0, doenetML: ""}
});
const getSHAofContent = (doenetML) => {
  if (doenetML === void 0) {
    return;
  }
  let contentId = sha256(doenetML).toString(CryptoJS.enc.Hex);
  return contentId;
};
const versionHistoryActiveAtom = atom({
  key: "versionHistoryActiveAtom",
  default: ""
});
const EditingVersionIdAtom = atom({
  key: "EditingVersionIdAtom",
  default: ""
});
function ReturnToEditingButton(props) {
  const activeVersionId = useRecoilValue(versionHistoryActiveAtom);
  const returnToEditing = useRecoilCallback(({snapshot, set}) => async (branchId) => {
    set(versionHistoryActiveAtom, "");
    const versionHistory = await snapshot.getPromise(itemHistoryAtom(branchId));
    const contentId = versionHistory.draft.contentId;
    let doenetML = await snapshot.getPromise(fileByContentId(contentId));
    set(editorDoenetMLAtom, doenetML);
    set(viewerDoenetMLAtom, (was) => {
      let newObj = {...was};
      newObj.doenetML = doenetML;
      newObj.updateNumber = was.updateNumber + 1;
      return newObj;
    });
  });
  if (activeVersionId === "") {
    return null;
  }
  return /* @__PURE__ */ React.createElement(Button, {
    callback: () => returnToEditing(props.branchId),
    value: "Return to current version"
  });
}
function EditorInfoPanel(props) {
  const [addToast, ToastType] = useToast();
  const link = `http://${window.location.host}/content/#/?branchId=${props.branchId}`;
  return /* @__PURE__ */ React.createElement("div", {
    style: {margin: "6px"}
  }, /* @__PURE__ */ React.createElement("div", null, "DonetML Name (soon)"), /* @__PURE__ */ React.createElement("div", null, "Load time (soon) "), /* @__PURE__ */ React.createElement("div", null, "Most recent release", /* @__PURE__ */ React.createElement(CopyToClipboard, {
    onCopy: () => addToast("Link copied to clipboard!", ToastType.SUCCESS),
    text: link
  }, /* @__PURE__ */ React.createElement("button", {
    onClick: () => {
    }
  }, "copy link ", /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faClipboard
  }))), /* @__PURE__ */ React.createElement("button", {
    onClick: () => window.open(link, "_blank")
  }, "visit ", /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faExternalLinkAlt
  }))));
}
function RenameVersionControl(props) {
  let [textFieldFlag, setTextFieldFlag] = useState(false);
  let [currentTitle, setCurrentTitle] = useState(props.title);
  const renameVersion = useRecoilCallback(({snapshot, set}) => async (branchId, versionId, newTitle) => {
    set(itemHistoryAtom(branchId), (was) => {
      let newHistory = {...was};
      newHistory.named = [...was.named];
      let newVersion;
      for (const [i, version] of newHistory.named.entries()) {
        if (versionId === version.versionId) {
          newVersion = {...version};
          newVersion.title = newTitle;
          newHistory.named.splice(i, 1, newVersion);
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
  function renameIfChanged() {
    setTextFieldFlag(false);
    if (props.title !== currentTitle) {
      renameVersion(props.branchId, props.versionId, currentTitle);
    }
  }
  if (!textFieldFlag) {
    return /* @__PURE__ */ React.createElement("button", {
      onClick: () => setTextFieldFlag(true)
    }, "Rename");
  }
  return /* @__PURE__ */ React.createElement("input", {
    type: "text",
    autoFocus: true,
    value: currentTitle,
    onChange: (e) => {
      setCurrentTitle(e.target.value);
    },
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        renameIfChanged();
      }
    },
    onBlur: () => {
      renameIfChanged();
    }
  });
}
function ClipboardLinkButtons(props) {
  const [addToast, ToastType] = useToast();
  if (!props.contentId) {
    console.error("Component only handles contentId at this point");
    return null;
  }
  const link = `http://${window.location.host}/content/#/?contentId=${props.contentId}`;
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(CopyToClipboard, {
    onCopy: () => addToast("Link copied to clipboard!", ToastType.SUCCESS),
    text: link
  }, /* @__PURE__ */ React.createElement("button", null, "copy link ", /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faClipboard
  }))), /* @__PURE__ */ React.createElement("button", {
    onClick: () => window.open(link, "_blank")
  }, "visit ", /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faExternalLinkAlt
  })));
}
function VersionHistoryPanel(props) {
  const versionHistory = useRecoilValueLoadable(itemHistoryAtom(props.branchId));
  const toggleReleaseNamed = useRecoilCallback(({set}) => async (branchId, versionId, driveId, folderId) => {
    let doenetIsReleased = false;
    set(itemHistoryAtom(branchId), (was) => {
      let newHistory = {...was};
      newHistory.named = [...was.named];
      let newVersion;
      for (const [i, version] of newHistory.named.entries()) {
        if (versionId === version.versionId) {
          newVersion = {...version};
          if (version.isReleased === "0") {
            newVersion.isReleased = "1";
            newHistory.named.splice(i, 1, newVersion);
            break;
          } else {
            newVersion.isReleased = "0";
            newHistory.named.splice(i, 1, newVersion);
            break;
          }
        }
      }
      for (let named of newHistory.named) {
        if (named.isReleased === "1") {
          doenetIsReleased = true;
          break;
        }
      }
      let newDBVersion = {
        ...newVersion,
        isNewToggleRelease: "1",
        branchId
      };
      axios.post("/api/saveNewVersion.php", newDBVersion);
      return newHistory;
    });
    set(folderDictionary({driveId, folderId}), (was) => {
      let newFolderInfo = {...was};
      newFolderInfo.contentsDictionary = {...was.contentsDictionary};
      newFolderInfo.contentsDictionary[props.itemId] = {...was.contentsDictionary[props.itemId]};
      let newIsReleased = "0";
      if (doenetIsReleased) {
        newIsReleased = "1";
      }
      newFolderInfo.contentsDictionary[props.itemId].isReleased = newIsReleased;
      return newFolderInfo;
    });
  });
  const versionHistoryActive = useRecoilCallback(({snapshot, set}) => async (version) => {
    set(versionHistoryActiveAtom, version.versionId);
    let doenetML = await snapshot.getPromise(fileByContentId(version.contentId));
    set(editorDoenetMLAtom, doenetML);
    set(viewerDoenetMLAtom, (was) => {
      let newObj = {...was};
      newObj.doenetML = doenetML;
      newObj.updateNumber = was.updateNumber + 1;
      return newObj;
    });
  });
  const setAsCurrent = useRecoilCallback(({snapshot, set}) => async (branchId, version) => {
    const newDraftVersionId = nanoid();
    const oldVersions = await snapshot.getPromise(itemHistoryAtom(branchId));
    let newVersions = {...oldVersions};
    let autoSaveWasDraft = {...oldVersions.draft};
    autoSaveWasDraft.isDraft = "0";
    autoSaveWasDraft.title = "Autosave (was draft)";
    autoSaveWasDraft.timestamp = buildTimestamp();
    newVersions.autoSaves = [autoSaveWasDraft, ...oldVersions.autoSaves];
    let newDraft = {...version};
    newDraft.isDraft = "1";
    newDraft.versionId = newDraftVersionId;
    newVersions.draft = newDraft;
    set(itemHistoryAtom(branchId), newVersions);
    let doenetML = await snapshot.getPromise(fileByContentId(newDraft.contentId));
    set(editorDoenetMLAtom, doenetML);
    set(viewerDoenetMLAtom, (was) => {
      let newObj = {...was};
      newObj.doenetML = doenetML;
      newObj.updateNumber = was.updateNumber + 1;
      return newObj;
    });
    let newDBVersion = {
      ...newDraft,
      isSetAsCurrent: "1",
      newDraftVersionId,
      newDraftContentId: newDraft.contentId,
      branchId
    };
    axios.post("/api/saveNewVersion.php", newDBVersion);
  });
  const [selectedVersionId, setSelectedVersionId] = useState(null);
  if (versionHistory.state === "loading") {
    return null;
  }
  if (versionHistory.state === "hasError") {
    console.error(versionHistory.contents);
    return null;
  }
  let controls = null;
  let options = [];
  let versionsObj = {};
  for (let version of versionHistory.contents.named) {
    versionsObj[version.versionId] = version;
    let selected = false;
    if (version.versionId === selectedVersionId) {
      selected = true;
    }
    let released = "";
    if (version.isReleased === "1") {
      released = "(Released)";
    }
    options.push(/* @__PURE__ */ React.createElement("option", {
      value: version.versionId,
      selected
    }, released, " ", version.title));
  }
  let selector = /* @__PURE__ */ React.createElement("select", {
    size: "8",
    onChange: (e) => {
      setSelectedVersionId(e.target.value);
    }
  }, options);
  if (selectedVersionId) {
    const version = versionsObj[selectedVersionId];
    let releaseButtonText = "Release";
    if (version.isReleased === "1") {
      releaseButtonText = "Retract";
    }
    const releaseButton = /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
      onClick: (e) => toggleReleaseNamed(props.branchId, version.versionId, props.driveId, props.folderId)
    }, releaseButtonText));
    controls = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, "Name: ", version.title), /* @__PURE__ */ React.createElement(ClipboardLinkButtons, {
      contentId: version.contentId
    }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(RenameVersionControl, {
      key: version.versionId,
      branchId: props.branchId,
      title: version.title,
      versionId: version.versionId
    })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
      onClick: () => versionHistoryActive(version)
    }, "View")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("button", {
      onClick: () => setAsCurrent(props.branchId, version)
    }, "Set As Current")), releaseButton);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", null, "Versions"), selector, controls);
}
function buildTimestamp() {
  const dt = new Date();
  return `${dt.getFullYear().toString().padStart(2, "0")}-${(dt.getMonth() + 1).toString().padStart(2, "0")}-${dt.getDate().toString().padStart(2, "0")} ${dt.getHours().toString().padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}:${dt.getSeconds().toString().padStart(2, "0")}`;
}
function TextEditor(props) {
  const [editorDoenetML, setEditorDoenetML] = useRecoilState(editorDoenetMLAtom);
  const [activeVersionId, setactiveVersionId] = useRecoilState(versionHistoryActiveAtom);
  const saveDraft = useRecoilCallback(({snapshot, set}) => async (branchId) => {
    const doenetML = await snapshot.getPromise(editorDoenetMLAtom);
    const oldVersions = await snapshot.getPromise(itemHistoryAtom(props.branchId));
    let newVersion = {...oldVersions.draft};
    const contentId = getSHAofContent(doenetML);
    newVersion.contentId = contentId;
    newVersion.timestamp = buildTimestamp();
    let oldVersionsReplacement = {...oldVersions};
    oldVersionsReplacement.draft = newVersion;
    set(itemHistoryAtom(props.branchId), oldVersionsReplacement);
    set(fileByContentId(contentId), doenetML);
    localStorage.setItem(contentId, doenetML);
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
      isReleased: "0",
      title: "Autosave"
    };
    let newDBVersion = {
      ...newVersion,
      doenetML,
      branchId: props.branchId
    };
    const oldVersions = await snapshot.getPromise(itemHistoryAtom(props.branchId));
    let newVersions = {...oldVersions};
    newVersions.autoSaves = [newVersion, ...oldVersions.autoSaves];
    set(itemHistoryAtom(props.branchId), newVersions);
    set(fileByContentId(newVersion.contentId), doenetML);
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
      setactiveVersionId("");
    };
  }, []);
  if (activeVersionId !== "") {
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
    indentUnit: 2,
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
      "Ctrl-Space": "autocomplete",
      "Cmd-/": (cm) => {
        let selections = cm.getSelections();
        if (selections[0] == "") {
          let line = cm.getCursor().line;
          let content = cm.getLine(line);
          if (content.substring(0, 4) === "<!--") {
            content = content.substring(5, content.length - 3) + "\n";
          } else {
            content = "<!-- " + content + " -->\n";
          }
          cm.replaceRange(content, {line, ch: 0}, {line: line + 1, ch: 0});
          setTimeout(cm.setCursor(line, Math.max(content.length - 1, 0)), 1);
          return;
        }
        selections = selections.map((s) => s.substring(0, 4) !== "<!--" ? "<!-- " + s + " -->" : s.substring(5, s.length - 3));
        cm.replaceSelections(selections, "around");
      }
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
      if (activeVersionId === "") {
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
  const activeVersionId = useRecoilValue(versionHistoryActiveAtom);
  if (activeVersionId !== "") {
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
      isReleased: "0",
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
    let newVersions = {...oldVersions};
    newVersions.named = [newVersion, ...oldVersions.named];
    set(itemHistoryAtom(branchId), newVersions);
    set(fileByContentId(contentId), doenetML);
    axios.post("/api/saveNewVersion.php", newDBVersion);
  });
  const activeVersionId = useRecoilValue(versionHistoryActiveAtom);
  if (activeVersionId !== "") {
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
  let solutionDisplayMode = "button";
  return /* @__PURE__ */ React.createElement(DoenetViewer, {
    key: "doenetviewer" + viewerDoenetML?.updateNumber,
    doenetML: viewerDoenetML?.doenetML,
    flags: {
      showCorrectness: true,
      readOnly: false,
      solutionDisplayMode,
      showFeedback: true,
      showHints: true
    },
    attemptNumber,
    ignoreDatabase: true,
    requestedVariant
  });
}
const editorInitAtom = atom({
  key: "editorInit",
  default: false
});
export default function Editor({branchId, title, driveId, folderId, itemId}) {
  let initDoenetML = useRecoilCallback(({snapshot, set}) => async (branchId2) => {
    const versionHistory = await snapshot.getPromise(itemHistoryAtom(branchId2));
    const contentId = versionHistory.draft.contentId;
    let response = await snapshot.getPromise(fileByContentId(contentId));
    if (typeof response === "object") {
      response = response.data;
    }
    const doenetML = response;
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
  })), /* @__PURE__ */ React.createElement("mainPanel", null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(DoenetViewerUpdateButton, null)), /* @__PURE__ */ React.createElement("div", {
    style: {overflowY: "scroll", height: "calc(100vh - 84px)"}
  }, /* @__PURE__ */ React.createElement(DoenetViewerPanel, null))), /* @__PURE__ */ React.createElement("supportPanel", {
    isInitOpen: true
  }, /* @__PURE__ */ React.createElement(TempEditorHeaderBar, {
    branchId
  }), /* @__PURE__ */ React.createElement(TextEditor, {
    branchId
  })), /* @__PURE__ */ React.createElement("menuPanel", {
    title: "Info"
  }, /* @__PURE__ */ React.createElement(EditorInfoPanel, {
    branchId,
    driveId,
    folderId,
    itemId
  })), /* @__PURE__ */ React.createElement("menuPanel", {
    title: "Version history"
  }, /* @__PURE__ */ React.createElement(VersionHistoryPanel, {
    branchId,
    driveId,
    folderId,
    itemId
  })));
}
