import React, { useEffect, useRef, useState } from "react";
import {
  useRecoilValue,
  atom,
  useRecoilCallback,
  useSetRecoilState,
  useRecoilValueLoadable,
  useRecoilState,
} from "recoil";
import { searchParamAtomFamily, profileAtom } from "../NewToolRoot";

import axios from "axios";
import DoenetML, { returnNumberOfActivityVariantsForCid } from "doenetml";
import {
  itemByDoenetId,
  courseIdAtom,
  useInitCourseItems,
  useSetCourseIdFromDoenetId,
} from "../../../_reactComponents/Course/CourseActions";
import { activityVariantPanelAtom } from "../../../_sharedRecoil/PageViewerRecoil";
import { useLocation, useNavigate } from "react-router";
import { apiURLs } from "./AssignmentViewer";

export default function DraftAssignmentViewer() {
  // console.log(">>>===DraftAssignmentViewer")
  const recoilDoenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const courseId = useRecoilValue(courseIdAtom);

  const requestedVariantParam = useRecoilValue(
    searchParamAtomFamily("requestedVariant"),
  );
  const requestedVariantIndex =
    requestedVariantParam && Number.isFinite(Number(requestedVariantParam))
      ? Number(requestedVariantParam)
      : 1;

  const setVariantPanel = useSetRecoilState(activityVariantPanelAtom);
  let [stage, setStage] = useState("Initializing");
  let [message, setMessage] = useState("");
  const [
    {
      showCorrectness,
      paginate,
      showFeedback,
      showHints,
      autoSubmit,
      cid,
      doenetId,
      solutionDisplayMode,
    },
    setLoad,
  ] = useState({});

  let allPossibleVariants = useRef([]);
  // let userId = useRef(null);
  useSetCourseIdFromDoenetId(recoilDoenetId);
  useInitCourseItems(courseId);

  let location = useLocation();
  let navigate = useNavigate();

  let itemObj = useRecoilValue(itemByDoenetId(recoilDoenetId));
  let label = itemObj.label;

  useEffect(() => {
    const prevTitle = document.title;
    if (label) {
      document.title = `${label} - Doenet`;
    }
    return () => {
      document.title = prevTitle;
    };
  }, [label]);

  useEffect(() => {
    initializeValues(recoilDoenetId, itemObj);
  }, [itemObj, recoilDoenetId]);

  // console.log(`allPossibleVariants -${allPossibleVariants}-`)

  // const loadProfile = useRecoilValueLoadable(profileAtom);
  // userId.current = loadProfile.contents.userId;

  function variantCallback(variantData) {
    if (variantData.activityVariant) {
      let { variantIndex, numberOfVariants } = variantData.activityVariant;
      // console.log(">>>variantCallback",variantIndex,numberOfVariants)
      setVariantPanel({
        index: variantIndex,
        numberOfVariants,
      });
    }
  }

  const initializeValues = useRecoilCallback(
    ({ snapshot, set }) =>
      async (
        doenetId,
        {
          type,
          timeLimit,
          assignedDate,
          dueDate,
          showCorrectness,
          showCreditAchievedMenu,
          paginate,
          showFeedback,
          showHints,
          autoSubmit,
          showSolution,
          proctorMakesAvailable,
        },
      ) => {
        // if itemObj has not yet been loaded, don't process yet
        if (type === undefined) {
          return;
        }

        let solutionDisplayMode = "button";
        if (!showSolution) {
          solutionDisplayMode = "none";
        }

        //TODO: test if assignment should be shown here

        let cid = null;

        // determine cid
        let resp = await axios.get(`/api/getCidForAssignment.php`, {
          params: { doenetId, latestAttemptOverrides: false, getDraft: true },
        });

        if (!resp.data.success || !resp.data.cid) {
          setStage("Problem");
          setMessage(`Error loading assignment: ${resp.data.message}`);
          return;
        } else {
          cid = resp.data.cid;
        }

        let result = await returnNumberOfActivityVariantsForCid(cid);

        if (!result.success) {
          setStage("Problem");
          setMessage(result.message);
          return;
        }

        allPossibleVariants.current = [
          ...Array(result.numberOfVariants).keys(),
        ].map((x) => x + 1);

        setLoad({
          showCorrectness,
          paginate,
          showFeedback,
          showHints,
          autoSubmit,
          cid,
          doenetId,
          solutionDisplayMode,
        });

        setStage("Ready");
      },
    [],
  );

  // console.log(`>>>>stage -${stage}-`);

  //Wait for doenetId to be defined to start
  if (recoilDoenetId === "") {
    return null;
  }

  // console.log(`>>>>stage -${stage}-`)

  if (courseId === "__not_found__") {
    return <h1>Content not found or no permission to view content</h1>;
  } else if (stage === "Initializing") {
    // initializeValues(recoilDoenetId);
    return null;
  } else if (stage === "Problem") {
    return <h1>{message}</h1>;
  }

  return (
    <>
      <DoenetML
        key={`activityViewer${doenetId}`}
        cid={cid}
        activityId={doenetId}
        flags={{
          showCorrectness,
          readOnly: false,
          solutionDisplayMode,
          showFeedback,
          showHints,
          autoSubmit,
          allowLoadState: false,
          allowSaveState: false,
          allowLocalState: false,
          allowSaveSubmissions: false,
          allowSaveEvents: false,
        }}
        requestedVariantIndex={requestedVariantIndex}
        generatedVariantCallback={variantCallback}
        paginate={paginate}
        idsIncludeActivityId={false}
        apiURLs={apiURLs}
        location={location}
        navigate={navigate}
      />
    </>
  );
}
