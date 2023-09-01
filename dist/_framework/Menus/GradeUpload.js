import React, {useCallback} from "../../_snowpack/pkg/react.js";
import {useDropzone} from "../../_snowpack/pkg/react-dropzone.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import parse from "../../_snowpack/pkg/csv-parse.js";
import {useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import {
  processGradesAtom,
  headersGradesAtom,
  entriesGradesAtom
} from "../ToolPanels/GradebookAssignment.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import CollapseSection from "../../_reactComponents/PanelHeaderComponents/CollapseSection.js";
export default function GradeUpload() {
  const setProcess = useSetRecoilState(processGradesAtom);
  const setHeaders = useSetRecoilState(headersGradesAtom);
  const setEntries = useSetRecoilState(entriesGradesAtom);
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
        setProcess("Upload Choice Table");
      });
    };
    reader.readAsText(file[0]);
  }, [setEntries, setHeaders, setProcess]);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});
  if (isDragActive) {
    setProcess("Assignment Table");
  }
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
    key: "drop",
    ...getRootProps()
  }, /* @__PURE__ */ React.createElement("input", {
    ...getInputProps()
  }), isDragActive ? /* @__PURE__ */ React.createElement("p", null, "Drop the files here") : /* @__PURE__ */ React.createElement(ButtonGroup, {
    vertical: true
  }, /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    value: "Import CSV file",
    onClick: () => setProcess("Assignment Table")
  }))), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(CollapseSection, {
    title: "Formatting Instructions",
    collapsed: true
  }, /* @__PURE__ */ React.createElement("p", null, "Your file needs to contain a Email column. The parser will ignore columns where the points do not match the points possible. e.g. if a assignment has 30 points possible you can only select from columns with 30 points in their second row. This is done to match canvas export formatting."), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "Email (required)")), /* @__PURE__ */ React.createElement("div", null, "First column is ", /* @__PURE__ */ React.createElement("strong", null, "Name")), /* @__PURE__ */ React.createElement("div", null, "Second row is ", /* @__PURE__ */ React.createElement("strong", null, "points possible"))));
}
