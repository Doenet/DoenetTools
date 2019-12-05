import React, { Component,Suspense,lazy } from 'react';
//import React, { Suspense } from 'react';
// import doenetDefaultCode from '../defaultCode.doenet';
import axios from 'axios';
axios.defaults.withCredentials = true;
import crypto from 'crypto';
import nanoid from 'nanoid';
import DoenetViewer from './DoenetViewer';
import DoenetHeader from './DoenetHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt as externalLink } from '@fortawesome/free-solid-svg-icons';
import { faWindowClose as closeExternalLink } from '@fortawesome/free-solid-svg-icons';
import { faChevronLeft as openContentPanel } from '@fortawesome/free-solid-svg-icons';
import { faChevronRight as closeContentPanel } from '@fortawesome/free-solid-svg-icons';
// const DoenetViewer = ({id}) =>{
//     const {data} = useAsync ({id,promiseFn:loadUser,suspense:true})
//     return data ? 'hello':null
// }
 //const DoenetViewer = React.lazy(()=> import ('./DoenetViewer'));
// const DoenetViewer = Loadable({
//   loader: () => import('./DoenetViewer'), // <-- dynamic import
//   loading: Loading,
// });



import "./editor.css";
import * as ComponentTypes  from '../Doenet/ComponentTypes';
import allComponents from '../../docs/complete-docs.json';
import AceEditor from 'react-ace';
import brace from 'brace';
import 'brace/mode/xml';
import 'brace/theme/textmate';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
let load_doc_id= window.location.search.substring(1);
console.log(window.location.search.substring(1));
//console.log(typeof(window.location.pathname));
class DoenetEditor extends Component {
  constructor(props) {
    super(props);
      console.time("x");
      
      this.freshDocumentName = "Untitled document";

      this.doenetDocumentSidebar = <p>loading...</p> //TODO: Remove this
      this.numberLoaded = 0;

      let url_string = window.location.href;
      var url = new URL(url_string);
      this.contentId = url.searchParams.get("contentId"); //Not used yet
      this.branchId = url.searchParams.get("branchId");
      console.log(this.branchId)
      

      // this.branchId = "Hj4NperLUm_UxLWtV7xTq";
      // this.doenetML="";
      this.viewerWindow = "";
      // this.contentId = "9c1e52da5be77f2315b9440aae1a8a03b34694ecad4ef01dac52087df4eba35f";

      this.newContent = {};
      this.documentOrder=[];
      this.ListOfContentId="";
      this.List_Of_Recent_doenetML=[]; // this is to store list of (date:doenetML) from getDoenetML.php
      this.List_doenetML_timestamp = [];
      this.branchID="";
      this.documentTitle="";
      this.functionsSuppliedByChild = {};

      if (this.contentId !== null || this.branchId !== null){
      console.log("--still SPINNING");

      const phpUrl='/api/getDoenetML.php';
      const data={        
        branchId: this.branchId,
        contentId: this.contentId,
        ListOfContentId:"", //this is to store all contentID of one branchID for publish indication 
        List_Of_Recent_doenetML:[], // this is to store list of (date:doenetML) 
      }
      
      const payload = {
        params: data
      }
      console.log('payload is')
      console.log(payload);
      axios.get(phpUrl,payload)
        .then(resp=>{
          console.log('getDoenetML resp data');
          console.log(resp.data);
          let doenetML = resp.data.doenetML;
          console.log("doenetML!!!!!!!!!!!!");
          console.log(doenetML);
          this.updateNumber++;
          this.doenetML=doenetML;
          this.ListOfContentId = resp.data.ListOfContentId;
          this.List_Of_Recent_doenetML = resp.data.List_Of_Recent_doenetML.reverse();
          this.branchID = resp.data.branchID;
          this.documentTitle = resp.data.title;
          this.currentDocumentTitle = resp.data.title;
          console.log("about to...")
          console.log("YesSS");
          //window.onmessage = this.updateCode; //KEEPING THIS. TURN IT ON ASAP AFTER FIXING BUG ?
          this.getTitle();
          this.buildDoenetMLDate();
        })
        .catch(error=>{this.setState({error:error})});

      }

    this.state = {
      open_context_pannel:true,
      deleteCurrentTitle:true,
      titleExist:false,
      enableEditingTitle:false,
      valueShouldBeLength:0,
      allowViewSolutionWithoutRoundTrip: true,
      solutionType: "button",
      showHints: true,
      modeOpen: false,
      showFeedback: true,
      showCorrectness: true,
      allAnswersSubmitted: false,
      code: "",
      error: null,
      errorInfo: null,
      documentName: this.freshDocumentName,
      edittingName: false,
      activeDocumentExists: false,
      deleteDocumentPopupOpen: false,
      viewerOpenDocumentId: "",
      search: "",
      fontSize: 12,
      tagsOpen: false,
      nextTagText: "",
      docTags: [],
      docTagErrorMessage: "",
      filterByUsernameValue: "",
      filterByTagValue: "",
      lastPublishID:"",//NEVER USED

      publishList:[],
      disable_publish:true,//new
      Toggle_brand_Selection:true,
      current_code:"",
      publish_button:"button_disabled",
      separated_Viewer:false,
      change_title_not_code:false,

    };
    
    this.buildContextPanel({tagType:"constructor",properties:{}});

    this._documentNameInput = React.createRef();

    this.branchId = "";
      
    this.updateNumber = 0;
    this.saveTimer = null;

    this.updateCode = this.updateCode.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.turnOnEditDocumentName = this.turnOnEditDocumentName.bind(this);
    this.changeDocumentName = this.changeDocumentName.bind(this);
    this.updateDocumentName = this.updateDocumentName.bind(this);
    this.documentNameBlur = this.documentNameBlur.bind(this);
    this.handleNew = this.handleNew.bind(this);
    this.loadOnClick = this.loadOnClick.bind(this);
    //this.buildLoadDocumentsInterface = this.buildLoadDocumentsInterface.bind(this);
    this.saveToServer = this.saveToServer.bind(this);
    this.deleteDocument = this.deleteDocument.bind(this);
    this.openDeleteFilePopup = this.openDeleteFilePopup.bind(this);
    this.closeDeleteFilePopup = this.closeDeleteFilePopup.bind(this);
    this.selectAllOnUntitled = this.selectAllOnUntitled.bind(this);
    this.resetEditor = this.resetEditor.bind(this);
    this.toggleViewer = this.toggleViewer.bind(this);
    this.handleViewerClose = this.handleViewerClose.bind(this);
    this.onCursorChange = this.onCursorChange.bind(this);
    this.findTagViaCursor = this.findTagViaCursor.bind(this);
    this.buildContextPanel = this.buildContextPanel.bind(this);
    this.handleAddChild = this.handleAddChild.bind(this);
    this.handleUpdateBoolean = this.handleUpdateBoolean.bind(this);
    this.handleSearchEntry = this.handleSearchEntry.bind(this);
    this.handleResizeFont = this.handleResizeFont.bind(this);
    this.handleDocTags = this.handleDocTags.bind(this);
    this.docTagKeystroke = this.docTagKeystroke.bind(this);
    this.nextDocTagText = this.nextDocTagText.bind(this);
    this.addDocTag = this.addDocTag.bind(this);
    this.removeDocTag = this.removeDocTag.bind(this);
    this.handleFilterByUsernameChange = this.handleFilterByUsernameChange.bind(this);
    this.handleFilterByUsernameKeypress = this.handleFilterByUsernameKeypress.bind(this);
    this.handleFilterByTagChange = this.handleFilterByTagChange.bind(this);
    this.handleFilterByTagKeypress = this.handleFilterByTagKeypress.bind(this);
    this.saveDocumentChanges = this.saveDocumentChanges.bind(this);
    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.publish = this.publish.bind(this);
    this.setLastID = this.setLastID.bind(this);//new change
    this.getContentId = this.getContentId.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    //this.loadSharedContent = this.loadSharedContent.bind(this);//newly added for separation
    this.assignmentDataToCourseInfo = this.assignmentDataToCourseInfo.bind(this);
    this.handlingChange = this.handlingChange.bind(this);
    this.load_current_code = this.load_current_code.bind(this);
    this.modeToggle = this.modeToggle.bind(this);
    this.handleDocTileChange = this.handleDocTileChange.bind(this);
    this.getTitle = this.getTitle.bind(this)
    this.deleteCurrentTitle = this.deleteCurrentTitle.bind(this);
    this.buildDoenetMLDate = this.buildDoenetMLDate.bind(this);
    this.updateDoenetML = this.updateDoenetML.bind(this);
    
    //window.onmessage = this.updateCode; //KEEPING THIS. TURN IT ON ASAP AFTER FIXING BUG ?

    // this.generateDocs(); //Save for later
    
  }
  updateDoenetML(e){
    console.log("new code is...")
    this.doenetML=(e.target.value);
    this.forceUpdate();
  }
  deleteCurrentTitle (){
    //do this one time
    this.setState({deleteCurrentTitle:false})
    let i = 0;
    let k = this.doenetML[i]
    while (k==' '){
      i+=1
      k = this.doenetML[i]
    }
    // not space
    if (k=='<'){
    // checking if it is a title tag
    let temp = '<title>';
    let r = ''
      while (k!='>'){
        r+=k
        i+=1
        k = this.doenetML[i]
      }
      r+=k
      // k is '>'
      if (r==temp){
        // title exists
        i+=1
        k = this.doenetML[i]
        while (k!='>'){
          i+=1
          k = this.doenetML[i]
        }
        // i store the length of title tag
        this.doenetML = this.doenetML.substring(i+1,this.doenetML.length)
      }
    }
  }
  
  getTitle (){
    if(this.doenetML==""){
    }
    else{
      let i = 0;
      let k = this.doenetML[i]
      while (k==' '){
        i+=1
        k = this.doenetML[i]
      }
      // not space
      if (k=='<'){
      let temp = '<title';
      let r = ''
        while (k!='>'){
          r+=k
          i+=1
          k = this.doenetML[i]
        }
        // k is '>'
      if (r==temp){
        // title exist 
        this.setState({titleExist:true})
        this.documentTitle=''
        i+=1
        k = this.doenetML[i]
        /* if typed_input_title is true */
        while (k!='<'){
          this.documentTitle += k
          i+=1
          k = this.doenetML[i]
        }
        this.currentDocumentTitle = this.documentTitle;
      }
      }         
    }
  }

  handleDocTileChange(){
    console.log("running handleDocTileChange")
    console.log(this.documentTitle)
    //this.documentTitle=name;
    this.setState ({disable_publish:false})
    //if editorCode matches the this.doenetML, the one we just pull. just replace the title instead of adding new one
    this.setState({change_title_not_code:true})
    //this.forceUpdate();
  }

  load_current_code(code){
    this.setState({current_code:code});
  }
  modeToggle(){
    this.setState({modeOpen:!this.state.modeOpen})
  }

//   loadSharedContent(){
//      console.log("running loadSharedContent")
//     const url='/api/loadWithKeywords.php';
//     axios.get(url)
//     .then(resp=>{
//     //reset data
    
    

//     for (let data of resp.data){
//       //console.log(data);
//       let docTags = [];
//       if (data.docTags[0] !== null){
//         docTags = data.docTags;
//       }

//       this.sharedContent[data.branchId] = {
//         documentName:data.title,
//         code:data.doenetML,
//         docTags:docTags,
//         contentId:data.contentId,  //TODO: Remove this from all areas
//         creationDate:data.creationDate,
//         updateDate:data.updateDate,
//     };
    
//     this.documentOrder.push(data.branchId);
//     //console.log(this.documentOrder)
    
//     }
//     this.buildLoadDocumentsInterface(); //asynchronous problem. builder should be put here otherwise the array is empty
//     console.log("-----making------")
//     this.numberLoaded = this.numberLoaded + 1;
//     this.load_current_code(this.sharedContent[load_doc_id].code);
//     this.forceUpdate();
//   })
//   .catch(error=>{this.setState({error:error})});

  
// //this.buildLoadDocumentsInterface();
//   }

