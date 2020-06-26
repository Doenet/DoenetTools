import React, { Component } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;
import doenetImage from '../images/doenet.png';
import './home.css';
import DoenetViewer from './DoenetViewer';
import DoenetHeader from './DoenetHeader';



class DoenetHome extends Component {
  constructor(props){
    super(props);
    
    this.assignmentIndex = 0;
    this.loadingScreen = (<React.Fragment><p>Loading...</p></React.Fragment>);




    this.username = "";

    this.courseId = "aI8sK4vmEhC5sdeSP3vNW"; //Temporary TODO: Choose courses
    this.courseName = "Calculus and Dynamical Systems in Biology";
    this.gradeCategories = ['Gateway','Problem Sets','Projects','Exams','Participation'];

    let url_string = window.location.href;
    var url = new URL(url_string);
    // this.courseId = url.searchParams.get("courseId");
    // this.assignmentId = url.searchParams.get("assignmentId");

    this.activeSection = url.searchParams.get("active");

      const envUrl='/api/env.php';
      axios.get(envUrl)
        .then(resp=>{
            this.username = resp.data.user;
            this.access = resp.data.access;
            this.forceUpdate();
        });
      
      
    this.state = {
      error: null,
      errorInfo: null,
    };
    
    if (this.activeSection === null || this.activeSection === "overview"){
      this.buildOverview();
    }else if(this.activeSection === "syllabus"){
      this.buildSyllabus();
    }else if(this.activeSection === "grades"){
      this.buildGrades();
    }

      this.updateLocationBar = this.updateLocationBar.bind(this);
      this.buildAssignmentGrades = this.buildAssignmentGrades.bind(this);
      this.buildItemGrade = this.buildItemGrade.bind(this);
      this.buildAttemptItemGradesHelper = this.buildAttemptItemGradesHelper.bind(this);
  }

  updateLocationBar({assignmentId, activeSection=this.activeSection}){
    history.replaceState({},"title","?active="+activeSection);
  }

  buildOverview(){
    this.mainSection = this.loadingScreen;

    //talk to database to load fresh info
    this.overview = (<React.Fragment>
      <h2>Overview</h2>
    </React.Fragment>)

    this.mainSection = this.overview;
    this.activeSection = "overview";
  }

  buildSyllabus(){
    this.mainSection = this.loadingScreen;

    //talk to database to load fresh info
    this.overview = (<React.Fragment>
      <h2>Syllabus</h2>
    </React.Fragment>)

    this.mainSection = this.overview;
    this.activeSection = "syllabus";
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
      <h2>Grades</h2>
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
      
      
      axios.get(url,payload)
        .then(resp=>{
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

  render() {
  

     //We have an error so doen't show the viewer
     if (this.state.error){

      return (<React.Fragment>
        <p style={{color: "red"}}>{this.state.error && this.state.error.toString()}</p>
        </React.Fragment>);
    }


    return (<React.Fragment>

      <DoenetHeader toolName="Home" headingTitle="Test" />
      <div className="homeContainer">
        <div className="homeHeading">
        <img src={doenetImage} height='48px' />

        </div>
        <div className="homeTitle">
          <span style={{fontSize:"24px",marginTop:"10px"}}>{this.courseName}</span>
          <p>Home Page</p>
        </div>

        <div className="homeUsername">
        <div style={{textAlign:"center",marginTop:"6px",borderStyle: "solid",borderWidth: "1px", borderColor:"rgb(99, 154, 181)",width:"130px",borderRadius:"4px",cursor: "pointer"}} onClick={()=>alert('User Setting Feature Not Yet Available')}>
            <div style={{display:"inline-block"}}>{this.username}</div>
            </div>
            
        </div>

        
        <div className="homeLeftNav">
          <div className="homeMainMenuItem" onClick={() => {
            this.buildOverview();
            this.updateLocationBar({});
            this.forceUpdate();
          }}>{this.activeSection === "overview" ? "* " : null}Overview</div>
          <div className="homeMainMenuItem" onClick={() => {
            this.buildSyllabus();
            this.updateLocationBar({});
            this.forceUpdate();
          }}>{this.activeSection === "syllabus" ? "* " : null}Syllabus</div>
          <div className="homeMainMenuItem" onClick={() => {
            this.buildGrades();
            this.updateLocationBar({});
            this.forceUpdate();
          }}>{this.activeSection === "grades" ? "* " : null}Grades</div>
          <div className="homeMainMenuItem" onClick={() => {
            location.href = "/course/?courseId="+this.courseId;
          }}>Assignments</div>
        </div>
        <div className="homeActiveSection">
              {this.mainSection}
        </div>
      </div>
      
      </React.Fragment>);
  }
}

export default DoenetHome;
