import React, {useEffect, useState, Suspense, useContext} from "../_snowpack/pkg/react.js";
import {useHistory} from "../_snowpack/pkg/react-router-dom.js";
import {
  atom,
  useSetRecoilState,
  useRecoilValue,
  selector,
  useRecoilState,
  selectorFamily,
  useRecoilValueLoadable,
  useRecoilStateLoadable,
  useRecoilCallback,
  atomFamily
} from "../_snowpack/pkg/recoil.js";
import axios from "../_snowpack/pkg/axios.js";
import "../_snowpack/pkg/codemirror/lib/codemirror.css.proxy.js";
import "../_snowpack/pkg/codemirror/theme/material.css.proxy.js";
import {nanoid} from "../_snowpack/pkg/nanoid.js";
import Drive, {
  folderDictionarySelector,
  clearDriveAndItemSelections,
  encodeParams,
  drivePathSyncFamily
} from "../_reactComponents/Drive/Drive.js";
import {BreadcrumbContainer} from "../_reactComponents/Breadcrumb/index.js";
import Button from "../_reactComponents/PanelHeaderComponents/Button.js";
import DriveCards from "../_reactComponents/Drive/DriveCards.js";
import "../_reactComponents/Drive/drivecard.css.proxy.js";
import "../_utils/util.css.proxy.js";
import GlobalFont from "../_utils/GlobalFont.js";
import Tool from "../_framework/Tool.js";
import {useToolControlHelper, ProfileContext} from "../_framework/ToolRoot.js";
import Toast, {useToast} from "../_framework/Toast.js";
import {drivecardSelectedNodesAtom, URLPathSync} from "../library/Library.js";
import Enrollment from "./Enrollment.js";
import {useAssignment} from "./CourseActions.js";
import {useAssignmentCallbacks} from "../_reactComponents/Drive/DriveActions.js";
import {selectedInformation} from "../library/Library.js";
import CollapseSection from "../_reactComponents/PanelHeaderComponents/CollapseSection.js";
import {
  itemHistoryAtom,
  fileByContentId
} from "../_sharedRecoil/content.js";
const versionHistoryReleasedSelectedAtom = atom({
  key: "versionHistoryReleasedSelectedAtom",
  default: ""
});
const viewerDoenetMLAtom = atom({
  key: "viewerDoenetMLAtom",
  default: {updateNumber: 0, doenetML: ""}
});
export const roleAtom = atom({
  key: "roleAtom",
  default: "Instructor"
});
export const selectedVersionAtom = atom({
  key: "selectedVersionAtom",
  default: ""
});
const loadAssignmentSelector = selectorFamily({
  key: "loadAssignmentSelector",
  get: (branchIdcontentId) => async ({get, set}) => {
    const {data} = await axios.get(`/api/getAllAssignmentSettings.php?branchId=${branchIdcontentId.branchId}&contentId=${branchIdcontentId.contentId}`);
    return data;
  }
});
export const assignmentDictionary = atomFamily({
  key: "assignmentDictionary",
  default: selectorFamily({
    key: "assignmentDictionary/Default",
    get: (driveIditemIdbranchIdparentFolderId) => async ({get}, instructions) => {
      let folderInfoQueryKey = {
        driveId: driveIditemIdbranchIdparentFolderId.driveId,
        folderId: driveIditemIdbranchIdparentFolderId.folderId
      };
      let folderInfo = get(folderDictionarySelector(folderInfoQueryKey));
      const itemObj = folderInfo?.contentsDictionary?.[driveIditemIdbranchIdparentFolderId.itemId];
      if (driveIditemIdbranchIdparentFolderId.branchId) {
        const aInfo = await get(loadAssignmentSelector({branchId: driveIditemIdbranchIdparentFolderId.branchId, contentId: driveIditemIdbranchIdparentFolderId.contentId}));
        if (aInfo) {
          return aInfo?.assignments[0];
        } else
          return null;
      } else
        return null;
    }
  })
});
let assignmentDictionarySelector = selectorFamily({
  key: "assignmentDictionaryNewSelector",
  get: (driveIditemIdbranchIdparentFolderId) => ({get}) => {
    return get(assignmentDictionary(driveIditemIdbranchIdparentFolderId));
  }
});
function Container(props) {
  return /* @__PURE__ */ React.createElement("div", {
    style: {
      maxWidth: "850px",
      padding: "20px",
      display: "grid"
    }
  }, props.children);
}
function AutoSelect(props) {
  const {openOverlay, activateMenuPanel} = useToolControlHelper();
  const contentInfoLoad = useRecoilValueLoadable(selectedInformation);
  if (contentInfoLoad.state === "hasValue") {
    const versionHistory = useRecoilValueLoadable(itemHistoryAtom(contentInfoLoad?.contents?.itemInfo?.branchId));
    if (versionHistory.state === "loading") {
      return null;
    }
    if (versionHistory.state === "hasError") {
      console.error(versionHistory.contents);
      return null;
    }
    if (versionHistory.state === "hasValue") {
      const contentId = versionHistory.contents.named.contentId;
    }
  }
  if (contentInfoLoad?.contents?.number > 0) {
    activateMenuPanel(0);
  } else {
    activateMenuPanel(1);
  }
  return null;
}
export default function Course(props) {
  const {openOverlay, activateMenuPanel} = useToolControlHelper();
  const [toast, toastType] = useToast();
  let routePathDriveId = "";
  let routePathFolderId = "";
  let pathItemId = "";
  let itemType = "";
  let urlParamsObj = Object.fromEntries(new URLSearchParams(props.route.location.search));
  const setDrivecardSelection = useSetRecoilState(drivecardSelectedNodesAtom);
  const clearSelections = useSetRecoilState(clearDriveAndItemSelections);
  const [openEnrollment, setEnrollmentView] = useState(false);
  const [viewAccess, setViewAccess] = useState(false);
  const role = useRecoilValue(roleAtom);
  const setDrivePath = useSetRecoilState(drivePathSyncFamily("main"));
  if (urlParamsObj?.path !== void 0) {
    [
      routePathDriveId,
      routePathFolderId,
      pathItemId,
      itemType
    ] = urlParamsObj.path.split(":");
  }
  if (urlParamsObj?.path !== void 0) {
    [routePathDriveId] = urlParamsObj.path.split(":");
  }
  useEffect(() => {
    if (routePathDriveId === "") {
      activateMenuPanel(1);
    }
  }, []);
  const history = useHistory();
  function cleardrivecardSelection() {
    setDrivePath({
      driveId: "",
      parentFolderId: "",
      itemId: "",
      type: ""
    });
  }
  function useOutsideDriveSelector() {
    setDrivePath({
      driveId: "",
      parentFolderId: "",
      itemId: "",
      type: ""
    });
  }
  let breadcrumbContainer = /* @__PURE__ */ React.createElement(BreadcrumbContainer, {
    drivePathSyncKey: "main"
  });
  const setEnrollment = (e) => {
    e.preventDefault();
    setEnrollmentView(!openEnrollment);
  };
  const setViewAccessToggle = (e) => {
    e.preventDefault();
    setViewAccess(!viewAccess);
  };
  const enrollDriveId = {driveId: routePathDriveId};
  let hideUnpublished = true;
  if (role === "Instructor") {
    hideUnpublished = false;
  }
  let urlClickBehavior = "";
  if (role === "Instructor") {
    urlClickBehavior = "select";
  }
  let responsiveControls = "";
  if (routePathDriveId) {
    responsiveControls = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, {
      value: openEnrollment ? "Close Enrollment" : "Open Enrollment",
      callback: (e) => setEnrollment(e)
    }), /* @__PURE__ */ React.createElement(Button, {
      value: viewAccess ? "released" : "assigned",
      callback: (e) => setViewAccessToggle(e)
    }));
  }
  const profile = useContext(ProfileContext);
  if (profile.signedIn === "0") {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(GlobalFont, null), /* @__PURE__ */ React.createElement(Tool, null, /* @__PURE__ */ React.createElement("headerPanel", {
      title: "Course"
    }), /* @__PURE__ */ React.createElement("mainPanel", null, /* @__PURE__ */ React.createElement("div", {
      style: {
        border: "1px solid grey",
        borderRadius: "20px",
        margin: "auto",
        marginTop: "10%",
        padding: "10px",
        width: "50%"
      }
    }, /* @__PURE__ */ React.createElement("div", {
      style: {
        textAlign: "center",
        alignItems: "center",
        marginBottom: "20px"
      }
    }, /* @__PURE__ */ React.createElement("h2", null, "You are not signed in"), /* @__PURE__ */ React.createElement("h2", null, "Course currently requires sign in for use"), /* @__PURE__ */ React.createElement("button", {
      style: {background: "#1a5a99", borderRadius: "5px"}
    }, /* @__PURE__ */ React.createElement("a", {
      href: "/signin",
      style: {color: "white", textDecoration: "none"}
    }, "Sign in with this link")))))));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(URLPathSync, {
    route: props.route
  }), /* @__PURE__ */ React.createElement(GlobalFont, null), /* @__PURE__ */ React.createElement(Tool, null, /* @__PURE__ */ React.createElement("headerPanel", {
    title: "Course"
  }), /* @__PURE__ */ React.createElement("navPanel", {
    isInitOpen: true
  }, /* @__PURE__ */ React.createElement("div", {
    style: {marginBottom: "40px", height: "100vh"},
    onClick: useOutsideDriveSelector
  }, /* @__PURE__ */ React.createElement(Drive, {
    driveId: routePathDriveId,
    foldersOnly: true,
    drivePathSyncKey: "main"
  }))), /* @__PURE__ */ React.createElement("mainPanel", {
    responsiveControls
  }, /* @__PURE__ */ React.createElement(AutoSelect, null), openEnrollment ? /* @__PURE__ */ React.createElement(Enrollment, {
    selectedCourse: enrollDriveId
  }) : /* @__PURE__ */ React.createElement(React.Fragment, null, breadcrumbContainer, /* @__PURE__ */ React.createElement("div", {
    onClick: () => {
      clearSelections();
    }
  }, /* @__PURE__ */ React.createElement(Container, null, /* @__PURE__ */ React.createElement(Drive, {
    columnTypes: ["Due Date", "Assigned"],
    viewAccess: viewAccess ? "assigned" : "released",
    driveId: routePathDriveId,
    hideUnpublished,
    subTypes: ["Administrator"],
    urlClickBehavior: "select",
    drivePathSyncKey: "main",
    doenetMLDoubleClickCallback: (info) => {
      openOverlay({type: "content", branchId: info.item.branchId, title: info.item.label});
    }
  }))), /* @__PURE__ */ React.createElement("div", {
    onClick: cleardrivecardSelection,
    tabIndex: 0
  }, !routePathDriveId && /* @__PURE__ */ React.createElement("h2", null, "Admin"), /* @__PURE__ */ React.createElement(DriveCards, {
    routePathDriveId,
    isOneDriveSelect: true,
    types: ["course"],
    drivePathSyncKey: "main",
    subTypes: ["Administrator"]
  }), !routePathDriveId && /* @__PURE__ */ React.createElement("h2", null, "Student"), /* @__PURE__ */ React.createElement(DriveCards, {
    isOneDriveSelect: true,
    routePathDriveId,
    isOneDriveSelect: true,
    types: ["course"],
    drivePathSyncKey: "main",
    subTypes: ["Student"]
  })))), routePathDriveId && /* @__PURE__ */ React.createElement("menuPanel", {
    isInitOpen: true,
    title: "Assigned"
  }, /* @__PURE__ */ React.createElement(VersionInfo, {
    route: props.route
  }), /* @__PURE__ */ React.createElement("br", null)), /* @__PURE__ */ React.createElement("menuPanel", {
    title: "Info"
  }, /* @__PURE__ */ React.createElement(ItemInfoPanel, {
    route: props.route
  }))));
}
const DoenetMLInfoPanel = (props) => {
  let urlParamsObj = Object.fromEntries(new URLSearchParams(props.props.route.location.search));
  const {addContentAssignment, changeSettings, saveSettings, assignmentToContent, loadAvailableAssignment, publishContentAssignment, onAssignmentError} = useAssignment();
  const {makeAssignment, onmakeAssignmentError, publishAssignment, onPublishAssignmentError, publishContent, onPublishContentError, updateAssignmentTitle, onUpdateAssignmentTitleError, convertAssignmentToContent, onConvertAssignmentToContentError} = useAssignmentCallbacks();
  const selectedVId = useRecoilValue(selectedVersionAtom);
  const itemInfo = props.contentInfo;
  const vInfo = props.versionArr;
  const versionHistory = useRecoilValueLoadable(itemHistoryAtom(itemInfo.branchId));
  const selectedContentId = () => {
    const assignedArr = versionHistory.contents.named.filter((item) => item.versionId === selectedVId);
    if (assignedArr.length > 0) {
      return assignedArr[0].contentId;
    } else {
      return "";
    }
  };
  const assignmentInfoSettings = useRecoilValueLoadable(assignmentDictionarySelector({
    driveId: itemInfo.driveId,
    folderId: itemInfo.parentFolderId,
    itemId: itemInfo.itemId,
    branchId: itemInfo.branchId,
    versionId: selectedVId,
    contentId: selectedContentId()
  }));
  let aInfo = "";
  let assignmentId = "";
  if (assignmentInfoSettings?.state === "hasValue") {
    aInfo = assignmentInfoSettings?.contents;
    if (aInfo?.assignmentId) {
      assignmentId = aInfo?.assignmentId;
    }
  }
  let publishContentButton = null;
  let makeAssignmentButton = null;
  let assignmentForm = null;
  let assignmentToContentButton = null;
  let loadAssignmentButton = null;
  let unPublishContentButton = null;
  let viewDoenetMLButton = itemInfo.isAssigned === "0" && /* @__PURE__ */ React.createElement(Button, {
    value: "View Content",
    callback: () => {
      openOverlay({
        type: "content",
        branchId: itemInfo?.branchId
      });
    }
  });
  const {openOverlay, activateMenuPanel} = useToolControlHelper();
  const [addToast, ToastType] = useToast();
  const handleChange = (event) => {
    event.preventDefault();
    let name = event.target.name;
    let value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    const result = changeSettings({
      [name]: value,
      driveIditemIdbranchIdparentFolderId: {
        driveId: itemInfo.driveId,
        folderId: itemInfo.parentFolderId,
        itemId: itemInfo.itemId,
        branchId: itemInfo.branchId,
        versionId: selectedVId,
        contentId: selectedContentId()
      }
    });
    result.then((resp) => {
      if (resp.data.success) {
      } else {
      }
    }).catch((e) => {
    });
  };
  const handleOnBlur = (e) => {
    let name = e.target.name;
    let value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    const result = saveSettings({
      [name]: value,
      driveIditemIdbranchIdparentFolderId: {
        driveId: itemInfo.driveId,
        folderId: itemInfo.parentFolderId,
        itemId: itemInfo.itemId,
        branchId: itemInfo.branchId,
        versionId: selectedVId,
        contentId: selectedContentId()
      }
    });
    let payload = {
      ...aInfo,
      itemId: itemInfo.itemId,
      isAssigned: "1",
      assignmentId: aInfo?.assignmentId,
      [name]: value,
      branchId: itemInfo.branchId,
      contentId: itemInfo.contentId
    };
    updateAssignmentTitle({
      driveIdFolderId: {
        driveId: itemInfo.driveId,
        folderId: itemInfo.parentFolderId
      },
      itemId: itemInfo.itemId,
      payloadAssignment: payload,
      branchId: itemInfo.branchId,
      contentId: itemInfo.contentId
    });
    result.then((resp) => {
      if (resp.data.success) {
        addToast(`Updated '${name}' to '${value}'`, ToastType.SUCCESS);
      } else {
        onAssignmentError({errorMessage: resp.data.message});
      }
    }).catch((e2) => {
      onAssignmentError({errorMessage: e2.message});
    });
  };
  const handlePublishContent = () => {
    let payload = {
      itemId: itemInfo.itemId
    };
    publishContent({
      driveIdFolderId: {
        driveId: itemInfo.driveId,
        folderId: itemInfo.parentFolderId
      },
      itemId: itemInfo.itemId,
      payload
    });
    const result = axios.post(`/api/handlePublishContent.php`, payload);
    result.then((resp) => {
      if (resp.data.success) {
        addToast(`'${itemInfo.label}' Published'`, ToastType.SUCCESS);
      } else {
        onAssignmentError({errorMessage: resp.data.message});
      }
    }).catch((e) => {
      onAssignmentError({errorMessage: e.message});
    });
  };
  const handleMakeContent = (e) => {
    let payload = {
      itemId: itemInfo.itemId
    };
    assignmentToContent({
      driveIditemIdbranchIdparentFolderId: {
        driveId: itemInfo.driveId,
        folderId: itemInfo.parentFolderId,
        itemId: itemInfo.itemId
      }
    });
    convertAssignmentToContent({
      driveIdFolderId: {
        driveId: itemInfo.driveId,
        folderId: itemInfo.parentFolderId
      },
      itemId: itemInfo.itemId,
      assignedDataSavenew: payload
    });
    const result = axios.post(`/api/handleMakeContent.php`, payload);
    result.then((resp) => {
      if (resp.data.success) {
        addToast(`'${itemInfo.assignment_title}' back to '${itemInfo.label}''`, ToastType.SUCCESS);
      } else {
        onAssignmentError({errorMessage: resp.data.message});
      }
    }).catch((e2) => {
      onAssignmentError({errorMessage: e2.message});
    });
  };
  const loadBackAssignment = () => {
    let payload = {
      itemId: itemInfo.itemId,
      branchId: itemInfo.branchId,
      isAssigned: "1",
      assignmentId: aInfo?.assignmentId,
      assignment_title: aInfo?.assignment_title
    };
    loadAvailableAssignment({
      ...aInfo,
      driveIditemIdbranchIdparentFolderId: {
        driveId: itemInfo.driveId,
        folderId: itemInfo.parentFolderId,
        itemId: itemInfo.itemId
      }
    });
    updateAssignmentTitle({
      driveIdFolderId: {
        driveId: itemInfo.driveId,
        folderId: itemInfo.parentFolderId
      },
      itemId: itemInfo.itemId,
      payloadAssignment: payload
    });
    const result = axios.post(`/api/handleBackAssignment.php`, payload);
    result.then((resp) => {
      if (resp.data.success) {
        addToast(`'${itemInfo.label}' back to '${itemInfo.assignment_title}'`, ToastType.SUCCESS);
      } else {
        onAssignmentError({errorMessage: resp.data.message});
      }
    }).catch((e) => {
      onAssignmentError({errorMessage: e.message});
    });
  };
  const [showAForm, setShowAForm] = useState(false);
  const role = useRecoilValue(roleAtom);
  if (itemInfo?.isPublished === "0") {
    publishContentButton = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, {
      value: "Publish Content",
      switch_value: "Published",
      callback: handlePublishContent
    }));
  }
  const checkIsVersionAssigned = () => {
    const selectedVId2 = useRecoilValue(selectedVersionAtom);
    const assignedArr = props.versionArr.filter((item) => item.versionId === selectedVId2);
    if (assignedArr.length > 0 && assignedArr[0].isAssigned == "1") {
      return true;
    } else {
      return false;
    }
  };
  if (itemInfo.isAssigned === "1" && checkIsVersionAssigned()) {
    assignmentForm = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Assignment Name :"), /* @__PURE__ */ React.createElement("input", {
      required: true,
      type: "text",
      name: "assignment_title",
      value: aInfo ? aInfo?.assignment_title : "",
      placeholder: "Title goes here",
      onBlur: (e) => handleOnBlur(e),
      onChange: handleChange
    })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Assigned Date:"), /* @__PURE__ */ React.createElement("input", {
      required: true,
      type: "text",
      name: "assignedDate",
      value: aInfo ? aInfo?.assignedDate : "",
      placeholder: "0001-01-01 01:01:01 ",
      onBlur: handleOnBlur,
      onChange: handleChange
    })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Due date: "), /* @__PURE__ */ React.createElement("input", {
      required: true,
      type: "text",
      name: "dueDate",
      value: aInfo ? aInfo?.dueDate : "",
      placeholder: "0001-01-01 01:01:01",
      onBlur: handleOnBlur,
      onChange: handleChange
    })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Time Limit:"), /* @__PURE__ */ React.createElement("input", {
      required: true,
      type: "time",
      name: "timeLimit",
      value: aInfo ? aInfo?.timeLimit : "",
      placeholder: "01:01:01",
      onBlur: handleOnBlur,
      onChange: handleChange
    })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Number Of Attempts:"), /* @__PURE__ */ React.createElement("input", {
      required: true,
      type: "number",
      name: "numberOfAttemptsAllowed",
      value: aInfo ? aInfo?.numberOfAttemptsAllowed : "",
      onBlur: handleOnBlur,
      onChange: handleChange
    })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Attempt Aggregation :"), /* @__PURE__ */ React.createElement("input", {
      required: true,
      type: "text",
      name: "attemptAggregation",
      value: aInfo ? aInfo?.attemptAggregation : "",
      onBlur: handleOnBlur,
      onChange: handleChange
    })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Total Points Or Percent: "), /* @__PURE__ */ React.createElement("input", {
      required: true,
      type: "number",
      name: "totalPointsOrPercent",
      value: aInfo ? aInfo?.totalPointsOrPercent : "",
      onBlur: handleOnBlur,
      onChange: handleChange
    })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Grade Category: "), /* @__PURE__ */ React.createElement("input", {
      required: true,
      type: "select",
      name: "gradeCategory",
      value: aInfo ? aInfo?.gradeCategory : "",
      onBlur: handleOnBlur,
      onChange: handleChange
    })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Individualize: "), /* @__PURE__ */ React.createElement("input", {
      required: true,
      type: "checkbox",
      name: "individualize",
      checked: aInfo ? aInfo?.individualize : false,
      onChange: handleOnBlur
    })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Multiple Attempts: "), /* @__PURE__ */ React.createElement("input", {
      required: true,
      type: "checkbox",
      name: "multipleAttempts",
      checked: aInfo ? aInfo?.multipleAttempts : false,
      onChange: handleOnBlur
    }), " "), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Show solution: "), /* @__PURE__ */ React.createElement("input", {
      required: true,
      type: "checkbox",
      name: "showSolution",
      checked: aInfo ? aInfo?.showSolution : false,
      onChange: handleOnBlur
    }), " "), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Show feedback: "), /* @__PURE__ */ React.createElement("input", {
      required: true,
      type: "checkbox",
      name: "showFeedback",
      checked: aInfo ? aInfo?.showFeedback : false,
      onChange: handleOnBlur
    })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Show hints: "), /* @__PURE__ */ React.createElement("input", {
      required: true,
      type: "checkbox",
      name: "showHints",
      checked: aInfo ? aInfo?.showHints : false,
      onChange: handleOnBlur
    })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Show correctness: "), /* @__PURE__ */ React.createElement("input", {
      required: true,
      type: "checkbox",
      name: "showCorrectness",
      checked: aInfo ? aInfo?.showCorrectness : false,
      onChange: handleOnBlur
    })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Proctor make available: "), /* @__PURE__ */ React.createElement("input", {
      required: true,
      type: "checkbox",
      name: "proctorMakesAvailable",
      checked: aInfo ? aInfo?.proctorMakesAvailable : false,
      onChange: handleOnBlur
    })), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Button, {
      value: "Publish assignment",
      switch_value: "publish changes",
      callback: () => {
        const result = publishContentAssignment({
          driveIditemIdbranchIdparentFolderId: {
            driveId: itemInfo.driveId,
            folderId: itemInfo.parentFolderId,
            itemId: itemInfo.itemId
          },
          branchId: itemInfo.branchId,
          contentId: itemInfo.contentId ? itemInfo.contentId : itemInfo.branchId
        });
        const payload = {
          ...aInfo,
          assignment_isPublished: "1",
          branchId: itemInfo.branchId
        };
        publishAssignment({
          driveIdFolderId: {
            driveId: itemInfo.driveId,
            folderId: itemInfo.parentFolderId
          },
          itemId: itemInfo.itemId,
          payload
        });
        result.then((resp) => {
          if (resp.data.success) {
            addToast(`'${aInfo.assignment_title}' Published'`, ToastType.SUCCESS);
          } else {
            onAssignmentError({errorMessage: resp.data.message});
          }
        }).catch((e) => {
          onAssignmentError({errorMessage: e.message});
        });
      },
      type: "submit"
    }))));
  }
  if (itemInfo.isAssigned === "0") {
    loadAssignmentButton = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, {
      value: "load Assignment",
      callback: loadBackAssignment
    }));
  }
  if (itemInfo.isAssigned === "1") {
    assignmentToContentButton = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("br", null));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("br", null), publishContentButton, /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), assignmentToContentButton, /* @__PURE__ */ React.createElement("br", null), assignmentForm, /* @__PURE__ */ React.createElement("br", null));
};
const FolderInfoPanel = () => {
  return /* @__PURE__ */ React.createElement("h1", null, "Folder Info");
};
const VersionHistoryInfoPanel = (props) => {
  const [selectedVId, setSelectedVId] = useState();
  const setSelectedVersionAtom = useSetRecoilState(selectedVersionAtom);
  const itemInfo = props.contentInfo;
  const versionHistory = useRecoilValueLoadable(itemHistoryAtom(itemInfo.branchId));
  const selectedVersionId = useRecoilValue(versionHistoryReleasedSelectedAtom);
  const {openOverlay, activateMenuPanel} = useToolControlHelper();
  const {addContentAssignment, updateVersionHistory, updatePrevVersionHistory, changeSettings, saveSettings, assignmentToContent, loadAvailableAssignment, publishContentAssignment, onAssignmentError} = useAssignment();
  const {makeAssignment, onmakeAssignmentError, publishAssignment, onPublishAssignmentError, publishContent, onPublishContentError, updateAssignmentTitle, onUpdateAssignmentTitleError, convertAssignmentToContent, onConvertAssignmentToContentError} = useAssignmentCallbacks();
  const [addToast, ToastType] = useToast();
  const [checkIsAssigned, setIsAssigned] = useState(false);
  const [selectVersion, setSelectVersion] = useState(false);
  const versionHistorySelected = useRecoilCallback(({snapshot, set}) => async (version) => {
    set(versionHistoryReleasedSelectedAtom, version.versionId);
    let loadableDoenetML = await snapshot.getPromise(fileByContentId(version.contentId));
    const doenetML = loadableDoenetML.data;
    set(viewerDoenetMLAtom, (was) => {
      let newObj = {...was};
      newObj.doenetML = doenetML;
      newObj.updateNumber = was.updateNumber + 1;
      return newObj;
    });
  });
  let aInfo = "";
  const assignmentInfoSettings = useRecoilValueLoadable(loadAssignmentSelector(itemInfo.branchId));
  if (assignmentInfoSettings?.state === "hasValue") {
    aInfo = assignmentInfoSettings?.contents;
  }
  if (versionHistory.state === "loading") {
    return null;
  }
  if (versionHistory.state === "hasError") {
    console.error(versionHistory.contents);
    return null;
  }
  let assignVersions = [];
  let makeAssignmentforReleasedButton = null;
  let unAssignButton = null;
  let viewContentButton = null;
  let releasedVersions = [];
  let switchAssignmentButton = null;
  if (versionHistory.state === "hasValue") {
    for (let version of versionHistory.contents.named) {
      let titleText = version.title;
      let versionStyle = {};
      if (selectVersion) {
        versionStyle = {backgroundColor: "#b8d2ea"};
        makeAssignmentforReleasedButton = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, {
          value: "Make Assignment",
          callback: async () => {
            setIsAssigned(true);
            const result = await addContentAssignment({
              driveIditemIdbranchIdparentFolderId: {
                driveId: itemInfo.driveId,
                folderId: itemInfo.parentFolderId,
                itemId: itemInfo.itemId
              },
              branchId: itemInfo.branchId,
              contentId: selectedContentId(),
              versionId: selectedVId
            });
            let payload = {
              ...aInfo,
              itemId: itemInfo.itemId,
              assignment_title: "Untitled Assignment",
              isAssigned: "1",
              branchId: itemInfo.branchId,
              contentId: selectedContentId(),
              driveId: itemInfo.driveId,
              versionId: selectedVId
            };
            makeAssignment({
              driveIdFolderId: {
                driveId: itemInfo.driveId,
                folderId: itemInfo.parentFolderId
              },
              itemId: itemInfo.itemId,
              payload
            });
            updateVersionHistory(itemInfo.branchId, selectedVId);
            try {
              if (result.success) {
                addToast(`Add new assignment 'Untitled assignment'`, ToastType.SUCCESS);
              } else {
                onAssignmentError({errorMessage: result.message});
              }
            } catch (e) {
              onAssignmentError({errorMessage: e});
            }
          }
        }), /* @__PURE__ */ React.createElement("br", null));
        unAssignButton = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, {
          value: "Unassign",
          callback: async () => {
            assignmentToContent({
              driveIditemIdbranchIdparentFolderId: {
                driveId: itemInfo.driveId,
                folderId: itemInfo.parentFolderId,
                itemId: itemInfo.itemId
              },
              branchId: itemInfo.branchId,
              contentId: version?.contentId,
              versionId: version?.versionId
            });
            convertAssignmentToContent({
              driveIdFolderId: {
                driveId: itemInfo.driveId,
                folderId: itemInfo.parentFolderId
              },
              itemId: itemInfo.itemId,
              branchId: itemInfo.branchId,
              contentId: version?.contentId,
              versionId: version?.versionId
            });
            const result = axios.post(`/api/handleMakeContent.php`, {contentId: version?.contentId, versionId: version?.versionId, itemId: itemInfo.itemId, branchId: itemInfo.branchId});
            result.then((resp) => {
              if (resp.data.success) {
                addToast(`'${itemInfo.assignment_title}' back to '${itemInfo.label}''`, ToastType.SUCCESS);
              } else {
                onAssignmentError({errorMessage: resp.data.message});
              }
            }).catch((e) => {
              onAssignmentError({errorMessage: e.message});
            });
          }
        }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null));
        viewContentButton = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, {
          value: "View Version",
          callback: () => {
            openOverlay({
              type: "content",
              branchId: itemInfo?.branchId
            });
          }
        }));
        switchAssignmentButton = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, {
          value: "Switch Assignment",
          callback: async () => {
            setIsAssigned(true);
            const result = await addContentAssignment({
              driveIditemIdbranchIdparentFolderId: {
                driveId: itemInfo.driveId,
                folderId: itemInfo.parentFolderId,
                itemId: itemInfo.itemId
              },
              branchId: itemInfo.branchId,
              contentId: selectedContentId(),
              versionId: selectedVId
            });
            let payload = {
              itemId: itemInfo.itemId,
              assignment_title: "Untitled Assignment",
              isAssigned: "1",
              branchId: itemInfo.branchId,
              contentId: selectedContentId(),
              driveId: itemInfo.driveId,
              versionId: selectedVId
            };
            makeAssignment({
              driveIdFolderId: {
                driveId: itemInfo.driveId,
                folderId: itemInfo.parentFolderId
              },
              itemId: itemInfo.itemId,
              payload
            });
            updateVersionHistory(itemInfo.branchId, selectedVId);
            updatePrevVersionHistory(itemInfo.branchId, prevAssignedVersionId());
            try {
              if (result.success) {
                addToast(`Switch  assignment 'Untitled assignment'`, ToastType.SUCCESS);
              } else {
                onAssignmentError({errorMessage: result.message});
              }
            } catch (e) {
              onAssignmentError({errorMessage: e});
            }
          }
        }));
      }
      let assignedTitle = "";
      let assignedIcon = "";
      if (version.isReleased === "1") {
        assignedTitle = titleText;
      } else if (version.isReleased === "1" && version?.isAssigned == "1") {
        assignedTitle = `${assignedIcon} ${titleText}`;
      }
      releasedVersions = /* @__PURE__ */ React.createElement(React.Fragment, {
        key: `history${version.versionId}`
      }, /* @__PURE__ */ React.createElement("div", {
        onClick: () => {
          if (version.versionId !== selectedVersionId) {
            versionHistorySelected(version);
          }
        },
        style: versionStyle
      }, /* @__PURE__ */ React.createElement("div", null, version.title)));
      if (version.isReleased === "1") {
        assignVersions.push(releasedVersions);
      }
    }
  }
  const selectedVersion = (item) => {
    setSelectVersion(true);
    setSelectedVId(item);
    setSelectedVersionAtom(item);
  };
  const checkIfAssigned = (item) => {
    const assignedArr = versionHistory.contents.named.filter((item2) => item2.versionId === selectedVId);
    if (assignedArr.length > 0 && assignedArr[0].isAssigned == "1") {
      return true;
    } else {
      return false;
    }
  };
  const checkAssignArrItemAssigned = (item) => {
    const assignedArr = versionHistory.contents.named.filter((item2) => item2.isAssigned == "1");
    if (assignedArr.length > 0) {
      return true;
    } else {
      return false;
    }
  };
  const prevAssignedVersionId = () => {
    const assignedArr = versionHistory.contents.named.filter((item) => item.isAssigned == "1");
    if (assignedArr.length > 0) {
      return assignedArr[0].versionId;
    } else {
      return "";
    }
  };
  const selectedContentId = () => {
    const assignedArr = versionHistory.contents.named.filter((item) => item.versionId === selectedVId);
    if (assignedArr.length > 0) {
      return assignedArr[0].contentId;
    } else {
      return "";
    }
  };
  let assigned = /* @__PURE__ */ React.createElement("select", {
    multiple: true,
    onChange: (event) => selectedVersion(event.target.value)
  }, versionHistory.contents.named.map((item, i) => /* @__PURE__ */ React.createElement(React.Fragment, null, item.isReleased == 1 ? /* @__PURE__ */ React.createElement("option", {
    key: i,
    value: item.versionId
  }, item.isAssigned == 1 ? "*" : "", item.title) : "")));
  return /* @__PURE__ */ React.createElement(React.Fragment, null, assigned, /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), itemInfo.isAssigned !== "1" && makeAssignmentforReleasedButton, itemInfo.isAssigned == "1" && checkIfAssigned() && unAssignButton, itemInfo.isAssigned == "1" && checkAssignArrItemAssigned() && !checkIfAssigned() && switchAssignmentButton);
};
const ItemInfoPanel = (props) => {
  let versionArr = [];
  const contentInfoLoad = useRecoilValueLoadable(selectedInformation);
  const versionHistory = useRecoilValueLoadable(itemHistoryAtom(contentInfoLoad?.contents?.itemInfo?.branchId));
  if (versionHistory.state === "loading") {
    return null;
  }
  if (versionHistory.state === "hasError") {
    console.error(versionHistory.contents);
    return null;
  }
  if (versionHistory.state === "hasValue") {
    versionArr = versionHistory?.contents?.named;
  }
  if (contentInfoLoad.state === "loading") {
    return null;
  }
  if (contentInfoLoad.state === "hasError") {
    console.error(contentInfoLoad.contents);
    return null;
  }
  let contentInfo = contentInfoLoad?.contents?.itemInfo;
  if (contentInfoLoad.contents?.number > 1) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h1", null, contentInfoLoad.contents.number, " Content Selected"));
  } else if (contentInfoLoad.contents?.number === 1) {
    if (contentInfo?.itemType === "DoenetML") {
      return /* @__PURE__ */ React.createElement(DoenetMLInfoPanel, {
        key: `DoenetMLInfoPanel${contentInfo.itemId}`,
        contentInfo,
        props,
        versionArr
      });
    } else if (contentInfo?.itemType === "Folder") {
      return /* @__PURE__ */ React.createElement(FolderInfoPanel, {
        key: `FolderInfoPanel${contentInfo.itemId}`,
        contentInfo
      });
    }
  }
  return null;
};
const VersionInfo = (props) => {
  const contentInfoLoad = useRecoilValueLoadable(selectedInformation);
  if (contentInfoLoad.state === "loading") {
    return null;
  }
  if (contentInfoLoad.state === "hasError") {
    console.error(contentInfoLoad.contents);
    return null;
  }
  let contentInfo = contentInfoLoad?.contents?.itemInfo;
  if (contentInfoLoad.contents?.number > 1) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h1", null, contentInfoLoad.contents.number, " Content Selected"));
  } else if (contentInfoLoad.contents?.number === 1) {
    if (contentInfo?.itemType === "DoenetML") {
      return /* @__PURE__ */ React.createElement(VersionHistoryInfoPanel, {
        key: `VersionHistoryInfoPanel${contentInfo.itemId}`,
        contentInfo,
        props
      });
    }
  }
  return null;
};
