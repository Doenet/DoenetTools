import React, { Component } from 'react';
import DoenetViewer from '../React/DoenetViewer';
import axios from 'axios';
import MersenneTwister from 'mersenne-twister';
import './course.css';
import DoenetHeader from './DoenetHeader';

function hashStringToInteger(s) {
  var hash = 0, i, chr;
  if (s.length === 0) return hash;
  for (i = 0; i < s.length; i++) {
    chr   = s.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

class DoenetCourse extends Component {
  constructor(props){
    super(props);
    
    this.assignmentIndex = 0;
    this.loadingScreen = (<React.Fragment><p>Loading...</p></React.Fragment>);

      const envurl='/api/env.php';
      axios.get(envurl)
        .then(resp=>{
            this.username = resp.data.user;
            this.access = resp.data.access;
            this.forceUpdate();
        });
     
      
    let url_string = window.location.href;
    var url = new URL(url_string);
    
    this.username = "";
    this.courseId = "aI8sK4vmEhC5sdeSP3vNW"; //Temporary TODO: Choose courses
    this.courseName = "Calculus and Dynamical Systems in Biology";
    this.gradeCategories = ['Gateway','Problem Sets','Projects','Exams','Participation'];
    this.assignmentId = url.searchParams.get("assignmentId");
    this.mode = url.searchParams.get("mode");
    this.activeSection = url.searchParams.get("active");
    //Temporary not use params
    this.mode = "preview"; //Temp
    console.log(`The courseId id is ${this.courseId}`);
    this.courseInfo = {};
    this.finishedContructor = false;

      let code = "";
    
      //Get code and mode from the database
    const loadOutlineUrl='/api/loadOutline.php';
    const data={
      courseId: this.courseId,
    }
    const payload = {
      params: data
    }
    console.log("data");
    console.log(data);
    
    axios.get(loadOutlineUrl,payload)
    .then(resp=>{
      console.log(resp.data);
      this.finishContruction({data:resp.data});
      this.setState({assignmentIndex:this.assignmentIndex,code:this.assignmentIdList[this.assignmentIndex].code});
      if (this.activeSection === "assignments") {
        this.loadAssignment({assignmentId: this.assignmentId});
        this.buildAssignment();
      }
    });
    
    this.state = {
      courseId: "",
      error: null,
      errorInfo: null,
      outlineType:"outline",
    };

    //detect forward or back browser buttons
    // window.onpopstate = function(e){
    //   // alert(`${document.location} ${JSON.stringify(e.state)}`);
    //   // this.loadAssignment({assignmentInfo:e.state.assignmentId})
    // }.bind(this);
    if (this.activeSection === null || this.activeSection === "overview"){
      this.buildOverview();
    }else if(this.activeSection === "syllabus"){
      this.buildSyllabus();
    }else if(this.activeSection === "grades"){
      this.buildGrades();
    } else if(this.activeSection === "assignments") {
      this.mainSection = this.loadingScreen;
      // wait for completion of finishConstruction then buildAssignment
    }

    this.updateNumber = 0;
    this.updateLocationBar = this.updateLocationBar.bind(this);
    this.buildAssignmentGrades = this.buildAssignmentGrades.bind(this);
    this.buildItemGrade = this.buildItemGrade.bind(this);
    this.buildAttemptItemGradesHelper = this.buildAttemptItemGradesHelper.bind(this);
    this.assignmentDataToCourseInfo = this.assignmentDataToCourseInfo.bind(this);
    this.buildOutline = this.buildOutline.bind(this);
    this.buildAssignmentArray = this.buildAssignmentArray.bind(this);
    this.loadAssignment = this.loadAssignment.bind(this);
    this.finishContruction = this.finishContruction.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.buildAssignmentList = this.buildAssignmentList.bind(this);
    this.setAssignmentObj = this.setAssignmentObj.bind(this);
    this.generateNewAttempt = this.generateNewAttempt.bind(this);
    this.creditUpdate = this.creditUpdate.bind(this);
    this.buildAssignment = this.buildAssignment.bind(this);
    this.updateAssignmentList = this.updateAssignmentList.bind(this);
  }

  // updateLocationBar({assignmentId, activeSection=this.activeSection}){
  //   history.replaceState({},"title","?active="+activeSection);
  //   if (this.activeSection === "assignment")
  //     history.replaceState({assignmentId:this.assignmentObj.assignmentId},"title","?assignmentId="+this.assignmentObj.assignmentId);
  // }

  updateLocationBar(assignmentId=this.assignmentId, activeSection=this.activeSection){
    history.replaceState({},"title","?active="+activeSection);
    if (this.activeSection === "assignments") {
      console.log(this.assignmentId);
      history.replaceState({},"title","?active="+activeSection+"&assignmentId="+assignmentId);
    }
  }

  buildOverview(){
    this.mainSection = this.loadingScreen;

    //talk to database to load fresh info
    this.overview = (<React.Fragment>
      <h2 data-cy="sectionTitle">Overview</h2>
    </React.Fragment>)

    this.mainSection = this.overview;
    this.activeSection = "overview";
  }

  buildSyllabus(){
    this.mainSection = this.loadingScreen;

    //talk to database to load fresh info
    this.overview = (<React.Fragment>
      <h2 data-cy="sectionTitle">Syllabus</h2>
    </React.Fragment>)

    this.mainSection = this.overview;
    this.activeSection = "syllabus";
  }

  buildAssignment() {
    this.mainSection = this.loadingScreen;
    this.activeSection = "assignments";

    if (this.mode === ""){ return null;}
    if (this.finishedContructor === false) {return null;}

    let disablePrev = false;
    if (this.assignmentIndex === 0){disablePrev = true;}
    let disableNext = false;
    if (this.assignmentIndex === (this.assignmentIdList.length - 1)){disableNext = true;}

    console.log("-----------this.assignmentObj-------------");
    
    console.log(this.assignmentObj);

    let solutionType = "button";
    if (Number(this.assignmentObj.showSolution) === 0){
      solutionType = "none";
    }
    let showHints = true;
    if (Number(this.assignmentObj.showHints) === 0){
      showHints = false;
    }
    let showFeedback = true;
    if (Number(this.assignmentObj.showFeedback) === 0){
      showFeedback = false;
    }
    let showCorrectness = true;
    if (Number(this.assignmentObj.showCorrectness) === 0){
      showCorrectness = false;
    }
    
    this.assignmentFragment = <React.Fragment>
      <div className="assignmentContainer">
        <div className="assignmentActivity">
              <DoenetViewer 
              key={"doenetviewer"+this.updateNumber} 
              free={{
                doenetCode: this.assignmentObj.code,
                doenetState: this.assignmentObj.latestDocumentState,
                requestedVariant:{index:this.assignmentObj.assignedVariant},
              }} 
              assignmentId={this.assignmentObj.assignmentId}
              creditUpdate={this.creditUpdate}
              attemptNumber={this.assignmentObj.attemptNumber}
              mode={{
                solutionType:solutionType,
                allowViewSolutionWithoutRoundTrip:false,
                showHints,
                showFeedback,
                showCorrectness,
              }}
              course={true}
              />
        </div>
      </div>
    </React.Fragment>;

    this.mainSection = this.assignmentFragment;
    this.updateLocationBar(this.assignmentObj.assignmentId);
    this.forceUpdate();
  }

  buildGrades(){
    this.mainSection = this.loadingScreen;
    this.activeSection = "grades";

    this.scores = {};
    this.subTotals = {};
      
      const loadGradsUrl='/api/loadGradsLearner.php';
      
      // this.courseId
      const data={
        courseId: this.courseId,
      }
      const payload = {
        params: data
      }
      
      
      axios.get(loadGradsUrl,payload)
        .then(resp=>{
          this.assignmentsData = resp.data.grades;
          this.student = resp.data.student;
          this.course = resp.data.course;
          this.section = resp.data.section;
          this.group = resp.data.group;
          this.buildGradesHelper();
        })
        .catch(error=>{this.setState({error:error})});

  }

  buildGradesHelper(){
    
    this.total = {possible:0,score:0,percentage:'0%'}

    for (let gcat of this.gradeCategories){
      this.scores[gcat] = [];
      this.subTotals[gcat] = {possible:0,score:0,percentage:'0%'};

      for (let dObj of this.assignmentsData){
        if (dObj.gradeCategory === gcat){
          let possible = dObj.totalPointsOrPercent;
          let percentFLAG = false;
          if (possible === null){
            possible = '--';
            percentFLAG = true;
          }else{
            possible = Number(possible);
            this.subTotals[gcat].possible += possible;
          }
          let score = dObj.credit;
          if (score === null || possible === null){
            score = '--';
            percentFLAG = true;
          }else{
            score = Number(score)*possible;
            if (!isNaN(score)){
              this.subTotals[gcat].score += score;
            }
          }
          let percentage;
          if (percentFLAG){
            percentage = '--';
          }else{
            percentage = Math.round(score/possible*1000)/10 + '%';
          }

          if (isNaN(score)){
            score = "--";
          }

          this.scores[gcat].push({gradeItem:dObj.assignmentName,
            assignmentId:dObj.assignmentId,
            possible:possible,
            score:score,
            percentage:percentage
          });
        }
      }

      if (this.subTotals[gcat].score > 0 && this.subTotals[gcat].possible > 0){
        this.subTotals[gcat].percentage = Math.round(this.subTotals[gcat].score / this.subTotals[gcat].possible*1000)/10 + '%';
        this.total.score += Number(this.subTotals[gcat].score);
        this.total.possible += Number(this.subTotals[gcat].possible);
      }
      
    }
    this.total.percentage = '0%';
    if(!isNaN(this.total.score / this.total.possible*1000)/10){
      this.total.percentage = Math.round(this.total.score / this.total.possible*1000)/10 + '%';
    }
 
    //talk to database to load fresh info
    this.overview = (<React.Fragment>
      <h2 data-cy="sectionTitle">Grades</h2>
      <div style={{marginLeft:"10px"}}>
        <div>Student: {this.student}</div>
        {/* <div>Course: {this.course}</div> */}
        <div>Section: {this.section}</div>
        {this.group !== '' ? <div>Group: {this.group}</div> : null}
      </div>
      
      

      <table id="grades">
      <tbody>
        <tr className="colHeadingsRow">
          <th width="581">Grade item</th>
          <th width="75">Possible points</th>
          <th width="56">Score</th>
          <th width="95">Percentage</th>
        </tr>

      { this.gradeCategories.map( cat => <React.Fragment key={'option'+cat}>
      
        <tr>
          <td className="typeHeadingRow" colSpan="4">{cat}</td>
        </tr>
     

        {this.scores[cat].map(
          (score)=><React.Fragment key={'score_row'+score.assignmentId}>
          <tr className="typeDataRow"> 
            <td><span className="assignmentLink" onClick={()=>{
              this.buildAssignmentGrades({assignment:score});
              
            }}>{score.gradeItem}</span></td>
            <td>{score.possible}</td>
            <td>{score.score}</td>
            <td>{score.percentage}</td>
          </tr>
          </React.Fragment>
        )}

        <tr className="typeSubTotalDataRow"> 
          <td><span>Subtotal for {cat}</span></td>
          <td>{this.subTotals[cat].possible}</td>
          <td>{this.subTotals[cat].score}</td>
          <td>{this.subTotals[cat].percentage}</td>
        </tr>
        

      </React.Fragment>)}

        
        <tr className="colTotalRow">
          <td>Total</td>
          <td>{this.total.possible}</td>
          <td>{this.total.score}</td>
          <td>{this.total.percentage}</td>
        </tr>
       
        </tbody>
      </table>
    </React.Fragment>)

    this.mainSection = this.overview;
    this.forceUpdate();
  }

  buildAssignmentGrades({assignment}){
    this.mainSection = this.loadingScreen;
    this.assignment = assignment;
    this.assignmentId = assignment.assignmentId;

      const url='/api/loadItemGrades.php';
      
      const data={
        courseId: this.courseId,
        assignmentId: assignment.assignmentId,
      }
      const payload = {
        params: data
      }
      console.log("buildAssignmentGrades send data");
      console.log(data);
      
      
      axios.get(url,payload)
        .then(resp=>{
          console.log("buildAssignmentGrades resp data");
          console.log(resp.data);
          
          this.assignmentItems = resp.data.assignmentItems;

          this.latestAttemptNumber = resp.data.attemptNumber;
          this.latestAttemptCredit = resp.data.attemptCredit;

          this.buildAssignmentGradesHelper();
        })
        .catch(error=>{this.setState({error:error})});
  }

  buildAssignmentGradesHelper(){
    let latestAttemptPercentage = Math.round(Number(this.latestAttemptCredit)*10000,2)/100;
    latestAttemptPercentage = `${latestAttemptPercentage}%`;
    for (var item of this.assignmentItems){
      let percentage = Math.round(Number(item.credit)*10000,2)/100;
      item.percentage = `${percentage}%`;
      
    }


    this.mainSection = (<React.Fragment>
      <button onClick={()=>{
        this.buildGradesHelper({data:this.assignmentsData});
      }}>Back to grades</button>
      <h2 style={{marginLeft:"10px"}}>{this.assignment.gradeItem}</h2>
      {this.latestAttemptNumber > 1 ? <p style={{marginLeft:"10px",fontSize:"16px"}}>Attempt Number: {this.latestAttemptNumber} </p>: null }

      <table id="grades" style={{width:"400px"}}>
      <tbody>
        <tr className="colHeadingsRow">
          <th width="581">Grade item</th>
          <th width="95">Percentage</th>
        </tr>

        {this.assignmentItems.map(
          (item)=><React.Fragment key={'assignmentItem'+item.title}>
          <tr className="typeDataRow"> 
            <td><span className="assignmentLink" onClick={()=>{
              // this.buildAssignmentGrades({assignment:score});
              this.buildItemGrade({item});
              
            }}>{item.title}</span></td>
            <td>{item.percentage}</td>
          </tr>
          </React.Fragment>
        )}

        
        {this.latestAttemptNumber > 1 ? 
          <tr className="colTotalRow">
            <td>Total for attempt {this.latestAttemptNumber}</td>
          <td>{latestAttemptPercentage}</td>
          </tr>
          : null }
          
        <tr className="colTotalRow">
          <td>Total</td>
          <td>{this.assignment.percentage}</td>
        </tr>
        </tbody>
        </table>
      </React.Fragment>);

    this.forceUpdate();

  }

  buildItemGrade({item}){


    const url='/api/loadItemAttemptGrades.php';
      
      // this.courseId
      const data={
        assignmentId: this.assignmentId,
        itemNumber: item.itemNumber,
        attemptNumber: this.latestAttemptNumber,
      }
      const payload = {
        params: data
      }
      
      
      axios.get(url,payload)
        .then(resp=>{
          
          this.buildAttemptItemGradesHelper({
            itemTitle:item.title,
            itemState:resp.data.itemState,
            submissionNumber:resp.data.submissionNumber,
            submittedDate:resp.data.submittedDate,
            valid:resp.data.valid,
            });
        })
        .catch(error=>{this.setState({error:error})});
    
  }

  buildAttemptItemGradesHelper({itemTitle, itemState, submissionNumber, submittedDate, valid, }){
    console.log('itemState');
    console.log(itemState);
    
    this.mainSection = (<React.Fragment>
      <button onClick={()=>{
        this.buildGradesHelper({data:this.assignmentsData});
      }}>Back to grades</button>
      <button onClick={()=>{
        this.buildAssignmentGradesHelper();
      }}>Back to {this.assignment.gradeItem}</button>
<h2 style={{marginLeft:"10px"}}>{this.assignment.gradeItem}: {itemTitle}</h2>
      {this.latestAttemptNumber > 1 ? <p style={{marginLeft:"10px",fontSize:"16px"}}>Attempt Number: {this.latestAttemptNumber} </p>: null }

            <DoenetViewer 
            key={"doenetviewer"} 
            free={{
            doenetState: itemState,
          }} 
          course={true}
            attemptNumber={this.latestAttemptNumber}
              mode={{
                solutionType:"displayed",
                allowViewSolutionWithoutRoundTrip:false,
                showHints:false,
                showFeedback:true,
                showCorrectness:true,
                interactive:false,
              }}
            />

    </React.Fragment>);
    this.forceUpdate();
  }

  setAssignmentObj({outlineType}){
    if (outlineType === "outline"){
      this.assignmentObj = this.assignmentIdList[this.assignmentIndex];
    } else if (outlineType === "assignment"){
      this.assignmentObj = this.assignmentAssignedList[this.assignmentIndex];
    } else if (outlineType === "due"){
      this.assignmentObj = this.assignmentDueList[this.assignmentIndex];
    } 
  }

  finishContruction({data}){
    
    this.courseAssignmentChoiceList = [];
    this.assignmentDataToCourseInfo({courseId:this.courseId,data:data});
    
    this.assignmentIdList = [];
    this.buildAssignmentArray({courseId:this.courseId,assignmentId:this.assignmentId});
    this.assignmentAssignedList = [...this.assignmentIdList];
    this.assignmentAssignedList.sort(
        (a,b) => { 
          return new Date(a.assignedDate) - new Date(b.assignedDate)}
      );
    this.assignmentDueList = [...this.assignmentIdList];
    this.assignmentDueList.sort(
        (a,b) => { 
          return new Date(a.dueDate) - new Date(b.dueDate)}
      );
  
    let outlineType = "outline";
    this.setAssignmentObj({outlineType:outlineType});
    this.resolveVariant({outlineType:outlineType});

    if (this.state.outlineType === "outline"){
      this.buildOutline({courseId:this.courseId});
    }else if (this.state.outlineType === "assignment"){
      this.buildAssignmentList({courseId:this.courseId});
    }else{
      this.buildDueList();
    }
    
    this.finishedContructor = true;
    
    // console.log("END OF CONSTRUCTION");
    // console.log(this.assignmentIdList);
    // console.log(this.assignmentIdList[this.assignmentIndex].code);
    // this.setState({code:this.assignmentIdList[this.assignmentIndex].code});
  }

  updateAssignmentList({outlineType}) {
    if (outlineType === "outline"){
      this.buildOutline({courseId:this.courseId});
    }else if (outlineType === "assignment"){
      this.buildAssignmentList({courseId:this.courseId});
    }else{
      this.buildDueList();
    } 
  }

  resolveVariant({outlineType}){
    
    if (this.assignmentObj.assignedVariant === undefined || this.assignmentObj.assignedVariant === null){
      this.assignmentObj.attemptNumber = 1;

      if (Number(this.assignmentObj.multipleAttempts) === 1){

        //VariantIndex is the same offline and online
        this.assignmentObj.assignedVariant = this.variantNumberFromAttemptNumber();
      }else{
        this.assignmentObj.assignedVariant = 0;
      }

     
      //Save assignedVariant to DB
      const url='/api/saveVariant.php';
    const data={
      assignmentId: this.assignmentObj.assignmentId,
      assignedVariant:this.assignmentObj.assignedVariant,
      attemptNumber:this.assignmentObj.attemptNumber,
      contentId:this.assignmentObj.contentId,
    }
    const payload = {
      params: data
    }
    console.log("saveVariant data");
    console.log(data);
    
    
    axios.get(url,payload)
      .then(resp=>{
        console.log(resp.data);
      });
      
    }
    

  }

  variantNumberFromAttemptNumber(){
    let preseed = this.assignmentObj.attemptNumber+this.assignmentObj.assignmentId
    if(Number(this.assignmentObj.individualize) === 1){
      preseed += this.username;
    }
    let seed = hashStringToInteger(preseed);

    let rng = new MersenneTwister(seed);
    let randomNumber = rng.random();
    return Math.floor(randomNumber * 1000000000);
  }

  assignmentDataToCourseInfo({courseId,data}){
        
    this.courseInfo[courseId] = {};
    this.courseInfo[courseId].heading = {};
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
                baseObj.heading[headingId].assignmentOrder.push(assignmentInfo.assignmentId);  
                
                  
                  baseObj.heading[headingId].assignments[assignmentInfo.assignmentId] = {
                    documentName:assignmentInfo.assignmentName,
                    code:assignmentInfo.doenetML,
                    latestDocumentState: assignmentInfo.latestDocumentState,
                    docTags:[],
                    contentId:assignmentInfo.contentId,
                    sourceBranchId:assignmentInfo.sourceBranchId,
                    dueDate:assignmentInfo.dueDate,
                    assignedDate:assignmentInfo.assignedDate,
                    individualize:assignmentInfo.individualize,
                    multipleAttempts:assignmentInfo.multipleAttempts,
                    showSolution:assignmentInfo.showSolution,
                    showFeedback:assignmentInfo.showFeedback,
                    showHints:assignmentInfo.showHints,
                    showCorrectness:assignmentInfo.showCorrectness,
                    proctorMakesAvailable:assignmentInfo.proctorMakesAvailable,
                    dueDateOverride:assignmentInfo.dueDateOverride,
                    timeLimitOverride:assignmentInfo.timeLimitOverride,
                    numberOfAttemptsAllowedOverride:assignmentInfo.numberOfAttemptsAllowedOverride,
                    attemptNumber:assignmentInfo.attemptNumber,
                    assignedVariant:assignmentInfo.assignedVariant,
                    generatedVariant:assignmentInfo.generatedVariant,
                    totalPointsOrPercent:assignmentInfo.totalPointsOrPercent,
                    credit:assignmentInfo.credit,
                    proctorMakesAvailable:assignmentInfo.proctorMakesAvailable,


                };
              
                
            }
            
        }


        prevLoopLevel = headingLevel;
        potentialParentHeadingId = headingId;
    }

  }

  componentDidCatch(error, info){
    this.setState({error:error,errorInfo:info});
  }

  buildAssignmentArray({courseId,headingIdArray=[],assignmentIndex=-1,assignmentId=this.assignmentObj.assignmentId}){
    
    let baseObj = this.courseInfo[courseId];
    //Adjust the baseObj so it is at the current heading level
    for(let headingId of headingIdArray){
      baseObj = baseObj.heading[headingId];
    }

    if (baseObj.assignmentOrder !== undefined){
      for (let baseObjAssignmentId of baseObj.assignmentOrder){

        // let assignmentInfo = Object.assign({},baseObj.assignments[assignmentId]);
        let assignmentInfo = baseObj.assignments[baseObjAssignmentId];
        assignmentInfo.assignmentId = baseObjAssignmentId;
        
        
      this.assignmentIdList.push(assignmentInfo);
      assignmentIndex++;
      if (baseObjAssignmentId === assignmentId){
        this.assignmentIndex = assignmentIndex;
      }
      }
    }
    

    if (baseObj.headingsOrder !== undefined){
      for(let [index,headingObj] of baseObj.headingsOrder.entries()){
        let headingId = headingObj.courseHeadingId;
        
        let nextLevelHeadingIdArray = []; //break the association for recursion
           for(let headingId of headingIdArray){
            nextLevelHeadingIdArray.push(headingId);
           }
           nextLevelHeadingIdArray.push(headingId);
          assignmentIndex = this.buildAssignmentArray({courseId:courseId,headingIdArray:nextLevelHeadingIdArray,assignmentIndex:assignmentIndex,assignmentId:assignmentId});
      }
    }
    return assignmentIndex;
  }

  buildAssignmentList({courseId}){

    this.courseAssignmentChoiceList = [];

    for (let [index,assignmentObj] of this.assignmentAssignedList.entries()){
      if (index === this.assignmentIndex){
        let selectedAssignment = this.buildSelectedAssignment({assignmentObj:assignmentObj});
        this.courseAssignmentChoiceList.push(selectedAssignment);
        this.assignmentIndex = index;
      }else{
        this.courseAssignmentChoiceList.push(
          <div 
          style={{margins:"10px",height:"30px"}} 
          key={'assignmentList'+assignmentObj.assignmentId}
          onClick={()=>{this.loadAssignment({assignmentId:assignmentObj.assignmentId})}}
          >{assignmentObj.documentName}</div>
        )
      }
      
    }

  }

  buildDueList(){

    this.courseAssignmentChoiceList = [];

    for (let [index,assignmentObj] of this.assignmentDueList.entries()){
      if (index === this.assignmentIndex){
        let selectedAssignment = this.buildSelectedAssignment({assignmentObj:assignmentObj});
        this.courseAssignmentChoiceList.push(selectedAssignment);
        this.assignmentIndex = index;
      }else{
        this.courseAssignmentChoiceList.push(
          <div 
          style={{margins:"10px",height:"30px"}} 
          key={'assignmentList'+assignmentObj.assignmentId}
          onClick={()=>{this.loadAssignment({assignmentId:assignmentObj.assignmentId})}}
          >{assignmentObj.documentName}</div>
        )
      }
    }
  }

  generateNewAttempt(){
      this.assignmentObj.attemptNumber++;
      this.assignmentObj.assignedVariant = this.variantNumberFromAttemptNumber();
      this.assignmentObj.latestDocumentState = null;
      this.updateNumber++;
      //Save attempt number to database
        //Save assignedVariant to DB
        const url='/api/saveVariant.php';
      const data={
        assignmentId: this.assignmentObj.assignmentId,
        assignedVariant:this.assignmentObj.assignedVariant,
        attemptNumber:this.assignmentObj.attemptNumber,
        contentId:this.assignmentObj.contentId,
      }
      const payload = {
        params: data
      }
      console.log("saveVariant on Generate New Attempt data");
      console.log(data);
      
      
      axios.get(url,payload)
        .then(resp=>{
          console.log(resp.data);
        });
        
      this.forceUpdate();
  }

  buildSelectedAssignment(){
    
    
    let available = "null";
    if (this.assignmentObj.assignedDate !== null){
      available = this.assignmentObj.assignedDate.toLocaleString("en-US");
    }
    let due = "null";
    if (this.assignmentObj.dueDate !== null){
      due = this.assignmentObj.dueDate.toLocaleString("en-US");
    }

    let newAttemptElements = null;
    let adjustment = 0;
    

    // console.log("this.assignmentObj multipleAttempts");
    // console.log(this.assignmentObj);
    // console.log(this.assignmentObj.multipleAttempts);
    
    if (Number(this.assignmentObj.multipleAttempts) === 1){
      adjustment = adjustment + 40;
      newAttemptElements = (<React.Fragment>
        <div>Attempt Number: {this.assignmentObj.attemptNumber}</div>
        <button style={{marginTop:"4px"}} onClick={()=>{
        this.generateNewAttempt();
        }}>Generate New Attempt</button>
        </React.Fragment>);
    }

    let gradeLinkElement = null;
    if (this.assignmentObj.totalPointsOrPercent){
      adjustment = adjustment + 20;
      let percentText = 0;
      if (this.assignmentObj.credit){
        percentText = Math.round(this.assignmentObj.credit * 1000)/10;
      }
      gradeLinkElement = (<React.Fragment>
        <div style={{cursor:"pointer"}} onClick={()=>{
          location.href = "/course/?active=grades&assignmentId="+this.assignmentObj.assignmentId;
        }}>Credit: {percentText}%</div> 
      </React.Fragment>)
    }

    let heightOfOutsideBox = 110 + adjustment + "px";

    return (<React.Fragment key={`selected ${this.assignmentObj.assignmentId}`}>
      <div style={{margins:"10px",height:heightOfOutsideBox, backgroundColor:"#cce2ff"}} onClick={this.buildAssignment}>
      <div style={{textAlign:"center", backgroundColor:"grey"}} >
      <div style={{display:"inline-block",fontWeight:"bold",fontSize:"16px"}}>{this.assignmentObj.documentName}</div>
      </div>
      <div>Available</div>
      <div> {available}</div>
      <div>Due</div>
      <div> {due}</div>
      {gradeLinkElement}
      {newAttemptElements}
      </div>
      </React.Fragment>
    );
  }

  buildOutline({courseId,headingIdArray=[]}){
    //Initialize the array before building
    if(headingIdArray.length === 0){
      this.courseAssignmentChoiceList = [];
    }
    let indentPx = "20";
    let baseObj = this.courseInfo[courseId];
    //Adjust the baseObj so it is at the current heading level
    for(let headingId of headingIdArray){
      baseObj = baseObj.heading[headingId];
    }
    
    if (baseObj.headingsOrder !== undefined){
      let headingIndent = headingIdArray.length * Number(indentPx);
      for(let [index,headingObj] of baseObj.headingsOrder.entries()){
        let headingId = headingObj.courseHeadingId;
        let headingText = headingObj.headingText;

        var assignmentList = [];
        let headingInfo = baseObj.heading[headingId];
        
        
        if (headingInfo.assignmentOrder !== undefined){
          
          for (let assignmentId of headingInfo.assignmentOrder){
            let assignmentObj = headingInfo.assignments[assignmentId];

            if (this.assignmentObj.assignmentId === assignmentId){
              let selectedObj = this.buildSelectedAssignment();
              assignmentList.push(selectedObj);
            }else{
              assignmentList.push(
                <div 
                style={{marginLeft:headingIndent+"px",minWidth:"160px"}} 
                key={'assignmentList'+assignmentId}
                onClick={()=>{this.loadAssignment({assignmentId:assignmentId})}}
                >{assignmentObj.documentName}</div>
              )
            }
            
          }
        }
        
        this.courseAssignmentChoiceList.push(
          <React.Fragment key={"outline"+headingObj.courseHeadingId}>
            <div style={{marginLeft:headingIndent+"px",fontWeight:"bold",minWidth:"160px"}}>{headingText}</div>
            { assignmentList }
          </React.Fragment>
        );

        let nextLevelHeadingIdArray = []; //break the association for recursion
           for(let headingId of headingIdArray){
            nextLevelHeadingIdArray.push(headingId);
           }
           nextLevelHeadingIdArray.push(headingId);
           this.buildOutline({courseId:courseId,headingIdArray:nextLevelHeadingIdArray});

      }
    }

    
  }

  loadAssignment({assignmentId,outlineType=this.state.outlineType}){
    this.updateAssignmentIndex({outlineType:outlineType,assignmentId:assignmentId});
    this.courseOutlineList = [];
    this.updateNumber++;
    this.assignmentId = assignmentId;
    this.setAssignmentObj({outlineType:this.state.outlineType});
    this.resolveVariant({outlineType:this.state.outlineType});
    this.updateAssignmentList({outlineType:this.state.outlineType});
    this.updateLocationBar();
    this.forceUpdate();
  }

  handlePrev(){
    if (this.assignmentIndex > 0) this.assignmentIndex = this.assignmentIndex-1;
    this.courseOutlineList = [];
    this.updateNumber++;
    this.setAssignmentObj({outlineType:this.state.outlineType});
    this.resolveVariant({outlineType:this.state.outlineType});
    this.updateAssignmentList({outlineType:this.state.outlineType});
    this.updateLocationBar();
    this.forceUpdate();
  }

  handleNext(){
    if (this.assignmentIndex < this.assignmentIdList.length - 1) this.assignmentIndex = this.assignmentIndex+1;
    console.log(this.assignmentIndex);
    console.log(this.assignmentIdList.length);
    this.courseOutlineList = [];
    this.updateNumber++;
    this.setAssignmentObj({outlineType:this.state.outlineType});
    this.resolveVariant({outlineType:this.state.outlineType});
    this.updateAssignmentList({outlineType:this.state.outlineType});
    this.updateLocationBar();
    this.forceUpdate();
  }

  updateAssignmentIndex({outlineType,assignmentId=this.assignmentObj.assignmentId}){
    this.assignmentIndex = 0;
    console.log(assignmentId)

    if (outlineType === "outline"){
      for (let [index,assignmentObj] of this.assignmentIdList.entries()){
        if (assignmentObj.assignmentId === assignmentId){
          this.assignmentIndex = index;
          break;
        }
      }

    }else if (outlineType === "assignment"){
      for (let [index,assignmentObj] of this.assignmentAssignedList.entries()){
        if (assignmentObj.assignmentId === assignmentId){
          this.assignmentIndex = index;
          break;
        }
      }
    }else if (outlineType === "due"){
      for (let [index,assignmentObj] of this.assignmentDueList.entries()){
        if (assignmentObj.assignmentId === assignmentId){
          this.assignmentIndex = index;
          break;
        }
      }
    }


  }

  creditUpdate({credit}){

    if (credit > this.assignmentObj.credit || !this.assignmentObj.credit){
      this.assignmentObj.credit = credit;
    }
    this.forceUpdate();
  }

  render() {

    //We have an error so doen't show the viewer
    if (this.state.error){

      return (<React.Fragment>
        <p style={{color: "red"}}>{this.state.error && this.state.error.toString()}</p>
        </React.Fragment>);
    }

    return (<React.Fragment>
      <div className="courseContainer">
        
        <DoenetHeader toolTitle="Course" headingTitle={this.courseName} />
        <div className="homeLeftNav">
          <div className="homeMainMenuItem" data-cy="overviewNavItem" onClick={() => {
            this.buildOverview();
            this.updateLocationBar({});
            this.forceUpdate();
          }}>{this.activeSection === "overview" ? "* " : null}Overview</div>
          <div className="homeMainMenuItem" data-cy="syllabusNavItem" onClick={() => {
            this.buildSyllabus();
            this.updateLocationBar({});
            this.forceUpdate();
          }}>{this.activeSection === "syllabus" ? "* " : null}Syllabus</div>
          <div className="homeMainMenuItem" data-cy="gradesNavItem" onClick={() => {
            this.buildGrades();
            this.updateLocationBar({});
            this.forceUpdate();
          }}>{this.activeSection === "grades" ? "* " : null}Grades</div>
          <div className="homeMainMenuItem" data-cy="assignmentsAccordion">
            <Accordion>
              <div label= "Assignments" >
                <div className="courseLeftNav">
                  <div style={{display:"flex",marginBottom:"10px"}}>
                    <select style={{fontSize:"16px",width:"320px"}}
                    value={this.state.outlineType} 
                    onChange={(e)=>{
                      this.updateAssignmentIndex({outlineType:e.target.value});
                      this.setState({outlineType:e.target.value});
                      this.updateAssignmentList({outlineType:e.target.value});
                    }}>
                      <option value="outline" >Course Outline</option>
                      <option value="assignment" >Assignment Date</option>
                      <option value="due" >Due Date</option>
                      </select>
                    <div style={{marginLeft:"10px"}}>
                      <button style={{width:"60px"}} disabled={disablePrev} onClick={() => this.handlePrev()}>Prev</button>
                      <button style={{width:"60px"}} disabled={disableNext} onClick={() => this.handleNext()}>Next</button>
                    </div>
                  </div>
                  { this.courseAssignmentChoiceList }
                </div>
              </div>
            </Accordion>    
        </div>
        </div>
        <div className="homeActiveSection">
          {this.mainSection}
        </div>
      </div>
      
    </React.Fragment>);

    let disablePrev = false;
    if (this.assignmentIndex === 0){disablePrev = true;}
    let disableNext = false;
    if (this.assignmentIndex === (this.assignmentIdList.length - 1)){disableNext = true;}
  }
}


class AccordionSection extends Component {

  onClick = () => {
    this.props.onClick(this.props.label);
  };

  render() {
    const {
      onClick,
      props: { isOpen, label },
    } = this;

    return (
      <div>
        <div onClick={onClick} style={{ cursor: 'pointer' }}>
          {label}
        </div>
        {isOpen && (
          <div
            style={{
              marginTop: 10,
            }}>
            {this.props.children}
          </div>
        )}
      </div>
    );
  }
}

class Accordion extends Component {

  constructor(props) {
    super(props);
    const openSections = {};
    this.state = { openSections };
  }

  onClick = label => {
    const {
      state: { openSections },
    } = this;

    const isOpen = !!openSections[label];

    this.setState({
      openSections: {
        [label]: !isOpen
      }
    });
  };

  render() {
    const {
      onClick,
      props: { children },
      state: { openSections },
    } = this;

    return (
      <div>
        <AccordionSection
          isOpen={!!openSections[children.props.label]}
          label={children.props.label}
          onClick={onClick}>
          {children.props.children}
        </AccordionSection>
      </div>
    );
  }
}

export default DoenetCourse;