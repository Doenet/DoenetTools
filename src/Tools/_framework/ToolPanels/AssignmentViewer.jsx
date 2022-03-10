import React, { useEffect, useRef, useState } from 'react';
import ActivityViewer from '../../../Viewer/ActivityViewer';
import { serializedComponentsReviver } from '../../../Core/utils/serializedStateProcessing';
import {
  useRecoilValue,
  atom,
  atomFamily,
  useRecoilCallback,
  useSetRecoilState,
  useRecoilValueLoadable,
  useRecoilState,
  // useRecoilState,
  // useSetRecoilState,
} from 'recoil';
import {
  searchParamAtomFamily,
  pageToolViewAtom,
  suppressMenusAtom,
  profileAtom,
} from '../NewToolRoot';
import {
  itemHistoryAtom,
  // variantInfoAtom,
  // variantPanelAtom,
} from '../ToolHandlers/CourseToolHandler';
//  import { currentDraftSelectedAtom } from '../Menus/VersionHistory'
import { returnAllPossibleVariants } from '../../../Core/utils/returnAllPossibleVariants.js';
import { loadAssignmentSelector } from '../../../_reactComponents/Drive/NewDrive';
import axios from 'axios';
import { retrieveTextFileForCid } from '../../../Core/utils/retrieveTextFile';
import { prng_alea } from 'esm-seedrandom';

export const currentAttemptNumber = atom({
  key: 'currentAttemptNumber',
  default: null,
});

export const creditAchievedAtom = atom({
  key: 'creditAchievedAtom',
  default: {
    creditByItem: [1, 0, 0.5],
    // creditByItem:[],
    creditForAttempt: 0,
    creditForAssignment: 0,
    totalPointsOrPercent: 0,
  },
});



//Randomly pick next variant
//If all were picked then start random picks over
function generateNewVariant({ previousVariants, allPossibleVariants, individualize, userId, doenetId, attemptNumber }) {

  let possible = [];
  let numRemaining = (attemptNumber - 1) % allPossibleVariants.length;

  let mostRecentPreviousVariants = [];

  if (numRemaining > 0) {
    for (let aNum = attemptNumber - numRemaining; aNum < attemptNumber; aNum++) {
      if (previousVariants[aNum - 1]) {
        mostRecentPreviousVariants.push(previousVariants[aNum - 1])
      } else {
        // variant number was never saved, so generate it first
        let oldVariant = generateNewVariant({
          previousVariants: previousVariants.slice(0, aNum - 1),
          allPossibleVariants, individualize, userId, doenetId,
          attemptNumber: aNum
        });
        previousVariants[aNum - 1] = oldVariant;
        mostRecentPreviousVariants.push(oldVariant);

      }

    }
  }

  for (let variant of allPossibleVariants) {
    if (!mostRecentPreviousVariants.includes(variant)) {
      possible.push(variant);
    }
  }

  // seed random number generator with doenetId, attemptNumber, and (if individualize) userId
  // so that it will be consistent

  let seed = doenetId + "|" + attemptNumber;
  if (individualize) {
    seed += "|" + userId;
  }

  let rng = new prng_alea(seed);

  const ind = Math.floor(rng() * possible.length);

  const nextVariant = possible[ind];

  return nextVariant;
}