  assignmentDataToCourseInfo({courseId,data}){
        console.log("OH NO...")
        
    let parentHeadingIds = [];
    
    let prevLoopLevel = 1;
    let potentialParentHeadingId = "";
    for(let i = 0; i < data.headingText.length; i++){

        let headingText = data.headingText[i];
        let headingLevel = data.headingLevel[i];
        let headingId = data.headingId[i];
        if (prevLoopLevel < headingLevel){
            if (potentialParentHeadingId !== ""){
                parentHeadingIds.push(potentialParentHeadingId);
            }
        }else if (prevLoopLevel > headingLevel){
            for (var x = 0; x < (prevLoopLevel - headingLevel); x++){
                parentHeadingIds.pop();
            }
        }
        

        let baseObj = this.courseInfo[courseId];
        for (let headingId of parentHeadingIds){
            baseObj = baseObj.heading[headingId];
        }
        if (baseObj.headingsOrder === undefined){
            baseObj.headingsOrder = [];
            baseObj.heading = {};
        }
        
        // Add the heading information to the base object
        baseObj.headingsOrder.push({
                courseHeadingId:headingId,
                headingText:headingText,
            });
        baseObj.heading[headingId] = {};
        if (data.assignments[headingId] !== undefined){
                baseObj.heading[headingId].assignmentOrder = [];
                baseObj.heading[headingId].assignments = {};
                for (let assignmentInfo of data.assignments[headingId]){
                    if(assignmentInfo.individualize === "1"){
                        assignmentInfo.individualize = true;
                    }else if(assignmentInfo.individualize === "0"){
                        assignmentInfo.individualize = false;
                    }
                    if(assignmentInfo.multipleAttempts === "1"){
                        assignmentInfo.multipleAttempts = true;
                    }else if(assignmentInfo.multipleAttempts === "0"){
                        assignmentInfo.multipleAttempts = false;
                    }
                    if(assignmentInfo.showSolution === "1"){
                        assignmentInfo.showSolution = true;
                    }else if(assignmentInfo.showSolution === "0"){
                        assignmentInfo.showSolution = false;
                    }
                    if(assignmentInfo.showFeedback === "1"){
                        assignmentInfo.showFeedback = true;
                    }else if(assignmentInfo.showFeedback === "0"){
                        assignmentInfo.showFeedback = false;
                    }
                    if(assignmentInfo.showHints === "1"){
                        assignmentInfo.showHints = true;
                    }else if(assignmentInfo.showHints === "0"){
                        assignmentInfo.showHints = false;
                    }
                    if(assignmentInfo.showCorrectness === "1"){
                        assignmentInfo.showCorrectness = true;
                    }else if(assignmentInfo.showCorrectness === "0"){
                        assignmentInfo.showCorrectness = false;
                    }
                    if(assignmentInfo.proctorMakesAvailable === "1"){
                        assignmentInfo.proctorMakesAvailable = true;
                    }else if(assignmentInfo.proctorMakesAvailable === "0"){
                        assignmentInfo.proctorMakesAvailable = false;
                    }
                baseObj.heading[headingId].assignmentOrder.push(assignmentInfo.assignmentId);
                baseObj.heading[headingId].assignments[assignmentInfo.assignmentId] = {
                    documentName:assignmentInfo.assignmentName,
                    docTags:[],
                    contentId:assignmentInfo.contentId,
                    sourceBranchId:assignmentInfo.sourceBranchId,
                    assignedDate:assignmentInfo.assignedDate,
                    dueDate:assignmentInfo.dueDate,
                    gradeCategory:assignmentInfo.gradeCategory,
                    totalPointsOrPercent:assignmentInfo.totalPointsOrPercent,
                    coverPageHTML:assignmentInfo.coverPageHTML,
                    latestPublishedContentTest:assignmentInfo.latestPublishedContentTest,
                    individualize:assignmentInfo.individualize,
                    multipleAttempts:assignmentInfo.multipleAttempts,
                    showSolution:assignmentInfo.showSolution,
                    showFeedback:assignmentInfo.showFeedback,
                    showHints:assignmentInfo.showHints,
                    showCorrectness:assignmentInfo.showCorrectness,
                    proctorMakesAvailable:assignmentInfo.proctorMakesAvailable,
                    
                };
            }
            
        }


        prevLoopLevel = headingLevel;
        potentialParentHeadingId = headingId;
    }

  }

  updateCode(e){
    console.log("--running updateCode--")
    //console.log(e)
    //TODO: Need security here
    this.handleUpdate(e);
  }
 
  // buildLoadDocumentsInterface(){
  //   console.log("RUNNING BUILDER")
  //   let listOfDocs = [];
  //   /*what-if: 
  //   this.loadDate()

  //   */
  //   for (let id of this.documentOrder){
  //     let documentName = this.sharedContent[id].documentName;//changes for separation
  //     let document_creationDate = this.sharedContent[id].creationDate;
  //     let document_updateDate = this.sharedContent[id].updateDate;
  //     let docTags = this.sharedContent[id].docTags; //changes for separation
  //     let mustHaveTheseTags = this.state.filterByTagValue.split(",");      
  //     let showThisDocument = true;

  //     if (!(mustHaveTheseTags.length === 1 && mustHaveTheseTags[0] === "")){
        
  //       for (let tagNeed of mustHaveTheseTags){
  //       let foundIt = false;
        
  //       for (let hasTag of docTags){
  //           if (hasTag === tagNeed){foundIt = true; break;}
  //         }
          
  //         if (!foundIt){showThisDocument = false; break;}
  //       }
  //     }
      
  //     //console.log(this.sharedContent.documentOrder)
  //     if (showThisDocument){
  //       listOfDocs.push(
  //         <List.Item key={id} onClick={() => this.loadOnClick(id)} as='a'>
  //           <Icon name='file' />
  //           <List.Content>
  //             <List.Header>{documentName}</List.Header>
  //             <List.Description>Last Update on: {document_updateDate}</List.Description>
  //             <List.Description>Created on: {document_creationDate}</List.Description>             
  //           </List.Content>
  //         </List.Item>
  //       )
  //     }
  //   }
  //   this.doenetDocumentSidebar = (<List>
  //   {listOfDocs}
  //   </List>);
  // }

  loadOnClick(id){

    this.branchId = id;
    console.log("----loadOnClick-----");
    // console.log("is is "+load_doc);
    // console.log("is is "+id);
    // console.log("object is ");
    console.log(this.sharedContent);
    let code = this.sharedContent[id].code;

    if (code === null){code = "";}
    let documentName = this.sharedContent[id].documentName;
    
    this.updateNumber++;
    // this.currentViewer = <DoenetViewer key={"doenetviewer"+this.updateNumber} free={{doenetCode: code}} />;
    window.MathJax.Hub.Queue(
      ["resetEquationNumbers",window.MathJax.InputJax.TeX],
    );

    this.setState({
      code: code,
      error: null,
      errorInfo: null,
      documentName: documentName,
      edittingName: false,
      activeDocumentExists: true,
      docTags: this.sharedContent[id].docTags,
    });

  }

  documentNameBlur(){
    this.props.sharedContent[this.branchId].documentName = this.state.documentName;
    //this.buildLoadDocumentsInterface();
    console.log("passing info from documentNameBlur to saveToServer");
    console.log(this.state.documentName);
    console.log(this.state.code);
    console.log(this.branchId);

    this.saveToServer({
      documentName:this.state.documentName,
      code:this.state.code,
      branchId:this.branchId,
     });
    
    this.setState({edittingName:false});

  }

  handleUpdate(e){
    console.log("--running handleUpdate--");
    // console.clear();
    //if(this.branchId === ""){ this.updateNumber = 0; this.handleNew(); return;}    //temporary fix

    // this.props.sharedContent[this.branchId].code = this.state.code;
    if(this.state.viewerOpenDocumentId != ""){
      this.viewerWindow.postMessage({doenetCode: this.doenetML},"*");
    }
    this.saveDocumentChanges({blur:false});
    this.saveToServer({
      documentName:this.state.documentName,
      code:this.doenetML,
      branchId:this.branchId,
     });

    this.updateNumber++;
    // this.currentViewer = <DoenetViewer key={"doenetviewer"+this.updateNumber} free={{doenetCode: this.state.code}} />;
    // window.MathJax.Hub.Queue(
    //   ["resetEquationNumbers",window.MathJax.InputJax.TeX],
    // );
    this.setState({error:null,errorInfo:null});
  }

  handleNew(){
    console.log("----handle new in editor----")
    this.updateNumber++;
    // this.currentViewer = <DoenetViewer key={"doenetviewer"+this.updateNumber} free={{doenetCode: ""}} />;
    // window.MathJax.Hub.Queue(
    //   ["resetEquationNumbers",window.MathJax.InputJax.TeX],
    // );
    this.branchId = nanoid();
    console.log("new branch id is")
    console.log(this.branchId);
    this.newContent = {
      documentName:this.freshDocumentName,
     code:"",
     docTags:[],
    }
    //console.log(this.sharedContent)
  //   this.sharedContent[this.branchId] = {
  //   documentName:this.freshDocumentName,
  //   code:"",
  //   docTags:[],
  // };
  //console.log("printing this.sharedContent[this.branchId]..")
  //console.log(this.sharedContent[this.branchId])
  //console.log(this.documentOrder)
  
  this.documentOrder.push(this.branchId);//changes for separation
  //this.loadSharedContent();
  //console.log(this.documentOrder)
  //this.buildLoadDocumentsInterface();

  //console.log("order is !!!!!");
  //console.log(this.sharedContent.documentOrder);
  //console.log("freshDocumentName is..."+this.freshDocumentName);
  //console.log("branchID in handleNew is..."+this.branchId);
  console.log("fresh name ---"+this.freshDocumentName);
  console.log("fresh ID--"+this.branchId)
  this.saveToServer({
    documentName:this.freshDocumentName,
    code:"",
    branchId:this.branchId});
   // console.log(this.sharedContent);
  //  if (this.updateNumber > 1){
     
    this.setState({
      code:"",
      error: null,
      errorInfo: null,
      documentName: this.freshDocumentName,
      edittingName: false,
      activeDocumentExists: true,
      docTags:this.sharedContent[this.branchId].docTags,
    });
  //  }
    
  }
  //new change
  //this set lastPublishID to current publish branchID
  getContentId ({code}){
    const hash = crypto.createHash('sha256');
    if (code === undefined){
      return;
    }
    
    hash.update(code);
    let contentId = hash.digest('hex');
    return contentId;
  }

  setLastID({code}){ //NEVER USED
    const hash = crypto.createHash('sha256');
    if (code === undefined){
      return;
    }
    
    hash.update(code);
    let contentId = hash.digest('hex');

    
    
  }
  //new change

