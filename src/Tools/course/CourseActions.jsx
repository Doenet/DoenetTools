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
import { 
  itemHistoryAtom, 
} from '../../_sharedRecoil/content';

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
      let { driveIditemIdbranchIdparentFolderId ,contentId,versionId,branchId } = props;
      const dt = new Date();
      const creationDate = formatDate(dt);
      const futureDueDate = formatFutureDate(dt);
      // assignment creation
      let newAssignmentObj = {
        assignment_title: 'Untitled Assignment',
        assignedDate: creationDate,
        attemptAggregation: 'e',
        dueDate: creationDate,
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
        dueDate: creationDate,
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

  const addSwitchAssignment = useRecoilCallback(
    ({ snapshot, set }) => async (props) => {
      let { driveIditemIdbranchIdparentFolderId ,contentId,versionId,branchId, ...rest } = props;
      const dt = new Date();
      const creationDate = formatDate(dt);
      const futureDueDate = formatFutureDate(dt);
      let newAssignmentObj = {
        assignment_title: rest.assignment_title ? rest.assignment_title : 'Untitled Assignment',
        assignedDate: rest.assignedDate ? rest.assignedDate : creationDate,
        attemptAggregation: rest.attemptAggregation ? rest.attemptAggregation : 'e',
        dueDate: rest.dueDate ? rest.dueDate : creationDate,
        gradeCategory: rest.gradeCategory ? rest.gradeCategory :'l',
        individualize: rest.individualize ? rest.individualize : '0',
        isAssigned: rest.isAssigned ? rest.isAssigned : '1',
        isPublished: rest.isPublished ?rest.isPublished : '0',
        contentId:contentId,
        itemId: driveIditemIdbranchIdparentFolderId.itemId,
        versionId:versionId,
        multipleAttempts: rest.multipleAttempts ? rest.multipleAttempts : '0',
        numberOfAttemptsAllowed: rest.numberOfAttemptsAllowed ?rest.numberOfAttemptsAllowed : '2',
        proctorMakesAvailable: rest.proctorMakesAvailable ? rest.proctorMakesAvailable : '2',
        showCorrectness: rest.showCorrectness ? rest.showCorrectness : '1',
        showFeedback: rest.showFeedback ? rest.showFeedback : '1',
        showHints: rest.showHints ? rest.showHints : '1',
        showSolution: rest.showSolution ? rest.showSolution : '1',
        timeLimit: rest.timeLimit ? rest.timeLimit : '10:10',
        totalPointsOrPercent: rest.totalPointsOrPercent ? rest.totalPointsOrPercent : '00.00' ,
        subType: 'Administrator',
      };
      let newchangedAssignmentObj = {
        assignment_title: rest.assignment_title ? rest.assignment_title : 'Untitled Assignment',
        assignedDate: rest.assignedDate ? rest.assignedDate : creationDate,
        attemptAggregation: rest.attemptAggregation ? rest.attemptAggregation : 'e',
        dueDate: rest.dueDate ? rest.dueDate : creationDate,
        gradeCategory: rest.gradeCategory ? rest.gradeCategory :'l',
        individualize: rest.individualize ? rest.individualize : false,
        isAssigned: rest.isAssigned ? rest.isAssigned : '1',
        isPublished: rest.isPublished ?rest.isPublished : '0',
        contentId:contentId,
        itemId: driveIditemIdbranchIdparentFolderId.itemId,
        versionId:versionId,
        multipleAttempts: rest.multipleAttempts ? rest.multipleAttempts : false,
        numberOfAttemptsAllowed: rest.numberOfAttemptsAllowed ?rest.numberOfAttemptsAllowed : '2',
        proctorMakesAvailable: rest.proctorMakesAvailable ? rest.proctorMakesAvailable : false,
        showCorrectness: rest.showCorrectness ? rest.showCorrectness : true,
        showFeedback: rest.showFeedback ? rest.showFeedback : true,
        showHints: rest.showHints ? rest.showHints : true,
        showSolution: rest.showSolution ? rest.showSolution : true,
        timeLimit: rest.timeLimit ? rest.timeLimit : '10:10',
        totalPointsOrPercent: rest.totalPointsOrPercent ? rest.totalPointsOrPercent : '00.00' ,
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

  const updateVersionHistory = useRecoilCallback(({snapshot,set})=> async (branchId,versionId)=>{
    // console.log(">>>",{branchId,versionId,newTitle})
      set(itemHistoryAtom(branchId),(was)=>{
        let newHistory = {...was}
        newHistory.named = [...was.named];
        let newVersion;
        for (const [i,version] of newHistory.named.entries()){
          if (versionId === version.versionId){
            newVersion = {...version}
            newVersion.isAssigned = 1;
            newHistory.named.splice(i,1,newVersion)
          }
        }
        
        return newHistory;
      })
  
    });
    const updatePrevVersionHistory = useRecoilCallback(({snapshot,set})=> async (branchId,versionId)=>{
      // console.log(">>>",{branchId,versionId,newTitle})
        set(itemHistoryAtom(branchId),(was)=>{
          let newHistory = {...was}
          newHistory.named = [...was.named];
          let newVersion;
          for (const [i,version] of newHistory.named.entries()){
            if (versionId === version.versionId){
              newVersion = {...version}
              newVersion.isAssigned = 0;
              newHistory.named.splice(i,1,newVersion)
            }
          }
          const payload ={
            versionId:versionId
          }
          const result = axios.post('/api/switchVersionUpdate.php', payload)
          result.then(resp => {
            if (resp.data.success){
              return resp.data;
            }
          });
          
          return newHistory;
        })
    
      });
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

      // set(assignmentDictionary(driveIditemIdbranchIdparentFolderId), (old) => {
      //   return { ...old, ...value, ...driveIditemIdbranchIdparentFolderId };
      // });
      let saveAssignmentNew = { ...saveInfo, ...value };
      set(assignmentDictionary(driveIditemIdbranchIdparentFolderId), saveAssignmentNew);
      const payload = {
        ...saveAssignmentNew,
        branchId: driveIditemIdbranchIdparentFolderId.branchId,
        contenId:driveIditemIdbranchIdparentFolderId.contenId,
        versionId:driveIditemIdbranchIdparentFolderId.versionId,
        driveId:driveIditemIdbranchIdparentFolderId.driveId
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

      set(itemHistoryAtom(driveIditemIdbranchIdparentFolderId.branchId),(was)=>{
        let newHistory = {...was}
        newHistory.named = [...was.named];
        let newVersion;
        for (const [i,version] of newHistory.named.entries()){
          if (driveIditemIdbranchIdparentFolderId.versionId === version.versionId){
            newVersion = {...version}
            newVersion.isAssigned = 0;
            newHistory.named.splice(i,1,newVersion)
          }
        }
        
        return newHistory;
      })
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
    addSwitchAssignment,
    updateVersionHistory,
    updatePrevVersionHistory,
    changeSettings,
    saveSettings,
    publishContentAssignment,
    updateexistingAssignment,
    assignmentToContent,
    loadAvailableAssignment,
    onAssignmentError,
  };
};
