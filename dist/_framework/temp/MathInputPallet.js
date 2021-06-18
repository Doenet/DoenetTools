import React, {useState, useEffect} from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import MathJax from "../../_snowpack/pkg/react-mathjax.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import {
  faLevelDownAlt,
  faBackspace,
  faKeyboard,
  faArrowUp
} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {useRecoilValue, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import {focusedMathField, palletRef, buttonRef, functionRef} from "./MathInputSelector.js";
import {useRef} from "../../_snowpack/pkg/react.js";
const FunctionPanel = styled.div`
  height: 250px;
  width: 250px;
  background-color: #e2e2e2;
  position: fixed;
  bottom: 247px;
  right: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;
const TabHeader = styled.button`
  flex-basis: 33%;
  height: 30px;
  background: #e2e2e2;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  border-bottom: ${(props) => props.selected ? "0.5px solid gray" : "0"};
  border-radius: 0px;
`;
const Panel = styled.div`
  height: 250px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #e2e2e2;
  color: white;
  text-align: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
const Section = styled.div`
  height: 150px;
  min-width: 100px;
  max-width: 300px;
  margin-left: 5px;
  margin-right: 5px;
  /* border: 0.5px solid gray; */
  margin-top: auto;
  margin-bottom: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;
const LettersSection = styled.div`
  height: 150px;
  /* min-width: 100px; */
  max-width: 700px;
  flex-basis: 90%;
  margin-left: 5px;
  margin-right: 5px;
  /* border: 0.5px solid gray; */
  margin-top: auto;
  margin-bottom: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;
const Button = styled.button`
  flex-basis: 23%;
  height: 30px;
  background: white;
  border: 0;
  border-radius: 3px;
`;
const Button33 = styled.button`
  flex-basis: 30%;
  margin: 2px;
  height: 25px;
  background: white;
  border: 0;
  border-radius: 3px;
`;
const GrayButton = styled.button`
  flex-basis: 23%;
  height: 30px;
  background: darkgray;
  border: 0;
  border-radius: 3px;
`;
const Gray15Button = styled.button`
  flex-basis: 14%;
  margin: 1px;
  height: 30px;
  background: darkgray;
  border: 0;
  border-radius: 3px;
`;
const Gray20Button = styled.button`
  flex-basis: 19%;
  margin: 1px;
  height: 30px;
  background: darkgray;
  border: 0;
  border-radius: 3px;
`;
const CursorButton = styled.button`
  flex-basis: 45%;
  height: 30px;
  background: darkgray;
  border: 0;
  border-radius: 3px;
`;
const DeleteButton = styled.button`
  flex-basis: 90%;
  height: 30px;
  background: darkgray;
  border: 0;
  border-radius: 3px;
`;
const BlueButton = styled.button`
  flex-basis: 90%;
  height: 30px;
  background: #167ac1;
  border: 0;
  border-radius: 3px;
`;
const Blue20Button = styled.button`
  flex-basis: 19%;
  margin: 1px;
  height: 30px;
  background: #167ac1;
  border: 0;
  border-radius: 3px;
`;
const LetterButton = styled.button`
  flex-basis: 9%;
  margin: 1px;
  height: 30px;
  background: white;
  /* background: #167ac1; */
  border: 0;
  border-radius: 3px;
`;
const ToggleButton = styled.button`
  height: 50px;
  position: fixed;
  bottom: ${(props) => props.toggleState ? "247px" : "5px"};
  left: 0;
  width: 50px;
  background-color: #e2e2e2;
  border: 0;
  border-radius: 3px;
`;
export default function VirtualKeyboard() {
  const [toggleKeyboard, setToggleKeyboard] = useState(false);
  const [toggleLetters, setToggleLetters] = useState(false);
  const [toggleFunctions, setToggleFunctions] = useState(false);
  const [toggleCase, setToggleCase] = useState(false);
  const [selectedTab, setSelectedTab] = useState("Trig");
  const callback = useRecoilValue(focusedMathField);
  const setPalletRef = useSetRecoilState(palletRef);
  const setButtonRef = useSetRecoilState(buttonRef);
  const setFunctionRef = useSetRecoilState(functionRef);
  const containerRef = useRef(null);
  const toggleButtonRef = useRef(null);
  const functionTabRef = useRef(null);
  useEffect(() => {
    setPalletRef({...containerRef});
    setButtonRef({...toggleButtonRef});
    setFunctionRef({...functionTabRef});
  }, [toggleKeyboard, toggleLetters, toggleFunctions, toggleCase, selectedTab]);
  const handleToggleKeyboard = () => {
    setToggleFunctions(toggleKeyboard ? false : toggleFunctions);
    setToggleKeyboard(!toggleKeyboard);
  };
  const handleToggleLetters = () => {
    setToggleLetters(!toggleLetters);
  };
  const handleToggleCase = () => {
    setToggleCase(!toggleCase);
  };
  const handleToggleFunctions = () => {
    setToggleFunctions(!toggleFunctions);
  };
  const handleTabSelection = (e) => {
    setSelectedTab(e.target.value);
  };
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(MathJax.Provider, null, /* @__PURE__ */ React.createElement(ToggleButton, {
    ref: toggleButtonRef,
    toggleState: toggleKeyboard,
    onClick: handleToggleKeyboard
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faKeyboard
  })), toggleFunctions ? /* @__PURE__ */ React.createElement(FunctionPanel, {
    tabIndex: "0",
    ref: functionTabRef
  }, /* @__PURE__ */ React.createElement(TabHeader, {
    onClick: handleTabSelection,
    value: "Trig",
    selected: selectedTab === "Trig"
  }, "Trig"), /* @__PURE__ */ React.createElement(TabHeader, {
    onClick: handleTabSelection,
    value: "Stat",
    selected: selectedTab === "Stat"
  }, "Stat"), /* @__PURE__ */ React.createElement(TabHeader, {
    onClick: handleTabSelection,
    value: "Misc",
    selected: selectedTab === "Misc"
  }, "Misc"), selectedTab === "Trig" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button33, {
    onClick: () => callback("cmd \\sin")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "\\sin"
  })), /* @__PURE__ */ React.createElement(Button33, {
    onClick: () => callback("write \\sin^{-1}")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "\\sin^{-1}"
  })), /* @__PURE__ */ React.createElement(Button33, {
    onClick: () => callback("cmd \\sinh")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "\\sinh"
  })), /* @__PURE__ */ React.createElement(Button33, {
    onClick: () => callback("cmd \\tan")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "\\tan"
  })), /* @__PURE__ */ React.createElement(Button33, {
    onClick: () => callback("write \\tan^{-1}")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "\\tan^{-1}"
  })), /* @__PURE__ */ React.createElement(Button33, {
    onClick: () => callback("cmd \\tanh")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "\\tanh"
  })), /* @__PURE__ */ React.createElement(Button33, {
    onClick: () => callback("cmd \\cos")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "\\cos"
  })), /* @__PURE__ */ React.createElement(Button33, {
    onClick: () => callback("write \\cos^{-1}")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "\\cos^{-1}"
  })), /* @__PURE__ */ React.createElement(Button33, {
    onClick: () => callback("cmd \\cosh")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "\\cosh"
  })), /* @__PURE__ */ React.createElement(Button33, {
    onClick: () => callback("cmd \\csc")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "\\csc"
  })), /* @__PURE__ */ React.createElement(Button33, {
    onClick: () => callback("write \\csc^{-1}")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "\\csc^{-1}"
  })), /* @__PURE__ */ React.createElement(Button33, {
    onClick: () => callback("cmd \\csch")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "csch"
  })), /* @__PURE__ */ React.createElement(Button33, {
    onClick: () => callback("cmd \\cot")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "\\cot"
  })), /* @__PURE__ */ React.createElement(Button33, {
    onClick: () => callback("write \\cot^{-1}")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "\\cot^{-1}"
  })), /* @__PURE__ */ React.createElement(Button33, {
    onClick: () => callback("cmd \\coth")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "\\coth"
  })), /* @__PURE__ */ React.createElement(Button33, {
    onClick: () => callback("cmd \\sec")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "\\sec"
  })), /* @__PURE__ */ React.createElement(Button33, {
    onClick: () => callback("write \\sec^{-1}")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "\\sec^{-1}"
  })), /* @__PURE__ */ React.createElement(Button33, {
    onClick: () => callback("cmd \\sech")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "sech"
  }))) : selectedTab === "Stat" ? /* @__PURE__ */ React.createElement(Button, null, "mean") : /* @__PURE__ */ React.createElement(Button, null, "ceil")) : null, toggleKeyboard ? toggleLetters ? toggleCase ? /* @__PURE__ */ React.createElement(Panel, {
    tabIndex: "0",
    ref: containerRef
  }, /* @__PURE__ */ React.createElement(LettersSection, null, /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write Q")
  }, "Q"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write W")
  }, "W"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write E")
  }, "E"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write R")
  }, "R"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write T")
  }, "T"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write Y")
  }, "Y"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write U")
  }, "U"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write I")
  }, "I"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write O")
  }, "O"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write P")
  }, "P"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write A")
  }, "A"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write S")
  }, "S"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write D")
  }, "D"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write F")
  }, "F"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write G")
  }, "G"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write H")
  }, "H"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write J")
  }, "J"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write K")
  }, "K"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write L")
  }, "L"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write \\tau")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "\\tau"
  })), /* @__PURE__ */ React.createElement(Gray15Button, {
    onClick: handleToggleCase
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faArrowUp
  })), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write Z")
  }, "Z"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write X")
  }, "X"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write C")
  }, "C"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write V")
  }, "V"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write B")
  }, "B"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write N")
  }, "N"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write M")
  }, "M"), /* @__PURE__ */ React.createElement(Gray15Button, {
    onClick: () => callback("keystroke Backspace")
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faBackspace
  })), /* @__PURE__ */ React.createElement(Gray20Button, {
    onClick: handleToggleLetters
  }, "123"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("cmd ^")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "a^b"
  })), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write %")
  }, "%"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("cmd ]")
  }, "]"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("cmd }")
  }, `}`), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write :")
  }, ":"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write '")
  }, "'"), /* @__PURE__ */ React.createElement(Blue20Button, null, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faLevelDownAlt,
    transform: {rotate: 90}
  })))) : /* @__PURE__ */ React.createElement(Panel, {
    tabIndex: "0",
    ref: containerRef
  }, /* @__PURE__ */ React.createElement(LettersSection, null, /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write q")
  }, "q"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write w")
  }, "w"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write e")
  }, "e"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write r")
  }, "r"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write t")
  }, "t"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write y")
  }, "y"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write u")
  }, "u"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write i")
  }, "i"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write o")
  }, "o"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write p")
  }, "p"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write a")
  }, "a"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write s")
  }, "s"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write d")
  }, "d"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write f")
  }, "f"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write g")
  }, "g"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write h")
  }, "h"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write j")
  }, "j"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write k")
  }, "k"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write l")
  }, "l"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write \\theta")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "\\theta"
  })), /* @__PURE__ */ React.createElement(Gray15Button, {
    onClick: handleToggleCase
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faArrowUp
  })), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write z")
  }, "z"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write x")
  }, "x"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write c")
  }, "c"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write v")
  }, "v"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write b")
  }, "b"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write n")
  }, "n"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write m")
  }, "m"), /* @__PURE__ */ React.createElement(Gray15Button, {
    onClick: () => callback("keystroke Backspace")
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faBackspace
  })), /* @__PURE__ */ React.createElement(Gray20Button, {
    onClick: handleToggleLetters
  }, "123"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("cmd _")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "a_b"
  })), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write !")
  }, "!"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("cmd [")
  }, "["), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("cmd {")
  }, `{`), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write ~")
  }, "~"), /* @__PURE__ */ React.createElement(LetterButton, {
    onClick: () => callback("write ,")
  }, ","), /* @__PURE__ */ React.createElement(Blue20Button, null, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faLevelDownAlt,
    transform: {rotate: 90}
  })))) : /* @__PURE__ */ React.createElement(Panel, {
    tabIndex: "0",
    ref: containerRef
  }, /* @__PURE__ */ React.createElement(Section, null, /* @__PURE__ */ React.createElement(Button, {
    onClick: () => callback("write x")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "x"
  })), /* @__PURE__ */ React.createElement(Button, {
    onClick: () => callback("write y")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "y"
  })), /* @__PURE__ */ React.createElement(Button, {
    onClick: () => callback("type ^2")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "a^2"
  })), /* @__PURE__ */ React.createElement(Button, {
    onClick: () => callback("cmd ^")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "a^b"
  })), /* @__PURE__ */ React.createElement(Button, {
    onClick: () => callback("cmd (")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "("
  })), /* @__PURE__ */ React.createElement(Button, {
    onClick: () => callback("keystroke Right")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: ")"
  })), /* @__PURE__ */ React.createElement(Button, {
    onClick: () => callback("write <")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "<"
  })), /* @__PURE__ */ React.createElement(Button, {
    onClick: () => callback("write >")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: ">"
  })), /* @__PURE__ */ React.createElement(Button, {
    onClick: () => callback("cmd |")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "|a|"
  })), /* @__PURE__ */ React.createElement(Button, {
    onClick: () => callback("write ,")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: ","
  })), /* @__PURE__ */ React.createElement(Button, {
    onClick: () => callback("type <=")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "\\leq"
  })), /* @__PURE__ */ React.createElement(Button, {
    onClick: () => callback("type >=")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "\\geq"
  })), /* @__PURE__ */ React.createElement(GrayButton, {
    onClick: handleToggleLetters
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "ABC"
  })), /* @__PURE__ */ React.createElement(Button, {
    onClick: () => callback("type sqrt")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "\\sqrt{}"
  })), /* @__PURE__ */ React.createElement(Button, {
    onClick: () => callback("type theta")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "\\theta"
  })), /* @__PURE__ */ React.createElement(Button, {
    onClick: () => callback("type pi")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "\\pi"
  }))), /* @__PURE__ */ React.createElement(Section, null, /* @__PURE__ */ React.createElement(GrayButton, {
    onClick: () => callback("write 7")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "7"
  })), /* @__PURE__ */ React.createElement(GrayButton, {
    onClick: () => callback("write 8")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "8"
  })), /* @__PURE__ */ React.createElement(GrayButton, {
    onClick: () => callback("write 9")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "9"
  })), /* @__PURE__ */ React.createElement(Button, {
    onClick: () => callback("cmd /")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "\\div"
  })), /* @__PURE__ */ React.createElement(GrayButton, {
    onClick: () => callback("write 4")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "4"
  })), /* @__PURE__ */ React.createElement(GrayButton, {
    onClick: () => callback("write 5")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "5"
  })), /* @__PURE__ */ React.createElement(GrayButton, {
    onClick: () => callback("write 6")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "6"
  })), /* @__PURE__ */ React.createElement(Button, {
    onClick: () => callback("type *")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "\\times"
  })), /* @__PURE__ */ React.createElement(GrayButton, {
    onClick: () => callback("write 1")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "1"
  })), /* @__PURE__ */ React.createElement(GrayButton, {
    onClick: () => callback("write 2")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "2"
  })), /* @__PURE__ */ React.createElement(GrayButton, {
    onClick: () => callback("write 3")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "3"
  })), /* @__PURE__ */ React.createElement(Button, {
    onClick: () => callback("cmd -")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "-"
  })), /* @__PURE__ */ React.createElement(GrayButton, {
    onClick: () => callback("write 0")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "0"
  })), /* @__PURE__ */ React.createElement(GrayButton, {
    onClick: () => callback("write .")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "."
  })), /* @__PURE__ */ React.createElement(Button, {
    onClick: () => callback("write =")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "="
  })), /* @__PURE__ */ React.createElement(Button, {
    onClick: () => callback("write +")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "+"
  }))), /* @__PURE__ */ React.createElement(Section, null, /* @__PURE__ */ React.createElement(BlueButton, {
    onClick: handleToggleFunctions
  }, "functions"), /* @__PURE__ */ React.createElement(CursorButton, {
    onClick: () => callback("keystroke Left")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "\\leftarrow"
  })), /* @__PURE__ */ React.createElement(CursorButton, {
    onClick: () => callback("keystroke Right")
  }, /* @__PURE__ */ React.createElement(MathJax.Node, {
    inline: true,
    formula: "\\rightarrow"
  })), /* @__PURE__ */ React.createElement(DeleteButton, {
    onClick: () => callback("keystroke Backspace")
  }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faBackspace
  })), /* @__PURE__ */ React.createElement(BlueButton, null, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
    icon: faLevelDownAlt,
    transform: {rotate: 90}
  })))) : null));
}