  publish(){
    
    this.currentDocumentTitle = this.documentTitle; // TODO: do we need currentDocumentTitle ?
    let contentid=this.getContentId({code:this.doenetML});
    this.ListOfContentId[this.ListOfContentId.length]=contentid;
     let date = new Date();
    // date = date.getUTCFullYear() + '-' +
    // ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
    // ('00' + date.getUTCDate()).slice(-2) + ' ' + 
    // ('00' + date.getUTCHours()).slice(-2) + ':' + 
    // ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
    // ('00' + date.getUTCSeconds()).slice(-2);
    // date = date.toString();
     let now_str= date.toString();
     let list_obj = {};
     list_obj [now_str]=this.doenetML;
    // list_obj["doenetML"]=this.doenetML;
    // list_obj["menuText"]=now_str;
    // console.log(list_obj);
    this.List_Of_Recent_doenetML.push(list_obj)
    //this.List_Of_Recent_doenetML.push({date:this.doenetML});
    console.log("new entry...")
    console.log (this.List_Of_Recent_doenetML);
    this.saveToServer({documentName:this.documentTitle,code:this.doenetML,branchId:this.branchID,publish:true});
    this.setState({disable_publish:true});
    this.buildDoenetMLDate();
  }
 
  handleCheck(val) {
    return this.state.publishList.some(item => val === item);
  }

  saveToServer({documentName,code,branchId,publish=false}){
    console.log("-----insde saveToServer------");
    //console.log("documentName is "+documentName);
    //console.log("code is "+code);
   // console.log("branchId is "+branchId);
    //console.log("publish is "+publish);
    this.handlingChange(this.doenetML);
    //console.log(this.state.disable_publish);
    /* ----MICRO-OPTIMIZATION----
    const url1 = "/api/loadFromContentId.php"
    let ID = this.getContentId({code:code}) //get contentid
    const data1 = {
      contentId:ID
    } //passing id into data1 package
    if (publish===false){
      axios.post(url1, data1)
      .then((response)=> {
        //console.log(response);
        console.log("-------running savetoserver, publish is false---------")
        if(response.data.doenetML==="Match"){
          this.setState({disable_publish:true})
        }
        else{
          this.setState({disable_publish:false})
        };
      })
      .catch(function (error) {
        this.setState({error:error});
  
      })
    };*/
    //console.log(this.state.disable_publish);
   /* const hash = crypto.createHash('sha256');
    if (code === undefined){
      return;
    }
    hash.update(code);
    let contentId = hash.digest('hex');*/

    /*(this.handleCheck(contentId)) ? (
      this.setState({IconColor:"green"})
    ): (this.setState({IconColor:"red"}));*/

    //Increment content revision number on dev and prod
    
    //this.sharedContent[branchId].revisionNumber++;

    if (this.props.prodOrDev === "dev"){
      console.log('Save To Server');
      console.log({
        title: documentName,
        doenetML: code,
        branchId: branchId,
        contentId: ID,
        author: this.props.username,
        publish: publish,
      });
      
      
      return;
    }
    // this.updateNumber++;
    // alert(`Saving file ${this.state.documentName}`);
    // const url='http://doenet.com'
    console.log("----running saveToServer----");
    console.log(this.state.change_title_not_code)
    let ID = this.getContentId({code:code}) //get contentid
    const url='/api/save.php';
    const data={
      title: this.documentTitle,
      doenetML: code,
      branchId: branchId,
      contentId:ID, //ALWAYS KEEP THIS EMPTY FOR PHP FILE TO RUN CORRECTLY ?
      author: this.props.username,
      publish: publish,
      change_title_not_code:this.state.change_title_not_code, //new
    }
    console.log(data)
    //new change
    /*if (publish===true){
      var joined = this.state.publishList.concat(contentId);
      this.setState({ publishList: joined });
      console.log(contentId);
      console.log(this.handleCheck(contentId));
      console.log(this.state.publishList);
    }*/
    //console.log('saveToServer data');
    //console.log(data);
    if (publish===true){
    axios.post(url, data)
    .then(function (response) {
      console.log(response);
      //console.log("-------DATA---------")
      console.log(response.data);
      
    })
    .catch(function (error) {
      this.setState({error:error});

    })
    console.log("exiting saveToServer")
    //var joined = this.state.publishList.concat(ID);
    //this.setState({ publishList: joined });
    
  };


  }

  saveDocumentChanges({blur}){
    //console.log("running saveDOcumentChange");
    console.log("-----inside saveDocumentChanges------");
    if (blur){
      //Timer is still running so clear it
      clearTimeout(this.saveTimer);
    }
    this.saveTimer = null;
    //console.log(this.sharedContent);
    //console.log("sharedContent[this.branchID] is ");
    //console.log(this.sharedContent[this.branchId])
    //console.log(this.branchId);
    this.newContent.code = this.doenetML;
    //console.log("shared content in saveDocumentChanges is ");
    //console.log(this.sharedContent);
    
    //console.log(this.sharedContent[this.branchId].code);
   // console.log(this.state.documentName);
    //console.log(this.state.code);
    //console.log(this.branchId);

    this.saveToServer({documentName:this.state.documentName,code:this.state.code,branchId:this.branchId});
    
  }

  handlingChange(editorCode){
    console.log("running handlingChange !!")
    //const url1 = "/api/loadFromContentId.php"
    console.log("disable_publish is...")
    console.log(this.state.disable_publish);
    let ID = this.getContentId({code:editorCode}) //get contentid
    console.log(ID);
    console.log(editorCode)
    let x = false;
    console.log("looping")
    console.log(this.ListOfContentId)
    this.ListOfContentId.map(element => {
      if (element===ID){
        this.setState({disable_publish:true})
        x=true;
      }
    })
    if (!x){this.setState({disable_publish:false})}
    ;
    console.log(this.state.disable_publish);
    // const data1 = {
    //   contentId:ID
    // } //passing id into data1 package
    // axios.post(url1, data1)
    //   .then((response)=> {
    //     console.log(response);
    //     console.log("-------running please handle change---------")
    //     if(response.data.doenetML=="Match"){
    //       this.setState({disable_publish:true})
    //     }
    //     else {this.setState({disable_publish:false})}
    //   })
    //   .catch(function (error) {
    //     this.setState({error:error});
  
    //   })
  }

  handleChange(editorCode,e){ //USE THIS PLEASE FOR HANDLE THE INDICATOR
    console.log("--running handleChange--");
    this.setState({change_title_not_code:false})
    //if(this.branchId === ""){ this.handleNew(); }   //temporary fix
    console.log("------handle change in editor----------")
    console.log(this.state.disable_publish);
    console.log("branch ID in handleChange is..")
    console.log(this.getContentId({code:editorCode}))
    console.log(this.branchID)
    /////////adding
    this.handlingChange(editorCode);

    
    /*const url1 = "/api/loadFromContentId.php"
    let ID = this.getContentId({code:editorCode}) //get contentid
    const data1 = {
      contentId:ID
    } //passing id into data1 package
    axios.post(url1, data1)
      .then((response)=> {
        console.log(response);
        console.log("-------running please handle change---------")
        if(response.data.doenetML=="Match"){
          this.setState({disable_publish:true})
        }
        else {this.setState({disable_publish:false})}
      })
      .catch(function (error) {
        this.setState({error:error});
  
      })*/
      //////adding
      //Save after five second delay on change
    if (this.saveTimer === null){
      //console.log("-----changing savetimeer------")
      this.saveTimer = setTimeout(
        ()=>{this.saveDocumentChanges({blur:false});}
      ,3000);

    }
    console.log(this.state.disable_publish);
    if (e.action === 'remove'){
      let cursor = this.refs.aceEditor.editor.selection.getCursor();
      this.row = cursor.row;
      this.column = cursor.column;
      this.exceptionForRemoveCode = editorCode;
      this.updateContextPanel();
    }
    
    this.doenetML = editorCode; //this is for updating the doenetML code
    // this.CodeWithOutTitleTag = this.doenetML
    console.log("parsing")
    this.getTitle();
    if (this.state.enableEditingTitle){
    let i = 6;
    let k = this.doenetML[i];
    this.documentTitle="";
    while (k!="<"){
      i+=1;
      k = this.doenetML[i];
      this.documentTitle += k;
    }
    console.log("title in handle change")
    console.log(this.documentTitle)
    this.documentTitle = this.documentTitle.substring(0,this.documentTitle.length-1)
  }
    
    
    this.setState({code: editorCode});
  }

  onCursorChange(selection,e){
    this.row = selection.lead.row;
    this.column = selection.lead.column;
    this.updateContextPanel();
  }

  //selection fires last 
  onSelectionChange(selection){
    let row = selection.lead.row;
    let column = selection.lead.column;
    if (this.row === row && this.column === column){
      //Already handled row and column change
      // console.log('*SAME');
      return;
    }
    
    this.row = row;
    this.column = column;
    this.updateContextPanel();
  }

  updateContextPanel(){

    let result = this.findTagViaCursor({row:this.row,col:this.column});
    console.log('updateContextPanel result');
    console.log(result);
    
    
    
    this.buildContextPanel(result);
    if (result.search !== undefined && result.search !== ""){
      this.setState({search:result.search});
    }
    this.forceUpdate();
    this.handleChange;
  }

  turnOnEditDocumentName(e){
    console.log("--running turnOnEditDocumentName--");
    //if(this.branchId === ""){ this.handleNew(); }    //temporary fix

    this.setState({edittingName: true});
  }

  changeDocumentName(e){
    console.log("RUNNING CHANGE DOC NAME");
    if(e.key === 'Enter'){
      
      this.sharedContent[this.branchId].documentName = this.state.documentName;

      //this.buildLoadDocumentsInterface();
      this.saveToServer({
        documentName:this.state.documentName,
        code:this.state.code,
        branchId:this.branchId,
       });
      
    this.setState({edittingName:false});
    }
  }

  updateDocumentName(e){
    
    this.setState({documentName:e.target.value});
  }

  componentDidCatch(error, info){
    this.setState({error:error,errorInfo:info});
  }
 

  resetEditor(){
    this.updateNumber++;
    // this.currentViewer = <DoenetViewer key={"doenetviewer"+this.updateNumber} free={{doenetCode: ""}} />;
    this.setState({
      code: "",
      error: null,
      errorInfo: null,
      documentName: this.freshDocumentName,
      edittingName: false,
      activeDocumentExists: false,
    });
  }

  deleteDocument(){
    console.log("RUNNING DELETE DOC");
    
    if (this.branchId !== ""){
      
      delete this.sharedContent[this.branchId];
      const indexOfId = this.documentOrder.indexOf(this.branchId); //changes for separation
      this.documentOrder.splice(indexOfId,1);//changes for separation

      //this.buildLoadDocumentsInterface();
      //reset interface
      this.resetEditor();
      if (this.props.prodOrDev === "dev"){
        this.branchId = "";
        this.setState({activeDocumentExists: false,deleteDocumentPopupOpen:false});

      return;
      }
      console.log(`Deleting ID ${this.state.branchId}`);
      // const url='https://localhost:8888/delete.php';
      const url='/api/delete.php';
      const data={
        branchId: this.branchId,
      }
      console.log('delete data');
      console.log(data);
      
      //Temp Get
      const payload = {
        params: data
      }

      
      axios.get(url,payload)
        .then(resp=>{
          console.log('delete resp data');
          console.log(resp.data);
          
          
          //deleted
        })
        .catch(error=>{this.setState({error:error})});
    
    console.log(`Deleting ID ${this.branchId}`);
    this.branchId = "";

    this.setState({activeDocumentExists: false,deleteDocumentPopupOpen:false});
  }
  }

