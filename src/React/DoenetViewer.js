import React, { Component } from 'react';
import Core from '../Doenet/Core';
import Doenet from './Doenet';
import axios from 'axios';
import crypto from 'crypto';
import { serializedStateReplacer, serializedStateReviver } from '../Doenet/utils/serializedStateProcessing';


class DoenetViewer extends Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.submitResults = this.submitResults.bind(this);

    this.saveSerializedTimer = null;

    let code = this.props.free.doenetCode;
    // console.log(` code before ${code}`);
    // code = this.removeComments({ code: code });
    // console.log(` code after ${code}`);

    let doenetState;
    
    if(props.free.doenetState) {
      doenetState = JSON.parse(props.free.doenetState, serializedStateReviver);

      // TODO: remove this once we can ensure that serialized state is always an array
      if(!Array.isArray(doenetState)) {
        doenetState = [doenetState];
      }
    }

    this.viewerExternalFunctions = {};
    if(props.viewerExternalFunctions) {
      this.viewerExternalFunctions = props.viewerExternalFunctions;
    }

    this.callSubmitAllAnswersCounter = 0;

    this.recordSolutionView = this.recordSolutionView.bind(this);
    this.contentIdsToDoenetMLs = this.contentIdsToDoenetMLs.bind(this);
    this.delayedSaveSerializedState = this.delayedSaveSerializedState.bind(this);
    this.saveSerializedState = this.saveSerializedState.bind(this);
    this.allAnswersSubmitted = this.allAnswersSubmitted.bind(this);
    this.localStateChanged = this.localStateChanged.bind(this);
    this.remoteStateChanged = this.remoteStateChanged.bind(this);
    this.update = this.update.bind(this);

    //Modes Listed:
    //Gradebook
    //Offline
    //dev vs prod
    //Demo
    //Exam
    //dontAllowViewingOfSolution
    //Read Only

    //Possible flags
    //Show Hints (t/f)
    //Solution - "none","button","displayed"
    //Answers are fixed
    // console.log('**DoenetViewer flags**');
    // console.log(`solutionType ${props.mode.solutionType}`);

    this.flags = {};
    this.flags.showHints = true;
    this.flags.showFeedback = true;
    this.flags.showCorrectness = true;
    this.flags.solutionType = "button";
    this.allowViewSolutionWithoutRoundTrip = true;
    if (props.mode !== undefined){
      if(props.mode.showHints !== undefined){
        this.flags.showHints = props.mode.showHints;
      }
      if(props.mode.showFeedback !== undefined){
        this.flags.showFeedback = props.mode.showFeedback;
      }
      if(props.mode.showCorrectness !== undefined){
        this.flags.showCorrectness = props.mode.showCorrectness;
      }
      if (props.mode.solutionType !== undefined) {
        this.flags.solutionType = props.mode.solutionType;
      }
      if (props.mode.allowViewSolutionWithoutRoundTrip !== undefined) {
        this.allowViewSolutionWithoutRoundTrip = props.mode.allowViewSolutionWithoutRoundTrip;
      }
    }
    
    let externalFunctions = {
      submitResults: this.submitResults,
      recordSolutionView: this.recordSolutionView,
      contentIdsToDoenetMLs: this.contentIdsToDoenetMLs,
      delayedSaveSerializedState: this.delayedSaveSerializedState,
      saveSerializedState: this.saveSerializedState,
      allAnswersSubmitted: this.allAnswersSubmitted,
      localStateChanged: this.localStateChanged,
    };

    this.core = new Core({
      doenetML: code,
      doenetState: doenetState,
      update: this.update,
      requestedVariant: this.props.free.requestedVariant,
      externalFunctions: externalFunctions,
      flags: this.flags,
      postConstructionCallBack: this.update
    });

    //Integration with Doenet Library
    this.worksheet = new window.doenet.Worksheet();
    
    if(this.props.collaborate) {
      this.worksheet.addEventListener( 'globalState', this.remoteStateChanged);
    } else {
      this.worksheet.addEventListener( 'state', this.remoteStateChanged);
    }

    if(this.props.functionsSuppliedByChild){

      this.props.functionsSuppliedByChild.submitAllAnswers = () => this.core.document.submitAllAnswers();
    }
    // this.update({ doenetTags: this.core.doenetState, init: true });
  }


  remoteStateChanged(event,state) {

    let newStateVariableValues = {};

    //Rehydrate for serializing when functions that are in variables
    for(let componentName in state) {
      newStateVariableValues[componentName] = {};
      for(let varName in state[componentName]) {
        newStateVariableValues[componentName][varName] = JSON.parse(state[componentName][varName], serializedStateReviver);
      }
    }

    this.core.executeUpdateStateVariables({newStateVariableValues })

  }

  localStateChanged({newStateVariableValues }) {

    if(!this.worksheet.progress) {
      this.worksheet.progress = 0;
    }
    
    this.worksheet.progress += 0.1;

    let theState;

    // // Note: uncomment these lines and change an element to reset state
    // this.worksheet.globalState = {};
    // this.worksheet.state = {};
    
    if(this.props.collaborate) {
      theState = this.worksheet.globalState;
    } else {
      theState = this.worksheet.state;
    }

    for(let componentName in newStateVariableValues) {
      let componentState = theState[componentName];
      if(componentState === undefined) {
        componentState = theState[componentName] = {};
      }

      //Stringify for serializing when functions that are in variables
      for(let varName in newStateVariableValues[componentName]) {
        componentState[varName] = JSON.stringify(newStateVariableValues[componentName][varName], serializedStateReplacer)
      }
    }

  }

  delayedSaveSerializedState({ document }) {
    //Save after three second delay save state
    if (this.saveSerializedTimer === null) {
      this.saveSerializedTimer = setTimeout(
        () => { this.saveSerializedState({ document }); }
        , 3000);

    }
  }

  saveSerializedState({ document }) {
    console.log(`-----External Function: save serialized state  ------`);
    console.log(`this.props.attemptNumber ${this.props.attemptNumber}`);
    console.log(`this.props.assignmentId ${this.props.assignmentId}`);

    if (this.saveSerializedTimer !== null) {
      clearTimeout(this.saveSerializedTimer);
      this.saveSerializedTimer = null;
    }

    let serializedDocument = JSON.stringify(document.serialize(), serializedStateReplacer);



      const url = '/api/saveSerializedDocument.php';

      const data = {
        serializedDocument,
        assignmentId: this.props.assignmentId,
        attemptNumber: this.props.attemptNumber,
        learnerUsername: this.props.learnerUsername
      }

      // console.log("save serialized State data");
      // console.log(data);


      axios.post(url, data)
        .then(resp => {
          // console.log("Saved serialized State outline!");
          // console.log(resp);
          // console.log(resp.data);


        })
        .catch(error => { this.setState({ error: error }) });

  }

  contentIdsToDoenetMLs({ contentIds, callBack }) {

    // console.log(`-----External Function: contentId to DoenetML "${contentId}" ------`);

      const url = '/open_api/contentIdsToDoenetMLs.php';
      // const url = '/api/contentIdsToDoenetMLs.php';
      const data = {
        contentIds: contentIds,
      }
 
      console.log("contentIdsToDoenetMLs data");
      console.log(data);

      axios.post(url, data)
        .then(resp => {
          console.log('resp data');
          console.log(resp.data);

          let retrievedDoenetMLs = resp.data.doenetMLs;
          let retrievedContentIds = resp.data.retrievedContentIds;

          let doenetMLByContentId = {};
          for(let [ind, doenetML] of retrievedDoenetMLs.entries()) {
            doenetMLByContentId[retrievedContentIds[ind]] = doenetML;
          }

          let success = true;
          let message = ""
          let doenetMLs = [];
          for(let contentId of contentIds) {
            let doenetML = doenetMLByContentId[contentId]
            if (doenetML === undefined) {
              message += `Can't find content with contentId ${contentId}\n`;
              success = false;
              doenetMLs.push("");
            } else {
              const hash = crypto.createHash('sha256');
              hash.update(doenetML);
              let contentIdTest = hash.digest('hex');
              if (contentId === contentIdTest) {
                doenetMLs.push(doenetML);
              }else {
                message += `Error: checksum didn't match for contentId ${contentId}\n`;
                success = false;
                doenetMLs.push("");
              }
            }

          }

          callBack({ newDoenetMLs: doenetMLs, message, success });

        });
    

  }

  recordSolutionView({ itemNumber, scoredComponent, callBack }) {
    console.log(`-----External Function: reveal solution "${itemNumber}" ------`);
    console.log(`this.props.attemptNumber ${this.props.attemptNumber}`);
    console.log(`this.props.assignmentId ${this.props.assignmentId}`);
    console.log(`allowViewSolutionWithoutRoundTrip ${this.allowViewSolutionWithoutRoundTrip}`);

    // Note: made all calls to callBack asynchronous so that have same behavior
    // regardless of what option gets triggered

 
      //Mode offline?,
      // mode demo? 
      // read only?
      //in exam mode, don't allow view


      if (this.allowViewSolutionWithoutRoundTrip) {
        makeAsynchronous()
        .then(x =>
          callBack({ allowView: true, message: "", scoredComponent })
        )

      } else {
        //Contact database
        if (this.props.attemptNumber === undefined ||
          this.props.assignmentId === undefined) {
          makeAsynchronous()
          .then(x =>
            callBack({ allowView: false, message: "Attempt Number or AssignmentID not defined", scoredComponent })
          )

        } else {

          const url = '/api/viewedSolution.php';
          const data = {
            assignmentId: this.props.assignmentId,
            attemptNumber: this.props.attemptNumber,
            itemNumber: itemNumber,
            learnerUsername: this.props.learnerUsername,
          }
          const payload = {
            params: data
          }
          console.log("viewedSolution data");
          console.log(data);

          axios.get(url, payload)
            .then(resp => {
              console.log('resp');
              console.log(resp);
              callBack({ allowView: true, message: "", scoredComponent });

            });

        }

      }



  

  }

  //TODO: build attemptNumber in
  submitResults({ itemNumber, documentCreditAchieved, itemCreditAchieved, serializedItem, callBack }) {
    console.log("---submitResults---");
    console.log(`itemNumber ${itemNumber}`);
    console.log(`this.props.learnerUsername ${this.props.learnerUsername}`);
    
    // console.log(`documentCreditAchieved ${documentCreditAchieved}`);
    // console.log(`itemCreditAchieved ${itemCreditAchieved}`);
    // console.log(`serializedItem`);
    // console.log(`assignmentId '${this.props.assignmentId}'`);
    serializedItem = JSON.stringify(serializedItem, serializedStateReplacer);

    if (this.props.creditUpdate !== undefined) {
      this.props.creditUpdate({ credit: documentCreditAchieved });
    }

      const data = {
        assignmentId: this.props.assignmentId,
        itemNumber: itemNumber,
        documentCreditAchieved: documentCreditAchieved,
        itemCreditAchieved: itemCreditAchieved,
        serializedItem: serializedItem,
        attemptNumber: this.props.attemptNumber,
        learnerUsername: this.props.learnerUsername,
      }

      console.log("data");
      console.log(data);
      console.log(`this.props.course ${this.props.course}`);
      

      if (this.props.course){
        const url = '/open_api/saveSubmitResult.php';
     
        axios.post(url, data)
        .then(resp => {
          console.log(resp.data);
          let resultObj = {success:false};
          if (resp.status === 200){
            resultObj.success = true;
            resultObj.viewedSolution = resp.data.viewedSolution;
          }
          if(callBack){
            callBack(resultObj);
          }
        })
        .catch(
          err => {
            console.log(err);
            
            let resultObj = {success:false};
            if(callBack) {
              callBack(resultObj);
            }

          }
        );
       
        
      }

      

     


  }

  allAnswersSubmitted() {
    if(this.viewerExternalFunctions.allAnswersSubmitted) {
      this.viewerExternalFunctions.allAnswersSubmitted();
    }
  }

  // removeComments({ code }) {
  //   let startCommentIndex = code.search('<!--');
  //   while (startCommentIndex !== -1) {
  //     let endCommentIndex = code.search('-->');
  //     //if no end comment then the rest of the code is commented out
  //     if (endCommentIndex === -1) { endCommentIndex = code.length; } else { endCommentIndex = endCommentIndex + 3 }
  //     code = code.substring(0, startCommentIndex) + code.substring(endCommentIndex, code.length);
  //     startCommentIndex = code.search('<!--');
  //   }

  //   return code;
  // }

  update({ doenetTags, init = false }) {

    this.tags = [];
    for (let tag of doenetTags) {

      this.tags.push(<Doenet
        _key={tag._key}
        key={tag._key}

        free={{
          componentDidUpdate: tag.componentDidUpdate,
          componentDidMount: tag.componentDidMount,
          componentWillUnmount: tag.componentWillUnmount,
          doenetState: tag.jsxCode()
        }}

      />);
    }
    if (init === false) {
      this.forceUpdate();
    }
  }

  componentWillUnmount() {
    this.core.componentWillUnmount();
    this.core = undefined;
    this.tags = undefined;
    this.props.free.doenetCode = undefined;
    this.props.free.requestedVariant = undefined;
  }

  render() {
    // console.log('DoenetView Render Refreshed--')
  
    if(this.props.viewerFlags && this.props.viewerFlags.callSubmitAllAnswersCounter !== this.callSubmitAllAnswersCounter) {
      this.callSubmitAllAnswersCounter = this.props.viewerFlags.callSubmitAllAnswersCounter;
      this.core.document.submitAllAnswers();
    }

    return (<React.Fragment>
      <div style={{ margin: "10px" }}>
        {this.tags}

      </div>
    </React.Fragment>);
  }
}

// TODO: what's the best way to make a function asynchronous?
function makeAsynchronous() {
  return new Promise(resolve => resolve(true));
}

export default DoenetViewer;
