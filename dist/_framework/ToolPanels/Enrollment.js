import React, {useState, useEffect, useCallback} from "../../_snowpack/pkg/react.js";
import {nanoid} from "../../_snowpack/pkg/nanoid.js";
import axios from "../../_snowpack/pkg/axios.js";
import parse from "../../_snowpack/pkg/csv-parse.js";
import {useDropzone} from "../../_snowpack/pkg/react-dropzone.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {
  atom,
  useSetRecoilState,
  useRecoilValue,
  useRecoilState,
  selectorFamily,
  useRecoilValueLoadable,
  useRecoilCallback,
  atomFamily
} from "../../_snowpack/pkg/recoil.js";
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
export default function Enrollment(props) {
  console.log(">>>===Enrollment");
  const setEnrollmentTableDataAtom = useSetRecoilState(enrollmentTableDataAtom);
  const setProcess = useSetRecoilState(processAtom);
  const driveId = useRecoilValue(searchParamAtomFamily("driveId"));
  useEffect(() => {
    if (driveId !== "") {
      const payload = {params: {driveId}};
      axios.get("/api/getEnrollment.php", payload).then((resp) => {
        let enrollmentArray = resp.data.enrollmentArray;
        setEnrollmentTableDataAtom(enrollmentArray);
        setProcess("Display Enrollment");
      }).catch((error) => {
        console.warn(error);
      });
    }
  }, [driveId]);
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement(EnrollmentNew, {
    selectedCourse: "gr8KsFTPzHoI8l0eY74tu"
  }));
}
function EnrollmentNew(params) {
  const process = useRecoilValue(processAtom);
  const setProcess = useSetRecoilState(processAtom);
  const headers = useRecoilValue(headersAtom);
  const setHeaders = useSetRecoilState(headersAtom);
  const entries = useRecoilValue(entriesAtom);
  const setEntries = useSetRecoilState(entriesAtom);
  const enrolllearner = useRecoilValue(enrolllearnerAtom);
  const setEnrolllearner = useSetRecoilState(enrolllearnerAtom);
  const enrollmentTableData = useRecoilValue(enrollmentTableDataAtom);
  const setEnrollmentTableDataAtom = useSetRecoilState(enrollmentTableDataAtom);
  const driveId = useRecoilValue(searchParamAtomFamily("driveId"));
  const onDrop = useCallback((file) => {
    const reader = new FileReader();
    reader.onabort = () => {
    };
    reader.onerror = () => {
    };
    reader.onload = () => {
      parse(reader.result, {comment: "#"}, function(err, data) {
        setHeaders(data[0]);
        data.shift();
        setEntries(data);
        setProcess("Choose Columns");
      });
    };
    reader.readAsText(file[0]);
  }, []);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});
  useEffect(() => {
    if (driveId !== "") {
      const payload = {params: {driveId}};
      axios.get("/api/getEnrollment.php", payload).then((resp) => {
        let enrollmentArray = resp.data.enrollmentArray;
        setEnrollmentTableDataAtom(enrollmentArray);
        setProcess("Display Enrollment");
      }).catch((error) => {
        console.warn(error);
      });
    }
  }, [driveId]);
  if (!params.selectedCourse) {
    return ""(/* @__PURE__ */ React.createElement(React.Fragment, null, " ", /* @__PURE__ */ React.createElement("p", null, "Loading..."), " "));
  }
  let enrollmentRows = [];
  for (let [i, rowData] of enrollmentTableData.entries()) {
    enrollmentRows.push(/* @__PURE__ */ React.createElement("tr", {
      key: `erow${i}`
    }, /* @__PURE__ */ React.createElement("td", null, rowData.firstName, " ", rowData.lastName), /* @__PURE__ */ React.createElement("td", null, rowData.section), /* @__PURE__ */ React.createElement("td", null, rowData.empId), /* @__PURE__ */ React.createElement("td", null, rowData.email), /* @__PURE__ */ React.createElement("td", null, rowData.dateEnrolled), /* @__PURE__ */ React.createElement("td", null, " ", /* @__PURE__ */ React.createElement(Button, {
      value: "Withdraw",
      onClick: (e) => withDrawLearners(e, rowData.email)
    }))));
  }
  const enrollmentTable = /* @__PURE__ */ React.createElement("table", null, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", null, "Name"), /* @__PURE__ */ React.createElement("th", null, "Section"), /* @__PURE__ */ React.createElement("th", null, "ID"), /* @__PURE__ */ React.createElement("th", null, "Email"), /* @__PURE__ */ React.createElement("th", null, "Date Enrolled"))), /* @__PURE__ */ React.createElement("tbody", null, enrollmentRows));
  if (process === "Choose Columns") {
    let foundId = true;
    let columnToIndex = {
      email: null,
      empId: null,
      firstName: null,
      lastName: null,
      section: null,
      dropped: null
    };
    for (let [i, head] of headers.entries()) {
      const colHead = head.toLowerCase().replace(/\s/g, "").replace(/"/g, "");
      if (colHead === "emplid" || colHead === "id" || colHead === "studentid" || colHead === "employeeid") {
        columnToIndex.empId = i;
      }
      if (colHead === "emailaddress" || colHead === "email") {
        columnToIndex.email = i;
      }
      if (colHead === "firstname") {
        columnToIndex.firstName = i;
      }
      if (colHead === "lastname") {
        columnToIndex.lastName = i;
      }
      if (colHead === "section") {
        columnToIndex.section = i;
      }
      if (colHead === "mainsectionstatus") {
        columnToIndex.dropped = i;
      }
    }
    if (columnToIndex.empId == null && columnToIndex.email == null) {
      foundId = false;
    }
    if (!foundId) {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
        style: {flexDirection: "row", display: "flex"}
      }, /* @__PURE__ */ React.createElement("p", null, 'Data Needs to have a heading marked "id"'), /* @__PURE__ */ React.createElement("p", null, "No Data Imported"), /* @__PURE__ */ React.createElement(Button, {
        onClick: () => setProcess("Display Enrollment"),
        value: "OK"
      })));
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
      if (columnToIndex.dropped != null) {
        importHeads.push(/* @__PURE__ */ React.createElement("th", {
          key: "dropped"
        }, "Dropped"));
        mergeHeads.push("dropped");
      }
      let importRows = [];
      let mergeId = [];
      let mergeFirstName = [];
      let mergeLastName = [];
      let mergeEmail = [];
      let mergeSection = [];
      let mergeDropped = [];
      let userIds = [];
      for (let [i, rowdata] of entries.entries()) {
        let rowcells = [];
        let userId = nanoid();
        userIds.push(userId);
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
        if (columnToIndex.dropped != null && typeof rowdata[columnToIndex.dropped] == "string") {
          let dropped = rowdata[columnToIndex.dropped].replace(/"/g, "");
          rowcells.push(/* @__PURE__ */ React.createElement("td", {
            key: "dropped"
          }, dropped));
          mergeDropped.push(dropped);
        }
        importRows.push(/* @__PURE__ */ React.createElement("tr", {
          key: `rowdata${i}`
        }, rowcells));
      }
      let cancelButton = /* @__PURE__ */ React.createElement(Button, {
        alert: true,
        key: "cancel",
        onClick: () => setProcess("Display Enrollment"),
        value: "Stop Enrolling These Learners"
      });
      let mergeButton = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, {
        value: "Enroll these learners",
        key: "merge",
        onClick: () => {
          const payload = {
            driveId,
            mergeHeads,
            mergeId,
            mergeFirstName,
            mergeLastName,
            mergeEmail,
            mergeSection,
            mergeDropped,
            userIds
          };
          axios.post("/api/mergeEnrollmentData.php", payload).then((resp) => {
            const enrollmentArray = resp.data.enrollmentArray;
            if (enrollmentArray) {
              setEnrollmentTableDataAtom(enrollmentArray);
            }
            setProcess("Display Enrollment");
          });
        }
      }));
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
        style: {flexDirection: "row", display: "flex"}
      }, /* @__PURE__ */ React.createElement("table", null, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, importHeads)), /* @__PURE__ */ React.createElement("tbody", null, importRows))), /* @__PURE__ */ React.createElement(ButtonGroup, null, mergeButton, cancelButton));
    }
  }
  const enrollManual = (e) => {
    e.preventDefault();
    let payload = {
      email: enrolllearner,
      userId: nanoid(),
      driveId
    };
    axios.post("/api/manualEnrollment.php", payload).then((resp) => {
      const payload2 = {params: {driveId}};
      axios.get("/api/getEnrollment.php", payload2).then((resp2) => {
        let enrollmentArray = resp2.data.enrollmentArray;
        setEnrollmentTableDataAtom(enrollmentArray);
        setProcess("Display Enrollment");
        setEnrolllearner("");
      }).catch((error) => {
        console.warn(error);
      });
    });
  };
  const withDrawLearners = (e, withdrewLearner) => {
    e.preventDefault();
    let payload = {
      email: withdrewLearner,
      driveId
    };
    axios.post("/api/withDrawStudents.php", payload).then((resp) => {
      const payload2 = {params: {driveId}};
      axios.get("/api/getEnrollment.php", payload2).then((resp2) => {
        let enrollmentArray = resp2.data.enrollmentArray;
        setEnrollmentTableDataAtom(enrollmentArray);
        setProcess("Display Enrollment");
      }).catch((error) => {
        console.warn(error);
      });
    });
  };
  const handleChange = (e) => {
    setEnrolllearner(e.currentTarget.value);
  };
  let manualEnroll = /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Email:"), /* @__PURE__ */ React.createElement("input", {
    required: true,
    type: "email",
    name: "email",
    value: enrolllearner,
    placeholder: "example@example.com",
    onChange: handleChange
  }), /* @__PURE__ */ React.createElement(Button, {
    value: "Enroll",
    onClick: (e) => enrollManual(e)
  }));
  if (process === "Choose Columns") {
    let foundId = true;
    let columnToIndex = {
      email: null,
      empId: null,
      firstName: null,
      lastName: null,
      section: null,
      dropped: null
    };
    for (let [i, head] of headers.entries()) {
      const colHead = head.toLowerCase().replace(/\s/g, "").replace(/"/g, "");
      if (colHead === "emplid" || colHead === "id" || colHead === "studentid" || colHead === "employeeid") {
        columnToIndex.empId = i;
      }
      if (colHead === "emailaddress" || colHead === "email") {
        columnToIndex.email = i;
      }
      if (colHead === "firstname") {
        columnToIndex.firstName = i;
      }
      if (colHead === "lastname") {
        columnToIndex.lastName = i;
      }
      if (colHead === "section") {
        columnToIndex.section = i;
      }
      if (colHead === "mainsectionstatus") {
        columnToIndex.dropped = i;
      }
    }
    if (columnToIndex.empId == null && columnToIndex.email == null) {
      foundId = false;
    }
    if (!foundId) {
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
        style: {flexDirection: "row", display: "flex"}
      }, /* @__PURE__ */ React.createElement("p", null, 'Data Needs to have a heading marked "id"'), /* @__PURE__ */ React.createElement("p", null, "No Data Imported"), /* @__PURE__ */ React.createElement(Button, {
        onClick: () => setProcess("Display Enrollment"),
        value: "OK"
      })));
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
      if (columnToIndex.dropped != null) {
        importHeads.push(/* @__PURE__ */ React.createElement("th", {
          key: "dropped"
        }, "Dropped"));
        mergeHeads.push("dropped");
      }
      let importRows = [];
      let mergeId = [];
      let mergeFirstName = [];
      let mergeLastName = [];
      let mergeEmail = [];
      let mergeSection = [];
      let mergeDropped = [];
      let userIds = [];
      for (let [i, rowdata] of entries.entries()) {
        let rowcells = [];
        let userId = nanoid();
        userIds.push(userId);
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
        if (columnToIndex.dropped != null && typeof rowdata[columnToIndex.dropped] == "string") {
          let dropped = rowdata[columnToIndex.dropped].replace(/"/g, "");
          rowcells.push(/* @__PURE__ */ React.createElement("td", {
            key: "dropped"
          }, dropped));
          mergeDropped.push(dropped);
        }
        importRows.push(/* @__PURE__ */ React.createElement("tr", {
          key: `rowdata${i}`
        }, rowcells));
      }
      let cancelButton = /* @__PURE__ */ React.createElement(Button, {
        key: "cancel",
        onClick: () => setProcess("Display Enrollment"),
        value: "Cancel"
      });
      let mergeButton = /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, {
        value: "Merge",
        key: "merge",
        onClick: () => {
          const payload = {
            driveId,
            mergeHeads,
            mergeId,
            mergeFirstName,
            mergeLastName,
            mergeEmail,
            mergeSection,
            mergeDropped,
            userIds
          };
          axios.post("/api/mergeEnrollmentData.php", payload).then((resp) => {
            const enrollmentArray = resp.data.enrollmentArray;
            if (enrollmentArray) {
              setEnrollmentTableDataAtom(enrollmentArray);
            }
            setProcess("Display Enrollment");
          });
        }
      }));
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ButtonGroup, null));
    }
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, enrollmentTable, enrollmentTableData.length === 0 ? /* @__PURE__ */ React.createElement("p", null, "No Students are currently enrolled in the course") : "");
}
