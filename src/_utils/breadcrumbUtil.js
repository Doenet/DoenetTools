import { faTh } from '@fortawesome/free-solid-svg-icons';
import {
  selectorFamily,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil';
import { pageToolViewAtom } from '../Tools/_framework/NewToolRoot';
import { folderDictionary } from '../_reactComponents/Drive/NewDrive';
import { effectiveRoleAtom } from '../_reactComponents/PanelHeaderComponents/RoleDropdown';
import {
  studentData,
  assignmentData,
} from '../Tools/_framework/ToolPanels/Gradebook';
import {
  authorItemByDoenetId,
  coursePermissionsAndSettingsByCourseId,
} from '../_reactComponents/Course/CourseActions';

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
    ({ courseId, sectionId }) =>
    async ({ get }) => {
      async function getSection({ courseId, sectionId }) {
        if (sectionId === '') {
          return [];
        }
        const { label, parentDoenetId, itemType } = await get(
          authorItemByDoenetId(sectionId),
        );
        if (courseId === parentDoenetId) {
          return [{ label, sectionId, itemType }];
        }
        let results = await getSection({ courseId, sectionId: parentDoenetId });
        return [...results, { label, sectionId, itemType }];
      }

      return await getSection({ courseId, sectionId });
    },
});

export function useNavigationCrumbs(courseId, sectionId) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const folderInfoArray = useRecoilValue(
    navigationSelectorFamily({ courseId, sectionId }),
  );

  let crumbs = [];

  for (let item of folderInfoArray) {
    crumbs.push({
      label: item.label,
      onClick: () => {
        setPageToolView({
          page: 'course',
          tool: 'navigation',
          view: '',
          params: {
            courseId,
            sectionId: item.sectionId,
          },
        });
      },
    });
  }

  return crumbs;
}

export function useEditorCrumb({ doenetId, driveId, folderId, itemId }) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const folderInfo = useRecoilValue(folderDictionary({ driveId, folderId }));
  let label = folderInfo?.contentsDictionary?.[itemId]?.label;
  if (!label) {
    label = '_';
  }
  let params = {
    doenetId,
    path: `${driveId}:${folderId}:${itemId}:DoenetML`,
  };

  return {
    label,
    onClick: () => {
      setPageToolView({
        page: 'course',
        tool: 'editor',
        view: '',
        params,
      });
    },
  };
}

export function useCollectionCrumb(doenetId, path) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  let [driveId, folderId] = path.split(':');
  const folderInfo = useRecoilValue(folderDictionary({ driveId, folderId }));
  let label = folderInfo?.folderInfo?.label;
  if (!label) {
    label = '_';
  }

  let params = {
    doenetId,
    path,
  };

  return {
    label,
    onClick: () => {
      setPageToolView({
        page: 'course',
        tool: 'collection',
        view: '',
        params,
      });
    },
  };
}

export function useAssignmentCrumb({ doenetId, driveId, folderId, itemId }) {
  const setPageToolView = useSetRecoilState(pageToolViewAtom);
  const folderInfo = useRecoilValue(folderDictionary({ driveId, folderId }));
  let label = folderInfo?.contentsDictionary?.[itemId]?.label;
  if (!label) {
    label = '_';
  }

  let params = {
    doenetId,
    // path: `${driveId}:${folderId}:${itemId}:DoenetML`
  };

  return {
    label,
    onClick: () => {
      setPageToolView({
        page: 'course',
        tool: 'assignment',
        view: '',
        params,
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
