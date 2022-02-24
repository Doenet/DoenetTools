import React, {useState, useEffect} from "../../_snowpack/pkg/react.js";
import styled from "../../_snowpack/pkg/styled-components.js";
import MathJax from "../../_snowpack/pkg/react-mathjax.js";
import {FontAwesomeIcon} from "../../_snowpack/pkg/@fortawesome/react-fontawesome.js";
import ToggleButton from "../../_reactComponents/PanelHeaderComponents/ToggleButton.js";
import ToggleButtonGroup from "../../_reactComponents/PanelHeaderComponents/ToggleButtonGroup.js";
import VerticalDivider from "../../_reactComponents/PanelHeaderComponents/VerticalDivider.js";
import {faBackspace, faArrowUp} from "../../_snowpack/pkg/@fortawesome/free-solid-svg-icons.js";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "../../_snowpack/pkg/recoil.js";
import {
  focusedMathField,
  palletRef,
  focusedMathFieldReturn
} from "./MathInputSelector.js";
import {panelOpen} from "../Panels/Panel.js";
import {doenetMainBlue} from "../../_reactComponents/PanelHeaderComponents/theme.js";
import {useRef} from "../../_snowpack/pkg/react.js";
const Panel = styled.div`
  height: 240px;
  // position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  color: white;
  display: flex;
  flex-direction: row;
  text-align: center;
  justify-content: center;
`;
const ContainerSection = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: no-wrap;
  flex-basis: 27%;
  flex-grow: 1;
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
  min-width: 100px;
  max-width: 300px;
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
  max-width: 700px;
  flex-basis: 90%;
  margin-left: 5px;
  margin-right: 5px;
  margin-top: auto;
  margin-bottom: auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;
