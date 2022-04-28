import { faTh } from '../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js';
import {
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from '../_snowpack/pkg/recoil.js';
import { pageToolViewAtom } from '../_framework/NewToolRoot.js';
import { effectiveRoleAtom } from '../_reactComponents/PanelHeaderComponents/RoleDropdown.js';
import {
  studentData,
  assignmentData,
} from '../_framework/ToolPanels/Gradebook.js';
import {
  authorItemByDoenetId,
  coursePermissionsAndSettingsByCourseId,
  findFirstPageOfActivity,
} from '../_reactComponents/Course/CourseActions.js';

export function useCourseChooserCrumb() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);

  return {
    icon: faTh,
    onClick: () => {
      setPageToolView({
        page: 'course',
        tool: 'courseChooser',
        view: '',
      });
    },
  };
}

export function useDashboardCrumb(courseId) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const course = useRecoilValue(
    coursePermissionsAndSettingsByCourseId(courseId),
  );

  let label = course?.label;

  return {
    label,
    onClick: () => {
      setPageToolView({
        page: 'course',
        tool: 'dashboard',
        view: '',
        params: {
          courseId,
        },
      });
    },
  };
}

const navigationSelectorFamily = selectorFamily({
  key: 'navigationSelectorFamily/Default',
  get:
    ({ courseId, parentDoenetId }) =>
    async ({ get }) => {
      async function getSections({ courseId, parentDoenetId }) {
        if (parentDoenetId === '' || parentDoenetId === undefined) {
          return [];
        }
        const {
          label,
          parentDoenetId: itemParentDoenetId,
          type,
        } = await get(authorItemByDoenetId(parentDoenetId));
        if (courseId === itemParentDoenetId) {
          return [{ label, parentDoenetId, type }];
        }
        let results = await getSections({
          courseId,
          parentDoenetId: itemParentDoenetId,
        });
        return [...results, { label, parentDoenetId, type }];
      }

      return await getSections({ courseId, parentDoenetId });
    },
});

export function useNavigationCrumbs(courseId, parentDoenetId) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const folderInfoArray = useRecoilValue(
    navigationSelectorFamily({ courseId, parentDoenetId }),
  );

  const crumbs = [
    {
      label: 'Content',
      onClick: () => {
        setPageToolView({
          page: 'course',
          tool: 'navigation',
          view: '',
          params: {
            courseId,
          },
        });
      },
    },
  ];

  for (let { label, parentDoenetId, type } of folderInfoArray) {
    switch (type) {
      case 'section':
        crumbs.push({
          label,
          onClick: () => {
            setPageToolView({
              page: 'course',
              tool: 'navigation',
              view: '',
              params: {
                courseId,
                sectionId: parentDoenetId,
              },
            });
          },
        });
        break;
      // case 'activity':
      //   crumbs.push({
      //     label,
      //     onClick: () => {
      //       setPageToolView({
      //         page: 'course',
      //         tool: 'activity',
      //         view: '',
      //         params: {
      //           courseId,
      //           sectionId: parentDoenetId,
      //         },
      //       });
      //     },
      //   });
      //   break;
      default:
        console.warn(`Unsupported navigration crumb type: ${type}`);
    }
  }

  return crumbs;
}

export function useEditorCrumb({ pageId, doenetId, sectionId, courseId }) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const pageObj = useRecoilValue(authorItemByDoenetId(pageId));
  let {label:pageLabel} = pageObj;
  const activityObj = useRecoilValue(authorItemByDoenetId(doenetId));
  let { label:activityLabel } = activityObj;

  let crumbs = [{
    label: activityLabel ?? '_',
    onClick: () => {
      setPageToolView({
        page: 'course',
        tool: 'editor',
        view: '',
        params: {
          courseId,
          sectionId,
          doenetId,
          pageId,
        },
      });
    },
  }]

  if (!activityObj.isSinglePage){
    let firstPageDoenetId = findFirstPageOfActivity(activityObj.order);
    crumbs = [
      {
      label: activityLabel ?? '_',
      onClick: () => {
        setPageToolView({
          page: 'course',
          tool: 'editor',
          view: '',
          params: {
            courseId,
            sectionId,
            doenetId,
            pageId:firstPageDoenetId,
          },
        });
      },
    },
    {
      label: pageLabel ?? '_',
      onClick: () => {
        setPageToolView({
          page: 'course',
          tool: 'editor',
          view: '',
          params: {
            courseId,
            sectionId,
            doenetId,
            pageId,
          },
        });
      },
    }]
  }
  return crumbs;
}

