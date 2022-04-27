import React, { useEffect, useRef, useState } from 'react';
import ActivityViewer from '../../../Viewer/ActivityViewer';
import {
  useRecoilValue,
  atom,
  useRecoilCallback,
  useSetRecoilState,
  useRecoilValueLoadable,
  useRecoilState,
} from 'recoil';
import {
  searchParamAtomFamily,
  suppressMenusAtom,
  profileAtom,
} from '../NewToolRoot';
import {
  activityVariantInfoAtom,
  activityVariantPanelAtom,
} from '../ToolHandlers/CourseToolHandler';

import { loadAssignmentSelector } from '../../../_reactComponents/Drive/NewDrive';
import axios from 'axios';
import { retrieveTextFileForCid } from '../../../Core/utils/retrieveTextFile';
import { determineNumberOfActivityVariants, parseActivityDefinition } from '../../../_utils/activityUtils';


export default function DraftAssignmentViewer() {
  // console.log(">>>===DraftAssignmentViewer")
  const recoilDoenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const recoilRequestedVariant = useRecoilValue(searchParamAtomFamily('requestedVariant'));
  const setSuppressMenus = useSetRecoilState(suppressMenusAtom);
  const [variantInfo, setVariantInfo] = useRecoilState(activityVariantInfoAtom);
  const setVariantPanel = useSetRecoilState(activityVariantPanelAtom);
  let [stage, setStage] = useState('Initializing');
  let [message, setMessage] = useState('');
  const [
    {
      attemptNumber,
      showCorrectness,
      showFeedback,
      showHints,
      cid,
      doenetId,
      solutionDisplayMode,
    },
    setLoad,
  ] = useState({});
  let startedInitOfDoenetId = useRef(null);
  let allPossibleVariants = useRef([]);
  let userId = useRef(null);

  // console.log(`allPossibleVariants -${allPossibleVariants}-`)


  const loadProfile = useRecoilValueLoadable(profileAtom);
  userId.current = loadProfile.contents.userId;


  function variantCallback(variantIndex, numberOfVariants) {
    // console.log(">>>variantCallback",variantIndex,numberOfVariants)
    setVariantPanel({
      index: variantIndex,
      numberOfVariants
    });
    setVariantInfo({
      index: variantIndex,
    });
  }

  const initializeValues = useRecoilCallback(
    ({ snapshot, set }) =>
      async (doenetId) => {
        //Prevent duplicate inits
        if (startedInitOfDoenetId.current === doenetId) {
          return;
        }
        startedInitOfDoenetId.current = doenetId;

        const {
          showCorrectness,
          showFeedback,
          showHints,
          showSolution,
          proctorMakesAvailable,
        } = await snapshot.getPromise(loadAssignmentSelector(doenetId));

        let solutionDisplayMode = 'button';
        if (!showSolution) {
          solutionDisplayMode = 'none';
        }

        //TODO: test if assignment should be shown here

        let cid = null;

        // determine cid
        let resp = await axios.get(
          `/api/getCidForAssignment.php`,
          { params: { doenetId, latestAttemptOverrides: false, getDraft: true } },
        );


        if (!resp.data.success || !resp.data.cid) {
          setStage('Problem');
          setMessage(`Error loading assignment: ${resp.data.message}`);
          return;
        } else {
          cid = resp.data.cid;
        }

        let result = await returnNumberOfActivityVariants(cid);

        if (!result.success) {
          setStage('Problem');
          setMessage(result.message);
          return;
        }

        allPossibleVariants.current = [...Array(result.numberOfVariants).keys()].map(x => (x + 1));

        setLoad({
          attemptNumber,
          showCorrectness,
          showFeedback,
          showHints,
          cid,
          doenetId,
          solutionDisplayMode,
        });

        setStage('Ready');

      },
    [],
  );


  // console.log(`>>>>stage -${stage}-`);

  //Wait for doenetId to be defined to start
  if (recoilDoenetId === '') {
    return null;
  }

  // console.log(`>>>>stage -${stage}-`)
  // console.log(`>>>>attemptNumber -${attemptNumber}-`)

  if (stage === 'Initializing') {
    initializeValues(recoilDoenetId);
    return null;
  } else if (stage === 'Problem') {
    return <h1>{message}</h1>;
  }

  return (
    <>
      <ActivityViewer
        key={`activityViewer${doenetId}`}
        cid={cid}
        doenetId={doenetId}
        flags={{
          showCorrectness,
          readOnly: false,
          solutionDisplayMode,
          showFeedback,
          showHints,
          isAssignment: true,
          allowLoadState: false,
          allowSaveState: false,
          allowLocalState: false,
          allowSaveSubmissions: false,
          allowSaveEvents: false,
        }}
        attemptNumber={attemptNumber}
        requestedVariantIndex={variantInfo.index}
        // updateCreditAchievedCallback={updateCreditAchieved}
        // updateAttemptNumber={setRecoilAttemptNumber}
        generatedVariantCallback={variantCallback}
      />
    </>
  );
}




async function returnNumberOfActivityVariants(cid) {

  let activityDefinitionDoenetML = await retrieveTextFileForCid(cid);

  let result = parseActivityDefinition(activityDefinitionDoenetML);

  if (!result.success) {
    return result;
  }

  let numberOfVariants = await determineNumberOfActivityVariants(result.activityJSON);

  return { success: true, numberOfVariants };
}
