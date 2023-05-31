import "./DoenetML.css";
import React from "react";
import PageViewer from "./Viewer/PageViewer.jsx";
import { RecoilRoot } from "recoil";
import { MathJaxContext } from "better-react-mathjax";
import { mathjaxConfig } from "./Core/utils/math.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DarkmodeController from "./Tools/_framework/DarkmodeController.jsx";
import VirtualKeyboard from "./Tools/_framework/Footers/VirtualKeyboard";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

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
  components: {
    Button: {
      baseStyle: {
        fontWeight: "normal",
        letterSpacing: ".5px",
        _focus: {
          outline: "2px solid #2D5994",
          outlineOffset: "2px",
        },
        _disabled: {
          bg: "#E2E2E2",
          color: "black",
          cursor: "none",
        },
      },
      variants: {
        // We can override existing variants
        solid: {
          bg: "doenet.mainBlue",
          color: "white",
          _hover: {
            bg: "doenet.solidLightBlue",
            color: "black",
          },
        },
        outline: {
          borderColor: "#2D5994",
          _hover: {
            bg: "solidLightBlue",
          },
        },
        ghost: {
          _hover: {
            bg: "solidLightBlue",
          },
        },
        link: {
          color: "solidLightBlue",
        },
      },
    },
  },
});
export default function DoenetML({ doenetML }) {
  return (
    <ChakraProvider theme={theme}>
      <RecoilRoot>
        <Router>
          <Routes>
            <Route
              path="*"
              element={
                <DarkmodeController>
                  <MathJaxContext
                    version={2}
                    config={mathjaxConfig}
                    onStartup={(mathJax) =>
                      (mathJax.Hub.processSectionDelay = 0)
                    }
                  >
                    <PageViewer
                      doenetML={doenetML}
                      // cid={"185fd09b6939d867d4faee82393d4a879a2051196b476acdca26140864bc967a"}
                      updateDataOnContentChange={true}
                      flags={{
                        showCorrectness: true,
                        readOnly: false,
                        showFeedback: true,
                        showHints: true,
                        allowLoadState: false,
                        allowSaveState: false,
                        allowLocalState: false,
                        allowSaveSubmissions: false,
                        allowSaveEvents: false,
                        autoSubmit: false,
                      }}
                      attemptNumber={1}
                      requestedVariantIndex={1}
                      doenetId=""
                      pageIsActive={true}
                      // collaborate={true}
                      // viewerExternalFunctions = {{ allAnswersSubmitted: this.setAnswersSubmittedTrueCallback}}
                      // functionsSuppliedByChild = {this.functionsSuppliedByChild}
                    />
                    <VirtualKeyboard />
                  </MathJaxContext>
                </DarkmodeController>
              }
            />
          </Routes>
        </Router>
      </RecoilRoot>
    </ChakraProvider>
  );
}
