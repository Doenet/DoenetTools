import React, {useEffect} from "../../_snowpack/pkg/react.js";
import {useRecoilValue, useSetRecoilState, useRecoilValueLoadable} from "../../_snowpack/pkg/recoil.js";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.js";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.js";
import {pageToolViewAtom, searchParamAtomFamily, profileAtom} from "../NewToolRoot.js";
import Next7Days from "../Widgets/Next7Days.js";
import {effectiveRoleAtom} from "../../_reactComponents/PanelHeaderComponents/RoleDropdown.js";
import {suppressMenusAtom} from "../NewToolRoot.js";
export default function Dashboard(props) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const path = useRecoilValue(searchParamAtomFamily("path"));
  const driveId = path.split(":")[0];
  const effectiveRole = useRecoilValue(effectiveRoleAtom);
  const setSuppressMenus = useSetRecoilState(suppressMenusAtom);
  const loadProfile = useRecoilValueLoadable(profileAtom);
  let profile = loadProfile.contents;
  useEffect(() => {
    if (effectiveRole === "student") {
      setSuppressMenus(["ClassTimes"]);
    } else {
      setSuppressMenus([]);
    }
  }, [effectiveRole, setSuppressMenus]);
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
  }), effectiveRole === "instructor" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, {
    value: "Enrollment",
    onClick: () => setPageToolView({
      page: "course",
      tool: "enrollment",
      view: "",
      params: {driveId}
    })
  }), /* @__PURE__ */ React.createElement(Button, {
    value: "Surveys",
    onClick: () => setPageToolView({
      page: "course",
      tool: "surveyList",
      view: "",
      params: {driveId}
    })
  })) : null, effectiveRole === "instructor" ? /* @__PURE__ */ React.createElement(Button, {
    value: "Gradebook",
    onClick: () => setPageToolView((was) => {
      return {
        page: "course",
        tool: "gradebook",
        view: was.view,
        params: {driveId}
      };
    })
  }) : /* @__PURE__ */ React.createElement(Button, {
    value: "Gradebook",
    onClick: () => setPageToolView((was) => {
      return {
        page: "course",
        tool: "gradebookStudent",
        view: was.view,
        params: {driveId, userId: profile.userId}
      };
    })
  }))), /* @__PURE__ */ React.createElement("div", {
    style: {marginTop: "10px", margin: "10px"}
  }, /* @__PURE__ */ React.createElement(Next7Days, {
    driveId
  })));
}
