import React, { useEffect, useRef, useState } from "react";
import {
  ActivityViewer,
  // scrollableContainerAtom,
} from "../../../Viewer/ActivityViewer";
import useEventListener from "../../../_utils/hooks/useEventListener";
import {
  useRecoilValue,
  useRecoilCallback,
  useRecoilState,
  useSetRecoilState,
} from "recoil";
import { searchParamAtomFamily } from "../NewToolRoot";
import { findFirstPageOfActivity } from "../../../_reactComponents/Course/CourseActions";
import axios from "axios";
import { retrieveTextFileForCid } from "../../../Core/utils/retrieveTextFile";
import { parseActivityDefinition } from "../../../_utils/activityUtils";
import {
  editorPageIdInitAtom,
  editorViewerErrorStateAtom,
  refreshNumberAtom,
  textEditorDoenetMLAtom,
  updateTextEditorDoenetMLAtom,
  viewerDoenetMLAtom,
} from "../../../_sharedRecoil/EditorViewerRecoil";
import { useLocation, useNavigate } from "react-router";
import {
  pageVariantInfoAtom,
  pageVariantPanelAtom,
} from "../../../_sharedRecoil/PageViewerRecoil";
import { useUpdateViewer } from "./EditorViewer";

export default function EditorViewer() {
  // console.log(">>>>===EditorViewer")
  const viewerDoenetML = useRecoilValue(viewerDoenetMLAtom);

  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  const [variantInfo, setVariantInfo] = useRecoilState(pageVariantInfoAtom);
  const setVariantPanel = useSetRecoilState(pageVariantPanelAtom);
  const setEditorInit = useSetRecoilState(editorPageIdInitAtom);
  const refreshNumber = useRecoilValue(refreshNumberAtom);
  const setIsInErrorState = useSetRecoilState(editorViewerErrorStateAtom);
  const [pageCid, setPageCid] = useState(null);
  const updateViewer = useUpdateViewer();

  const [errMsg, setErrMsg] = useState(null);

  const setScrollableContainer = useSetRecoilState(scrollableContainerAtom);

  let navigate = useNavigate();
  let location = useLocation();

  const previousLocations = useRef({});
  const currentLocationKey = useRef(null);

  useEffect(() => {
    const prevTitle = document.title;

    const setTitle = async () => {
      // determine cid
      let resp = await axios.get(`/api/getCidForAssignment.php`, {
        params: {
          doenetId,
          latestAttemptOverrides: false,
          publicOnly: true,
          userCanViewSourceOnly: true,
        },
      });

      let activityCid;

      if (!resp.data.success || !resp.data.cid) {
        if (resp.data.cid) {
          setErrMsg(`Error loading activity: ${resp.data.message}`);
        } else {
          setErrMsg(
            `Error loading activity: public content with public source not found`,
          );
        }
        return;
      } else {
        activityCid = resp.data.cid;
      }

      let activityDefinition;

      try {
        activityDefinition = await retrieveTextFileForCid(
          activityCid,
          "doenet",
        );
      } catch (e) {
        setErrMsg(`Error loading activity: activity file not found`);
        return;
      }

      let parseResult = await parseActivityDefinition(
        activityDefinition,
        activityCid,
      );
      // TODO: handle diplsay of errors better
      if (parseResult.errors.length > 0) {
        setErrMsg(
          `Invalid activity definition: ${parseResult.errors[0].message}`,
        );
        return;
      }

      let activityJSON = parseResult.activityJSON;

      setPageCid(findFirstPageCidFromCompiledActivity(activityJSON.order));

      if (errMsg) {
        setErrMsg(null);
      }

      document.title = `${resp.data.label} - Doenet`;
    };

    setTitle().catch(console.error);

    return () => {
      document.title = prevTitle;
    };
  }, [doenetId]);

  useEffect(() => {
    // Keep track of scroll position when clicked on a link
    // If navigate back to that location (i.e., hit back button)
    // then scroll back to the location when clicked

    let foundNewInPrevious = false;

    if (currentLocationKey.current !== location.key) {
      if (
        location.state?.previousScrollPosition !== undefined &&
        currentLocationKey.current
      ) {
        previousLocations.current[
          currentLocationKey.current
        ].lastScrollPosition = location.state.previousScrollPosition;
      }

      if (previousLocations.current[location.key]) {
        foundNewInPrevious = true;

        if (
          previousLocations.current[location.key]?.lastScrollPosition !==
          undefined
        ) {
          document.getElementById("mainPanel").scroll({
            top: previousLocations.current[location.key].lastScrollPosition,
          });
        }
      }

      previousLocations.current[location.key] = { ...location };
      currentLocationKey.current = location.key;
    }
  }, [location]);

  useEffect(() => {
    const mainPanel = document.getElementById("mainPanel");
    setScrollableContainer(mainPanel);
  }, []);

  let initDoenetML = useRecoilCallback(
    ({ snapshot, set }) =>
      async (pageCid) => {
        const doenetML = await retrieveTextFileForCid(pageCid, "doenet");

        set(updateTextEditorDoenetMLAtom, doenetML);
        set(textEditorDoenetMLAtom, doenetML);
        set(viewerDoenetMLAtom, doenetML);
      },
    [],
  );

  useEffect(() => {
    if (pageCid) {
      initDoenetML(pageCid);
    }
    return () => {
      setEditorInit("");
    };
  }, [pageCid]);

  useEventListener("keydown", (e) => {
    if (
      e.keyCode === 83 &&
      (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)
    ) {
      e.preventDefault();
      updateViewer();
    }
  });

  if (errMsg) {
    return <h1>{errMsg}</h1>;
  }

  let attemptNumber = 1;
  let solutionDisplayMode = "button";

  function variantCallback(generatedVariantInfo, allPossibleVariants) {
    // console.log(">>>variantCallback",generatedVariantInfo,allPossibleVariants)
    const cleanGeneratedVariant = JSON.parse(
      JSON.stringify(generatedVariantInfo),
    );
    setVariantPanel({
      index: cleanGeneratedVariant.index,
      allPossibleVariants,
    });
    setVariantInfo({
      index: cleanGeneratedVariant.index,
    });
  }

  // console.log(`>>>>Show PageViewer with value -${viewerDoenetML}- -${refreshNumber}-`)
  // console.log(`>>>> refreshNumber -${refreshNumber}-`)
  // console.log(`>>>> attemptNumber -${attemptNumber}-`)
  // console.log('>>>PageViewer Read Only:',!isCurrentDraft)
  // console.log('>>>>variantInfo.index',variantInfo.index)

  if (!viewerDoenetML) {
    return null;
  }

  return (
    <ActivityViewer
      key={`pageViewer${refreshNumber}`}
      doenetML={viewerDoenetML}
      flags={{
        showCorrectness: true,
        readOnly: false,
        solutionDisplayMode: solutionDisplayMode,
        showFeedback: true,
        showHints: true,
        autoSubmit: false,
        allowLoadState: false,
        allowSaveState: false,
        allowLocalState: false,
        allowSaveSubmissions: false,
        allowSaveEvents: false,
      }}
      activityId={doenetId}
      attemptNumber={attemptNumber}
      generatedVariantCallback={variantCallback} //TODO:Replace
      requestedVariantIndex={variantInfo.index}
      setIsInErrorState={setIsInErrorState}
      location={location}
      navigate={navigate}
    />
  );
}

function findFirstPageCidFromCompiledActivity(orderObj) {
  if (!orderObj?.content) {
    return null;
  }
  //No pages or orders in order so return null
  if (orderObj.content.length == 0) {
    return null;
  }

  for (let item of orderObj.content) {
    if (item.type === "page") {
      return item.cid;
    } else {
      //First item of content is another order
      let nextOrderResponse = findFirstPageOfActivity(item.content);
      if (nextOrderResponse) {
        return nextOrderResponse;
      }
    }
  }

  return null; // didn't find any pages
}
