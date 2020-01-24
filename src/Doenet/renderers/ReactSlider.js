import React from 'react';
import { Style } from 'radium';



export default class ReactSlider extends React.Component {
  constructor(props) {
    super(props);

    this.sliderRef = React.createRef();

    this.dragging = false;

    this.fontFamily = "Times New Roman";
    this.fontSize = "14px";
    

    

    this.trackClick = this.trackClick.bind(this);
    // this.createTicksForRendering = this.createTicksForRendering.bind(this);
    this.updateValue = this.updateValue.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.mouseButtonDownOnHandle = this.mouseButtonDownOnHandle.bind(this);
    this.mouseButtonUpForHandle = this.mouseButtonUpForHandle.bind(this);
    this.clickLeftControl = this.clickLeftControl.bind(this);
    this.clickRightControl = this.clickRightControl.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);


  }

  rebuildSlider() {

    this.maxTrackPixel = this.props.width - 1;
    this.sharedState = this.props.sharedState;
    this.tickPixelValues = [];
    this.tickHandlePixelValues = [];
    this.currentHandlePixel = 0;

    if (this.props.label === undefined) {
      this.label_width = 8; //no label, still need left side padding
    } else {
      var font = this.fontSize + " " + this.fontFamily;
      var tsize = this.get_tex_size(this.props.label, font);

      this.label_width = tsize.width + 8;

    }
    if (this.props.showControls === true && !this.props.disabled) {
      this.buttons_width = 47;
    } else {
      this.buttons_width = 0;

    }
    this.trackWidth = Number(this.props.width) - this.buttons_width - this.label_width;
    //Make an adjustment so the track isn't too wide
    if (this.props.label !== undefined) {
      this.trackWidth = this.trackWidth - 8;
    }

    this.pixelRange = this.trackWidth - 1;
    this.tickWidth = 2;
    const tickClosenessTolerancePixels = 10;


    if (this.props.sliderType === 'number') {
      const authorValueRange = this.props.items[(this.props.items.length - 1)] - this.props.items[0];
      const pixelsPerAuthorValue = this.pixelRange / authorValueRange;
      const startValueNumber = this.props.items[this.props.index];
      const multiplier = startValueNumber - this.props.items[0]
      this.currentHandlePixel = Math.floor(multiplier * pixelsPerAuthorValue);
      this.tickWidthOffset = 0;
      this.valueOfMarkersAtTicks = [];

      let lastPushedTickPixel = Number.NEGATIVE_INFINITY; //Always want first tick
      for (let item of this.props.items) {
        let multiplier = item - this.props.items[0]
        this.tickHandlePixelValues.push(4 + Math.floor(multiplier * pixelsPerAuthorValue))

        let itemPosition = 4 - this.tickWidthOffset + Math.floor(multiplier * pixelsPerAuthorValue);
        if ((itemPosition - lastPushedTickPixel) >= tickClosenessTolerancePixels) {
          this.tickPixelValues.push(itemPosition);
          this.valueOfMarkersAtTicks.push(item);
          lastPushedTickPixel = itemPosition;
          this.tickWidthOffset = this.tickWidthOffset + this.tickWidth;
        }

      }


    } else if (this.props.sliderType === 'text') {

      const numberOfItems = this.props.items.length;
      // this.valueOfMarkersAtTicks = this.props.items;
      this.valueOfMarkersAtTicks = [];
      const pixelsPerItem = this.pixelRange / (numberOfItems - 1);
      this.currentHandlePixel = Math.floor(this.props.index * pixelsPerItem);
      this.tickWidthOffset = 0;
      let lastPushedTickPixel = Number.NEGATIVE_INFINITY; //Always want first tick

      for (let index = 0; index < this.props.items.length; index++) {
        this.tickHandlePixelValues.push(4 + Math.floor(index * pixelsPerItem))
        let itemPosition = 4 - this.tickWidthOffset + Math.floor(index * pixelsPerItem);
        if ((itemPosition - lastPushedTickPixel) >= tickClosenessTolerancePixels) {
          this.tickPixelValues.push(itemPosition)
          this.valueOfMarkersAtTicks.push(this.props.items[index]);
          lastPushedTickPixel = itemPosition;
          this.tickWidthOffset = this.tickWidthOffset + this.tickWidth;
        }
      }

    } else {
      console.warn('Slidertype must be number or text');
      return;
    }

    // this.createTicksForRendering();
    // this.createMarkersForRendering();
  }

  get_tex_size(txt, font) {
    this.element = document.createElement('canvas');
    this.context = this.element.getContext("2d");
    this.context.font = font;
    var tsize = { 'width': Math.floor(this.context.measureText(txt).width), 'height': parseInt(this.context.font) };
    return tsize;
  }

  // createTicksForRendering() {
  //   this.ticks = [];

  //   for (let tickPixel of this.tickPixelValues) {

  //     let svgstyle = {
  //       position: 'relative',
  //       left: tickPixel + 'px',
  //       width: this.tickWidth + "px",
  //       height: "20px",
  //       top: "14px",
  //       zIndex: 1,
  //       shapeRendering: "crispEdges",
  //     };

  //     let linestyle = {
  //       stroke: "rgb(0,0,0)",
  //       strokeWidth: 2,
  //     }
  //     if (this.props.disabled) {
  //       linestyle.stroke = "rgb(100,100,100)";
  //     }
  //     let key = this.props._key + tickPixel;
  //     let newTick = <svg key={key} style={svgstyle}>
  //       <line style={linestyle} x1="0" y1="0" x2="0" y2="20" />
  //     </svg>
  //     this.ticks.push(newTick);
  //   }
  // }

  // createMarkersForRendering() {
  //   // console.log("valueOfMarkersAtTicks");
  //   // console.log(this.valueOfMarkersAtTicks);
  //   // console.log("this.tickPixelValues");
  //   // console.log(this.tickPixelValues);

  //   this.markerWidthOffset = 0;
  //   this.markers = [];
  //   let previousMarkerRightPixel = Number.NEGATIVE_INFINITY;
  //   const font = this.fontSize + " " + this.fontFamily;

  //   // for (let marker of this.props.markers){
  //   for (let [ind, markerText] of this.valueOfMarkersAtTicks.entries()) {
  //     // console.log(ind+'>'+markerText);
  //     let tsize = this.get_tex_size(markerText, font);
  //     let halfWidth = Math.round(tsize.width / 2);
  //     let leftPixelValue = this.tickPixelValues[ind] - halfWidth + this.markerWidthOffset;
  //     let rightPixelValue = leftPixelValue + tsize.width;
  //     //  console.log(leftPixelValue +'|'+this.tickPixelValues[ind]+'|'+rightPixelValue);
  //     if (leftPixelValue < (previousMarkerRightPixel + 4)) { continue; }

  //     previousMarkerRightPixel = rightPixelValue;

  //     let key = key + 'marker' + this.tickPixelValues[ind];

  //     let markerStyle = {
  //       left: leftPixelValue + 'px',
  //       top: "8px",
  //       position: "relative",
  //       zIndex: "1",
  //       fontFamily: this.fontFamily,
  //       fontSize: this.fontSize,
  //       height: "16px",
  //       width: tsize.width + "px",
  //       textAlign: "center",
  //       // border: "1px solid black",
  //     };
  //     if (this.props.disabled) {
  //       markerStyle.color = "rgb(100,100,100)";
  //     }
  //     let newMarker = <span key={key} style={markerStyle} >{markerText}</span>
  //     this.markers.push(newMarker);
  //     // this.markerWidthOffset = this.markerWidthOffset - tsize.width/2 - 1;
  //     this.markerWidthOffset = this.markerWidthOffset - tsize.width + 2;
  //   }
  // }

  // for (let ind in this.tickPixelValues){
  //   let item = this.props.items[ind];
  //   console.log('>'+item);

  //   if (marker === item){
  //     let tickPixelValue = this.tickPixelValues[ind];
  //     let tsize = this.get_tex_size(item, font);

  //     let halfWidth = Math.round(tsize.width/2);
  //     let leftPixelValue = tickPixelValue - halfWidth;
  //     // if (leftPixelValue < (previousMarkerRightPixel + 4)){ continue; }
  //     console.log("marker"+marker);

  //     let rightPixelValue = tickPixelValue + halfWidth;
  //     previousMarkerRightPixel = rightPixelValue;

  //     let key = key+'marker'+tickPixelValue;
  //     let markerStyle = {
  //             left: tickPixelValue - halfWidth - this.tickWidthOffset - this.markerWidthOffset + 'px',
  //             // marginTop: "34px",
  //             top: "28px",
  //             position: "relative",
  //             zIndex: "1",
  //             fontFamily: this.fontFamily,
  //             fontSize: this.fontSize,
  //             height: "16px",
  //             width: tsize.width+"px",
  //             // width: "200px",
  //             textAlign: "center",
  //             // border: "1px solid black",
  //             /* backgroundColor: "rgb(204, 204, 204)", */
  //           };
  //     let newMarker = <span key={key} style={markerStyle} >{item}</span>
  //     this.markers.push(newMarker);
  //     this.markerWidthOffset = this.markerWidthOffset + tsize.width - 2;
  //   }
  // }

  //could be optimized by starting in the middle and use half way
  updateValue(positionFromLeft) {


    //Correct position for handle vs track offsets
    if (this.props.label === undefined) {
      positionFromLeft = positionFromLeft - this.label_width + 8;
    } else {
      positionFromLeft = positionFromLeft - this.label_width;
    }

    for (let p = 1; p < this.tickHandlePixelValues.length; p++) {

      let prevTickPixel = this.tickHandlePixelValues[(p - 1)];
      let tickPixel = this.tickHandlePixelValues[p];
      let middlePixel = (Number(tickPixel) + Number(prevTickPixel)) / 2;

      //Check if it's off the ends of the track
      if (p === (this.tickHandlePixelValues.length - 1)) {
        tickPixel = tickPixel + 100;
      }

      if (positionFromLeft < middlePixel) {
        let newIndex = p - 1;
        //Don't do anything if it didn't change
        if (Number(this.props.index) !== Number(newIndex)) {

          const value = this.props.items[newIndex];
          // console.log('UpdateValue actions left <-------');
          this.props.actions.changeValue({ value: value });
          // this.forceUpdate();
        }
        return;
      } else if (positionFromLeft <= tickPixel) {
        let newIndex = p;
        //Don't do anything if it didn't change
        if (Number(this.props.index) !== Number(newIndex)) {

          const value = this.props.items[newIndex];

          // console.log('UpdateValue actions right ------->');
          this.props.actions.changeValue({ value: value });
          // this.forceUpdate();
        }
        return;
      }
    }
  }

  trackClick(e, key) {
    if (this.props.disabled){return;}

    let container = document.getElementById(key).getBoundingClientRect();

    let clickFromLeft = e.clientX - container.x;

    // clickFromLeft = clickFromLeft - this.x;
    this.updateValue(clickFromLeft);
    // this.forceUpdate();
  }

  handleMouseMove(e) {
  
    
    
    if (this.props.disabled){return;}
    
    if(this.dragging){

      let clientX = e.clientX;
      if (e.touches){
        clientX = e.touches[0].clientX;
      }
      let dragFromLeft = clientX - this.x;
      // let dragFromLeft = e.clientX - this.x;
      if (dragFromLeft < this.trackLeftMostPixel) { dragFromLeft = this.trackLeftMostPixel; }
      if (dragFromLeft > this.trackRightMostPixel) { dragFromLeft = this.trackRightMostPixel; }
  
      this.updateValue(dragFromLeft);
    }
  }

  mouseButtonDownOnHandle(e) {
    this.dragging = true;
  }

  mouseButtonUpForHandle(e) {
    
    this.dragging = false;
    let dragFromLeft = e.clientX;
    if (dragFromLeft < this.trackLeftMostPixel) { dragFromLeft = this.trackLeftMostPixel; }
    if (dragFromLeft > this.trackRightMostPixel) { dragFromLeft = this.trackRightMostPixel; }
    this.forceUpdate();
  }

  clickLeftControl(e) {
    
    //Don't go beyond the slider's index range
    if (this.props.index <= 0) { return; }

    const value = this.props.items[this.props.index - 1];
    this.props.actions.changeValue({ value: value });
    this.forceUpdate();
  }

  clickRightControl(e) {

    //Don't go beyond the slider's index range
    if (this.props.index >= (this.props.items.length - 1)) { return; }

    const value = this.props.items[Number(this.props.index) + 1];
    this.props.actions.changeValue({ value: value });
    this.forceUpdate();
  }

  componentDidMount() {
    //slider mounted so we now know it's position
    // console.log(this.sliderRef.current.getClientRects());
    this.x = this.sliderRef.current.getClientRects()[0].x;
    this.y = this.sliderRef.current.getClientRects()[0].y;
    // this.forceUpdate();
  }

  render() {

    //need x defined first
    //  if (this.x === undefined){
    //   return <div key={_key} ref={this.sliderRef}></div>
    // }
    

    this.rebuildSlider();

    let _key = this.props._key + 'div';

    const newIndex = this.sharedState.index;
  
    
    const currentHandlePixel = this.tickHandlePixelValues[newIndex] - 7;
    const handleText = this.props.items[this.sharedState.index];
    
    // let hiddenControlsBoundOffset = 0;
    // if (this.props.showControls === false){
    //   hiddenControlsBoundOffset = 4;
    // }


    const label_style = {
      width: this.label_width + "px",
      marginTop: "16px",
      fontFamily: this.fontFamily,
      fontSize: "18pt",
      // backgroundColor: 'blue',
    }

    if (this.props.disabled) {
      label_style.color = "rgb(100,100,100)";
    }

    let showControls = null;

    if (this.props.showControls === true && !this.props.disabled) {

      showControls = <React.Fragment>
        <Style rules={{
          ".sliderControl": {
            height: "20px",
            marginTop: "20px",
          },
          ':focus': {
            // backgroundColor: 'blue',
            outline: 'none'
          },
        }} />
        <button style={{marginLeft:"16px"}} 
        className="sliderControl" onClick={this.clickLeftControl} >&lt;</button>
        <button className="sliderControl" onClick={this.clickRightControl} >&gt;</button>
      </React.Fragment>
    }

    if (this.props.showTicks === false) {
      this.ticks = null;
    }

    const track_container_style = {
      width: this.trackWidth + 8 + 'px',
      height: 50,
      marginTop: "0px",
      opacity: 0.7,
      zIndex: 2,
      // cursor: "pointer",
      // backgroundColor: 'yellow',
      // left: this.x + this.label_width +"px",
      left: this.label_width + "px",
    }

    if (!this.props.disabled) {
      track_container_style.cursor = "pointer";
    }

    const slider_style = {
      width: this.props.width,
      height: this.props.height,
      display: 'flex',
      flexFlow: 'row nowrap',
      // backgroundColor: 'grey',
      zIndex: 0,
    }

    const track_style = {
      width: this.trackWidth + 'px',
      left: '4px',
      position: "relative",
      height: "5px",
      background: "rgb(0, 110, 255)",
      // background: " rgb(96, 146, 255)",
      borderRadius: "6px",
      marginTop: "26px",
      // marginTop: "-2px", //with ticks
      // boxShadow: "inset 0 0 0 1px rgba(0, 0, 0, 0.2)",
      zIndex: "0",
    }

    if (this.props.disabled) {
      track_style.background = "rgb(160, 160, 160)"
    }

    let labelSpan = null;
    if (this.props.label !== undefined) {
      labelSpan = <span style={label_style}>{this.props.label}</span>
    }


    let handle_style = {
      WebkitUserSelect: "none",
      MozUserSelect: "none",
      MsUserSelect: "none",
      UserSelect: "none",
      border: "4px solid rgb(0, 110, 255)",
      // border: "1px solid #bcbcbc",
      height: "20px",
      width: "20px",
      borderRadius: "12px",
      background: "#ffffff",
      cursor: "pointer",
      boxShadow: "0 1px 3px 0px rgba(0, 0, 0, 0.15)",
      marginTop: "17px",
      display: "inline-block",
      position: "absolute",
      zIndex: "3",
      // transition: "transform .1s ease", //makes it bounce Firefox bug?
      transform: `translate(${currentHandlePixel}px, 2px)`,
    }

    if (this.props.disabled){
      handle_style.background = "rgb(160, 160, 160)";
      handle_style.border = "3px solid rgb(160, 160, 160)";
      handle_style.cursor = "";
    }

    let handle_label_style = {
      display: "inline-block",
      position: " relative",
      top: "-24px",
      left: "-93px",
      width: " 200px",
      fontSize: "12pt",
      textAlign: "center",
      // backgroundColor: "rgb(98, 243, 31)", 
    }

    let handle = (
      <span 
      onMouseDown={this.mouseButtonDownOnHandle}
      onTouchStart={this.mouseButtonDownOnHandle}
      style={handle_style} 
      data-cy={`${_key}slider-handle`}>
        <span style={handle_label_style}>
          {handleText}
        </span>
      </span>);

  
    return (
      <div 
      key={_key} 
      id={_key} 
      style={slider_style} 
      ref={this.sliderRef}
      onMouseMove={this.handleMouseMove}
      onTouchMove={this.handleMouseMove}
      onTouchEnd={()=>{this.dragging = false;}}

      onMouseLeave={()=>{this.dragging = false;}}
      onMouseUp={()=>{this.dragging = false;}}
      >
        <a name={this._key} />
        {labelSpan}
        <span style={track_container_style} data-cy={`${_key}slider-track`} onClick={(e) => this.trackClick(e, _key)}>
          {handle}
          <div style={track_style}></div>
        </span>
        {showControls}
      </div>);

  }

}

