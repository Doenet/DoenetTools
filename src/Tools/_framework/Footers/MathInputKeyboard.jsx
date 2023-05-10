import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Container,
  Flex,
  SimpleGrid,
  Stack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  defineStyle,
  defineStyleConfig,
  extendTheme,
  useDisclosure,
  Slide,
  Tooltip,
  IconButton,
  Text,
} from "@chakra-ui/react";
import styled from "styled-components";
import { MathJax } from "better-react-mathjax";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faBackspace, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { useToast, toastType } from "../Toast";

import { constSelector, useRecoilValue, useSetRecoilState } from "recoil";

import {
  focusedMathField,
  palletRef,
  focusedMathFieldReturn,
} from "./MathInputSelector";

// import { doenetMainBlue } from '../../../_reactComponents/PanelHeaderComponents/theme';

import { useRef } from "react";
import { setUpVariantSeedAndRng } from "../../../Core/utils/variants";
import { FaKeyboard } from "react-icons/fa";
import { CloseIcon } from "@chakra-ui/icons";

const Panel = styled.div`
  height: 240px;
  // position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  /* background-color: var(--canvas); */
  /* color: var(--canvas); */
  display: flex;
  flex-direction: row;
  text-align: center;
  justify-content: center;
`;

const SubSection = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: no-wrap;
  /* flex-basis: 27%; */
  flex-grow: 1;
  max-width: 600px;
`;

const ContainerSection = styled.div`
  display: grid;
  flex-direction: row;
  flex-wrap: no-wrap;
  /* flex-basis: 27%; */
  /* flex-grow: 1; */
`;

const ControlSection = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: no-wrap;
  flex-basis: 19%;
`;

const ToggleButtonSection = styled.div`
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
`;

const Section = styled.div`
  height: 160px;
  /* min-width: 100px; */
  /* max-width: 300px; */
  margin-left: auto;
  margin-right: auto;
  margin-top: auto;
  margin-bottom: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;

const LettersSection = styled.div`
  height: 150px;
  max-width: 600px;
  flex-basis: 90%;
  margin-left: 5px;
  margin-right: 5px;
  margin-top: auto;
  margin-bottom: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;

// const Button = styled.button`
//   flex-basis: 18%;
//   height: 30px;
//   color: var(--mainBlue);
//   border: 2px solid var(--mainBlue);
//   background: white;
//   border-radius: 5px;
// `;

const Button33 = styled.button`
  flex-basis: ${(props) => (props.alpha ? "20%" : "28%")};
  height: 30px;
  color: ${(props) =>
    props.alpha || props.transition ? "white" : "var(--mainBlue)"};
  border: 2px solid var(--mainBlue);
  border-radius: 5px;
  background: ${(props) =>
    props.alpha || props.transition ? "var(--mainBlue)" : "white"};
`;

const Button44 = styled.button`
  flex-basis: 24%;
  height: 30px;
  color: var(--mainBlue);
  border: 2px solid var(--mainBlue);
  border-radius: 5px;
  background: white;
`;

const White15Button = styled.button`
  flex-basis: 14%;
  margin: 1px;
  height: 30px;
  background: ${(props) => (props.lowercase ? "white" : "var(--mainBlue)")};
  border: ${(props) =>
    props.lowercase ? "2px solid var(--mainBlue)" : "none"};
  color: ${(props) => (props.lowercase ? "var(--mainBlue)" : "white")};
  border-radius: 5px;
`;

const CursorButton = styled.button`
  flex-basis: 18%;
  height: 30px;
  background: var(--mainBlue);
  border: none;
  color: white;
  border-radius: 5px;
`;

const DeleteButton = styled.button`
  flex-basis: 18%;
  height: 30px;
  background: var(--mainBlue);
  border: none;
  color: white;
  border-radius: 5px;
`;

const EnterButton = styled.button`
  flex-basis: 18%;
  height: 30px;
  background: var(--mainBlue);
  border: none;
  color: white;
  border-radius: 5px;
`;