export default function AssignmentViewer() {
  console.log(">>>===AssignmentViewer")
  const recoilDoenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const setSuppressMenus = useSetRecoilState(suppressMenusAtom);
  let [stage, setStage] = useState('Initializing');
  let [message, setMessage] = useState('');
  const [recoilAttemptNumber, setRecoilAttemptNumber] = useRecoilState(currentAttemptNumber);
  const [
    {
      requestedVariantIndex,
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
  let individualize = useRef(null);

  // console.log(`allPossibleVariants -${allPossibleVariants}-`)


  const loadProfile = useRecoilValueLoadable(profileAtom);
  userId.current = loadProfile.contents.userId;



  const initializeValues = useRecoilCallback(
    ({ snapshot, set }) =>
      async (doenetId) => {
        //Prevent duplicate inits
        if (startedInitOfDoenetId.current === doenetId) {
          return;
        }
        startedInitOfDoenetId.current = doenetId;

        const {
          timeLimit,
          assignedDate,
          dueDate,
          showCorrectness,
          showCreditAchievedMenu,
          showFeedback,
          showHints,
          showSolution,
          proctorMakesAvailable,
        } = await snapshot.getPromise(loadAssignmentSelector(doenetId));
        let suppress = [];
        if (timeLimit === null) {
          suppress.push('TimerMenu');
        }

        if (!showCorrectness || !showCreditAchievedMenu) {
          suppress.push('CreditAchieved');
        }

        setSuppressMenus(suppress);

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
          } else {
            //Possible check for SEB header
            const { data } = await axios.get('/api/checkSEBheaders.php', {
              params: { doenetId },
            });
            // console.log('>>>>data', data);
            if (Number(data.legitAccessKey) !== 1) {
              setStage('Problem');
              setMessage('Browser not configured properly to take an exam.');
              return;
            }
          }
        }
        //TODO: test if assignment should be shown here

        let cid = null;

        //First try to find if they have a previously assigned cid
        //for the current attempt

        let resp = await axios.get(
          `/api/getCidForAssignment.php`,
          { params: { doenetId } },
        );

        if (!resp.data.success) {
          setStage('Problem');
          setMessage(`Error loading assignment: ${resp.data.message}`);
          return;
        } else if (!resp.data.cid) {
          setStage('Problem');
          setMessage('Assignment is not assigned.');
          return;
        } else {
          cid = resp.data.cid;
        }

        console.log(`retrieved cid: ${cid}`);


        // Hard code cid for testing!!!!!!
        // cid = 'bafkreidr6ny65lb5s23nyxhd3hx7xrghflzmpr2cyeru6mgctrgyha7i4m';



        // TODO: add a flag to enable the below feature
        // where a assignment is not available until the assigned date

        // if (new Date(assignedDate) > new Date()){
        //   setStage('Problem');
        //   setMessage('Assignment is not yet available.');
        //   return;
        // }

        // TODO: would some instructor want the below feature
        // where an assigment is no longer Available
        // after the due date?
        //TODO: Send toast
        // if (new Date(dueDate) < new Date()){
        //   setStage('Problem');
        //   setMessage('Assignment is past due.');
        //   return;
        // }

        //Find allPossibleVariants
        try {
          allPossibleVariants.current = await returnAllPossibleActivityVariants({ cid });
        } catch (e) {
          setStage('Problem');
          setMessage(`Could not load assignment: ${e.message}`);
          return;
        }

        //Find attemptNumber
        resp = await axios.get('/api/loadTakenVariants.php', {
          params: { doenetId },
        });

        if (!resp.data.success) {
          setStage('Problem');
          if (resp.data.message) {
            setMessage(`Could not load assignment: ${resp.data.message}`);
          } else {
            setMessage(`Could not load assignment: ${resp.data}`);
          }
          return;
        }

        let usersVariantAttempts = resp.data.variants.map(Number)

        let attemptNumber = Math.max(...resp.data.attemptNumbers.map(Number));
        let needNewVariant = false;

        if (attemptNumber < 1) {
          attemptNumber = 1;
          needNewVariant = true;
        } else if (resp.data.variants[resp.data.variants.length - 1] === null) {
          // have not yet saved the variant to the database
          // (either a proctored exam or student loaded but did not interact with new attempt)
          needNewVariant = true;
        }

        set(currentAttemptNumber, attemptNumber);

        if (needNewVariant) {

          // determine if should individualize

          // TODO: do we cache this somewhere so don't hit the database so many times?

          resp = await axios.get('/api/getIndividualizeForAssignment.php', {
            params: { doenetId },
          });

          if (!resp.data.success) {
            setStage('Problem');
            if (resp.data.message) {
              setMessage(`Could not load assignment: ${resp.data.message}`);
            } else {
              setMessage(`Could not load assignment: ${resp.data}`);
            }
            return;
          }

          individualize.current = resp.data.individualize === '1';

          usersVariantAttempts = usersVariantAttempts.slice(0, attemptNumber - 1);

          //Find requestedVariant
          usersVariantAttempts.push(generateNewVariant({
            previousVariants: usersVariantAttempts,
            allPossibleVariants: allPossibleVariants.current,
            individualize: individualize.current,
            userId: userId.current,
            doenetId,
            attemptNumber,
          }));
        }

        let requestedVariantIndex = usersVariantAttempts[usersVariantAttempts.length - 1];

        console.log(`requestedVariantIndex: ${requestedVariantIndex}`)

        setLoad({
          requestedVariantIndex,
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

  async function updateAttemptNumberAndRequestedVariant(newAttemptNumber, doenetId) {


    //Check if cid has changed

    let cid = null;

    //First try to find if they have a previously assigned cid
    //for the current attempt

    let resp = await axios.get(
      `/api/getCidForAssignment.php`,
      { params: { doenetId } },
    );

    if (!resp.data.success) {
      setStage('Problem');
      setMessage(`Error loading assignment: ${resp.data.message}`);
      return;
    } else if (!resp.data.cid) {
      setStage('Problem');
      setMessage('Assignment is not assigned.');
      return;
    } else {
      cid = resp.data.cid;
    }

    console.log(`retrieved cid: ${cid}`);


    const { data } = await axios.get('/api/loadTakenVariants.php', {
      params: { doenetId },
    });

    if (!data.success) {
      setStage('Problem');
      if (data.message) {
        setMessage(`Could not load assignment: ${data.message}`);
      } else {
        setMessage(`Could not load assignment: ${data}`);
      }
      return;
    }

    let usersVariantAttempts = data.variants.map(Number).slice(0, newAttemptNumber - 1);

    if (individualize.current === null) {
      resp = await axios.get('/api/getIndividualizeForAssignment.php', {
        params: { doenetId },
      });

      if (!resp.data.success) {
        setStage('Problem');
        if (resp.data.message) {
          setMessage(`Could not load assignment: ${resp.data.message}`);
        } else {
          setMessage(`Could not load assignment: ${resp.data}`);
        }
        return;
      }

      individualize.current = resp.data.individualize === '1';

    }



    //Find requestedVariant
    usersVariantAttempts.push(generateNewVariant({
      previousVariants: usersVariantAttempts,
      allPossibleVariants: allPossibleVariants.current,
      individualize: individualize.current,
      userId: userId.current,
      doenetId,
      attemptNumber: newAttemptNumber,
    }));

    let newRequestedVariantIndex = usersVariantAttempts[usersVariantAttempts.length - 1];


    setLoad((was) => {
      let newObj = { ...was };
      newObj.attemptNumber = newAttemptNumber;
      newObj.requestedVariantIndex = newRequestedVariantIndex;
      newObj.cid = cid;
      return newObj;
    });
  }

  const updateCreditAchieved = useRecoilCallback(
    ({ set }) =>
      async ({
        creditByItem,
        creditForAssignment,
        creditForAttempt,
        totalPointsOrPercent,
      }) => {
        // console.log(">>>>UPDATE",{ creditByItem, creditForAssignment, creditForAttempt })
        set(creditAchievedAtom, {
          creditByItem,
          creditForAssignment,
          creditForAttempt,
          totalPointsOrPercent,
        });
      },
  );


  // console.log(`>>>>stage -${stage}-`);

  //Wait for doenetId to be defined to start
  if (recoilDoenetId === '') {
    return null;
  }

  // console.log(`>>>>stage -${stage}-`)
  // console.log(`>>>>recoilAttemptNumber -${recoilAttemptNumber}-`)
  // console.log(`>>>>attemptNumber -${attemptNumber}-`)

  if (stage === 'Initializing') {
    initializeValues(recoilDoenetId);
    return null;
  } else if (stage === 'Problem') {
    return <h1>{message}</h1>;
  } else if (recoilAttemptNumber > attemptNumber) {
    updateAttemptNumberAndRequestedVariant(recoilAttemptNumber, recoilDoenetId);
    return null;
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
          allowLoadState: true,
          allowSaveState: true,
          allowLocalState: true,
          allowSaveSubmissions: true,
          allowSaveEvents: true,
        }}
        attemptNumber={attemptNumber}
        requestedVariantIndex={requestedVariantIndex}
        updateCreditAchievedCallback={updateCreditAchieved}
        updateAttemptNumber={setRecoilAttemptNumber}
      // generatedVariantCallback={variantCallback}
      />
    </>
  );
}




async function returnAllPossibleActivityVariants({ cid }) {
  let activityDefinition = JSON.parse(await retrieveTextFileForCid(cid, "json"));

  let nVariants = 100;
  if (activityDefinition.variantControl) {
    nVariants = activityDefinition.variantControl.nVariants;
    if (!(Number.isInteger(nVariants) && nVariants >= 1)) {
      nVariants = 100;
    }
  }

  let variantIndices = [...Array(nVariants).keys()].map(i => i + 1);

  return variantIndices;

}
