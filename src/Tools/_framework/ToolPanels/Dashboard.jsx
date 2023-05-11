import React, { useEffect } from "react";
import {
  useRecoilValue,
  useSetRecoilState,
  useRecoilValueLoadable,
} from "recoil";
import Card from "../../../_reactComponents/PanelHeaderComponents/Card";
import {
  pageToolViewAtom,
  searchParamAtomFamily,
  profileAtom,
} from '../NewToolRoot';
// import Next7Days from '../Widgets/Next7Days';
import ContentByWeek from '../Widgets/ContentByWeek';
import { effectivePermissionsByCourseId } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';
import { suppressMenusAtom } from '../NewToolRoot';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCode,
  faUser,
  faChartPie,
  faTasks,
} from "@fortawesome/free-solid-svg-icons";
import { coursePermissionsAndSettingsByCourseId } from "../../../_reactComponents/Course/CourseActions";

export default function Dashboard(props) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const courseId = useRecoilValue(searchParamAtomFamily("courseId"));
  const {
    canModifyCourseSettings,
    canManageUsers,
    dataAccessPermission,
    canViewAndModifyGrades,
  } = useRecoilValue(effectivePermissionsByCourseId(courseId));
  const setSuppressMenus = useSetRecoilState(suppressMenusAtom);
  const loadProfile = useRecoilValueLoadable(profileAtom);
  let profile = loadProfile.contents;

  useEffect(() => {
    setSuppressMenus(canModifyCourseSettings === "1" ? [] : ["ClassTimes"]);
  }, [canModifyCourseSettings, setSuppressMenus]);

  let course = useRecoilValue(coursePermissionsAndSettingsByCourseId(courseId));

  if (course?.canViewCourse == "0") {
    return <h1>No Access to view this page.</h1>;
  }

  return (
    <div style={props?.style ?? {}}>
      <div style={{ margin:"1rem" }}>
        <h1>Welcome!</h1>
        <div
          style={{
            display: 'flex',
            // gridAutoFlow: 'column dense',
            // gridAutoColumns: 'min-content',
            // gap: '30px',
            alignItems: 'center',
            gap: '30px',
            maxWidth: '850px',
            margin:"1rem"
          }}
        >
          <Card
            dataTest="Dashboard Content Card"
            name="Content"
            icon={<FontAwesomeIcon icon={faCode} />}
            value="Content"
            onClick={() => {
              setPageToolView((was) => {
                // console.log(">>>>was",was);
                return { ...was, tool: "navigation" };
              });
            }}
          />
          {canManageUsers === "1" ? (
            <Card
              dataTest="Dashboard People Card"
              name="People"
              icon={<FontAwesomeIcon icon={faUser} />}
              value="People"
              onClick={() =>
                setPageToolView({
                  page: "course",
                  tool: "people",
                  view: "",
                  params: { courseId },
                })
              }
            />
          ) : null}
          {(dataAccessPermission ?? "None") !== "None" ? (
            <Card
              dataTest="Dashboard Data Card"
              name="Data"
              icon={<FontAwesomeIcon icon={faChartPie} />}
              value="Data"
              onClick={() =>
                setPageToolView({
                  page: "course",
                  tool: "data",
                  view: "",
                  params: { courseId },
                })
              }
            />
          ) : null}
          {canViewAndModifyGrades === "1" ? (
            <Card
              dataTest="Dashboard Gradebook Card"
              name="Gradebook"
              icon={<FontAwesomeIcon icon={faTasks} />}
              value="Gradebook"
              onClick={() =>
                setPageToolView((was) => {
                  return {
                    page: "course",
                    tool: "gradebook",
                    view: was.view,
                    params: { courseId },
                  };
                })
              }
            />
          ) : (
            <Card
              name="Gradebook"
              icon={<FontAwesomeIcon icon={faTasks} />}
              style={{ marginLeft: "-600px" }}
              value="Gradebook"
              onClick={() =>
                setPageToolView((was) => {
                  return {
                    page: "course",
                    tool: "gradebookStudent",
                    view: was.view,
                    params: { courseId, userId: profile.userId },
                  };
                })
              }
            />
          )}
        </div>
      </div>
      <div style={{ margin: '2rem'}}>
        <ContentByWeek courseId={courseId}/>
      </div>
    </div>
  );
}
