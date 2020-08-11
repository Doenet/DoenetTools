import React, { Component } from 'react';
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
import "./editor.css";
import * as ComponentTypes  from '../Doenet/ComponentTypes';
import allComponents from '../../docs/complete-docs.json';
import AceEditor from 'react-ace';
import brace from 'brace';
import 'brace/mode/xml';
import 'brace/theme/textmate';


class DoenetEditor extends Component {
  constructor(props) {
    super(props);
//   }
//   render(){
//     return (<p>simple</p>);
  
//   }
// }

// class save {

//   constructor2(props) {
//     super(props);
      
      this.freshDocumentName = "Untitled document";

      this.contextPanel = <p>loading...</p> 
      this.viewerWindow = <p>loading...</p>

      this.numberLoaded = 0;

      let url_string = window.location.href;
      var url = new URL(url_string);
      this.contentId = url.searchParams.get("contentId"); 
      this.branchId = url.searchParams.get("branchId");
      // this.documentOrder=[]; //???
      // this.ListOfContentId="";
      // this.List_Of_Recent_doenetML=[]; // this is to store list of (date:doenetML) from getDoenetML.php
      // this.List_doenetML_timestamp = [];
      // this.branchID="";
      // this.documentTitle="";
      // this.functionsSuppliedByChild = {};
      // let error = null;

      if (this.contentId !== null && this.branchId === null){
        //Can't get branchId from contentId.  No way to tell which branch.
        // error = "Can't edit only a content id.";
      }else if (this.contentId !== null || this.branchId !== null){
       
      //Load current document
      
        const phpUrl='/api/getDoenetML.php';
        const data={        
            branchId: this.branchId,
            contentId: this.contentId,
        }
        
        const payload = { 
          params: data
        }
        
        axios.get(phpUrl,payload)
          .then(resp=>{
          
            this.updateNumber++;
            this.doenetML = resp.data.doenetML;
            // this.ListOfContentId = resp.data.ListOfContentId;
            // this.List_Of_Recent_doenetML = resp.data;
            // this.List_Of_Recent_doenetML= resp.data.List_Of_Recent_doenetML.reverse();
            this.branchID = resp.data.branchID;
            // this.documentTitle = resp.data.title;
            // this.currentDocumentTitle = resp.data.title;
          
            //window.onmessage = this.updateCode; //KEEPING THIS. TURN IT ON ASAP AFTER FIXING BUG ?
            // this.getTitle();
            // this.buildDoenetMLDate();
          })
          // .catch(error=>{this.setState({
          //   error:error
          // })
        };

      }else{
        
        window.location.href = "/chooser";
      }
      
    this.state = {
      // open_context_pannel:true,
      // deleteCurrentTitle:true,
      // titleExist:false,
      // enableEditingTitle:false,
      // valueShouldBeLength:0,
      allowViewSolutionWithoutRoundTrip: true,
      solutionType: "button",
      showHints: true,
      showFeedback: true,
      showCorrectness: true,
      // modeOpen: false,
      // allAnswersSubmitted: false,
      doenetML: "",
      // error: null,
      // errorInfo: null,
      // documentName: this.freshDocumentName,
      // edittingName: false, //remove this
      // deleteDocumentPopupOpen: false,
      // viewerOpenDocumentId: "",
      // search: "",
      // fontSize: 12,
      // tagsOpen: false,
      // nextTagText: "",
      // docTags: [],
      // docTagErrorMessage: "",
      // filterByUsernameValue: "",
      // filterByTagValue: "",
      // lastPublishID:"",//NEVER USED

      // publishList:[],
      // disable_publish:true,//new
      // Toggle_brand_Selection:true,
      // current_code:"",
      // publish_button:"button_disabled",
      // separated_Viewer:false,
      // change_title_not_code:false,

    };
    

    // this._documentNameInput = React.createRef(); //delete?

    this.branchId = "";
      
