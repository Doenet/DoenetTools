import {faChalkboard} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import React from "../../_snowpack/pkg/react.js";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import {useCourse} from "../../_reactComponents/Course/CourseActions.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import DoenetDriveCardMenu from "../../_reactComponents/Drive/DoenetDriveCardMenu.js";
import {useToast, toastType} from "../Toast.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import {drivecardSelectedNodesAtom} from "../ToolHandlers/CourseToolHandler.js";
import {
  DeleteCourse,
  EditImageAndColor,
  EditLabel
} from "../../_reactComponents/Course/SettingComponents.js";
import {effectivePermissionsByCourseId} from "../../_reactComponents/PanelHeaderComponents/RoleDropdown.js";
import {pageToolViewAtom} from "../NewToolRoot.js";
import ActionButton from "../../_reactComponents/PanelHeaderComponents/ActionButton.js";
import ActionButtonGroup from "../../_reactComponents/PanelHeaderComponents/ActionButtonGroup.js";
export default function SelectedCourse() {
  const [courseCardsSelection, setCourseCardsSelection] = useRecoilState(drivecardSelectedNodesAtom);
  if (courseCardsSelection.length === 1) {
    return /* @__PURE__ */ React.createElement(CourseInfoPanel, {
      key: `CourseInfoPanel${courseCardsSelection[0].courseId}`,
      courseId: courseCardsSelection[0].courseId
    });
  } else if (courseCardsSelection.length > 1 && courseCardsSelection[0]?.isOwner) {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", null, " ", courseCardsSelection.length, " Courses Selected"), /* @__PURE__ */ React.createElement(ButtonGroup, {
      vertical: true
    }, /* @__PURE__ */ React.createElement(Button, {
      width: "menu",
      value: "Duplicate (Soon)",
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(">>>This will Duplicate courses");
        setCourseCardsSelection([]);
      }
    }), /* @__PURE__ */ React.createElement(Button, {
      width: "menu",
      value: "Delete Courses (Soon)",
      alert: true,
      onClick: (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log(">>>This will Delete multiple courses");
        setCourseCardsSelection([]);
      }
    })));
  }
  return null;
}
const CourseInfoPanel = function({courseId}) {
  const {label} = useCourse(courseId);
  const {
    isOwner,
    isAdmin,
    canViewUsers,
    dataAccessPermission,
    canModifyCourseSettings
  } = useRecoilValue(effectivePermissionsByCourseId(courseId));
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h2", {
    "data-test": "infoPanelItemLabel"
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faChalkboard
  }), " ", label), /* @__PURE__ */ React.createElement(ActionButtonGroup, {
    vertical: true
  }, /* @__PURE__ */ React.createElement(ActionButton, {
    width: "menu",
    value: "Enter Course",
    "data-test": "Enter Course nav button",
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
      setPageToolView({
        page: "course",
        tool: "dashboard",
        view: "",
        params: {
          courseId
        }
      });
    }
  })), canModifyCourseSettings === "1" && /* @__PURE__ */ React.createElement(EditLabel, {
    courseId
  }), canModifyCourseSettings === "1" && /* @__PURE__ */ React.createElement(EditImageAndColor, {
    courseId
  }), /* @__PURE__ */ React.createElement("br", null), isOwner === "1" && /* @__PURE__ */ React.createElement(DeleteCourse, {
    courseId
  }));
};
