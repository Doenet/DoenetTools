import React from 'react';
import DoenetRenderer from './DoenetRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faLevelDownAlt, faTimes, faCloud, faPercentage } from '@fortawesome/free-solid-svg-icons'


export default class BooleanInput extends DoenetRenderer {
  constructor(props) {
    super(props);

    this.onChangeHandler = this.onChangeHandler.bind(this);

  }

  initializeChildrenOnConstruction = false;

  onChangeHandler(e) {
    this.actions.updateBoolean({
      boolean: e.target.checked
    });
    this.forceUpdate();
  }

  render() {

    if (this.doenetSvData.hide) {
      return null;
    }

    const inputKey = this.componentName + '_input';


    return <React.Fragment><label>
    <a name={this.componentName} />
    <input
      type="checkbox"
      key={inputKey}
      id={inputKey}
      checked={this.doenetSvData.value}
      onChange={this.onChangeHandler}
    />
    {this.doenetSvData.label}
    </label>
    </React.Fragment>
    
  }
}