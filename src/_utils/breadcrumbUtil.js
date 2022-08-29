import {
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { pageToolViewAtom } from '../Tools/_framework/NewToolRoot';
import { effectivePermissionsByCourseId } from '../_reactComponents/PanelHeaderComponents/RoleDropdown';
import {
  studentData,
  assignmentData,
} from '../Tools/_framework/ToolPanels/Gradebook';
import {
  itemByDoenetId,
  coursePermissionsAndSettingsByCourseId,
  findFirstPageOfActivity,
} from '../_reactComponents/Course/CourseActions';

export function useCourseChooserCrumb() {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);

  return {
    label: 'Courses',
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
        } = await get(itemByDoenetId(parentDoenetId));
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

export function useEditorCrumb({ pageId, doenetId }) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const pageObj = useRecoilValue(itemByDoenetId(pageId));
  let { label: pageLabel } = pageObj;
  const activityObj = useRecoilValue(itemByDoenetId(doenetId));
  let { label: activityLabel } = activityObj;
  let crumbs = [
    {
      label: activityLabel ?? '_',
      onClick: () => {
        setPageToolView({
          page: 'course',
          tool: 'editor',
          view: '',
          params: {
            doenetId,
            pageId,
          },
        });
      },
    },
  ];

  if (!activityObj.isSinglePage && activityObj.type != 'bank') {
    let firstPageDoenetId = findFirstPageOfActivity(activityObj.content);
    crumbs = [
      {
        label: activityLabel ?? '_',
        onClick: () => {
          setPageToolView({
            page: 'course',
            tool: 'editor',
            view: '',
            params: {
              doenetId,
              pageId: firstPageDoenetId,
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
              doenetId,
              pageId,
            },
          });
        },
      },
    ];
  }

  if (activityObj.type == 'bank') {
    crumbs = [
      {
        label: pageLabel ?? '_',
        onClick: () => {
          setPageToolView({
            page: 'course',
            tool: 'editor',
            view: '',
            params: {
              doenetId,
              pageId,
            },
          });
        },
      },
    ];
  }

  return crumbs;
}

export function useAssignmentCrumb({ doenetId }) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const { label } = useRecoilValue(itemByDoenetId(doenetId));

  return {
    label: label ?? '_',
    onClick: () => {
      setPageToolView({
        page: 'course',
        tool: 'assignment',
        view: '',
        params: {
          doenetId,
        },
      });
    },
  };
}

export function usePeopleCrumb(courseId) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);

  return {
    label: 'People',
    onClick: () => {
      setPageToolView({
        page: 'course',
        tool: 'people',
        view: '',
        params: {
          courseId,
        },
      });
    },
  };
}

export function useDataCrumb(courseId, parentDoenetId) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const folderInfoArray = useRecoilValue(
    navigationSelectorFamily({ courseId, parentDoenetId }),
  );
  const crumbs = [
    {
      label: 'Data',
      onClick: () => {
        setPageToolView({
          page: 'course',
          tool: 'data',
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
              tool: 'data',
              view: '',
              params: {
                courseId,
                sectionId: parentDoenetId,
              },
            });
          },
        });
        break;

      default:
        console.warn(`Unsupported navigration crumb type: ${type}`);
    }
  }

  return crumbs;
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
  const [{ params: pageToolParams, tool }, setPageToolView] =
    useRecoilState(pageToolViewAtom);
  let crumbs = [];
  const { canViewAndModifyGrades } = useRecoilValue(
    effectivePermissionsByCourseId(pageToolParams?.courseId),
  );
  const students = useRecoilValue(studentData);
  const assignments = useRecoilValue(assignmentData);

  //Define gradebook tool crumb
  if (canViewAndModifyGrades == '1') {
    {
      let params = {
        courseId: pageToolParams?.courseId,
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
    (canViewAndModifyGrades != '1' && tool == 'gradebookStudentAssignment') ||
    (pageToolParams?.previousCrumb == 'student' &&
      tool == 'gradebookStudentAssignment')
  ) {
    let label = 'Gradebook';
    if (canViewAndModifyGrades == '1') {
      const student = students[pageToolParams?.userId];
      label = `${student.firstName} ${student.lastName}`;
    }

    let params = {
      courseId: pageToolParams?.courseId,
      userId: pageToolParams?.userId,
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
    (pageToolParams?.previousCrumb == 'assignment' &&
      tool == 'gradebookStudentAssignment')
  ) {
    if (canViewAndModifyGrades != '1') {
      crumbs.push({ label: 'Not Available' });
    } else {
      let assignmentName = assignments?.[pageToolParams?.doenetId]?.label;
      if (!assignmentName) {
        assignmentName = '_';
      }

      let params = {
        courseId: pageToolParams?.courseId,
        doenetId: pageToolParams?.doenetId,
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
  if (canViewAndModifyGrades != '1') {
    let assignmentName = assignments?.[pageToolParams?.doenetId]?.label;
    if (!assignmentName) {
      assignmentName = '_';
    }
    let params = {
      courseId: pageToolParams?.courseId,
      userId: pageToolParams?.userId,
      doenetId: pageToolParams?.doenetId,
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
    if (pageToolParams?.previousCrumb == 'student') {
      crumbLabel = assignments[pageToolParams?.doenetId].label;
    }
    if (pageToolParams?.previousCrumb == 'assignment') {
      const student = students[pageToolParams?.userId];
      crumbLabel = `${student.firstName} ${student.lastName}`;
    }

    let params = {
      courseId: pageToolParams?.courseId,
      userId: pageToolParams?.userId,
      doenetId: pageToolParams?.doenetId,
      previousCrumb: pageToolParams?.previousCrumb,
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
