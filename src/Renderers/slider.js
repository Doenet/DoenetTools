import React from 'react';
import DoenetRenderer from './DoenetRenderer';
import styled from "styled-components";

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


export default class Slider extends DoenetRenderer {
  constructor(props) {
    super(props);

    this.handleInput = this.handleInput.bind(this);

    this.state = {
    }


    console.log("this.doenetSvData");
    console.log(this.doenetSvData);
    console.log(this.doenetSvData.items)
    console.log(this.doenetSvData.index)
    console.log(this.doenetSvData.sliderType);
    
    
  }


  handleInput(e, inputState) {


  }



  render() {

    if (this.doenetSvData.hide) {
      return null;
    }

  

    return (
      <>
        <div> I'm a slider!
          </div>
      </>
    );

    

  }
}

