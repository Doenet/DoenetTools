import React from 'react';
import BaseRenderer from './BaseRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb as lightOff } from '@fortawesome/free-solid-svg-icons';
import { faLightbulb as lightOn } from '@fortawesome/free-regular-svg-icons';

class Hint extends React.Component{
  constructor(props){
    super(props);

    this.state={
      open:false,
    }

    this.openHint = this.openHint.bind(this);
  }

  openHint(){
    this.setState({open:true});
  }

  render(){

    let icon = <FontAwesomeIcon icon={lightOff} />
    let info = null;
    let infoBlockStyle = {display:"none"};

    if (this.state.open){
    icon = <FontAwesomeIcon icon={lightOn} />
    info = this.props.renderedChildren;
    infoBlockStyle = {display:"block", margin:"0px 4px 4px 4px",padding:"6px",border:"1px solid #ebebeb",backgroundColor:"#fcfcfc"};
    }
      return <aside id={this.props._key} key={this.props._key} onClick={this.openHint}>
      <a name={this.props._key} />
      <span style={{display:"block", margin:"4px 4px 0px 4px",padding:"6px",border:"1px solid #ebebeb",backgroundColor:"#ebebeb"}}>{icon} Hint </span>
      <span style={infoBlockStyle}>
      {info}
      </span>
      </aside>
    

    
  }
}


class HintRenderer extends BaseRenderer{
  jsxCode(){
    super.jsxCode();
    return <Hint id={this._key} renderedChildren={this.renderedChildren} _key={this._key}/>;
    
  }

}

let AvailableRenderers = {
  hint: HintRenderer,
}

export default AvailableRenderers;
