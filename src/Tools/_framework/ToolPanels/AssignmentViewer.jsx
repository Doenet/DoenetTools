import React, { useEffect, useRef, useState } from 'react';
import ActivityViewer, { saveStateToDBTimerIdAtom } from '../../../Viewer/ActivityViewer';
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
import axios from 'axios';
import { retrieveTextFileForCid } from '../../../Core/utils/retrieveTextFile';
import { prng_alea } from 'esm-seedrandom';
import { determineNumberOfActivityVariants, parseActivityDefinition } from '../../../_utils/activityUtils';
import { itemByDoenetId, courseIdAtom, useInitCourseItems, useSetCourseIdFromDoenetId } from '../../../_reactComponents/Course/CourseActions';
import { useLocation, useNavigate } from 'react-router';
import ActionButton from '../../../_reactComponents/PanelHeaderComponents/ActionButton'
import Button from '../../../_reactComponents/PanelHeaderComponents/Button'
import ButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import Banner from '../../../_reactComponents/PanelHeaderComponents/Banner';
import { effectivePermissionsByCourseId } from '../../../_reactComponents/PanelHeaderComponents/RoleDropdown';


export const currentAttemptNumber = atom({
  key: 'currentAttemptNumber',
  default: null,
});

export const creditAchievedAtom = atom({
  key: 'creditAchievedAtom',
  default: {
    creditByItem: [],
    creditForAttempt: 0,
    creditForAssignment: 0,
    totalPointsOrPercent: 0,
  },
});

export const numberOfAttemptsAllowedAdjustmentAtom = atom({
  key: 'numberOfAttemptsAllowedAdjustment',
  default: 0,
})

