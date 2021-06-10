import React, { useState, useEffect } from "react";
//import "./styles.css";
import styled from "styled-components";
import MathJax from "react-mathjax";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLevelDownAlt,
  faBackspace,
  faKeyboard,
  faArrowUp
} from "@fortawesome/free-solid-svg-icons";

import { useRecoilValue, useSetRecoilState } from 'recoil';

import { focusedMathField, palletRef, buttonRef, functionRef } from './MathInputSelector'
import { useRef } from "react";

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
  border-bottom: ${(props) => (props.selected ? "0.5px solid gray" : "0")};
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
  bottom: ${(props) => (props.toggleState ? "247px" : "5px")};
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
  const containerRef = useRef(null)
  const toggleButtonRef = useRef(null)
  const functionTabRef = useRef(null)


  useEffect(() => {
    setPalletRef({...containerRef});
    setButtonRef({...toggleButtonRef});
    setFunctionRef({...functionTabRef});
    console.log(">>> ref: ", containerRef, toggleButtonRef, functionTabRef)
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

  return (
    <div>
      <ToggleButton ref = {toggleButtonRef} toggleState={toggleKeyboard} onClick={handleToggleKeyboard}>
        <FontAwesomeIcon icon={faKeyboard} />
      </ToggleButton>
      {toggleFunctions ? (
        <FunctionPanel tabIndex = "0" ref = {functionTabRef}>
          <TabHeader
            onClick={handleTabSelection}
            value="Trig"
            selected={selectedTab === "Trig"}
          >
            Trig
          </TabHeader>
          <TabHeader
            onClick={handleTabSelection}
            value="Stat"
            selected={selectedTab === "Stat"}
          >
            Stat
          </TabHeader>
          <TabHeader
            onClick={handleTabSelection}
            value="Misc"
            selected={selectedTab === "Misc"}
          >
            Misc
          </TabHeader>
          {selectedTab === "Trig" ? (
            <>
              <Button33 onClick = {() => callback('cmd \\sin')}>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"\\sin"} />
                </MathJax.Provider>
              </Button33>
              <Button33 onClick = {() => callback('write \\sin^{-1}')}>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"\\sin^{-1}"} />
                </MathJax.Provider>
              </Button33>
              <Button33 onClick = {() => callback('cmd \\sinh')}>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"\\sinh"} />
                </MathJax.Provider>
              </Button33>
              <Button33 onClick = {() => callback('cmd \\tan')}>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"\\tan"} />
                </MathJax.Provider>
              </Button33>
              <Button33 onClick = {() => callback('write \\tan^{-1}')}>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"\\tan^{-1}"} />
                </MathJax.Provider>
              </Button33>
              <Button33 onClick = {() => callback('cmd \\tanh')}>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"\\tanh"} />
                </MathJax.Provider>
              </Button33>
              <Button33 onClick = {() => callback('cmd \\cos')}>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"\\cos"} />
                </MathJax.Provider>
              </Button33>
              <Button33 onClick = {() => callback('write \\cos^{-1}')}>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"\\cos^{-1}"} />
                </MathJax.Provider>
              </Button33>
              <Button33 onClick = {() => callback('cmd \\cosh')}>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"\\cosh"} />
                </MathJax.Provider>
              </Button33>
              <Button33 onClick = {() => callback('cmd \\csc')}>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"\\csc"} />
                </MathJax.Provider>
              </Button33>
              <Button33 onClick = {() => callback('write \\csc^{-1}')}>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"\\csc^{-1}"} />
                </MathJax.Provider>
              </Button33>
              <Button33 onClick = {() => callback('cmd \\csch')}>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"csch"} />
                </MathJax.Provider>
              </Button33>
              <Button33 onClick = {() => callback('cmd \\cot')}>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"\\cot"} />
                </MathJax.Provider>
              </Button33>
              <Button33 onClick = {() => callback('write \\cot^{-1}')}>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"\\cot^{-1}"} />
                </MathJax.Provider>
              </Button33>
              <Button33 onClick = {() => callback('cmd \\coth')}>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"\\coth"} />
                </MathJax.Provider>
              </Button33>
              <Button33 onClick = {() => callback('cmd \\sec')}>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"\\sec"} />
                </MathJax.Provider>
              </Button33>
              <Button33 onClick = {() => callback('write \\sec^{-1}')}>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"\\sec^{-1}"} />
                </MathJax.Provider>
              </Button33>
              <Button33 onClick = {() => callback('cmd \\sech')}>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"sech"} />
                </MathJax.Provider>
              </Button33>
            </>
          ) : selectedTab === "Stat" ? (
            <Button>mean</Button>
          ) : (
            <Button>ceil</Button>
          )}
        </FunctionPanel>
      ) : null}
      {toggleKeyboard ? (
        toggleLetters ? (
          toggleCase ? (
            <Panel tabIndex = "0" ref = {containerRef}>
              <LettersSection>
                <LetterButton>Q</LetterButton>
                <LetterButton>W</LetterButton>
                <LetterButton>E</LetterButton>
                <LetterButton>R</LetterButton>
                <LetterButton>T</LetterButton>
                <LetterButton>Y</LetterButton>
                <LetterButton>U</LetterButton>
                <LetterButton>I</LetterButton>
                <LetterButton>O</LetterButton>
                <LetterButton>P</LetterButton>
                <LetterButton>A</LetterButton>
                <LetterButton>S</LetterButton>
                <LetterButton>D</LetterButton>
                <LetterButton>F</LetterButton>
                <LetterButton>G</LetterButton>
                <LetterButton>H</LetterButton>
                <LetterButton>J</LetterButton>
                <LetterButton>K</LetterButton>
                <LetterButton>L</LetterButton>
                <LetterButton>
                  <MathJax.Provider>
                    <MathJax.Node inline formula={"\\tau"} />
                  </MathJax.Provider>
                </LetterButton>
                <Gray15Button onClick={handleToggleCase}>
                  <FontAwesomeIcon icon={faArrowUp} />
                </Gray15Button>
                <LetterButton>Z</LetterButton>
                <LetterButton>X</LetterButton>
                <LetterButton>C</LetterButton>
                <LetterButton>V</LetterButton>
                <LetterButton>B</LetterButton>
                <LetterButton>N</LetterButton>
                <LetterButton>M</LetterButton>
                <Gray15Button>
                  <FontAwesomeIcon icon={faBackspace} />
                </Gray15Button>
                <Gray20Button onClick={handleToggleLetters}>123</Gray20Button>
                <LetterButton>
                  <MathJax.Provider>
                    <MathJax.Node inline formula={"a^b"} />
                  </MathJax.Provider>
                </LetterButton>
                <LetterButton>%</LetterButton>
                <LetterButton>]</LetterButton>
                <LetterButton>{`}`}</LetterButton>
                <LetterButton>:</LetterButton>
                <LetterButton>'</LetterButton>
                <Blue20Button>
                  <FontAwesomeIcon
                    icon={faLevelDownAlt}
                    transform={{ rotate: 90 }}
                  />
                </Blue20Button>
              </LettersSection>
            </Panel>
          ) : (
            <Panel tabIndex = "0" ref = {containerRef}>
              <LettersSection>
                <LetterButton>q</LetterButton>
                <LetterButton>w</LetterButton>
                <LetterButton>e</LetterButton>
                <LetterButton>r</LetterButton>
                <LetterButton>t</LetterButton>
                <LetterButton>y</LetterButton>
                <LetterButton>u</LetterButton>
                <LetterButton>i</LetterButton>
                <LetterButton>o</LetterButton>
                <LetterButton>p</LetterButton>
                <LetterButton>a</LetterButton>
                <LetterButton>s</LetterButton>
                <LetterButton>d</LetterButton>
                <LetterButton>f</LetterButton>
                <LetterButton>g</LetterButton>
                <LetterButton>h</LetterButton>
                <LetterButton>j</LetterButton>
                <LetterButton>k</LetterButton>
                <LetterButton>l</LetterButton>
                <LetterButton>
                  <MathJax.Provider>
                    <MathJax.Node inline formula={"\\theta"} />
                  </MathJax.Provider>
                </LetterButton>
                <Gray15Button onClick={handleToggleCase}>
                  <FontAwesomeIcon icon={faArrowUp} />
                </Gray15Button>
                <LetterButton>z</LetterButton>
                <LetterButton>x</LetterButton>
                <LetterButton>c</LetterButton>
                <LetterButton>v</LetterButton>
                <LetterButton>b</LetterButton>
                <LetterButton>n</LetterButton>
                <LetterButton>m</LetterButton>
                <Gray15Button>
                  <FontAwesomeIcon icon={faBackspace} />
                </Gray15Button>
                <Gray20Button onClick={handleToggleLetters}>123</Gray20Button>
                <LetterButton>
                  <MathJax.Provider>
                    <MathJax.Node inline formula={"a_b"} />
                  </MathJax.Provider>
                </LetterButton>
                <LetterButton>!</LetterButton>
                <LetterButton>[</LetterButton>
                <LetterButton>{`{`}</LetterButton>
                <LetterButton>~</LetterButton>
                <LetterButton>,</LetterButton>
                <Blue20Button>
                  <FontAwesomeIcon
                    icon={faLevelDownAlt}
                    transform={{ rotate: 90 }}
                  />
                </Blue20Button>
              </LettersSection>
            </Panel>
          )
        ) : (
          <Panel tabIndex = "0" ref = {containerRef}>
            <Section>
              <Button>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"x"} />
                </MathJax.Provider>
              </Button>
              <Button>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"y"} />
                </MathJax.Provider>
              </Button>
              <Button>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"a^2"} />
                </MathJax.Provider>
              </Button>
              <Button>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"a^b"} />
                </MathJax.Provider>
              </Button>
              <Button>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"("} />
                </MathJax.Provider>
              </Button>
              <Button>
                <MathJax.Provider>
                  <MathJax.Node inline formula={")"} />
                </MathJax.Provider>
              </Button>
              <Button>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"<"} />
                </MathJax.Provider>
              </Button>
              <Button>
                <MathJax.Provider>
                  <MathJax.Node inline formula={">"} />
                </MathJax.Provider>
              </Button>
              <Button>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"|a|"} />
                </MathJax.Provider>
              </Button>
              <Button>
                <MathJax.Provider>
                  <MathJax.Node inline formula={","} />
                </MathJax.Provider>
              </Button>
              <Button>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"\\leq"} />
                </MathJax.Provider>
              </Button>
              <Button>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"\\geq"} />
                </MathJax.Provider>
              </Button>
              <GrayButton onClick={handleToggleLetters}>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"ABC"} />
                </MathJax.Provider>
              </GrayButton>
              <Button>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"\\sqrt{}"} />
                </MathJax.Provider>
              </Button>
              <Button>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"\\theta"} />
                </MathJax.Provider>
              </Button>
              <Button>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"\\pi"} />
                </MathJax.Provider>
              </Button>
            </Section>
            <Section>
              <GrayButton onClick = {() => callback('write 7')}>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"7"} />
                </MathJax.Provider>
              </GrayButton>
              <GrayButton>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"8"} />
                </MathJax.Provider>
              </GrayButton>
              <GrayButton>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"9"} />
                </MathJax.Provider>
              </GrayButton>
              <Button>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"\\div"} />
                </MathJax.Provider>
              </Button>
              <GrayButton>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"4"} />
                </MathJax.Provider>
              </GrayButton>
              <GrayButton>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"5"} />
                </MathJax.Provider>
              </GrayButton>
              <GrayButton>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"6"} />
                </MathJax.Provider>
              </GrayButton>
              <Button>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"\\times"} />
                </MathJax.Provider>
              </Button>
              <GrayButton>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"1"} />
                </MathJax.Provider>
              </GrayButton>
              <GrayButton>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"2"} />
                </MathJax.Provider>
              </GrayButton>
              <GrayButton>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"3"} />
                </MathJax.Provider>
              </GrayButton>
              <Button>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"-"} />
                </MathJax.Provider>
              </Button>
              <GrayButton>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"0"} />
                </MathJax.Provider>
              </GrayButton>
              <GrayButton>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"."} />
                </MathJax.Provider>
              </GrayButton>
              <Button>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"="} />
                </MathJax.Provider>
              </Button>
              <Button>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"+"} />
                </MathJax.Provider>
              </Button>
            </Section>
            <Section>
              <BlueButton onClick={handleToggleFunctions}>functions</BlueButton>
              <CursorButton>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"\\leftarrow"} />
                </MathJax.Provider>
              </CursorButton>
              <CursorButton>
                <MathJax.Provider>
                  <MathJax.Node inline formula={"\\rightarrow"} />
                </MathJax.Provider>
              </CursorButton>
              <DeleteButton>
                <FontAwesomeIcon icon={faBackspace} />
              </DeleteButton>
              <BlueButton>
                <FontAwesomeIcon
                  icon={faLevelDownAlt}
                  transform={{ rotate: 90 }}
                />
              </BlueButton>
            </Section>
          </Panel>
        )
      ) : null}
    </div>
  );
}

// export default function VirtualKeyboard() {
//   // module.exports = () => {
//   return (
//     <MathJax.Context input="ascii">
//       <MathJax.Node>{"x^2"}</MathJax.Node>
// <Panel>
//   <Section>
//     <Button></Button>
//   </Section>
//   <Section />
//   <Section />
// </Panel>
//     </MathJax.Context>
//   );
// }
