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
  encodeParams
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
import {drivecardSelectedNodesAtom} from "../library/Library.js";
import Enrollment from "./Enrollment.js";
import {useAssignment} from "./CourseActions.js";
import {useAssignmentCallbacks} from "../_reactComponents/Drive/DriveActions.js";
import {selectedInformation} from "../library/Library.js";
import CollapseSection from "../_reactComponents/PanelHeaderComponents/CollapseSection.js";
export const roleAtom = atom({
  key: "roleAtom",
  default: "Instructor"
});
const loadAssignmentSelector = selectorFamily({
  key: "loadAssignmentSelector",
  get: (assignmentId) => async ({get, set}) => {
    const {data} = await axios.get(`/api/getAllAssignmentSettings.php?assignmentId=${assignmentId}`);
    return data;
  }
});
export const assignmentDictionary = atomFamily({
  key: "assignmentDictionary",
  default: selectorFamily({
    key: "assignmentDictionary/Default",
    get: (driveIdcourseIditemIdparentFolderId) => async ({get}, instructions) => {
      let folderInfoQueryKey = {
        driveId: driveIdcourseIditemIdparentFolderId.driveId,
        folderId: driveIdcourseIditemIdparentFolderId.folderId
      };
      let folderInfo = get(folderDictionarySelector(folderInfoQueryKey));
      const itemObj = folderInfo?.contentsDictionary?.[driveIdcourseIditemIdparentFolderId.itemId];
      let itemIdassignmentId = itemObj?.assignmentId ? itemObj.assignmentId : null;
      if (itemIdassignmentId) {
        const aInfo = await get(loadAssignmentSelector(itemIdassignmentId));
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
  get: (driveIdcourseIditemIdparentFolderId) => ({get}) => {
    return get(assignmentDictionary(driveIdcourseIditemIdparentFolderId));
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
  const {activateMenuPanel} = useToolControlHelper();
  const contentInfoLoad = useRecoilValueLoadable(selectedInformation);
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
  let courseId = "";
  if (urlParamsObj?.courseId !== void 0) {
    courseId = urlParamsObj?.courseId;
  }
  useEffect(() => {
    if (routePathDriveId === "") {
      activateMenuPanel(1);
    }
  }, []);
  const history = useHistory();
  const DriveCardCallBack = ({item}) => {
    let newParams = {};
    newParams["path"] = `${item.driveId}:${item.driveId}:${item.driveId}:Drive`;
    newParams["courseId"] = `${item.courseId}`;
    history.push("?" + encodeParams(newParams));
  };
  const setDrivecardSelection = useSetRecoilState(drivecardSelectedNodesAtom);
  const clearSelections = useSetRecoilState(clearDriveAndItemSelections);
  const [openEnrollment, setEnrollmentView] = useState(false);
  const role = useRecoilValue(roleAtom);
  function cleardrivecardSelection() {
    setDrivecardSelection([]);
  }
  function useOutsideDriveSelector() {
    let newParams = {};
    newParams["path"] = `:::`;
    history.push("?" + encodeParams(newParams));
  }
  let breadcrumbContainer = null;
  if (routePathDriveId) {
    breadcrumbContainer = /* @__PURE__ */ React.createElement(BreadcrumbContainer, null);
  }
  const setEnrollment = (e) => {
    e.preventDefault();
    setEnrollmentView(!openEnrollment);
  };
  const enrollCourseId = {courseId};
  let hideUnpublished = true;
  if (role === "Instructor") {
    hideUnpublished = false;
  }
  let urlClickBehavior = "";
  if (role === "Instructor") {
    urlClickBehavior = "select";
  }
  let responsiveControls = "";
  if (role === "Instructor" && routePathDriveId) {
    responsiveControls = /* @__PURE__ */ React.createElement(Button, {
      value: openEnrollment ? "Close Enrollment" : "Open Enrollment",
      callback: (e) => setEnrollment(e)
    });
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
  return /* @__PURE__ */ React.createElement(Tool, null, /* @__PURE__ */ React.createElement("headerPanel", {
    title: "Course"
  }), /* @__PURE__ */ React.createElement("navPanel", {
    isInitOpen: true
  }, /* @__PURE__ */ React.createElement(GlobalFont, null), /* @__PURE__ */ React.createElement("div", {
    style: {marginBottom: "40px", height: "100vh"},
    onClick: useOutsideDriveSelector
  }, /* @__PURE__ */ React.createElement(Drive, {
    driveId: routePathDriveId,
    foldersOnly: true
  }))), /* @__PURE__ */ React.createElement("mainPanel", {
    responsiveControls
  }, /* @__PURE__ */ React.createElement(AutoSelect, null), openEnrollment ? /* @__PURE__ */ React.createElement(Enrollment, {
    selectedCourse: enrollCourseId
  }) : /* @__PURE__ */ React.createElement(React.Fragment, null, breadcrumbContainer, /* @__PURE__ */ React.createElement("div", {
    onClick: () => {
      clearSelections();
    },
    className: routePathDriveId ? "mainPanelStyle" : ""
  }, /* @__PURE__ */ React.createElement(Container, null, /* @__PURE__ */ React.createElement(Drive, {
    driveId: routePathDriveId,
    hideUnpublished,
    subTypes: ["Administrator"],
    urlClickBehavior: "select",
    doenetMLDoubleClickCallback: (info) => {
      let isAssignment = info.item.isAssignment === "0" ? "content" : "assignment";
      openOverlay({
        type: isAssignment,
        branchId: info.item.branchId,
        contentId: info.item.contentId,
        assignmentId: info.item.assignmentId
      });
    }
  }))), /* @__PURE__ */ React.createElement("div", {
    onClick: cleardrivecardSelection,
    tabIndex: 0,
    className: routePathDriveId ? "" : "mainPanelStyle"
  }, !routePathDriveId && /* @__PURE__ */ React.createElement("h2", null, "Admin"), /* @__PURE__ */ React.createElement(DriveCards, {
    routePathDriveId,
    isOneDriveSelect: true,
    types: ["course"],
    subTypes: ["Administrator"],
    driveDoubleClickCallback: ({item}) => {
      DriveCardCallBack({item});
    }
  }), !routePathDriveId && /* @__PURE__ */ React.createElement("h2", null, "Student"), /* @__PURE__ */ React.createElement(DriveCards, {
    routePathDriveId,
    isOneDriveSelect: true,
    types: ["course"],
    subTypes: ["Student"],
    driveDoubleClickCallback: ({item}) => {
      DriveCardCallBack({item});
    }
  })))), routePathDriveId && /* @__PURE__ */ React.createElement("menuPanel", {
    isInitOpen: true,
    title: "Selected"
  }, /* @__PURE__ */ React.createElement(ItemInfo, {
    route: props.route
  }), /* @__PURE__ */ React.createElement("br", null)), /* @__PURE__ */ React.createElement("menuPanel", {
    title: "+add"
  }));
}
const DoenetMLInfoPanel = (props) => {
  let urlParamsObj = Object.fromEntries(new URLSearchParams(props.props.route.location.search));
  let courseId = "";
  if (urlParamsObj?.courseId !== void 0) {
    courseId = urlParamsObj?.courseId;
  }
  const {
    addContentAssignment,
    changeSettings,
    saveSettings,
    assignmentToContent,
    loadAvailableAssignment,
    publishContentAssignment,
    onAssignmentError
  } = useAssignment();
  const {
    makeAssignment,
    onmakeAssignmentError,
    publishAssignment,
    onPublishAssignmentError,
    publishContent,
    onPublishContentError,
    updateAssignmentTitle,
    onUpdateAssignmentTitleError,
    convertAssignmentToContent,
    onConvertAssignmentToContentError
  } = useAssignmentCallbacks();
  const itemInfo = props.contentInfo;
  const assignmentInfoSettings = useRecoilValueLoadable(assignmentDictionarySelector({
    driveId: itemInfo.driveId,
    folderId: itemInfo.parentFolderId,
    itemId: itemInfo.itemId,
    courseId
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
  let viewDoenetMLButton = itemInfo.isAssignment === "0" && /* @__PURE__ */ React.createElement(Button, {
    value: "View DoenetML",
    callback: () => {
      openOverlay({
        type: "content",
        branchId: itemInfo?.branchId,
        contentId: itemInfo?.contentId
      });
    }
  });
  const {openOverlay} = useToolControlHelper();
  const handleChange = (event) => {
    event.preventDefault();
    let name = event.target.name;
    let value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    const result = changeSettings({
      [name]: value,
      driveIdcourseIditemIdparentFolderId: {
        driveId: itemInfo.driveId,
        folderId: itemInfo.parentFolderId,
        itemId: itemInfo.itemId,
        courseId
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
      driveIdcourseIditemIdparentFolderId: {
        driveId: itemInfo.driveId,
        folderId: itemInfo.parentFolderId,
        itemId: itemInfo.itemId,
        courseId
      }
    });
    let payload = {
      itemId: itemInfo.itemId,
      isAssignment: "1",
      assignmentId: aInfo?.assignmentId,
      [name]: value
    };
    if (name === "assignment_title") {
      updateAssignmentTitle({
        driveIdFolderId: {
          driveId: itemInfo.driveId,
          folderId: itemInfo.parentFolderId
        },
        itemId: itemInfo.itemId,
        payloadAssignment: payload
      });
    }
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
    axios.post(`/api/handlePublishContent.php`, payload).then((response) => {
      console.log(response.data);
    });
  };
  const handleMakeContent = (e) => {
    let payload = {
      itemId: itemInfo.itemId
    };
    axios.post(`/api/handleMakeContent.php`, payload).then((response) => {
      console.log(response.data);
    });
    assignmentToContent({
      driveIdcourseIditemIdparentFolderId: {
        driveId: itemInfo.driveId,
        folderId: itemInfo.parentFolderId,
        itemId: itemInfo.itemId,
        courseId
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
  };
  const loadBackAssignment = () => {
    let payload = {
      itemId: itemInfo.itemId,
      isAssignment: "1",
      assignmentId: aInfo?.assignmentId,
      title: aInfo?.assignment_title
    };
    axios.post(`/api/handleBackAssignment.php`, payload).then((response) => {
      console.log(response.data);
    });
    loadAvailableAssignment({
      ...aInfo,
      driveIdcourseIditemIdparentFolderId: {
        driveId: itemInfo.driveId,
        folderId: itemInfo.parentFolderId,
        itemId: itemInfo.itemId,
        courseId
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
  };
  const [showAForm, setShowAForm] = useState(false);
  const role = useRecoilValue(roleAtom);
  const [addToast, ToastType] = useToast();
  if (itemInfo?.isPublished === "0") {
    publishContentButton = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, {
      value: "Publish Content",
      switch_value: "Published",
      callback: handlePublishContent
    }));
  }
  if (itemInfo?.isAssignment === "0" && itemInfo.assignmentId === null) {
    makeAssignmentButton = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, {
      value: "Make Assignment",
      callback: () => {
        let assignmentId2 = nanoid();
        setShowAForm(true);
        const result = addContentAssignment({
          driveIdcourseIditemIdparentFolderId: {
            driveId: itemInfo.driveId,
            folderId: itemInfo.parentFolderId,
            itemId: itemInfo.itemId,
            courseId
          },
          branchId: itemInfo.branchId,
          contentId: itemInfo.contentId ? itemInfo.contentId : itemInfo.branchId,
          assignmentId: assignmentId2
        });
        let payload = {
          ...aInfo,
          itemId: itemInfo.itemId,
          assignment_title: "Untitled Assignment",
          assignmentId: assignmentId2,
          isAssignment: "1",
          branchId: itemInfo.branchId
        };
        makeAssignment({
          driveIdFolderId: {
            driveId: itemInfo.driveId,
            folderId: itemInfo.parentFolderId
          },
          itemId: itemInfo.itemId,
          payload
        });
        result.then((resp) => {
          if (resp) {
            addToast(`Add new assignment 'Untitled assignment'`, ToastType.SUCCESS);
          } else {
            onAssignmentError({errorMessage: resp.data.message});
          }
        }).catch((e) => {
          onAssignmentError({errorMessage: e.message});
        });
      }
    }));
  }
  if (itemInfo.isAssignment === "1" && (itemInfo.assignmentId || aInfo?.assignmentId)) {
    assignmentForm = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Assignment Name :"), /* @__PURE__ */ React.createElement("input", {
      required: true,
      type: "text",
      name: "assignment_title",
      value: aInfo ? aInfo?.assignment_title : "",
      placeholder: "Title goes here",
      onBlur: (e) => handleOnBlur(e),
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
      value: aInfo ? aInfo?.individualize : "",
      onBlur: handleOnBlur,
      onChange: handleChange
    })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Multiple Attempts: "), /* @__PURE__ */ React.createElement("input", {
      required: true,
      type: "checkbox",
      name: "multipleAttempts",
      value: aInfo ? aInfo?.multipleAttempts : "",
      onBlur: handleOnBlur,
      onChange: handleChange
    }), " "), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Show solution: "), /* @__PURE__ */ React.createElement("input", {
      required: true,
      type: "checkbox",
      name: "showSolution",
      value: aInfo ? aInfo?.showSolution : "",
      onBlur: handleOnBlur,
      onChange: handleChange
    }), " "), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Show feedback: "), /* @__PURE__ */ React.createElement("input", {
      required: true,
      type: "checkbox",
      name: "showFeedback",
      value: aInfo ? aInfo?.showFeedback : "",
      onBlur: handleOnBlur,
      onChange: handleChange
    })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Show hints: "), /* @__PURE__ */ React.createElement("input", {
      required: true,
      type: "checkbox",
      name: "showHints",
      value: aInfo ? aInfo?.showHints : "",
      onBlur: handleOnBlur,
      onChange: handleChange
    })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Show correctness: "), /* @__PURE__ */ React.createElement("input", {
      required: true,
      type: "checkbox",
      name: "showCorrectness",
      value: aInfo ? aInfo?.showCorrectness : "",
      onBlur: handleOnBlur,
      onChange: handleChange
    })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Proctor make available: "), /* @__PURE__ */ React.createElement("input", {
      required: true,
      type: "checkbox",
      name: "proctorMakesAvailable",
      value: aInfo ? aInfo?.proctorMakesAvailable : "",
      onBlur: handleOnBlur,
      onChange: handleChange
    })), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(Button, {
      value: "Publish assignment",
      switch_value: "publish changes",
      callback: () => {
        const result = publishContentAssignment({
          driveIdcourseIditemIdparentFolderId: {
            driveId: itemInfo.driveId,
            folderId: itemInfo.parentFolderId,
            itemId: itemInfo.itemId,
            courseId
          },
          branchId: itemInfo.branchId,
          contentId: itemInfo.contentId ? itemInfo.contentId : itemInfo.branchId,
          assignmentId
        });
        const payload = {
          ...aInfo,
          assignmentId,
          assignment_isPublished: "1",
          courseId,
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
          if (resp) {
          }
        });
      },
      type: "submit"
    }))));
  }
  if (itemInfo.isAssignment === "0" && aInfo?.assignmentId) {
    loadAssignmentButton = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, {
      value: "load Assignment",
      callback: loadBackAssignment
    }));
  }
  if (itemInfo.isAssignment === "1") {
    assignmentToContentButton = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, {
      value: "Make Content",
      callback: handleMakeContent
    }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(Button, {
      value: "View Assignment",
      callback: () => {
        openOverlay({
          type: "assignment",
          branchId: itemInfo?.branchId,
          contentId: itemInfo?.contentId,
          assignmentId: itemInfo?.assignmentId
        });
      }
    }));
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, makeAssignmentButton, /* @__PURE__ */ React.createElement("br", null), publishContentButton, /* @__PURE__ */ React.createElement("br", null), viewDoenetMLButton, /* @__PURE__ */ React.createElement("br", null), loadAssignmentButton, /* @__PURE__ */ React.createElement("br", null), assignmentToContentButton, /* @__PURE__ */ React.createElement("br", null), assignmentForm, /* @__PURE__ */ React.createElement("br", null));
};
const FolderInfoPanel = () => {
  return /* @__PURE__ */ React.createElement("h1", null, "Folder Info");
};
const ItemInfo = (props) => {
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
      return /* @__PURE__ */ React.createElement(DoenetMLInfoPanel, {
        key: `DoenetMLInfoPanel${contentInfo.itemId}`,
        contentInfo,
        props
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
