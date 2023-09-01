import {faLink} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import React, {useEffect, useState} from "../../_snowpack/pkg/react.js";
import {useRecoilCallback, useRecoilValue, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import {itemByDoenetId, selectedCourseItems, useCourse} from "../../_reactComponents/Course/CourseActions.js";
import {pageToolViewAtom, searchParamAtomFamily} from "../NewToolRoot.js";
import ActionButton from "../../_reactComponents/PanelHeaderComponents/ActionButton.js";
import ActionButtonGroup from "../../_reactComponents/PanelHeaderComponents/ActionButtonGroup.js";
import Textfield from "../../_reactComponents/PanelHeaderComponents/Textfield.js";
import axios from "../../_snowpack/pkg/axios.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
export default function SelectedPageLink() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const doenetId = useRecoilValue(selectedCourseItems)[0];
  const pageObj = useRecoilValue(itemByDoenetId(doenetId));
  const [itemTextFieldLabel, setItemTextFieldLabel] = useState(pageObj.label);
  let {updateContentLinksToSources} = useCourse(courseId);
  const renamePageLink = useRecoilCallback(({set}) => async (courseId2, doenetId2, label) => {
    const {data} = await axios.get("/api/renamePageLink.php", {params: {courseId: courseId2, doenetId: doenetId2, label}});
    set(itemByDoenetId(doenetId2), (prev) => {
      let next = {...prev};
      next.label = label;
      return next;
    });
  });
  useEffect(() => {
    if (itemTextFieldLabel !== pageObj.label) {
      setItemTextFieldLabel(pageObj.label);
    }
  }, [doenetId]);
  let heading = /* @__PURE__ */ React.createElement("h2", {
    "data-test": "infoPanelItemLabel",
    style: {margin: "16px 5px"}
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faLink
  }), " ", pageObj.label);
  function handleLabelModfication() {
    renamePageLink(courseId, doenetId, itemTextFieldLabel);
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, heading, /* @__PURE__ */ React.createElement(ActionButtonGroup, {
    vertical: true
  }, /* @__PURE__ */ React.createElement(ActionButton, {
    width: "menu",
    value: "View Page Link",
    onClick: () => {
      setPageToolView({
        page: "course",
        tool: "editor",
        view: "",
        params: {
          linkPageId: doenetId
        }
      });
    }
  })), /* @__PURE__ */ React.createElement(Textfield, {
    label: "Label",
    vertical: true,
    width: "menu",
    value: itemTextFieldLabel,
    onChange: (e) => setItemTextFieldLabel(e.target.value),
    onKeyDown: (e) => {
      if (e.keyCode === 13)
        handleLabelModfication();
    },
    onBlur: handleLabelModfication
  }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement(Button, {
    width: "menu",
    value: "Update Content to Source",
    onClick: (e) => {
      e.preventDefault();
      e.stopPropagation();
      updateContentLinksToSources({pages: [doenetId]});
    }
  }));
}
