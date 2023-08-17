import React, { useEffect, useRef } from "react";
import {
  DoenetML,
  // scrollableContainerAtom,
} from "../../../Viewer/DoenetML";
import useEventListener from "../../../_utils/hooks/useEventListener";
import {
  useRecoilValue,
  useRecoilCallback,
  useRecoilState,
  useSetRecoilState,
} from "recoil";
import {
  profileAtom,
  searchParamAtomFamily,
  suppressMenusAtom,
} from "../NewToolRoot";
import {
  itemByDoenetId,
  courseIdAtom,
  useInitCourseItems,
  useSetCourseIdFromDoenetId,
} from "../../../_reactComponents/Course/CourseActions";
import {
  editorPageIdInitAtom,
  editorViewerErrorStateAtom,
  refreshNumberAtom,
  textEditorDoenetMLAtom,
  textEditorLastKnownCidAtom,
  updateTextEditorDoenetMLAtom,
  viewerDoenetMLAtom,
} from "../../../_sharedRecoil/EditorViewerRecoil";
import axios from "axios";
import { useLoaderData, useLocation, useNavigate } from "react-router";
import {
  pageVariantInfoAtom,
  pageVariantPanelAtom,
} from "../../../_sharedRecoil/PageViewerRecoil";
import { cidFromText } from "../../../Core/utils/cid";

export const useUpdateViewer = () => {
  const updateViewer = useRecoilCallback(({ snapshot, set }) => async () => {
    const textEditorDoenetML = await snapshot.getPromise(
      textEditorDoenetMLAtom,
    );
    const isErrorState = await snapshot.getPromise(editorViewerErrorStateAtom);

    set(viewerDoenetMLAtom, textEditorDoenetML);

    if (isErrorState) {
      set(refreshNumberAtom, (was) => was + 1);
    }
  });
  return updateViewer;
};

