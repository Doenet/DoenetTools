import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MathJax } from "better-react-mathjax";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ToggleButton from '../../../_reactComponents/PanelHeaderComponents/ToggleButton';
import ToggleButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ToggleButtonGroup';
import VerticalDivider from '../../../_reactComponents/PanelHeaderComponents/VerticalDivider';

import { faBackspace, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { useToast, toastType } from '../Toast';

import { useRecoilValue, useSetRecoilState } from 'recoil';

import {
  focusedMathField,
  palletRef,
  focusedMathFieldReturn,
} from './MathInputSelector';

// import { doenetMainBlue } from '../../../_reactComponents/PanelHeaderComponents/theme';

import { useRef } from 'react';

const Panel = styled.div`
  height: 240px;
  // position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: var(--canvas);
  color: var(--canvas);
  display: flex;
  flex-direction: row;
  text-align: center;
  justify-content: center;
`;

const ContainerSection = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: no-wrap;
  /* flex-basis: 27%; */
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
  flex-basis: 18%;
  height: 30px;
  color: var(--mainBlue);
  border: 2px solid var(--mainBlue);
  background: white;
  border-radius: 5px;
`;

const Button33 = styled.button`
  flex-basis: ${(props) => props.alpha ? '20%' : '28%'};
  height: 30px;
  color: ${(props) => (props.alpha || props.transition) ? 'white' : 'var(--mainBlue)'};
  border: 2px solid var(--mainBlue);
  border-radius: 5px;
  background: ${(props) => (props.alpha || props.transition) ? 'var(--mainBlue)' : 'white'};
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
  background: ${(props) => props.lowercase ? 'white' :'var(--mainBlue)'};
  border: ${(props) => props.lowercase ? '2px solid var(--mainBlue)' :'none'};
  color: ${(props) => props.lowercase ? 'var(--mainBlue)' :'white'};
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
  color: ${(props) => props.transition ? 'white' : 'var(--mainBlue)'};
  border: ${(props) => props.transition ? 'none' : '2px solid var(--mainBlue)'};
  background: ${(props) => props.transition ? 'var(--mainBlue)' : 'white'};
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

  // if (toggleLetters) {
    // if (toggleCase) {
      let sectionUpperABC = (
        <Panel tabIndex="0" ref={containerRef}>
          <LettersSection>
            <LetterButton onClick={() => callback('write Q')}>Q</LetterButton>
            <LetterButton onClick={() => callback('write W')}>W</LetterButton>
            <LetterButton onClick={() => callback('write E')}>E</LetterButton>
            <LetterButton onClick={() => callback('write R')}>R</LetterButton>
            <LetterButton onClick={() => callback('write T')}>T</LetterButton>
            <LetterButton onClick={() => callback('write Y')}>Y</LetterButton>
            <LetterButton onClick={() => callback('write U')}>U</LetterButton>
            <LetterButton onClick={() => callback('write I')}>I</LetterButton>
            <LetterButton onClick={() => callback('write O')}>O</LetterButton>
            <LetterButton onClick={() => callback('write P')}>P</LetterButton>
            <LetterButton onClick={() => callback('write A')}>A</LetterButton>
            <LetterButton onClick={() => callback('write S')}>S</LetterButton>
            <LetterButton onClick={() => callback('write D')}>D</LetterButton>
            <LetterButton onClick={() => callback('write F')}>F</LetterButton>
            <LetterButton onClick={() => callback('write G')}>G</LetterButton>
            <LetterButton onClick={() => callback('write H')}>H</LetterButton>
            <LetterButton onClick={() => callback('write J')}>J</LetterButton>
            <LetterButton onClick={() => callback('write K')}>K</LetterButton>
            <LetterButton onClick={() => callback('write L')}>L</LetterButton>
            <White15Button onClick={handleToggleABCCase}>
              <FontAwesomeIcon icon={faArrowUp} />
            </White15Button>
            <LetterButton onClick={() => callback('write Z')}>Z</LetterButton>
            <LetterButton onClick={() => callback('write X')}>X</LetterButton>
            <LetterButton onClick={() => callback('write C')}>C</LetterButton>
            <LetterButton onClick={() => callback('write V')}>V</LetterButton>
            <LetterButton onClick={() => callback('write B')}>B</LetterButton>
            <LetterButton onClick={() => callback('write N')}>N</LetterButton>
            <LetterButton onClick={() => callback('write M')}>M</LetterButton>
            <White15Button onClick={() => callback('keystroke Backspace')}>
              <FontAwesomeIcon icon={faBackspace} />
            </White15Button>
            <LetterButton onClick={() => callback('write ,')}>,</LetterButton>
            <LetterButton onClick={() => callback("write '")}>'</LetterButton>
            <SpaceButton onClick={() => callback('write \\ ')}> </SpaceButton>
            <LetterButton transition onClick={() => callback('keystroke Left')}>
              <MathJax dynamic>\(\leftarrow\)</MathJax>
            </LetterButton>
            <LetterButton transition onClick={() => callback('keystroke Right')}>
              <MathJax dynamic>\(\rightarrow\)</MathJax>
            </LetterButton>
            <LetterButton transition onClick={() => returncallback()}>
              Enter
            </LetterButton>
          </LettersSection>
        </Panel>
      );
    // } else {
      let sectionLowerABC = (
        <Panel tabIndex="0" ref={containerRef}>
          <LettersSection>
            <LetterButton onClick={() => callback('write q')}>q</LetterButton>
            <LetterButton onClick={() => callback('write w')}>w</LetterButton>
            <LetterButton onClick={() => callback('write e')}>e</LetterButton>
            <LetterButton onClick={() => callback('write r')}>r</LetterButton>
            <LetterButton onClick={() => callback('write t')}>t</LetterButton>
            <LetterButton onClick={() => callback('write y')}>y</LetterButton>
            <LetterButton onClick={() => callback('write u')}>u</LetterButton>
            <LetterButton onClick={() => callback('write i')}>i</LetterButton>
            <LetterButton onClick={() => callback('write o')}>o</LetterButton>
            <LetterButton onClick={() => callback('write p')}>p</LetterButton>
            <LetterButton onClick={() => callback('write a')}>a</LetterButton>
            <LetterButton onClick={() => callback('write s')}>s</LetterButton>
            <LetterButton onClick={() => callback('write d')}>d</LetterButton>
            <LetterButton onClick={() => callback('write f')}>f</LetterButton>
            <LetterButton onClick={() => callback('write g')}>g</LetterButton>
            <LetterButton onClick={() => callback('write h')}>h</LetterButton>
            <LetterButton onClick={() => callback('write j')}>j</LetterButton>
            <LetterButton onClick={() => callback('write k')}>k</LetterButton>
            <LetterButton onClick={() => callback('write l')}>l</LetterButton>
            <White15Button lowercase onClick={handleToggleABCCase}>
              <FontAwesomeIcon icon={faArrowUp} />
            </White15Button>
            <LetterButton onClick={() => callback('write z')}>z</LetterButton>
            <LetterButton onClick={() => callback('write x')}>x</LetterButton>
            <LetterButton onClick={() => callback('write c')}>c</LetterButton>
            <LetterButton onClick={() => callback('write v')}>v</LetterButton>
            <LetterButton onClick={() => callback('write b')}>b</LetterButton>
            <LetterButton onClick={() => callback('write n')}>n</LetterButton>
            <LetterButton onClick={() => callback('write m')}>m</LetterButton>
            <White15Button onClick={() => callback('keystroke Backspace')}>
              <FontAwesomeIcon icon={faBackspace} />
            </White15Button>
            <LetterButton onClick={() => callback('write ,')}>,</LetterButton>
            <LetterButton onClick={() => callback("write '")}>'</LetterButton>
            <SpaceButton onClick={() => callback('write \\ ')}> </SpaceButton>
            <LetterButton transition onClick={() => callback('keystroke Left')}>
              <MathJax dynamic>\(\leftarrow\)</MathJax>
            </LetterButton>
            <LetterButton transition onClick={() => callback('keystroke Right')}>
              <MathJax dynamic>\(\rightarrow\)</MathJax>
            </LetterButton>
            <LetterButton transition onClick={() => returncallback()}>
              Enter
            </LetterButton>
          </LettersSection>
        </Panel>
      );
    // }
  // }
    let sectionSymbols1 = (
      <Section>
        <Button onClick={() => callback('cmd {')}>{`{`}</Button>
        <Button onClick={() => callback('cmd }')}>{`}`}</Button>
        <Button onClick={() => callback('write ,')}>,</Button>
        <Button onClick={() => callback('write :')}>:</Button>
        <Button onClick={() => callback('write \\vert')}>
          <MathJax dynamic>{`\\(\\vert\\)`}</MathJax>
        </Button>
        <Button onClick={() => callback('write \\subset')}>
          <MathJax dynamic>\(\subset\)</MathJax>
        </Button>
        <Button onClick={() => callback('write \\subseteq')}>
          <MathJax dynamic>\(\subseteq\)</MathJax>
        </Button>
        <Button onClick={() => callback('write \\neq')}>
          <MathJax dynamic>\(\neq\)</MathJax>
        </Button>
        <Button onClick={() => callback('write \\in')}>
          <MathJax dynamic>\(\in\)</MathJax>
        </Button>
        <Button onClick={() => callback('write \\infty')}>
          <MathJax dynamic>\(\infty\)</MathJax>
        </Button>
        <Button onClick={() => callback('cmd (')}>
          <MathJax dynamic>\((\)</MathJax>
        </Button>
        <Button onClick={() => callback('cmd )')}>
          <MathJax dynamic>\()\)</MathJax>
        </Button>
        <Button onClick={() => callback('cmd [')}>[</Button>
        <Button onClick={() => callback('cmd ]')}>]</Button>
        <Button onClick={() => callback('write \\emptyset')}>
          <MathJax dynamic>\(\emptyset\)</MathJax>
        </Button>
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
      </Section>
    );

    let sectionSymbols2 = (
      <Section>
        <Button onClick={() => {
          callback('write \\vec{}');
          callback('keystroke Left')
        }}>
          <MathJax dynamic>{`\\(\\vec{a}\\)`}</MathJax>
        </Button>
        <Button onClick={() => callback('cmd \\langle')}>
          <MathJax dynamic>{`\\(\\langle\\)`}</MathJax>
        </Button>
        <Button onClick={() => callback('cmd \\rangle')}>
          <MathJax dynamic>{`\\(\\rangle\\)`}</MathJax>
        </Button>
        <Button onClick={() => callback('write \\cdot')}>
          <MathJax dynamic>{`\\(\\cdot\\)`}</MathJax>
        </Button>
        <Button onClick={() => callback('write \\times')}>
          <MathJax dynamic>{`\\(\\times\\)`}</MathJax>
        </Button>
        <Button onClick={() => callback('cmd \\overline')}>
          <MathJax dynamic>{`\\(\\overline{a}\\)`}</MathJax>
        </Button>
        <Button onClick={() => callback('write \\perp')}>
          <MathJax dynamic>{`\\(\\perp\\)`}</MathJax>
        </Button>
        <Button onClick={() => callback('write \\parallel')}>
          <MathJax dynamic>{`\\(\\parallel\\)`}</MathJax>
        </Button>
        <Button onClick={() => callback('write \\angle')}>
          <MathJax dynamic>{`\\(\\angle\\)`}</MathJax>
        </Button>
        <Button onClick={() => {
          callback('write {}^\\circ');
        }}>
          <MathJax dynamic>{`\\({a}^\\circ\\)`}</MathJax>
        </Button>
        <Button onClick={() => callback('write \\exists')}>
          <MathJax dynamic>{`\\(\\exists\\)`}</MathJax>
        </Button>
        <Button onClick={() => callback('write \\forall')}>
          <MathJax dynamic>{`\\(\\forall\\)`}</MathJax>
        </Button>
        <Button onClick={() => callback('write %')}>%</Button>
        <Button onClick={() => callback('write $')}>$</Button>
        <DeleteButton onClick={() => callback('keystroke Backspace')}>
          <FontAwesomeIcon icon={faBackspace} />
        </DeleteButton>
        <Button onClick={() => callback('cmd _')}>
              <MathJax dynamic>\(a_b\)</MathJax>
        </Button>
        {/* <Button onClick={() => callback('write \\neg')}>
          <MathJax dynamic>{`\\(\\neg\\)`}</MathJax>
        </Button> */}
        <CursorButton onClick={() => callback('keystroke Left')}>
          <MathJax dynamic>\(\leftarrow\)</MathJax>
        </CursorButton>
        <CursorButton onClick={() => callback('keystroke Right')}>
          <MathJax dynamic>\(\rightarrow\)</MathJax>
        </CursorButton>
        <EnterButton onClick={() => returncallback()}>Enter</EnterButton>
      </Section>
    );

    let sectionTrig1 = (
      <Section>
        <Button33 onClick={() => callback('type sin(')}>
          <MathJax dynamic>\(\sin\)</MathJax>
        </Button33>
        <Button33 onClick={() => callback('type cos(')}>
          <MathJax dynamic>\(\cos\)</MathJax>
        </Button33>
        <Button33 onClick={() => callback('type tan(')}>
          <MathJax dynamic>\(\tan\)</MathJax>
        </Button33>
        <Button33 onClick={() => {callback('write \\sin^{-1}'); callback('type (')}}>
          <MathJax dynamic>{`\\(\\sin^{-1}\\)`}</MathJax>
        </Button33>
        <Button33 onClick={() => {callback('write \\cos^{-1}'); callback('type (')}}>
          <MathJax dynamic>{`\\(\\cos^{-1}\\)`}</MathJax>
        </Button33>
        <Button33 onClick={() => {callback('write \\tan^{-1}'); callback('type (')}}>
          <MathJax dynamic>{`\\(\\tan^{-1}\\)`}</MathJax>
        </Button33>
        <Button33 onClick={() => callback('type ln(')}>
          <MathJax dynamic>\(\ln\)</MathJax>
        </Button33>
        <Button33 onClick={() => {
          callback('write \\log_{}');
          callback('keystroke Left');
        }}>
          <MathJax dynamic>\(\log_b\)</MathJax>
        </Button33>
        <Button33 onClick={() => callback('write \\log_{10}')}>
          <MathJax dynamic>{`\\(\\log_{10}\\)`}</MathJax>
        </Button33>
        <Button33
          onClick={() => {
            callback('write e^{}');
            callback('keystroke Left');
          }}
        >
          <MathJax dynamic>{`\\(e^{a}\\)`}</MathJax>
        </Button33>
        <Button33
          onClick={() => {
            callback('write 10^{}');
            callback('keystroke Left');
          }}
        >
          <MathJax dynamic>{`\\(10^{a}\\)`}</MathJax>
        </Button33>
        <Button33 onClick={() => {callback('write \\sqrt[]{}'); callback('keystroke Left'); callback('keystroke Left');}}>
          <MathJax dynamic>{`\\(\\sqrt[b]{a}\\)`}</MathJax>
        </Button33>
      </Section>
    );
    let sectionTrig2 = (
      <Section>
        <Button33 onClick={() => callback('cmd \\csc')}>
          <MathJax dynamic>\(\csc\)</MathJax>
        </Button33>
        <Button33 onClick={() => callback('cmd \\sec')}>
          <MathJax dynamic>\(\sec\)</MathJax>
        </Button33>
        <Button33 onClick={() => callback('cmd \\cot')}>
          <MathJax dynamic>\(\cot\)</MathJax>
        </Button33>
        <Button33 onClick={() => callback('write \\csc^{-1}')}>
          <MathJax dynamic>{`\\(\\csc^{-1}\\)`}</MathJax>
        </Button33>
        <Button33 onClick={() => callback('write \\sec^{-1}')}>
          <MathJax dynamic>{`\\(\\sec^{-1}\\)`}</MathJax>
        </Button33>
        <Button33 onClick={() => callback('write \\cot^{-1}')}>
          <MathJax dynamic>{`\\(\\cot^{-1}\\)`}</MathJax>
        </Button33>
        <Button33 onClick={() => callback('cmd \\csch')}>
          <MathJax dynamic>\(\csch\)</MathJax>
        </Button33>
        <Button33 onClick={() => callback('cmd \\coth')}>
          <MathJax dynamic>\(\coth\)</MathJax>
        </Button33>
        <Button33 onClick={() => callback('cmd \\sech')}>
          <MathJax dynamic>\(\sech\)</MathJax>
        </Button33>
      </Section>
    );
    let sectionFn = (
      <Section>
        <Button33
          onClick={() => callback('write \\frac{\\partial}{\\partial{x}}')}
        >
          <MathJax dynamic>{`\\(\\frac{\\partial}{\\partial x}\\)`}</MathJax>
        </Button33>
        <Button33 onClick={() => callback('write \\int')}>
          <MathJax dynamic>\(\int\)</MathJax>
        </Button33>
        <Button33 onClick={() => callback('write \\frac{d}{dx}')}>
          <MathJax dynamic>{`\\(\\frac{d}{dx}\\)`}</MathJax>
        </Button33>
        <Button33 onClick={() => callback('write \\log_{}')}>
          <MathJax dynamic>\(\log_ab\)</MathJax>
        </Button33>
        <Button33 onClick={() => callback('cmd \\ln')}>
          <MathJax dynamic>\(\ln\)</MathJax>
        </Button33>
        <Button33
          onClick={() => {
            callback('write e^{}');
            callback('keystroke Left');
          }}
        >
          <MathJax dynamic>{`\\(e^{x}\\)`}</MathJax>
        </Button33>
        <Button33
          onClick={() => {
            callback('write 10^{}');
            callback('keystroke Left');
          }}
        >
          <MathJax dynamic>{`\\(10^{x}\\)`}</MathJax>
        </Button33>
      </Section>
    );
    let sectionFx = (
      <Section>
        <Button33 onClick={() => callback('write \\frac{d}{dx}')}>
          <MathJax dynamic>{`\\(\\frac{d}{dx}\\)`}</MathJax>
        </Button33>
        {/* <Button33 onClick={() => callback('write \\int')}>
          <MathJax dynamic>\(\int\)</MathJax>
        </Button33> */}
        <Button33 onClick={() => {
          callback('write \\int_{}^{}');
          callback('keystroke Left');
          callback('keystroke Left');
        }}>
          <MathJax dynamic>{`\\(\\int_{a}^{b}\\)`}</MathJax>
        </Button33>
        <Button33 onClick={() => callback('type nPr(')}>
          <MathJax dynamic>{`\\(\\operatorname{nPr}\\)`}</MathJax>
        </Button33>
        <Button33 onClick={() => callback('type nCr(')}>
          <MathJax dynamic>{`\\(\\operatorname{nCr}\\)`}</MathJax>
        </Button33>
        <Button33 onClick={() => callback('write !')}>!</Button33>
        <Button33 onClick={() => {callback('write \\lfloor'); callback('write \\rfloor'); callback ('keystroke Left')}}>
          <MathJax dynamic>{`\\(\\lfloor{a}\\rfloor\\)`}</MathJax>
        </Button33>
        <Button33 onClick={() => {callback('write \\lceil'); callback('write \\rceil'); callback ('keystroke Left')}}>
          <MathJax dynamic>{`\\(\\lceil{a}\\rceil\\)`}</MathJax>
        </Button33>
        <Button33 transition onClick={() => callback('keystroke Backspace')}>
          <FontAwesomeIcon icon={faBackspace} />
        </Button33>
        <Button33 transition onClick={() => callback('keystroke Left')}>
          <MathJax dynamic>\(\leftarrow\)</MathJax>
        </Button33>
        <Button33 transition onClick={() => callback('keystroke Right')}>
          <MathJax dynamic>\(\rightarrow\)</MathJax>
        </Button33>
        <Button33 transition onClick={() => returncallback()}>Enter</Button33>
      </Section>
    );

    let sectionGreekNone = null;

    let sectionGreek1 = (
      <Section>
        <Button onClick={() => callback('write \\alpha')}>
          <MathJax dynamic>\(\alpha\)</MathJax>
        </Button>
        <Button onClick={() => callback('write \\beta')}>
          <MathJax dynamic>\(\beta\)</MathJax>
        </Button>
        <Button onClick={() => callback('write \\gamma')}>
          <MathJax dynamic>\(\gamma\)</MathJax>
        </Button>
        <Button onClick={() => callback('write \\delta')}>
          <MathJax dynamic>\(\delta\)</MathJax>
        </Button>

        <Button onClick={() => callback('write \\epsilon')}>
          <MathJax dynamic>\(\epsilon\)</MathJax>
        </Button>
        <Button onClick={() => callback('write \\zeta')}>
          <MathJax dynamic>\(\zeta\)</MathJax>
        </Button>
        <Button onClick={() => callback('write \\eta')}>
          <MathJax dynamic>\(\eta\)</MathJax>
        </Button>
        <Button onClick={() => callback('write \\theta')}>
          <MathJax dynamic>\(\theta\)</MathJax>
        </Button>

        <Button onClick={() => callback('write \\kappa')}>
          <MathJax dynamic>\(\kappa\)</MathJax>
        </Button>
        <Button onClick={() => callback('write \\lambda')}>
          <MathJax dynamic>\(\lambda\)</MathJax>
        </Button>
        <Button onClick={() => callback('write \\mu')}>
          <MathJax dynamic>\(\mu\)</MathJax>
        </Button>
        <Button onClick={() => callback('write \\nu')}>
          <MathJax dynamic>\(\nu\)</MathJax>
        </Button>

        <Button onClick={() => callback('write \\xi')}>
          <MathJax dynamic>\(\xi\)</MathJax>
        </Button>
        <Button onClick={() => callback('write \\pi')}>
          <MathJax dynamic>\(\pi\)</MathJax>
        </Button>
        <Button onClick={() => callback('write \\rho')}>
          <MathJax dynamic>\(\rho\)</MathJax>
        </Button>
        <Button onClick={() => callback('write \\sigma')}>
          <MathJax dynamic>\(\sigma\)</MathJax>
        </Button>
      </Section>
    );
    let sectionGreek2 = (
      <Section>
        <Button onClick={() => callback('write \\tau')}>
          <MathJax dynamic>\(\tau\)</MathJax>
        </Button>
        <Button onClick={() => callback('write \\phi')}>
          <MathJax dynamic>\(\phi\)</MathJax>
        </Button>
        <Button onClick={() => callback('write \\psi')}>
          <MathJax dynamic>\(\psi\)</MathJax>
        </Button>
        <Button onClick={() => callback('write \\omega')}>
          <MathJax dynamic>\(\omega\)</MathJax>
        </Button>


        <Button onClick={() => callback('write \\Gamma')}>
          <MathJax dynamic>\(\Gamma\)</MathJax>
        </Button>
        <Button onClick={() => callback('write \\Delta')}>
          <MathJax dynamic>\(\Delta\)</MathJax>
        </Button>
        <Button onClick={() => callback('write \\Theta')}>
          <MathJax dynamic>\(\Theta\)</MathJax>
        </Button>
        <Button onClick={() => callback('write \\Lambda')}>
          <MathJax dynamic>\(\Lambda\)</MathJax>
        </Button>

        <Button onClick={() => callback('write \\Xi')}>
          <MathJax dynamic>\(\Xi\)</MathJax>
        </Button>
        <Button onClick={() => callback('write \\Pi')}>
          <MathJax dynamic>\(\Pi\)</MathJax>
        </Button>
        <Button onClick={() => callback('write \\Sigma')}>
          <MathJax dynamic>\(\Sigma\)</MathJax>
        </Button>
        <Button onClick={() => callback('write \\Phi')}>
          <MathJax dynamic>\(\Phi\)</MathJax>
        </Button>

        <Button onClick={() => callback('write \\Psi')}>
          <MathJax dynamic>\(\Psi\)</MathJax>
        </Button>
        <Button onClick={() => callback('write \\Upsilon')}>
          <MathJax dynamic>\(\Upsilon\)</MathJax>
        </Button>
        <Button onClick={() => callback('write \\Omega')}>
          <MathJax dynamic>\(\Omega\)</MathJax>
        </Button>
      </Section>
    );

    let sectionUpperGreek = (
      <Panel tabIndex="0" ref={containerRef}>
        <LettersSection>
          <LetterButton onClick={() => callback('write \\Phi')}>
            <MathJax dynamic>\(\Phi\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write \\Sigma')}>
            <MathJax dynamic>\(\Sigma\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write E')}>E</LetterButton>
          <LetterButton onClick={() => callback('write P')}>P</LetterButton>
          <LetterButton onClick={() => callback('write T')}>T</LetterButton>
          <LetterButton onClick={() => callback('write Y')}>Y</LetterButton>
          <LetterButton onClick={() => callback('write \\Theta')}>
            <MathJax dynamic>\(\Theta\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write I')}>I</LetterButton>
          <LetterButton onClick={() => callback('write O')}>O</LetterButton>
          <LetterButton onClick={() => callback('write \\Pi')}>
            <MathJax dynamic>\(\Pi\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write A')}>A</LetterButton>
          <LetterButton onClick={() => callback('write \\Sigma')}>
            <MathJax dynamic>\(\Sigma\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write \\Delta')}>
            <MathJax dynamic>\(\Delta\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write \\Phi')}>
            <MathJax dynamic>\(\Phi\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write \\Gamma')}>
            <MathJax dynamic>\(\Gamma\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write H')}>H</LetterButton>
          <LetterButton onClick={() => callback('write \\Xi')}>
            <MathJax dynamic>\(\Xi\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write K')}>K</LetterButton>
          <LetterButton onClick={() => callback('write \\Lambda')}>
            <MathJax dynamic>\(\Lambda\)</MathJax>
          </LetterButton>
          <White15Button onClick={handleToggleGreekCase}>
            <FontAwesomeIcon icon={faArrowUp} />
          </White15Button>
          <LetterButton onClick={() => callback('write Z')}>Z</LetterButton>
          <LetterButton onClick={() => callback('write X')}>X</LetterButton>
          <LetterButton onClick={() => callback('write \\Psi')}>
            <MathJax dynamic>\(\Psi\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write \\Omega')}>
            <MathJax dynamic>\(\Delta\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write B')}>B</LetterButton>
          <LetterButton onClick={() => callback('write N')}>N</LetterButton>
          <LetterButton onClick={() => callback('write M')}>M</LetterButton>
          <White15Button onClick={() => callback('keystroke Backspace')}>
            <FontAwesomeIcon icon={faBackspace} />
          </White15Button>
          <LetterButton onClick={() => callback('write ,')}>,</LetterButton>
          <LetterButton onClick={() => callback("write '")}>'</LetterButton>
          <SpaceButton onClick={() => callback('write \\ ')}> </SpaceButton>
          <LetterButton transition onClick={() => callback('keystroke Left')}>
            <MathJax dynamic>\(\leftarrow\)</MathJax>
          </LetterButton>
          <LetterButton transition onClick={() => callback('keystroke Right')}>
            <MathJax dynamic>\(\rightarrow\)</MathJax>
          </LetterButton>
          <LetterButton transition onClick={() => returncallback()}>
            Enter
          </LetterButton>
        </LettersSection>
      </Panel>
    );

    let sectionLowerGreek = (
      <Panel tabIndex="0" ref={containerRef}>
        <LettersSection>
          <LetterButton onClick={() => callback('write \\phi')}>
            <MathJax dynamic>\(\phi\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write \\varsigma')}>
            <MathJax dynamic>\(\varsigma\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write \\epsilon')}>
            <MathJax dynamic>\(\epsilon\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write \\rho')}>
            <MathJax dynamic>\(\rho\)</MathJax>
          </LetterButton>          
          <LetterButton onClick={() => callback('write \\tau')}>
            <MathJax dynamic>\(\tau\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write \\upsilon')}>
            <MathJax dynamic>\(\upsilon\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write \\theta')}>
            <MathJax dynamic>\(\theta\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write \\iota')}>
            <MathJax dynamic>\(\iota\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write o')}>o</LetterButton>
          <LetterButton onClick={() => callback('write \\pi')}>
            <MathJax dynamic>\(\pi\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write \\alpha')}>
            <MathJax dynamic>\(\alpha\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write \\sigma')}>
            <MathJax dynamic>\(\sigma\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write \\delta')}>
            <MathJax dynamic>\(\delta\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write \\varphi')}>
            <MathJax dynamic>\(\varphi\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write \\gamma')}>
            <MathJax dynamic>\(\gamma\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write \\eta')}>
            <MathJax dynamic>\(\eta\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write \\xi')}>
            <MathJax dynamic>\(\xi\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write \\kappa')}>
            <MathJax dynamic>\(\kappa\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write \\lambda')}>
            <MathJax dynamic>\(\lambda\)</MathJax>
          </LetterButton>
          <White15Button lowercase onClick={handleToggleGreekCase}>
            <FontAwesomeIcon icon={faArrowUp} />
          </White15Button>
          <LetterButton onClick={() => callback('write \\zeta')}>
            <MathJax dynamic>\(\zeta\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write \\chi')}>
            <MathJax dynamic>\(\chi\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write \\psi')}>
            <MathJax dynamic>\(\psi\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write \\omega')}>
            <MathJax dynamic>\(\omega\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write \\beta')}>
            <MathJax dynamic>\(\beta\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write \\nu')}>
            <MathJax dynamic>\(\nu\)</MathJax>
          </LetterButton>
          <LetterButton onClick={() => callback('write \\mu')}>
            <MathJax dynamic>\(\mu\)</MathJax>
          </LetterButton>
          <White15Button onClick={() => callback('keystroke Backspace')}>
            <FontAwesomeIcon icon={faBackspace} />
          </White15Button>
          <LetterButton onClick={() => callback('write ,')}>,</LetterButton>
          <LetterButton onClick={() => callback("write '")}>'</LetterButton>
          <SpaceButton onClick={() => callback('write \\ ')}> </SpaceButton>
          <LetterButton transition onClick={() => callback('keystroke Left')}>
            <MathJax dynamic>\(\leftarrow\)</MathJax>
          </LetterButton>
          <LetterButton transition onClick={() => callback('keystroke Right')}>
            <MathJax dynamic>\(\rightarrow\)</MathJax>
          </LetterButton>
          <LetterButton transition onClick={() => returncallback()}>
            Enter
          </LetterButton>
        </LettersSection>
      </Panel>
    );

    let sectionXYZ = (
      <Section>
        <Button onClick={() => callback('write x')}>
          <MathJax dynamic>\(x\)</MathJax>
        </Button>
        <Button onClick={() => callback('write y')}>
          <MathJax dynamic>\(y\)</MathJax>
        </Button>
        <Button onClick={() => callback('write \\pi')}>
          <MathJax dynamic>\(\pi\)</MathJax>
        </Button>
        <Button
          onClick={() => {
            callback('write e');
          }}
        >
          <MathJax dynamic>{`\\(e\\)`}</MathJax>
        </Button>
        <Button onClick={() => { callback('type ^2'); callback('keystroke Right') }}>
          <MathJax dynamic>\(a^2\)</MathJax>
        </Button>
        <Button onClick={() => callback('cmd ^')}>
          <MathJax dynamic>\(a^b\)</MathJax>
        </Button>
        <Button onClick={() => callback('type sqrt')}>
          <MathJax dynamic>{`\\(\\sqrt{a}\\)`}</MathJax>
        </Button>
        <Button onClick={() => {
          callback('cmd |');
          callback('cmd |');
          callback('keystroke Left');
        }}>
          <MathJax dynamic>\(|a|\)</MathJax>
        </Button>
        <Button onClick={() => callback('write <')}>
          <MathJax dynamic>\(&lt;\)</MathJax>
        </Button>
        <Button onClick={() => callback('write >')}>
          <MathJax dynamic>\(&gt;\)</MathJax>
        </Button>
        <Button onClick={() => callback('type <=')}>
          <MathJax dynamic>\(\leq\)</MathJax>
        </Button>
        <Button onClick={() => callback('type >=')}>
          <MathJax dynamic>\(\geq\)</MathJax>
        </Button>
        <Button onClick={() => callback('write ,')}>
          <MathJax dynamic>\(,\)</MathJax>
        </Button>
        <Button onClick={() => callback('cmd (')}>
          <MathJax dynamic>\((\)</MathJax>
        </Button>
        <Button onClick={() => {
          callback('type )');
          // callback('keystroke Right');
        }}>
          <MathJax dynamic>\()\)</MathJax>
        </Button>
      </Section>
    );

    let section123 = (
      <Section>
        <Button onClick={() => callback('write 7')}>
          <MathJax dynamic>\(7\)</MathJax>
        </Button>
        <Button onClick={() => callback('write 8')}>
          <MathJax dynamic>\(8\)</MathJax>
        </Button>
        <Button onClick={() => callback('write 9')}>
          <MathJax dynamic>\(9\)</MathJax>
        </Button>
        <Button onClick={() => callback('type *')}>
          <MathJax dynamic>\(\times\)</MathJax>
        </Button>
        <Button onClick={() => callback('cmd /')}>
          <MathJax dynamic>\(\div\)</MathJax>
        </Button>
        <Button onClick={() => callback('write 4')}>
          <MathJax dynamic>\(4\)</MathJax>
        </Button>
        <Button onClick={() => callback('write 5')}>
          <MathJax dynamic>\(5\)</MathJax>
        </Button>
        <Button onClick={() => callback('write 6')}>
          <MathJax dynamic>\(6\)</MathJax>
        </Button>
        <Button onClick={() => callback('write +')}>
          <MathJax dynamic>\(+\)</MathJax>
        </Button>
        <Button onClick={() => callback('cmd -')}>
          <MathJax dynamic>\(-\)</MathJax>
        </Button>
        <Button onClick={() => callback('write 1')}>
          <MathJax dynamic>\(1\)</MathJax>
        </Button>
        <Button onClick={() => callback('write 2')}>
          <MathJax dynamic>\(2\)</MathJax>
        </Button>
        <Button onClick={() => callback('write 3')}>
          <MathJax dynamic>\(3\)</MathJax>
        </Button>
        <Button onClick={() => callback('write =')}>
          <MathJax dynamic>\(=\)</MathJax>
        </Button>
        <DeleteButton onClick={() => callback('keystroke Backspace')}>
          <FontAwesomeIcon icon={faBackspace} />
        </DeleteButton>
        <Button onClick={() => callback('write 0')}>
          <MathJax dynamic>\(0\)</MathJax>
        </Button>
        <Button onClick={() => callback('write .')}>
          <MathJax dynamic>\(.\)</MathJax>
        </Button>
        <CursorButton onClick={() => callback('keystroke Left')}>
          <MathJax dynamic>\(\leftarrow\)</MathJax>
        </CursorButton>
        <CursorButton onClick={() => callback('keystroke Right')}>
          <MathJax dynamic>\(\rightarrow\)</MathJax>
        </CursorButton>
        <EnterButton onClick={() => returncallback()}>Enter</EnterButton>
      </Section>
    );

    let sectionControl = (
      <Section style={{ marginTop: '57px' }}>
        {/* <BlueButton onClick={handleToggleFunctions}>functions</BlueButton> */}
        <CursorButton onClick={() => callback('keystroke Left')}>
          <MathJax dynamic>\(\leftarrow\)</MathJax>
        </CursorButton>
        <CursorButton onClick={() => callback('keystroke Right')}>
          <MathJax dynamic>\(\rightarrow\)</MathJax>
        </CursorButton>
        <DeleteButton onClick={() => callback('keystroke Backspace')}>
          <FontAwesomeIcon icon={faBackspace} />
        </DeleteButton>
        <EnterButton onClick={() => returncallback()}>Enter</EnterButton>
        <EnterButton onClick={handleToggleLetters}>ABC</EnterButton>
      </Section>
    );

    return (
      <Panel tabIndex="0" ref={containerRef}>
        {/* <ContainerSection>
          <ToggleButtonSection>
            <ToggleButtonGroup onClick={handleGreekToggle}>
              <ToggleButton value="Greek 1" />
              <ToggleButton value="Greek 2" />
            </ToggleButtonGroup>
          </ToggleButtonSection>
          {toggleGreek === 0
            ? sectionGreek1
            : toggleGreek === 1
              ? sectionGreek2
              : null}
        </ContainerSection> */}
        {/* <VerticalDivider height="230px" marginTop="10px" /> */}
        <ContainerSection>
          <ToggleButtonSection>
            <ToggleButtonGroup onClick={handleFnToggle}>
              <ToggleButton value="123" />
              <ToggleButton value="f(x)" />
              <ToggleButton value="ABC" />
              <ToggleButton value="αβγ" />
              <ToggleButton value="#&¬" />
            </ToggleButtonGroup>
          </ToggleButtonSection>
          {toggleFn === 0
            ? (<ContainerSection>{sectionXYZ}{section123}</ContainerSection>)
            : toggleFn === 1
            ? (<ContainerSection>{sectionTrig1}{sectionFx}</ContainerSection>)
            : toggleFn === 2
              ? (toggleABCCase ? sectionUpperABC : sectionLowerABC)
            : toggleFn === 3
              ? (toggleGreekCase ? sectionUpperGreek : sectionLowerGreek)
            : toggleFn === 4
              ? (<ContainerSection>{sectionSymbols1}{sectionSymbols2}</ContainerSection>)
            : null}
        </ContainerSection>
        {/* <VerticalDivider height="230px" marginTop="10px" /> */}
        <ContainerSection>
          {/* <ToggleButtonSection>
            <ToggleButtonGroup onClick={handleNumpadToggle}>
              <ToggleButton value="123" />
              <ToggleButton value="xy" />
            </ToggleButtonGroup>
          </ToggleButtonSection> */}
          {/* {toggleNumpad === 0
            ? section123
            : toggleNumpad === 1
              ? sectionXYZ
              : null} */}
        </ContainerSection>
        {/* <VerticalDivider height="230px" marginTop="10px" /> */}
        {/* <ControlSection>{sectionControl}</ControlSection> */}
      </Panel>
    );

  // return (
  //   <>
  //     <MathJax.Provider>
  //       {/* <ToggleButton
  //         ref={toggleButtonRef}
  //         toggleState={toggleKeyboard}
  //         onClick={handleToggleKeyboard}
  //       >
  //         <FontAwesomeIcon icon={faKeyboard} />
  //       </ToggleButton> */}
  //       {toggleFunctions ? (
  //         <FunctionPanel tabIndex="0" ref={functionTabRef}>
  //           <TabHeader
  //             onClick={handleTabSelection}
  //             value="Trig"
  //             selected={selectedTab === 'Trig'}
  //           >
  //             Trig
  //           </TabHeader>
  //           <TabHeader
  //             onClick={handleTabSelection}
  //             value="Sets"
  //             selected={selectedTab === 'Sets'}
  //           >
  //             Sets
  //           </TabHeader>
  //           <TabHeader
  //             onClick={handleTabSelection}
  //             value="Misc"
  //             selected={selectedTab === 'Misc'}
  //           >
  //             Misc
  //           </TabHeader>
  //           {selectedTab === 'Trig' ? (
  //             <>
  //               <Button33 onClick={() => callback('cmd \\sin')}>
  //                 <MathJax.Node inline formula={'\\sin'} />
  //               </Button33>
  //               <Button33 onClick={() => callback('write \\sin^{-1}')}>
  //                 <MathJax.Node inline formula={'\\sin^{-1}'} />
  //               </Button33>
  //               <Button33 onClick={() => callback('cmd \\sinh')}>
  //                 <MathJax.Node inline formula={'\\sinh'} />
  //               </Button33>
  //               <Button33 onClick={() => callback('cmd \\tan')}>
  //                 <MathJax.Node inline formula={'\\tan'} />
  //               </Button33>
  //               <Button33 onClick={() => callback('write \\tan^{-1}')}>
  //                 <MathJax.Node inline formula={'\\tan^{-1}'} />
  //               </Button33>
  //               <Button33 onClick={() => callback('cmd \\tanh')}>
  //                 <MathJax.Node inline formula={'\\tanh'} />
  //               </Button33>
  //               <Button33 onClick={() => callback('cmd \\cos')}>
  //                 <MathJax.Node inline formula={'\\cos'} />
  //               </Button33>
  //               <Button33 onClick={() => callback('write \\cos^{-1}')}>
  //                 <MathJax.Node inline formula={'\\cos^{-1}'} />
  //               </Button33>
  //               <Button33 onClick={() => callback('cmd \\cosh')}>
  //                 <MathJax.Node inline formula={'\\cosh'} />
  //               </Button33>
  //               <Button33 onClick={() => callback('cmd \\csc')}>
  //                 <MathJax.Node inline formula={'\\csc'} />
  //               </Button33>
  //               <Button33 onClick={() => callback('write \\csc^{-1}')}>
  //                 <MathJax.Node inline formula={'\\csc^{-1}'} />
  //               </Button33>
  //               <Button33 onClick={() => callback('cmd \\csch')}>
  //                 <MathJax.Node inline formula={'csch'} />
  //               </Button33>
  //               <Button33 onClick={() => callback('cmd \\cot')}>
  //                 <MathJax.Node inline formula={'\\cot'} />
  //               </Button33>
  //               <Button33 onClick={() => callback('write \\cot^{-1}')}>
  //                 <MathJax.Node inline formula={'\\cot^{-1}'} />
  //               </Button33>
  //               <Button33 onClick={() => callback('cmd \\coth')}>
  //                 <MathJax.Node inline formula={'\\coth'} />
  //               </Button33>
  //               <Button33 onClick={() => callback('cmd \\sec')}>
  //                 <MathJax.Node inline formula={'\\sec'} />
  //               </Button33>
  //               <Button33 onClick={() => callback('write \\sec^{-1}')}>
  //                 <MathJax.Node inline formula={'\\sec^{-1}'} />
  //               </Button33>
  //               <Button33 onClick={() => callback('cmd \\sech')}>
  //                 <MathJax.Node inline formula={'sech'} />
  //               </Button33>
  //             </>
  //           ) : selectedTab === 'Sets' ? (
  //             <>
  //               <Button33 onClick={() => callback('write \\cup')}>
  //                 <MathJax.Node inline formula={'\\cup'} />
  //               </Button33>
  //               <Button33 onClick={() => callback('write \\cap')}>
  //                 <MathJax.Node inline formula={'\\cap'} />
  //               </Button33>
  //               <Button33 onClick={() => callback('write \\subset')}>
  //                 <MathJax.Node inline formula={'\\subset'} />
  //               </Button33>
  //               <Button33 onClick={() => callback('write \\supset')}>
  //                 <MathJax.Node inline formula={'\\supset'} />
  //               </Button33>
  //               <Button33 onClick={() => callback('write \\subseteq')}>
  //                 <MathJax.Node inline formula={'\\subseteq'} />
  //               </Button33>
  //               <Button33 onClick={() => callback('write \\supseteq')}>
  //                 <MathJax.Node inline formula={'\\supseteq'} />
  //               </Button33>
  //               <Button33 onClick={() => callback('write \\nsubseteq')}>
  //                 <MathJax.Node inline formula={'\\nsubseteq'} />
  //               </Button33>
  //               <Button33 onClick={() => callback('write \\nsupseteq')}>
  //                 <MathJax.Node inline formula={'\\nsupseteq'} />
  //               </Button33>
  //               <Button33 onClick={() => callback('write \\emptyset')}>
  //                 <MathJax.Node inline formula={'\\emptyset'} />
  //               </Button33>
  //             </>
  //           ) : (
  //             <>
  //               <Button33
  //                 onClick={() =>
  //                   callback('write \\frac{\\partial}{\\partial{x}}')
  //                 }
  //               >
  //                 <MathJax.Node
  //                   inline
  //                   formula={'\\frac{\\partial}{\\partial x}'}
  //                 />
  //               </Button33>
  //               <Button33 onClick={() => callback('write \\int')}>
  //                 <MathJax.Node inline formula={'\\int'} />
  //               </Button33>
  //               <Button33 onClick={() => callback('write \\frac{d}{dx}')}>
  //                 <MathJax.Node inline formula={'\\frac{d}{dx}'} />
  //               </Button33>
  //               <Button33 onClick={() => callback('write \\log_{}')}>
  //                 <MathJax.Node inline formula={'\\log_ab'} />
  //               </Button33>
  //               <Button33 onClick={() => callback('cmd \\ln')}>
  //                 <MathJax.Node inline formula={'\\ln'} />
  //               </Button33>
  //               <Button33
  //                 onClick={() => {
  //                   callback('write e^{}');
  //                   callback('keystroke Left');
  //                 }}
  //               >
  //                 <MathJax.Node inline formula={'e^{x}'} />
  //               </Button33>
  //               <Button33
  //                 onClick={() => {
  //                   callback('write 10^{}');
  //                   callback('keystroke Left');
  //                 }}
  //               >
  //                 <MathJax.Node inline formula={'10^{x}'} />
  //               </Button33>
  //             </>
  //           )}
  //         </FunctionPanel>
  //       ) : null}
  //       {toggleKeyboard ? (
  //         toggleLetters ? (
  //           toggleCase ? (
  //             <Panel tabIndex="0" ref={containerRef}>
  //               <LettersSection>
  //                 <LetterButton onClick={() => callback('write Q')}>
  //                   Q
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write W')}>
  //                   W
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write E')}>
  //                   E
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write R')}>
  //                   R
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write T')}>
  //                   T
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write Y')}>
  //                   Y
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write U')}>
  //                   U
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write I')}>
  //                   I
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write O')}>
  //                   O
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write P')}>
  //                   P
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write A')}>
  //                   A
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write S')}>
  //                   S
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write D')}>
  //                   D
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write F')}>
  //                   F
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write G')}>
  //                   G
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write H')}>
  //                   H
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write J')}>
  //                   J
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write K')}>
  //                   K
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write L')}>
  //                   L
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write \\tau')}>
  //                   <MathJax.Node inline formula={'\\tau'} />
  //                 </LetterButton>
  //                 <Gray15Button onClick={handleToggleCase}>
  //                   <FontAwesomeIcon icon={faArrowUp} />
  //                 </Gray15Button>
  //                 <LetterButton onClick={() => callback('write Z')}>
  //                   Z
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write X')}>
  //                   X
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write C')}>
  //                   C
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write V')}>
  //                   V
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write B')}>
  //                   B
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write N')}>
  //                   N
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write M')}>
  //                   M
  //                 </LetterButton>
  //                 <Gray15Button onClick={() => callback('keystroke Backspace')}>
  //                   <FontAwesomeIcon icon={faBackspace} />
  //                 </Gray15Button>
  //                 <Gray20Button onClick={handleToggleLetters}>123</Gray20Button>
  //                 <LetterButton onClick={() => callback('cmd ^')}>
  //                   <MathJax.Node inline formula={'a^b'} />
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write %')}>
  //                   %
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('cmd ]')}>
  //                   ]
  //                 </LetterButton>
  //                 <LetterButton
  //                   onClick={() => callback('cmd }')}
  //                 >{`}`}</LetterButton>
  //                 <LetterButton onClick={() => callback('write :')}>
  //                   :
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback("write '")}>
  //                   '
  //                 </LetterButton>
  //                 <Blue20Button onClick={() => returncallback()}>
  //                   <FontAwesomeIcon
  //                     icon={faLevelDownAlt}
  //                     transform={{ rotate: 90 }}
  //                   />
  //                 </Blue20Button>
  //               </Section>
  //             </Panel>
  //           ) : (
  //             <Panel tabIndex="0" ref={containerRef}>
  //               <LettersSection>
  //                 <LetterButton onClick={() => callback('write q')}>
  //                   q
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write w')}>
  //                   w
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write e')}>
  //                   e
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write r')}>
  //                   r
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write t')}>
  //                   t
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write y')}>
  //                   y
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write u')}>
  //                   u
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write i')}>
  //                   i
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write o')}>
  //                   o
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write p')}>
  //                   p
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write a')}>
  //                   a
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write s')}>
  //                   s
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write d')}>
  //                   d
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write f')}>
  //                   f
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write g')}>
  //                   g
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write h')}>
  //                   h
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write j')}>
  //                   j
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write k')}>
  //                   k
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write l')}>
  //                   l
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write \\theta')}>
  //                   <MathJax.Node inline formula={'\\theta'} />
  //                 </LetterButton>
  //                 <Gray15Button onClick={handleToggleCase}>
  //                   <FontAwesomeIcon icon={faArrowUp} />
  //                 </Gray15Button>
  //                 <LetterButton onClick={() => callback('write z')}>
  //                   z
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write x')}>
  //                   x
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write c')}>
  //                   c
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write v')}>
  //                   v
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write b')}>
  //                   b
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write n')}>
  //                   n
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write m')}>
  //                   m
  //                 </LetterButton>
  //                 <Gray15Button onClick={() => callback('keystroke Backspace')}>
  //                   <FontAwesomeIcon icon={faBackspace} />
  //                 </Gray15Button>
  //                 <Gray20Button onClick={handleToggleLetters}>123</Gray20Button>
  //                 <LetterButton onClick={() => callback('cmd _')}>
  //                   <MathJax.Node inline formula={'a_b'} />
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write !')}>
  //                   !
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('cmd [')}>
  //                   [
  //                 </LetterButton>
  //                 <LetterButton
  //                   onClick={() => callback('cmd {')}
  //                 >{`{`}</LetterButton>
  //                 <LetterButton onClick={() => callback('write ~')}>
  //                   ~
  //                 </LetterButton>
  //                 <LetterButton onClick={() => callback('write ,')}>
  //                   ,
  //                 </LetterButton>
  //                 <Blue20Button onClick={() => returncallback()}>
  //                   <FontAwesomeIcon
  //                     icon={faLevelDownAlt}
  //                     transform={{ rotate: 90 }}
  //                   />
  //                 </Blue20Button>
  //               </LettersSection>
  //             </Panel>
  //           )
  //         ) : (
  //           <Panel
  //             tabIndex="0"
  //             ref={containerRef}
  //             // onBlur={(e) => {
  //             //   if (
  //             //     functionTabRef &&
  //             //     functionTabRef.current &&
  //             //     functionTabRef.current.contains(e.relatedTarget)
  //             //   ) {
  //             //     console.log('>>> clicked inside the panel functional panel');
  //             //   } else {
  //             //     console.log('blurred');
  //             //     setToggleFunctions(false);
  //             //   }
  //             // }}
  //           >
  //             <Section>
  //               <Button onClick={() => callback('write x')}>
  //                 <MathJax.Node inline formula={'x'} />
  //               </Button>
  //             </Section>

  //             <Section>
  //               <Button onClick={() => callback('write x')}>
  //                 <MathJax.Node inline formula={'x'} />
  //               </Button>
  //               <Button onClick={() => callback('write y')}>
  //                 <MathJax.Node inline formula={'y'} />
  //               </Button>
  //               <Button onClick={() => callback('type ^2')}>
  //                 <MathJax.Node inline formula={'a^2'} />
  //               </Button>
  //               <Button onClick={() => callback('cmd ^')}>
  //                 <MathJax.Node inline formula={'a^b'} />
  //               </Button>
  //               <Button onClick={() => callback('cmd (')}>
  //                 <MathJax.Node inline formula={'('} />
  //               </Button>
  //               <Button onClick={() => callback('keystroke Right')}>
  //                 <MathJax.Node inline formula={')'} />
  //               </Button>
  //               <Button onClick={() => callback('write <')}>
  //                 <MathJax.Node inline formula={'<'} />
  //               </Button>
  //               <Button onClick={() => callback('write >')}>
  //                 <MathJax.Node inline formula={'>'} />
  //               </Button>
  //               <Button onClick={() => callback('cmd |')}>
  //                 <MathJax.Node inline formula={'|a|'} />
  //               </Button>
  //               <Button onClick={() => callback('write ,')}>
  //                 <MathJax.Node inline formula={','} />
  //               </Button>
  //               <Button onClick={() => callback('type <=')}>
  //                 <MathJax.Node inline formula={'\\leq'} />
  //               </Button>
  //               <Button onClick={() => callback('type >=')}>
  //                 <MathJax.Node inline formula={'\\geq'} />
  //               </Button>
  //               <GrayButton onClick={handleToggleLetters}>
  //                 <MathJax.Node inline formula={'ABC'} />
  //               </GrayButton>
  //               <Button onClick={() => callback('type sqrt')}>
  //                 <MathJax.Node inline formula={'\\sqrt{}'} />
  //               </Button>
  //               <Button onClick={() => callback('type theta')}>
  //                 <MathJax.Node inline formula={'\\theta'} />
  //               </Button>
  //               <Button onClick={() => callback('type pi')}>
  //                 <MathJax.Node inline formula={'\\pi'} />
  //               </Button>
  //             </Section>
  //             <Section>
  //               <GrayButton onClick={() => callback('write 7')}>
  //                 <MathJax.Node inline formula={'7'} />
  //               </GrayButton>
  //               <GrayButton onClick={() => callback('write 8')}>
  //                 <MathJax.Node inline formula={'8'} />
  //               </GrayButton>
  //               <GrayButton onClick={() => callback('write 9')}>
  //                 <MathJax.Node inline formula={'9'} />
  //               </GrayButton>
  //               <Button onClick={() => callback('cmd /')}>
  //                 <MathJax.Node inline formula={'\\div'} />
  //               </Button>
  //               <GrayButton onClick={() => callback('write 4')}>
  //                 <MathJax.Node inline formula={'4'} />
  //               </GrayButton>
  //               <GrayButton onClick={() => callback('write 5')}>
  //                 <MathJax.Node inline formula={'5'} />
  //               </GrayButton>
  //               <GrayButton onClick={() => callback('write 6')}>
  //                 <MathJax.Node inline formula={'6'} />
  //               </GrayButton>
  //               <Button onClick={() => callback('type *')}>
  //                 <MathJax.Node inline formula={'\\times'} />
  //               </Button>
  //               <GrayButton onClick={() => callback('write 1')}>
  //                 <MathJax.Node inline formula={'1'} />
  //               </GrayButton>
  //               <GrayButton onClick={() => callback('write 2')}>
  //                 <MathJax.Node inline formula={'2'} />
  //               </GrayButton>
  //               <GrayButton onClick={() => callback('write 3')}>
  //                 <MathJax.Node inline formula={'3'} />
  //               </GrayButton>
  //               <Button onClick={() => callback('cmd -')}>
  //                 <MathJax.Node inline formula={'-'} />
  //               </Button>
  //               <GrayButton onClick={() => callback('write 0')}>
  //                 <MathJax.Node inline formula={'0'} />
  //               </GrayButton>
  //               <GrayButton onClick={() => callback('write .')}>
  //                 <MathJax.Node inline formula={'.'} />
  //               </GrayButton>
  //               <Button onClick={() => callback('write =')}>
  //                 <MathJax.Node inline formula={'='} />
  //               </Button>
  //               <Button onClick={() => callback('write +')}>
  //                 <MathJax.Node inline formula={'+'} />
  //               </Button>
  //             </Section>
  //             <Section>
  //               <BlueButton onClick={handleToggleFunctions}>
  //                 functions
  //               </BlueButton>
  //               <CursorButton onClick={() => callback('keystroke Left')}>
  //                 <MathJax.Node inline formula={'\\leftarrow'} />
  //               </CursorButton>
  //               <CursorButton onClick={() => callback('keystroke Right')}>
  //                 <MathJax.Node inline formula={'\\rightarrow'} />
  //               </CursorButton>
  //               <DeleteButton onClick={() => callback('keystroke Backspace')}>
  //                 <FontAwesomeIcon icon={faBackspace} />
  //               </DeleteButton>
  //               <BlueButton onClick={() => returncallback()}>
  //                 <FontAwesomeIcon
  //                   icon={faLevelDownAlt}
  //                   transform={{ rotate: 90 }}
  //                 />
  //               </BlueButton>
  //             </Section>
  //           </Panel>
  //         )
  //       ) : null}
  //     </MathJax.Provider>
  //   </>
  // );
}
