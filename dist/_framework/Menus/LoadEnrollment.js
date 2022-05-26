import React, {useCallback} from "../../_snowpack/pkg/react.js";
import {useDropzone} from "../../_snowpack/pkg/react-dropzone.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import parse from "../../_snowpack/pkg/csv-parse.js";
import {
  useSetRecoilState
} from "../../_snowpack/pkg/recoil.js";
import {processAtom, headersAtom, entriesAtom} from "../ToolPanels/Enrollment.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import CollapseSection from "../../_reactComponents/PanelHeaderComponents/CollapseSection.js";
export default function LoadEnrollment(props) {
  const setProcess = useSetRecoilState(processAtom);
  const setHeaders = useSetRecoilState(headersAtom);
  const setEntries = useSetRecoilState(entriesAtom);
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
  return /* @__PURE__ */ React.createElement("div", {
    style: props.style
  }, /* @__PURE__ */ React.createElement("div", {
    key: "drop",
    ...getRootProps()
  }, /* @__PURE__ */ React.createElement("input", {
    ...getInputProps()
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
  }, /* @__PURE__ */ React.createElement("p", null, "Your file needs to contain an email address.  The parser will ignore columns which are not listed."), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "Email (required)")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "EmplID or ID")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "First Name")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "Last Name")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "Section"))));
}