    // this.updateNumber = 0;
    // this.saveTimer = null;
    // this.updateCode = this.updateCode.bind(this);
    // this.handleUpdate = this.handleUpdate.bind(this);
    // this.handleChange = this.handleChange.bind(this);
    // this.turnOnEditDocumentName = this.turnOnEditDocumentName.bind(this);
    // this.changeDocumentName = this.changeDocumentName.bind(this);
    // this.updateDocumentName = this.updateDocumentName.bind(this);
    // this.documentNameBlur = this.documentNameBlur.bind(this);
    // this.loadOnClick = this.loadOnClick.bind(this);
    // this.saveToServer = this.saveToServer.bind(this);
    // this.deleteDocument = this.deleteDocument.bind(this);
    // this.openDeleteFilePopup = this.openDeleteFilePopup.bind(this);
    // this.closeDeleteFilePopup = this.closeDeleteFilePopup.bind(this);
    // this.selectAllOnUntitled = this.selectAllOnUntitled.bind(this);
    // this.resetEditor = this.resetEditor.bind(this);
    // this.toggleViewer = this.toggleViewer.bind(this);
    // this.handleViewerClose = this.handleViewerClose.bind(this);
    // this.onCursorChange = this.onCursorChange.bind(this);
    // this.findTagViaCursor = this.findTagViaCursor.bind(this);
    // this.buildContextPanel = this.buildContextPanel.bind(this);
    // this.handleAddChild = this.handleAddChild.bind(this);
    // this.handleUpdateBoolean = this.handleUpdateBoolean.bind(this);
    // this.handleSearchEntry = this.handleSearchEntry.bind(this);
    // this.handleResizeFont = this.handleResizeFont.bind(this);
    // this.handleDocTags = this.handleDocTags.bind(this);
    // this.docTagKeystroke = this.docTagKeystroke.bind(this);
    // this.nextDocTagText = this.nextDocTagText.bind(this);
    // this.addDocTag = this.addDocTag.bind(this);
    // this.removeDocTag = this.removeDocTag.bind(this);
    // this.handleFilterByUsernameChange = this.handleFilterByUsernameChange.bind(this);
    // this.handleFilterByUsernameKeypress = this.handleFilterByUsernameKeypress.bind(this);
    // this.handleFilterByTagChange = this.handleFilterByTagChange.bind(this);
    // this.handleFilterByTagKeypress = this.handleFilterByTagKeypress.bind(this);
    // this.saveDocumentChanges = this.saveDocumentChanges.bind(this);
    // this.onSelectionChange = this.onSelectionChange.bind(this);
    // this.publish = this.publish.bind(this);
    // this.setLastID = this.setLastID.bind(this);//new change
    // this.getContentId = this.getContentId.bind(this);
    // this.handleCheck = this.handleCheck.bind(this);
    // this.assignmentDataToCourseInfo = this.assignmentDataToCourseInfo.bind(this);
    // this.load_current_code = this.load_current_code.bind(this);
    // this.modeToggle = this.modeToggle.bind(this);
    // this.handleDocTileChange = this.handleDocTileChange.bind(this);
    // this.getTitle = this.getTitle.bind(this)
    // this.deleteCurrentTitle = this.deleteCurrentTitle.bind(this);
    // this.buildDoenetMLDate = this.buildDoenetMLDate.bind(this);
    // this.updateDoenetML = this.updateDoenetML.bind(this);
    
    //window.onmessage = this.updateCode; //KEEPING THIS. TURN IT ON ASAP AFTER FIXING BUG ?

