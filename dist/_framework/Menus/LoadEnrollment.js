import React, {useState, useCallback} from "../../_snowpack/pkg/react.js";
import {useDropzone} from "../../_snowpack/pkg/react-dropzone.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import parse from "../../_snowpack/pkg/csv-parse.js";
import {
  useSetRecoilState,
  useRecoilValue
} from "../../_snowpack/pkg/recoil.js";
import {processAtom, headersAtom, entriesAtom, enrollmentTableDataAtom} from "../ToolPanels/Enrollment.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {nanoid} from "../../_snowpack/pkg/nanoid.js";
export default function LoadEnrollment(props) {
  const process = useRecoilValue(processAtom);
  const setProcess = useSetRecoilState(processAtom);
  const headers = useRecoilValue(headersAtom);
  const setHeaders = useSetRecoilState(headersAtom);
  const entries = useRecoilValue(entriesAtom);
  const setEntries = useSetRecoilState(entriesAtom);
  const setEnrollmentTableDataAtom = useSetRecoilState(enrollmentTableDataAtom);
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
  const driveId = useRecoilValue(searchParamAtomFamily("driveId"));
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
    }
  }
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement("div", null, "Load Enrollment"), /* @__PURE__ */ React.createElement("div", {
    key: "drop",
    ...getRootProps()
  }, /* @__PURE__ */ React.createElement("input", {
    ...getInputProps()
  }), isDragActive ? /* @__PURE__ */ React.createElement("p", null, "Drop the files here") : /* @__PURE__ */ React.createElement(Button, {
    value: "Enroll Learners"
  })));
}