  openDeleteFilePopup(){
    // console.log(this._deleteButton);
    
    // this._deleteButton.focus();
    this.setState({deleteDocumentPopupOpen:true});
  }

  handleViewerClose(){
    this.setState({separated_Viewer:false}); //this makes phase 2 back to phase 1
    this.setState({viewerOpenDocumentId:""});
  }

  toggleViewer(){
    
    // this.viewerWindow = window.open('/viewer');
    // if (this.state.viewerOpenDocumentId != ""){
      this.setState({separated_Viewer:!this.state.separated_Viewer})
      console.log("running toggleViewer")
    if (this.viewerWindow!=""){
      console.log("over here !");
      this.viewerWindow.close();
      this.viewerWindow="";
      // this.refs.aceEditor.editor.focus();
      this.setState({separated_Viewer:false}); //overkilled ?
      this.setState({viewerOpenDocumentId:""});
    }else{
    
      // if (this.state.viewerOpenDocumentId !== ""){
      //   //Another window is open so close that first
      // console.log("over here !");

      //   this.viewerWindow.close();
      // }
      console.log("inside toggleViewer...")
      console.log(this.viewerWindow)
      console.log(this.state.viewerOpenDocumentId)
      this.viewerWindow = window.open(`/viewer?boolean=${!this.state.separated_Viewer}`,'Doenet Viewer', 'width=300,height=600,left=1700,top=0,titlebar=no');
      this.viewerWindow.onbeforeunload = this.handleViewerClose;
      this.viewerWindow.onload = function(){ 
      this.viewerWindow.postMessage({doenetCode: this.doenetML},"*");
        // this.refs.aceEditor.editor.focus();

      }.bind(this);

      // this.viewerWindow.
      // .onpageshow = function(){ 
      //   this.refs.aceEditor.editor.focus();
      // }.bind(this);


      this.setState({viewerOpenDocumentId:this.branchId});
    }
  }

  closeDeleteFilePopup(){
    //need the setTimeout so Firefox doesn't hide the delete button before it's pushed
    window.setTimeout(function(){ 
      this.setState({deleteDocumentPopupOpen:false});
    }.bind(this),100);
  }

  selectAllOnUntitled = (event) => {
    //Select All if the starter untitled document name
    if (this.state.documentName === "" || this.state.documentName === this.freshDocumentName){
    event.target.select();
    }
  }
 
  componentDidCatch(error, info){
    alert('componentDidCatch in DoenetEditor');
    console.log(error);
    
  }

  handleUpdateBoolean(e,propInfo,addPropIndex,tagType){
    let valueShouldBe = "false";
    if (e.target.checked){
      valueShouldBe = "true";
    }

    if (propInfo.quoteType === "double" || propInfo.quoteType === "single"){
    let updatedCode = this.state.code.substring(0,propInfo.indexOfStartQuote) + 
      valueShouldBe + this.state.code.substring(propInfo.indexOfEndQuote,this.state.code.length);
      this.setState({code:updatedCode});
    }else if (propInfo.quoteType === "none"){
      let updatedCode = this.state.code.substring(0,propInfo.endPropNameIndex) + `="${valueShouldBe}"` +
        this.state.code.substring(propInfo.endPropNameIndex,this.state.code.length);
      this.setState({code:updatedCode});
    }else if (propInfo.quoteType === undefined){
      let updatedCode = this.state.code.substring(0,addPropIndex) + ` ${tagType}="${valueShouldBe}"` +
        this.state.code.substring(addPropIndex,this.state.code.length);
      this.setState({code:updatedCode});
    }
    
  }

  handleUpdateNumber(e,propInfo,addPropIndex,tagType){
    let valueShouldBe = e.target.value;
    if (propInfo.quoteType === "double" || propInfo.quoteType === "single"){
    let updatedCode = this.state.code.substring(0,propInfo.indexOfStartQuote) + 
      valueShouldBe + this.state.code.substring(propInfo.indexOfEndQuote,this.state.code.length);
      this.setState({code:updatedCode});
    }else if (propInfo.quoteType === "none"){
      let updatedCode = this.state.code.substring(0,propInfo.endPropNameIndex) + `="${valueShouldBe}"` +
        this.state.code.substring(propInfo.endPropNameIndex,this.state.code.length);
      this.setState({code:updatedCode});
    }else if (propInfo.quoteType === undefined){
      let updatedCode = this.state.code.substring(0,addPropIndex) + ` ${tagType}="${valueShouldBe}"` +
        this.state.code.substring(addPropIndex,this.state.code.length);
      this.setState({code:updatedCode});
    }
  }

  handleUpdateText(e,propInfo,addPropIndex,tagType){
    console.log("running 3")
    console.log (typeof(e.target.value))
    let valueShouldBe = e.target.value;
    this.documentTitle = valueShouldBe
    this.setState({enableEditingTitle:true})
    // this.handleDocTileChange();
    if (this.currentDocumentTitle != valueShouldBe)
    {;
      console.log("here1");
      this.setState ({disable_publish:false})
    }
    else {
      console.log("here2");
      this.setState ({disable_publish:true})}
    //this.setState ({disable_publish:false});
    //if editorCode matches the this.doenetML, the one we just pull. just replace the title instead of adding new one
   // this.setState({change_title_not_code:true});
    console.log(this.state.disable_publish)
      console.log(propInfo)
    if (propInfo.quoteType === "double" || propInfo.quoteType === "single"){
      console.log("running 3.1")
      console.log(propInfo.quoteType)
      this.doenetML = this.doenetML.substring(0,propInfo.indexOfStartQuote) + 
      valueShouldBe + this.doenetML.substring(propInfo.indexOfEndQuote,this.doenetML.length);
      // this.setState({code:updatedCode});
    }else if (propInfo.quoteType === "none"){
      console.log("running 3.2")
      this.doenetML = this.doenetML.substring(0,propInfo.endPropNameIndex) + `="${valueShouldBe}"` +
      this.doenetML.substring(propInfo.endPropNameIndex,this.doenetML.length);
      // this.setState({code:updatedCode});
    }else if (propInfo.quoteType === undefined){
        if (addPropIndex!=0){
          console.log("running 3.3")
          this.doenetML= this.doenetML.substring(0,addPropIndex) + ` ${tagType}="${valueShouldBe}"` +
          this.doenetML.substring(addPropIndex,this.doenetML.length);
        }
        else {
          if (this.state.deleteCurrentTitle==true){
            this.deleteCurrentTitle ();
          }
          this.doenetML=`<${tagType}>${valueShouldBe}</${tagType}>` +
          this.doenetML.substring(this.titleTagLength,this.doenetML.length);
          this.titleTagLength =`<${tagType}>${valueShouldBe}</${tagType}>`.length
          this.valueShouldBeLength = valueShouldBe.length;
        }
      
    }
  }

  handleAddChild(tagType,addAtIndex,searchStartIndex,searchEndIndex,e){
    console.log("running handleAddChild")
    console.log(`::handleAddChild:: searchStartIndex '${searchStartIndex}' searchEndIndex '${searchEndIndex}'`);
    
    let textToAdd = `<${tagType}></${tagType}>`;
    // let newCode = this.doenetML;
    if (searchStartIndex === -1){
      //next position inside tag
      this.doenetML = this.doenetML.substring(0,addAtIndex) + textToAdd + this.doenetML.substring(addAtIndex,this.doenetML.length);
    }else{
      //replace
      this.doenetML = this.doenetML.substring(0,searchStartIndex) +textToAdd + this.doenetML.substring(searchEndIndex,this.doenetML.length);
    }
    console.log("running 2")
    console.log(this.doenetML)
    // this.setState({code:newCode});
    
  }

  handleSearchEntry(e){
    let search = e.target.value;
    console.log(`handleSearchEntry '${search}'`);
    if (search === ""){ search = -1;}//reset search
    this.buildContextPanel({search:search})
    this.setState({search:search});
  }
  buildDoenetMLDate(){
    console.log("finish building list")
    console.log(this.List_Of_Recent_doenetML)
    this.List_doenetML_timestamp = [];
      for (let x = 0;x<this.List_Of_Recent_doenetML.length;x++){
        // console.log("here1")
        // console.log (Object.keys(this.List_Of_Recent_doenetML[x]))  
        let date_ = (<option value={Object.values(this.List_Of_Recent_doenetML[x])}>{Object.keys(this.List_Of_Recent_doenetML[x])}</option>)
         this.List_doenetML_timestamp.push(date_);
         //console.log(this.List_doenetML_timestamp)
        // console.log("here3")
    }
    
     console.log("DONE !!!!")
     console.log(this.List_doenetML_timestamp)
     this.forceUpdate();
  }

  buildContextPanel({
    tagType="document",
    properties={},
    addPropIndex=0,
    addChildIndex=0,
    search=-1,
    searchStartIndex=-1,
    searchEndIndex=-1,
    unmatchedTagFLAG=false,
  }){
//need to fix this |||
    console.log("calling buildContextPanel")
    console.log(tagType)
    if(tagType === 'constructor'){
      this.contextPanel = (<React.Fragment><h3>Context Panel</h3><p>Use this to modify and gather information about your components.</p></React.Fragment>);
      return;
    }

    if(tagType === 'comment'){
      if (unmatchedTagFLAG){
        this.contextPanel = (<React.Fragment><h3>Unended Comment</h3><p>{properties.tagString}</p></React.Fragment>);
      }else{
        this.contextPanel = (<React.Fragment><h3>Comment</h3><p>{properties.tagString}</p></React.Fragment>);
      }
      console.log("---insde second if---");

      return;
    }
    if(tagType === 'inbetween unmatched'){
      this.contextPanel = (<React.Fragment><h3>Unmatched Tag</h3><p>There is a tag missing a closing tag<br/> above this code.</p></React.Fragment>);
      console.log("---insde third if---");
      
      return;
    }

    if (unmatchedTagFLAG){
      this.contextPanel = (<React.Fragment><h3>{tagType}</h3><p>There is a tag missing a closing tag<br/> above this code.</p></React.Fragment>);
      console.log("---insde third if---");      
      return;
    }

    //select graph as a test
    let ComponentClass = allComponents[tagType];
    if (ComponentClass === undefined){ 
      console.warn(`Tag ${tagType} is not defined`);
      console.log("---insde 4th if---");

    this.contextPanel = <h3>Tag '{tagType}' is not defined</h3>
    return;
    }

    this.contextPanel = [];

    let headingForTag = <h3 key="contextHeading">{tagType}</h3>

    this.contextPanel.push(headingForTag);
    console.log("context panel is....")
    // console.log(this.state);
  

    if (search !== -1){
      if (this.state !== undefined && search === ""){
        search = this.state.search;
      }
      let temp = <h4 key="contextSearch">search for '{search}'</h4>
      this.contextPanel.push(temp);
    }
    

    let PropertiesObject = allComponents[tagType]["properties"];
    for(let prop in PropertiesObject){
      // console.log("inside the loop")
      // console.log(prop);
      // console.log(PropertiesObject[prop]);
      if (prop in properties){
        PropertiesObject[prop] = properties[prop];
      } else{
        //TODO: represent these in the context panel
        // delete PropertiesObject[prop];
      }
    }

  //PropertiesObject.title.default = this.documentTitle
  //  console.log("checking this..")
  //  console.log(PropertiesObject)
  // console.log(PropertiesObject.title)
  // console.log(PropertiesObject.title.default);
  for(let prop in PropertiesObject){
    // console.log("inside the loop")
    // console.log(prop);
    // console.log(PropertiesObject[prop]);
    if (prop in properties){
      PropertiesObject[prop] = properties[prop];
    }else if("default" in PropertiesObject[prop]){
      // console.log("prop is..")
      // console.log(prop)
      // if (prop=="title"){
      // console.log(PropertiesObject)
        PropertiesObject[prop].value = this.documentTitle;
      // console.log(PropertiesObject);
      // console.log(PropertiesObject[prop])
      // console.log("PropertiesObject[prop].value is...")
      // console.log(PropertiesObject[prop].value)
    } else{
      //TODO: represent these in the context panel
      delete PropertiesObject[prop];
    }
  }
  let propertiesToDisplay = Object.keys(PropertiesObject).sort();
  for(let [index,tagType] of propertiesToDisplay.entries()){
    // console.log("[index,tagType] is ...")
    // console.log([index,tagType])
      let result =this.tagTypeToContextJSX({
      tagType:tagType,
      value:PropertiesObject[tagType].value,
      propInfo:PropertiesObject[tagType],
      addPropIndex:addPropIndex,
      key:tagType+index})
      console.log("result is..")
      console.log(result)

      this.contextPanel.push(result);
        
    }

    let validChildTypesArray = allComponents[tagType]["childComponents"];

    if (search !== -1){
      validChildTypesArray = validChildTypesArray.filter(
        (tagType => tagType.startsWith(search)
        )
      )
    }

    for(let [index,tagType] of validChildTypesArray.entries()){
      // console.log("running this loop")
      let key = tagType+index;
      
      let tagButton = (<p key={key}>
      <button key={key} onClick={(e) => {this.handleAddChild(tagType,addChildIndex,searchStartIndex,searchEndIndex,e);this.forceUpdate()}}>
      {tagType}
      </button>
      </p>);
      this.contextPanel.push(tagButton);
    }
  
  }
  //need to fix this ^^^