export function useAssignmentCrumb({ doenetId, courseId, sectionId }) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const { label } = useRecoilValue(authorItemByDoenetId(doenetId));

  return {
    label: label ?? '_',
    onClick: () => {
      setPageToolView({
        page: 'course',
        tool: 'assignment',
        view: '',
        params: {
          courseId,
          sectionId,
          doenetId,
        },
      });
    },
  };
}

export function useEnrollmentCrumb(courseId) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);

  return {
    label: 'Enrollment',
    onClick: () => {
      setPageToolView({
        page: 'course',
        tool: 'enrollment',
        view: '',
        params: {
          courseId,
        },
      });
    },
  };
}

export function useSurveyCrumb(driveId, doenetId) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);

  let params = {
    driveId,
  };

  let firstCrumb = {
    label: 'Surveys',
    onClick: () => {
      setPageToolView({
        page: 'course',
        tool: 'surveyList',
        view: '',
        params,
      });
    },
  };
  if (doenetId) {
    let params2 = {
      driveId,
      doenetId,
    };
    return [
      firstCrumb,
      {
        label: 'Data',
        onClick: () => {
          setPageToolView({
            page: 'course',
            tool: 'surveyData',
            view: '',
            params: params2,
          });
        },
      },
    ];
  } else {
    return [firstCrumb];
  }
}

export function useGradebookCrumbs() {
  const [pageToolView, setPageToolView] = useRecoilState(pageToolViewAtom);
  let crumbs = [];
  const role = useRecoilValue(effectiveRoleAtom);
  const students = useRecoilValue(studentData);
  const assignments = useRecoilValue(assignmentData);

  let courseId = pageToolView.params?.courseId;
  let doenetId = pageToolView.params?.doenetId;
  let userId = pageToolView.params?.userId;
  let previousCrumb = pageToolView.params?.previousCrumb;
  let tool = pageToolView.tool;

  //Define gradebook tool crumb
  if (role == 'instructor') {
    {
      let params = {
        courseId,
      };
      crumbs.push({
        label: 'Gradebook',
        onClick: () => {
          setPageToolView({
            page: 'course',
            tool: 'gradebook',
            view: '',
            params,
          });
        },
      });
    }
  }

  if (tool == 'gradebook') {
    return crumbs;
  }

  //Handle gradebookStudent
  if (
    tool == 'gradebookStudent' ||
    (role == 'student' && tool == 'gradebookStudentAssignment') ||
    (previousCrumb == 'student' && tool == 'gradebookStudentAssignment')
  ) {
    let label = 'Gradebook';
    if (role == 'instructor') {
      const student = students[userId];
      label = `${student.firstName} ${student.lastName}`;
    }

    let params = {
      courseId,
      userId,
    };
    crumbs.push({
      label,
      onClick: () => {
        setPageToolView({
          page: 'course',
          tool: 'gradebookStudent',
          view: '',
          params,
        });
      },
    });
  }

  if (tool == 'gradebookStudent') {
    return crumbs;
  }

  //Only instructors see this
  if (
    tool == 'gradebookAssignment' ||
    (previousCrumb == 'assignment' && tool == 'gradebookStudentAssignment')
  ) {
    if (role == 'student') {
      crumbs.push({ label: 'Not Available' });
    } else {
      let assignmentName = assignments?.[doenetId]?.label;
      if (!assignmentName) {
        assignmentName = '_';
      }

      let params = {
        courseId,
        doenetId,
      };
      crumbs.push({
        label: assignmentName,
        onClick: () => {
          setPageToolView({
            page: 'course',
            tool: 'gradebookAssignment',
            view: '',
            params,
          });
        },
      });
    }
  }

  if (tool == 'gradebookAssignment') {
    return crumbs;
  }

  //tool is gradebookStudentAssignment
  if (role == 'student') {
    let assignmentName = assignments?.[doenetId]?.label;
    if (!assignmentName) {
      assignmentName = '_';
    }
    let params = {
      courseId,
      userId,
      doenetId,
    };
    crumbs.push({
      label: assignmentName,
      onClick: () => {
        setPageToolView({
          page: 'course',
          tool: 'gradebookStudentAssignment',
          view: '',
          params,
        });
      },
    });
  } else {
    let crumbLabel = '_';
    if (previousCrumb == 'student') {
      crumbLabel = assignments[doenetId].label;
    }
    if (previousCrumb == 'assignment') {
      const student = students[userId];
      crumbLabel = `${student.firstName} ${student.lastName}`;
    }

    let params = {
      courseId,
      userId,
      doenetId,
      previousCrumb,
    };
    crumbs.push({
      label: crumbLabel,
      onClick: () => {
        setPageToolView({
          page: 'course',
          tool: 'gradebookStudentAssignment',
          view: '',
          params,
        });
      },
    });
  }

  return crumbs;
}
