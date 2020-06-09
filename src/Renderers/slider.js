import React from 'react';
import DoenetRenderer from './DoenetRenderer';
// import styled from "styled-components";
// import useDoenetRender from './useDoenetRenderer';

// export default function Slider(props) {
//   let [name, SVs, actions, children] = useDoenetRender(props);

//   if (SVs.hide) {
//     return null;
//   }

//   return (
//     <>
//       <div> {name}'s Slider Value {SVs.items[SVs.index]} </div>
//       <button onClick={() => actions.changeValue({ value: SVs.items[SVs.index - 1] })}>Prev</button>
//       <button onClick={() => actions.changeValue({ value: SVs.items[SVs.index + 1] })}>Next</button>
//     </>
//   )
// }




export default class Slider extends DoenetRenderer {
  constructor(props) {
    super(props);

    this.handleInput = this.handleInput.bind(this);

    this.state = {
    }


    console.log("this.doenetSvData");
    // console.log(this.doenetSvData);
    // console.log(this.doenetSvData.items)
    // console.log(this.doenetSvData.index)
    // console.log(this.doenetSvData.sliderType);
    // console.log(this.actions);
    console.log(props.rendererUpdateMethods[this.componentName])



  }


  handleInput(e, inputState) {


  }



  render() {

    console.log('RENDER')

    if (this.doenetSvData.hide) {
      return null;
    }

    console.log("Current Value")
    console.log(this.doenetSvData.items[this.doenetSvData.index]);



    return (
      <>
        <div> {this.componentName}'s Slider Value {this.doenetSvData.items[this.doenetSvData.index]} </div>
        <button onClick={() => this.actions.changeValue({ value: this.doenetSvData.items[this.doenetSvData.index - 1] })}>Prev</button>
        <button onClick={() => this.actions.changeValue({ value: this.doenetSvData.items[this.doenetSvData.index + 1] })}>Next</button>
      </>
    );



  }
}

{/* 
<slider>
<number>1</number>
<number>2</number>
<number>3</number>
</slider>


<slider>
<text>cat</text>
<text>dog</text>
<text>mouse</text>
</slider>

<slider>
<sequence>
<from>-10</from>
<to>10</to>
<step>2</step>
</sequence>
</slider> 
*/}