  tagTypeToContextJSX({ tagType, value, propInfo,addPropIndex, key }) {
    if (tagType === undefined) { return null; }

    let standardComponentClasses = ComponentTypes.createComponentTypes();
    let allComponentClasses = ComponentTypes.allComponentClasses();

    // console.log(`tagType ${tagType} value ${value} key ${key}`);
    if (standardComponentClasses[tagType] === undefined){return null;}
    let TagClass = standardComponentClasses[tagType];
    if (TagClass === undefined) { return null; }
    //Check for Boolean
    let BooleanComponent = allComponentClasses["boolean"];
    let NumberComponent = allComponentClasses["number"];
    let TextComponent = allComponentClasses["text"];

    if (BooleanComponent.isPrototypeOf(TagClass) ||
      TagClass.componentType === "boolean") {

      let booleanValue = value;

      if(typeof value === "string" ){
        if (["true","t"].includes(value.trim().toLowerCase()) ) {
          booleanValue = true;
        }else{
          booleanValue = false;
        }
      }
      return (<p key={key}>
        {tagType} <input onChange={(e) => this.handleUpdateBoolean(e,propInfo,addPropIndex,tagType)} type='checkbox' checked={booleanValue}/>
        <br/>
      </p>);
    } else if (
      NumberComponent.isPrototypeOf(TagClass) ||
      TagClass.componentType === "number"
    ) {
      //It's a number
      return (<p key={key}>
        {tagType} <input onChange={(e) => this.handleUpdateNumber(e,propInfo,addPropIndex,tagType)} type='text' value={value}/>
        <br/>
      </p>);
    } else if (
      TextComponent.isPrototypeOf(TagClass) ||
      TagClass.componentType === "text"
    ) {
      //It's a text
      return (<p key={key}>
        {tagType} <input onChange={(e) => 
        {
        // else {this.setState ({disable_publish:false});}
          // if editorCode matches the this.doenetML, the one we just pull. just replace the title instead of adding new one
          this.setState({change_title_not_code:true});
          console.log("hello")
          console.log(e.target.value.length)
          this.setState({valueShouldBeLength:e.target.value.length})
          this.handleUpdateText(e,propInfo,addPropIndex,tagType);
          this.getTitle();
          console.log("ends changing")
        }
          }  type='text' value={value}/>
        <br/>
      </p>);
    } else {
      //Give up for now
      return null;
    }

  }

  extractComponentTypesFromChildLogic(childLogicComponent) {
    if(childLogicComponent.componentType !== undefined) {
      return new Set([childLogicComponent.componentType])
    }
    let componentTypes = new Set([]);
    for(let logicComponent of childLogicComponent.propositions) {
      // recursion
      let newTypes = this.extractComponentTypesFromChildLogic(logicComponent);
      for(let cType of newTypes) {
        componentTypes.add(cType);
      }
    }
    return componentTypes;
  }

  expandAbstractComponentType({componentType, allComponentClasses, standardComponentClasses}) {

    if(componentType in standardComponentClasses) {
      return new Set([componentType]);
    }

    // have an abstract component type
    // replace with set of all components that inherit from the class

    let componentTypes = new Set([]);

    let componentClass = allComponentClasses[componentType];
    if(componentClass !== undefined) {
      for(let newType in standardComponentClasses) {
        let newClass = allComponentClasses[newType];
        if (componentClass.isPrototypeOf(newClass)) {
          componentTypes.add(newType);
        }
      }
    }

    return componentTypes;

  }

  findTagViaCursor({row,col}){

    let documentTag = {
      tagType:"document",
      tagProps:{}
      };
      let searchText = -1;
      let searchStartIndex = -1;
      let searchEndIndex = -1;

    var code = this.doenetML;
    if (this.exceptionForRemoveCode !== undefined){ code = this.exceptionForRemoveCode; this.exceptionForRemoveCode = undefined;}
   
    let result = this.findNextTag({code:code,index:0});
    
    if (result === false){ 

        //test if author is typing a new tag <x or <xxxxx...
        [searchText,searchStartIndex,searchEndIndex] = findSearchText({
          code:code,
          row:row,
          col:col,
          previousEndParsedRow:0,
          previousEndParsedColRight:0,
        });
      
      return {
        tagType:"document",
        properties:{},
        search:searchText,
        searchStartIndex:searchStartIndex,
        searchEndIndex,searchEndIndex,
        unmatchedTagFLAG:false,
      }
    }

    //initialize values
    let unmatchedTagFLAG = false;
    if (result.unmatched){unmatchedTagFLAG = true;} //check for comment not ending

    if (unmatchedTagFLAG && result.tagType === 'comment'){
      return {
        tagType:"comment",
        properties:result.tagProps,
        search:searchText,
        searchStartIndex:searchStartIndex,
        searchEndIndex,searchEndIndex,
        unmatchedTagFLAG:unmatchedTagFLAG,
      }
    }
    let tags = [documentTag];
    let currentRow = 0;
    var currentColumn = 0;
    var currentIndex = 0;
    let previousEndParsedColRight = 0;
    let previousEndParsedRow = 0;

    
      while(result !== false){
   
        
    //handle text before the tag
    let textBeforeTag = code.substring(0,result.tagIndex);
    let additionalRowsInTextBeforeTag = textBeforeTag.split("\n").length - 1;
    currentRow = currentRow + additionalRowsInTextBeforeTag;
    let startParsedRow = currentRow;
    if (additionalRowsInTextBeforeTag > 0){currentColumn = 0;} //New row resets currentColumn
    let lastTextBeforeTag = textBeforeTag.split("\n")[textBeforeTag.split("\n").length-1];
    
    currentColumn = currentColumn + lastTextBeforeTag.length;

    let startParsedColLeft = currentColumn + 1;
    //handle text in start tag
    let tagString = result.tagString;
    let firstLineOfTagString = tagString.split("\n")[0];

    currentColumn = currentColumn + firstLineOfTagString.length;

    let additionalRowsInTagString = tagString.split("\n").length - 1;
    let startParsedColRight = currentColumn; //Right and Left Start are defined
    if (additionalRowsInTagString == 0){startParsedColRight--; }//don't count the end of the tag

    currentRow = currentRow + additionalRowsInTagString; 
    let endParsedRow = currentRow;
    //Assume tag on same line
    let endParsedColLeft = startParsedColLeft;
    let endParsedColRight = startParsedColRight;
    
    let lastLineOfTagString = tagString.split("\n")[tagString.split("\n").length - 1];

    //If tag is over multiple rows find endParsedCol boundries
    if (additionalRowsInTagString > 0){
      endParsedColLeft = 0;
      endParsedColRight = lastLineOfTagString.length - 1;
      currentColumn = lastLineOfTagString.length;//New row resets currentColumn
    } 

    let indexOfStartOfTextBeforeTag = currentIndex;

    currentIndex = currentIndex + result.tagIndex;
    currentIndex = currentIndex + result.tagString.length;
    // console.log("current index is..")
    // console.log(currentIndex)
    let addPropIndex = currentIndex - 1;

    // console.log(`row ${row} col ${col}`);
    // console.log(`startParsedRow ${startParsedRow} socl ${startParsedColLeft} spcr ${startParsedColRight}`);
    // console.log(`endParsedRow ${endParsedRow} epcl ${endParsedColLeft} epcr ${endParsedColRight}`);
    
    //Check if the cursor is inside of a start or end tag
    if (row < endParsedRow && row > startParsedRow ||
      row === startParsedRow && col <= startParsedColRight && col >= startParsedColLeft ||
      row === endParsedRow && col <= endParsedColRight && col >= endParsedColLeft 
      ){
        //in a start or closing tag
        
    if (result.tagType.substring(0,1) === "/"){
      
      
      //Closing tag
      let addChildIndex = currentIndex - result.tagString.length;
      let startTag = tags[tags.length - 1];
      let endTagType = result.tagType.substring(1);
      
      
      if (unmatchedTagFLAG || startTag.tagType !== endTagType ){
        
        unmatchedTagFLAG = true;
        return {
          tagType:endTagType,
          properties:{},
          addPropIndex: -1,
          addChildIndex: -1,
          unmatchedTagFLAG: unmatchedTagFLAG,
          search: -1,
        }
      }

      console.log("startTag.addPropIndex 1 is...")
      console.log (startTag.addPropIndex)
      return {
        tagType:startTag.tagType,
        properties:startTag.tagProps,
        addPropIndex: startTag.addPropIndex,
        addChildIndex: addChildIndex,
        unmatchedTagFLAG: unmatchedTagFLAG,
        search: -1,
      }
    }
    //Starting tag
 
    let addChildIndex = this.findAddChildIndex({
      needleTag:result.tagType,
      result:result,
      code:code,
      currentIndex:currentIndex,
      });
      console.log("addPropIndex 2 is...")
      console.log (addPropIndex)

      return {
        tagType:result.tagType,
        properties:result.tagProps,
        addPropIndex: addPropIndex,
        addChildIndex: addChildIndex,
        unmatchedTagFLAG: unmatchedTagFLAG,
        search: -1,
      }
      
    }else if(
      row < startParsedRow ||
      row === startParsedRow && col < startParsedColLeft
    ){
      //Left of a tag
      //test if author is typing a new tag <x or <xxxxx...
      // console.log(`Left of a tag indexOfStartOfTextBeforeTag ${indexOfStartOfTextBeforeTag}`);
      
      [searchText,searchStartIndex,searchEndIndex] = findSearchText({
        code:textBeforeTag,
        row:row,
        col:col,
        previousEndParsedRow:previousEndParsedRow,
        previousEndParsedColRight:previousEndParsedColRight,
        codeStartIndex:indexOfStartOfTextBeforeTag,

      });

      
      if (unmatchedTagFLAG){
        return {
          tagType:'inbetween unmatched',
          properties:{},
          addPropIndex: -1,
          addChildIndex: -1,
          unmatchedTagFLAG: unmatchedTagFLAG,
          search: -1,
        }
      }

      

  let startTag = tags[tags.length - 1];
  if(startTag.tagType === 'comment'){
    console.log(`inbetween comment unmatchedTagFLAG=${unmatchedTagFLAG}`);
    
    return {
      tagType:"document",
      properties:{},
      search:searchText,
      searchStartIndex:searchStartIndex,
      searchEndIndex,searchEndIndex,
      unmatchedTagFLAG:unmatchedTagFLAG,
    }
  }

  let needleTag = tags[tags.length-1].tagType;
  let addChildIndex = this.findAddChildIndex({
    needleTag:needleTag,
    result:result,
    code:code,
    currentIndex:currentIndex,
    between:true,
    });

      

      return {
        search:searchText,
        tagType:startTag.tagType,
        properties:startTag.tagProps,
        addPropIndex: startTag.addPropIndex,
        addChildIndex: addChildIndex,
        searchStartIndex:searchStartIndex,
        searchEndIndex,searchEndIndex,
        unmatchedTagFLAG: unmatchedTagFLAG,
      }
    }

    if (!unmatchedTagFLAG){

        //track tags
        if (result.tagType.substring(0,1) === "/"){
          let startTagType = tags[tags.length - 1].tagType;
          let endTagType = result.tagType.substring(1);
          //If start and end tags don't match you can't know which start tag to put the properties on
          if (startTagType !== endTagType){ 
            unmatchedTagFLAG = true;
          }else{
            tags.pop();
          }
        }else{
          tags.push({
            tagType:result.tagType,
            tagProps:result.tagProps,
            addPropIndex: addPropIndex,
          })
        }
    }
    

    code = code.substring(result.tagIndex + tagString.length,code.length);
    result = this.findNextTag({code:code,index:currentIndex});
    if (result.unmatched){unmatchedTagFLAG = true;} //check for comment not ending
    if (result.tagType === 'comment' && unmatchedTagFLAG){
      return {
        tagType:"comment",
        properties:result.tagProps,
        search:searchText,
        searchStartIndex:searchStartIndex,
        searchEndIndex,searchEndIndex,
        unmatchedTagFLAG:unmatchedTagFLAG,
      }
    }
    previousEndParsedColRight = endParsedColRight;
    previousEndParsedRow = endParsedRow;
  }//end while
    
  //test if author is typing a new tag <x or <xxxxx...
  [searchText,searchStartIndex,searchEndIndex]  = findSearchText({
    code:code,
    row:row,
    col:col,
    previousEndParsedRow:previousEndParsedRow,
    previousEndParsedColRight:previousEndParsedColRight,
    codeStartIndex:currentIndex,
  });
  
  

    //stop after found info
    // return documentTag;
    return {
      tagType:documentTag.tagType,
      properties:documentTag.tagProps,
      search:searchText,
      searchStartIndex:searchStartIndex,
      searchEndIndex,searchEndIndex,
    }
  }

