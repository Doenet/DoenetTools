/**
 * External dependencies
 */
import React from 'react';
import { nanoid } from 'nanoid';
import axios from 'axios';
import { useRecoilCallback } from 'recoil';

/**
 * Internal dependencies
 */

import { assignmentDictionary } from '../course/Course';
import Toast, { useToast } from '../../Tools/_framework/Toast';
const formatDate = (dt) => {
  const formattedDate = `${
    dt.getFullYear().toString().padStart(2, '0')}-${
    (dt.getMonth()+1).toString().padStart(2, '0')}-${
    dt.getDate().toString().padStart(2, '0')} ${
    dt.getHours().toString().padStart(2, '0')}:${
    dt.getMinutes().toString().padStart(2, '0')}:${
    dt.getSeconds().toString().padStart(2, '0')}`;
    
  return formattedDate;
}
const formatFutureDate = (dt) => {
  const formattedFutureDate = `${
    dt.getFullYear().toString().padStart(2, '0')}-${
    (dt.getMonth()+1).toString().padStart(2, '0')}-${
    (dt.getDate()+7).toString().padStart(2, '0')} ${
    dt.getHours().toString().padStart(2, '0')}:${
    dt.getMinutes().toString().padStart(2, '0')}:${
    dt.getSeconds().toString().padStart(2, '0')}`;
    
  return formattedFutureDate;
}
export const useAssignment = () => {
  const [addToast, ToastType] = useToast();

  const addContentAssignment = useRecoilCallback(
    ({ snapshot, set }) => async (props) => {
      let { driveIditemIdbranchIdparentFolderId ,contentId,versionId,branchId} = props;
      const dt = new Date();
      const creationDate = formatDate(dt);
      const futureDueDate = formatFutureDate(dt);
      // assignment creation
      let newAssignmentObj = {
        assignment_title: 'Untitled Assignment',
        assignedDate: creationDate,
        attemptAggregation: 'e',
        dueDate: futureDueDate,
        gradeCategory: 'l',
        individualize: '0',
        isAssigned: '1',
        isPublished: '0',
        itemId: driveIditemIdbranchIdparentFolderId.itemId,
        versionId:versionId,
        contentId: contentId,
        multipleAttempts: '0',
        numberOfAttemptsAllowed: '2',
        proctorMakesAvailable: '0',
        showCorrectness: '1',
        showFeedback: '1',
        showHints: '1',
        showSolution: '1',
        timeLimit: '10:10',
        totalPointsOrPercent: '00.00',
        assignment_isPublished: '0',
        subType: 'Administrator',
      };
      let newchangedAssignmentObj = {
        assignment_title: 'Untitled Assignment',
        assignedDate: creationDate,
        attemptAggregation: 'e',
        dueDate: futureDueDate,
        gradeCategory: 'l',
        individualize: false,
        isAssigned: '1',
        isPublished: '0',
        contentId:contentId,
        itemId: driveIditemIdbranchIdparentFolderId.itemId,
        versionId:versionId,
        multipleAttempts: false,
        numberOfAttemptsAllowed: '2',
        proctorMakesAvailable: false,
        showCorrectness: true,
        showFeedback: true,
        showHints: true,
        showSolution: true,
        timeLimit: '10:10',
        totalPointsOrPercent: '00.00',
        assignment_isPublished: '0',
        subType: 'Administrator',
      };

      let payload = {
        ...newAssignmentObj,
        driveId: driveIditemIdbranchIdparentFolderId.driveId,
        itemId: driveIditemIdbranchIdparentFolderId.itemId,
        branchId: branchId,
        contentId: contentId,
      };
      set(assignmentDictionary(driveIditemIdbranchIdparentFolderId), newchangedAssignmentObj);

      let result = await axios.post(`/api/makeNewAssignment.php`, payload).catch((e) =>{return {data:{message:e, success:false}}})
     try {
        if(result.data.success){
          return result.data;
        }     
      else{
        return  {message:result.data.message, success:false};
      }
     } catch (e) {
      return {message:e, success:false};
     }
    },
  );

  const changeSettings = useRecoilCallback(
    ({ snapshot, set }) => async (props) => {
      let { driveIditemIdbranchIdparentFolderId, ...value } = props;
      set(assignmentDictionary(driveIditemIdbranchIdparentFolderId), (old) => {
        return { ...old, ...value };
      });
    },
  );

  const saveSettings = useRecoilCallback(
    ({ snapshot, set }) => async (props) => {
      let { driveIditemIdbranchIdparentFolderId, ...value } = props;

      const saveInfo = await snapshot.getPromise(assignmentDictionary(driveIditemIdbranchIdparentFolderId));

      set(assignmentDictionary(driveIditemIdbranchIdparentFolderId), (old) => {
        return { ...old, ...value };
      });
      let saveAssignmentNew = { ...saveInfo, ...value };
      // set(assignmentDictionary(driveIditemIdbranchIdparentFolderId), saveAssignmentNew);
      const payload = {
        ...saveAssignmentNew,
        assignmentId: saveAssignmentNew.assignmentId,
        assignment_isPublished: '0',
        branchId:branchId
      };

      const result = axios.post('/api/saveAssignmentToDraft.php', payload)
      result.then(resp => {
        if (resp.data.success){
          return resp.data;
        }
      });
     return result;
    },
  );

  const publishContentAssignment = useRecoilCallback(
    ({ snapshot, set }) => async (props) => {
      let { driveIditemIdbranchIdparentFolderId, ...value } = props;
      const publishAssignment = await snapshot.getPromise(assignmentDictionary(driveIditemIdbranchIdparentFolderId));

      set(assignmentDictionary(driveIditemIdbranchIdparentFolderId),publishAssignment
      );
      const payloadPublish = {
        ...value,
        assignmentId: props.assignmentId,
        assignment_isPublished: '1',
        branchId: props.branchId,
        contentId:props.contentId
      };
      const result = axios.post('/api/publishAssignment.php', payloadPublish)
      result.then(resp => {
        if (resp.data.success){
          return resp.data;
        }
      });
     return result;
    },
  );

  const updateexistingAssignment = useRecoilCallback(
    ({ snapshot, set }) => async (props) => {
      let { driveIditemIdbranchIdparentFolderId, ...value } = props;
      let editAssignment = get(assignmentDictionary);
      set(assignmentDictionary(driveIditemIdbranchIdparentFolderId), editAssignment);
    },
  );

  const assignmentToContent = useRecoilCallback(({ snapshot, set }) => async (props) => {
      let { driveIditemIdbranchIdparentFolderId, ...value } = props;
      const handlebackContent = await snapshot.getPromise(assignmentDictionary(driveIditemIdbranchIdparentFolderId));
      const payloadContent = { ...handlebackContent, isAssigned: 0 };
      set(assignmentDictionary(driveIditemIdbranchIdparentFolderId), payloadContent);
    },
  );
  const loadAvailableAssignment = useRecoilCallback(({ snapshot, set }) => async (props) => {
      let { driveIditemIdbranchIdparentFolderId, ...value } = props;
      const handlebackAssignment = await snapshot.getPromise(assignmentDictionary(driveIditemIdbranchIdparentFolderId));
      const payloadAssignment = { ...handlebackAssignment, isAssigned: 1 };
      set(assignmentDictionary(driveIditemIdbranchIdparentFolderId), payloadAssignment);
    },
  );

  const onAssignmentError = ({ errorMessage = null }) => {
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
    onAssignmentError,
  };
};
