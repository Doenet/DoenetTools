import React from 'react';
import Doenet from '../../React/Doenet';

export default class BaseRenderer {
  constructor({ key } = {}) {
    this._key = key;
  }


  jsxCode() {

    this.renderedChildren = null;
    if(this.childRenderers !== undefined) {
      this.renderedChildren = this.childRenderers.map(tag => <Doenet 
        _key={tag._key} 
        key={tag._key} 
        free= {{
          componentDidUpdate:tag.componentDidUpdate,
          componentDidMount:tag.componentDidMount,
          componentWillUnmount:tag.componentWillUnmount,
          doenetState:tag.jsxCode()
        }}
         />
      )
    }

    return <React.Fragment key={this._key}><a name={this._key} />{this.renderedChildren}</React.Fragment>;
  }

}