   //Find addChildIndex by finding matching end tag 
    //If didn't find the end tag, then place the new child at 
    //the next place that reaches the document  
    //or the end of the code if what has been entered doesn't have closing tags
  findAddChildIndex({needleTag,result,code,currentIndex,between=false}){
    

    if (result === false){
      return false;
    }
    
    let nestedTags = 0;
    let findEndResult = result;
    if (between){
      currentIndex = currentIndex - findEndResult.tagIndex - findEndResult.tagString.length;
    // console.log(`adjustment currentIndex ${currentIndex}`);
  }else{
      code = code.substring(result.tagIndex + result.tagString.length,code.length);
      findEndResult = this.findNextTag({code:code,index:currentIndex});
    }
    if (needleTag === 'document'){ return currentIndex;}
    
    while (code !== ""){
      currentIndex = currentIndex + findEndResult.tagIndex;

    if (findEndResult.tagType.substring(0,1) === "/" &&
    findEndResult.tagType.substring(1,findEndResult.tagType.length) === needleTag
        ){
          // console.log("matching end");
          
      //Found a matching end tag
      if (nestedTags > 0){
        nestedTags--;
      }else{
        break;
      }
    }else if(findEndResult.tagType === needleTag){
      //Found a matching start tag
          // console.log("matching start");
          nestedTags++;
    }
    currentIndex = currentIndex +findEndResult.tagString.length;

      code = code.substring(findEndResult.tagIndex + findEndResult.tagString.length,code.length);
      findEndResult = this.findNextTag({code:code,index:currentIndex});
    }
    return currentIndex;
  }

