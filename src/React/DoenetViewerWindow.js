import React, { Component } from 'react';
import DoenetViewer from '../React/DoenetViewer';
import { Button, Dropdown, Icon, Menu } from 'semantic-ui-react';

class DoenetViewerWindow extends Component {
  constructor(props){
    super(props);

    this.state = {
      modeOpen: false,
      allowViewSolutionWithoutRoundTrip: true,
      solutionType: "button",
      showHints: true,
      showFeedback: true,
      showCorrectness: true,
      allAnswersSubmitted: false,
      code: "",
      error: null,
      errorInfo: null,
    };

    this.functionsSuppliedByChild = {};

    this.updateNumber = 0;
    this.updateAfterMessage = this.updateAfterMessage.bind(this);
    this.modeToggle = this.modeToggle.bind(this);
    this.setAnswersSubmittedTrueCallback = this.setAnswersSubmittedTrueCallback.bind(this);
    window.onmessage = this.updateAfterMessage;
  }

  updateHandler(e){
    console.log('update');
    console.log(window.parent);
    
    let response = opener.postMessage({request: "code update"},"*");
    console.log(response);
    
    
  }

  modeToggle(){
    this.setState({modeOpen:!this.state.modeOpen})
  }

  updateAfterMessage(e){

    if(e.data.doenetCode !== undefined){
      this.updateNumber++;
      window.MathJax.Hub.Queue(
        ["resetEquationNumbers",window.MathJax.InputJax.TeX],
      );
      this.setState({code:e.data.doenetCode,error:null,errorInfo:null,
        requestedVariant: e.data.requestedVariant});
    }
  }

  componentDidCatch(error, info){

    this.setState({error:error,errorInfo:info});
  }

  handleResizeWindow(width,height){
    window.resizeTo(width,height);
    // alert(`Width ${width} Height ${height}`);
  }

  setAnswersSubmittedTrueCallback() {
    this.setState({allAnswersSubmitted: true})
  }

  render() {
    
     //We have an error so doen't show the viewer
     if (this.state.error){

      return (<React.Fragment>
        <p style={{color: "red"}}>{this.state.error && this.state.error.toString()}</p>
        </React.Fragment>);
    }

    return (<React.Fragment>
      <Menu attached='top'>
      {/* <Menu.Menu position='right'> */}
      {/* <Dropdown item simple text="Resize">
      
        <Dropdown.Menu>
          
          <Dropdown.Item>
            <Icon name='dropdown' />
            <span className='text'>Tablet</span>

            <Dropdown.Menu>
              <Dropdown.Item onClick={()=>this.handleResizeWindow(2048,536)}>iPad 2048x536</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Item>
          <Dropdown.Item>
          <Icon name='dropdown' />
            <span className='text'>Phone</span>

            <Dropdown.Menu>
              <Dropdown.Item onClick={()=>this.handleResizeWindow(1125,2436)}>iPhone X 1125x2436</Dropdown.Item>
              <Dropdown.Item onClick={()=>this.handleResizeWindow(1080,1920)}>iPhone 8 Plus 1080x1920</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Item>
          <Dropdown.Item>
          <Icon name='dropdown' />
            <span className='text'>Computer</span>

            <Dropdown.Menu>
              <Dropdown.Item onClick={()=>this.handleResizeWindow(1024,768)}>Screen 1024×768</Dropdown.Item>
              <Dropdown.Item onClick={()=>this.handleResizeWindow(1280,960)}>Screen 1280×960</Dropdown.Item>
              <Dropdown.Item onClick={()=>this.handleResizeWindow(1400,1050)}>Screen 1400×1050</Dropdown.Item>
              <Dropdown.Item onClick={()=>this.handleResizeWindow(1600,1200)}>Screen 1600×1200</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Item>

        </Dropdown.Menu>
      </Dropdown> */}
      <Menu.Item>
        <Button onClick={this.updateHandler} data-cy="viewerUpdateButton">Update</Button>
      </Menu.Item>
      <Menu.Item>
        <Button onClick={this.modeToggle} data-cy="viewerModeButton">Mode</Button>
      </Menu.Item>
      {/* </Menu.Menu> */}
      {/* <Dropdown text='Modes' pointing className='link item'>
        <Dropdown.Menu>
          
          <Dropdown.Item>
            <Dropdown text='<solution>'>
              <Dropdown.Menu>
                <Dropdown.Item>Shirts</Dropdown.Item>
                <Dropdown.Item>Pants</Dropdown.Item>
                <Dropdown.Item>Jeans</Dropdown.Item>
                <Dropdown.Item>Shoes</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown> */}

      </Menu>
      {this.state.modeOpen ? <div style={{backgroundColor:"#cce2ff", padding:"10px",borderBottom:"1px solid grey"}}>
        <b>Modes</b><br />

      allowViewSolutionWithoutRoundTrip <input type="checkbox" onChange={()=>{
        this.setState({ allowViewSolutionWithoutRoundTrip:!this.state.allowViewSolutionWithoutRoundTrip });
        this.updateNumber++;
      }
      }checked={this.state.allowViewSolutionWithoutRoundTrip}></input><br />
      

      solutionType <select value={this.state.solutionType} onChange={(e)=>{
        this.setState({solutionType:e.target.value});
        this.updateNumber++;
      }}>
        <option>none</option>
        <option>button</option>
        <option>displayed</option>
        </select><br />
        showHints <input type="checkbox" onChange={()=>{
        this.setState({ showHints:!this.state.showHints });
        this.updateNumber++;
      }
      }checked={this.state.showHints}></input><br />
      showFeedback <input type="checkbox" onChange={()=>{
        this.setState({ showFeedback:!this.state.showFeedback });
        this.updateNumber++;
      }
      }checked={this.state.showFeedback}></input><br />
      showCorrectness <input type="checkbox" onChange={()=>{
        this.setState({ showCorrectness:!this.state.showCorrectness });
        this.updateNumber++;
      }
      }checked={this.state.showCorrectness}></input><br />

      <button onClick={this.functionsSuppliedByChild.submitAllAnswers} >
        submit all answers
      </button><br />
      All answer have been submitted (at least once): {this.state.allAnswersSubmitted ? "true" : "false"}

      </div> : null}
    
            <DoenetViewer 
            key={"doenetviewer"+this.updateNumber} 
            free={{doenetCode: this.state.code, requestedVariant: this.state.requestedVariant}} 
            mode={{
              solutionType:this.state.solutionType,
              allowViewSolutionWithoutRoundTrip:this.state.allowViewSolutionWithoutRoundTrip,
              showHints:this.state.showHints,
              showFeedback:this.state.showFeedback,
              showCorrectness:this.state.showCorrectness,
            }}
            viewerExternalFunctions = {{ allAnswersSubmitted: this.setAnswersSubmittedTrueCallback}}
            functionsSuppliedByChild = {this.functionsSuppliedByChild}
            />
      </React.Fragment>);
  }
}

export default DoenetViewerWindow;

// mode={{solutionType:"displayed",allowViewSolutionWithoutRoundTrip:true}}
