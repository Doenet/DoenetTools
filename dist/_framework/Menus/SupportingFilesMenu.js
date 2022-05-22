import React, {useCallback, useState, useRef} from "../../_snowpack/pkg/react.js";
import {useDropzone} from "../../_snowpack/pkg/react-dropzone.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import ActionButtonGroup from "../../_reactComponents/PanelHeaderComponents/ActionButtonGroup.js";
import ActionButton from "../../_reactComponents/PanelHeaderComponents/ActionButton.js";
import {
  useSetRecoilState,
  useRecoilValue,
  atomFamily,
  selectorFamily,
  useRecoilState,
  useRecoilCallback
} from "../../_snowpack/pkg/recoil.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import CollapseSection from "../../_reactComponents/PanelHeaderComponents/CollapseSection.js";
import {useToast, toastType} from "../Toast.js";
import axios from "../../_snowpack/pkg/axios.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {CopyToClipboard} from "../../_snowpack/pkg/react-copy-to-clipboard.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {
  faClipboard
} from "../../_snowpack/pkg/@fortawesome/free-regular-svg-icons.js";
function bytesToSize(bytes) {
  var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes == 0)
    return "0 Byte";
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}
const supportingFilesAndPermissionByDoenetIdAtom = atomFamily({
  key: "supportingFilesAndPermissionByDoenetId",
  default: selectorFamily({
    key: "supportingFilesAndPermissionByDoenetId/Default",
    get: (doenetId) => async () => {
      let {data} = await axios.get("/api/loadSupprtingFileInfo.php", {params: {doenetId}});
      return data;
    }
  })
});
const supportingFilesAndPermissionByDoenetIdSelector = selectorFamily({
  get: (doenetId) => ({get}) => {
    return get(supportingFilesAndPermissionByDoenetIdAtom(doenetId));
  },
  set: (doenetId) => ({set}, newValue) => {
    set(supportingFilesAndPermissionByDoenetIdAtom(doenetId), newValue);
  }
});
function EditableText({text, submit}) {
  if (!submit) {
    submit = () => {
    };
  }
  let [editingMode, setEditingMode] = useState(false);
  let [editText, setText] = useState(text);
  let displayText = text;
  if (!editingMode) {
    displayText = editText;
  }
  let textSpanStyle = {width: "110px", display: "inline-block", textOverflow: "ellipsis", whiteSpace: "nowrap"};
  if (displayText === "") {
    displayText = " *Required";
    textSpanStyle["border"] = "solid 2px #C1292E";
  }
  if (!editingMode) {
    return /* @__PURE__ */ React.createElement("span", {
      style: textSpanStyle,
      onClick: () => setEditingMode(true)
    }, displayText);
  }
  return /* @__PURE__ */ React.createElement("input", {
    autoFocus: true,
    type: "text",
    style: {width: "116px"},
    value: editText,
    onChange: (e) => setText(e.target.value),
    onBlur: (e) => {
      setEditingMode(false);
      submit(editText);
    },
    onKeyDown: (e) => {
      if (e.key === "Enter") {
        setEditingMode(false);
        submit(editText);
      }
    }
  });
}
export default function SupportingFilesMenu(props) {
  const addToast = useToast();
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const [{canUpload, userQuotaBytesAvailable, supportingFiles, quotaBytes, canEditContent}, setSupportFileInfo] = useRecoilState(supportingFilesAndPermissionByDoenetIdSelector(doenetId));
  let typesAllowed = ["image/jpeg", "image/png"];
  let [uploadProgress, setUploadProgress] = useState([]);
  let numberOfFilesUploading = useRef(0);
  const updateDescription = useRecoilCallback(({set}) => async (description, cid) => {
    let {data} = await axios.get("/api/updateFileDescription.php", {params: {doenetId, cid, description}});
    set(supportingFilesAndPermissionByDoenetIdSelector(doenetId), (was) => {
      let newObj = {...was};
      let newSupportingFiles = [...was.supportingFiles];
      newSupportingFiles.map((file, index) => {
        if (file.cid === cid) {
          newSupportingFiles[index] = {...newSupportingFiles[index]};
          newSupportingFiles[index].description = description;
        }
      });
      newObj.supportingFiles = newSupportingFiles;
      return newObj;
    });
  }, [doenetId]);
  const updateAsFileName = useRecoilCallback(({set}) => async (asFileName, cid) => {
    let {data} = await axios.get("/api/updateFileAsFileName.php", {params: {doenetId, cid, asFileName}});
    set(supportingFilesAndPermissionByDoenetIdSelector(doenetId), (was) => {
      let newObj = {...was};
      let newSupportingFiles = [...was.supportingFiles];
      newSupportingFiles.map((file, index) => {
        if (file.cid === cid) {
          newSupportingFiles[index] = {...newSupportingFiles[index]};
          newSupportingFiles[index].asFileName = asFileName;
        }
      });
      newObj.supportingFiles = newSupportingFiles;
      return newObj;
    });
  }, [doenetId]);
  const deleteFile = useRecoilCallback(({set}) => async (cid) => {
    try {
      let resp = await axios.get("/api/deleteFile.php", {params: {doenetId, cid}});
      if (resp.status < 300 && resp?.data?.success) {
        addToast("File deleted.");
        let {userQuotaBytesAvailable: userQuotaBytesAvailable2} = resp.data;
        set(supportingFilesAndPermissionByDoenetIdSelector(doenetId), (was) => {
          let newObj = {...was};
          newObj.supportingFiles = was.supportingFiles.filter((file) => file.cid !== cid);
          newObj.userQuotaBytesAvailable = userQuotaBytesAvailable2;
          return newObj;
        });
      } else {
        if (resp?.data?.success == false) {
          addToast(resp?.data?.message, toastType.ERROR);
        } else {
          throw new Error(`response code: ${resp.status}`);
        }
      }
    } catch (err) {
      throw new Error(`Error deleting file ${err}`);
    }
  }, [doenetId]);
  const onDrop = useCallback((files) => {
    let success = true;
    let sizeOfUpload = 0;
    files.map((file) => {
      if (!typesAllowed.includes(file.type)) {
        addToast(`File '${file.name}' of type '${file.type}' is not allowed. No files uploaded.`, toastType.ERROR);
        success = false;
      }
      sizeOfUpload += file.size;
    });
    let uploadText = bytesToSize(sizeOfUpload);
    let overage = bytesToSize(sizeOfUpload - userQuotaBytesAvailable);
    if (sizeOfUpload > userQuotaBytesAvailable) {
      addToast(`Upload size ${uploadText} exceeds quota by ${overage}. No files uploaded.`, toastType.ERROR);
      success = false;
    }
    if (numberOfFilesUploading.current > 0) {
      addToast(`Already uploading files.  Please wait before sending more.`, toastType.ERROR);
      success = false;
    }
    files.map((file) => {
      if (file.size >= 1e6) {
        addToast(`File '${file.name}' is larger than 1MB. No files uploaded.`, toastType.ERROR);
        success = false;
      }
    });
    if (!success) {
      return;
    }
    numberOfFilesUploading.current = files.length;
    files.map((file) => {
      let initialFileInfo = {fileName: file.name, size: file.size, progressPercent: 0};
      setUploadProgress((was) => [...was, initialFileInfo]);
    });
    files.map((file, fileIndex) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onabort = () => {
      };
      reader.onerror = () => {
      };
      reader.onload = () => {
        const uploadData = new FormData();
        uploadData.append("file", file);
        uploadData.append("doenetId", doenetId);
        axios.post("/api/upload.php", uploadData, {onUploadProgress: (progressEvent) => {
          const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader("content-length") || progressEvent.target.getResponseHeader("x-decompressed-content-length");
          if (totalLength !== null) {
            let progressPercent = Math.round(progressEvent.loaded * 100 / totalLength);
            setUploadProgress((was) => {
              let newArray = [...was];
              newArray[fileIndex].progressPercent = progressPercent;
              return newArray;
            });
          }
        }}).then(({data}) => {
          numberOfFilesUploading.current = numberOfFilesUploading.current - 1;
          if (numberOfFilesUploading.current < 1) {
            setUploadProgress([]);
          }
          let {success: success2, fileName, cid, asFileName, width, height, msg, userQuotaBytesAvailable: userQuotaBytesAvailable2} = data;
          if (msg) {
            if (success2) {
              addToast(msg, toastType.INFO);
            } else {
              addToast(msg, toastType.ERROR);
            }
          }
          if (success2) {
            setSupportFileInfo((was) => {
              let newObj = {...was};
              let newSupportingFiles = [...was.supportingFiles];
              newSupportingFiles.push({
                cid,
                fileName,
                fileType: file.type,
                width,
                height,
                description: "",
                asFileName
              });
              newObj.supportingFiles = newSupportingFiles;
              newObj["userQuotaBytesAvailable"] = userQuotaBytesAvailable2;
              return newObj;
            });
          }
        });
      };
    });
  }, []);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});
  let uploadProgressJSX = uploadProgress.map((info) => {
    return /* @__PURE__ */ React.createElement("div", null, info.fileName, " - ", info.progressPercent, "%");
  });
  let uploadingSection = null;
  if (canUpload) {
    uploadingSection = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, userQuotaBytesAvailable, "/", quotaBytes, " Bytes"), /* @__PURE__ */ React.createElement("div", {
      key: "drop",
      ...getRootProps()
    }, /* @__PURE__ */ React.createElement("input", {
      ...getInputProps()
    }), isDragActive ? /* @__PURE__ */ React.createElement("p", null, "Drop the files here") : /* @__PURE__ */ React.createElement(ButtonGroup, {
      vertical: true
    }, /* @__PURE__ */ React.createElement(Button, {
      width: "menu",
      value: "Upload files"
    }))), /* @__PURE__ */ React.createElement(CollapseSection, {
      title: "Accepted File Types",
      collapsed: true
    }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "Image"), ".jpg .png")), uploadProgressJSX);
  }
  let supportFilesJSX = [];
  supportingFiles.map(({
    cid,
    fileName,
    fileType,
    width,
    height,
    description,
    asFileName
  }) => {
    let doenetMLCode = "Error";
    let source = `doenet:cid=${cid}`;
    if (fileType === "image/jpeg" || fileType === "image/png") {
      doenetMLCode = `<image source='${source}' description='${description}' asfilename='${asFileName}' width='${width}' height='${height}' mimeType='${fileType}' />`;
    } else if (fileType === "text/csv") {
      doenetMLCode = `<dataset source='${source}' />`;
    }
    let description_required_css = {};
    supportFilesJSX.push(/* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", {
      style: {width: "116px"}
    }, "asFileName:"), /* @__PURE__ */ React.createElement(EditableText, {
      text: asFileName,
      submit: (text) => {
        updateAsFileName(text, cid);
      }
    })), /* @__PURE__ */ React.createElement("div", {
      style: description_required_css
    }, /* @__PURE__ */ React.createElement("span", {
      style: {width: "116px"}
    }, "description:"), /* @__PURE__ */ React.createElement(EditableText, {
      text: description,
      submit: (text) => {
        updateDescription(text, cid);
      }
    })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(ActionButtonGroup, {
      width: "menu"
    }, canUpload ? /* @__PURE__ */ React.createElement(ActionButton, {
      alert: true,
      value: "Delete",
      onClick: () => {
        deleteFile(cid);
      }
    }) : null, /* @__PURE__ */ React.createElement(CopyToClipboard, {
      onCopy: () => addToast("Code copied to clipboard!", toastType.SUCCESS),
      text: doenetMLCode
    }, /* @__PURE__ */ React.createElement(ActionButton, {
      disabled: description == "",
      icon: /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
        icon: faClipboard
      }),
      value: "Copy Code"
    })))), /* @__PURE__ */ React.createElement("hr", null)));
  });
  return /* @__PURE__ */ React.createElement("div", null, uploadingSection, /* @__PURE__ */ React.createElement("br", null), supportFilesJSX);
}