const Button = styled.button`
  flex-basis: 23%;
  height: 30px;
  color: ${doenetMainBlue};
  border: 2px solid ${doenetMainBlue};
  background: white;
  border-radius: 5px;
`;
const Button33 = styled.button`
  flex-basis: 30%;
  height: 30px;
  color: ${doenetMainBlue};
  border: 2px solid ${doenetMainBlue};
  border-radius: 5px;
  background: white;
`;
const White15Button = styled.button`
  flex-basis: 14%;
  margin: 1px;
  height: 30px;
  background: ${doenetMainBlue};
  border: none;
  color: white;
  border-radius: 5px;
`;
const CursorButton = styled.button`
  flex-basis: 42%;
  height: 30px;
  background: ${doenetMainBlue};
  border: none;
  color: white;
  border-radius: 5px;
`;
const DeleteButton = styled.button`
  flex-basis: 90%;
  height: 30px;
  background: ${doenetMainBlue};
  border: none;
  color: white;
  border-radius: 5px;
`;
const EnterButton = styled.button`
  flex-basis: 90%;
  height: 30px;
  background: ${doenetMainBlue};
  border: none;
  color: white;
  border-radius: 5px;
`;
const White20Button = styled.button`
  flex-basis: 19%;
  margin: 1px;
  height: 30px;
  background: ${doenetMainBlue};
  border: none;
  color: white;
  border-radius: 5px;
`;
const LetterButton = styled.button`
  flex-basis: 9%;
  margin: 1px;
  height: 30px;
  color: ${doenetMainBlue};
  border: 2px solid ${doenetMainBlue};
  background: white;
  border-radius: 5px;
`;
export default function VirtualKeyboard() {
  const [toggleKeyboard, setToggleKeyboard] = useRecoilState(panelOpen("keyboard"));
  const [toggleLetters, setToggleLetters] = useState(false);
  const [toggleCase, setToggleCase] = useState(false);
  const [toggleGreek, setToggleGreek] = useState(0);
  const [toggleFn, setToggleFn] = useState(0);
  const [toggleNumpad, setToggleNumpad] = useState(0);
  const callback = useRecoilValue(focusedMathField);
  const returncallback = useRecoilValue(focusedMathFieldReturn);
  const setPalletRef = useSetRecoilState(palletRef);
  const containerRef = useRef(null);
  useEffect(() => {
    setPalletRef({...containerRef});
    setToggleFn(0);
    setToggleGreek(0);
    setToggleNumpad(0);
  }, [toggleLetters, toggleCase]);
  const handleToggleLetters = () => {
    setToggleLetters(!toggleLetters);
  };
  const handleToggleCase = () => {
    setToggleCase(!toggleCase);
  };
  const handleGreekToggle = (val) => {
    setToggleGreek(val);
  };
  const handleFnToggle = (val) => {
    setToggleFn(val);
  };
  const handleNumpadToggle = (val) => {
    setToggleNumpad(val);
  };
  if (toggleLetters) {
    if (toggleCase) {
      return /* @__PURE__ */ React.createElement(MathJax.Provider, null, /* @__PURE__ */ React.createElement(Panel, {
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
      })), /* @__PURE__ */ React.createElement(White15Button, {
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
      }, "M"), /* @__PURE__ */ React.createElement(White15Button, {
        onClick: () => callback("keystroke Backspace")
      }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
        icon: faBackspace
      })), /* @__PURE__ */ React.createElement(White20Button, {
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
      }, "'"), /* @__PURE__ */ React.createElement(White20Button, {
        onClick: () => returncallback()
      }, "Enter"))));
    } else {
      return /* @__PURE__ */ React.createElement(MathJax.Provider, null, /* @__PURE__ */ React.createElement(Panel, {
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
      })), /* @__PURE__ */ React.createElement(White15Button, {
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
      }, "m"), /* @__PURE__ */ React.createElement(White15Button, {
        onClick: () => callback("keystroke Backspace")
      }, /* @__PURE__ */ React.createElement(FontAwesomeIcon, {
        icon: faBackspace
      })), /* @__PURE__ */ React.createElement(White20Button, {
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
      }, ","), /* @__PURE__ */ React.createElement(White20Button, {
        onClick: () => returncallback()
      }, "Enter"))));
    }
  } else {
    let sectionSet = /* @__PURE__ */ React.createElement(Section, null, /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("write \\cup")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\cup"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("write \\cap")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\cap"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("write \\subset")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\subset"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("write \\supset")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\supset"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("write \\subseteq")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\subseteq"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("write \\supseteq")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\supseteq"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("write \\nsubseteq")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\nsubseteq"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("write \\nsupseteq")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\nsupseteq"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("write \\emptyset")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\emptyset"
    })));
    let sectionTrig1 = /* @__PURE__ */ React.createElement(Section, null, /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("cmd \\sin")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\sin"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("cmd \\cos")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\cos"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("cmd \\tan")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\tan"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("write \\sin^{-1}")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\sin^{-1}"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("write \\cos^{-1}")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\cos^{-1}"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("write \\tan^{-1}")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\tan^{-1}"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("cmd \\sinh")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\sinh"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("cmd \\tanh")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\tanh"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("cmd \\cosh")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\cosh"
    })));
    let sectionTrig2 = /* @__PURE__ */ React.createElement(Section, null, /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("cmd \\csc")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\csc"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("cmd \\sec")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\sec"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("cmd \\cot")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\cot"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("write \\csc^{-1}")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\csc^{-1}"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("write \\sec^{-1}")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\sec^{-1}"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("write \\cot^{-1}")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\cot^{-1}"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("cmd \\csch")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "csch"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("cmd \\coth")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\coth"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("cmd \\sech")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "sech"
    })));
    let sectionFn = /* @__PURE__ */ React.createElement(Section, null, /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("write \\frac{\\partial}{\\partial{x}}")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\frac{\\partial}{\\partial x}"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("write \\int")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\int"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("write \\frac{d}{dx}")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\frac{d}{dx}"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("write \\log_{}")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\log_ab"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => callback("cmd \\ln")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\ln"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => {
        callback("write e^{}");
        callback("keystroke Left");
      }
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "e^{x}"
    })), /* @__PURE__ */ React.createElement(Button33, {
      onClick: () => {
        callback("write 10^{}");
        callback("keystroke Left");
      }
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "10^{x}"
    })));
    let sectionGreekNone = null;
    let sectionGreek1 = /* @__PURE__ */ React.createElement(Section, null, /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\alpha")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\alpha"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\epsilon")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\epsilon"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\kappa")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\kappa"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\xi")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\xi"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\beta")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\beta"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\zeta")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\zeta"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\lambda")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\lambda"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\pi")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\pi"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\gamma")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\gamma"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\eta")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\eta"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\mu")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\mu"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\rho")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\rho"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\delta")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\delta"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\theta")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\theta"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\nu")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\nu"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\sigma")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\sigma"
    })));
    let sectionGreek2 = /* @__PURE__ */ React.createElement(Section, null, /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\tau")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\tau"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\Lambda")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\Lambda"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\Upsilon")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\Upsilon"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\Gamma")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\Gamma"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\phi")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\phi"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\Xi")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\Xi"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\Phi")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\Phi"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\Delta")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\Delta"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\psi")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\psi"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\Pi")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\Pi"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\Psi")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\Psi"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\Theta")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\Theta"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\omega")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\omega"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\Sigma")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\Sigma"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write \\Omega")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\Omega"
    })));
    let sectionXYZ = /* @__PURE__ */ React.createElement(Section, null, /* @__PURE__ */ React.createElement(Button, {
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
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("cmd /")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\div"
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
    })));
    let section123 = /* @__PURE__ */ React.createElement(Section, null, /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write 7")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "7"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write 8")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "8"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write 9")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "9"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("cmd /")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\div"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write 4")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "4"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write 5")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "5"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write 6")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "6"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("type *")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "\\times"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write 1")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "1"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write 2")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "2"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write 3")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "3"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("cmd -")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "-"
    })), /* @__PURE__ */ React.createElement(Button, {
      onClick: () => callback("write 0")
    }, /* @__PURE__ */ React.createElement(MathJax.Node, {
      inline: true,
      formula: "0"
    })), /* @__PURE__ */ React.createElement(Button, {
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
    })));
    let sectionControl = /* @__PURE__ */ React.createElement(Section, {
      style: {marginTop: "57px"}
    }, /* @__PURE__ */ React.createElement(CursorButton, {
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
    })), /* @__PURE__ */ React.createElement(EnterButton, {
      onClick: () => returncallback()
    }, "Enter"), /* @__PURE__ */ React.createElement(EnterButton, {
      onClick: handleToggleLetters
    }, "ABC"));
    return /* @__PURE__ */ React.createElement(MathJax.Provider, null, /* @__PURE__ */ React.createElement(Panel, {
      tabIndex: "0",
      ref: containerRef
    }, /* @__PURE__ */ React.createElement(ContainerSection, null, /* @__PURE__ */ React.createElement(ToggleButtonSection, null, /* @__PURE__ */ React.createElement(ToggleButtonGroup, {
      onClick: handleGreekToggle
    }, /* @__PURE__ */ React.createElement(ToggleButton, {
      value: "Greek 1"
    }), /* @__PURE__ */ React.createElement(ToggleButton, {
      value: "Greek 2"
    }))), toggleGreek === 0 ? sectionGreek1 : toggleGreek === 1 ? sectionGreek2 : null), /* @__PURE__ */ React.createElement(VerticalDivider, {
      height: "230px",
      marginTop: "10px"
    }), /* @__PURE__ */ React.createElement(ContainerSection, null, /* @__PURE__ */ React.createElement(ToggleButtonSection, null, /* @__PURE__ */ React.createElement(ToggleButtonGroup, {
      onClick: handleFnToggle
    }, /* @__PURE__ */ React.createElement(ToggleButton, {
      value: "Trig 1"
    }), /* @__PURE__ */ React.createElement(ToggleButton, {
      value: "Trig 2"
    }), /* @__PURE__ */ React.createElement(ToggleButton, {
      value: "Set"
    }), /* @__PURE__ */ React.createElement(ToggleButton, {
      value: "Fn"
    }))), toggleFn === 0 ? sectionTrig1 : toggleFn === 1 ? sectionTrig2 : toggleFn === 2 ? sectionSet : toggleFn === 3 ? sectionFn : null), /* @__PURE__ */ React.createElement(VerticalDivider, {
      height: "230px",
      marginTop: "10px"
    }), /* @__PURE__ */ React.createElement(ContainerSection, null, /* @__PURE__ */ React.createElement(ToggleButtonSection, null, /* @__PURE__ */ React.createElement(ToggleButtonGroup, {
      onClick: handleNumpadToggle
    }, /* @__PURE__ */ React.createElement(ToggleButton, {
      value: "123"
    }), /* @__PURE__ */ React.createElement(ToggleButton, {
      value: "xy"
    }))), toggleNumpad === 0 ? section123 : toggleNumpad === 1 ? sectionXYZ : null), /* @__PURE__ */ React.createElement(VerticalDivider, {
      height: "230px",
      marginTop: "10px"
    }), /* @__PURE__ */ React.createElement(ControlSection, null, sectionControl)));
  }
}
