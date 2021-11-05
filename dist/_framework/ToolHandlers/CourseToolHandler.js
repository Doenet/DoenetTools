import React, {useState} from "../../_snowpack/pkg/react.js";
import {
  atom,
  selector,
  atomFamily,
  selectorFamily,
  useRecoilCallback
} from "../../_snowpack/pkg/recoil.js";
import axios from "../../_snowpack/pkg/axios.js";
import sha256 from "../../_snowpack/pkg/crypto-js/sha256.js";
import CryptoJS from "../../_snowpack/pkg/crypto-js.js";
import {CopyToClipboard} from "../../_snowpack/pkg/react-copy-to-clipboard.js";
import {useToast, toastType} from "../Toast.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {
  faExternalLinkAlt
} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {
  faClipboard
} from "../../_snowpack/pkg/@fortawesome/free-regular-svg-icons.js";
import {loadAssignmentSelector} from "../../_reactComponents/Drive/NewDrive.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
export const itemHistoryAtom = atomFamily({
  key: "itemHistoryAtom",
  default: selectorFamily({
    key: "itemHistoryAtom/Default",
    get: (doenetId) => async () => {
      let draft = {};
      let named = [];
      let autoSaves = [];
      if (!doenetId) {
        return {draft, named, autoSaves};
      }
      const {data} = await axios.get(`/api/loadVersions.php?doenetId=${doenetId}`);
      draft = data.versions[0];
      for (let version of data.versions) {
        if (version.isDraft === "1") {
          continue;
        }
        if (version.isNamed === "1") {
          named.push(version);
          continue;
        }
        autoSaves.push(version);
      }
      return {draft, named, autoSaves};
    }
  })
});
export const fileByContentId = atomFamily({
  key: "fileByContentId",
  default: selectorFamily({
    key: "fileByContentId/Default",
    get: (contentId) => async () => {
      if (!contentId) {
        return "";
      }
      try {
        const server = await axios.get(`/media/${contentId}.doenet`);
        return server.data;
      } catch (error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        return "Error Loading";
      }
    }
  })
});
export const drivecardSelectedNodesAtom = atom({
  key: "drivecardSelectedNodesAtom",
  default: []
});
export const assignmentDictionary = atomFamily({
  key: "assignmentDictionary",
  default: selectorFamily({
    key: "assignmentDictionary/Default",
    get: (driveIditemIddoenetIdparentFolderId) => async ({get}, instructions) => {
      let folderInfoQueryKey = {
        driveId: driveIditemIddoenetIdparentFolderId.driveId,
        folderId: driveIditemIddoenetIdparentFolderId.folderId
      };
      if (driveIditemIddoenetIdparentFolderId.doenetId) {
        const aInfo = await get(loadAssignmentSelector(driveIditemIddoenetIdparentFolderId.doenetId));
        if (aInfo) {
          return aInfo;
        } else
          return null;
      } else
        return null;
    }
  })
});
export let assignmentDictionarySelector = selectorFamily({
  key: "assignmentDictionarySelector",
  get: (driveIditemIddoenetIdparentFolderId) => ({get}) => {
    return get(assignmentDictionary(driveIditemIddoenetIdparentFolderId));
  }
});
export const variantInfoAtom = atom({
  key: "variantInfoAtom",
  default: {index: null, name: null, lastUpdatedIndexOrName: null, requestedVariant: {index: 1}}
});
export const variantPanelAtom = atom({
  key: "variantPanelAtom",
  default: {index: null, name: null}
});
export function buildTimestamp() {
  const dt = new Date();
  return `${dt.getFullYear().toString().padStart(2, "0")}-${(dt.getMonth() + 1).toString().padStart(2, "0")}-${dt.getDate().toString().padStart(2, "0")} ${dt.getHours().toString().padStart(2, "0")}:${dt.getMinutes().toString().padStart(2, "0")}:${dt.getSeconds().toString().padStart(2, "0")}`;
}
export const getSHAofContent = (doenetML) => {
  if (doenetML === void 0) {
    return;
  }
  let contentId = sha256(doenetML).toString(CryptoJS.enc.Hex);
  return contentId;
};
export function ClipboardLinkButtons(props) {
  const addToast = useToast();
  let link = `http://localhost/#/content?doenetId=${props.doenetId}`;
  if (props.contentId) {
    link = `http://localhost/#/content?contentId=${props.contentId}`;
  }
  let linkData = [];
  if (props.contentId) {
    linkData.push(`contentId=${props.contentId}`);
  }
  if (props.doenetId) {
    linkData.push(`doenetId=${props.doenetId}`);
  }
  let embedLink = `<copy uri="doenet:${linkData.join("&")}" />`;
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(ButtonGroup, null, /* @__PURE__ */ React.createElement(CopyToClipboard, {
    onCopy: () => addToast("Link copied to clipboard!", toastType.SUCCESS),
    text: link
  }, /* @__PURE__ */ React.createElement(Button, {
    disabled: props.disabled,
    icon: /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faClipboard
    }),
    value: "copy link"
  })), /* @__PURE__ */ React.createElement(CopyToClipboard, {
    onCopy: () => addToast("Embed link copied to clipboard!", toastType.SUCCESS),
    text: embedLink
  }, /* @__PURE__ */ React.createElement(Button, {
    disabled: props.disabled,
    icon: /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faClipboard
    }),
    value: "copy embed link"
  })), /* @__PURE__ */ React.createElement(Button, {
    icon: /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faExternalLinkAlt
    }),
    value: "visit",
    disabled: props.disabled,
    onClick: () => window.open(link, "_blank")
  })));
}
export function RenameVersionControl(props) {
  let [textFieldFlag, setTextFieldFlag] = useState(false);
  let [currentTitle, setCurrentTitle] = useState(props.title);
  const renameVersion = useRecoilCallback(({set}) => async (doenetId, versionId, newTitle) => {
    set(itemHistoryAtom(doenetId), (was) => {
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
        doenetId
      };
      axios.post("/api/saveNewVersion.php", newDBVersion);
      return newHistory;
    });
  });
  function renameIfChanged() {
    setTextFieldFlag(false);
    if (props.title !== currentTitle) {
      renameVersion(props.doenetId, props.versionId, currentTitle);
    }
  }
  if (!textFieldFlag) {
    return /* @__PURE__ */ React.createElement(Button, {
      disabled: props.disabled,
      onClick: () => setTextFieldFlag(true),
      value: "Rename"
    });
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
