import React from 'react';
import BaseRenderer from './BaseRenderer';
import { Style } from 'radium';
import { reduce } from 'bluebird';
import { Z_BLOCK } from 'zlib';

class PanelRender extends BaseRenderer {
  constructor({ key, breakpoints }) {
    super({ key: key });

    this.breakpoints = breakpoints;

  }

  //   updateWindowDimensions(){
  //       console.log(window.innerWidth);

  //   }

  jsxCode() {
    super.jsxCode();

    //   window.addEventListener('resize', this.updateWindowDimensions);
    //   console.log(window.innerWidth);

    let itemStyle = {
      // margin: "5px",
    };

    if (this.breakpoints.length === 0) {
      itemStyle['margin'] = "5px"; //10px gaps on flex
    }

    let childDoenetTags = this.renderedChildren.map(x => <span style={itemStyle} key={`${x.key}item`}>{x}</span>)


    if (this.breakpoints.length === 0) {
      //columns not defined
    let panelStyle = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
      }
      return <React.Fragment>
        {/* <div style={panelStyle}  >
        <div style={{backgroundColor: "orange",width:"300px"}}>one</div>
      <div style={{backgroundColor: "green",width:"300px"}}>two</div>
      <div style={{backgroundColor: "blue",width:"300px"}}>three</div>
        </div> */}
        <span style={panelStyle}  _key={this._key} >{childDoenetTags}</span>

        {/* <span className={`container${this._key}`} _key={this._key} >{childDoenetTags}</span> */}
      </React.Fragment>

      // let panelStyle = {};
      // panelStyle[`.container${this._key}`] = {
      //   display: 'flex',
      //   flexDirection: 'row',
      //   flexWrap: 'wrap',
      // }
      //columns not defined
      // return <React.Fragment>
      //   <a name={this._key} />
      //   <Style rules={panelStyle} />
      //   <div>one</div>
      // <div>two</div>
      // <div>three</div>
      //   {/* <span className={`container${this._key}`} _key={this._key} >{childDoenetTags}</span> */}
      // </React.Fragment>
    }

    let mediaQueries = {}
    for (let [index, obj] of this.breakpoints.entries()) {

      let columns = obj.arrayOfWidths.join('px ') + 'px';
      let breakPointWithOffset = obj.breakpoint + 10 + 10 * (obj.possibleColumnNumbers + 1);
      if (index === 0) { breakPointWithOffset = 0; }
      mediaQueries[`(min-width: ${breakPointWithOffset}px)`] = {};
      mediaQueries[`(min-width: ${breakPointWithOffset}px)`][".container"] =
        {
          display: 'grid',
          gridTemplateColumns: columns,
          gridColumnGap: "10px",
          gridRowGap: "10px",
          width: `${obj.breakpoint}px`,
        }
      mediaQueries[`(min-width: ${breakPointWithOffset}px)`][`.container${this._key}`] =
        {
          display: 'grid',
          gridTemplateColumns: columns,
          gridColumnGap: "10px",
          gridRowGap: "10px",
          width: `${obj.breakpoint}px`,
        }
    }

    // console.log(mediaQueries);


    const panelStyle = { mediaQueries: mediaQueries };


    return <React.Fragment>
      <a name={this._key} />
      <Style rules={panelStyle} />
      <span className={`container${this._key}`} _key={this._key} >{childDoenetTags}</span>
    </React.Fragment>

  }

}

let AvailableRenderers = {
  panel: PanelRender,
}

export default AvailableRenderers;