import React, { Component } from 'react';
import nanoid from 'nanoid';
import axios from 'axios';
import './admin.css';
import DoenetHeader from './DoenetHeader';


class DoenetAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      branchIdsSelected: [],
      assignments: [],
      courseId: "aI8sK4vmEhC5sdeSP3vNW",
      keyStorageStatus: null,
      rename: {},
      edit: {},
    };
    const url='/api/env.php';
        axios.get(url)
        .then(resp=>{
            this.username = resp.data.user;
            this.access = resp.data.access;
            this.forceUpdate();
        });

    this.sharedContent = {}; //both have this
    this.loadSharedContent();//both have this
    this.sharedContent.documentOrder = [];//both have this
    this.courseInfo = {};



    this.gradeCategories = ['Gateway', 'Problem Sets', 'Projects', 'Exams', 'Participation'];

    this.updateAssignmentName = this.updateAssignmentName.bind(this);
    this.addAssignments = this.addAssignments.bind(this);
    this.handleContentChange = this.handleContentChange.bind(this);
    // this.deleteAssignment = this.deleteAssignment.bind(this);
    this.buildEditOutline = this.buildEditOutline.bind(this);
    this.insertHeading = this.insertHeading.bind(this);
    this.moveHeadingDown = this.moveHeadingDown.bind(this);
    this.moveHeadingUp = this.moveHeadingUp.bind(this);
    this.moveHeadingRight = this.moveHeadingRight.bind(this);
    this.moveHeadingLeft = this.moveHeadingLeft.bind(this);
    this.handleRenameHeading = this.handleRenameHeading.bind(this);
    this.saveHeadingName = this.saveHeadingName.bind(this);
    this.handleEditAssignment = this.handleEditAssignment.bind(this);
    this.handleAssignmentSave = this.handleAssignmentSave.bind(this);
    this.handleAssignmentMove = this.handleAssignmentMove.bind(this);
    this.saveCourseOutlineToAPI = this.saveCourseOutlineToAPI.bind(this);
    this.storeAccessKeyLocally = this.storeAccessKeyLocally.bind(this);
    this.saveAccessKeyIntoIndexDB = this.saveAccessKeyIntoIndexDB.bind(this);
    this.loadSharedContent = this.loadSharedContent.bind(this);//newly added for separation
    this.assignmentDataToCourseInfo = this.assignmentDataToCourseInfo.bind(this);
    
  }
  assignmentDataToCourseInfo({courseId,data}){ //newly added
        
        
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
loadAllCoursesAndTheirAssignments(){ //newly added

  //Hard coded Duane's Math 1241 course for now
  //Expect in the future we will load just the instructor's current courses here
  this.courseInfo["aI8sK4vmEhC5sdeSP3vNW"] = {};
  this.courseInfo.courses = [{courseId:"aI8sK4vmEhC5sdeSP3vNW",shortName:"math1241"}];
const url='/api/loadCourseOutline.php';
const data={
courseId: "aI8sK4vmEhC5sdeSP3vNW",
//   courseId:this.state.courseId,
}
const payload = {
params: data
}
//console.log("load Course Outline data");
//console.log(data);


axios.get(url,payload)
.then(resp=>{
  this.assignmentDataToCourseInfo({courseId:"aI8sK4vmEhC5sdeSP3vNW",data:resp.data});
    this.numberLoaded = this.numberLoaded + 1;
    this.forceUpdate();
});
  //   this.courseInfo.courses = [{courseId:"aI8sK4vmEhC5sdeSP3vNW",shortName:"math1241"}];

  //   //Replace this with an axios call
  // //   this.courseInfo["aI8sK4vmEhC5sdeSP3vNW"] = {};
  // //   this.courseInfo["aI8sK4vmEhC5sdeSP3vNW"].assignmentOrder = [];
  // //   this.courseInfo["aI8sK4vmEhC5sdeSP3vNW"].assignments = {};

  
  
}
  loadSharedContent(){ //newly added for separation //newly added
    console.log("-----running load shared content-------")
   const url='/api/loadWithKeywords.php';
   axios.get(url)
   .then(resp=>{

   //reset data
  // console.log("please work..."+resp.data);
   this.sharedContent = {};
   this.sharedContent.documentOrder = [];

   for (let data of resp.data){

     let docTags = [];
     if (data.docTags[0] !== null){
       docTags = data.docTags;
     }

     this.sharedContent[data.branchId] = {
       documentName:data.title,
       code:data.doenetML,
       docTags:docTags,
       contentId:data.contentId,  //TODO: Remove this from all areas
       publishedContentId:data.contentId,
   };
   //console.log("please work..."+this.sharedContent);
   //console.log("-----PUSHING------")
   this.sharedContent.documentOrder.push(data.branchId);

   }
   this.numberLoaded = this.numberLoaded + 1;
   
   this.forceUpdate();
 })
 .catch(error=>{this.setState({error:error})});
   
 //console.log("please work..."+this.sharedContent);
}
  handleContentChange(e) {
    let branchIdsArray = [];
    for (let option of e.target.options) {
      if (option.selected) { branchIdsArray.push(option.value); }
    }
    this.setState({ branchIdsSelected: branchIdsArray });
  }

  updateAssignmentName({ e, assignmentId }) {
    let newValue = e.target.value;
    this.courseInfo[this.state.courseId].assignments[assignmentId].documentName = newValue;
    this.forceUpdate();
  }

  addAssignments({ headingIdArray }) {
    // //if none selected select the first one
    // let editObj = this.state.edit;
    // if (editObj[assignmentId].gradeCategory === undefined || editObj[assignmentId].gradeCategory === null){
    //   editObj[assignmentId].gradeCategory = this.gradeCategories[0];
    // }

    if (this.state.branchIdsSelected.length === 0) { alert("You need to select content to make an assignment"); return; }
    let documentNameArray = [];
    let assignmentIdArray = [];
    let branchIdArray = [];
    let gradeCategory = this.gradeCategories[0];
    let baseObj = this.courseInfo[this.state.courseId];
    //Adjust the baseObj so it is at the current heading level
    for (let headingId of headingIdArray) {
      baseObj = baseObj.heading[headingId];
    }
    //define assignmentOrder and assignments
    if (baseObj.assignmentOrder === undefined) {
      baseObj.assignmentOrder = [];
      baseObj.assignments = {};
    }
    for (let branchId of this.state.branchIdsSelected) {
      let assignmentId = nanoid();

      baseObj.assignmentOrder.push(assignmentId);
      baseObj.assignments[assignmentId] = {};

      let documentName = this.sharedContent[branchId].documentName;
      baseObj.assignments[assignmentId].documentName = documentName;

      let code = this.sharedContent[branchId].code;
      baseObj.assignments[assignmentId].code = code;

      let revisionNumber = this.
      sharedContent[branchId].revisionNumber;
      baseObj.assignments[assignmentId].revisionNumber = revisionNumber;

      baseObj.assignments[assignmentId].sourceBranchId = branchId;

      baseObj.assignments[assignmentId].gradeCategory = gradeCategory;
      baseObj.assignments[assignmentId].coverPageHTML = "";
      baseObj.assignments[assignmentId].totalPointsOrPercent = 0;
      baseObj.assignments[assignmentId].showCorrectness = 1;
      baseObj.assignments[assignmentId].showHints = 1;
      baseObj.assignments[assignmentId].showFeedback = 1;


      documentNameArray.push(documentName);
      assignmentIdArray.push(assignmentId);
      branchIdArray.push(branchId);
    }

    //Save in Database
    // console.log(documentNameArray);
    // console.log(assignmentIdArray);
    // console.log(branchIdArray);



      this.saveCourseOutlineToAPI();

    this.forceUpdate();
  }

  // deleteAssignment({assignmentId}){
  //   this.props.courseInfo[this.state.courseId].assignmentOrder =
  //       this.props.courseInfo[this.state.courseId].assignmentOrder.filter(value => value !== assignmentId);
  //   delete this.props.courseInfo[this.state.courseId].assignments[assignmentId];
  //   this.forceUpdate();
  // }


  saveCourseOutlineToAPI() {
    const url = '/api/saveCourseOutline.php';
    const data = {
      courseInfo: this.courseInfo[this.state.courseId],
      courseId: this.state.courseId,
    }

    console.log("save course outline data");
    console.log(data);


    axios.post(url, data)
      .then(resp => {
        console.log("Saved course outline!");
        console.log(resp);
        console.log(resp.data);


      })
      .catch(error => { this.setState({ error: error }) });
  }



  insertHeading({ headingIdArray }) {
    let baseObj = this.courseInfo[this.state.courseId];
    //Adjust the baseObj so it is at the current heading level
    for (let headingId of headingIdArray) {
      baseObj = baseObj.heading[headingId];
    }
    //define assignmentOrder and assignments
    if (baseObj.headingsOrder === undefined) {
      baseObj.headingsOrder = [];
      baseObj.heading = {};
    }
    let courseHeadingId = nanoid();
    let defaultHeadingText = "Untitled Heading";
    baseObj.headingsOrder.unshift({
      courseHeadingId: courseHeadingId,
      headingText: defaultHeadingText
    });
    baseObj.heading[courseHeadingId] = {};
    let headingLevel = headingIdArray.length + 1;
    let parentHeadingId = headingIdArray[(headingIdArray.length - 1)];

      this.saveCourseOutlineToAPI();

    this.forceUpdate();
  }

  moveHeadingDown({ courseId, headingIdArray, index }) {
    let baseObj = this.courseInfo[courseId];
    //Adjust the baseObj so it is at the current heading level
    for (let headingId of headingIdArray) {
      baseObj = baseObj.heading[headingId];
    }
    let indexHeadingObj = baseObj.headingsOrder[index];


    let prevHeadingId = indexHeadingObj.courseHeadingId;
    let courseHeadingId = baseObj.headingsOrder[index + 1].courseHeadingId;
    let nextHeadingId = "";
    //If there is a nextHeading at this level set nextHeadingId
    if (Number(index) + 2 < baseObj.headingsOrder.length) {
      nextHeadingId = baseObj.headingsOrder[index + 2].courseHeadingId;
    }
    //copy heading below to index's position
    baseObj.headingsOrder[index] = baseObj.headingsOrder[index + 1];
    //put index into heading below
    baseObj.headingsOrder[index + 1] = indexHeadingObj;



      this.saveCourseOutlineToAPI();


    this.forceUpdate();
  }

  moveHeadingUp({ courseId, headingIdArray, index }) {
    let baseObj = this.courseInfo[courseId];
    //Adjust the baseObj so it is at the current heading level
    for (let headingId of headingIdArray) {
      baseObj = baseObj.heading[headingId];
    }
    let indexHeadingObj = baseObj.headingsOrder[index];

    let courseHeadingId = indexHeadingObj.courseHeadingId;
    let prevHeadingId = baseObj.headingsOrder[index - 1].courseHeadingId;
    let nextHeadingId = "";
    //If there is a nextHeading at this level set nextHeadingId
    if (Number(index) + 1 < baseObj.headingsOrder.length) {
      nextHeadingId = baseObj.headingsOrder[index + 1].courseHeadingId;
    }

    //copy heading below to index's position
    baseObj.headingsOrder[index] = baseObj.headingsOrder[index - 1];
    //put index into heading below
    baseObj.headingsOrder[index - 1] = indexHeadingObj;



      this.saveCourseOutlineToAPI();


    this.forceUpdate();
  }

  //Find index of parentHeadingId then test if there is one more heading below
  findNextHeadingId({ courseId, headingIdArray, lastHeadingId }) {

    let nextHeadingId = "";

    let baseObj = this.courseInfo[courseId];

    //Find the next heading if it exists for each level until we find the closest one
    for (let i = 0; i <= headingIdArray.length; i++) {

      let headingId = headingIdArray[i];
      if (i == headingIdArray.length) { headingId = lastHeadingId; }

      if (baseObj.headingsOrder !== undefined) {
        for (let [index, headingObj] of baseObj.headingsOrder.entries()) {
          let headingOrderId = headingObj.courseHeadingId;

          if (headingId === headingOrderId) {

            if (baseObj.headingsOrder[index + 1] !== undefined) {
              nextHeadingId = baseObj.headingsOrder[index + 1].courseHeadingId;

            }
            break;
          }
        }
        baseObj = baseObj.heading[headingId];
      }


    }


    return nextHeadingId;
  }

  moveHeadingLeft({ courseId, headingIdArray, index }) {

    let baseObj = this.courseInfo[courseId];
    //Adjust the baseObj so it is at the current heading level
    for (let headingId of headingIdArray) {
      baseObj = baseObj.heading[headingId];
    }

    let parentHeadingObj = this.courseInfo[courseId];
    //Adjust the parentHeadingObj so it is at the current heading level
    for (let i = 0; i < headingIdArray.length - 1; i++) {
      let headingId = headingIdArray[i];
      parentHeadingObj = parentHeadingObj.heading[headingId];
    }
    let parentHeadingId = headingIdArray[headingIdArray.length - 1];
    let movingHeadingObj = baseObj.headingsOrder[index];
    let movingHeadingId = movingHeadingObj.courseHeadingId;

    let nextHeadingId = this.findNextHeadingId({ courseId: courseId, headingIdArray: headingIdArray, lastHeadingId: movingHeadingId });


    //***** 
    //add to headingOrder and headings to the parent.
    //***** 

    //find the index to insert it into the parent headingOrder
    let parentInsertIndex = 0;
    for (let [index, obj] of parentHeadingObj.headingsOrder.entries()) {
      if (obj.courseHeadingId === parentHeadingId) { parentInsertIndex = index; break; }

    }
    parentHeadingObj.headingsOrder.splice(parentInsertIndex + 1, 0, movingHeadingObj);
    parentHeadingObj.heading[movingHeadingId] = JSON.parse(JSON.stringify(baseObj.heading[movingHeadingId]));

    //***** 
    //Remove from headingOrder and headings of the base.
    //***** 
    delete baseObj.heading[movingHeadingId];
    baseObj.headingsOrder.splice(index, 1);


      this.saveCourseOutlineToAPI();

    this.forceUpdate();

  }

  moveHeadingRight({ courseId, headingIdArray, index }) {
    let baseObj = this.courseInfo[courseId];
    //Adjust the baseObj so it is at the current heading level
    for (let headingId of headingIdArray) {
      baseObj = baseObj.heading[headingId];
    }
    let parentHeadingId = baseObj.headingsOrder[index - 1].courseHeadingId;
    let parentHeadingObj = baseObj.heading[parentHeadingId];
    let movingHeadingObj = baseObj.headingsOrder[index];
    let movingHeadingId = movingHeadingObj.courseHeadingId;
    let nextHeadingId = this.findNextHeadingId({ courseId: courseId, headingIdArray: headingIdArray, lastHeadingId: movingHeadingId });

    //***** 
    //add to headingOrder and headings to the parent.
    //***** 
    if (parentHeadingObj.headingsOrder === undefined) {
      parentHeadingObj.headingsOrder = [];
      parentHeadingObj.heading = {};
    }
    parentHeadingObj.headingsOrder.push(movingHeadingObj);
    parentHeadingObj.heading[movingHeadingId] = JSON.parse(JSON.stringify(baseObj.heading[movingHeadingId]));
    //***** 
    //Remove from headingOrder and headings of the base.
    //***** 
    delete baseObj.heading[movingHeadingId];
    baseObj.headingsOrder.splice(index, 1);

      this.saveCourseOutlineToAPI();

    this.forceUpdate();

  }

  handleRenameHeading({ headingId, initialName }) {
    let rename = this.state.rename;
    rename[headingId] = {
      value: initialName,
      renameMode: true,
    }

    this.setState({ rename: rename });
  }

  saveHeadingName({ headingId, value }) {
      const url = '/api/renameHeading.php';
      const data = {
        headingId: headingId,
        value: value,
      }
      const payload = {
        params: data
      }
      console.log("data");
      console.log(data);


      axios.get(url, payload)
        .then(resp => {
          console.log("Saved!");
          console.log(resp);
          console.log(resp.data);


        })
        .catch(error => { this.setState({ error: error }) });
    
  }

  handleAssignmentSave({
    assignmentId,
    assignmentName,
    dueDate,
    assignedDate,
    gradeCategory,
    totalPointsOrPercent,
    coverPageHTML,
    individualize,
    multipleAttempts,
    showSolution,
    showFeedback,
    showHints,
    showCorrectness,
    proctorMakesAvailable,
  }) {
    let formattedAssignedDate = "null";
    if (!isNaN(Date.parse(assignedDate))) {
      console.log("here");

      formattedAssignedDate = new Date(assignedDate).toISOString().slice(0, 19).replace('T', ' ');
    }
    let formattedDueDate = "null";
    if (!isNaN(Date.parse(dueDate))) {
      formattedDueDate = new Date(dueDate).toISOString().slice(0, 19).replace('T', ' ');
    }


      const url = '/api/saveAssignmentInfo.php';
      const data = {
        assignmentId: assignmentId,
        assignmentName: assignmentName,
        dueDate: formattedDueDate,
        assignedDate: formattedAssignedDate,
        gradeCategory,
        totalPointsOrPercent,
        coverPageHTML,
        individualize,
        multipleAttempts,
        showSolution,
        showFeedback,
        showHints,
        showCorrectness,
        proctorMakesAvailable,
      }
      const payload = {
        params: data
      }
      console.log("data");
      console.log(data);


      axios.get(url, payload)
        .then(resp => {
          console.log("Saved!");
          console.log(resp);
          console.log(resp.data);


        })
        .catch(error => { this.setState({ error: error }) });
    
  }

  handleEditAssignment({ assignmentId,
    assignmentName,
    dueDate,
    assignedDate,
    gradeCategory,
    totalPointsOrPercent,
    coverPageHTML,
    individualize,
    multipleAttempts,
    showSolution,
    showFeedback,
    showHints,
    showCorrectness,
    proctorMakesAvailable,

  }) {
    let editObj = this.state.edit;
    let editMode = true;
    if (editObj[assignmentId] !== undefined && editObj[assignmentId].editMode) {
      editMode = false;
    }


    editObj[assignmentId] = {
      assignmentName: assignmentName,
      assignedDate: assignedDate,
      dueDate: dueDate,
      editMode: editMode,
      gradeCategory,
      totalPointsOrPercent,
      coverPageHTML,
      individualize,
      multipleAttempts,
      showSolution,
      showFeedback,
      showHints,
      showCorrectness,
      proctorMakesAvailable,
    };
    console.log("editObj[assignmentId]");

    console.log(editObj[assignmentId]);


    this.forceUpdate();
  }

  handleAssignmentMove({ courseId, headingIdArray, assignmentHeadingId, direction, index }) {
    let baseObj = this.courseInfo[courseId];
    //Adjust the baseObj so it is at the current heading level
    for (let headingId of headingIdArray) {
      baseObj = baseObj.heading[headingId];
    }
    baseObj = baseObj.heading[assignmentHeadingId];
    let swap1 = baseObj.assignmentOrder[index];
    let swap2;
    if (direction === "up") {
      swap2 = baseObj.assignmentOrder[index - 1];
      [baseObj.assignmentOrder[index - 1], baseObj.assignmentOrder[index]] =
        [baseObj.assignmentOrder[index], baseObj.assignmentOrder[index - 1]]

    } else {
      swap2 = baseObj.assignmentOrder[index + 1];
      [baseObj.assignmentOrder[index + 1], baseObj.assignmentOrder[index]] =
        [baseObj.assignmentOrder[index], baseObj.assignmentOrder[index + 1]]
    }



      this.saveCourseOutlineToAPI();

    this.forceUpdate();

  }

  handleAssignmentUpdate({ courseId, headingIdArray, assignmentHeadingId, assignmentId }) {
    let baseObj = this.courseInfo[courseId];
    //Adjust the baseObj so it is at the current heading level
    for (let headingId of headingIdArray) {
      baseObj = baseObj.heading[headingId];
    }
    baseObj = baseObj.heading[assignmentHeadingId];
    let assignmentInfo = baseObj.assignments[assignmentId];
    let contentInfo = this.sharedContent[assignmentInfo.sourceBranchId];
    assignmentInfo.revisionNumber = contentInfo.revisionNumber;
    assignmentInfo.code = contentInfo.code;

      const url = '/api/useMostRecentAssignment.php';
      const data = {
        assignmentId: assignmentId,
      }
      const payload = {
        params: data
      }
      console.log("data");
      console.log(data);


      axios.get(url, payload)
        .then(resp => {
          console.log("Saved!");
          console.log(resp);
          console.log(resp.data);


        })
        .catch(error => { this.setState({ error: error }) });
    

    this.forceUpdate();

  }

  //recursively build the editable outline of the course
  buildEditOutline({ courseId, headingIdArray = [] }) {




    let indentPx = "20";
    if (headingIdArray.length === 0) {
      this.courseOutlineList.push(
        <div key={key} style={{ marginBottom: "10px" }}>
          <button onClick={() => this.insertHeading({ headingIdArray: [] })}>Insert Heading</button><br />
        </div>
      );
    }

    let baseObj = this.courseInfo[courseId];
    //Adjust the baseObj so it is at the current heading level
    for (let headingId of headingIdArray) {
      baseObj = baseObj.heading[headingId];
    }
    if (baseObj.headingsOrder !== undefined) {
      let headingIndent = headingIdArray.length * Number(indentPx);
      for (let [index, headingObj] of baseObj.headingsOrder.entries()) {
        // for(let headingObj of baseObj.headingsOrder){
        let headingId = headingObj.courseHeadingId;

        let headingText = headingObj.headingText;

        if (this.state.rename[headingId] !== undefined && this.state.rename[headingId].renameMode) {

          headingText = <React.Fragment>
            <input type="text" value={this.state.rename[headingId].value} onChange={(e) => {
              let renameObj = this.state.rename;
              renameObj[headingId].value = e.target.value;
              this.setState({ rename: renameObj });
            }} />
            <button onClick={() => {
              let renameObj = this.state.rename;
              headingObj.headingText = renameObj[headingId].value;
              renameObj[headingId].renameMode = false;
              this.saveHeadingName({ headingId: headingId, value: renameObj[headingId].value });
              this.setState({ rename: renameObj })
            }}>done</button>
            <button onClick={() => {
              let renameObj = this.state.rename;
              renameObj[headingId].renameMode = false;
              this.setState({ rename: renameObj })
            }
            }>cancel</button>
          </React.Fragment>
        }

        let headingUpButton = <button
          onClick={() => this.moveHeadingUp({ courseId: courseId, headingIdArray: headingIdArray, index: index })}>
          up</button>;
        // if (index === 0 && headingIdArray.length == 0){
        if (index === 0) { headingUpButton = null; }
        let headingDownButton = <button
          onClick={() => this.moveHeadingDown({ courseId: courseId, headingIdArray: headingIdArray, index: index })}>
          down</button>;
        if (index === baseObj.headingsOrder.length - 1) { headingDownButton = null; }
        let headingLeftButton = <button
          onClick={() => this.moveHeadingLeft({ courseId: courseId, headingIdArray: headingIdArray, index: index })}>
          left</button>;
        if (headingIdArray.length === 0) { headingLeftButton = null; }
        let headingRightButton = <button
          onClick={() => this.moveHeadingRight({ courseId: courseId, headingIdArray: headingIdArray, index: index })}>
          right</button>;
        if (index === 0) { headingRightButton = null; }

        this.courseOutlineList.push(
          <div key={"OutlineHeading" + headingId} style={{ display: "flex" }}>
            <span style={{ marginLeft: headingIndent + "px", fontWeight: "bold", marginRight: "10px", display: "block", minWidth: "160px" }} >
              {headingText}
            </span>
            {headingUpButton}
            {headingDownButton}
            {headingLeftButton}
            {headingRightButton}
            <button onClick={() => this.handleRenameHeading({ headingId: headingId, initialName: headingText })}>rename</button>
          </div>
        );

        //heading has assignments
        let assignmentIndent = Number(headingIdArray.length * indentPx) + Number(indentPx);
        if (baseObj.heading[headingId].assignmentOrder !== undefined) {

          for (let [index, assignmentId] of baseObj.heading[headingId].assignmentOrder.entries()) {
            let assignmentInfo = baseObj.heading[headingId].assignments[assignmentId];
            console.log(assignmentInfo);

            let assignmentName = assignmentInfo.documentName;
            let editBox = null;
            //{assignmentInfo.assignedDate.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            if (this.state.edit[assignmentId] !== undefined && this.state.edit[assignmentId].editMode) {
              assignmentName = <React.Fragment>
                <input type="text" value={this.state.edit[assignmentId].assignmentName} onChange={
                  (e) => {
                    let editObj = this.state.edit;
                    editObj[assignmentId].assignmentName = e.target.value;
                    this.setState({ edit: editObj });
                  }
                } />
              </React.Fragment>

              editBox = <div style={{ width: "400px", padding: "10px", marginBottom: "10px", marginLeft: assignmentIndent + "px", backgroundColor: "#e8e8e8" }}>
                <div>Date Format: 6/10/2019, 11:37:26 AM or null</div><br />
                <div>Assigned Date: <input style={{ width: "200px" }}
                  type='text'
                  value={this.state.edit[assignmentId].assignedDate}
                  onChange={(e) => {
                    let editObj = this.state.edit;
                    editObj[assignmentId].assignedDate = e.target.value;
                    this.setState({ edit: editObj });
                  }}
                /></div>
                <div>Due Date: <input style={{ width: "200px" }}
                  type='text'
                  value={this.state.edit[assignmentId].dueDate}
                  onChange={(e) => {
                    let editObj = this.state.edit;
                    editObj[assignmentId].dueDate = e.target.value;
                    this.setState({ edit: editObj });
                  }}
                /></div>
                <div>Time Limit: N/A</div>
                <div>Individualize by Student:
                  <input style={{ marginLeft: "4px" }} type="checkbox"
                    checked={this.state.edit[assignmentId].individualize}
                    onChange={(e) => {
                      let editObj = this.state.edit;
                      editObj[assignmentId].individualize = e.target.checked;
                      this.setState({ edit: editObj });
                    }}
                  />
                </div>
                <div>Allow Multiple Attempts:
                <input style={{ marginLeft: "4px" }} type="checkbox"
                    checked={this.state.edit[assignmentId].multipleAttempts}
                    onChange={(e) => {
                      let editObj = this.state.edit;
                      editObj[assignmentId].multipleAttempts = e.target.checked;
                      this.setState({ edit: editObj });
                    }}
                  />
                </div>
                <div>Show Solution:
                <input style={{ marginLeft: "4px" }} type="checkbox"
                    checked={this.state.edit[assignmentId].showSolution}
                    onChange={(e) => {
                      let editObj = this.state.edit;
                      editObj[assignmentId].showSolution = e.target.checked;
                      this.setState({ edit: editObj });
                    }}
                  />
                </div>
                <div>Show Feedback:
                <input style={{ marginLeft: "4px" }} type="checkbox"
                    checked={this.state.edit[assignmentId].showFeedback}
                    onChange={(e) => {
                      let editObj = this.state.edit;
                      editObj[assignmentId].showFeedback = e.target.checked;
                      this.setState({ edit: editObj });
                    }}
                  />
                </div>
                <div>Show Hints:
                <input style={{ marginLeft: "4px" }} type="checkbox"
                    checked={this.state.edit[assignmentId].showHints}
                    onChange={(e) => {
                      let editObj = this.state.edit;
                      editObj[assignmentId].showHints = e.target.checked;
                      this.setState({ edit: editObj });
                    }}
                  />
                </div>
                <div>Show Correctness:
                <input style={{ marginLeft: "4px" }} type="checkbox"
                    checked={this.state.edit[assignmentId].showCorrectness}
                    onChange={(e) => {
                      let editObj = this.state.edit;
                      editObj[assignmentId].showCorrectness = e.target.checked;
                      this.setState({ edit: editObj });
                    }}
                  />
                </div>
                <div>Proctor Makes Available:
                <input style={{ marginLeft: "4px" }} type="checkbox"
                    checked={this.state.edit[assignmentId].proctorMakesAvailable}
                    onChange={(e) => {
                      let editObj = this.state.edit;
                      editObj[assignmentId].proctorMakesAvailable = e.target.checked;
                      this.setState({ edit: editObj });
                    }}
                  />
                </div>
               

                <div>Grade Category:
                  <select onChange={(e) => {
                    let editObj = this.state.edit;
                    editObj[assignmentId].gradeCategory = e.target.value;
                    this.setState({ edit: editObj });
                  }}
                    value={this.state.edit[assignmentId].gradeCategory}
                  >
                    {this.gradeCategories.map(cat => <option key={'option' + assignmentId + cat}>{cat}</option>)}

                  </select></div>
                  <div>Total points or percent: <input style={{ width: "200px" }}
                  type='text'
                  value={this.state.edit[assignmentId].totalPointsOrPercent}
                  onChange={(e) => {
                    let editObj = this.state.edit;
                    editObj[assignmentId].totalPointsOrPercent = e.target.value;
                    this.setState({ edit: editObj });
                  }}
                /></div>
                  <div>Cover Page HTML<br />
                    <textarea onChange={(e) => {
                    let editObj = this.state.edit;
                    editObj[assignmentId].coverPageHTML = e.target.value;
                    this.setState({ edit: editObj });
                  }} 
                    value={this.state.edit[assignmentId].coverPageHTML}
                  />

                  </div>

                <br />
                <br />
                <button onClick={
                  () => {
                    let editObj = this.state.edit;
                    editObj[assignmentId].editMode = false;
                    this.setState({ edit: editObj });
                  }
                }>cancel</button>
                <button onClick={
                  () => {
                    let editObj = this.state.edit;
                    baseObj.heading[headingId].assignments[assignmentId].documentName = editObj[assignmentId].assignmentName;
                    baseObj.heading[headingId].assignments[assignmentId].dueDate = new Date(editObj[assignmentId].dueDate);
                    baseObj.heading[headingId].assignments[assignmentId].assignedDate = new Date(editObj[assignmentId].assignedDate);
                    baseObj.heading[headingId].assignments[assignmentId].gradeCategory = editObj[assignmentId].gradeCategory; 
                    baseObj.heading[headingId].assignments[assignmentId].totalPointsOrPercent = editObj[assignmentId].totalPointsOrPercent; 
                    baseObj.heading[headingId].assignments[assignmentId].coverPageHTML = editObj[assignmentId].coverPageHTML; 
                    baseObj.heading[headingId].assignments[assignmentId].individualize = editObj[assignmentId].individualize;
                    baseObj.heading[headingId].assignments[assignmentId].multipleAttempts = editObj[assignmentId].multipleAttempts;
                    baseObj.heading[headingId].assignments[assignmentId].showSolution = editObj[assignmentId].showSolution;
                    baseObj.heading[headingId].assignments[assignmentId].showFeedback = editObj[assignmentId].showFeedback;
                    baseObj.heading[headingId].assignments[assignmentId].showHints = editObj[assignmentId].showHints;
                    baseObj.heading[headingId].assignments[assignmentId].showCorrectness = editObj[assignmentId].showCorrectness;
                    baseObj.heading[headingId].assignments[assignmentId].proctorMakesAvailable = editObj[assignmentId].proctorMakesAvailable;

                    let individualize = 0;
                    if (editObj[assignmentId].individualize) {
                      individualize = 1;
                    }
                    let multipleAttempts = 0;
                    if (editObj[assignmentId].multipleAttempts) {
                      multipleAttempts = 1;
                    }
                    let showSolution = 0;
                    if (editObj[assignmentId].showSolution) {
                      showSolution = 1;
                    }
        
                    
                    let showFeedback = 0;
                    if (editObj[assignmentId].showFeedback) {
                      showFeedback = 1;
                    }
                    let showHints = 0;
                    if (editObj[assignmentId].showHints) {
                      showHints = 1;
                    }
                    let showCorrectness = 0;
                    if (editObj[assignmentId].showCorrectness) {
                      showCorrectness = 1;
                    }
                    let proctorMakesAvailable = 0;
                    if (editObj[assignmentId].proctorMakesAvailable) {
                      proctorMakesAvailable = 1;
                    }
                    this.handleAssignmentSave({
                      assignmentId: assignmentId,
                      assignmentName: editObj[assignmentId].assignmentName,
                      assignedDate: editObj[assignmentId].assignedDate,
                      dueDate: editObj[assignmentId].dueDate,
                      gradeCategory: editObj[assignmentId].gradeCategory, 
                      totalPointsOrPercent: editObj[assignmentId].totalPointsOrPercent, 
                      coverPageHTML: editObj[assignmentId].coverPageHTML, 
                      individualize,
                      multipleAttempts,
                      showSolution,
                      showFeedback,
                      showHints,
                      showCorrectness,
                      proctorMakesAvailable,
                    })
                    editObj[assignmentId].editMode = false;
                    console.log("Save Pushed!");
                    console.log(editObj[assignmentId]);
                    this.setState({ edit: editObj });
                  }
                }>save</button>
              </div>
            }

            let updateButton = <button onClick={
              () => { this.handleAssignmentUpdate({ courseId: courseId, headingIdArray: headingIdArray, assignmentHeadingId: headingId, assignmentId: assignmentId }); }
            }>update assignment</button>;
            let sourceBranchId = baseObj.heading[headingId].assignments[assignmentId].sourceBranchId;
            // console.log(baseObj.heading[headingId].assignments[assignmentId]);

            // console.log(`assignment revision num ${baseObj.heading[headingId].assignments[assignmentId].revisionNumber}`);
            // console.log(`source ID ${sourceBranchId}`);
            // console.log(`content revision num ${this.props.sharedContent[sourceBranchId].revisionNumber}`);

            if (baseObj.heading[headingId].assignments[assignmentId].latestPublishedContentTest !== "0") {
              updateButton = null;
            }
            let assignmentUp = <button onClick={() => {
              this.handleAssignmentMove({ courseId: courseId, headingIdArray: headingIdArray, assignmentHeadingId: headingId, direction: "up", index: index });
            }}>up</button>;
            if (index === 0) { assignmentUp = null; }
            let assignmentDown = <button onClick={() => {
              this.handleAssignmentMove({ courseId: courseId, headingIdArray: headingIdArray, assignmentHeadingId: headingId, direction: "down", index: index });
            }}>down</button>;
            if (index === baseObj.heading[headingId].assignmentOrder.length - 1) {
              assignmentDown = null;
            }

            let editAssignedDate = "null";
            if (!isNaN(Date.parse(assignmentInfo.assignedDate))) {
              editAssignedDate = assignmentInfo.assignedDate.toLocaleString("en-US");
            }
            let editDueDate = "null";
            if (!isNaN(Date.parse(assignmentInfo.dueDate))) {
              editDueDate = assignmentInfo.dueDate.toLocaleString("en-US");
            }



            this.courseOutlineList.push(
              <React.Fragment key={"assignmentEditPanel" + assignmentId}>
                <div key={"assignmentInput" + assignmentId} style={{ display: "flex" }}>
                  <span style={{ marginLeft: assignmentIndent + "px", marginRight: "10px", display: "block", minWidth: "140px" }} >
                    {assignmentName}
                  </span>
                  {updateButton}
                  {assignmentUp}
                  {assignmentDown}
                  <button onClick={() => {
                    this.handleEditAssignment({
                      assignmentName: assignmentName,
                      assignmentId: assignmentId,
                      assignedDate: editAssignedDate,
                      dueDate: editDueDate,
                      gradeCategory: assignmentInfo.gradeCategory,
                      totalPointsOrPercent: assignmentInfo.totalPointsOrPercent,
                      coverPageHTML: assignmentInfo.coverPageHTML,
                      individualize: assignmentInfo.individualize,
                      multipleAttempts: assignmentInfo.multipleAttempts,
                      showSolution: assignmentInfo.showSolution,
                      showFeedback: assignmentInfo.showFeedback,
                      showHints: assignmentInfo.showHints,
                      showCorrectness: assignmentInfo.showCorrectness,
                      proctorMakesAvailable: assignmentInfo.proctorMakesAvailable,
                    });
                  }}>edit</button>
                </div>
                {editBox}
              </React.Fragment>
            );
          }
        }
        let nextLevelHeadingIdArray = []; //break the association for recursion
        for (let headingId of headingIdArray) {
          nextLevelHeadingIdArray.push(headingId);
        }
        nextLevelHeadingIdArray.push(headingId);

        this.courseOutlineList.push(
          <div key={key} style={{ marginLeft: assignmentIndent + "px", marginBottom: "10px" }}>
            <button onClick={() => this.insertHeading({ headingIdArray: nextLevelHeadingIdArray })}>Insert Heading</button><br />
            {/* <button onClick={() => this.addAssignments({ headingIdArray: nextLevelHeadingIdArray })}>Insert Assignments</button> comment here */}
          </div>
        );
        if (baseObj.headingsOrder !== undefined && baseObj.headingsOrder.length > 0) {

          this.buildEditOutline({ courseId: courseId, headingIdArray: nextLevelHeadingIdArray })
        }
      }
    }

  }

  saveAccessKeyIntoIndexDB(courseId,accessKey){

    var request = window.indexedDB.open("DoenetAccess");
    request.onsuccess = (e) => {
      let db = e.target.result;
      var accessKeyObjectStore = db.transaction("accessKeys", "readwrite").objectStore("accessKeys");
      let request = accessKeyObjectStore.get(courseId);
      request.onsuccess = (e)=>{
        let data = e.target.result;

        if (data === undefined){
          let requestAdd = accessKeyObjectStore.add({courseId,accessKey})
          requestAdd.onsuccess = (e)=>{
            this.setState({keyStorageStatus:"Access Key Saved!"});
          }
          requestAdd.onerror = (e)=>{
            this.setState({keyStorageStatus:"Error!"})
          }
        }else{
          data.accessKey = accessKey;
          let requestUpdate = accessKeyObjectStore.put(data);
          requestUpdate.onsuccess = (e)=>{
            this.setState({keyStorageStatus:"Access Key Updated!"});
          }
          requestUpdate.onerror = (e)=>{
            this.setState({keyStorageStatus:"Error!"})
          }

        }
        
      }
      
    }
    request.onupgradeneeded = (e) => {
      let db = e.target.result;
      db.createObjectStore("accessKeys", { keyPath: "courseId" });
    }
  }

  storeAccessKeyLocally(){
      const url = '/api/getAccessKey.php';
      const data = {
        courseId: this.state.courseId,
      }
      const payload = {
        params: data
      }
      console.log("data");
      console.log(data);


      axios.get(url, payload)
        .then(resp => {
          console.log("Saved!");
          console.log(resp);
          console.log(resp.data);
          this.saveAccessKeyIntoIndexDB(this.state.courseId,resp.data);

        })
        .catch(error => { this.setState({ error: error }) });
  
    
  }
  render(){
    return (
      <div>Hi</div>
    )
  }

  render_off() {
    this. loadAllCoursesAndTheirAssignments();
    //if (this.username === ""){ return null;}
    //if (this.access !== 1){ return "No Access for "+this.username;}
    if (this.numberLoaded < 2){ return null;} //wait for the content to load
    console.log("courseInfo");
    console.log(this.courseInfo);
    const contentOptions = [];
    for (let branchId of this.sharedContent.documentOrder) {
      contentOptions.push(<option key={"addAssignment" + branchId} value={branchId}>{this.sharedContent[branchId].documentName}</option>);
    }

    this.courseOutlineList = [];
    // for (let course of this.props.courseInfo.courses){
    //   console.log(course);
    // }
    let courseId = this.courseInfo.courses[0].courseId;
    this.buildEditOutline({ courseId: courseId });
    for (let assignmentId of this.props.courseInfo[courseId].assignmentOrder ){
      let documentName = this.props.courseInfo[courseId].assignments[assignmentId].documentName;

      courseOutlineList.push(
        <div key={"assignmentInput"+assignmentId}>
          <input 
          style={{marginLeft:"10px",margineRight:"10px"}} 
          type="text" 
          placeholder="Assignment Name" 
          onChange={(e) => this.updateAssignmentName({e:e,courseId:courseId,assignmentId:assignmentId})}
          value={documentName}></input>
          <button>up</button>
          <button>down</button>
          <button>left</button>
          <button>right</button>
          <button onClick={()=>this.deleteAssignment({assignmentId:assignmentId})}>delete</button>
        </div>
          );
    }



    return (<React.Fragment>
      <DoenetHeader toolTitle="Course Administration" headingTitle={this.courseInfo.courses[0].shortName} />

      <div className="appAdminPanel">
        <div style={{ display: "flex", marginLeft: "10px" }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "440px",
          }}>
            <div>
              <h2>Assignments</h2>
            </div>
            <div>
              <input style={{ margin: "10px" }} type="text" placeholder="CSV tags"></input><button>filter</button>
            </div>
            <div>
              <select onChange={this.handleContentChange} style={{ width: "300px" }} size="20" multiple>
                {/* {contentOptions} */}
              </select>
            </div>
          </div>


          <div style={{ paddingLeft: "30px" }}>
            <h2>Course Outline</h2>
            {/* {this.courseOutlineList} */}

          </div>
        </div>


      </div>

      {/* <div className="appBottomInfo">
      </div>

      <div className="doenetappSelectionPanel">
        <h2>Course Select</h2>
        <select style={{ width: "180px" }} size="30" >
          <option value="math1241">math1241</option>
        </select>
        <button>Change Course</button>

        <button style={{marginTop:"100px"}} onClick={this.storeAccessKeyLocally}>Store Access Key</button>
        <div>{this.state.keyStorageStatus}</div>

      </div> */}

      
    </React.Fragment>);
  }
}

export default DoenetAdmin;
