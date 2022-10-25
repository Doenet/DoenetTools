import React, {useEffect, useRef, useState} from "../../_snowpack/pkg/react.js";
import PageViewer, {scrollableContainerAtom} from "../../viewer/PageViewer.js";
import useEventListener from "../../_utils/hooks/useEventListener.js";
import {
  useRecoilValue,
  useRecoilCallback,
  useRecoilState,
  useSetRecoilState
} from "../../_snowpack/pkg/recoil.js";
import {searchParamAtomFamily} from "../NewToolRoot.js";
import {findFirstPageOfActivity} from "../../_reactComponents/Course/CourseActions.js";
import axios from "../../_snowpack/pkg/axios.js";
import {retrieveTextFileForCid} from "../../core/utils/retrieveTextFile.js";
import {parseActivityDefinition} from "../../_utils/activityUtils.js";
import {editorPageIdInitAtom, editorViewerErrorStateAtom, refreshNumberAtom, textEditorDoenetMLAtom, updateTextEditorDoenetMLAtom, viewerDoenetMLAtom} from "../../_sharedRecoil/EditorViewerRecoil.js";
import {useLocation} from "../../_snowpack/pkg/react-router.js";
import {pageVariantInfoAtom, pageVariantPanelAtom} from "../../_sharedRecoil/PageViewerRecoil.js";
import {useUpdateViewer} from "./EditorViewer.js";
export default function EditorViewer() {
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
  let location = useLocation();
  const previousLocations = useRef({});
  const currentLocationKey = useRef(null);
  useEffect(() => {
    const prevTitle = document.title;
    const setTitle = async () => {
      let resp = await axios.get(`/api/getCidForAssignment.php`, {params: {doenetId, latestAttemptOverrides: false, publicOnly: true, userCanViewSourceOnly: true}});
      let activityCid;
      if (!resp.data.success || !resp.data.cid) {
        if (resp.data.cid) {
          setErrMsg(`Error loading activity: ${resp.data.message}`);
        } else {
          setErrMsg(`Error loading activity: public content with public source not found`);
        }
        return;
      } else {
        activityCid = resp.data.cid;
      }
      let activityDefinition;
      try {
        activityDefinition = await retrieveTextFileForCid(activityCid, "doenet");
      } catch (e) {
        setErrMsg(`Error loading activity: activity file not found`);
        return;
      }
      let parseResult = parseActivityDefinition(activityDefinition);
      if (!parseResult.success) {
        setErrMsg(`Invalid activity definition: ${parseResult.message}`);
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
    let foundNewInPrevious = false;
    if (currentLocationKey.current !== location.key) {
      if (location.state?.previousScrollPosition !== void 0 && currentLocationKey.current) {
        previousLocations.current[currentLocationKey.current].lastScrollPosition = location.state.previousScrollPosition;
      }
      if (previousLocations.current[location.key]) {
        foundNewInPrevious = true;
        if (previousLocations.current[location.key]?.lastScrollPosition !== void 0) {
          document.getElementById("mainPanel").scroll({top: previousLocations.current[location.key].lastScrollPosition});
        }
      }
      previousLocations.current[location.key] = {...location};
      currentLocationKey.current = location.key;
    }
  }, [location]);
  useEffect(() => {
    const mainPanel = document.getElementById("mainPanel");
    setScrollableContainer(mainPanel);
  }, []);
  let initDoenetML = useRecoilCallback(({snapshot, set}) => async (pageCid2) => {
    const doenetML = await retrieveTextFileForCid(pageCid2, "doenet");
    set(updateTextEditorDoenetMLAtom, doenetML);
    set(textEditorDoenetMLAtom, doenetML);
    set(viewerDoenetMLAtom, doenetML);
  }, []);
  useEffect(() => {
    if (pageCid) {
      initDoenetML(pageCid);
    }
    return () => {
      setEditorInit("");
    };
  }, [pageCid]);
  useEventListener("keydown", (e) => {
    if (e.keyCode === 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
      e.preventDefault();
      updateViewer();
    }
  });
  if (errMsg) {
    return /* @__PURE__ */ React.createElement("h1", null, errMsg);
  }
  let attemptNumber = 1;
  let solutionDisplayMode = "button";
  function variantCallback(generatedVariantInfo, allPossibleVariants, variantIndicesToIgnore = []) {
    const cleanGeneratedVariant = JSON.parse(JSON.stringify(generatedVariantInfo));
    setVariantPanel({
      index: cleanGeneratedVariant.index,
      allPossibleVariants,
      variantIndicesToIgnore
    });
    setVariantInfo({
      index: cleanGeneratedVariant.index
    });
  }
  if (!viewerDoenetML) {
    return null;
  }
  return /* @__PURE__ */ React.createElement(PageViewer, {
    key: `pageViewer${refreshNumber}`,
    doenetML: viewerDoenetML,
    flags: {
      showCorrectness: true,
      readOnly: false,
      solutionDisplayMode,
      showFeedback: true,
      showHints: true,
      autoSubmit: false,
      allowLoadState: false,
      allowSaveState: false,
      allowLocalState: false,
      allowSaveSubmissions: false,
      allowSaveEvents: false
    },
    doenetId,
    attemptNumber,
    generatedVariantCallback: variantCallback,
    requestedVariantIndex: variantInfo.index,
    setIsInErrorState,
    pageIsActive: true
  });
}
function findFirstPageCidFromCompiledActivity(orderObj) {
  if (!orderObj?.content) {
    return null;
  }
  if (orderObj.content.length == 0) {
    return null;
  }
  for (let item of orderObj.content) {
    if (item.type === "page") {
      return item.cid;
    } else {
      let nextOrderResponse = findFirstPageOfActivity(item.content);
      if (nextOrderResponse) {
        return nextOrderResponse;
      }
    }
  }
  return null;
}
