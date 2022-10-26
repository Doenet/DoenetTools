import React from 'react';
import ReactDOM from 'react-dom';
import { parseAndCompile } from '../../Parser/parser'
import { returnAllPossibleVariants } from '../../Core/utils/returnAllPossibleVariants';
//import DateTime from '../../_reactComponents/PanelHeaderComponents/DateTime'
import RelatedItems from '../../_reactComponents/PanelHeaderComponents/RelatedItems';
import ActionButton from '../../_reactComponents/PanelHeaderComponents/ActionButton';
import ActionButtonGroup from '../../_reactComponents/PanelHeaderComponents/ActionButtonGroup';
import ToggleButton from '../../_reactComponents/PanelHeaderComponents/ToggleButton';
import ToggleButtonGroup from '../../_reactComponents/PanelHeaderComponents/ToggleButtonGroup';
import Button from '../../_reactComponents/PanelHeaderComponents/Button';
import ButtonGroup from '../../_reactComponents/PanelHeaderComponents/ButtonGroup';
import Textfield from '../../_reactComponents/PanelHeaderComponents/Textfield';
import Textarea from '../../_reactComponents/PanelHeaderComponents/TextArea';
import Form from '../../_reactComponents/PanelHeaderComponents/Form';



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
/*<ActionButtonGroup width="menu">
  <ActionButton/>
  <ActionButton/>
  <ActionButton/>
  <ActionButton/>
  <ActionButton/>
  <ActionButton/>
  <ActionButton/>
</ActionButtonGroup>,*/
/*<ButtonGroup width="menu">
  <Button/>
  <Button/>
  <Button/>
  <Button/>
  <Button/>
  <Button/>
  <Button/>
</ButtonGroup>,*/
/*<ToggleButtonGroup width="menu">
  <ToggleButton value="abe"/>
  <ToggleButton value="abe"/>
  <ToggleButton value="abe"/>
  <ToggleButton value="abe"/>
  <ToggleButton value="abe"/>
  <ToggleButton value="abe"/>
  <ToggleButton value="abe"/>
  <ToggleButton value="abe"/>
  <ToggleButton value="abedgdgd"/>
</ToggleButtonGroup>,*/
/*<Form width="menu"/>,*/
<Textfield width="menu"/>,
/*<Textarea width="menu"/>,*/
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