    // this.generateDocs(); //Save for later
    
}

  updateDoenetML(e){
    
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
    if(this.doenetML ==""){
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
        this.setState({documentName:this.documentTitle});
      }
      }         
    }
  }

  handleDocTileChange(){
   
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

  assignmentDataToCourseInfo({courseId,data}){
        
        
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
    
    //TODO: Need security here
    this.handleUpdate(e);
  }
 
  // loadOnClick(id){

  //   this.branchId = id;
   
  //   let code = this.sharedContent[id].code;

  //   if (code === null){code = "";}
  //   let documentName = this.sharedContent[id].documentName;
    
  //   this.updateNumber++;
  //   window.MathJax.Hub.Queue(
  //     ["resetEquationNumbers",window.MathJax.InputJax.TeX],
  //   );

  //   this.setState({
  //     code: code,
  //     error: null,
  //     errorInfo: null,
  //     documentName: documentName,
  //     edittingName: false,
  //     docTags: this.sharedContent[id].docTags,
  //   });

  // }

  documentNameBlur(){
    this.props.sharedContent[this.branchId].documentName = this.state.documentName;
    

    this.saveToServer({
      documentName:this.state.documentName,
      code:this.state.code,
      branchId:this.branchId,
     });
    
    this.setState({edittingName:false});

  }

  handleUpdate(e){
   
  
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
    
    this.setState({error:null,errorInfo:null});
  }
 
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

 
  publish(){
    // this.currentDocumentTitle = this.documentTitle; // TODO: do we need currentDocumentTitle ?
    let contentid=this.getContentId({code:this.doenetML});
    this.ListOfContentId[this.ListOfContentId.length]=contentid;
     let date = new Date();
   
     let now_str= date.toString();
     let list_obj = {};
     list_obj [now_str]=this.doenetML;
    
    this.List_Of_Recent_doenetML.push(list_obj)
   

    this.saveToServer({documentName:this.documentTitle,code:this.doenetML,branchId:this.branchID,publish:true});
    this.setState({disable_publish:true});
    this.buildDoenetMLDate();
  }
 
  handleCheck(val) {
    return this.state.publishList.some(item => val === item);
  }

  saveToServer({documentName,code,branchId,publish=false}){
   
    let contenIdForSaving = this.getContentId({code:code});

    const url='/api/save.php';
    const data={
      title: this.documentTitle,
      doenetML: code,
      branchId: branchId,
      contentId:contenIdForSaving, 
      author: this.props.userId,
      publish: publish,
    }
  
    if (publish===true){
    axios.post(url, data)
    .then(function (response) {
     
      
      
    })
    // .catch(function (error) {
      // this.setState({error:error});  //Can't set state from constructor

    // })

    
    
    };
  }

  saveDocumentChanges({blur}){
   
    if (blur){
      
      clearTimeout(this.saveTimer);
    }
    this.saveTimer = null;
   
    this.saveToServer({documentName:this.state.documentName,code:this.state.code,branchId:this.branchId});
    
  }

  handleChange(editorCode,e){ //USE THIS PLEASE FOR HANDLE THE INDICATOR
    this.setState({change_title_not_code:false})
   

    
    if (this.saveTimer === null){
      
      this.saveTimer = setTimeout(
        ()=>{this.saveDocumentChanges({blur:false});}
      ,3000);

    }
    if (e.action === 'remove'){
      let cursor = this.refs.aceEditor.editor.selection.getCursor();
      this.row = cursor.row;
      this.column = cursor.column;
      this.exceptionForRemoveCode = editorCode;
      this.updateContextPanel();
    }
    
    this.doenetML = editorCode; //this is for updating the doenetML code
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
     
      return;
    }
    
    this.row = row;
    this.column = column;
    this.updateContextPanel();
  }

  updateContextPanel(){

    let result = this.findTagViaCursor({row:this.row,col:this.column});
    
    
    
    this.buildContextPanel(result);
    if (result.search !== undefined && result.search !== ""){
      this.setState({search:result.search});
    }
    this.forceUpdate();
    this.handleChange;
  }

  turnOnEditDocumentName(e){
   
    this.setState({edittingName: true});
  }

  changeDocumentName(e){
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

  // componentDidCatch(error, info){
  //   this.setState({error:error,errorInfo:info});
  // }

  // resetEditor(){
  //   this.updateNumber++;
  //   this.setState({
  //     code: "",
  //     error: null,
  //     errorInfo: null,
  //     documentName: this.freshDocumentName,
  //     edittingName: false,
  //   });
  // }

 

  openDeleteFilePopup(){
    
    this.setState({deleteDocumentPopupOpen:true});
  }

  handleViewerClose(){
    this.setState({separated_Viewer:false}); //this makes phase 2 back to phase 1
    this.setState({viewerOpenDocumentId:""});
  }

  toggleViewer(){
    
  
      this.setState({separated_Viewer:!this.state.separated_Viewer})
      
    if (this.viewerWindow!=""){
     
      this.viewerWindow.close();
      this.viewerWindow="";
     
      this.setState({separated_Viewer:false}); //overkilled ?
      this.setState({viewerOpenDocumentId:""});
    }else{
    
     
  
      this.viewerWindow = window.open(`/viewer?boolean=${!this.state.separated_Viewer}`,'Doenet Viewer', 'width=300,height=600,left=1700,top=0,titlebar=no');
      this.viewerWindow.onbeforeunload = this.handleViewerClose;
      this.viewerWindow.onload = function(){ 
      this.viewerWindow.postMessage({doenetCode: this.doenetML},"*");
      

      }.bind(this);

     


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
 
  // componentDidCatch(error, info){
  //   alert('componentDidCatch in DoenetEditor');
    
  // }

  componentDidMount() {
    document.getElementById('publish').addEventListener('click', this.publish, true)
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
  
    let valueShouldBe = e.target.value;
    this.documentTitle = valueShouldBe
    this.setState({enableEditingTitle:true})
    // this.handleDocTileChange();
    if (this.currentDocumentTitle != valueShouldBe)
    {;
      
      this.setState ({disable_publish:false})
    }
    else {
   
      this.setState ({disable_publish:true})}

    if (propInfo.quoteType === "double" || propInfo.quoteType === "single"){
     
      this.doenetML = this.doenetML.substring(0,propInfo.indexOfStartQuote) + 
      valueShouldBe + this.doenetML.substring(propInfo.indexOfEndQuote,this.doenetML.length);
      // this.setState({code:updatedCode});
    }else if (propInfo.quoteType === "none"){
    
      this.doenetML = this.doenetML.substring(0,propInfo.endPropNameIndex) + `="${valueShouldBe}"` +
      this.doenetML.substring(propInfo.endPropNameIndex,this.doenetML.length);
      // this.setState({code:updatedCode});
    }else if (propInfo.quoteType === undefined){
        if (addPropIndex!=0){
       
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
   
    
    let textToAdd = `<${tagType}></${tagType}>`;
    // let newCode = this.doenetML;
    if (searchStartIndex === -1){
      //next position inside tag
      this.doenetML = this.doenetML.substring(0,addAtIndex) + textToAdd + this.doenetML.substring(addAtIndex,this.doenetML.length);
    }else{
      //replace
      this.doenetML = this.doenetML.substring(0,searchStartIndex) +textToAdd + this.doenetML.substring(searchEndIndex,this.doenetML.length);
    }
  

    
  }

  handleSearchEntry(e){
    let search = e.target.value;
    if (search === ""){ search = -1;}//reset search
    this.buildContextPanel({search:search})
    this.setState({search:search});
  }

  buildDoenetMLDate(){
    
    this.List_doenetML_timestamp = [];
      for (let x = 0;x<this.List_Of_Recent_doenetML.length;x++){
       
        let date_ = (
        <option value={Object.values(this.List_Of_Recent_doenetML[x])}>
        {Object.keys(this.List_Of_Recent_doenetML[x])}
        </option>
        )
         this.List_doenetML_timestamp.push(date_);
         
    }
    
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
   
    if(tagType === 'constructor'){
      this.contextPanel = (
      <React.Fragment>
        <h3>Context Panel</h3>
        <p>Use this to modify and gather information about your components.</p>
        </React.Fragment>);
      return;
    }

    if(tagType === 'comment'){
      if (unmatchedTagFLAG){
        this.contextPanel = (
        <React.Fragment>
          <h3>Unended Comment</h3>
          <p>{properties.tagString}</p>
          </React.Fragment>);
      }else{
        this.contextPanel = (
        <React.Fragment>
          <h3>Comment</h3>
          <p>{properties.tagString}</p>
          </React.Fragment>);
      }
      

      return;
    }
    if(tagType === 'inbetween unmatched'){
      this.contextPanel = (
      <React.Fragment>
        <h3>Unmatched Tag</h3>
        <p>There is a tag missing a closing tag<br/> above this code.</p>
        </React.Fragment>);
      
      
      return;
    }

    if (unmatchedTagFLAG){
      this.contextPanel = (
       <React.Fragment>
         <h3>{tagType}</h3>
         <p>There is a tag missing a closing tag<br/> above this code.</p>
         </React.Fragment>);
        
      return;
    }

    //select graph as a test
    let ComponentClass = allComponents[tagType];
    if (ComponentClass === undefined){ 


    this.contextPanel = <h3>Tag '{tagType}' is not defined</h3>
    return;
    }

    this.contextPanel = [];

    let headingForTag = <h3 key="contextHeading">{tagType}</h3>

    this.contextPanel.push(headingForTag);
   
  

    if (search !== -1){
      if (this.state !== undefined && search === ""){
        search = this.state.search;
      }
      let temp = <h4 key="contextSearch">search for '{search}'</h4>
      this.contextPanel.push(temp);
    }
    

    let PropertiesObject = allComponents[tagType]["properties"];
    for(let prop in PropertiesObject){
   
      if (prop in properties){
        PropertiesObject[prop] = properties[prop];
      } else{

      }
    }

    for(let prop in PropertiesObject){
  
      if (prop in properties){
        PropertiesObject[prop] = properties[prop];
      }else if("default" in PropertiesObject[prop]){
      
          PropertiesObject[prop].value = this.documentTitle;
      
      } else{
    
        delete PropertiesObject[prop];
      }
    }
    let propertiesToDisplay = Object.keys(PropertiesObject).sort();
    for(let [index,tagType] of propertiesToDisplay.entries()){
  
      let result =this.tagTypeToContextJSX({
      tagType:tagType,
      value:PropertiesObject[tagType].value,
      propInfo:PropertiesObject[tagType],
      addPropIndex:addPropIndex,
      key:tagType+index})


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
     
          this.setState({valueShouldBeLength:e.target.value.length})
          this.handleUpdateText(e,propInfo,addPropIndex,tagType);
          this.getTitle();
          
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
  //Need to fix this

  findTagViaCursor({row,col}){

    let documentTag = {
      tagType:"document",
      tagProps:{}
      };
      let searchText = -1;
      let searchStartIndex = -1;
      let searchEndIndex = -1;

    var code = this.doenetML;
    //What is this.exceptionForRemoveCode for?
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
   
    let addPropIndex = currentIndex - 1;

    
    //Check if the cursor is inside of a start or end tag
    if (row < endParsedRow && row > startParsedRow ||
      row === startParsedRow && col <= startParsedColRight && col >= startParsedColLeft ||
      row === endParsedRow && col <= endParsedColRight && col >= endParsedColLeft 
      ){
        
        
    if (result.tagType.substring(0,1) === "/"){
      
      

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

      return {
        tagType:startTag.tagType,
        properties:startTag.tagProps,
        addPropIndex: startTag.addPropIndex,
        addChildIndex: addChildIndex,
        unmatchedTagFLAG: unmatchedTagFLAG,
        search: -1,
      }
    }
  
 
    let addChildIndex = this.findAddChildIndex({
      needleTag:result.tagType,
      result:result,
      code:code,
      currentIndex:currentIndex,
      });
     

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

  findAddChildIndex({needleTag,result,code,currentIndex,between=false}){
    

    if (result === false){
      return false;
    }
    
    let nestedTags = 0;
    let findEndResult = result;
    if (between){
      currentIndex = currentIndex - findEndResult.tagIndex - findEndResult.tagString.length;
   
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
      
      if (nestedTags > 0){
        nestedTags--;
      }else{
        break;
      }
    }else if(findEndResult.tagType === needleTag){
      
          nestedTags++;
    }
    currentIndex = currentIndex +findEndResult.tagString.length;

      code = code.substring(findEndResult.tagIndex + findEndResult.tagString.length,code.length);
      findEndResult = this.findNextTag({code:code,index:currentIndex});
    }
    return currentIndex;
  }
  //Look and fix
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

  handleFilterByUsernameChange(e){
    let enteredText = e.target.value;
    this.setState({filterByUsernameValue:enteredText})
  }

  handleFilterByUsernameKeypress(e){

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
   

    if(e.key === 'Enter'){
      //this.buildLoadDocumentsInterface();
    this.forceUpdate();

    }
  }

  generateDocs() {
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
    
   
  }


  //     <div className="contextPanelMenu">
  //          <button  
  //              onClick={()=>{this.setState({open_context_pannel:!this.state.open_context_pannel})}}>{this.state.open_context_pannel?
  //              <FontAwesomeIcon icon={openContentPanel}/>:<FontAwesomeIcon icon={closeContentPanel}/>}
  //          </button>
  //     </div>
  //     <div className="textEditMenu"
  //     <select onChange={this.updateDoenetML} value={this.doenetML}>
  //       {this.List_doenetML_timestamp}
  //     </select>
  //     <select>
  //       <option onClick={()=>this.handleResizeFont(8)}>8</option>
  //       <option onClick={()=>this.handleResizeFont(10)}>10</option>
  //       <option onClick={()=>this.handleResizeFont(12)}>12</option>
  //       <option onClick={()=>this.handleResizeFont(14)}>14</option>
  //       <option onClick={()=>this.handleResizeFont(16)}>16</option>
  //       <option onClick={()=>this.handleResizeFont(18)}>18</option>
  //       <option onClick={()=>this.handleResizeFont(20)}>20</option>
  //     </select>
  //      <button className="Button" className="publish" onClick={this.publish} disabled={this.state.disable_publish} data-cy="editorPublishButton">
  //          Publish
  //      </button>
  //      <div>
  //      
  //      <div className="editViewMenu"
  //          <button className="Button" onClick={()=>{this.updateNumber++;this.forceUpdate()}}>
  //             Update
  //          </button>
  //          <button className="Button" onClick={this.modeToggle} data-cy="viewerModeButton">
  //            Mode
  //         </button>
  //         <button className="Button" onClick={this.toggleViewer} data-cy="editorOpenViewerButton">
  //           {this.state.separated_Viewer?<FontAwesomeIcon icon={closeExternalLink}/>:<FontAwesomeIcon icon={externalLink}/>}

  //         </button>
  //       </div>


  render2(){


    // if (this.state.error !== null){
    //   return (
    //    <p>Error! {this.state.error}</p>
    //   );
    // }
    
    
    let aceprops = {
      mode:"xml",
      "data-cy":"editorTextEntry",
      name:"editorTextEntry",
      theme:"textmate",
      height:"100%",
      width:"100%",
      fontSize:this.state.fontSize,
      tabSize:2,
     
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
           {/* <DoenetHeader toolTitle="Editor" headingTitle={this.state.documentName} />    */}
           {/* <h1>{this.state.documentName}</h1>  */}
              
          <div id="editorContainer">
            
                            {/* <div id={this.state.open_context_pannel?"contextPanel":"nocontextPanel"}>{this.contextPanel}</div>
                            */}
                            {/* <div id={ 
                              (this.state.separated_Viewer && this.state.open_context_pannel?"TextEdit_closeViewer":
                              (!this.state.separated_Viewer && this.state.open_context_pannel)?"textEdit":(this.state.separated_Viewer && !this.state.open_context_pannel)?"TextEdit_closeBoth":"TextEdit_closeContextPanel")
                            }> */}
                <div className="ace-editor-view">
                        
                    <AceEditor {...aceprops} value={this.state.doenetML}/>

                 </div>
                  
                {/* {!this.state.separated_Viewer && <div id="editView">
                {this.state.modeOpen &&  <div style={{backgroundColor:"#cce2ff", padding:"10px",borderBottom:"1px solid grey"}}>
                    <b>Modes</b> <br />

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

                   </div> } */}
                      
                  
                  <div className="doenet-viewer-view">
                  <DoenetViewer 
                            key={"doenetviewer"+this.updateNumber} //each component has their own key, change the key will trick Reach to look for new component
                            free={{doenetCode: this.state.doenetML}} 
                            mode={{
                            solutionType:this.state.solutionType,
                            allowViewSolutionWithoutRoundTrip:this.state.allowViewSolutionWithoutRoundTrip,
                            showHints:this.state.showHints,
                            showFeedback:this.state.showFeedback,
                            showCorrectness:this.state.showCorrectness,
                      }}           
                  />
                  </div>
               
                    
            </div> }
          
                

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
    
    
  }
  return [searchText,startIndex,endIndex];
}

export default DoenetEditor;
