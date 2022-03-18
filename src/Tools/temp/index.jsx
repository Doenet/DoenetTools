import React from 'react';
import ReactDOM from 'react-dom';
import {doenetMLToSerializedComponents} from  '../../Core/utils/serializedStateProcessing';
import {parseAndCompile} from '../../Parser/parser'
import { returnAllPossibleVariants } from '../../Core/utils/returnAllPossibleVariants';
//import DateTime from '../../_reactComponents/PanelHeaderComponents/DateTime'
import RelatedItems from '../../_reactComponents/PanelHeaderComponents/RelatedItems';

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

var options = [];
options.push(<option value="Keagan">Keagan</option>);
options.push(<option value="Keagan">Keagan</option>);
options.push(<option value="Keagan">Keagan</option>);
options.push(<option value="Keagan">Keagan</option>);
options.push(<option value="Keagan">Keagan</option>);
options.push(<option value="Keagan">Keagan</option>);
options.push(<option value="Keagan">Keagan</option>);
options.push(<option value="Keagan">Keagan</option>);
options.push(<option value="Keagan">Keagan</option>);


ReactDOM.render(
  <RelatedItems 
    width="menu" 
    size="8"
    option={options}
  >
  </RelatedItems>,
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
