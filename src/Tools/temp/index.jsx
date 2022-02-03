import React from 'react';
import ReactDOM from 'react-dom';
import { returnAllPossibleVariants } from '../../Core/utils/returnAllPossibleVariants';
//import DateTime from '../../_reactComponents/PanelHeaderComponents/DateTime'
import Banner from '../../_reactComponents/PanelHeaderComponents/Banner.jsx';



// function testReturnVariants() {
//   returnAllPossibleVariants({
//     doenetML: `<variantControl nVariants='5' variantNames='hello cat dog mouse' /> <copy assignNames="problem1" uri="doenet:conTentId=a666134b719e70e8acb48d91d582d1efd90d7f11fb499ab77f9f1fa5dafdb96d&DoenEtiD=abcdefg" />`,
//     callback: gotAll,
//   })

// }

// function gotAll({ allPossibleVariants }) {
//   console.log(`all possible variants`, allPossibleVariants)
// }


ReactDOM.render(
  <Banner></Banner>,
  document.getElementById('root'),
);


// const doenetMl = "<p>This is a test string <div> with a nested tag </div></p> <test attr=\"value\" /> <two />"

// const doenetMl = `
//   <p> this is a test string 
//     <div id="divtastic" parsed="true"> with a div <a href ="https://www.youtube.com/watch?v=dQw4w9WgXcQ"> cool link </a></div>
//   </p>  
//   <test passed="true" />`


// let t = parse(doenetMl);
// console.log(t);
// // console.log(t.node.getChildren());
// console.log(showCursor(t));

// let o = parseAndCompile(doenetMl);
// console.log(o)

// while(t.next()){
//   console.log(">>>node type",t.type)
//   console.log(">>>node bounds", t.from,t.to)
// }

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}