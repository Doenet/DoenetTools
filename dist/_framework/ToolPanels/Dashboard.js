import React, {useEffect} from "../../_snowpack/pkg/react.js";
import {useRecoilValue, useSetRecoilState, useRecoilValueLoadable} from "../../_snowpack/pkg/recoil.js";
import Card from "../../_reactComponents/PanelHeaderComponents/Card.js";
import {pageToolViewAtom, searchParamAtomFamily, profileAtom} from "../NewToolRoot.js";
import Next7Days from "../Widgets/Next7Days.js";
import {effectiveRoleAtom} from "../../_reactComponents/PanelHeaderComponents/RoleDropdown.js";
import {suppressMenusAtom} from "../NewToolRoot.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {faCode, faUser, faChartPie, faTasks} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
export default function Dashboard(props) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
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
  }, /* @__PURE__ */ React.createElement("h1", null, "Welcome!"), /* @__PURE__ */ React.createElement("div", {
    style: {display: "grid", gridAutoFlow: "column dense", gridAutoColumns: "min-content", gap: "30px", width: "850px"}
  }, /* @__PURE__ */ React.createElement(Card, {
    name: "Content",
    icon: /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faCode
    }),
    value: "Content",
    onClick: () => {
      setPageToolView((was) => {
        return {...was, tool: "navigation"};
      });
    }
  }), effectiveRole === "instructor" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Card, {
    name: "Enrollment",
    icon: /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faUser
    }),
    value: "Enrollment",
    onClick: () => setPageToolView({
      page: "course",
      tool: "enrollment",
      view: "",
      params: {courseId}
    })
  }), /* @__PURE__ */ React.createElement(Card, {
    name: "Data",
    icon: /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faChartPie
    }),
    value: "Data",
    onClick: () => setPageToolView({
      page: "course",
      tool: "surveyList",
      view: "",
      params: {courseId}
    })
  })) : null, effectiveRole === "instructor" ? /* @__PURE__ */ React.createElement(Card, {
    name: "Gradebook",
    icon: /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faTasks
    }),
    value: "Gradebook",
    onClick: () => setPageToolView((was) => {
      return {
        page: "course",
        tool: "gradebook",
        view: was.view,
        params: {courseId}
      };
    })
  }) : /* @__PURE__ */ React.createElement(Card, {
    name: "Gradebook",
    icon: /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faTasks
    }),
    style: {marginLeft: "-600px"},
    value: "Gradebook",
    onClick: () => setPageToolView((was) => {
      return {
        page: "course",
        tool: "gradebookStudent",
        view: was.view,
        params: {courseId, userId: profile.userId}
      };
    })
  }))), /* @__PURE__ */ React.createElement("div", {
    style: {marginTop: "10px", margin: "10px"}
  }, /* @__PURE__ */ React.createElement(Next7Days, {
    driveId: courseId
  })));
}
