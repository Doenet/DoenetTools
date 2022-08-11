import React, {useCallback} from "../../_snowpack/pkg/react.js";
import {useDropzone} from "../../_snowpack/pkg/react-dropzone.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import parse from "../../_snowpack/pkg/csv-parse.js";
import {atom, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import CollapseSection from "../../_reactComponents/PanelHeaderComponents/CollapseSection.js";
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
  default: [],
  effects: [
    ({onSet, setSelf}) => {
      onSet((newValue) => {
        setSelf(newValue.reduce((valid, candidate) => {
          if (validHeaders[candidate] !== void 0)
            return [...valid, candidate];
          return valid;
        }, []));
      });
    }
  ]
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
        setProcess(csvPeopleProcess.PREVIEW);
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
  }, /* @__PURE__ */ React.createElement("p", null, "Your file needs to contain an email address. The parser will ignore columns which are not listed."), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "Email (required)")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "ExternalId")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "FirstName")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "LastName")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "Section"))));
}
