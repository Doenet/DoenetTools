import React, { useEffect, useRef, useState } from 'react';
import DoenetViewer, {
  serializedComponentsReviver,
} from '../../../Viewer/DoenetViewer';
import {
  useRecoilValue,
  atom,
  atomFamily,
  useRecoilCallback,
  // useRecoilState,
  // useSetRecoilState,
} from 'recoil';
import { searchParamAtomFamily, pageToolViewAtom } from '../NewToolRoot';
import {
  itemHistoryAtom,
  fileByContentId,
  // variantInfoAtom,
  // variantPanelAtom,
} from '../ToolHandlers/CourseToolHandler';
//  import { currentDraftSelectedAtom } from '../Menus/VersionHistory'
import { returnAllPossibleVariants } from '../../../Core/utils/returnAllPossibleVariants.js';
import { loadAssignmentSelector } from '../../../_reactComponents/Drive/NewDrive';
import axios from 'axios';
import { update } from '@react-spring/web';

export const currentAttemptNumber = atom({
  key: 'currentAttemptNumber',
  default: null,
});

function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Randomly pick next variant
//If all were picked then start random picks over
function pushRandomVariantOfRemaining({ previous, from }) {
  let usersVariantAttempts = [...previous];
  let possible = [];
  let numRemaining = previous.length % from.length;

  let latestSetOfWas = [];
  if (numRemaining > 0) {
    latestSetOfWas = previous.slice(-numRemaining);
  }
  for (let variant of from) {
    if (!latestSetOfWas.includes(variant)) {
      possible.push(variant);
    }
  }
  const nextVariant = possible[randomInt(0, possible.length - 1)];
  usersVariantAttempts.push(nextVariant);
  return usersVariantAttempts;
}

