import React from "../../_snowpack/pkg/react.js";
import {
  atom,
  useRecoilValue,
  useRecoilValueLoadable,
  useRecoilCallback
} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {itemHistoryAtom} from "../ToolHandlers/CourseToolHandler.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import RelatedItems from "../../_reactComponents/PanelHeaderComponents/RelatedItems.js";
import {
  buildTimestamp,
  ClipboardLinkButtons,
  RenameVersionControl,
  fileByContentId
} from "../ToolHandlers/CourseToolHandler.js";
import {nanoid} from "../../_snowpack/pkg/nanoid.js";
import axios from "../../_snowpack/pkg/axios.js";
import {useToast, toastType} from "../Toast.js";
import {folderDictionary} from "../../_reactComponents/Drive/NewDrive.js";
import {editorSaveTimestamp} from "../ToolPanels/DoenetMLEditor.js";
import {DateToUTCDateString} from "../../_utils/dateUtilityFunction.js";
import {editorPageIdInitAtom, textEditorDoenetMLAtom, viewerDoenetMLAtom, updateTextEditorDoenetMLAtom} from "../../_sharedRecoil/EditorViewerRecoil.js";
import {cidFromText} from "../../core/utils/cid.js";
export const currentDraftSelectedAtom = atom({
  key: "currentDraftSelectedAtom",
  default: true
});
export const selectedVersionIdAtom = atom({
  key: "selectedVersionIdAtom",
  default: null
});
export default function VersionHistory(props) {
  console.log(">>>===VersionHistory");
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const path = decodeURIComponent(useRecoilValue(searchParamAtomFamily("path")));
  const versionHistory = useRecoilValueLoadable(itemHistoryAtom(doenetId));
  const initializedDoenetId = useRecoilValue(editorPageIdInitAtom);
  const selectedVersionId = useRecoilValue(selectedVersionIdAtom);
  const addToast = useToast();
  const currentDraftSelected = useRecoilValue(currentDraftSelectedAtom);
  const [driveId, folderId, itemId] = path.split(":");
  const setReleaseNamed = useRecoilCallback(({set, snapshot}) => async ({doenetId: doenetId2, versionId, driveId: driveId2, folderId: folderId2, itemId: itemId2}) => {
    const {data} = await axios.get("/api/releaseVersion.php", {params: {doenetId: doenetId2, versionId}});
    const {success, message, isReleased, title} = data;
    let actionName = "Retracted";
    if (isReleased === "1") {
      actionName = "Released";
    }
    if (success) {
      addToast(`"${title}" is ${actionName}`, toastType.SUCCESS);
    } else {
      addToast(message, toastType.ERROR);
    }
    set(itemHistoryAtom(doenetId2), (was) => {
      let newObj = {...was};
      let newNamed = [...was.named];
      for (const [i, version2] of newNamed.entries()) {
        let newVersion = {...version2};
        if (version2.versionId === versionId) {
          newVersion.isReleased = isReleased;
          newNamed[i] = newVersion;
        } else {
          newVersion.isReleased = "0";
          newNamed[i] = newVersion;
        }
      }
      newObj.named = newNamed;
      return newObj;
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
      newFolderInfo.contentsDictionary[itemId2].isReleased = isReleased;
      newFolderInfo.contentsDictionaryByDoenetId = {...was.contentsDictionaryByDoenetId};
      newFolderInfo.contentsDictionaryByDoenetId[doenetId2] = {...was.contentsDictionaryByDoenetId[doenetId2]};
      newFolderInfo.contentsDictionaryByDoenetId[doenetId2].isReleased = isReleased;
      return newFolderInfo;
    });
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
      newDraftContentId: newDraft.cid,
      doenetId: doenetId2,
      newTitle: title
    };
    axios.post("/api/saveNewVersion.php", newDBVersion);
  });
  const saveVersion = useRecoilCallback(({snapshot, set}) => async (doenetId2) => {
    const doenetML = await snapshot.getPromise(textEditorDoenetMLAtom);
    const timestamp = buildTimestamp();
    const cid = await cidFromText(doenetML);
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
      cid
    };
    let newDBVersion = {
      ...newVersion,
      doenetML,
      doenetId: doenetId2
    };
    newVersions.named = [newVersion, ...oldVersions.named];
    set(itemHistoryAtom(doenetId2), newVersions);
    set(fileByContentId(cid), doenetML);
    axios.post("/api/saveNewVersion.php", newDBVersion).then((resp) => {
      if (resp?.data?.success) {
        addToast("New Version Saved!", toastType.SUCCESS);
      } else {
        addToast("Version NOT Saved!", toastType.ERROR);
        console.error(resp.data?.message);
      }
    }).catch((err) => {
      addToast("Version NOT Saved!", toastType.ERROR);
    });
  });
  const saveAndReleaseCurrent = useRecoilCallback(({snapshot, set}) => async ({doenetId: doenetId2, driveId: driveId2, folderId: folderId2, itemId: itemId2}) => {
    const doenetML = await snapshot.getPromise(textEditorDoenetMLAtom);
    const timestamp = DateToUTCDateString(new Date());
    const cid = await cidFromText(doenetML);
    const versionId = nanoid();
    const {data} = await axios.post("/api/releaseDraft.php", {
      doenetId: doenetId2,
      doenetML,
      timestamp,
      versionId
    });
    const {success, message, title} = data;
    if (success) {
      addToast(`"${title}" is Released.`, toastType.SUCCESS);
    } else {
      addToast(message, toastType.ERROR);
    }
    set(fileByContentId(cid), doenetML);
    set(itemHistoryAtom(doenetId2), (was) => {
      let newObj = {...was};
      let newNamed = [...was.named];
      for (const [i, version2] of newNamed.entries()) {
        let newVersion2 = {...version2};
        newVersion2.isReleased = "0";
        newNamed[i] = newVersion2;
      }
      let newVersion = {
        title,
        versionId,
        timestamp,
        isReleased: "1",
        isDraft: "0",
        isNamed: "1",
        cid
      };
      newNamed.unshift(newVersion);
      newObj.named = newNamed;
      return newObj;
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
      newFolderInfo.contentsDictionary[itemId2].isReleased = "1";
      newFolderInfo.contentsDictionaryByDoenetId = {...was.contentsDictionaryByDoenetId};
      newFolderInfo.contentsDictionaryByDoenetId[doenetId2] = {...was.contentsDictionaryByDoenetId[doenetId2]};
      newFolderInfo.contentsDictionaryByDoenetId[doenetId2].isReleased = "1";
      return newFolderInfo;
    });
  });
  const setSelectedVersionId = useRecoilCallback(({snapshot, set}) => async ({doenetId: doenetId2, versionId, isCurrentDraft}) => {
    set(selectedVersionIdAtom, versionId);
    set(currentDraftSelectedAtom, isCurrentDraft);
    const oldVersions = await snapshot.getPromise(itemHistoryAtom(doenetId2));
    let newVersions = {...oldVersions};
    let oldDraftContentId = oldVersions.draft.cid;
    if (!isCurrentDraft) {
      const wasDraftSelected = await snapshot.getPromise(currentDraftSelectedAtom);
      if (wasDraftSelected) {
        const newDraftDoenetML = await snapshot.getPromise(textEditorDoenetMLAtom);
        const newDraftContentId = await cidFromText(newDraftDoenetML);
        if (newDraftContentId !== oldDraftContentId) {
          let newDraft = {...oldVersions.draft};
          newDraft.cid = newDraftContentId;
          newDraft.timestamp = buildTimestamp();
          newVersions.draft = newDraft;
          set(itemHistoryAtom(doenetId2), newVersions);
          set(fileByContentId(newDraftContentId), newDraftDoenetML);
          let newDBVersion = {
            ...newDraft,
            doenetML: newDraftDoenetML,
            doenetId: doenetId2
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
      }
    }
    let displayContentId = newVersions.draft.cid;
    for (let version2 of newVersions.named) {
      if (version2.versionId === versionId) {
        displayContentId = version2.cid;
        break;
      }
    }
    const doenetML = await snapshot.getPromise(fileByContentId(displayContentId)).toString();
    set(viewerDoenetMLAtom, doenetML);
    set(updateTextEditorDoenetMLAtom, doenetML);
  });
  if (initializedDoenetId !== doenetId) {
    return /* @__PURE__ */ React.createElement("div", {
      style: props.style
    });
  }
  if (!versionHistory?.contents?.named) {
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
      key: `option${version2.versionId}`,
      value: version2.versionId,
      selected
    }, released, " ", version2.title));
  }
  const version = versionsObj[inUseVersionId];
  let releaseButtonText = "Release";
  if (version?.isReleased === "1") {
    releaseButtonText = "Retract";
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    style: {padding: "6px 0px 6px 0px"}
  }, /* @__PURE__ */ React.createElement(RelatedItems, {
    size: "2",
    width: "menu",
    onChange: (e) => {
      setSelectedVersionId({doenetId, versionId: e.target.value, isCurrentDraft: true});
    },
    options: /* @__PURE__ */ React.createElement("option", {
      value: versionHistory.contents.draft.versionId,
      selected: currentDraftSelected
    }, "Current Draft")
  })), /* @__PURE__ */ React.createElement("div", {
    style: {margin: "0px 0px 6px 0px"}
  }, /* @__PURE__ */ React.createElement(Button, {
    disabled: !currentDraftSelected,
    width: "menu",
    value: "Save Version",
    onClick: () => saveVersion(doenetId)
  })), /* @__PURE__ */ React.createElement("div", {
    style: {margin: "6px 0px 6px 0px"}
  }, /* @__PURE__ */ React.createElement(Button, {
    disabled: !currentDraftSelected,
    width: "menu",
    value: "Release Current",
    onClick: () => {
      saveAndReleaseCurrent({doenetId, driveId, folderId, itemId});
    }
  })), /* @__PURE__ */ React.createElement("div", null, "History"), /* @__PURE__ */ React.createElement(RelatedItems, {
    size: "8",
    width: "menu",
    onChange: (e) => {
      setSelectedVersionId({doenetId, versionId: e.target.value, isCurrentDraft: false});
    },
    options
  }), /* @__PURE__ */ React.createElement("div", null, "Name: ", version?.title), /* @__PURE__ */ React.createElement(ClipboardLinkButtons, {
    disabled: currentDraftSelected,
    cid: version?.cid,
    doenetId
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
