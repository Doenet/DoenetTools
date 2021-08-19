import React, {useState} from "../../_snowpack/pkg/react.js";
import {
  atom,
  useRecoilValue,
  useRecoilState,
  useRecoilValueLoadable,
  useRecoilCallback
} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {itemHistoryAtom} from "../ToolHandlers/CourseToolHandler.js";
import {
  editorDoenetIdInitAtom,
  updateTextEditorDoenetMLAtom,
  textEditorDoenetMLAtom,
  viewerDoenetMLAtom
} from "../ToolPanels/EditorViewer.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import {
  buildTimestamp,
  getSHAofContent,
  ClipboardLinkButtons,
  RenameVersionControl,
  fileByContentId
} from "../ToolHandlers/CourseToolHandler.js";
import {nanoid} from "../../_snowpack/pkg/nanoid.js";
import axios from "../../_snowpack/pkg/axios.js";
import {useToast, toastType} from "../Toast.js";
import {folderDictionary} from "../../_reactComponents/Drive/NewDrive.js";
import {faPassport} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
export const currentDraftSelectedAtom = atom({
  key: "currentDraftSelectedAtom",
  default: true
});
const selectedVersionIdAtom = atom({
  key: "selectedVersionIdAtom",
  default: null
});
export default function VersionHistory(props) {
  console.log(">>>===VersionHistory");
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const path = decodeURIComponent(useRecoilValue(searchParamAtomFamily("path")));
  const versionHistory = useRecoilValueLoadable(itemHistoryAtom(doenetId));
  const initializedDoenetId = useRecoilValue(editorDoenetIdInitAtom);
  const selectedVersionId = useRecoilValue(selectedVersionIdAtom);
  const addToast = useToast();
  const currentDraftSelected = useRecoilValue(currentDraftSelectedAtom);
  const [driveId, folderId, itemId] = path.split(":");
  const setReleaseNamed = useRecoilCallback(({set, snapshot}) => async ({doenetId: doenetId2, versionId, driveId: driveId2, folderId: folderId2, itemId: itemId2}) => {
    let doenetIsReleased = false;
    let history = await snapshot.getPromise(itemHistoryAtom(doenetId2));
    let newHistory = {...history};
    newHistory.named = [...history.named];
    let newVersion;
    for (const [i, version2] of newHistory.named.entries()) {
      if (versionId === version2.versionId) {
        newVersion = {...version2};
        if (version2.isReleased === "0") {
          newVersion.isReleased = "1";
          doenetIsReleased = true;
          newHistory.named.splice(i, 1, newVersion);
          break;
        } else {
          newVersion.isReleased = "0";
          newHistory.named.splice(i, 1, newVersion);
          break;
        }
      }
    }
    if (doenetIsReleased) {
      for (const [i, version2] of newHistory.named.entries()) {
        if (versionId !== version2.versionId && version2.isReleased === "1") {
          let newVersion2 = {...version2};
          newVersion2.isReleased = "0";
          newHistory.named.splice(i, 1, newVersion2);
          break;
        }
      }
    }
    set(itemHistoryAtom(doenetId2), newHistory);
    const doenetML = await snapshot.getPromise(fileByContentId(newVersion.contentId));
    let newDBVersion = {
      ...newVersion,
      isNewToggleRelease: "1",
      doenetId: doenetId2,
      doenetML
    };
    axios.post("/api/saveNewVersion.php", newDBVersion).then((resp) => {
      if (resp.data.success) {
        let message = `'${newVersion.title}' Released`;
        if (newVersion.isReleased === "0") {
          message = `'${newVersion.title}' Retracted`;
        }
        addToast(message, toastType.SUCCESS);
      } else {
        let message = `Error occured releasing '${newVersion.title}'`;
        if (newVersion.isReleased === "0") {
          message = `Error occured retracting '${newVersion.title}'`;
        }
        addToast(message, toastType.ERROR);
      }
    });
    set(folderDictionary({driveId: driveId2, folderId: folderId2}), (was) => {
      let newFolderInfo = {...was};
      for (let testItemId of newFolderInfo.contentIds.defaultOrder) {
        if (newFolderInfo.contentsDictionary[testItemId].doenetId === doenetId2) {
          itemId2 = testItemId;
          break;
        }
      }
      newFolderInfo.contentsDictionary = {...was.contentsDictionary};
      newFolderInfo.contentsDictionary[itemId2] = {...was.contentsDictionary[itemId2]};
      let newIsReleased = "0";
      if (doenetIsReleased) {
        newIsReleased = "1";
      }
      newFolderInfo.contentsDictionary[itemId2].isReleased = newIsReleased;
      return newFolderInfo;
    });
  });
  const versionHistoryActive = useRecoilCallback(({snapshot, set}) => async (version2) => {
  });
  const setAsCurrent = useRecoilCallback(({snapshot, set}) => async ({doenetId: doenetId2, versionId}) => {
    const was = await snapshot.getPromise(itemHistoryAtom(doenetId2));
    let nameSaveWasDraft = {...was.draft};
    nameSaveWasDraft.isDraft = "0";
    const title = `Save (current) ${was.named.length + 1}`;
    nameSaveWasDraft.title = title;
    nameSaveWasDraft.timestamp = buildTimestamp();
    let newDraft = {};
    for (let version2 of was.named) {
      if (version2.versionId === versionId) {
        newDraft = {...version2};
      }
    }
    const newDraftVersionId = nanoid();
    newDraft.versionId = newDraftVersionId;
    newDraft.isDraft = "1";
    newDraft.isNamed = "0";
    newDraft.isReleased = "0";
    let newItemHistory = {...was};
    newItemHistory.named = [nameSaveWasDraft, ...was.named];
    newItemHistory.draft = newDraft;
    set(itemHistoryAtom(doenetId2), newItemHistory);
    set(currentDraftSelectedAtom, true);
    set(selectedVersionIdAtom, newDraftVersionId);
    let newDBVersion = {
      ...newDraft,
      isSetAsCurrent: "1",
      newDraftVersionId,
      newDraftContentId: newDraft.contentId,
      doenetId: doenetId2,
      newTitle: title
    };
    axios.post("/api/saveNewVersion.php", newDBVersion);
  });
  const saveVersion = useRecoilCallback(({snapshot, set}) => async (doenetId2) => {
    const doenetML = await snapshot.getPromise(textEditorDoenetMLAtom);
    const timestamp = buildTimestamp();
    const contentId = getSHAofContent(doenetML);
    const versionId = nanoid();
    const oldVersions = await snapshot.getPromise(itemHistoryAtom(doenetId2));
    let newVersions = {...oldVersions};
    const title = `Save ${oldVersions.named.length + 1}`;
    let newVersion = {
      title,
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
      doenetId: doenetId2
    };
    newVersions.named = [newVersion, ...oldVersions.named];
    set(itemHistoryAtom(doenetId2), newVersions);
    set(fileByContentId(contentId), doenetML);
    axios.post("/api/saveNewVersion.php", newDBVersion).then((resp) => {
      if (resp?.data?.success) {
        addToast("New Version Saved!", toastType.SUCCESS);
      } else {
        addToast("Version NOT Saved!", toastType.ERROR);
      }
    }).catch((err) => {
      addToast("Version NOT Saved!", toastType.ERROR);
    });
  });
  const saveAndReleaseCurrent = useRecoilCallback(({snapshot, set}) => async ({doenetId: doenetId2, driveId: driveId2, folderId: folderId2, itemId: itemId2}) => {
    const doenetML = await snapshot.getPromise(textEditorDoenetMLAtom);
    const timestamp = buildTimestamp();
    const contentId = getSHAofContent(doenetML);
    const versionId = nanoid();
    const oldVersions = await snapshot.getPromise(itemHistoryAtom(doenetId2));
    let newVersions = {...oldVersions};
    const title = `Save ${oldVersions.named.length + 1}`;
    let newVersion = {
      title,
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
      doenetId: doenetId2
    };
    newVersions.named = [newVersion, ...oldVersions.named];
    set(itemHistoryAtom(doenetId2), newVersions);
    set(fileByContentId(contentId), doenetML);
    axios.post("/api/saveNewVersion.php", newDBVersion).then((resp) => {
      if (resp?.data?.success) {
        addToast("New Version Saved!", toastType.SUCCESS);
      } else {
        addToast("Version NOT Saved!", toastType.ERROR);
      }
    }).catch((err) => {
      addToast("Version NOT Saved!", toastType.ERROR);
    });
    setReleaseNamed({doenetId: doenetId2, versionId, driveId: driveId2, folderId: folderId2, itemId: itemId2});
  });
  const setSelectedVersionId = useRecoilCallback(({snapshot, set}) => async ({doenetId: doenetId2, versionId, isCurrentDraft}) => {
    set(selectedVersionIdAtom, versionId);
    set(currentDraftSelectedAtom, isCurrentDraft);
    const oldVersions = await snapshot.getPromise(itemHistoryAtom(doenetId2));
    let contentId = oldVersions.draft.contentId;
    if (!isCurrentDraft) {
      const wasDraftSelected = await snapshot.getPromise(currentDraftSelectedAtom);
      if (wasDraftSelected) {
        const textEditorDoenetML = await snapshot.getPromise(textEditorDoenetMLAtom);
        const textEditorContentId = getSHAofContent(textEditorDoenetML);
        if (textEditorContentId !== contentId) {
          let newDraft = {...oldVersions.draft};
          newDraft.contentId = textEditorContentId;
          newDraft.timestamp = buildTimestamp();
          let oldVersionsReplacement = {...oldVersions};
          oldVersionsReplacement.draft = newDraft;
          set(itemHistoryAtom(doenetId2), oldVersionsReplacement);
          set(fileByContentId(textEditorContentId), textEditorDoenetML);
          let newDBVersion = {
            ...newDraft,
            doenetML: textEditorDoenetML,
            doenetId: doenetId2
          };
          axios.post("/api/saveNewVersion.php", newDBVersion);
        }
      }
      for (let version2 of oldVersions.named) {
        if (version2.versionId === versionId) {
          contentId = version2.contentId;
        }
      }
    }
    const doenetML = await snapshot.getPromise(fileByContentId(contentId));
    set(viewerDoenetMLAtom, doenetML);
    set(updateTextEditorDoenetMLAtom, doenetML);
    set(textEditorDoenetMLAtom, doenetML);
  });
  if (initializedDoenetId !== doenetId) {
    return /* @__PURE__ */ React.createElement("div", {
      style: props.style
    });
  }
  console.log(">>>versionHistory.contents", versionHistory.contents);
  if (!versionHistory.contents.named) {
    return null;
  }
  let options = [];
  let versionsObj = {};
  let inUseVersionId = selectedVersionId;
  for (let version2 of versionHistory.contents.named) {
    versionsObj[version2.versionId] = version2;
    let selected = false;
    if (version2.versionId === inUseVersionId) {
      selected = true;
    }
    let released = "";
    if (version2.isReleased === "1") {
      released = "(Released)";
    }
    options.push(/* @__PURE__ */ React.createElement("option", {
      value: version2.versionId,
      selected
    }, released, " ", version2.title));
  }
  const version = versionsObj[inUseVersionId];
  let releaseButtonText = "Release";
  if (version?.isReleased === "1") {
    releaseButtonText = "Retract";
  }
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement("div", {
    style: {margin: "6px 0px 6px 0px"}
  }, /* @__PURE__ */ React.createElement(Button, {
    disabled: !currentDraftSelected,
    width: "menu",
    value: "Save Version",
    onClick: () => saveVersion(doenetId)
  })), /* @__PURE__ */ React.createElement("select", {
    size: "2",
    style: {width: "230px"},
    onChange: (e) => {
      setSelectedVersionId({doenetId, versionId: e.target.value, isCurrentDraft: true});
    }
  }, /* @__PURE__ */ React.createElement("option", {
    value: versionHistory.contents.draft.versionId,
    selected: currentDraftSelected
  }, "Current Draft")), /* @__PURE__ */ React.createElement("div", {
    style: {margin: "6px 0px 6px 0px"}
  }, /* @__PURE__ */ React.createElement(Button, {
    disabled: !currentDraftSelected,
    value: "Release Current",
    onClick: () => {
      saveAndReleaseCurrent({doenetId, driveId, folderId, itemId});
    }
  })), /* @__PURE__ */ React.createElement("div", null, "History"), /* @__PURE__ */ React.createElement("select", {
    size: "8",
    style: {width: "230px"},
    onChange: (e) => {
      setSelectedVersionId({doenetId, versionId: e.target.value, isCurrentDraft: false});
    }
  }, options), /* @__PURE__ */ React.createElement("div", null, "Name: ", version?.title), /* @__PURE__ */ React.createElement(ClipboardLinkButtons, {
    disabled: currentDraftSelected,
    contentId: version?.contentId
  }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(RenameVersionControl, {
    key: version?.versionId,
    disabled: currentDraftSelected,
    doenetId,
    title: version?.title,
    versionId: version?.versionId
  })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Button, {
    disabled: currentDraftSelected,
    onClick: () => setAsCurrent({doenetId, versionId: version.versionId}),
    value: "Set As Current"
  })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Button, {
    disabled: currentDraftSelected,
    onClick: () => setReleaseNamed({doenetId, versionId: version.versionId, driveId, folderId, itemId}),
    value: releaseButtonText
  })));
}
