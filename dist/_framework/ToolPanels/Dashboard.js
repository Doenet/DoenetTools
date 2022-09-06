import React, {useEffect} from "../../_snowpack/pkg/react.js";
import {
  useRecoilValue,
  useSetRecoilState,
  useRecoilValueLoadable
} from "../../_snowpack/pkg/recoil.js";
import Card from "../../_reactComponents/PanelHeaderComponents/Card.js";
import {
  pageToolViewAtom,
  searchParamAtomFamily,
  profileAtom
} from "../NewToolRoot.js";
import Next7Days from "../Widgets/Next7Days.js";
import {effectivePermissionsByCourseId} from "../../_reactComponents/PanelHeaderComponents/RoleDropdown.js";
import {suppressMenusAtom} from "../NewToolRoot.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {
  faCode,
  faUser,
  faChartPie,
  faTasks
} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
export default function Dashboard(props) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const {
    canModifyCourseSettings,
    canManageUsers,
    dataAccessPermission,
    canViewAndModifyGrades
  } = useRecoilValue(effectivePermissionsByCourseId(courseId));
  const setSuppressMenus = useSetRecoilState(suppressMenusAtom);
  const loadProfile = useRecoilValueLoadable(profileAtom);
  let profile = loadProfile.contents;
  useEffect(() => {
    setSuppressMenus(canModifyCourseSettings === "1" ? [] : ["ClassTimes"]);
  }, [canModifyCourseSettings, setSuppressMenus]);
  return /* @__PURE__ */ React.createElement("div", {
    style: props?.style ?? {}
  }, /* @__PURE__ */ React.createElement("div", {
    style: {marginLeft: "10px", marginRight: "10px"}
  }, /* @__PURE__ */ React.createElement("h1", null, "Welcome!"), /* @__PURE__ */ React.createElement("div", {
    style: {
      display: "grid",
      gridAutoFlow: "column dense",
      gridAutoColumns: "min-content",
      gap: "30px",
      width: "850px"
    }
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
  }), canManageUsers === "1" ? /* @__PURE__ */ React.createElement(Card, {
    name: "People",
    icon: /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faUser
    }),
    value: "People",
    onClick: () => setPageToolView({
      page: "course",
      tool: "people",
      view: "",
      params: {courseId}
    })
  }) : null, (dataAccessPermission ?? "None") !== "None" ? /* @__PURE__ */ React.createElement(Card, {
    name: "Data",
    icon: /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
      icon: faChartPie
    }),
    value: "Data",
    onClick: () => setPageToolView({
      page: "course",
      tool: "data",
      view: "",
      params: {courseId}
    })
  }) : null, canViewAndModifyGrades === "1" ? /* @__PURE__ */ React.createElement(Card, {
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
    courseId
  })));
}
