import axios from "../../_snowpack/pkg/axios.js";
import parse from "../../_snowpack/pkg/csv-parse.js";
import React, {useEffect, useReducer, useCallback} from "../../_snowpack/pkg/react.js";
import {useDropzone} from "../../_snowpack/pkg/react-dropzone.js";
import {
  atomFamily,
  useRecoilCallback,
  useRecoilValue,
  useResetRecoilState
} from "../../_snowpack/pkg/recoil.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import CollapseSection from "../../_reactComponents/PanelHeaderComponents/CollapseSection.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {toastType, useToast} from "../Toast.js";
function groupReducer(state, action) {
  switch (action.type) {
    case "mount":
      return {...action.payload};
    case "min":
      return {
        ...state,
        min: action.payload.min > 1 ? action.payload.min : 1,
        max: state.max < action.payload.min ? action.payload.min : state.max,
        pref: state.pref < action.payload.min ? action.payload.min : state.pref
      };
    case "max":
      return {
        ...state,
        min: state.min,
        max: state.min <= action.payload.max ? action.payload.max : state.max,
        pref: state.pref < action.payload.max ? action.payload.max : state.pref
      };
    case "pref":
      return {
        ...state,
        pref: state.min <= action.payload.pref && action.payload.pref <= state.max ? action.payload.pref : state.pref
      };
    case "preAssigned":
      try {
        axios.post("/api/updateGroupSettings.php", {
          ...state,
          preAssigned: action.payload.preAssigned,
          doenetId: action.payload.doenetId
        });
      } catch (error) {
        console.error(error);
      }
      return {...state, preAssigned: action.payload.preAssigned};
    case "isReleased":
      return {...state, isReleased: action.payload.isReleased};
    case "save":
      try {
        axios.post("/api/updateGroupSettings.php", {
          ...state,
          doenetId: action.payload.doenetId
        });
      } catch (error) {
        console.error(error);
      }
      return state;
    default:
      throw new Error("Invaild groupSettings dispach");
  }
}
function shuffle(array) {
  var m = array.length, t, i;
  while (m) {
    i = Math.floor(Math.random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}
export const csvGroups = atomFamily({
  key: "csvGroups",
  default: {namesByGroup: [], emailsByGroup: []}
});
export default function GroupSettings() {
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const {emailsByGroup} = useRecoilValue(csvGroups(doenetId));
  const reset = useResetRecoilState(csvGroups(doenetId));
  const addToast = useToast();
  const [{min, max, pref, preAssigned, isReleased}, dispach] = useReducer(groupReducer, {
    min: 0,
    max: 0,
    pref: 0,
    preAssigned: 0,
    isReleased: 0
  });
  const assignCollection = useCallback(async (doenetId2, grouping) => {
    try {
      const {
        data: {entries}
      } = await axios.get("/api/loadCollection.php", {
        params: {doenetId: doenetId2}
      });
      if (entries?.length > 0) {
        const shuffledEntries = shuffle(entries);
        const shuffledGroups = shuffle([...grouping]);
        axios.post("/api/assignCollection.php", {
          doenetId: doenetId2,
          groups: JSON.stringify(shuffledGroups),
          entries: JSON.stringify(shuffledEntries)
        });
        dispach({type: "isReleased", payload: {isReleased: "1"}});
      } else {
        addToast("Please add at least one entry to the collection before assigning", toastType.ERROR);
      }
    } catch (error) {
      console.error(error);
    }
  }, [addToast]);
  const generateRandomGroups = useCallback(() => {
  }, []);
  const onDrop = useRecoilCallback(({set}) => (file) => {
    const reader = new FileReader();
    reader.onabort = () => {
    };
    reader.onerror = () => {
    };
    reader.onload = () => {
      parse(reader.result, {comment: "#"}, function(err, data) {
        if (err) {
          console.error(err);
          addToast(`CSV invalid – Error: ${err}`, toastType.ERROR);
        } else {
          const headers = data.shift();
          const emailColIdx = headers.indexOf("Email");
          const groupColIdx = headers.indexOf("Group Number");
          const firstNameIdx = headers.indexOf("First Name");
          const lastNameIdx = headers.indexOf("Last Name");
          const newCSVGroups = {namesByGroup: [], emailsByGroup: []};
          if (emailColIdx === -1) {
            addToast('File missing "Email" column header', toastType.ERROR);
          } else if (groupColIdx === -1) {
            addToast('File missing "Group Number" column header', toastType.ERROR);
          } else {
            for (let studentLine in data) {
              let studentData = data[studentLine];
              let groupNumber = studentData[groupColIdx] - 1;
              if (!newCSVGroups.emailsByGroup[groupNumber]) {
                newCSVGroups.emailsByGroup[groupNumber] = [];
                newCSVGroups.namesByGroup[groupNumber] = [];
              }
              newCSVGroups.emailsByGroup[groupNumber].push(studentData[emailColIdx]);
              newCSVGroups.namesByGroup[groupNumber].push({
                firstName: studentData[firstNameIdx] ?? "",
                lastName: studentData[lastNameIdx] ?? ""
              });
            }
          }
          for (let i = 0; i < newCSVGroups.emailsByGroup.length; i++) {
            if (!newCSVGroups.emailsByGroup[i]) {
              newCSVGroups.emailsByGroup[i] = [];
              newCSVGroups.namesByGroup[i] = [];
            }
          }
          set(csvGroups(doenetId), newCSVGroups);
        }
      });
    };
    reader.readAsText(file[0]);
  }, [addToast, doenetId]);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});
  useEffect(() => {
    let mounted = true;
    async function loadData(doenetId2) {
      try {
        const resp = await axios.get("/api/loadGroupSettings.php", {
          params: {doenetId: doenetId2}
        });
        if (mounted) {
          dispach({type: "mount", payload: resp.data});
        }
      } catch (error) {
        console.error(error);
      }
    }
    if (doenetId !== "") {
      loadData(doenetId);
    }
    return () => {
      mounted = false;
      reset();
    };
  }, [doenetId, reset]);
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", null, "Pre-Assigned Groups:", /* @__PURE__ */ React.createElement("input", {
    type: "checkbox",
    checked: preAssigned === "1",
    value: preAssigned === "1",
    onChange: (e) => {
      dispach({
        type: "preAssigned",
        payload: {preAssigned: e.target.checked ? "1" : "0", doenetId}
      });
    }
  })), /* @__PURE__ */ React.createElement("br", null), preAssigned === "1" ? /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", {
    key: "drop",
    ...getRootProps()
  }, /* @__PURE__ */ React.createElement("input", {
    ...getInputProps()
  }), isDragActive ? /* @__PURE__ */ React.createElement("p", null, "Drop files here") : /* @__PURE__ */ React.createElement(ButtonGroup, null, /* @__PURE__ */ React.createElement(Button, {
    value: "Upload CSV",
    width: "menu"
  }))), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(CollapseSection, {
    title: "Formatting Instructions",
    collapsed: true
  }, /* @__PURE__ */ React.createElement("p", null, "Your file needs to contain email address and group number columns. They can be in any order, but the headers are case sensitive."), /* @__PURE__ */ React.createElement("p", null, "Name fields are displayed for convenience – only required data is used to assign the Collection"), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "First Name")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "Last Name")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "Email (required)")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, "Group Number (required)")), /* @__PURE__ */ React.createElement("p", null, "NOTE: The parser will ignore columns which are not listed."))) : /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", {
    key: "min"
  }, "Min Studnets:", /* @__PURE__ */ React.createElement("input", {
    type: "number",
    value: min,
    onChange: (e) => {
      dispach({type: "min", payload: {min: e.target.value}});
    }
  })), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("label", {
    key: "max"
  }, "Max Students:", /* @__PURE__ */ React.createElement("input", {
    type: "number",
    value: max,
    onChange: (e) => {
      dispach({type: "max", payload: {max: e.target.value}});
    }
  })), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("label", {
    key: "pref"
  }, "Preferred Students:", /* @__PURE__ */ React.createElement("input", {
    type: "number",
    value: pref,
    onChange: (e) => {
      dispach({type: "pref", payload: {pref: e.target.value}});
    }
  })), /* @__PURE__ */ React.createElement("br", null)), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(ButtonGroup, {
    vertical: true
  }, preAssigned === "1" ? null : /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    value: "Save",
    onClick: () => {
      dispach({type: "save", payload: {doenetId}});
    }
  }), /* @__PURE__ */ React.createElement(Button, {
    alert: true,
    disabled: isReleased === "1",
    width: "menu",
    value: "Assign Collection",
    onClick: () => {
      assignCollection(doenetId, emailsByGroup);
    }
  })));
}
