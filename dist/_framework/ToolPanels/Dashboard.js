import React from "../../_snowpack/pkg/react.js";
import {useRecoilValue, useSetRecoilState, useRecoilValueLoadable} from "../../_snowpack/pkg/recoil.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import {pageToolViewAtom, searchParamAtomFamily, profileAtom} from "../NewToolRoot.js";
export default function Dashboard(props) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const path = useRecoilValue(searchParamAtomFamily("path"));
  const pageToolView = useRecoilValue(pageToolViewAtom);
  const role = pageToolView.view;
  const driveId = path.split(":")[0];
  const loadProfile = useRecoilValueLoadable(profileAtom);
  let profile = loadProfile.contents;
  return /* @__PURE__ */ React.createElement("div", {
    style: props?.style ?? {}
  }, /* @__PURE__ */ React.createElement("div", {
    style: {marginLeft: "10px", marginRight: "10px"}
  }, /* @__PURE__ */ React.createElement("h1", null, "Welcome!"), /* @__PURE__ */ React.createElement(ButtonGroup, {
    vertical: true
  }, /* @__PURE__ */ React.createElement(Button, {
    value: "Content",
    onClick: () => {
      setPageToolView((was) => {
        return {...was, tool: "navigation"};
      });
    }
  }), role === "instructor" ? /* @__PURE__ */ React.createElement(Button, {
    value: "Enrollment",
    onClick: () => setPageToolView({
      page: "course",
      tool: "enrollment",
      view: "",
      params: {driveId}
    })
  }) : null, role === "instructor" ? /* @__PURE__ */ React.createElement(Button, {
    value: "GradeBook",
    onClick: () => setPageToolView((was) => {
      return {
        page: "course",
        tool: "gradebook",
        view: was.view,
        params: {driveId}
      };
    })
  }) : /* @__PURE__ */ React.createElement(Button, {
    value: "GradeBook",
    onClick: () => setPageToolView((was) => {
      return {
        page: "course",
        tool: "gradebookStudent",
        view: was.view,
        params: {driveId, userId: profile.userId}
      };
    })
  }))), /* @__PURE__ */ React.createElement("div", {
    style: {border: "2px solid black", borderRadius: "5px", marginTop: "10px", height: "560px", margin: "10px"}
  }, /* @__PURE__ */ React.createElement("p", {
    style: {marginLeft: "18px"}
  }, "More coming soon!")));
}
