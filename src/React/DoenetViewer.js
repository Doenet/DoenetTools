import React, { Component } from 'react';
import Core from '../Doenet/Core';
import Doenet from './Doenet';
import axios from 'axios';
import crypto from 'crypto';
import { serializedStateReplacer, serializedStateReviver } from '../Doenet/utils/serializedStateProcessing';
import generate from 'nanoid/generate';

class DoenetViewer extends Component {
  constructor(props) {
    super(props);
    this.update = this.update.bind(this);
    this.submitResults = this.submitResults.bind(this);

    this.saveSerializedTimer = null;

    let url_string = window.location.href;
    var url = new URL(url_string);
    this.group = url.searchParams.get("group");

    if (props.free.doenetState) {
      this.doenetState = JSON.parse(props.free.doenetState, serializedStateReviver);

      // TODO: remove this once we can ensure that serialized state is always an array
      if (!Array.isArray(this.doenetState)) {
        this.doenetState = [doenetState];
      }
    }


    this.viewerExternalFunctions = {};
    if (props.viewerExternalFunctions) {
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

    this.goToGroup = this.goToGroup.bind(this);
    this.leaveGroup = this.leaveGroup.bind(this);
    this.continueConstruction = this.continueConstruction.bind(this);


    //Integration with Doenet Library
    this.worksheet = new window.doenet.Worksheet();


    let collaborationPanelState = "join or create";
    if (this.group) {
      collaborationPanelState = "group is active";
      this.worksheet.addEventListener('globalState', this.continueConstruction);
    } else {
      this.worksheet.addEventListener('state', this.continueConstruction);
    }

    this.state = {
      apiStateReady: false,
      collaborateWindowOpen: false,
      joinGroupText: "",
      collaborationPanelState: collaborationPanelState,
    }

    if (this.props.functionsSuppliedByChild) {

      this.props.functionsSuppliedByChild.submitAllAnswers = () => this.core.document.submitAllAnswers();
    }
    // this.update({ doenetTags: this.core.doenetState, init: true });

  }

  continueConstruction(event, state) {


    if(this.core) {
      return;
    }

    if (this.group) {

      if (!this.worksheet.globalState.users) {
        this.worksheet.globalState.users = [];
      }

      let index = this.worksheet.globalState.users.indexOf(this.worksheet.userId);
      if (index === -1) {
        this.worksheet.globalState.users.push(this.worksheet.userId);
        this.playerNumber = this.worksheet.globalState.users.length;
      } else {
        this.playerNumber = index + 1;
      }
      // let numberOfPlayers = this.worksheet.globalState.users.length;
      console.log(`Your userid ${this.worksheet.userId}`);
      console.log(this.worksheet.globalState.users);
    }


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

    if (this.group) {
      this.flags.collaboration = { numberOfGroups: 3, groupNumber: this.playerNumber }
    }

    this.allowViewSolutionWithoutRoundTrip = true;
    if (this.props.mode !== undefined) {
      if (this.props.mode.showHints !== undefined) {
        this.flags.showHints = this.props.mode.showHints;
      }
      if (this.props.mode.showFeedback !== undefined) {
        this.flags.showFeedback = this.props.mode.showFeedback;
      }
      if (this.props.mode.showCorrectness !== undefined) {
        this.flags.showCorrectness = this.props.mode.showCorrectness;
      }
      if (this.props.mode.solutionType !== undefined) {
        this.flags.solutionType = this.props.mode.solutionType;
      }
      if (this.props.mode.allowViewSolutionWithoutRoundTrip !== undefined) {
        this.allowViewSolutionWithoutRoundTrip = this.props.mode.allowViewSolutionWithoutRoundTrip;
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
      doenetML: this.props.free.doenetCode,
      doenetState: this.doenetState,
      update: this.update,
      requestedVariant: this.props.free.requestedVariant,
      externalFunctions: externalFunctions,
      flags: this.flags,
      postConstructionCallBack: this.update
    });

    if (this.group) {
      this.worksheet.addEventListener('globalState', this.remoteStateChanged);
      this.remoteStateChanged(null, this.worksheet.globalState)
    } else {
      this.worksheet.addEventListener('state', this.remoteStateChanged);
      this.remoteStateChanged(null, this.worksheet.state);
    }

    //Transfer state
    //TODO clean up testing undefined
    if (typeof window.sessionStorage.transferToGlobal !== 'undefined') {

      if (window.sessionStorage.transferToGlobal === 'undefined') {
        //Clean up if state was not defined
        delete window.sessionStorage.transferToGlobal;
      } else {
        //Transfer session state to global API state
        let newGlobalState = JSON.parse(window.sessionStorage.transferToGlobal, serializedStateReviver);
        this.remoteStateChanged(null, newGlobalState);

        this.worksheet.globalState.doenetMLState = newGlobalState;
        delete window.sessionStorage.transferToGlobal;
      }

    }

    if (typeof window.sessionStorage.transferToLocal !== 'undefined') {
      if (window.sessionStorage.transferToLocal === 'undefined') {
        //Clean up if state was not defined
        delete window.sessionStorage.transferToLocal;
      } else {
        //Transfer session state to local API state
        let newLocalState = JSON.parse(window.sessionStorage.transferToLocal, serializedStateReviver);
        this.remoteStateChanged(null, newLocalState);

        this.worksheet.state.doenetMLState = newLocalState;
        delete window.sessionStorage.transferToLocal;
      }

    }


    this.setState({ apiStateReady: true });

  }

  remoteStateChanged(event, state) {
    console.log('remote state changed')
    console.log(state);


    if (this.group) {
      this.receivedGlobalStateSetSignal = true;
    } else {
      this.receivedStateSetSignal = true;
    }

    if (!this.core) {
      if (this.receivedReadySignal) {
        this.continueConstruction();
      }
      return;
    }

    if(state.contentId !== this.core.contentId) {
      console.warn(`contentId don't match.  Should we keep the data?`);
    }
    
    let newStateVariableValues = {};

    //Rehydrate for serializing when functions that are in variables

    for (let componentName in state.doenetMLState) {
      newStateVariableValues[componentName] = {};
      for (let varName in state.doenetMLState[componentName]) {
        newStateVariableValues[componentName][varName] = JSON.parse(state.doenetMLState[componentName][varName], serializedStateReviver);
      }
    }


    this.core.executeUpdateStateVariables({ newStateVariableValues })

  }

  localStateChanged({ newStateVariableValues, contentId }) {

    // if(!this.worksheet.progress) {
    //   this.worksheet.progress = 0;
    // }

    // this.worksheet.progress += 0.1;


    // // Note: uncomment these lines and change an element to reset state
    // this.worksheet.globalState = {};
    // this.worksheet.state = {};
    // console.log("CLEAR!!!");
    // return;

    let theState;

    if (this.group) {
      this.worksheet.globalState.contentId = contentId;
      theState = this.worksheet.globalState.doenetMLState;

      if (theState === undefined) {
        theState = this.worksheet.globalState.doenetMLState = {};
      }
    } else {
      this.worksheet.state.contentId = contentId;
      theState = this.worksheet.state.doenetMLState;

      if (theState === undefined) {
        theState = this.worksheet.state.doenetMLState = {};
      }
    }


    for (let componentName in newStateVariableValues) {
      let componentState = theState[componentName];
      if (componentState === undefined) {
        componentState = theState[componentName] = {};
      }

      //Stringify for serializing when functions that are in variables
      for (let varName in newStateVariableValues[componentName]) {
        componentState[varName] = JSON.stringify(newStateVariableValues[componentName][varName], serializedStateReplacer);
      }
    }

  }

  delayedSaveSerializedState({ document, contentId }) {
    //Save after three second delay save state
    if (this.saveSerializedTimer === null) {
      this.saveSerializedTimer = setTimeout(
        () => { this.saveSerializedState({ document, contentId }); }
        , 3000);

    }
  }

  saveSerializedState({ document, contentId }) {
    console.log(`-----External Function: save serialized state  ------`);
    console.log(`this.props.attemptNumber ${this.props.attemptNumber}`);
    console.log(`this.props.assignmentId ${this.props.assignmentId}`);
    console.log(`contentId: ${contentId}`);

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
      learnerUsername: this.props.learnerUsername,
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

    // console.log("contentIdsToDoenetMLs data");
    // console.log(data);

    axios.post(url, data)
      .then(resp => {
        console.log('resp data');
        console.log(resp.data);

        let retrievedDoenetMLs = resp.data.doenetMLs;
        let retrievedContentIds = resp.data.retrievedContentIds;

        let doenetMLByContentId = {};
        for (let [ind, doenetML] of retrievedDoenetMLs.entries()) {
          doenetMLByContentId[retrievedContentIds[ind]] = doenetML;
        }

        let success = true;
        let message = ""
        let doenetMLs = [];
        let contentIds = [];
        for (let contentId of contentIds) {
          let doenetML = doenetMLByContentId[contentId]
          if (doenetML === undefined) {
            message += `Can't find content with contentId ${contentId}\n`;
            success = false;
            doenetMLs.push("");
            contentIds.push("");
          } else {
            const hash = crypto.createHash('sha256');
            hash.update(doenetML);
            let contentIdTest = hash.digest('hex');
            if (contentId === contentIdTest) {
              doenetMLs.push(doenetML);
              contentIds.push(contentId);
            } else {
              message += `Error: checksum didn't match for contentId ${contentId}\n`;
              success = false;
              doenetMLs.push("");
              contentIds.push("");
            }
          }

        }

        callBack({ newDoenetMLs: doenetMLs, newContentIds: contentIds, message, success });

      });


  }

  recordSolutionView({ itemNumber, scoredComponent, callBack }) {
    // console.log(`-----External Function: reveal solution "${itemNumber}" ------`);
    // console.log(`this.props.attemptNumber ${this.props.attemptNumber}`);
    // console.log(`this.props.assignmentId ${this.props.assignmentId}`);
    // console.log(`allowViewSolutionWithoutRoundTrip ${this.allowViewSolutionWithoutRoundTrip}`);

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

    // console.log("data");
    // console.log(data);
    // console.log(`this.props.course ${this.props.course}`);


    if (this.props.course) {
      const url = '/open_api/saveSubmitResult.php';

      axios.post(url, data)
        .then(resp => {
          console.log(resp.data);
          let resultObj = { success: false };
          if (resp.status === 200) {
            resultObj.success = true;
            resultObj.viewedSolution = resp.data.viewedSolution;
          }
          if (callBack) {
            callBack(resultObj);
          }
        })
        .catch(
          err => {
            console.log(err);

            let resultObj = { success: false };
            if (callBack) {
              callBack(resultObj);
            }

          }
        );


    }






  }

  allAnswersSubmitted() {
    if (this.viewerExternalFunctions.allAnswersSubmitted) {
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

  goToGroup({ groupCode, transferState = false }) {
    if (transferState) {
      //Local State to Global State
      window.sessionStorage.transferToGlobal = JSON.stringify(this.worksheet.state.doenetMLState, serializedStateReplacer);
    }
    window.location.href = URL_add_parameter(location.href, 'group', groupCode.toString().toUpperCase());
  }

  leaveGroup() {
    //Global State to Local State
    window.sessionStorage.transferToLocal = JSON.stringify(this.worksheet.globalState.doenetMLState, serializedStateReplacer);

    window.location.href = URL_remove_parameter(location.href, 'group');
  }

  render() {

    if (!this.state.apiStateReady) { return <div>Loading..</div>; }

    if (this.props.viewerFlags && this.props.viewerFlags.callSubmitAllAnswersCounter !== this.callSubmitAllAnswersCounter) {
      this.callSubmitAllAnswersCounter = this.props.viewerFlags.callSubmitAllAnswersCounter;
      this.core.document.submitAllAnswers();
    }

    let collaborationWindow = null;
    if (this.props.showCollaboration) {
      let collaborationPane = null;
      let activeGroupPane = null;


      if (this.state.collaborateWindowOpen) {

        if (this.state.collaborationPanelState === "join or create") {
          collaborationPane = <React.Fragment>
            <div style={{ margin: "10px 0px 10px 0px" }}>
              <button onClick={() => this.setState({ collaborationPanelState: "joining group" })}>Join Group</button>
            </div>
            <div style={{ marginTop: "10px", marginBottom: "10px" }}><button
              onClick={() => { this.goToGroup({ groupCode: generate('abcdefghijklmnopqrstuvwxyz', 5), transferState: true }) }}>Create Group</button></div>
          </React.Fragment>
        }
        if (this.state.collaborationPanelState === "joining group") {
          let joinGroupText = this.state.joinGroupText;
          if (!joinGroupText) { joinGroupText = ""; }
          let joinGroupDisabled = true;
          if (joinGroupText.length === 5) {
            joinGroupDisabled = false;
          }
          collaborationPane =
            <div style={{ margin: "10px 0px 10px 0px" }}>
              <input
                onKeyDown={((e) => {
                  if (e.key === 'Enter') {
                    this.goToGroup({ groupCode: this.state.joinGroupText });
                  }
                })}
                onChange={(e) => {
                  this.setState({ joinGroupText: e.target.value })
                }}
                maxLength="5"
                placeholder="Group Code"
                style={{ marginLeft: "10px", marginRight: "5px", width: "120px", fontSize: "14pt", textAlign: "center" }}
                type="text"
                value={joinGroupText.toUpperCase()}
              />
              <button disabled={joinGroupDisabled} onClick={() => this.goToGroup({ groupCode: this.state.joinGroupText })}>Join</button>
            </div>
        }


        if (this.state.collaborationPanelState === "group is active") {
          collaborationPane = <React.Fragment>
            <div style={{ margin: "10px 0px 10px 0px" }}>
              <button onClick={this.leaveGroup}>Leave Group</button>
            </div>
          </React.Fragment>

        }
      }

      let playerNumberPane = null;
      if (this.state.collaborationPanelState === "group is active") {
        let activeGroupCode = this.group;
        if (!activeGroupCode) {
          activeGroupCode = "";
        }
        activeGroupCode = activeGroupCode.toUpperCase();

        activeGroupPane = <div>Group <b>{activeGroupCode}</b> </div>;
        playerNumberPane = <div>Player {this.playerNumber}</div>;
      }



      collaborationWindow = <div style={{
        backgroundColor: "#f5f5f5",
        width: "150px",
        position: "fixed",
        right: "200px",
        top: "0px",
        textAlign: "center",

      }}><div style={{ padding: "5px" }}
        onClick={() => this.setState({ collaborateWindowOpen: !this.state.collaborateWindowOpen })}>
          <div style={{ cursor: "pointer", textDecoration: "underline", fontSize: "12pt" }}>Collaborate</div>
          {activeGroupPane}
          {playerNumberPane}
        </div>
        {collaborationPane}

      </div>
    }


    return (<React.Fragment>
      {collaborationWindow}
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

function URL_remove_parameter(url, param) {
  var hash = {};
  var parser = document.createElement('a');

  parser.href = url;

  var parameters = parser.search.split(/\?|&/);

  for (var i = 0; i < parameters.length; i++) {
    if (!parameters[i])
      continue;

    var ary = parameters[i].split('=');
    if (ary[0] == param)
      continue;
    hash[ary[0]] = ary[1];
  }

  var list = [];
  Object.keys(hash).forEach(function (key) {
    list.push(key + '=' + hash[key]);
  });

  parser.search = '?' + list.join('&');
  return parser.href;
}

function URL_add_parameter(url, param, value) {
  var hash = {};
  var parser = document.createElement('a');

  parser.href = url;

  var parameters = parser.search.split(/\?|&/);

  for (var i = 0; i < parameters.length; i++) {
    if (!parameters[i])
      continue;

    var ary = parameters[i].split('=');
    hash[ary[0]] = ary[1];
  }

  hash[param] = value;

  var list = [];
  Object.keys(hash).forEach(function (key) {
    list.push(key + '=' + hash[key]);
  });

  parser.search = '?' + list.join('&');
  return parser.href;
}

export default DoenetViewer;