export const cidChangedAtom = atom({
  key: 'cidChanged',
  default: false,
})



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
  // console.log(">>>===AssignmentViewer")
  const recoilDoenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const courseId = useRecoilValue(courseIdAtom);
  const setSuppressMenus = useSetRecoilState(suppressMenusAtom);
  let [stage, setStage] = useState('Initializing');
  let [message, setMessage] = useState('');
  const [recoilAttemptNumber, setRecoilAttemptNumber] = useRecoilState(currentAttemptNumber);
  const [cidChanged, setCidChanged] = useRecoilState(cidChangedAtom);
  const [
    {
      requestedVariantIndex,
      attemptNumber,
      showCorrectness,
      paginate,
      showFinishButton,
      showFeedback,
      showHints,
      autoSubmit,
      cid,
      doenetId,
      solutionDisplayMode,
      baseNumberOfAttemptsAllowed,
    },
    setLoad,
  ] = useState({});

  const setNumberOfAttemptsAllowedAdjustment = useSetRecoilState(numberOfAttemptsAllowedAdjustmentAtom);

  const [cidChangedMessageOpen, setCidChangedMessageOpen] = useState(false);

  let allPossibleVariants = useRef([]);
  let userId = useRef(null);
  let individualize = useRef(null);

  const getValueOfTimeoutWithoutARefresh = useRecoilCallback(({ snapshot }) => async () => {
    return await snapshot.getPromise(saveStateToDBTimerIdAtom)
  }, [saveStateToDBTimerIdAtom])

  useSetCourseIdFromDoenetId(recoilDoenetId);
  useInitCourseItems(courseId);

  const effectivePermissions = useRecoilValue(effectivePermissionsByCourseId(courseId));

  let itemObj = useRecoilValue(itemByDoenetId(recoilDoenetId));
  let label = itemObj.label;

  let { search, hash } = useLocation();
  let navigate = useNavigate();


  useEffect(() => {
    const prevTitle = document.title;
    if (label) {
      document.title = `${label} - Doenet`;
    }
    return () => {
      document.title = prevTitle;
    }
  }, [label])


  useEffect(() => {
    if (Object.keys(itemObj).length > 0 && Object.keys(effectivePermissions).length > 0) {
      initializeValues(recoilDoenetId, itemObj);
    }
  }, [itemObj, recoilDoenetId, effectivePermissions])

  // console.log("itemObj",itemObj)
  // console.log(`allPossibleVariants -${allPossibleVariants}-`)


  const loadProfile = useRecoilValueLoadable(profileAtom);
  userId.current = loadProfile.contents.userId;



  const initializeValues = useRecoilCallback(
    ({ snapshot, set }) =>
      async (doenetId, {
        type,
        timeLimit,
        assignedDate,
        dueDate,
        showCorrectness,
        showCreditAchievedMenu,
        paginate,
        showFinishButton,
        showFeedback,
        showHints,
        autoSubmit,
        showSolution,
        proctorMakesAvailable,
        numberOfAttemptsAllowed: baseNumberOfAttemptsAllowed
      }) => {

        // if itemObj has not yet been loaded, don't process yet
        if (type === undefined) {
          return;
        }

        let suppress = [];
        if (timeLimit === null) {
          suppress.push('TimerMenu');
        }

        if (!showCorrectness || !showCreditAchievedMenu || effectivePermissions.canViewUnassignedContent !== '0') {
          suppress.push('CreditAchieved');
        }

        setSuppressMenus(suppress);

        let solutionDisplayMode = 'button';
        if (!showSolution && effectivePermissions.canViewUnassignedContent === '0') {
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


        // determine cid
        // the cid from the latest attempt takes precedence over assigned cid
        // If assigned cid differs from latest attempt cid,
        // set cidChanged=true
        let resp = await axios.get(
          `/api/getCidForAssignment.php`,
          { params: { doenetId, latestAttemptOverrides: true } },
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

        setCidChanged(resp.data.cidChanged);


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

        resp = await axios.get('/api/loadAttemptsAllowedAdjustment.php', {
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

        let numberOfAttemptsAllowedAdjustment = Number(resp.data.numberOfAttemptsAllowedAdjustment)
        set(numberOfAttemptsAllowedAdjustmentAtom, numberOfAttemptsAllowedAdjustment);


        let result = await returnNumberOfActivityVariants(cid);

        if (!result.success) {
          setLoad({
            requestedVariantIndex: 0,
            attemptNumber,
            showCorrectness,
            paginate,
            showFinishButton,
            showFeedback,
            showHints,
            autoSubmit,
            cid,
            doenetId,
            solutionDisplayMode,
            baseNumberOfAttemptsAllowed,
          });
          setStage('Problem');
          setMessage(result.message);
          return;
        }

        allPossibleVariants.current = [...Array(result.numberOfVariants).keys()].map(x => (x + 1));


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
          paginate,
          showFinishButton,
          showFeedback,
          showHints,
          autoSubmit,
          cid,
          doenetId,
          solutionDisplayMode,
          baseNumberOfAttemptsAllowed,
        });

        setStage('Ready');

      },
    [setSuppressMenus, effectivePermissions],
  );

  async function updateAttemptNumberAndRequestedVariant(newAttemptNumber, doenetId) {

    if (hash && hash !== "#page1") {
      navigate(search, { replace: true });
    }

    // don't attempt to save data from old attempt number
    // (which would triggered a reset and error message);
    let oldTimeoutId = await getValueOfTimeoutWithoutARefresh();
    if (oldTimeoutId !== null) {
      clearTimeout(oldTimeoutId)
    }

    //Check if cid has changed

    let cid = null;

    // since this is a new attempt,
    // get assigned cid, ignoring cid from latest attempt

    let resp = await axios.get(
      `/api/getCidForAssignment.php`,
      { params: { doenetId, latestAttemptOverrides: false } },
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
      setStage('Ready');

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
    setCidChanged(false);
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

  function pageChanged(pageNumber) {
    console.log(`page changed to ${pageNumber}`)
  }

  async function incrementAttemptNumberAndAttemptsAllowed() {

    let resp = await axios.post('/api/incrementAttemptsAllowedIfCidChanged.php', {
      doenetId,
    });

    if (resp.data.cidChanged) {
      setNumberOfAttemptsAllowedAdjustment(Number(resp.data.newNumberOfAttemptsAllowedAdjustment))
      setRecoilAttemptNumber(was => was + 1)
    }
  }

  // console.log(`>>>>stage -${stage}-`);

  //Wait for doenetId to be defined to start
  if (recoilDoenetId === '') {
    return null;
  }

  // console.log(`>>>>stage -${stage}-`)
  // console.log(`>>>>recoilAttemptNumber -${recoilAttemptNumber}-`)
  // console.log(`>>>>attemptNumber -${attemptNumber}-`)

  if (courseId === "__not_found__") {
    return <h1>Content not found or no permission to view content</h1>;
  } else if (stage === 'Initializing') {
    // initializeValues(recoilDoenetId, itemObj);
    return null;
  } else if (recoilAttemptNumber > attemptNumber) {
    updateAttemptNumberAndRequestedVariant(recoilAttemptNumber, recoilDoenetId);
    return null;
  } else if (stage === 'Problem') {
    return <h1>{message}</h1>;
  }

  let cidChangedAlert = null;
  if (cidChanged) {
    if (cidChangedMessageOpen) {
      let attemptNumberPhrase = null;
      if (baseNumberOfAttemptsAllowed > 1) {
        attemptNumberPhrase = " and the number of available attempts";
      }
      cidChangedAlert = <Banner type="ACTION" value={<div style={{ border: "var(--mainBorder)", borderRadius: "var(--mainBorderRadius)", padding: "5px", margin: "5px", display: "flex", flexFlow: "column wrap" }}>
        A new version of this activity is available.
        Do you want to start a new attempt using the new version?
        (This will reset the activity{attemptNumberPhrase}.)
        <div style={{ display: "flex", justifyContent: "center", padding: "5px" }}>
          <ButtonGroup>
            <Button onClick={incrementAttemptNumberAndAttemptsAllowed} dataTest="ConfirmNewVersion" value="Yes"></Button>
            <Button onClick={() => setCidChangedMessageOpen(false)} dataTest="CancelNewVersion" value="No" alert></Button>
          </ButtonGroup>
        </div>

      </div>}></Banner>
    } else {
      cidChangedAlert = <Banner type="ACTION" value={<div style={{ marginLeft: "1px", marginRight: "5px" }}>
        <ActionButton onClick={() => setCidChangedMessageOpen(true)} dataTest="NewVersionAvailable" value="New version available!"></ActionButton>
      </div>}></Banner>
    }
  }

  const allowLoadAndSave = effectivePermissions.canViewUnassignedContent === '0';

  return (
    <>
      {cidChangedAlert}
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
          autoSubmit,
          allowLoadState: allowLoadAndSave,
          allowSaveState: allowLoadAndSave,
          allowLocalState: allowLoadAndSave,
          allowSaveSubmissions: allowLoadAndSave,
          allowSaveEvents: allowLoadAndSave,
        }}
        attemptNumber={attemptNumber}
        requestedVariantIndex={requestedVariantIndex}
        updateCreditAchievedCallback={updateCreditAchieved}
        updateAttemptNumber={setRecoilAttemptNumber}
        pageChangedCallback={pageChanged}
        paginate={paginate}
        showFinishButton={showFinishButton}
        cidChangedCallback={() => setCidChanged(true)}
      // generatedVariantCallback={variantCallback}
      />
    </>
  );
}




async function returnNumberOfActivityVariants(cid) {

  let activityDefinitionDoenetML;

  try {
    activityDefinitionDoenetML = await retrieveTextFileForCid(cid);
  } catch (e) {
    return { success: false, message: "Could not retrieve file" }
  }

  let result = parseActivityDefinition(activityDefinitionDoenetML);

  if (!result.success) {
    return result;
  }

  try {
    result = await determineNumberOfActivityVariants(result.activityJSON);
  } catch (e) {
    return { success: false, message: e.message }
  }

  return { success: true, numberOfVariants: result.numberOfVariants };
}
