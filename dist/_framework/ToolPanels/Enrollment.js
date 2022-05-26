import React, {useState} from "../../_snowpack/pkg/react.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {atom, useSetRecoilState, useRecoilValue} from "../../_snowpack/pkg/recoil.js";
import {useToast, toastType} from "../Toast.js";
import Checkbox from "../../_reactComponents/PanelHeaderComponents/Checkbox.js";
import {enrollmentByCourseId} from "../../_reactComponents/Course/CourseActions.js";
export const enrollmentTableDataAtom = atom({
  key: "enrollmentTableDataAtom",
  default: []
});
export const processAtom = atom({
  key: "processAtom",
  default: "Loading"
});
export const headersAtom = atom({
  key: "headersAtom",
  default: []
});
export const entriesAtom = atom({
  key: "entriesAtom",
  default: []
});
export const enrolllearnerAtom = atom({
  key: "enrolllearnerAtom",
  default: ""
});
export default function Enrollment() {
  const toast = useToast();
  const process = useRecoilValue(processAtom);
  const setProcess = useSetRecoilState(processAtom);
  const headers = useRecoilValue(headersAtom);
  const entries = useRecoilValue(entriesAtom);
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const {recoilUnWithdraw, recoilWithdraw, recoilMergeData, value: enrollmentTableData} = useRecoilValue(enrollmentByCourseId(courseId));
  let [showWithdrawn, setShowWithdrawn] = useState(false);
  if (!courseId) {
    return null;
  }
  let enrollmentRows = [];
  for (let [i, rowData] of enrollmentTableData.entries()) {
    if (rowData.withdrew === "0" || showWithdrawn) {
      let bgcolor = "white";
      let button = /* @__PURE__ */ React.createElement(Button, {
        value: "Withdraw",
        onClick: (e) => withDrawLearners(e, rowData.email)
      });
      if (rowData.withdrew === "1") {
        bgcolor = "grey";
        button = /* @__PURE__ */ React.createElement(Button, {
          value: "Enroll",
          onClick: (e) => enrollLearners(e, rowData.email)
        });
      }
      let enrolledDateString = "";
      if (rowData.withdrew === "0") {
        let t = rowData.dateEnrolled.split(/[- :]/);
        enrolledDateString = new Date(Date.UTC(t[0], t[1] - 1, t[2], t[3], t[4], t[5])).toLocaleString();
      }
      enrollmentRows.push(/* @__PURE__ */ React.createElement("tr", {
        style: {backgroundColor: bgcolor},
        key: `erow${i}`
      }, /* @__PURE__ */ React.createElement("td", null, rowData.firstName, " ", rowData.lastName), /* @__PURE__ */ React.createElement("td", null, rowData.section), /* @__PURE__ */ React.createElement("td", null, rowData.empId), /* @__PURE__ */ React.createElement("td", null, rowData.email), /* @__PURE__ */ React.createElement("td", null, enrolledDateString), /* @__PURE__ */ React.createElement("td", null, " ", button, " ")));
    }
  }
  const enrollmentTable = /* @__PURE__ */ React.createElement("table", null, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "Name"), /* @__PURE__ */ React.createElement("th", null, "Section"), /* @__PURE__ */ React.createElement("th", null, "ID"), /* @__PURE__ */ React.createElement("th", null, "Email"), /* @__PURE__ */ React.createElement("th", null, "Date Enrolled"))), /* @__PURE__ */ React.createElement("tbody", null, enrollmentRows));
  if (process === "Choose Columns") {
    let columnToIndex = {
      email: null,
      empId: null,
      firstName: null,
      lastName: null,
      section: null,
      dropped: null
    };
    for (let [i, colHead] of headers.entries()) {
      if (colHead === "EmplId" || colHead === "ID") {
        columnToIndex.empId = i;
      }
      if (colHead === "Email") {
        columnToIndex.email = i;
      }
      if (colHead === "First Name") {
        columnToIndex.firstName = i;
      }
      if (colHead === "Last Name") {
        columnToIndex.lastName = i;
      }
      if (colHead === "Section") {
        columnToIndex.section = i;
      }
      if (colHead === "mainsectionstatus") {
        columnToIndex.dropped = i;
      }
    }
    if (columnToIndex.email == null) {
      toast("Not Imported! CSV file needs an Email column heading.", toastType.ERROR);
    } else {
      let importHeads = [];
      let mergeHeads = [];
      if (columnToIndex.empId != null) {
        importHeads.push(/* @__PURE__ */ React.createElement("th", {
          key: "empId"
        }, "ID"));
        mergeHeads.push("id");
      }
      if (columnToIndex.firstName != null) {
        importHeads.push(/* @__PURE__ */ React.createElement("th", {
          key: "firstName"
        }, "First Name"));
        mergeHeads.push("firstName");
      }
      if (columnToIndex.lastName != null) {
        importHeads.push(/* @__PURE__ */ React.createElement("th", {
          key: "lastName"
        }, "Last Name"));
        mergeHeads.push("lastName");
      }
      if (columnToIndex.email != null) {
        importHeads.push(/* @__PURE__ */ React.createElement("th", {
          key: "email"
        }, "Email"));
        mergeHeads.push("email");
      }
      if (columnToIndex.section != null) {
        importHeads.push(/* @__PURE__ */ React.createElement("th", {
          key: "section"
        }, "Section"));
        mergeHeads.push("section");
      }
      let importRows = [];
      let mergeId = [];
      let mergeFirstName = [];
      let mergeLastName = [];
      let mergeEmail = [];
      let mergeSection = [];
      for (let [i, rowdata] of entries.entries()) {
        let rowcells = [];
        if (columnToIndex.empId != null && typeof rowdata[columnToIndex.empId] == "string") {
          let empId = rowdata[columnToIndex.empId].replace(/"/g, "");
          rowcells.push(/* @__PURE__ */ React.createElement("td", {
            key: "empId"
          }, empId));
          mergeId.push(empId);
        }
        if (columnToIndex.firstName != null && typeof rowdata[columnToIndex.firstName] == "string") {
          let firstName = rowdata[columnToIndex.firstName].replace(/"/g, "");
          rowcells.push(/* @__PURE__ */ React.createElement("td", {
            key: "firstName"
          }, firstName));
          mergeFirstName.push(firstName);
        }
        if (columnToIndex.lastName != null && typeof rowdata[columnToIndex.lastName] == "string") {
          let lastName = rowdata[columnToIndex.lastName].replace(/"/g, "");
          rowcells.push(/* @__PURE__ */ React.createElement("td", {
            key: "lastName"
          }, lastName));
          mergeLastName.push(lastName);
        }
        if (columnToIndex.email != null && typeof rowdata[columnToIndex.email] == "string") {
          let email = rowdata[columnToIndex.email].replace(/"/g, "");
          rowcells.push(/* @__PURE__ */ React.createElement("td", {
            key: "email"
          }, email));
          mergeEmail.push(email);
        }
        if (columnToIndex.section != null && typeof rowdata[columnToIndex.section] == "string") {
          let section = rowdata[columnToIndex.section].replace(/"/g, "");
          rowcells.push(/* @__PURE__ */ React.createElement("td", {
            key: "section"
          }, section));
          mergeSection.push(section);
        }
        importRows.push(/* @__PURE__ */ React.createElement("tr", {
          key: `rowdata${i}`
        }, rowcells));
      }
      let cancelButton = /* @__PURE__ */ React.createElement(Button, {
        alert: true,
        key: "cancel",
        onClick: () => setProcess("Display Enrollment"),
        value: "Cancel"
      });
      let mergeButton = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, {
        value: "Accept",
        key: "merge",
        onClick: () => {
          const payload = {
            courseId,
            mergeHeads,
            mergeId,
            mergeFirstName,
            mergeLastName,
            mergeEmail,
            mergeSection
          };
          recoilMergeData(payload);
          setProcess("Display Enrollment");
        }
      }));
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
        style: {flexDirection: "row", display: "flex"}
      }, /* @__PURE__ */ React.createElement("table", null, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, importHeads)), /* @__PURE__ */ React.createElement("tbody", null, importRows))), /* @__PURE__ */ React.createElement(ButtonGroup, null, cancelButton, mergeButton));
    }
  }
  const enrollLearners = (e, enrollLearner) => {
    e.preventDefault();
    recoilUnWithdraw(enrollLearner);
  };
  const withDrawLearners = (e, withdrewLearner) => {
    e.preventDefault();
    recoilWithdraw(withdrewLearner);
  };
  return /* @__PURE__ */ React.createElement("div", {
    style: {padding: "8px"}
  }, enrollmentTableData.length > 0 ? /* @__PURE__ */ React.createElement("div", null, "Show Withdrawn", " ", /* @__PURE__ */ React.createElement(Checkbox, {
    onClick: () => {
      setShowWithdrawn(!showWithdrawn);
    },
    checked: showWithdrawn
  })) : null, enrollmentTable, enrollmentTableData.length === 0 ? /* @__PURE__ */ React.createElement("p", null, "No Students are currently enrolled in the course") : null);
}
