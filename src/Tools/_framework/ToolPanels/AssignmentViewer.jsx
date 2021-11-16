import React, { useEffect, useRef, useState } from 'react';
import DoenetViewer from '../../../Viewer/DoenetViewer';
import { serializedComponentsReviver } from '../../../Core/utils/serializedStateProcessing'
import {
  useRecoilValue,
  atom,
  atomFamily,
  useRecoilCallback,
  useSetRecoilState,
  // useRecoilState,
  // useSetRecoilState,
} from 'recoil';
import { searchParamAtomFamily, pageToolViewAtom, footerAtom } from '../NewToolRoot';
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
import { suppressMenusAtom } from '../NewToolRoot';


export const currentAttemptNumber = atom({
  key: 'currentAttemptNumber',
  default: null,
});

export const creditAchievedAtom = atom({
  key: 'creditAchievedAtom',
  default: {
    creditByItem:[1,0,.5],
    // creditByItem:[],
    creditForAttempt:0,
    creditForAssignment:0,
    totalPointsOrPercent:0,
  },
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
  const setFooter = useSetRecoilState(footerAtom);
  const recoilDoenetId = useRecoilValue(searchParamAtomFamily('doenetId'));
  const setSuppressMenus = useSetRecoilState(suppressMenusAtom);
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

  console.log(`storedAllPossibleVariants -${storedAllPossibleVariants}-`)

  const initializeValues = useRecoilCallback(
    ({ snapshot, set }) =>
      async (doenetId) => {
        //Prevent duplicate inits
        if (startedInitOfDoenetId.current === doenetId) {
          return;
        }
        const isCollection = await snapshot.getPromise(
          searchParamAtomFamily('isCollection'),
        );
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
        if (timeLimit === null){
          suppress.push("TimerMenu")
        }
        
        if (!showCorrectness || !showCreditAchievedMenu){
          suppress.push("CreditAchieved")
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
          //First try to find if they have a previously assigned contentId
          //for the current attempt

          const { data } = await axios.get(`/api/getContentIdFromAssignmentAttempt.php`,{params:{doenetId}})
   
          if (data.foundAttempt){
            contentId = data.contentId;
            isAssigned = true;
          }else{
            //If this is the first attempt then give them the 
            //currently released

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
          
        }
        let doenetML = null;
        // console.log('>>>>initializeValues contentId', contentId);
        if (!isAssigned) {
          setStage('Problem');
          setMessage('Assignment is not assigned.');
          return;
        }

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

        
        //Set doenetML
        let response = await snapshot.getPromise(fileByContentId(contentId));
        if (typeof response === 'object') {
          response = response.data;
        }
        doenetML = response;

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
          // console.log(">>>>data",data)

          let usersVariantAttempts = [];

          for (let variant of data.variants) {
            let obj = JSON.parse(variant, serializedComponentsReviver);
            if (obj) {
              usersVariantAttempts.push(obj.name);
            }
          }
  
          let attemptNumber = Math.max(...data.attemptNumbers);
          let needNewVariant = false;

          if (attemptNumber < 1) {
            attemptNumber = 1;
            needNewVariant = true;
          }else if(!data.variants[data.variants.length-1]){
            //Starting a proctored exam so we need a variant
            needNewVariant = true;
          }


          set(currentAttemptNumber, attemptNumber);

          if (needNewVariant){
            //Find requestedVariant
            usersVariantAttempts = pushRandomVariantOfRemaining({
              previous: [...usersVariantAttempts],
              from: allPossibleVariants,
            });
            
          }
          let requestedVariant = {
            name: usersVariantAttempts[usersVariantAttempts.length - 1],
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
          if (numberOfCompletedAttempts === -1) {
            numberOfCompletedAttempts = 0;
          }
          let attemptNumber = numberOfCompletedAttempts + 1;
          set(currentAttemptNumber, attemptNumber);
          setLoad({
            requestedVariant: assignedVariant,
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
      },
    [],
  );

  const updateAttemptNumberAndRequestedVariant = useRecoilCallback(
    ({ snapshot, set }) =>
      async (newAttemptNumber) => {
      //TODO: Exit properly if we are a collection
      const isCollection = await snapshot.getPromise(
        searchParamAtomFamily('isCollection'),
      );
      if (isCollection){
        console.error("How did you get here?");
        return;
      }

      let doenetId = await snapshot.getPromise(
        searchParamAtomFamily('doenetId'),
      );

        //Check if contentId has changed (if not a collection)
        const versionHistory = await snapshot.getPromise(
          itemHistoryAtom(doenetId),
        );


        //Find Assigned ContentId
        //Use isReleased as isAssigned for now
        //TODO: refactor isReleased to isAssigned
        let contentId = null;
        //Set contentId and isAssigned
        for (let version of versionHistory.named) {
          if (version.isReleased === '1') {

            contentId = version.contentId;
            break;
          }
        }

        // console.log(">>>>updateAttemptNumberAndRequestedVariant contentId",contentId)

        let doenetML = null;

        let response = await snapshot.getPromise(fileByContentId(contentId));
        if (typeof response === 'object') {
          response = response.data;
        }
        doenetML = response;

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
          newObj.doenetML = doenetML;
          return newObj;
        });
      },
    [],
  );

  const updateCreditAchieved = useRecoilCallback(
    ({  set }) =>
      async ({ creditByItem, creditForAssignment, creditForAttempt, totalPointsOrPercent }) => {
        // console.log(">>>>UPDATE",{ creditByItem, creditForAssignment, creditForAttempt })
        set(creditAchievedAtom,{ creditByItem, creditForAssignment, creditForAttempt, totalPointsOrPercent });
  });

  // console.log(`>>>>stage -${stage}-`);

  //Wait for doenetId to be defined to start
  if (recoilDoenetId === '') {
    return null;
  }

  // console.log(`>>>>stage -${stage}-`)

  if (stage === 'Initializing') {
    initializeValues(recoilDoenetId);
    return null;
  } else if (stage === 'Problem') {
    return <h1>{message}</h1>;
  } else if (recoilAttemptNumber > attemptNumber) {
    updateAttemptNumberAndRequestedVariant(recoilAttemptNumber);
    return null;
  }

  return (
    <>
    {/* <button onClick={()=>{
      setFooter((was)=>{
        let newObj = null
        if (!was){
          newObj = {
            height:120,
            open:true,
            component:"MathInputKeyboard"
          }
        }
        return newObj;
      })
      
    }}>Toggle Keyboard</button> */}
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
      updateCreditAchievedCallback={updateCreditAchieved}
      // generatedVariantCallback={variantCallback}
    />
    </>
  );
}