export default function EditorViewer() {
  // let refreshCount = useRef(1);
  // console.log(">>>>===EditorViewer",refreshCount.current)
  // refreshCount.current++;
  let data = useLoaderData();
  const dataCourseId = data?.courseId;
  const loaderDoenetId = data?.doenetId;
  const loaderPageId = data?.pageDoenetId;
  const viewerDoenetML = useRecoilValue(viewerDoenetMLAtom);
  const paramPageId = useRecoilValue(searchParamAtomFamily("pageId"));
  const paramlinkPageId = useRecoilValue(searchParamAtomFamily("linkPageId"));
  const doenetId = useRecoilValue(searchParamAtomFamily("doenetId"));
  let effectivePageId = paramPageId;
  let effectiveDoenetId = doenetId;
  if (paramlinkPageId) {
    effectivePageId = paramlinkPageId;
    effectiveDoenetId = paramlinkPageId;
  }
  if (loaderDoenetId) {
    effectivePageId = loaderPageId;
    effectiveDoenetId = loaderDoenetId;
  }
  const [courseId, setCourseId] = useRecoilState(courseIdAtom);
  const initializedPageId = useRecoilValue(editorPageIdInitAtom);
  const [variantInfo, setVariantInfo] = useRecoilState(pageVariantInfoAtom);
  const setVariantPanel = useSetRecoilState(pageVariantPanelAtom);
  const setEditorInit = useSetRecoilState(editorPageIdInitAtom);
  const refreshNumber = useRecoilValue(refreshNumberAtom);
  const setIsInErrorState = useSetRecoilState(editorViewerErrorStateAtom);
  const [pageObj, setPageObj] = useRecoilState(itemByDoenetId(effectivePageId));
  const activityObj = useRecoilValue(itemByDoenetId(doenetId));
  const setSuppressMenus = useSetRecoilState(suppressMenusAtom);
  const { canUpload } = useRecoilValue(profileAtom);
  const updateViewer = useUpdateViewer();

  // const setScrollableContainer = useSetRecoilState(scrollableContainerAtom);

  let navigate = useNavigate();
  let location = useLocation();

  const previousLocations = useRef({});
  const currentLocationKey = useRef(null);

  useSetCourseIdFromDoenetId(effectiveDoenetId);
  useInitCourseItems(courseId);

  let pageInitiated = false;
  let label = null;
  if (Object.keys(pageObj).length > 0) {
    pageInitiated = true;
    if (activityObj?.isSinglePage && !paramlinkPageId) {
      label = activityObj?.label;
    } else {
      label = pageObj.label;
    }
  }

  useEffect(() => {
    const prevTitle = document.title;
    if (label) {
      document.title = `${label} - Doenet`;
    }
    return () => {
      document.title = prevTitle;
    };
  }, [label]);

  let initDoenetML = useRecoilCallback(
    ({ snapshot, set }) =>
      async (pageId) => {
        let { data: doenetML } = await axios.get(
          `/media/byPageId/${pageId}.doenet`,
        );
        doenetML = doenetML.toString(); //Numbers mess up codeMirror
        //TODO: Problem with caching when contents change in pageLink
        // let response = await snapshot.getPromise(fileByPageId(pageId));
        let pageObj = await snapshot.getPromise(itemByDoenetId(pageId));
        let containingObj = await snapshot.getPromise(
          itemByDoenetId(pageObj.containingDoenetId),
        );
        // if (typeof response === "object"){
        //   response = response.data;
        // }
        // const doenetML = response;

        const cid = await cidFromText(doenetML);

        set(updateTextEditorDoenetMLAtom, doenetML);
        set(textEditorDoenetMLAtom, doenetML);
        set(viewerDoenetMLAtom, doenetML);
        set(editorPageIdInitAtom, pageId);
        set(textEditorLastKnownCidAtom, cid);
        let suppress = [];
        if (containingObj.type == "bank") {
          suppress.push("AssignmentSettingsMenu");
        }

        if (pageObj.type == "pageLink") {
          suppress.push("AssignmentSettingsMenu");
          suppress.push("PageLink");
          suppress.push("SupportingFilesMenu");
        }
        if (canUpload !== "1") suppress.push("SupportingFilesMenu");
        setSuppressMenus(suppress);
      },
    [setSuppressMenus],
  );

  useEffect(() => {
    if (effectivePageId !== "" && pageInitiated) {
      initDoenetML(effectivePageId);
    } else if (loaderPageId) {
      //Add Activity from Portfolio so init pageObj
      setCourseId(dataCourseId);
      setPageObj({
        containingDoenetId: loaderDoenetId,
        doenetId: loaderPageId,
        isSelected: false,
        label: "Untitled",
        parentDoenetId: loaderDoenetId,
        type: "page",
      });
    }
    return () => {
      setEditorInit("");
    };
  }, [
    dataCourseId,
    setCourseId,
    initDoenetML,
    setEditorInit,
    loaderPageId,
    effectivePageId,
    pageInitiated,
  ]);

  useEventListener("keydown", (e) => {
    if ((e.keyCode === 83 && e.metaKey) || (e.keyCode === 83 && e.ctrlKey)) {
      e.preventDefault();
      updateViewer();
    }
  });

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

  if (courseId === "__not_found__") {
    return <h1>Content not found or no permission to view content</h1>;
  } else if (effectivePageId !== initializedPageId) {
    //DoenetML is changing to another PageId
    return null;
  }

  let attemptNumber = 1;
  let solutionDisplayMode = "button";

  function variantCallback(activityVariants) {
    setVariantPanel(activityVariants);
    setVariantInfo(activityVariants);
  }

  // console.log(`>>>>Show PageViewer with value -${viewerDoenetML}- -${refreshNumber}-`)
  // console.log(`>>>> refreshNumber -${refreshNumber}-`)
  // console.log(`>>>> attemptNumber -${attemptNumber}-`)
  // console.log('>>>PageViewer Read Only:',!isCurrentDraft)
  // console.log('>>>>variantInfo.index',variantInfo.index)

  return (
    <DoenetML
      key={`pageViewer${refreshNumber}`}
      doenetML={viewerDoenetML}
      flags={{
        showCorrectness: true,
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
      idsIncludeActivityId={false}
      attemptNumber={attemptNumber}
      generatedVariantCallback={variantCallback}
      requestedVariantIndex={variantInfo.index}
      setIsInErrorState={setIsInErrorState}
      location={location}
      navigate={navigate}
      linkSettings={{
        viewURL: "/course?tool=assignment",
        editURL: "/course?tool=editor",
        useQueryParameters: true,
      }}
    />
  );
}
