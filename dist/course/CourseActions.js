import React from "../_snowpack/pkg/react.js";
import {nanoid} from "../_snowpack/pkg/nanoid.js";
import axios from "../_snowpack/pkg/axios.js";
import {useRecoilCallback} from "../_snowpack/pkg/recoil.js";
import {assignmentDictionary} from "./Course.js";
import Toast, {useToast} from "../_framework/Toast.js";
export const useAssignment = () => {
  const [addToast, ToastType] = useToast();
  const addContentAssignment = useRecoilCallback(({snapshot, set}) => async (props) => {
    let {driveIdcourseIditemIdparentFolderId, assignmentId, contentId, branchId} = props;
    let newAssignmentObj = {
      assignmentId,
      assignment_title: "Untitled Assignment",
      assignedDate: "",
      attemptAggregation: "",
      dueDate: "",
      gradeCategory: "",
      individualize: "0",
      isAssignment: "1",
      isPublished: "0",
      itemId: driveIdcourseIditemIdparentFolderId.itemId,
      multipleAttempts: "",
      numberOfAttemptsAllowed: "",
      proctorMakesAvailable: "0",
      showCorrectness: "1",
      showFeedback: "1",
      showHints: "1",
      showSolution: "1",
      timeLimit: "",
      totalPointsOrPercent: "",
      assignment_isPublished: "0",
      subType: "Administrator"
    };
    let payload = {
      assignmentId,
      itemId: driveIdcourseIditemIdparentFolderId.itemId,
      courseId: driveIdcourseIditemIdparentFolderId.courseId,
      branchId,
      contentId
    };
    set(assignmentDictionary(driveIdcourseIditemIdparentFolderId), newAssignmentObj);
    axios.post(`/api/makeNewAssignment.php`, payload).then((response) => {
      console.log(response.data);
    });
    return newAssignmentObj;
  });
  const changeSettings = useRecoilCallback(({snapshot, set}) => async (props) => {
    let {driveIdcourseIditemIdparentFolderId, ...value} = props;
    set(assignmentDictionary(driveIdcourseIditemIdparentFolderId), (old) => {
      return {...old, ...value};
    });
  });
  const saveSettings = useRecoilCallback(({snapshot, set}) => async (props) => {
    let {driveIdcourseIditemIdparentFolderId, ...value} = props;
    const saveInfo = await snapshot.getPromise(assignmentDictionary(driveIdcourseIditemIdparentFolderId));
    set(assignmentDictionary(driveIdcourseIditemIdparentFolderId), (old) => {
      return {...old, ...value};
    });
    let saveAssignmentNew = {...saveInfo, ...value};
    set(assignmentDictionary(driveIdcourseIditemIdparentFolderId), saveAssignmentNew);
    const payload = {
      ...saveInfo,
      assignmentId: saveAssignmentNew.assignmentId,
      assignment_isPublished: "0"
    };
    axios.post("/api/saveAssignmentToDraft.php", payload).then((resp) => {
      console.log(resp.data);
    });
  });
  const publishContentAssignment = useRecoilCallback(({snapshot, set}) => async (props) => {
    let {driveIdcourseIditemIdparentFolderId, ...value} = props;
    const publishAssignment = await snapshot.getPromise(assignmentDictionary(driveIdcourseIditemIdparentFolderId));
    set(assignmentDictionary(driveIdcourseIditemIdparentFolderId), publishAssignment);
    const payloadPublish = {
      ...value,
      assignmentId: props.assignmentId,
      assignment_isPublished: "1",
      branchId: props.branchId,
      courseId: props.courseId
    };
    axios.post("/api/publishAssignment.php", payloadPublish).then((resp) => {
      console.log(resp.data);
    });
  });
  const updateexistingAssignment = useRecoilCallback(({snapshot, set}) => async (props) => {
    let {driveIdcourseIditemIdparentFolderId, ...value} = props;
    let editAssignment = get(assignmentDictionary);
    set(assignmentDictionary(driveIdcourseIditemIdparentFolderId), editAssignment);
  });
  const assignmentToContent = useRecoilCallback(({snapshot, set}) => async (props) => {
    let {driveIdcourseIditemIdparentFolderId, ...value} = props;
    const handlebackContent = await snapshot.getPromise(assignmentDictionary(driveIdcourseIditemIdparentFolderId));
    const payloadContent = {...handlebackContent, isAssignment: 0};
    set(assignmentDictionary(driveIdcourseIditemIdparentFolderId), payloadContent);
  });
  const loadAvailableAssignment = useRecoilCallback(({snapshot, set}) => async (props) => {
    let {driveIdcourseIditemIdparentFolderId, ...value} = props;
    const handlebackAssignment = await snapshot.getPromise(assignmentDictionary(driveIdcourseIditemIdparentFolderId));
    const payloadAssignment = {...handlebackAssignment, isAssignment: 1};
    set(assignmentDictionary(driveIdcourseIditemIdparentFolderId), payloadAssignment);
  });
  const onAssignmentError = ({errorMessage = null}) => {
    addToast(`${errorMessage}`, ToastType.ERROR);
  };
  return {
    addContentAssignment,
    changeSettings,
    saveSettings,
    publishContentAssignment,
    updateexistingAssignment,
    assignmentToContent,
    loadAvailableAssignment,
    onAssignmentError
  };
};
