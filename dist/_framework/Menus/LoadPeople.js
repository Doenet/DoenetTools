import React, {useCallback, useState} from "../../_snowpack/pkg/react.js";
import {useDropzone} from "../../_snowpack/pkg/react-dropzone.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import parse from "../../_snowpack/pkg/csv-parse.js";
import {atom, useRecoilCallback, useRecoilValue, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import CollapseSection from "../../_reactComponents/PanelHeaderComponents/CollapseSection.js";
import {toastType, useToast} from "../Toast.js";
import {coursePermissionsAndSettings, useCourse} from "../../_reactComponents/Course/CourseActions.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import CheckboxButton from "../../_reactComponents/PanelHeaderComponents/Checkbox.js";
import {useEffect} from "../../_snowpack/pkg/react.js";
import axios from "../../_snowpack/pkg/axios.js";
export const peopleTableDataAtom = atom({
  key: "peopleTableDataAtom",
  default: []
});
export const processAtom = atom({
  key: "processAtom",
  default: "Idle"
});
export const validHeaders = Object.freeze({
  Email: "Email",
  FirstName: "FirstName",
  LastName: "LastName",
  Section: "Section",
  ExternalId: "ExternalId"
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
export const csvPeopleProcess = Object.freeze({
  IDLE: "idle",
  SELECT: "select",
  PREVIEW: "preview"
});
export default function LoadPeople({style}) {
  const addToast = useToast();
  const setProcess = useSetRecoilState(processAtom);
  const setHeaders = useSetRecoilState(headersAtom);
  const setEntries = useSetRecoilState(entriesAtom);
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  let {canAutoEnroll} = useCourse(courseId);
  const [localAutoEnroll, setLocalAutoEnroll] = useState(canAutoEnroll);
  useEffect(() => {
    let value = false;
    if (canAutoEnroll == "1") {
      value = true;
    }
    setLocalAutoEnroll(value);
  }, [canAutoEnroll]);
  const setAutoEnroll = useRecoilCallback((set) => async (courseId2, autoEnroll) => {
    let canAutoEnroll2 = 0;
    if (autoEnroll) {
      canAutoEnroll2 = 1;
    }
    let {data} = await axios.post("/api/modifyCourse.php", {courseId: courseId2, canAutoEnroll: canAutoEnroll2});
    set(coursePermissionsAndSettings, (prev) => {
      let next = {...prev};
      next.canAutoEnroll = canAutoEnroll2;
      return next;
    });
  });
  const onDrop = useCallback((file) => {
    const reader = new FileReader();
    reader.onabort = () => {
    };
    reader.onerror = () => {
    };
    reader.onload = () => {
      parse(reader.result, {comment: "#"}, function(err, data) {
        if (err?.message) {
          addToast(`${err.message}. Please reformat and try again`, toastType.ERROR);
        } else {
          setHeaders(data[0]);
          data.shift();
          setEntries(data);
          setProcess(csvPeopleProcess.PREVIEW);
        }
      });
    };
    reader.readAsText(file[0]);
  }, [setEntries, setHeaders, setProcess]);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});
  return /* @__PURE__ */ React.createElement("div", {
    style
  }, /* @__PURE__ */ React.createElement("div", {
    key: "drop",
    ...getRootProps()
  }, /* @__PURE__ */ React.createElement("input", {
    ...getInputProps(),
    "data-test": "Import CSV file"
  }), isDragActive ? /* @__PURE__ */ React.createElement("p", null, "Drop the files here") : /* @__PURE__ */ React.createElement(ButtonGroup, {
    vertical: true
  }, /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    value: "Import CSV file"
  }))), /* @__PURE__ */ React.createElement("div", {
    style: {height: "4px"}
  }), /* @__PURE__ */ React.createElement(CollapseSection, {
    title: "Formatting Instructions",
    collapsed: true,
    style: {marginTop: "12px"}
  }, /* @__PURE__ */ React.createElement("p", null, "Your file needs to contain an email address. The parser will ignore columns which are not listed."), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "Email (required)")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "ExternalId")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "FirstName")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "LastName")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "Section"))), /* @__PURE__ */ React.createElement("p", {
    style: {display: "flex"}
  }, /* @__PURE__ */ React.createElement(CheckboxButton, {
    dataTest: "Auto Enroll",
    checked: localAutoEnroll,
    onClick: () => {
      setLocalAutoEnroll(!localAutoEnroll);
      setAutoEnroll(courseId, !localAutoEnroll);
    }
  }), " ", /* @__PURE__ */ React.createElement("span", {
    style: {marginLeft: "10px"}
  }, "Auto Enrollment"), " "));
}
