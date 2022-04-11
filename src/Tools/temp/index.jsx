import React from 'react';
import ReactDOM from 'react-dom';
import {doenetMLToSerializedComponents} from  '../../Core/utils/serializedStateProcessing';
import {parseAndCompile} from '../../Parser/parser'
import { returnAllPossibleVariants } from '../../Core/utils/returnAllPossibleVariants';
//import DateTime from '../../_reactComponents/PanelHeaderComponents/DateTime'
import ActionButton from '../../_reactComponents/PanelHeaderComponents/ActionButton.jsx';
import ActionButtonGroup from '../../_reactComponents/PanelHeaderComponents/ActionButtonGroup.jsx';
import styled, { keyframes } from 'styled-components';

const movingGradient = keyframes `
  0% { background-position: -250px 0; }
  100% { background-position: 250px 0; }
`;

const Table = styled.table `
  width: 850px;
  border-radius: 5px;
`;
const Tr = styled.tr `
  /* border: 2px solid black; */
  /* background-color: blue; */
`;
const Td = styled.td `
  height: 40px;
  vertical-align: middle;
  padding: 8px;
  border-bottom: 2px solid black;
  &.Td2 {
    width: 50px;
  }

  &.Td3 {
    width: 400px;
  }

`;
const TBody = styled.tbody ``;
// const TdSpan = styled.span `
//   display: block;
// `;
const Td2Span = styled.span `
  display: block; 
  background-color: rgba(0,0,0,.15);
  width: 70px;
  height: 16px;
  border-radius: 5px;
`;
const Td3Span = styled.span `
  display: block;
  height: 14px;
  border-radius: 5px;
  background: linear-gradient(to right, #eee 20%, #ddd 50%, #eee 80%);
  background-size: 500px 100px;
  animation-name: ${movingGradient};
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
`;


// serializeFunctions.expandDoenetMLsToFullSerializedComponents({
//     contentIds: [],
//     doenetMLs: [doenetML],
//     callBack: args => finishReturnAllPossibleVariants(
//       args,
//       { callback, componentInfoObjects }),
//     componentInfoObjects,
//     componentTypeLowerCaseMapping,
//     flags,
//     contentIdsToDoenetMLs
// })


ReactDOM.render(
  <Table>
    <TBody>
      <Tr>
        <Td className="Td2">
          <Td2Span></Td2Span>
        </Td>
        <Td className="Td3">
          <Td3Span></Td3Span>
        </Td>
      </Tr>
      <Tr>
        <Td className="Td2">
          <Td2Span></Td2Span>
        </Td>
        <Td className="Td3">
          <Td3Span></Td3Span>
        </Td>
      </Tr>
      <Tr>
        <Td className="Td2">
          <Td2Span></Td2Span>
        </Td>
        <Td className="Td3">
          <Td3Span></Td3Span>
        </Td>
      </Tr>
    </TBody>
  </Table>,
  document.getElementById('root'),
);


// const doenetMl = "<p>This is a test string <div> with a nested tag </div></p> <test attr=\"value\" /> <two />"

let doenetMl = `<math test="blah">\\begin{matrix}a & b\\\\c &amp; d\\end{matrix}</math>`


// let t = parse(doenetMl);
// console.log(t);
// // console.log(t.node.getChildren());
// console.log(showCursor(t));

let o = parseAndCompile(doenetMl);
console.log(doenetMl)
console.log(o)

// while(t.next()){
//   console.log(">>>node type",t.type)
//   console.log(">>>node bounds", t.from,t.to)
// }