const SpaceButton = styled.button`
  flex-basis: 49%;
  margin: 1px;
  height: 30px;
  background: white;
  border: 2px solid var(--mainBlue);
  color: var(--mainBlue);
  border-radius: 5px;
`;

const White20Button = styled.button`
  flex-basis: 19%;
  margin: 1px;
  height: 30px;
  background: var(--mainBlue);
  border: none;
  color: white;
  border-radius: 5px;
`;

const LetterButton = styled.button`
  flex-basis: 9.5%;
  margin: 1px;
  height: 30px;
  color: ${(props) => (props.transition ? "white" : "var(--mainBlue)")};
  border: ${(props) =>
    props.transition ? "none" : "2px solid var(--mainBlue)"};
  background: ${(props) => (props.transition ? "var(--mainBlue)" : "white")};
  border-radius: 5px;
`;

export default function VirtualKeyboard() {
  const [toggleLetters, setToggleLetters] = useState(false);
  const [toggleABCCase, setToggleABCCase] = useState(false);
  const [toggleGreekCase, setToggleGreekCase] = useState(false);
  const [toggleFn, setToggleFn] = useState(0);
  const [toggleNumpad, setToggleNumpad] = useState(0);
  const callback = useRecoilValue(focusedMathField);
  const returncallback = useRecoilValue(focusedMathFieldReturn);
  const setPalletRef = useSetRecoilState(palletRef);
  const containerRef = useRef(null);
  const addToast = useToast();

  useEffect(() => {
    setPalletRef({ ...containerRef });
    //console.log(">>> ref: ", containerRef, toggleButtonRef, functionTabRef)
    setToggleFn(0);
    // setToggleGreek(0);
    setToggleNumpad(0);
  }, [toggleLetters, setPalletRef]);

  const handleToggleLetters = () => {
    setToggleLetters(!toggleLetters);
  };

  const handleToggleABCCase = () => {
    setToggleABCCase(!toggleABCCase);
  };

  const handleToggleGreekCase = () => {
    setToggleGreekCase(!toggleGreekCase);
  };

  const handleFnToggle = (val) => {
    setToggleFn(val);
  };

  const handleNumpadToggle = (val) => {
    setToggleNumpad(val);
  };

  /* Keyboard component styling starts HERE */

  function LetterButton(letter) {
    return (
      <Button
        flexBasis="9.5%"
        variant="outline"
        onClick={() => callback("write " + letter)}
      >
        {letter}
      </Button>
    );
  }
  function GreekLetterButton(letter) {
    return (
      <Button
        flexBasis="9.5%"
        variant="outline"
        onClick={() => callback("write \\" + letter)}
      >
        <MathJax dynamic>\(\{letter}\)</MathJax>
      </Button>
    );
  }
  function NumberButton(number, action) {
    // write ___
    return (
      <Button variant="outline" onClick={() => callback("write " + number)}>
        <MathJax dynamic>{action}</MathJax>
      </Button>
    );
  }
  function SymbolButton(symbol, action) {
    // type ___
    return (
      <Button variant="outline" onClick={() => callback("type " + symbol)}>
        <MathJax dynamic>\(\{action}\)</MathJax>
      </Button>
    );
  }
  function MathButton(input, action) {
    // cmd ___
    return (
      <Button variant="outline" onClick={() => callback("cmd " + input)}>
        <MathJax dynamic>\(\{action}\)</MathJax>
      </Button>
    );
  }
  function CustomButton(onClickHandler, action) {
    return (
      <Button variant="outline" onClick={onClickHandler}>
        <MathJax dynamic>{action}</MathJax>
      </Button>
    );
  }
  function SpaceBar() {
    return (
      <Button
        flexBasis="49%"
        variant="outline"
        onClick={() => callback("write \\ ")}
      >
        {" "}
      </Button>
    );
  }
  function LetterTransitionButton(onClickHandler, icon) {
    return (
      <Button flexBasis="15%" variant="solid" onClick={onClickHandler}>
        <FontAwesomeIcon icon={icon} />
      </Button>
    );
  }
  function LetterArrowButton(onClickHandler, icon) {
    return (
      <Button flexBasis="9.5%" variant="solid" onClick={onClickHandler}>
        {icon}
      </Button>
    );
  }

  // const Box = defineStyleConfig({
  //   variants: {
  //     outerKeyboardDiv: {
  //       ref: { containerRef },
  //       // height="240px"
  //       bottom: "0",
  //       left: "0",
  //       width: "100%",
  //       /* background-color: var(--canvas); */
  //       /* color: var(--canvas); */
  //       display: "flex",
  //       flexDirection: "row",
  //       textAlign: "center",
  //       justifyContent: "center",
  //     },
  //     innerKeyboardDiv: {
  //       height: "150px",
  //       maxWidth: "600px",
  //       flexBasis: "90%",
  //       marginLeft: "5px",
  //       marginRight: "5px",
  //       marginTop: "auto",
  //       marginBottom: "auto",
  //       display: "flex",
  //       flexWrap: "wrap",
  //       justifyContent: "space-evenly",
  //     },
  //   },
  // });

  // if (toggleLetters) {
  // if (toggleCase) {
  let sectionUpperABC = (
    <Box
      ref={containerRef}
      // height="240px"
      bottom="0"
      left="0"
      width="100%"
      /* background-color: var(--canvas); */
      /* color: var(--canvas); */
      display="flex"
      flexDirection="row"
      textAlign="center"
      justifyContent="center"
    >
      <Box
        height="150px"
        maxWidth="700px"
        flexBasis="90%"
        marginLeft="5px"
        marginRight="5px"
        marginTop="auto"
        marginBottom="auto"
        display="flex"
        flexWrap="wrap"
        justifyContent="space-evenly"
      >
        {LetterButton("Q")}
        {LetterButton("W")}
        {LetterButton("E")}
        {LetterButton("R")}
        {LetterButton("T")}
        {LetterButton("Y")}
        {LetterButton("U")}
        {LetterButton("I")}
        {LetterButton("O")}
        {LetterButton("P")}
        {LetterButton("A")}
        {LetterButton("S")}
        {LetterButton("D")}
        {LetterButton("F")}
        {LetterButton("G")}
        {LetterButton("H")}
        {LetterButton("J")}
        {LetterButton("K")}
        {LetterButton("L")}
        {LetterTransitionButton(handleToggleABCCase, faArrowUp)}
        {LetterButton("Z")}
        {LetterButton("X")}
        {LetterButton("C")}
        {LetterButton("V")}
        {LetterButton("B")}
        {LetterButton("N")}
        {LetterButton("M")}
        {LetterTransitionButton(
          () => callback("keystroke Backspace"),
          faBackspace,
        )}
        {LetterButton(",")}
        {LetterButton("'")}
        {SpaceBar()}
        {LetterArrowButton(
          () => callback("keystroke Left"),
          <MathJax dynamic>\(\leftarrow\)</MathJax>,
        )}
        {LetterArrowButton(
          () => callback("keystroke Right"),
          <MathJax dynamic>\(\rightarrow\)</MathJax>,
        )}
        {LetterArrowButton(() => returncallback(), "Enter")}
      </Box>
    </Box>
  );

  let sectionLowerABC = (
    <Box
      ref={containerRef}
      // height="240px"
      bottom="0"
      left="0"
      width="100%"
      /* background-color: var(--canvas); */
      /* color: var(--canvas); */
      display="flex"
      flexDirection="row"
      textAlign="center"
      justifyContent="center"
    >
      <Box
        height="150px"
        maxWidth="700px"
        flexBasis="90%"
        marginLeft="5px"
        marginRight="5px"
        marginTop="auto"
        marginBottom="auto"
        display="flex"
        flexWrap="wrap"
        justifyContent="space-evenly"
      >
        {LetterButton("q")}
        {LetterButton("w")}
        {LetterButton("e")}
        {LetterButton("r")}
        {LetterButton("t")}
        {LetterButton("y")}
        {LetterButton("u")}
        {LetterButton("i")}
        {LetterButton("o")}
        {LetterButton("p")}
        {LetterButton("a")}
        {LetterButton("s")}
        {LetterButton("d")}
        {LetterButton("f")}
        {LetterButton("g")}
        {LetterButton("h")}
        {LetterButton("j")}
        {LetterButton("k")}
        {LetterButton("l")}
        {LetterTransitionButton(handleToggleABCCase, faArrowUp)}
        {LetterButton("z")}
        {LetterButton("x")}
        {LetterButton("c")}
        {LetterButton("v")}
        {LetterButton("b")}
        {LetterButton("n")}
        {LetterButton("m")}
        {LetterTransitionButton(
          () => callback("keystroke Backspace"),
          faBackspace,
        )}
        {LetterButton(",")}
        {LetterButton("'")}
        {SpaceBar()}
        {LetterArrowButton(
          () => callback("keystroke Left"),
          <MathJax dynamic>\(\leftarrow\)</MathJax>,
        )}
        {LetterArrowButton(
          () => callback("keystroke Right"),
          <MathJax dynamic>\(\rightarrow\)</MathJax>,
        )}
        {LetterArrowButton(() => returncallback(), "Enter")}
      </Box>
    </Box>
  );

  let sectionSymbols1 = (
    <SimpleGrid columns={5} spacing={2} margin="4px">
      {MathButton("{", `{`)}
      {MathButton("}", `}`)}
      {LetterButton(",", ",")}
      {LetterButton(":", ":")}
      {CustomButton(() => callback("write \\vert"), `\\(\\vert\\)`)}
      {CustomButton(() => callback("write \\subset"), "\\(\\subset\\)")}
      {CustomButton(() => callback("write \\subseteq"), "\\(\\subseteq\\)")}
      {CustomButton(() => callback("write \\neq"), "\\(\\neq\\)")}
      {CustomButton(() => callback("write \\in"), "\\(\\in\\)")}
      {CustomButton(() => callback("write \\infty"), "\\(\\infty\\)")}
      {CustomButton(() => callback("cmd ("), `\\((\\)`)}
      {CustomButton(() => callback("cmd )"), `\\()\\)`)}
      {CustomButton(() => callback("cmd ["), `[`)}
      {CustomButton(() => callback("cmd ]"), `]`)}
      {CustomButton(() => callback("write \\emptyset"), "\\(\\emptyset\\)")}
      {/* <Button onClick={() => callback('write \\mathbb{N}')}>
          <MathJax dynamic>{`\\(\\mathbb{N}\\)`}</MathJax>
        </Button>
        <Button onClick={() => callback('write \\mathbb{Z}')}>
          <MathJax dynamic>{`\\(\\mathbb{Z}\\)`}</MathJax>
        </Button>
        <Button onClick={() => callback('write \\mathbb{Q}')}>
          <MathJax dynamic>{`\\(\\mathbb{Q}\\)`}</MathJax>
        </Button>
        <Button onClick={() => callback('write \\mathbb{R}')}>
          <MathJax dynamic>{`\\(\\mathbb{R}\\)`}</MathJax>
        </Button>
        <Button onClick={() => callback('write \\mathbb{C}')}>
          <MathJax dynamic>{`\\(\\mathbb{C}\\)`}</MathJax>
        </Button> */}
    </SimpleGrid>
  );

  let sectionSymbols2 = (
    <SimpleGrid columns={5} spacing={2} margin="4px">
      {CustomButton(() => {
        callback("write \\vec{}");
        callback("keystroke Left");
      }, `\\(\\vec{a}\\)`)}
      {MathButton("\\langle", `langle`)}
      {MathButton("\\rangle", `rangle`)}
      {CustomButton(() => callback("write \\cdot"), `\\(\\cdot\\)`)}
      {CustomButton(() => callback("write \\times"), `\\(\\times\\)`)}
      {MathButton("\\overline", `overline{a}`)}
      {CustomButton(() => callback("write \\perp"), `\\(\\perp\\)`)}
      {CustomButton(() => callback("write \\times"), `\\(\\parallel\\)`)}
      {CustomButton(() => callback("write \\angle"), `\\(\\angle\\)`)}
      {CustomButton(() => callback("write {}^\\circ"), `\\({a}^\\circ\\)`)}
      {CustomButton(() => callback("write \\exists"), `\\(\\exists\\)`)}
      {CustomButton(() => callback("write \\forall"), `\\(\\forall\\)`)}
      {LetterButton("%")}
      {LetterButton("$")}
      {LetterTransitionButton(
        () => callback("keystroke Backspace"),
        faBackspace,
      )}
      {CustomButton(() => callback("cmd _"), `\\(a_b\\)`)}

      {/* <Button onClick={() => callback('write \\neg')}>
          <MathJax dynamic>{`\\(\\neg\\)`}</MathJax>
        </Button> */}
      {LetterArrowButton(
        () => callback("keystroke Left"),
        <MathJax dynamic>\(\leftarrow\)</MathJax>,
      )}
      {LetterArrowButton(
        () => callback("keystroke Right"),
        <MathJax dynamic>\(\rightarrow\)</MathJax>,
      )}
      {LetterArrowButton(() => returncallback(), "Enter")}
    </SimpleGrid>
  );

  let sectionTrig1 = (
    <SimpleGrid columns={4} spacing={2} margin="4px">
      {SymbolButton("sin(", `sin`)}
      {SymbolButton("cos(", `cos`)}
      {SymbolButton("tan(", `tan`)}
      {CustomButton(() => {
        callback("write \\sin^{-1}");
        callback("type (");
      }, `\\(\\sin^{-1}\\)`)}
      {CustomButton(() => {
        callback("write \\cos^{-1}");
        callback("type (");
      }, `\\(\\cos^{-1}\\)`)}
      {CustomButton(() => {
        callback("write \\tan^{-1}");
        callback("type (");
      }, `\\(\\tan^{-1}\\)`)}
      {SymbolButton("ln(", `ln`)}
      {CustomButton(() => {
        callback("write \\log_{}");
        callback("keystroke Left");
      }, `\\(\\log_b\\)`)}
      {CustomButton(() => callback("write \\log_{10}"), `\\(\\log_{10}\\)`)}
      {CustomButton(() => {
        callback("write e^{}");
        callback("keystroke Left");
      }, `\\(e^{a}\\)`)}
      {CustomButton(() => {
        callback("write 10^{}");
        callback("keystroke Left");
      }, `\\(10^{a}\\)`)}
      {CustomButton(() => {
        callback("write \\sqrt[]{}");
        callback("keystroke Left");
        callback("keystroke Left");
      }, `\\(\\sqrt[b]{a}\\)`)}
    </SimpleGrid>
  );
  let sectionFx = (
    <SimpleGrid columns={4} spacing={2} margin="4px">
      {CustomButton(() => {
        callback("write \\frac{d}{dx}");
      }, `\\(\\frac{d}{dx}\\)`)}
      {/* <Button33 onClick={() => callback('write \\int')}>
          <MathJax dynamic>\(\int\)</MathJax>
        </Button33> */}
      {CustomButton(() => {
        callback("write \\int_{}^{}");
        callback("keystroke Left");
        callback("keystroke Left");
      }, `\\(\\int_{a}^{b}\\)`)}
      {SymbolButton("nPr(", `operatorname{nPr}`)}
      {SymbolButton("nCr(", `operatorname{nCr}`)}
      {LetterButton("!", "!")}
      {CustomButton(() => {
        callback("write \\lfloor");
        callback("write \\rfloor");
        callback("keystroke Left");
      }, `\\(\\lfloor{a}\\rfloor\\)`)}
      {CustomButton(() => {
        callback("write \\lceil");
        callback("write \\rceil");
        callback("keystroke Left");
      }, `\\(\\lceil{a}\\rceil\\)`)}
      {LetterTransitionButton(
        () => callback("keystroke Backspace"),
        faBackspace,
      )}
      {LetterArrowButton(
        () => callback("keystroke Left"),
        <MathJax dynamic>\(\leftarrow\)</MathJax>,
      )}
      {LetterArrowButton(
        () => callback("keystroke Right"),
        <MathJax dynamic>\(\rightarrow\)</MathJax>,
      )}
      {LetterArrowButton(() => returncallback(), "Enter")}
    </SimpleGrid>
  );
  let sectionUpperGreek = (
    <Box
      ref={containerRef}
      // height="240px"
      bottom="0"
      left="0"
      width="100%"
      /* background-color: var(--canvas); */
      /* color: var(--canvas); */
      display="flex"
      flexDirection="row"
      textAlign="center"
      justifyContent="center"
    >
      <Box
        height="150px"
        maxWidth="700px"
        flexBasis="90%"
        marginLeft="5px"
        marginRight="5px"
        marginTop="auto"
        marginBottom="auto"
        display="flex"
        flexWrap="wrap"
        justifyContent="space-evenly"
      >
        {GreekLetterButton("Phi")}
        {GreekLetterButton("Sigma")}
        {LetterButton("E")}
        {LetterButton("P")}
        {LetterButton("T")}
        {LetterButton("Y")}
        {GreekLetterButton("Theta")}
        {LetterButton("I")}
        {LetterButton("O")}
        {GreekLetterButton("Pi")}
        {LetterButton("A")}
        {GreekLetterButton("Sigma")}
        {GreekLetterButton("Delta")}
        {GreekLetterButton("Phi")}
        {GreekLetterButton("Gamma")}
        {LetterButton("H")}
        {GreekLetterButton("Xi")}
        {LetterButton("K")}
        {GreekLetterButton("Lambda")}
        {LetterTransitionButton(handleToggleGreekCase, faArrowUp)}
        {LetterButton("Z")}
        {LetterButton("X")}
        {GreekLetterButton("Psi")}
        {GreekLetterButton("Omega")}
        {LetterButton("B")}
        {LetterButton("N")}
        {LetterButton("M")}
        {LetterTransitionButton(
          () => callback("keystroke Backspace"),
          faBackspace,
        )}
        {LetterButton(",")}
        {LetterButton("'")}
        {SpaceBar()}
        {LetterArrowButton(
          () => callback("keystroke Left"),
          <MathJax dynamic>\(\leftarrow\)</MathJax>,
        )}
        {LetterArrowButton(
          () => callback("keystroke Right"),
          <MathJax dynamic>\(\rightarrow\)</MathJax>,
        )}
        {LetterArrowButton(() => returncallback(), "Enter")}
      </Box>
    </Box>
  );

  let sectionLowerGreek = (
    <Box
      ref={containerRef}
      // height="240px"
      bottom="0"
      left="0"
      width="100%"
      /* background-color: var(--canvas); */
      /* color: var(--canvas); */
      display="flex"
      flexDirection="row"
      textAlign="center"
      justifyContent="center"
    >
      <Box
        height="150px"
        maxWidth="700px"
        flexBasis="90%"
        marginLeft="5px"
        marginRight="5px"
        marginTop="auto"
        marginBottom="auto"
        display="flex"
        flexWrap="wrap"
        justifyContent="space-evenly"
      >
        {GreekLetterButton("phi")}
        {GreekLetterButton("varsigma")}
        {GreekLetterButton("epsilon")}
        {GreekLetterButton("rho")}
        {GreekLetterButton("tau")}
        {GreekLetterButton("upsilon")}
        {GreekLetterButton("theta")}
        {GreekLetterButton("iota")}
        {LetterButton("o")}
        {GreekLetterButton("pi")}
        {GreekLetterButton("alpha")}
        {GreekLetterButton("sigma")}
        {GreekLetterButton("delta")}
        {GreekLetterButton("varphi")}
        {GreekLetterButton("gamma")}
        {GreekLetterButton("eta")}
        {GreekLetterButton("xi")}
        {GreekLetterButton("kappa")}
        {GreekLetterButton("lambda")}
        {LetterTransitionButton(handleToggleGreekCase, faArrowUp)}
        {GreekLetterButton("zeta")}
        {GreekLetterButton("chi")}
        {GreekLetterButton("psi")}
        {GreekLetterButton("omega")}
        {GreekLetterButton("beta")}
        {GreekLetterButton("nu")}
        {GreekLetterButton("mu")}
        {LetterTransitionButton(
          () => callback("keystroke Backspace"),
          faBackspace,
        )}
        {LetterButton(",")}
        {LetterButton("'")}
        {SpaceBar()}
        {LetterArrowButton(
          () => callback("keystroke Left"),
          <MathJax dynamic>\(\leftarrow\)</MathJax>,
        )}
        {LetterArrowButton(
          () => callback("keystroke Right"),
          <MathJax dynamic>\(\rightarrow\)</MathJax>,
        )}
        {LetterArrowButton(() => returncallback(), "Enter")}
      </Box>
    </Box>
  );

  let sectionXYZ = (
    <SimpleGrid columns={4} spacing={2} margin="4px">
      {NumberButton("x", `\\(x\\)`)}
      {NumberButton("y", `\\(y\\)`)}
      {NumberButton("\\pi", `\\(\\pi\\)`)}
      {NumberButton("e", `\\(e\\)`)}
      {CustomButton(() => {
        callback("type ^2");
        callback("keystroke Right");
      }, `\\(a^2\\)`)}
      {CustomButton(() => callback("cmd ^"), `\\(a^b\\)`)}
      {CustomButton(() => callback("type sqrt"), `\\(\\sqrt{a}\\)`)}
      {CustomButton(() => {
        callback("cmd |");
        callback("cmd |");
        callback("keystroke Left");
      }, `\\(|a|\\)`)}
      {NumberButton("<", `\\(<\\)`)}
      {NumberButton(">", `\\(>\\)`)}
      {SymbolButton("<=", `leq`)}
      {SymbolButton(">=", `geq`)}
      {NumberButton(",", `\\(,\\)`)}
      {CustomButton(() => callback("cmd ("), `\\((\\)`)}
      {CustomButton(() => callback("cmd )"), `\\()\\)`)}
    </SimpleGrid>
  );

  let section123 = (
    <SimpleGrid columns={5} spacing={2} margin="4px">
      {NumberButton(7, `\\(7\\)`)}
      {NumberButton(8, `\\(8\\)`)}
      {NumberButton(9, `\\(9\\)`)}
      {SymbolButton("*", "times")}
      {MathButton("/", "div")}
      {NumberButton(4, `\\(4\\)`)}
      {NumberButton(5, `\\(5\\)`)}
      {NumberButton(6, `\\(6\\)`)}
      {NumberButton("+", "+")}
      {NumberButton("-", "-")}
      {/* <Button variant="outline" onClick={() => callback("cmd -")}>
        <MathJax dynamic>\(-\)</MathJax>
      </Button> */}
      {NumberButton(1, `\\(1\\)`)}
      {NumberButton(2, `\\(2\\)`)}
      {NumberButton(3, `\\(3\\)`)}
      {NumberButton("=", "=")}
      {LetterTransitionButton(
        () => callback("keystroke Backspace"),
        faBackspace,
      )}
      {NumberButton(0, `\\(0\\)`)}
      {NumberButton(".", ".")}
      {LetterArrowButton(
        () => callback("keystroke Left"),
        <MathJax dynamic>\(\leftarrow\)</MathJax>,
      )}
      {LetterArrowButton(
        () => callback("keystroke Right"),
        <MathJax dynamic>\(\rightarrow\)</MathJax>,
      )}
      {LetterArrowButton(() => returncallback(), "Enter")}
    </SimpleGrid>
  );

  function MathKeyboard() {
    const keyboardBtnRef = useRef(null);

    const {
      isOpen: keyboardIsOpen,
      // onOpen: keyboardOnOpen,
      onClose: keyboardOnClose,
      onToggle: keyboardOnToggle,
    } = useDisclosure();

    return (
      <Slide direction="bottom" in={keyboardIsOpen} style={{ zIndex: 10 }}>
        <Box
          p="4px"
          mt="4"
          bg="doenet.canvas"
          borderTop="1px"
          borderTopColor="doenet.mediumGray"
        >
          <Tooltip hasArrow label="Open Keyboard">
            <IconButton
              position="absolute"
              left="10px"
              size="md"
              roundedBottom="0px"
              height="24px"
              width="50px"
              top={keyboardIsOpen ? "-8px" : "-24px"}
              variant="ghost"
              // variant="outline"
              icon={<FaKeyboard />}
              onClick={keyboardOnToggle}
              ref={keyboardBtnRef}
              background="doenet.canvas"
            />
          </Tooltip>

          <IconButton
            position="absolute"
            top="20px"
            right="6px"
            size="sm"
            icon={<CloseIcon />}
            variant="ghost"
            onClick={keyboardOnClose}
          />
          <Center tabIndex="0" ref={containerRef}>
            <Tabs>
              <TabList>
                <Tab>123</Tab>
                <Tab>f(x)</Tab>
                <Tab>ABC</Tab>
                <Tab>αβγ</Tab>
                <Tab>$%∞</Tab>
              </TabList>

              <TabPanels>
                <TabPanel>
                  <Flex variant="keyboardSection">
                    {sectionXYZ}
                    {section123}
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <Flex variant="keyboardSection">
                    {sectionTrig1}
                    {sectionFx}
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <Flex variant="keyboardSection">
                    {toggleABCCase ? sectionUpperABC : sectionLowerABC}
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <Flex variant="keyboardSection">
                    {toggleGreekCase ? sectionUpperGreek : sectionLowerGreek}
                  </Flex>
                </TabPanel>
                <TabPanel>
                  <Flex variant="keyboardSection">
                    {sectionSymbols1}
                    {sectionSymbols2}
                  </Flex>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Center>
        </Box>
      </Slide>
    );
  }

  return (
    // Kevin, remove everything here except the <MathKeyboard /> line
    <>
      <MathKeyboard />
      <Center tabIndex="0" ref={containerRef}>
        <Tabs>
          <TabList>
            <Tab>123</Tab>
            <Tab>f(x)</Tab>
            <Tab>ABC</Tab>
            <Tab>αβγ</Tab>
            <Tab>$%∞</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Flex variant="keyboardSection">
                {sectionXYZ}
                {section123}
              </Flex>
            </TabPanel>
            <TabPanel>
              <Flex variant="keyboardSection">
                {sectionTrig1}
                {sectionFx}
              </Flex>
            </TabPanel>
            <TabPanel>
              <Flex variant="keyboardSection">
                {toggleABCCase ? sectionUpperABC : sectionLowerABC}
              </Flex>
            </TabPanel>
            <TabPanel>
              <Flex variant="keyboardSection">
                {toggleGreekCase ? sectionUpperGreek : sectionLowerGreek}
              </Flex>
            </TabPanel>
            <TabPanel>
              <Flex variant="keyboardSection">
                {sectionSymbols1}
                {sectionSymbols2}
              </Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Center>
    </>
  );
}