export default function AssignmentViewer() {
  // console.log(">>>===AssignmentViewer")
  let [stage, setStage] = useState('Initializing');
  let [message, setMessage] = useState('');
  const recoilAttemptNumber = useRecoilValue(currentAttemptNumber);
  const [
    {
      requestedVariant,
      attemptNumber,
      showCorrectness,
      showFeedback,
      showHints,
      doenetML,
      doenetId,
      solutionDisplayMode,
    },
    setLoad,
  ] = useState({});
  let startedInitOfDoenetId = useRef(null);
  let storedAllPossibleVariants = useRef([]);

  const initializeValues = useRecoilCallback(
    ({ snapshot, set }) =>
      async () => {
        let doenetId = await snapshot.getPromise(
          searchParamAtomFamily('doenetId'),
        );
        const isCollection = await snapshot.getPromise(
          searchParamAtomFamily('isCollection'),
        );
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
        if (proctorMakesAvailable) {
          const { page } = await snapshot.getPromise(pageToolViewAtom);
          if (page !== 'exam') {
            setStage('Problem');
            setMessage('Assignment only available in a proctored setting.');
            return;
          }
        }
        //TODO: test if assignment should be shown here

        let contentId = null;
        let isAssigned = false;
        let assignedVariant = null;
        if (isCollection) {
          try {
            const { data } = await axios.get(
              '/api/getAssignedCollectionData.php',
              { params: { doenetId } },
            );
            contentId = data.contentId;
            isAssigned = data.isAssigned;
            assignedVariant = JSON.parse(
              data.assignedVariant,
              serializedComponentsReviver,
            );
          } catch (error) {
            console.error(error);
          }
        } else {
          const versionHistory = await snapshot.getPromise(
            itemHistoryAtom(doenetId),
          );
          //Find Assigned ContentId
          //Use isReleased as isAssigned for now
          //TODO: refactor isReleased to isAssigned

          //Set contentId and isAssigned
          for (let version of versionHistory.named) {
            if (version.isReleased === '1') {
              isAssigned = true;
              contentId = version.contentId;
              break;
            }
          }
        }

        console.log('>>>>initializeValues contentId', contentId);
        if (!isAssigned) {
          setStage('Problem');
          setMessage('Assignment is not assigned.');
        }
        //Set doenetML
        let response = await snapshot.getPromise(fileByContentId(contentId));
        if (typeof response === 'object') {
          response = response.data;
        }
        const doenetML = response;

        //Find allPossibleVariants
        returnAllPossibleVariants({
          doenetML,
          callback: isCollection
            ? setCollectionVariant
            : setVariantsFromDoenetML,
        });
        async function setVariantsFromDoenetML({ allPossibleVariants }) {
          storedAllPossibleVariants.current = allPossibleVariants;
          //Find attemptNumber
          const { data } = await axios.get('/api/loadTakenVariants.php', {
            params: { doenetId },
          });
          let usersVariantAttempts = [];

          for (let variant of data.variants) {
            let obj = JSON.parse(variant, serializedComponentsReviver);
            if (obj) {
              usersVariantAttempts.push(obj.name);
            }
          }
          let numberOfCompletedAttempts = data.attemptNumbers.length - 1;
          if (numberOfCompletedAttempts === -1) {
            numberOfCompletedAttempts = 0;
          }
          let attemptNumber = numberOfCompletedAttempts + 1;
          set(currentAttemptNumber, attemptNumber);
          //Find requestedVariant
          usersVariantAttempts = pushRandomVariantOfRemaining({
            previous: [...usersVariantAttempts],
            from: allPossibleVariants,
          });
          let requestedVariant = {
            name: usersVariantAttempts[numberOfCompletedAttempts],
          };

          setLoad({
            requestedVariant,
            attemptNumber,
            showCorrectness,
            showFeedback,
            showHints,
            doenetML,
            doenetId,
            solutionDisplayMode,
          });
          setStage('Ready');
        }
        async function setCollectionVariant() {
          //TODO: no more attemtps?
          const { data } = await axios.get('/api/loadTakenVariants.php', {
            params: { doenetId },
          });
          let numberOfCompletedAttempts = data.attemptNumbers.length - 1;
          set(currentAttemptNumber, numberOfCompletedAttempts);
          setLoad({
            requestedVariant: assignedVariant,
            attemptNumber: numberOfCompletedAttempts,
            showCorrectness,
            showFeedback,
            showHints,
            doenetML,
            doenetId,
            solutionDisplayMode,
          });
          setStage('Ready');
        }
      },
    [],
  );

  const updateAttemptNumberAndRequestedVariant = useRecoilCallback(
    ({ snapshot, set }) =>
      async (newAttemptNumber) => {
        let doenetId = await snapshot.getPromise(
          searchParamAtomFamily('doenetId'),
        );

        const { data } = await axios.get('/api/loadTakenVariants.php', {
          params: { doenetId },
        });
        let usersVariantAttempts = [];

        for (let variant of data.variants) {
          let obj = JSON.parse(variant, serializedComponentsReviver);
          if (obj) {
            usersVariantAttempts.push(obj.name);
          }
        }

        //Find requestedVariant
        usersVariantAttempts = pushRandomVariantOfRemaining({
          previous: [...usersVariantAttempts],
          from: storedAllPossibleVariants.current,
        });

        let newRequestedVariant = {
          name: usersVariantAttempts[newAttemptNumber - 1],
        };

        setLoad((was) => {
          let newObj = { ...was };
          newObj.attemptNumber = newAttemptNumber;
          newObj.requestedVariant = newRequestedVariant;
          return newObj;
        });
      },
    [],
  );

  console.log(`>>>>stage -${stage}-`);

  if (stage === 'Initializing') {
    initializeValues();
    return null;
  } else if (stage === 'Problem') {
    return <h1>{message}</h1>;
  } else if (recoilAttemptNumber > attemptNumber) {
    updateAttemptNumberAndRequestedVariant(recoilAttemptNumber);
    return null;
  }
  console.log('>>>>DoenetViewer obj ', {
    requestedVariant,
    attemptNumber,
    showCorrectness,
    showFeedback,
    showHints,
    doenetML,
    doenetId,
    solutionDisplayMode,
  });

  if (doenetId === '') {
    //Data Not loaded Yet
    //TODO:Why does this happen?
    console.log('>>>>Data Not loaded Yet');
    // console.log(`>>>>stage -${stage}-`)
    // console.log(">>>>startedInitOfDoenetId.current ",startedInitOfDoenetId.current)
    // console.log(`>>>>recoilAttemptNumber -${recoilAttemptNumber}- `)
    // console.log(">>>>DoenetViewer obj ",{
    //   requestedVariant,
    //   attemptNumber,
    //   showCorrectness,
    //   showFeedback,
    //   showHints,
    //   doenetML,
    //   doenetId,
    //   solutionDisplayMode,
    // })
    startedInitOfDoenetId.current = null;
    setStage('Initializing');
    return <p>bug</p>;
  }

  return (
    <DoenetViewer
      key={`doenetviewer${doenetId}`}
      doenetML={doenetML}
      doenetId={doenetId}
      flags={{
        showCorrectness: showCorrectness,
        readOnly: false,
        solutionDisplayMode: solutionDisplayMode,
        showFeedback: showFeedback,
        showHints: showHints,
        isAssignment: true,
      }}
      attemptNumber={attemptNumber}
      allowLoadPageState={true}
      allowSavePageState={true}
      allowLocalPageState={false} //Still working out localStorage kinks
      allowSaveSubmissions={true}
      allowSaveEvents={true}
      requestedVariant={requestedVariant}
      // generatedVariantCallback={variantCallback}
    />
  );
}
