import "./DoenetML.css";
import { prng_alea } from "esm-seedrandom";
import React, { useRef } from "react";
import { ActivityViewer } from "./Viewer/ActivityViewer.jsx";
import { RecoilRoot } from "recoil";
import { MathJaxContext } from "better-react-mathjax";
import { mathjaxConfig } from "./Core/utils/math";
import VirtualKeyboard from "./Tools/Footers/VirtualKeyboard";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

let rngClass = prng_alea;

/**
 * this is a hack for react-mathqill
 * error: global is not defined
 */
window.global = window.global || window;

const theme = extendTheme({
  fonts: {
    body: "Jost",
  },
  textStyles: {
    primary: {
      fontFamily: "Jost",
    },
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
    // initialColorMode: "system",
    // useSystemColorMode: true,
  },
  colors: {
    doenet: {
      mainBlue: "#1a5a99",
      lightBlue: "#b8d2ea",
      solidLightBlue: "#8fb8de",
      mainGray: "#e3e3e3",
      mediumGray: "#949494",
      lightGray: "#e7e7e7",
      donutBody: "#eea177",
      donutTopping: "#6d4445",
      mainRed: "#c1292e",
      lightRed: "#eab8b8",
      mainGreen: "#459152",
      canvas: "#ffffff",
      canvastext: "#000000",
      lightGreen: "#a6f19f",
      lightYellow: "#f5ed85",
      whiteBlankLink: "#6d4445",
      mainYellow: "#94610a",
      mainPurple: "#4a03d9",
    },
  },
});

export function DoenetML({
  doenetML,
  flags = {},
  cid,
  activityId = "",
  userId,
  attemptNumber = 1,
  requestedVariantIndex,
  updateCreditAchievedCallback,
  updateActivityStatusCallback,
  updateAttemptNumber,
  pageChangedCallback,
  paginate,
  showFinishButton,
  cidChangedCallback,
  checkIfCidChanged,
  setActivityAsCompleted,
  setIsInErrorState,
  apiURLs,
  generatedVariantCallback,
  setErrorsAndWarningsCallback,
  forceDisable,
  forceShowCorrectness,
  forceShowSolution,
  forceUnsuppressCheckwork,
  addVirtualKeyboard = true,
  addBottomPadding = true,
  location,
  navigate,
  updateDataOnContentChange = false,
  idsIncludeActivityId = true,
  linkSettings,
  scrollableContainer,
  darkMode,
}) {
  const thisPropSet = [
    doenetML,
    cid,
    activityId,
    userId,
    requestedVariantIndex,
  ];
  const lastPropSet = useRef([]);

  const variantIndex = useRef(undefined);

  const defaultFlags = {
    showCorrectness: true,
    readOnly: false,
    solutionDisplayMode: "button",
    showFeedback: true,
    showHints: true,
    allowLoadState: false,
    allowSaveState: false,
    allowLocalState: false,
    allowSaveSubmissions: false,
    allowSaveEvents: false,
    autoSubmit: false,
  };

  flags = { ...defaultFlags, ...flags };

  if (userId) {
    // if userId was specified, then we're viewing results of someone other than the logged in person
    // so disable saving state
    // and disable even looking up state from local storage (as we want to get the state from the database)
    flags.allowLocalState = false;
    flags.allowSaveState = false;
  } else if (flags.allowSaveState) {
    // allowSaveState implies allowLoadState
    // Rationale: saving state will result in loading a new state if another device changed it
    flags.allowLoadState = true;
  }

  // Normalize variant index to an integer.
  // Generate a random variant index if the requested variant index is undefined.
  // To preserve the generated variant index on rerender,
  // regenerate only if one of the props in propSet has changed
  if (thisPropSet.some((v, i) => v !== lastPropSet.current[i])) {
    if (requestedVariantIndex === undefined) {
      let rng = new rngClass(new Date());
      requestedVariantIndex = Math.floor(rng() * 1000000) + 1;
    }
    variantIndex.current = Math.round(requestedVariantIndex);
    if (!Number.isInteger(variantIndex.current)) {
      variantIndex.current = 1;
    }
    lastPropSet.current = thisPropSet;
  }

  let keyboard = null;

  if (addVirtualKeyboard) {
    keyboard = <VirtualKeyboard />;
  }

  return (
    <ChakraProvider
      theme={theme}
      resetScope=".before-keyboard"
      disableGlobalStyle
    >
      <RecoilRoot>
        <MathJaxContext
          version={2}
          config={mathjaxConfig}
          onStartup={(mathJax) => (mathJax.Hub.processSectionDelay = 0)}
        >
          <ActivityViewer
            doenetML={doenetML}
            updateDataOnContentChange={updateDataOnContentChange}
            flags={flags}
            cid={cid}
            activityId={activityId}
            userId={userId}
            attemptNumber={attemptNumber}
            requestedVariantIndex={variantIndex.current}
            updateCreditAchievedCallback={updateCreditAchievedCallback}
            updateActivityStatusCallback={updateActivityStatusCallback}
            updateAttemptNumber={updateAttemptNumber}
            pageChangedCallback={pageChangedCallback}
            paginate={paginate}
            showFinishButton={showFinishButton}
            cidChangedCallback={cidChangedCallback}
            checkIfCidChanged={checkIfCidChanged}
            setActivityAsCompleted={setActivityAsCompleted}
            setIsInErrorState={setIsInErrorState}
            apiURLs={apiURLs}
            generatedVariantCallback={generatedVariantCallback}
            setErrorsAndWarningsCallback={setErrorsAndWarningsCallback}
            forceDisable={forceDisable}
            forceShowCorrectness={forceShowCorrectness}
            forceShowSolution={forceShowSolution}
            forceUnsuppressCheckwork={forceUnsuppressCheckwork}
            location={location}
            navigate={navigate}
            idsIncludeActivityId={idsIncludeActivityId}
            linkSettings={linkSettings}
            addBottomPadding={addBottomPadding}
            scrollableContainer={scrollableContainer}
            darkMode={darkMode}
          />
          <div className="before-keyboard" />
          {keyboard}
        </MathJaxContext>
      </RecoilRoot>
    </ChakraProvider>
  );
}
