import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import MathJax from 'react-mathjax';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ToggleButton from '../../../_reactComponents/PanelHeaderComponents/ToggleButton';
import ToggleButtonGroup from '../../../_reactComponents/PanelHeaderComponents/ToggleButtonGroup';
import VerticalDivider from '../../../_reactComponents/PanelHeaderComponents/VerticalDivider';

import { faBackspace, faArrowUp } from '@fortawesome/free-solid-svg-icons';

import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

import {
  focusedMathField,
  palletRef,
  focusedMathFieldReturn,
} from './MathInputSelector';

import { panelOpen } from '../Panels/Panel';

import { doenetMainBlue } from '../../../_reactComponents/PanelHeaderComponents/theme';

import { useRef } from 'react';

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
  const [toggleKeyboard, setToggleKeyboard] = useRecoilState(
    panelOpen('keyboard'),
  );
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
    setPalletRef({ ...containerRef });
    //console.log(">>> ref: ", containerRef, toggleButtonRef, functionTabRef)
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
      return (
        <MathJax.Provider>
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
              <LetterButton onClick={() => callback('write \\tau')}>
                <MathJax.Node inline formula={'\\tau'} />
              </LetterButton>
              <White15Button onClick={handleToggleCase}>
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
              <White20Button onClick={handleToggleLetters}>123</White20Button>
              <LetterButton onClick={() => callback('cmd ^')}>
                <MathJax.Node inline formula={'a^b'} />
              </LetterButton>
              <LetterButton onClick={() => callback('write %')}>%</LetterButton>
              <LetterButton onClick={() => callback('cmd ]')}>]</LetterButton>
              <LetterButton
                onClick={() => callback('cmd }')}
              >{`}`}</LetterButton>
              <LetterButton onClick={() => callback('write :')}>:</LetterButton>
              <LetterButton onClick={() => callback("write '")}>'</LetterButton>
              <White20Button onClick={() => returncallback()}>
                Enter
              </White20Button>
            </LettersSection>
          </Panel>
        </MathJax.Provider>
      );
    } else {
      return (
        <MathJax.Provider>
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
              <LetterButton onClick={() => callback('write \\theta')}>
                <MathJax.Node inline formula={'\\theta'} />
              </LetterButton>
              <White15Button onClick={handleToggleCase}>
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
              <White20Button onClick={handleToggleLetters}>123</White20Button>
              <LetterButton onClick={() => callback('cmd _')}>
                <MathJax.Node inline formula={'a_b'} />
              </LetterButton>
              <LetterButton onClick={() => callback('write !')}>!</LetterButton>
              <LetterButton onClick={() => callback('cmd [')}>[</LetterButton>
              <LetterButton
                onClick={() => callback('cmd {')}
              >{`{`}</LetterButton>
              <LetterButton onClick={() => callback('write ~')}>~</LetterButton>
              <LetterButton onClick={() => callback('write ,')}>,</LetterButton>
              <White20Button onClick={() => returncallback()}>
                Enter
              </White20Button>
            </LettersSection>
          </Panel>
        </MathJax.Provider>
      );
    }
  } else {
    let sectionSet = (
      <Section>
        <Button33 onClick={() => callback('write \\cup')}>
          <MathJax.Node inline formula={'\\cup'} />
        </Button33>
        <Button33 onClick={() => callback('write \\cap')}>
          <MathJax.Node inline formula={'\\cap'} />
        </Button33>
        <Button33 onClick={() => callback('write \\subset')}>
          <MathJax.Node inline formula={'\\subset'} />
        </Button33>
        <Button33 onClick={() => callback('write \\supset')}>
          <MathJax.Node inline formula={'\\supset'} />
        </Button33>
        <Button33 onClick={() => callback('write \\subseteq')}>
          <MathJax.Node inline formula={'\\subseteq'} />
        </Button33>
        <Button33 onClick={() => callback('write \\supseteq')}>
          <MathJax.Node inline formula={'\\supseteq'} />
        </Button33>
        <Button33 onClick={() => callback('write \\nsubseteq')}>
          <MathJax.Node inline formula={'\\nsubseteq'} />
        </Button33>
        <Button33 onClick={() => callback('write \\nsupseteq')}>
          <MathJax.Node inline formula={'\\nsupseteq'} />
        </Button33>
        <Button33 onClick={() => callback('write \\emptyset')}>
          <MathJax.Node inline formula={'\\emptyset'} />
        </Button33>
      </Section>
    );
    let sectionTrig1 = (
      <Section>
        <Button33 onClick={() => callback('cmd \\sin')}>
          <MathJax.Node inline formula={'\\sin'} />
        </Button33>
        <Button33 onClick={() => callback('cmd \\cos')}>
          <MathJax.Node inline formula={'\\cos'} />
        </Button33>
        <Button33 onClick={() => callback('cmd \\tan')}>
          <MathJax.Node inline formula={'\\tan'} />
        </Button33>
        <Button33 onClick={() => callback('write \\sin^{-1}')}>
          <MathJax.Node inline formula={'\\sin^{-1}'} />
        </Button33>
        <Button33 onClick={() => callback('write \\cos^{-1}')}>
          <MathJax.Node inline formula={'\\cos^{-1}'} />
        </Button33>
        <Button33 onClick={() => callback('write \\tan^{-1}')}>
          <MathJax.Node inline formula={'\\tan^{-1}'} />
        </Button33>
        <Button33 onClick={() => callback('cmd \\sinh')}>
          <MathJax.Node inline formula={'\\sinh'} />
        </Button33>
        <Button33 onClick={() => callback('cmd \\tanh')}>
          <MathJax.Node inline formula={'\\tanh'} />
        </Button33>
        <Button33 onClick={() => callback('cmd \\cosh')}>
          <MathJax.Node inline formula={'\\cosh'} />
        </Button33>
      </Section>
    );
    let sectionTrig2 = (
      <Section>
        <Button33 onClick={() => callback('cmd \\csc')}>
          <MathJax.Node inline formula={'\\csc'} />
        </Button33>
        <Button33 onClick={() => callback('cmd \\sec')}>
          <MathJax.Node inline formula={'\\sec'} />
        </Button33>
        <Button33 onClick={() => callback('cmd \\cot')}>
          <MathJax.Node inline formula={'\\cot'} />
        </Button33>
        <Button33 onClick={() => callback('write \\csc^{-1}')}>
          <MathJax.Node inline formula={'\\csc^{-1}'} />
        </Button33>
        <Button33 onClick={() => callback('write \\sec^{-1}')}>
          <MathJax.Node inline formula={'\\sec^{-1}'} />
        </Button33>
        <Button33 onClick={() => callback('write \\cot^{-1}')}>
          <MathJax.Node inline formula={'\\cot^{-1}'} />
        </Button33>
        <Button33 onClick={() => callback('cmd \\csch')}>
          <MathJax.Node inline formula={'csch'} />
        </Button33>
        <Button33 onClick={() => callback('cmd \\coth')}>
          <MathJax.Node inline formula={'\\coth'} />
        </Button33>
        <Button33 onClick={() => callback('cmd \\sech')}>
          <MathJax.Node inline formula={'sech'} />
        </Button33>
      </Section>
    );
    let sectionFn = (
      <Section>
        <Button33
          onClick={() => callback('write \\frac{\\partial}{\\partial{x}}')}
        >
          <MathJax.Node inline formula={'\\frac{\\partial}{\\partial x}'} />
        </Button33>
        <Button33 onClick={() => callback('write \\int')}>
          <MathJax.Node inline formula={'\\int'} />
        </Button33>
        <Button33 onClick={() => callback('write \\frac{d}{dx}')}>
          <MathJax.Node inline formula={'\\frac{d}{dx}'} />
        </Button33>
        <Button33 onClick={() => callback('write \\log_{}')}>
          <MathJax.Node inline formula={'\\log_ab'} />
        </Button33>
        <Button33 onClick={() => callback('cmd \\ln')}>
          <MathJax.Node inline formula={'\\ln'} />
        </Button33>
        <Button33
          onClick={() => {
            callback('write e^{}');
            callback('keystroke Left');
          }}
        >
          <MathJax.Node inline formula={'e^{x}'} />
        </Button33>
        <Button33
          onClick={() => {
            callback('write 10^{}');
            callback('keystroke Left');
          }}
        >
          <MathJax.Node inline formula={'10^{x}'} />
        </Button33>
      </Section>
    );

    let sectionGreekNone = null;

    let sectionGreek1 = (
      <Section>
        <Button onClick={() => callback('write \\alpha')}>
          <MathJax.Node inline formula={'\\alpha'} />
        </Button>
        <Button onClick={() => callback('write \\epsilon')}>
          <MathJax.Node inline formula={'\\epsilon'} />
        </Button>
        <Button onClick={() => callback('write \\kappa')}>
          <MathJax.Node inline formula={'\\kappa'} />
        </Button>
        <Button onClick={() => callback('write \\xi')}>
          <MathJax.Node inline formula={'\\xi'} />
        </Button>
        <Button onClick={() => callback('write \\beta')}>
          <MathJax.Node inline formula={'\\beta'} />
        </Button>
        <Button onClick={() => callback('write \\zeta')}>
          <MathJax.Node inline formula={'\\zeta'} />
        </Button>
        <Button onClick={() => callback('write \\lambda')}>
          <MathJax.Node inline formula={'\\lambda'} />
        </Button>
        <Button onClick={() => callback('write \\pi')}>
          <MathJax.Node inline formula={'\\pi'} />
        </Button>
        <Button onClick={() => callback('write \\gamma')}>
          <MathJax.Node inline formula={'\\gamma'} />
        </Button>
        <Button onClick={() => callback('write \\eta')}>
          <MathJax.Node inline formula={'\\eta'} />
        </Button>
        <Button onClick={() => callback('write \\mu')}>
          <MathJax.Node inline formula={'\\mu'} />
        </Button>
        <Button onClick={() => callback('write \\rho')}>
          <MathJax.Node inline formula={'\\rho'} />
        </Button>
        <Button onClick={() => callback('write \\delta')}>
          <MathJax.Node inline formula={'\\delta'} />
        </Button>
        <Button onClick={() => callback('write \\theta')}>
          <MathJax.Node inline formula={'\\theta'} />
        </Button>
        <Button onClick={() => callback('write \\nu')}>
          <MathJax.Node inline formula={'\\nu'} />
        </Button>
        <Button onClick={() => callback('write \\sigma')}>
          <MathJax.Node inline formula={'\\sigma'} />
        </Button>
      </Section>
    );
    let sectionGreek2 = (
      <Section>
        <Button onClick={() => callback('write \\tau')}>
          <MathJax.Node inline formula={'\\tau'} />
        </Button>
        <Button onClick={() => callback('write \\Lambda')}>
          <MathJax.Node inline formula={'\\Lambda'} />
        </Button>
        <Button onClick={() => callback('write \\Upsilon')}>
          <MathJax.Node inline formula={'\\Upsilon'} />
        </Button>
        <Button onClick={() => callback('write \\Gamma')}>
          <MathJax.Node inline formula={'\\Gamma'} />
        </Button>
        <Button onClick={() => callback('write \\phi')}>
          <MathJax.Node inline formula={'\\phi'} />
        </Button>
        <Button onClick={() => callback('write \\Xi')}>
          <MathJax.Node inline formula={'\\Xi'} />
        </Button>
        <Button onClick={() => callback('write \\Phi')}>
          <MathJax.Node inline formula={'\\Phi'} />
        </Button>
        <Button onClick={() => callback('write \\Delta')}>
          <MathJax.Node inline formula={'\\Delta'} />
        </Button>
        <Button onClick={() => callback('write \\psi')}>
          <MathJax.Node inline formula={'\\psi'} />
        </Button>
        <Button onClick={() => callback('write \\Pi')}>
          <MathJax.Node inline formula={'\\Pi'} />
        </Button>
        <Button onClick={() => callback('write \\Psi')}>
          <MathJax.Node inline formula={'\\Psi'} />
        </Button>
        <Button onClick={() => callback('write \\Theta')}>
          <MathJax.Node inline formula={'\\Theta'} />
        </Button>
        <Button onClick={() => callback('write \\omega')}>
          <MathJax.Node inline formula={'\\omega'} />
        </Button>
        <Button onClick={() => callback('write \\Sigma')}>
          <MathJax.Node inline formula={'\\Sigma'} />
        </Button>
        <Button onClick={() => callback('write \\Omega')}>
          <MathJax.Node inline formula={'\\Omega'} />
        </Button>
      </Section>
    );

    let sectionXYZ = (
      <Section>
        <Button onClick={() => callback('write x')}>
          <MathJax.Node inline formula={'x'} />
        </Button>
        <Button onClick={() => callback('write y')}>
          <MathJax.Node inline formula={'y'} />
        </Button>
        <Button onClick={() => callback('type ^2')}>
          <MathJax.Node inline formula={'a^2'} />
        </Button>
        <Button onClick={() => callback('cmd ^')}>
          <MathJax.Node inline formula={'a^b'} />
        </Button>
        <Button onClick={() => callback('cmd (')}>
          <MathJax.Node inline formula={'('} />
        </Button>
        <Button onClick={() => callback('keystroke Right')}>
          <MathJax.Node inline formula={')'} />
        </Button>
        <Button onClick={() => callback('write <')}>
          <MathJax.Node inline formula={'<'} />
        </Button>
        <Button onClick={() => callback('write >')}>
          <MathJax.Node inline formula={'>'} />
        </Button>
        <Button onClick={() => callback('cmd |')}>
          <MathJax.Node inline formula={'|a|'} />
        </Button>
        <Button onClick={() => callback('write ,')}>
          <MathJax.Node inline formula={','} />
        </Button>
        <Button onClick={() => callback('type <=')}>
          <MathJax.Node inline formula={'\\leq'} />
        </Button>
        <Button onClick={() => callback('type >=')}>
          <MathJax.Node inline formula={'\\geq'} />
        </Button>
        <Button onClick={() => callback('cmd /')}>
          <MathJax.Node inline formula={'\\div'} />
        </Button>
        <Button onClick={() => callback('type sqrt')}>
          <MathJax.Node inline formula={'\\sqrt{}'} />
        </Button>
        <Button onClick={() => callback('type theta')}>
          <MathJax.Node inline formula={'\\theta'} />
        </Button>
        <Button onClick={() => callback('type pi')}>
          <MathJax.Node inline formula={'\\pi'} />
        </Button>
      </Section>
    );

    let section123 = (
      <Section>
        <Button onClick={() => callback('write 7')}>
          <MathJax.Node inline formula={'7'} />
        </Button>
        <Button onClick={() => callback('write 8')}>
          <MathJax.Node inline formula={'8'} />
        </Button>
        <Button onClick={() => callback('write 9')}>
          <MathJax.Node inline formula={'9'} />
        </Button>
        <Button onClick={() => callback('cmd /')}>
          <MathJax.Node inline formula={'\\div'} />
        </Button>
        <Button onClick={() => callback('write 4')}>
          <MathJax.Node inline formula={'4'} />
        </Button>
        <Button onClick={() => callback('write 5')}>
          <MathJax.Node inline formula={'5'} />
        </Button>
        <Button onClick={() => callback('write 6')}>
          <MathJax.Node inline formula={'6'} />
        </Button>
        <Button onClick={() => callback('type *')}>
          <MathJax.Node inline formula={'\\times'} />
        </Button>
        <Button onClick={() => callback('write 1')}>
          <MathJax.Node inline formula={'1'} />
        </Button>
        <Button onClick={() => callback('write 2')}>
          <MathJax.Node inline formula={'2'} />
        </Button>
        <Button onClick={() => callback('write 3')}>
          <MathJax.Node inline formula={'3'} />
        </Button>
        <Button onClick={() => callback('cmd -')}>
          <MathJax.Node inline formula={'-'} />
        </Button>
        <Button onClick={() => callback('write 0')}>
          <MathJax.Node inline formula={'0'} />
        </Button>
        <Button onClick={() => callback('write .')}>
          <MathJax.Node inline formula={'.'} />
        </Button>
        <Button onClick={() => callback('write =')}>
          <MathJax.Node inline formula={'='} />
        </Button>
        <Button onClick={() => callback('write +')}>
          <MathJax.Node inline formula={'+'} />
        </Button>
      </Section>
    );

    let sectionControl = (
      <Section style={{ marginTop: '57px' }}>
        {/* <BlueButton onClick={handleToggleFunctions}>functions</BlueButton> */}
        <CursorButton onClick={() => callback('keystroke Left')}>
          <MathJax.Node inline formula={'\\leftarrow'} />
        </CursorButton>
        <CursorButton onClick={() => callback('keystroke Right')}>
          <MathJax.Node inline formula={'\\rightarrow'} />
        </CursorButton>
        <DeleteButton onClick={() => callback('keystroke Backspace')}>
          <FontAwesomeIcon icon={faBackspace} />
        </DeleteButton>
        <EnterButton onClick={() => returncallback()}>Enter</EnterButton>
        <EnterButton onClick={handleToggleLetters}>ABC</EnterButton>
      </Section>
    );

    return (
      <MathJax.Provider>
        <Panel tabIndex="0" ref={containerRef}>
          <ContainerSection>
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
          </ContainerSection>
          <VerticalDivider height="230px" marginTop="10px" />
          <ContainerSection>
            <ToggleButtonSection>
              <ToggleButtonGroup onClick={handleFnToggle}>
                <ToggleButton value="Trig 1" />
                <ToggleButton value="Trig 2" />
                <ToggleButton value="Set" />
                <ToggleButton value="Fn" />
              </ToggleButtonGroup>
            </ToggleButtonSection>
            {toggleFn === 0
              ? sectionTrig1
              : toggleFn === 1
              ? sectionTrig2
              : toggleFn === 2
              ? sectionSet
              : toggleFn === 3
              ? sectionFn
              : null}
          </ContainerSection>
          <VerticalDivider height="230px" marginTop="10px" />
          <ContainerSection>
            <ToggleButtonSection>
              <ToggleButtonGroup onClick={handleNumpadToggle}>
                <ToggleButton value="123" />
                <ToggleButton value="xy" />
              </ToggleButtonGroup>
            </ToggleButtonSection>
            {toggleNumpad === 0
              ? section123
              : toggleNumpad === 1
              ? sectionXYZ
              : null}
          </ContainerSection>
          <VerticalDivider height="230px" marginTop="10px" />
          <ControlSection>{sectionControl}</ControlSection>
        </Panel>
      </MathJax.Provider>
    );
  }

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
  //               </LettersSection>
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