  findNextTag({code,index}){
    let tagRegEx = /<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[\^'">\s]+))?)+\s*|\s*)\/?>/;
    let matchObj = tagRegEx.exec(code);
    if (matchObj === null){return false;} //no tags so return
    let tagString = matchObj[0];
    //make tags lower case
    tagString = tagString.toLowerCase();
    let tagIndex =matchObj.index;

    //if next tag is a comment find the end of the comment and return the information about the comment.
    let startCommentIndex = code.search('<!--');
    if (startCommentIndex !== -1 && startCommentIndex < tagIndex){
      let endCommentIndex = code.search('-->');
      let unmatched = false;
      //if no end comment then the rest of the code is commented out
      if (endCommentIndex === -1){endCommentIndex = code.length; unmatched = true;} 
      tagString = code.substring(startCommentIndex,endCommentIndex+3);
    return {tagString:tagString,tagType:"comment",tagIndex:startCommentIndex,tagProps:{tagString:tagString},unmatched:unmatched};
  }
    
    //Find tagType
    let parts = tagString.split(" ");
    let tagType = parts[0].substring(1,parts[0].length - 1);
    if (parts.length > 1){
      tagType = parts[0].substring(1,parts[0].length);
    }
    if (tagType.substring(tagType.length - 1,tagType.length) === '/'){
      tagType = tagType.substring(0 ,tagType.length - 1);
    }

    let tagPropsString = matchObj[1];
    tagPropsString = tagPropsString.trim();
    let tagProps = {};

    //Process Double Quoted Props
    let startPropDoubleRegEx = /\w+\s*=\s*["]/;
    matchObj = "not null";  //need this to start the while loop
    while(matchObj !== null){
      matchObj = startPropDoubleRegEx.exec(tagPropsString);
      if (matchObj !== null){
       let followingCode = tagPropsString.substring(matchObj.index +matchObj[0].length -1,tagPropsString.length);
       let doubleQuoteRegEx = /"[^"\\]*(?:\\.[^"\\]*)*"/;
       let doubleMatchObj = doubleQuoteRegEx.exec(followingCode);
       let insideDoubleQuotes = doubleMatchObj[0].substring(1,doubleMatchObj[0].length - 1);
       let nameParts = matchObj[0].split('=');
       let propName = nameParts[0].trim().toLowerCase();
       if (propName.substring(0,1) === '_'){
        throw Error("The prop " + propName + " is reserved for internal use only.");
       }
       insideDoubleQuotes = insideDoubleQuotes.replace(/\\"/g,'"');
       if(propName in tagProps) {
         throw Error("Duplicate property " + propName + " in tag " + tagType);
       }
       tagProps[propName] = {};
       tagProps[propName].value = insideDoubleQuotes;
       tagProps[propName].quoteType = "double";
       //Find start and end of double quotes
       let indexOfPropName = tagString.search(propName);
       let afterTagName = tagString.substring(indexOfPropName,tagString.length);
       let indexOfDoubleQuote = afterTagName.search(`"`) + 1;
       let afterBeginningDoubleQuote = afterTagName.substring(indexOfDoubleQuote,afterTagName.length);
       let indexOfClosingDoubleQuote = afterBeginningDoubleQuote.search(`"`);
       tagProps[propName].indexOfStartQuote = indexOfPropName + indexOfDoubleQuote + tagIndex + index;
       tagProps[propName].indexOfEndQuote = indexOfPropName + indexOfDoubleQuote + indexOfClosingDoubleQuote + tagIndex + index;
       
       tagPropsString = tagPropsString.substring(0,matchObj.index) +
       tagPropsString.substring(matchObj.index + matchObj[0].length +
         doubleMatchObj[0].length,tagPropsString.length);
      }
    }

    //Process Single Quoted Props
    let startPropSingleRegEx = /\w+\s*=\s*[']/;
    matchObj = "not null";
    while(matchObj !== null){
      matchObj = startPropSingleRegEx.exec(tagPropsString);
      if (matchObj !== null){
       let followingCode = tagPropsString.substring(matchObj.index +matchObj[0].length -1,tagPropsString.length);
       let singleQuoteRegEx = /'[^'\\]*(?:\\.[^'\\]*)*'/;
       let singleMatchObj = singleQuoteRegEx.exec(followingCode);
       let insideSingleQuotes = singleMatchObj[0].substring(1,singleMatchObj[0].length - 1);
       let nameParts = matchObj[0].split('=');
       let propName = nameParts[0].trim().toLowerCase();
       if (propName.substring(0,1) === '_'){
         throw Error("The prop " + propName + " is reserved for internal use only.");
       }
       insideSingleQuotes = insideSingleQuotes.replace(/\\'/g,"'");
       if(propName in tagProps) {
         throw Error("Duplicate property " + propName + " in tag " + tagType);
       }
       tagProps[propName] = {};
       tagProps[propName].value = insideSingleQuotes;
       tagProps[propName].quoteType = "single";

       //Find start and end of single quotes
       let indexOfPropName = tagString.search(propName);
       let afterTagName = tagString.substring(indexOfPropName,tagString.length);
       let indexOfSingleQuote = afterTagName.search(`'`) + 1;
       let afterBeginningSingleQuote = afterTagName.substring(indexOfSingleQuote,afterTagName.length);
       let indexOfClosingSingleQuote = afterBeginningSingleQuote.search(`'`);
       tagProps[propName].indexOfStartQuote = indexOfPropName + indexOfSingleQuote + tagIndex + index;
       tagProps[propName].indexOfEndQuote = indexOfPropName + indexOfSingleQuote + indexOfClosingSingleQuote + tagIndex + index;
       

       tagPropsString = tagPropsString.substring(0,matchObj.index) +
       tagPropsString.substring(matchObj.index + matchObj[0].length +
         singleMatchObj[0].length,tagPropsString.length);

      }
    }


    //Process Unquoted Props
    if (/\S/.test(tagPropsString)) {
      let unquotedParts = tagPropsString.split(" ");
      for (let propName of unquotedParts){
        if (/\S/.test(propName)) {
          propName = propName.trim();
          tagProps[propName] = {};
          tagProps[propName].value = true;
          tagProps[propName].quoteType = "none";
          //Find index right after propname
          let indexOfPropName = tagString.search(propName);
          tagProps[propName].endPropNameIndex = indexOfPropName + propName.length + tagIndex + index;
        }
      }
    }
    
    return {tagString:tagString,tagType:tagType,tagIndex:tagIndex,tagProps:tagProps};
  }

  handleResizeFont(fontSize){
    this.setState({fontSize:fontSize});
  }
  
  handleDocTags(){
    let nextTagOpenState = true;
    if (this.state.tagsOpen){nextTagOpenState = false;}
    this.setState({tagsOpen:nextTagOpenState});
  }
  
  nextDocTagText(e){
    let enteredText = e.target.value;
    this.setState({nextTagText:enteredText})
  }

  docTagKeystroke(e){
    console.log(e);
    
    if(e.key === 'Enter'){
      this.addDocTag();
    }
  }

  saveDocTagsToServer({action,tagName}){
    console.log(`Send to server: action='${action}' tagName='${tagName}'`);
    if (this.props.prodOrDev === "dev"){
      console.log("Developer Mode");
      return;
    }

    //ADD
    if (action === 'add'){
      const url='/api/saveOneKeyword.php';
      const data={
        branchId: this.branchId,
        keyword: tagName,
      }
      const payload = {
        params: data
      }
      console.log("save One Tag data");
      console.log(data);
      
      
      axios.get(url,payload)
        .then(resp=>{
          console.log("Saved one tag");
          console.log(resp.data);
  
        })
        .catch(error=>{this.setState({error:error})});
    }
    //REMOVE
    if (action === 'remove'){
      const url='/api/deleteOneKeyword.php';
      const data={
        branchId: this.branchId,
        keyword: tagName,
      }
      const payload = {
        params: data
      }
      console.log("delete One Tag data");
      console.log(data);
      
      axios.get(url,payload)
        .then(resp=>{
          console.log("delete One Tag");
          console.log(resp.data);
  
        })
        .catch(error=>{this.setState({error:error})});
    }
   
  }

  removeDocTag(tagName){
    console.log("RUNNING REMOVING DOC TAG");

    let docTags = this.state.docTags;
    for(let [index,currentTag] of docTags.entries()){
      if (currentTag === tagName){
        docTags.splice(index,1);
      }
    }
    this.saveDocTagsToServer({action:"remove",tagName:tagName});
    //this.buildLoadDocumentsInterface(); 

    this.setState({docTags:docTags});
  }

  addDocTag(){
    console.log("RUNNING ADD DOC TAG");
    
    //test if it already exists
    let docTags = this.state.docTags;
    for(let currentTag of docTags){
      if (currentTag === this.state.nextTagText){
        this.setState({docTagErrorMessage:`Already have a tag named ${currentTag}`});
        setTimeout(function(){this.setState({docTagErrorMessage:""})}.bind(this),3000);
        return;
      }
    }
    docTags.push(this.state.nextTagText);
    this.saveDocTagsToServer({action:"add",tagName:this.state.nextTagText});
    
    //this.buildLoadDocumentsInterface(); 

    this.setState({docTags:docTags,nextTagText:""});
  }

  handleFilterByUsernameChange(e){
    let enteredText = e.target.value;
    this.setState({filterByUsernameValue:enteredText})
  }

  handleFilterByUsernameKeypress(e){
    console.log("RUNNING HANDLE FILTER BY USERNAME");

    if(e.key === 'Enter'){
      //this.buildLoadDocumentsInterface();
    this.forceUpdate();

    }
  }

  handleFilterByTagChange(e){
    let enteredText = e.target.value;
    this.setState({filterByTagValue:enteredText})
  }

  handleFilterByTagKeypress(e){
    console.log("RUNNING HANDLE FILTER BY TAG KEY");

    if(e.key === 'Enter'){
      //this.buildLoadDocumentsInterface();
    this.forceUpdate();

    }
  }

  generateDocs() {
    console.log("generateDocs starts here.");
    let components = {};

    let standardComponentClasses = ComponentTypes.createComponentTypes();
    let allComponentClasses = ComponentTypes.allComponentClasses();
  
    for (let componentClassKey in allComponentClasses) {
      if (componentClassKey === "mean" || componentClassKey === "variance" || 
      componentClassKey === "standarddeviation" || componentClassKey === "count"
      || componentClassKey === "min" || componentClassKey === "max"
      || componentClassKey === "mod" || componentClassKey === "_numberbaseoperatorornumber") {
        continue;
      }
      let ComponentClass = allComponentClasses[componentClassKey];
      let childLogic = ComponentClass.returnChildLogic({
        standardComponentClasses:standardComponentClasses,
        allComponentClasses:allComponentClasses,
        });
      
      // componentName
      components[componentClassKey] = {}; 
  
      //  properties
      let componentProperties = {};
      let PropertiesObject = ComponentClass.createPropertiesObject({
        standardComponentClasses:standardComponentClasses
      })
      let sortedPropertiesKeys = Object.keys(PropertiesObject).sort();
      for (let i = 0; i < sortedPropertiesKeys.length; i++) {
        let key = sortedPropertiesKeys[i];
        componentProperties[key] = PropertiesObject[key]; 
      }
      // console.log(componentProperties);
      components[componentClassKey]["properties"] = componentProperties; 
  
      // child components
      let originalValidChildTypes;
      if(childLogic.baseLogic !== undefined) {
        originalValidChildTypes = this.extractComponentTypesFromChildLogic(childLogic.baseLogic);
      }else {
        originalValidChildTypes = new Set([]);
      }
      
      // expand any abstract types 
      let validChildTypes = new Set([]);
      for(let componentType of originalValidChildTypes) {
        //Skip these types
        if (componentType === "string"){ continue; }
        
        let expandedTypes = this.expandAbstractComponentType({
          componentType: componentType,
          allComponentClasses: allComponentClasses,
          standardComponentClasses: standardComponentClasses
        });
        for(let newType of expandedTypes) {
          validChildTypes.add(newType);
        }
      }
      let validChildTypesArray = Array.from(validChildTypes).sort();
      components[componentClassKey]["childComponents"] = validChildTypesArray;   
    }

    // sort components
    let sortedComponentKeys = Object.keys(components).sort();
    let sortedComponents = {};
      for (let i = 0; i < sortedComponentKeys.length; i++) {
        let key = sortedComponentKeys[i];
        sortedComponents[key] = components[key]; 
      }
    
    sortedComponents = JSON.stringify(sortedComponents, null, 2);
    sortedComponentKeys = JSON.stringify(sortedComponentKeys, null, 2); 
    
    /* 
      complete docs with properties and child components 
    */
    // console.log(sortedComponents);

    /* 
      docs with only component name 
    */
    // console.log(sortedComponentKeys);
  }
  render_off(){
    //this. loadAllCoursesAndTheirAssignments();
    let {code} = this.state;
    // console.log("id: "+this.branchId);

    let enablePublishButton = true;
   /*if (this.sharedContent[this.branchId] !== undefined && 
      this.sharedContent[this.branchId].publishedContentId !== undefined &&
      this.sharedContent[this.branchId].currentContentId &&
      this.sharedContent[this.branchId].publishedContentId === this.props.sharedContent[this.branchId].currentContentId
      ){
        enablePublishButton = false;
      }*/
    

    const tagPanelHeight = "160";
    let aceEditorHeight = "100%";
    if (this.state.tagsOpen){
      aceEditorHeight = "calc(100% - "+(Number(tagPanelHeight)+10)+"px)";
    }
    // let docTags = ['one','two','three','four'];
    let docTagsCode = [];
    for(let tagName of this.state.docTags){
      docTagsCode.push(
        <Button key={"tagName"+tagName} onClick={()=>this.removeDocTag(tagName)} style={{margin:"4px"}} size="mini" color='blue' icon='remove' label={{ as: 'a', basic: true, content: tagName }} labelPosition='left' />
      )
    }
    // width: -webkit-calc(100% - 100px);
    // width:    -moz-calc(100% - 100px);
    // width:         calc(100% - 100px);
    let aceprops = {
      mode:"xml",
      "data-cy":"editorTextEntry",
      name:"editorTextEntry",
      theme:"textmate",
      height:aceEditorHeight,
      width:"100%",
      fontSize:this.state.fontSize,
      tabSize:2,
      // onChange:()=>{console.log('change');},
      // onCursorChange:()=>{console.log('cursor')},
      // onSelectionChange:()=>{console.log('selection');},
      onChange:this.handleChange,
      onCursorChange:this.onCursorChange,
      onSelectionChange:this.onSelectionChange,
      editorProps:{$blockScrolling: true},
      onBlur:()=>{this.saveDocumentChanges({blur:true})},
      // marker:markers,
      ref:"aceEditor",

      // ref=this.aceref,
      // enableSnippets:true,
    }

    let { search } = this.state;
    if (search === -1){search = "";}
    let appContainerStyle = {};
    if (this.state.showLeftNavExtended){
        appContainerStyle = {gridTemplateColumns: "50px 200px auto 300px"};
    }
    //testing
    if (this.state.Toggle_brand_Selection==true) {
      <DoenetChooser />
    }
    if (this.state.Toggle_brand_Selection==false){
      window.location.href = '/chooser';
    }
    return (
      <div className="appcontainer" style={appContainerStyle}>
      
    
    <React.Fragment>
      <div className="appTopNav">
      <Menu size="mini">
      {this.state.edittingName ? ( 
        <Menu.Item>
        <Input autoFocus onFocus={this.selectAllOnUntitled} ref={this._documentNameInput} onBlur={this.documentNameBlur} onChange={this.updateDocumentName} onKeyPress={this.changeDocumentName} type='text' value={this.state.documentName} />
        </Menu.Item>
      ) : (
        <Menu.Item onClick={this.turnOnEditDocumentName} >
          {this.state.documentName}
        </Menu.Item>
      )
      }

      <Menu.Item>
          <Button onClick={this.handleNew} data-cy="editorNewButton">New</Button>
        </Menu.Item>

        <Menu.Item>
          <Button onClick={()=>{this.state.Toggle_brand_Selection=!this.state.Toggle_brand_Selection;this.forceUpdate()}} data-cy="editorToggleButton">BranchID</Button>
         </Menu.Item>

      {this.branchId !== "" && 

        <Menu.Item>
          <Button onClick={this.publish} disabled={this.state.disable_publish} data-cy="editorPublishButton">Publish</Button>
        </Menu.Item>
      }
       

        {this.branchId !== "" && 

        <Menu.Item onClick={this.handleDocTags} data-cy="editorEditTagsButton">
        {!this.state.tagsOpen &&
        <React.Fragment>
          <Icon size="large" name="tags" /> 
          <Icon size="large" name="caret square down outline" />
        </React.Fragment>
        }
          
        {this.state.tagsOpen &&
          <React.Fragment>
            <Icon size="large" name="tags" /> 
            <Icon size="large" name="caret square up" />
           </React.Fragment>
        }

        </Menu.Item>
        }

        {this.branchId !== "" && 
       
       <Dropdown item text='Font-Size' simple>
        <Dropdown.Menu>
          <Dropdown.Item onClick={()=>this.handleResizeFont(8)}>8</Dropdown.Item>
          <Dropdown.Item onClick={()=>this.handleResizeFont(10)}>10</Dropdown.Item>
          <Dropdown.Item onClick={()=>this.handleResizeFont(12)}>12</Dropdown.Item>
          <Dropdown.Item onClick={()=>this.handleResizeFont(14)}>14</Dropdown.Item>
          <Dropdown.Item onClick={()=>this.handleResizeFont(16)}>16</Dropdown.Item>
          <Dropdown.Item onClick={()=>this.handleResizeFont(18)}>18</Dropdown.Item>
          <Dropdown.Item onClick={()=>this.handleResizeFont(20)}>20</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      }
      <Menu.Item>
      
        Content ID: <input type='text' value={this.state.displayContentId}/>
      </Menu.Item>
   
      <Menu.Menu position="right">
      

         {this.branchId !== "" &&
        <Menu.Item onClick={()=>{this.toggleViewer;}}  >
        {this.state.viewerOpenDocumentId === this.branchId ? (
         <Icon size="large" name="window close outline" data-cy="editorOpenViewerButton"/>
        ):(
          <Icon size="large" name="external alternate" data-cy="editorOpenViewerButton"/>
        )
        }
      </Menu.Item>
        }
        
        {this.state.viewerOpenDocumentId !== this.branchId && (

        
        <Popup
          trigger={<Menu.Item>
          <Icon size="large" name="trash" />
          </Menu.Item>}
          content={<Button.Group>
            <Button  autoFocus={true} onBlur={this.closeDeleteFilePopup} color='red' onClick={this.deleteDocument}>Delete Forever</Button>
          </Button.Group>}
          on='click'
          open={this.state.deleteDocumentPopupOpen}
          onOpen={this.openDeleteFilePopup}
          
          position='left center'
          
        />
          
        
        )}

        </Menu.Menu>
      </Menu>

      

            </div>
            
      <div className="appEditor">
      {this.state.tagsOpen &&

      <React.Fragment>
      <div style={{backgroundColor:"white",margin:"0px 0px 10px 0px",padding:"5px",height:tagPanelHeight+"px"}}>
        
      <Popup
          trigger={<Input
            size="mini"
            icon='tags'
            iconPosition='left'
            // action={{ color: 'blue', labelPosition: 'right', icon: 'add'}}
            labelPosition='right'
            placeholder='Enter tags'
            onKeyPress={this.docTagKeystroke}
            onChange={this.nextDocTagText}
            value={this.state.nextTagText}
          />}
          content={<p>{this.state.docTagErrorMessage}</p>}
          open={this.state.docTagErrorMessage!==""}
          
          position='top center'
          
        />
       
        <Button onClick={this.addDocTag} size="mini" tag="true" icon>
        <Icon name='add' />
      </Button>
        <div style={{marginTop:"10px",display:"flex", flexWrap: "wrap", justifyContent: "flex-start"}}>
          { docTagsCode }
        </div>
      </div>

      </React.Fragment>
      }
      
            <div className="appLeftNav">
                
            </div>
            <div className="appUserPanel" style={{display:"flex", justifyContent:"space-between"}}>
            
            <span style={{width:"80px",paddingTop:"7px",fontSize:"18px"}}>a.188</span>
            <Label as='a' style={{float:"right"}} onClick={this.usernameClick}>
                <Icon name='user' />
                {this.username}
            </Label>
            </div>
            
        
      <AceEditor data-cy="aceEditor" {...aceprops} value={this.state.code!=""?this.state.code :"none"} />

            </div>
            <div className="appEditorProps">
                <div style={{textAlign: "center"}}>
                  <Input icon={<Icon name='search' inverted circular link />} 
                  placeholder='Search ...' 
                  value={search}
                  onChange={this.handleSearchEntry}
                  />
                </div>
              <br />
                  {this.contextPanel}
                
              </div>
            {this.state.error ? (
            <div style={{backgroundColor:"rgb(255, 130, 128)"}} className="appBottomInfo">
            {this.state.error.toString()}
            </div>
            ) : (
              <div className="appBottomInfo">
            
              </div>
            )
        
            }
           
            
            
      </React.Fragment>
      </div> 
      );
  }
  
  render(){
    console.log("======TIMING======")
      console.timeEnd("x");
    let {code} = this.state;
    let aceprops = {
      mode:"xml",
      "data-cy":"editorTextEntry",
      name:"editorTextEntry",
      theme:"textmate",
      height:"100%",
      width:"100%",
      fontSize:this.state.fontSize,
      tabSize:2,
      // onChange:()=>{console.log('change');},
      // onCursorChange:()=>{console.log('cursor')},
      // onSelectionChange:()=>{console.log('selection');},
      onChange:this.handleChange,
      onCursorChange:this.onCursorChange,
      onSelectionChange:this.onSelectionChange,
      editorProps:{$blockScrolling: true},
      onBlur:()=>{this.saveDocumentChanges({blur:true})},
      // marker:markers,
      ref:"aceEditor",

      // ref=this.aceref,
      // enableSnippets:true,
    }
    let { search } = this.state;
    if (search === -1){search = "";}
    
    
    return (
      <React.Fragment>
           <DoenetHeader toolTitle="Editor" headingTitle={this.documentTitle} />     
        <div id="editorContainer">
          {/* <div id="contextPanelMenu">Document title: <input type="text" placeholder="title goes here" defaultValue=""  onChange={this.handleDocTileChange}></input></div> */}
          <div id="contextPanelMenu"><button  
          onClick={()=>{this.setState({open_context_pannel:!this.state.open_context_pannel})}}>{this.state.open_context_pannel?
          <FontAwesomeIcon icon={openContentPanel}/>:<FontAwesomeIcon icon={closeContentPanel}/>}</button></div>
          
          
          <div id={this.state.open_context_pannel?"contextPanel":"nocontextPanel"}>{this.contextPanel}</div>
          <div id="textEditMenu">           
            <div id="title"><h5 data-cy="documentTitle">Document title: {this.documentTitle?this.documentTitle:"--"}</h5></div>
                {/* <button data-cy="documentTitle">Document Title: {this.documentTitle}</button> */}
              <button className="Button" onClick={this.publish} disabled={this.state.disable_publish} data-cy="editorPublishButton">Publish</button>
              <select onChange={this.updateDoenetML} value={this.doenetML}>
                <option>a</option>
                {this.List_doenetML_timestamp}
                <option>b</option>
              </select>
              <select>
                <option onClick={()=>this.handleResizeFont(8)}>8</option>
                <option onClick={()=>this.handleResizeFont(10)}>10</option>
                <option onClick={()=>this.handleResizeFont(12)}>12</option>
                <option onClick={()=>this.handleResizeFont(14)}>14</option>
                <option onClick={()=>this.handleResizeFont(16)}>16</option>
                <option onClick={()=>this.handleResizeFont(18)}>18</option>
                <option onClick={()=>this.handleResizeFont(20)}>20</option>
              </select>
              
          </div>
          <div id={ 
            (this.state.separated_Viewer && this.state.open_context_pannel?"TextEdit_closeViewer":
            (!this.state.separated_Viewer && this.state.open_context_pannel)?"textEdit":(this.state.separated_Viewer && !this.state.open_context_pannel)?"TextEdit_closeBoth":"TextEdit_closeContextPanel")
           //||(!this.state.separated_Viewer && this.state.open_context_pannel)?"TextEdit_closeBoth":"textEdit"
          }>
           
            <AceEditor {...aceprops} value={this.doenetML!=""?this.doenetML :""}/>

          </div>
          <div id="editViewMenu">
            <button className="Button" onClick={this.toggleViewer} data-cy="editorOpenViewerButton">
            {this.state.separated_Viewer?<FontAwesomeIcon icon={closeExternalLink}/>:<FontAwesomeIcon icon={externalLink}/>}
            {/* <i size="large" class="fas fa-location-arrow"></i> */}
              </button>
            <button className="Button" onClick={()=>{this.updateNumber++;this.forceUpdate()}} >Update</button>
            <button className="Button" onClick={this.modeToggle} data-cy="viewerModeButton">Mode</button>
          </div>
          {!this.state.separated_Viewer && <div id="editView">
            {this.state.modeOpen && 
            <div style={{backgroundColor:"#cce2ff", padding:"10px",borderBottom:"1px solid grey"}}>
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

            </div> }
            {/* <Suspense>
            <DoenetViewer 
              key={"doenetviewer"+this.updateNumber} //each component has their own key, change the key will trick Reach to look for new component
              free={{doenetCode: this.doenetML}} 
              mode={{
                solutionType:this.state.solutionType,
                allowViewSolutionWithoutRoundTrip:this.state.allowViewSolutionWithoutRoundTrip,
                showHints:this.state.showHints,
                showFeedback:this.state.showFeedback,
                showCorrectness:this.state.showCorrectness,
              }}/>
            </Suspense> */}
              

              {/* {import('./DoenetViewer').then(()=>
                 <DoenetViewer 
            key={"doenetviewer"+this.updateNumber} //each component has their own key, change the key will trick Reach to look for new component
            free={{doenetCode: this.doenetML}} 
            mode={{
              solutionType:this.state.solutionType,
              allowViewSolutionWithoutRoundTrip:this.state.allowViewSolutionWithoutRoundTrip,
              showHints:this.state.showHints,
              showFeedback:this.state.showFeedback,
              showCorrectness:this.state.showCorrectness,
            }}
            /> 
              )} */}
          
            <DoenetViewer 
              key={"doenetviewer"+this.updateNumber} //each component has their own key, change the key will trick Reach to look for new component
              free={{doenetCode: this.doenetML}} 
              mode={{
                solutionType:this.state.solutionType,
                allowViewSolutionWithoutRoundTrip:this.state.allowViewSolutionWithoutRoundTrip,
                showHints:this.state.showHints,
                showFeedback:this.state.showFeedback,
                showCorrectness:this.state.showCorrectness,
              }}           
            />
            
          </div> }
          
        </div>
        

        </React.Fragment>);
  }
}

function findSearchText({code,row,col,previousEndParsedRow,previousEndParsedColRight,codeStartIndex=0}){
  if (code === null || code === ""|| code === undefined){
    return [-1,0,0];
  }
  
  
  let searchText = -1;
  let startIndex = codeStartIndex;
  let endIndex = startIndex;
  
  let textRowsArray = code.split("\n");
  startIndex = startIndex + code.split("\n",row-previousEndParsedRow).join("\n").length;
  if (row-previousEndParsedRow > 0 ){startIndex++;} //need to count the last return
  
  let textOnRowOfCursor = textRowsArray[(row-previousEndParsedRow)];
  if (textOnRowOfCursor === undefined){
    return [-1,0,0];

  }
  let columnLeftOfText = 0;
  if (row === previousEndParsedRow){
    columnLeftOfText = previousEndParsedColRight + 1;
  }
  let textLeftOfCursor = textOnRowOfCursor.substring(0,(col-columnLeftOfText));
  let spaceDividedParts = textLeftOfCursor.split(" ");
  let textRightOfWhiteSpace = spaceDividedParts[(spaceDividedParts.length - 1)];
  //if includes a lessthan then search based on that
  if (textRightOfWhiteSpace.search('<') > -1){
    let textRightOfCursor = textOnRowOfCursor.substring((col-columnLeftOfText));
    let textOnRightParts = textRightOfCursor.split(" "); //handle spaces
    textOnRightParts = textOnRightParts[0].split("<"); //handle multiple less thans
    let relevantToSearch = textRightOfWhiteSpace + textOnRightParts[0];
    searchText = relevantToSearch.substring(relevantToSearch.lastIndexOf("<")+1);
    let indexLeftOfSearchText = textLeftOfCursor.lastIndexOf("<");
    startIndex = startIndex + indexLeftOfSearchText;
    endIndex = startIndex + searchText.length + 1;
  console.log(`search tag startIndex ${startIndex} endIndex ${endIndex}`);
    
    
  }
  return [searchText,startIndex,endIndex];
}

export default DoenetEditor;
