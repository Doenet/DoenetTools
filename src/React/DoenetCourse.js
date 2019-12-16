import React, { Component } from 'react';
import DoenetViewer from '../React/DoenetViewer';
import axios from 'axios';
import './course.css';
import DoenetHeader from './DoenetHeader';
import query from '../queryParamFuncs';
import { faWindowClose, faEdit, faArrowUp,faArrowDown,faArrowLeft,faArrowRight,faPlus,faFolderPlus} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
//   Link,
//   useParams
// } from "react-router-dom";
import {
  HashRouter as Router, // TODO: try not to use HashRouter, user BrownserRouter instead
  // TODO: try to save data loaded
  useLocation,
  Switch,
  Route,
  Link,
  // Redirect,
} from "react-router-dom";
import queryString from 'query-string'
// import { useParams } from "react-router";
import '../imports/doenet.css'

function hashStringToInteger(s) {
  var hash = 0, i, chr;
  if (s.length === 0) return hash;
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

const COURSE_ID = "aI8sK4vmEhC5sdeSP3vNW"; //Temporary TODO: Choose courses
class Child extends Component {
  constructor(props) {
    super(props);
  }
  render(){
    let { id } = useParams();
    return (
      <div>
        <h3>ID: {id}</h3>
      </div>
    );
  }

  
}
class Overview extends Component {
  constructor(props) {
    super(props);
    this.doenetML = this.props.doenetML
    // this.mainSection=(<p>Loading</p>);
    // this.loadOverview = this.loadOverview.bind(this)
    // console.log("props.."+this.props.branchID)
    // this.loadOverview();
  }
  loadOverview(){
    console.log("loading overview")
    this.doenetML="";
    const phpUrl='/api/getDoenetML.php';
    const data={        
      branchId: this.props.branchID,
      contentId:"",
      ListOfContentId:"", //this is to store all contentID of one branchID for publish indication 
      List_Of_Recent_doenetML:[], // this is to store list of (date:doenetML) 
    }
    const payload = {
      params: data
    }
    axios.get(phpUrl,payload)
      .then(resp=>{
        let doenetML = resp.data.doenetML;
        this.updateNumber++;
        this.doenetML=doenetML;
        console.log("doenetML !!!")
        console.log(this.doenetML)
         this.forceUpdate();
      })
      .catch(error=>{this.setState({error:error})});
  }
  buildOverview(){
    this.mainSection = this.loadingScreen;
    //talk to database to load fresh info
    this.overview = (<div className="assignmentContent">
      {/* <h2 data-cy="sectionTitle">Overview</h2>  */}
      {this.doenetML!=""?
      
      <DoenetViewer
        key={"doenetviewer"}
        free={{doenetCode: this.doenetML}}
        course={true}
        attemptNumber={this.latestAttemptNumber}
        mode={{
          solutionType: "displayed",
          allowViewSolutionWithoutRoundTrip: false,
          showHints: false,
          showFeedback: true,
          showCorrectness: true,
          interactive: false,
        }}
      />:null}
    </div>)

    this.mainSection = this.overview;
  }
  render() {
    // this.buildOverview();
    // this.doenetML=""?this.loadOverview():console.log("ML exists")
    return (
    <div data-cy="overviewNavItem">
    <span className="Section-Text">new_Overview6</span>
    {this.doenetML!=""?   
      <DoenetViewer
        key={"doenetviewer"}
        free={{doenetCode: this.doenetML}}
        course={true}
        attemptNumber={this.latestAttemptNumber}
        mode={{
          solutionType: "displayed",
          allowViewSolutionWithoutRoundTrip: false,
          showHints: false,
          showFeedback: true,
          showCorrectness: true,
          interactive: false,
        }}
      />:null}
    </div>)
  }
}

class Syllabus extends Component {
  constructor(props) {
    super(props);
    this.doenetML = this.props.doenetML
    // this.mainSection=null;
    // this.loadSyllabus = this.loadSyllabus.bind(this)
    // this.loadSyllabus()
  }
  loadSyllabus(){
    this.doenetML="";
    const phpUrl='/api/getDoenetML.php';
    const data={        
      branchId: this.props.branchID,
      contentId:"",
      ListOfContentId:"", //this is to store all contentID of one branchID for publish indication 
      List_Of_Recent_doenetML:[], // this is to store list of (date:doenetML) 
    }
    const payload = {
      params: data
    }
    axios.get(phpUrl,payload)
      .then(resp=>{
        let doenetML = resp.data.doenetML;
        this.updateNumber++;
        this.doenetML=doenetML;
        // this.buildSyllabus()
        this.forceUpdate();
      })
      .catch(error=>{this.setState({error:error})});
  }

  buildSyllabus(){
    this.mainSection = this.loadingScreen;
    //talk to database to load fresh info
    this.syllabus = (<React.Fragment>
      {/* <h2 data-cy="sectionTitle">Syllabus</h2>  */}
      {this.doenetML!=""?
      <div><DoenetViewer
      key={"doenetviewer"}
      free={{doenetCode: this.doenetML}}
      course={true}
      attemptNumber={this.latestAttemptNumber}
      mode={{
        solutionType: "displayed",
        allowViewSolutionWithoutRoundTrip: false,
        showHints: false,
        showFeedback: true,
        showCorrectness: true,
        interactive: false,
      }}
    /></div>:null}   
    </React.Fragment>)

    this.mainSection = this.syllabus;
  }
  render() {
    // this.buildSyllabus();
    // this.doenetML=""?this.loadSyllabus():console.log("ML exists")
    return (
    <div data-cy="syllabusNavItem">
      <span className="Section-Text">new_Syllabus3</span>
      {this.doenetML!=""?
      
      <DoenetViewer
        key={"doenetviewer"}
        free={{doenetCode: this.doenetML}}
        course={true}
        attemptNumber={this.latestAttemptNumber}
        mode={{
          solutionType: "displayed",
          allowViewSolutionWithoutRoundTrip: false,
          showHints: false,
          showFeedback: true,
          showCorrectness: true,
          interactive: false,
        }}
      />:null}
            </div>
      )
  }
}

class Grades extends Component {
  constructor(props) {
    super(props);

    this.courseId = COURSE_ID // TODO: get from url
    this.scores = {};
    this.subTotals = {};
    this.gradeCategories = ['Gateway', 'Problem Sets', 'Projects', 'Exams', 'Participation'];

    this.state = {
      error: null,
      errorInfo: null,
      dataLoaded: false,
    }
  }

  componentDidMount() {
    const loadGradsUrl = '/api/loadGradsLearner.php';
    const data = {
      courseId: this.courseId,
    }
    const payload = {
      params: data
    }

    axios.get(loadGradsUrl, payload)
      .then(resp => {
        this.assignmentsData = resp.data.grades;
        this.student = resp.data.student;
        this.course = resp.data.course;
        this.section = resp.data.section;
        this.group = resp.data.group;
        this.buildGrades();
      })
      .catch(error => { this.setState({ error: error }) });
  }

  buildGrades() {

    this.total = { possible: 0, score: 0, percentage: '0%' }

    for (let gcat of this.gradeCategories) {
      this.scores[gcat] = [];
      this.subTotals[gcat] = { possible: 0, score: 0, percentage: '0%' };

      for (let dObj of this.assignmentsData) {
        if (dObj.gradeCategory === gcat) {
          let possible = dObj.totalPointsOrPercent;
          let percentFLAG = false;
          if (possible === null) {
            possible = '--';
            percentFLAG = true;
          } else {
            possible = Number(possible);
            this.subTotals[gcat].possible += possible;
          }
          let score = dObj.credit;
          if (score === null || possible === null) {
            score = '--';
            percentFLAG = true;
          } else {
            score = Number(score) * possible;
            if (!(isNaN(score))) {
              this.subTotals[gcat].score += score;
            }
          }
          let percentage;
          if (percentFLAG) {
            percentage = '--';
          } else {
            percentage = Math.round(score / possible * 1000) / 10 + '%';
          }

          if (isNaN(score)) {
            score = "--";
          }

          this.scores[gcat].push({
            gradeItem: dObj.assignmentName,
            assignmentId: dObj.assignmentId,
            possible: possible,
            score: score,
            percentage: percentage
          });
        }
      }

      if (this.subTotals[gcat].score > 0 && this.subTotals[gcat].possible > 0) {
        this.subTotals[gcat].percentage = Math.round(this.subTotals[gcat].score / this.subTotals[gcat].possible * 1000) / 10 + '%';
        this.total.score += Number(this.subTotals[gcat].score);
        this.total.possible += Number(this.subTotals[gcat].possible);
      }

    }
    this.total.percentage = '0%';
    if (!isNaN(this.total.score / this.total.possible * 1000) / 10) {
      this.total.percentage = Math.round(this.total.score / this.total.possible * 1000) / 10 + '%';
    }

    this.setState({ dataLoaded: true });
  }

  render() {
    if (!this.state.dataLoaded) {
      return (<p>Loading...</p>)
    }

    return (<React.Fragment>
      <h2 data-cy="sectionTitle">Grades</h2>
      <div style={{ marginLeft: "10px" }}>
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

          {this.gradeCategories.map(cat => (<React.Fragment key={'option' + cat}>

            <tr>
              <td className="typeHeadingRow" colSpan="4">{cat}</td>
            </tr>


            {this.scores[cat].map(
              (score) => (<React.Fragment key={'score_row' + score.assignmentId}>
                <tr className="typeDataRow">
                  <td><Link to={`/grades/assignment/?assignmentId=${score.assignmentId}`} className="assignmentLink">{score.gradeItem}</Link></td>
                  <td>{score.possible}</td>
                  <td>{score.score}</td>
                  <td>{score.percentage}</td>
                </tr>
              </React.Fragment>)
            )}

            <tr className="typeSubTotalDataRow">
              <td><span>Subtotal for {cat}</span></td>
              <td>{this.subTotals[cat].possible}</td>
              <td>{this.subTotals[cat].score}</td>
              <td>{this.subTotals[cat].percentage}</td>
            </tr>


          </React.Fragment>))}


          <tr className="colTotalRow">
            <td>Total</td>
            <td>{this.total.possible}</td>
            <td>{this.total.score}</td>
            <td>{this.total.percentage}</td>
          </tr>

        </tbody>
      </table>
    </React.Fragment>)
  }
}

class GradesAssignment extends Component {
  constructor(props) {
    super(props);
    this.assignment = this.props.assignment;
    this.assignmentId = query.getURLSearchParam('assignmentId');
  }

  componentDidMount() {
    const url = '/api/loadItemGrades.php';

    const data = {
      courseId: this.courseId,
      assignmentId: this.assignmentId,
    }
    const payload = {
      params: data
    }


    axios.get(url, payload)
      .then(resp => {
        this.assignmentItems = resp.data.assignmentItems;

        this.latestAttemptNumber = resp.data.attemptNumber;
        this.latestAttemptCredit = resp.data.attemptCredit;

        this.buildAssignmentGradesHelper();
      })
      .catch(error => { this.setState({ error: error }) });
  }

  buildAssignment() {
    this.latestAttemptPercentage = Math.round(Number(this.latestAttemptCredit) * 10000, 2) / 100;
    this.latestAttemptPercentage = `${this.latestAttemptPercentage}%`;
    for (var item of this.assignmentItems) {
      let percentage = Math.round(Number(item.credit) * 10000, 2) / 100;
      item.percentage = `${percentage}%`;
    }
    this.setState({ dataLoaded: true });
  }

  render() {
    if (!this.state.dataLoaded) {
      return (<p>Loading...</p>)
    }

    return (
      <React.Fragment>
        <Link to={`/grades`}> Grades &nbsp; </Link>
        <h2 style={{ marginLeft: "10px" }}>{this.assignment.gradeItem}</h2>
        {this.latestAttemptNumber > 1 ? <p style={{ marginLeft: "10px", fontSize: "16px" }}>Attempt Number: {this.latestAttemptNumber} </p> : null}

        <table id="grades" style={{ width: "400px" }}>
          <tbody>
            <tr className="colHeadingsRow">
              <th width="581">Grade item</th>
              <th width="95">Percentage</th>
            </tr>

            {this.assignmentItems.map(
              (item) => {
                return (<React.Fragment key={'assignmentItem' + item.title}>
                  <tr className="typeDataRow">
                    <td><Link to={`/grades/item/?assignmentId=${this.assignmentId}&itemNumber=${item.itemNumber}&latestAttemptNumber=${this.latestAttemptNumber}`} className="assignmentLink">{item.title}</Link></td>
                    <td>{item.percentage}</td>
                  </tr>
                </React.Fragment>)
              }
            )}


            {this.latestAttemptNumber > 1 ?
              <tr className="colTotalRow">
                <td>Total for attempt {this.latestAttemptNumber}</td>
                <td>{this.latestAttemptPercentage}</td>
              </tr>
              : null}

            <tr className="colTotalRow">
              <td>Total</td>
              <td>{this.assignment.percentage}</td>
            </tr>
          </tbody>
        </table>
      </React.Fragment>
    )
  }
}

class GradesItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataLoaded: false,
    }
  }

  componentDidMount() {
    const url = '/api/loadItemAttemptGrades.php';

    this.assignmentId = query.getURLSearchParam("assignmentId");
    this.itemNumber = query.getURLSearchParam("itemNumber");
    this.latestAttemptNumber = query.getURLSearchParam("latestAttemptNumber");

    const data = {
      assignmentId: this.assignmentId,
      itemNumber: this.itemNumber,
      attemptNumber: this.latestAttemptNumber,
    }
    const payload = {
      params: data
    }

    axios.get(url, payload)
      .then(resp => {
        this.itemTitle = `item ${this.itemNumber}`;
        this.itemState = resp.data.itemState;
        this.valid = resp.data.valid;
        this.setState({ dataLoaded: true });
      })
      .catch(error => { this.setState({ error: error }) });
  }

  render() {
    if (!this.state.dataLoaded) {
      return (<p>Loading...</p>)
    }

    if (!valid) { console.error("item is no longer valid"); return (<p>Error Loading Data.</p>) }

    return (<React.Fragment>
      <Link to={`/grades/`}>Back to grades</Link>
      <Link to={`/grades/assignment/?`}>Back to {this.assignmentId}</Link>
      <h2 style={{ marginLeft: "10px" }}>{this.assignmentId}: {this.itemTitle}</h2>
      {this.latestAttemptNumber > 1 ? <p style={{ marginLeft: "10px", fontSize: "16px" }}>Attempt Number: {this.latestAttemptNumber} </p> : null}

      <DoenetViewer
        key={"doenetviewer"}
        free={{
          doenetState: this.itemState,
        }}
        course={true}
        attemptNumber={this.latestAttemptNumber}
        mode={{
          solutionType: "displayed",
          allowViewSolutionWithoutRoundTrip: false,
          showHints: false,
          showFeedback: true,
          showCorrectness: true,
          interactive: false,
        }}
      />

    </React.Fragment>)
  }
}
class Assignments extends Component {
  constructor(props) {
    super(props);
    this.assignmentDoenetML = this.props.assignmentDoenetML
    console.log("RUNNING Assignments constructor")
    // console.log(this.assignmentDoenetML)
  }
  render() {
    return (
      <React.Fragment>
      <div data-cy="syllabusNavItem">
        <span className="Section-Text">Assignment is loading if not already here</span>
        {this.assignmentDoenetML!="" && this.assignmentDoenetML!=null?
        
        <DoenetViewer
          key={"doenetviewer"}
          free={{doenetCode: this.assignmentDoenetML}}
          course={true}
          attemptNumber={this.latestAttemptNumber}
          mode={{
            solutionType: "displayed",
            allowViewSolutionWithoutRoundTrip: false,
            showHints: false,
            showFeedback: true,
            showCorrectness: true,
            interactive: false,
          }}
        />:<p>Not yet available</p>}
              </div>
              </React.Fragment>
        )
  }
}
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
    this.activeSection = window.location.hash.substring(2);
    console.log("active section is "+this.activeSection)
    this.assignment_state_1 = url.searchParams.get("assignment"); // get false

    this.enableThese=[]
    this.alreadyLoadAssignment=[]
    this.loadFirstTrue=null; 
    this.trueList=[]
    this.assignmentTree = null;
    this.showsAllAssignment=false;
    this.alreadyMadeTree = false;
    this.LoadAssignmentFromTheBeginningFlag=false;
    this.assignmentDoenetML=""
    this.ListOfAlreadyDownLoadDoenetML={}  // {assignmentId:doenetML}
    this.overview_branchId=""
    this.syllabus_branchId=""
    this.selectedAssignmentId=""
    this.alreadyLoadOverview=false;
    this.Overview_doenetML = ""
    this.alreadyLoadSyllabus=false;
    this.Syllabus_doenetML = ""
    this.componentLoadedFromNavigationBar=null;
    this.state = {
      courseId: "",
      error: null,
      errorInfo: null,
      outlineType:"outline",
      overview:null,
      grade:null,
      assignment:null,
      syllabus:null,
      showTree:false,
      selectedAssignmentId:"",
    };


    this.assignmentsData = null;
    this.DoneLoading=false;
    /**
         * to construct a tree:
         * construct an array that contains objects 
         * (key is id with no pId, value is level, which is 0)
         * secondly,
         *  place pointer at first Id and find what id that it is a pId.
         *  level is value of first id +1. if found
         *  then add that right after the first Id with the current level
         *  when reach the end of this.arr_return, place pointer at second.
         * thirdly, we level is value of second id +1, it will find its children
         */

    // getting info for creating tree from DB
     this.result_arr=[];
    const url_header_assignment = "/api/getHeaderAndAssignmentInfo.php";
     this.arr_return=[];
     this.id_arr=[];
     this.assignmentName="";
     this.assignment_branchId = null;
     this.dueDate=null;
     this.assignedDate=null;
     this.numberOfAttemptsAllowed=null;

     this.AddedAssignmentObjArray = [ 
       // this contains contentIds NOT assignmentId,
      // assignmentId created 
       'T0XvjDItzSs_GXBixY8fa',
       'z3rOQm9o6XXjInAZrz6tV',
       'nwrAL9TIEup9ItRdqYhfR'       
      ]
     this.makeTreeArray=[]; // filled in buildTreeArray
     this.tree=[] // made in buildTree
     this.tree_route=[]
     this.alreadyMadeLink=[]
     this.headerId_arr = []
     this.assignmentId_arr=[]
     this.doenetML=""
      // this.buildTreeArray()
      // this.buildTree()
      this.obj_return={};
      this.heading_obj={};
      this.assignment_obj={};
      this.listOfAssignmentIdNeedDeletingFromDB = []
      this.enableMode='position'
    // axios (url_header_assignment)
    // // build and show tree
    //   .then (resp=>{
    //     this.obj_return = resp.data;
    //     let iterator=0;      
    //     let keys = (Object.keys(this.obj_return));
    //     let length = keys.length;
    //     while (iterator<length){
    //       let currentId = keys[iterator];
    //       let name = this.obj_return[currentId]['name'];
    //       let parent = this.obj_return[currentId]['parent']
    //       if (parent==null || parent=="null" || parent==""){
    //         parent=null;
    //       }
    //       let currentIdAttribute = this.obj_return[currentId]['attribute']
    //       if (currentIdAttribute==='header'){
    //         let assignmentId = this.obj_return[currentId]['headingId']
    //         let headingId = this.obj_return[currentId]['assignmentId']
    //         let childrenArray = this.obj_return[currentId]['childrenId'];
            
    //           childrenArray.forEach(element=>{
    //             if (element!=null && element!=""){
    //               let childAttribute = this.obj_return[element]['attribute']
    //               if (childAttribute==="header"){
    //                 headingId.push(element)
    //               } else {
    //                 assignmentId.push(element)
    //               }
    //             }               
    //           })
                                   
    //         this.heading_obj [currentId]={name:name,attribute:"header",parent:parent,headingId:headingId,assignmentId:assignmentId}
    //       } else {
    //         let contentId = this.obj_return[currentId]['contentId']
    //         let branchId = this.obj_return[currentId]['branchId']
    //         let assignedDate = this.obj_return[currentId]['assignedDate']
    //         let dueDate = this.obj_return[currentId]['dueDate']
    //         let numberOfAttemptsAllowed = this.obj_return[currentId]['numberOfAttemptsAllowed']
    //         this.assignment_obj [currentId]={name:name,attribute:"assignment",
    //         parent:parent,branchId:branchId,contentId:contentId,
    //         assignedDate:assignedDate,dueDate:dueDate,numberOfAttemptsAllowed:numberOfAttemptsAllowed
    //       }
    //       }
    //       iterator++;
    //     }
    //       this.buildTreeArray()
    //       this.buildTree()
    //       this.forceUpdate();
        
    //   }).catch(error=>{this.setState({error:error})});
      this.overview_link=null;
      this.syllabus_link=null;
      this.grade_link=null;
      this.assignment_link=null;




    

      const loadUrl = '/api/loadEnable.php'
      this.payLoad = {
        overview:0,
        syllabus:0,
        grade:0,
        assignment:0
      }
      let location = window.location.hash
      console.log("location is: ")
      console.log(location)
      axios.get(loadUrl,this.payLoad)
        .then (resp=>{
         
               //!!+ is to convert string to boolean
          // this.payLoad.overview=+(resp.data["overview"])
          // this.payLoad.grade=+(resp.data["grade"])
          // this.payLoad.syllabus=+(resp.data["syllabus"])
          // this.payLoad.assignment=+(resp.data["assignment"])
          this.overview_branchId=resp.data["overview_branchId"]
          this.syllabus_branchId=resp.data["syllabus_branchId"]
          // assignment_state =+(resp.data["assignment"])
          // this.enabledDisabledArray = {
          //   overview:!!+payLoad.overview,
          //   syllabus:!!+payLoad.grade,
          //   grade:!!+payLoad.syllabus,
          //   assignment:!!+payLoad.assignment,
          // }
          
          // this.state.overview=+(resp.data["overview"])
          // this.state.grade=+(resp.data["grade"])
          // this.state.syllabus=+(resp.data["syllabus"])
          // this.state.assignment=+(resp.data["assignment"])
          this.state.overview=+(resp.data["overview"])
          if (this.state.overview){
            this.trueList.push("overview")
          }
          this.state.syllabus=+(resp.data["syllabus"])
          if (this.state.syllabus){
            this.trueList.push("syllabus")
          }
          this.state.grade=+(resp.data["grade"])
          if (this.state.grade){
            this.trueList.push("grade")
          }
          this.state.assignment=+(resp.data["assignment"])
          if (this.state.assignment){
            this.trueList.push("assignments")
          }
          if (this.state.overview){
            this.overview_link = (<Link to={'/overview'} className="homeMainMenuItem" data-cy="overviewNavItem" onClick={()=>{this.activeSection="overview";this.loadSection();this.componentLoadedFromNavigationBar=null;this.forceUpdate()}}>{this.activeSection === "overview" ? "* " : null}Overview4</Link>)
          }
          if (this.state.syllabus){
            this.syllabus_link = (<Link to={'/syllabus'} className="homeMainMenuItem" data-cy="syllabusNavItem"onClick={()=>{this.activeSection="syllabus";this.loadSection();this.componentLoadedFromNavigationBar=null;this.forceUpdate()}}>{this.activeSection === "syllabus" ? "* " : null}Syllabus2</Link>
            )
          }
          if (this.state.grade){
            this.grade_link = (<Link to={'/grades'} className="homeMainMenuItem" data-cy="gradesNavItem"onClick={()=>{this.activeSection="grade";this.componentLoadedFromNavigationBar=null;this.loadSection()}}>{this.activeSection === "grades" ? "* " : null}Grades</Link>
            )
          }
          if (this.state.assignment){
            this.assignment_link = (<Link to={'/assignments'} className="homeMainMenuItem" data-cy="assignmentsNavItem"onClick={()=>{this.activeSection="assignments";this.showsAllAssignment=!this.showsAllAssignment;this.componentLoadedFromNavigationBar=null;this.makeTreeVisible({loadSpecificId:""})}}>{this.activeSection === "assignments" ? "* " : null}Assignments</Link>
            )
          }
          // let foundit=false
          // Object.keys(this.payLoad).map((e)=>{
          //       if (this.payLoad[e]===1 && this.activeSection===null ){
          //           this.activeSection=e
          //           // this.updateLocationBar()
          //           }
          //       })
          // // console.log(`The courseId id is ${this.courseId}`);
          // if (this.assignment_state_1===false){
          //   this.state.newChange=true;
          // }
          // this.DoneLoading=true;

          // if(this.activeSection==='overview'){
          //   this.loadOverview();
          // }else if(this.activeSection==='syllabus'){
          //   this.loadSyllabus();
          // } else if (this.activeSection==='grade'){
          //   this.loadGrades()
          // } 
          // this.forceUpdate()
          if (location=="#/" || location==""){
            if (this.trueList!=[]){
              this.activeSection=this.trueList[0]
            }
          }
          else if (location=="#/overview"){
            this.activeSection="overview"
          } else if (location=="#/syllabus"){
            this.activeSection="syllabus"
          } else if (location=="#/grade"){
            this.activeSection="grade"
          } else  {
            this.activeSection="assignments"
            this.LoadAssignmentFromTheBeginning({location:location})
          }
          this.loadSection()
        });
         
    this.courseInfo = {};
    this.finishedContructor = false;
 


    
      //Get code and mode from the database
    const loadOutlineUrl='/api/loadOutline.php';
    const data={
      courseId: this.courseId,
    }
    const payload = {
      params: data
    }

    


    this.updateNumber = 0;
    this.buildAssignmentGrades = this.buildAssignmentGrades.bind(this);
    this.buildItemGrade = this.buildItemGrade.bind(this);
    this.buildAttemptItemGradesHelper = this.buildAttemptItemGradesHelper.bind(this);
    // this.assignmentDataToCourseInfo = this.assignmentDataToCourseInfo.bind(this);
    this.loadGrades = this.loadGrades.bind(this);
    // this.EnableThese = this.EnableThese.bind(this);
    this.loadOverview = this.loadOverview.bind(this);
    this.buildTree = this.buildTree.bind(this);
    this.makeTreeVisible = this.makeTreeVisible.bind(this);
    // this.deleteHeader = this.deleteHeader.bind(this);
    // this.deleteAssignment = this.deleteAssignment.bind(this);
    // this.moveHeaderDown = this.moveHeaderDown.bind(this);
    // this.moveHeaderUp = this.moveHeaderUp.bind(this);
    // this.addAssignmentIdsUnderHeader = this.addAssignmentIdsUnderHeader.bind(this)
    // this.axiosDeleteAssignmentFromDB = this.axiosDeleteAssignmentFromDB.bind(this)
    // const values = queryString.parse(this.props.location)
    // console.log(this.props.location)
    // console.log(values.filter) // "top"
    // console.log(values.origin) // "im"
    const queryString = require('query-string');

    // console.log(location.search);
    // const parsed = queryString.parse(location.search);
    // console.log(parsed);
    // console.log(location.hash);
    // const parsedHash = queryString.parse(location.hash);
    
    // var parsed = queryString.parse(this.props.location.search);
    // console.log(parsed.param);
  }
  LoadAssignmentFromTheBeginning ({location}){
    console.log("LoadAssignmentFromTheBeginning")
    let path ="#/assignments/"
    let index = path.length
    if (location.length == (path.length+21)){
    // console.log(location.substring(index))
    let currentAssignmentId = location.substring(index)
    console.log(currentAssignmentId)
    this.LoadAssignmentFromTheBeginningFlag=true
    // TODO(me): add IF ASSIGNMENT CAN BE LOADED
    this.makeTreeVisible({loadSpecificId:currentAssignmentId})
    // this.loadAssignmentContent({contentId:null,branchId:null,assignmentId:currentAssignmentId})
    // console.log(assignmentDoenetML)
    // this.forceUpdate()
    }
  }
  buildTreeArray(){
    // first get pId that is null
    this.makeTreeArray=[]
    if (this.heading_obj.length!=1){

    // let assignmentObjectLength = this.assignmentId_arr.length;
    let iterator = 0;
    this.headerId_arr=[]
    let already_built_header_id = {}
    this.assignmentId_arr=[]
    this.makeTreeArray=[]
    // create a header_id_arr to access header_obj

    this.headerId_arr = Object.keys(this.heading_obj)
    let headerObjectLength = this.headerId_arr.length;

    iterator=0;
    this.assignmentId_arr = Object.keys(this.assignment_obj)

    iterator = 0;
    // establish level 0
    this.heading_obj["UltimateHeader"]["headingId"].forEach(element=>{
      element= element.toString()
      let name = this.heading_obj[element]["name"]
      let object = {id:element,name:name,attribute:"header",level:0}
      this.makeTreeArray.unshift(object)
    })

    // add header first, level = level's parent + 1
    iterator = 0;
     while (iterator < this.makeTreeArray.length){
      let currentHeaderObject = 
      this.heading_obj[this.makeTreeArray[iterator]["id"]];

      if (currentHeaderObject["headingId"]!=undefined){
        (currentHeaderObject["headingId"]).forEach(header=>{
          header = header.toString();
            let name = this.heading_obj[header]["name"];
            let attribute = "header"
            let newLevel = this.makeTreeArray[iterator]["level"]+1;
            let object = {id:header,name:name,attribute:attribute,level:newLevel}
            this.makeTreeArray.splice(iterator+1,0,object)
            already_built_header_id[header]=true;
          //}
        })
      }
      
      iterator++;
    }
   //add assignments
   // add arrow when this.enableMode==='assignment'
    iterator = 0;
    while (iterator < this.makeTreeArray.length){
      if (this.makeTreeArray[iterator]["attribute"]==="header"){
        let indexOfHeader = this.headerId_arr.indexOf(this.makeTreeArray[iterator]["id"])
        let currentHeaderObject = 
        this.heading_obj[this.makeTreeArray[iterator]["id"]];
      let assignment_list = currentHeaderObject["assignmentId"]
      if (assignment_list!=[]) {
      (assignment_list).forEach(e=>{
        // assume unique assignment has unique headers
          let name = this.assignment_obj[e.toString()]["name"];
          let newLevel = this.makeTreeArray[iterator]["level"]+1;
          let attribute = "assignment"
          let object1 = {id:e.toString(),name:name,attribute:attribute,level:newLevel}
          this.makeTreeArray.splice(iterator+1,0,object1)
      })
    }
      }
      iterator++;
    }
    }
    
  }
buildTree(){
  let ClassName = "headerSelection"
  let countChildrenOfUltimate=0
  let lengthChildrenOfUltimate=0
  // making space
  this.tree = [];
  this.tree_route = [];
  let addHeaderToTheEndOfUltimateHeader=(<span className="Section-Icon-Box">         
      <FontAwesomeIcon className="Section-Icon" 
       onClick ={()=>{this.addNewHeaderAtTheEndUltimateHeader()}} icon={faPlus}/></span>);
  let addingAssignmentArray = this.AddedAssignmentObjArray 
  if (this.makeTreeArray.length>0) {
    this.makeTreeArray.forEach((element,index)=>{
      let name = element["name"]
      let level = element["level"];
      let id = element["id"]; // id of either header or assignment
      let type = element ["attribute"]
      let headerParentId=null;
      if (type==='header'){
        headerParentId=this.heading_obj[id]['parent']
      }
      let leftMargin = `${level*20}px`;
      let contentID=null;
      let branchID=null;
      // making up, down Arrow
      if (type=="assignment") {
        let myParent = this.assignment_obj[id]['parent']
        ClassName = "AssignmentSelection"
        contentID = this.assignment_obj[id]['contentId']
        branchID = this.assignment_obj[id]['branchId']
        // branchID = this.assignment_obj[id]['branchId']
        // let myParentHeadingIdArray = this.heading_obj[myParent]['assignmentId']
      }
      let data_cy=type+index
      let styleAssignment={marginLeft:leftMargin,display:"flex"}
      if (this.selectedAssignmentId===id) {
        styleAssignment={marginLeft:leftMargin,display:"flex",backgroundColor: "#979B97"}
      }
      let link = "/assignments/"+id
      console.log("link is "+link)
      let tree_branch = 
      (
        <Link to={link} key={"tree_branch"+index} 
        data-cy={data_cy} className={ClassName} style={styleAssignment}
        onClick={()=>{this.loadAssignmentContent({contentId:contentID,branchId:branchID,assignmentId:id});this.forceUpdate()}}
        >
        <span className="Section-Text" >
            {name}
            </span>
             </Link>
      )
      this.tree.push(tree_branch)
      
      })
  } else {
     console.log("EMPTY TREE")
  }
}
makeTreeRoute ({link}) {
  // this.tree_route =[]
  if (!(this.alreadyMadeLink.includes(link))){
    let tree_route_branch = 
  (
    <Route key={link} exact path={link}>
     <Assignments assignmentDoenetML={this.assignmentDoenetML}/>
    </Route>
  )
  this.tree_route.push(tree_route_branch);
  this.alreadyMadeLink.push(link)
  }
  
}

loadAssignmentContent({contentId,branchId,assignmentId}) {
  this.assignmentDoenetML=""
  console.log("HERE running loadAssignmentContent")
  this.componentLoadedFromNavigationBar = null
  console.log(assignmentId in this.ListOfAlreadyDownLoadDoenetML)
  console.log(this.ListOfAlreadyDownLoadDoenetML)
  // given contentId, get me doenetML

    // if (contentId!=null && branchId!=null){   // get rid of this condition if things work w/o these 3 ids
      console.log("=======DOWNLOADING ASSIGNMENTS========")
    this.selectedAssignmentId = assignmentId
    this.assignmentName = this.assignment_obj[assignmentId]['name']
    this.assignment_branchId = this.assignment_obj[assignmentId]['branchId']
    this.dueDate = this.assignment_obj[assignmentId]['dueDate']
    this.assignedDate = this.assignment_obj[assignmentId]['assignedDate']
    this.numberOfAttemptsAllowed = this.assignment_obj[assignmentId]['numberOfAttemptsAllowed']
    contentId = this.assignment_obj[assignmentId]['contentId']
    branchId = this.assignment_obj[assignmentId]['branchId']
    const urlGetCode = '/api/getDoenetML.php';
    const data = {
      branchId:branchId,
      contentId:contentId
      // branchId: "9gBr0dW6tFqqA1UyLEBVD",
      // contentId: "268edfaf6999ea0182e6ac360854c7d739e35eccbb6384dd193b301de845b707",
    }
    const payload = {
      params: data
    }
    if (!(this.alreadyLoadAssignment.includes(assignmentId))){
      this.alreadyLoadAssignment.push(assignmentId)
      axios.get(urlGetCode,payload)
      .then(resp=>{
        let doenetML = resp.data.doenetML;
  
        this.updateNumber++;
        this.assignmentDoenetML=doenetML;
        this.ListOfAlreadyDownLoadDoenetML[assignmentId] = this.assignmentDoenetML
        console.log("DOENET ML !!")
          let link = "/assignments/"+assignmentId
          this.makeTreeRoute({link:link})
              if (this.LoadAssignmentFromTheBeginningFlag) {
                console.log("===LOADING ASSIGNMENT FROM URL===")
                this.componentLoadedFromNavigationBar=(<Assignments assignmentDoenetML={this.assignmentDoenetML}/>)
                this.LoadAssignmentFromTheBeginningFlag=false
              }
          this.forceUpdate();
      })
      .catch(error=>{this.setState({error:error})});
    }
    else {
      console.log("==ALREADY DOWNLOAD THAT ASSIGNMENT===")
    }
   
    //}
    
  // } 
}


  // updateLocationBar(assignmentId=this.assignmentId, activeSection=this.activeSection){
  //   console.log("inside updateLocationBar")
  //   history.replaceState({},"title","?active="+activeSection);
  //   if (assignmentId!=undefined && assignmentId!=null){
  //     assignmentId=assignmentId['assignmentId']
  //   }
  //   console.log(this.activeSection)
  //   if (this.activeSection === "assignment") {
  //     console.log("assignmentId in")
  //     console.log(assignmentId)
  //     history.replaceState({},"title","?active="+activeSection+"&assignmentId="+assignmentId);
  //   }
  //   this.buildTree()
  // }

  loadOverview(){
    console.log("loading OVERVIEW")
    console.log(this.overview_branchId)
    this.doenetML="";
    const phpUrl='/api/getDoenetML.php';
    const data={        
      branchId: this.overview_branchId,
      contentId:"",
      ListOfContentId:"", //this is to store all contentID of one branchID for publish indication 
      List_Of_Recent_doenetML:[], // this is to store list of (date:doenetML) 
    }
    const payload = {
      params: data
    }

      axios.get(phpUrl,payload)
      .then(resp=>{
        let doenetML = resp.data.doenetML;
        this.updateNumber++;
        this.doenetML=doenetML;
        this.Overview_doenetML=this.doenetML;
        this.alreadyLoadOverview=true
        console.log("doenetML!!!")
        this.loadFirstTrue=(this.Overview_doenetML!=""?<Overview doenetML={this.Overview_doenetML}/>:null)
        console.log(this.doenetML)
       // this.buildOverview();
         this.forceUpdate();
      })
      .catch(error=>{this.setState({error:error})});
    
    
  }

  buildOverview(){
    this.mainSection = this.loadingScreen;
    //talk to database to load fresh info
    this.overview = (<div className="assignmentContent">
      {/* <h2 data-cy="sectionTitle">Overview</h2>  */}
      {this.doenetML!=""?
      
      <DoenetViewer 
              key={"doenetviewer"+this.updateNumber} //each component has their own key, change the key will trick Reach to look for new component
              free={{doenetCode: this.Overview_doenetML}} 
              mode={{
                solutionType:this.state.solutionType,
                allowViewSolutionWithoutRoundTrip:this.state.allowViewSolutionWithoutRoundTrip,
                showHints:this.state.showHints,
                showFeedback:this.state.showFeedback,
                showCorrectness:this.state.showCorrectness,
              }}           
            />:null}
    </div>)

    this.mainSection = this.overview;
  }

  loadSyllabus(){
    console.log("loading SYLLABUS")
    this.doenetML="";

    const phpUrl='/api/getDoenetML.php';
    const data={        
      branchId: this.syllabus_branchId,
      contentId:"",
      ListOfContentId:"", //this is to store all contentID of one branchID for publish indication 
      List_Of_Recent_doenetML:[], // this is to store list of (date:doenetML) 
    }
    const payload = {
      params: data
    }

      axios.get(phpUrl,payload)
      .then(resp=>{
        let doenetML = resp.data.doenetML;

        this.updateNumber++;
        this.doenetML=doenetML;
        console.log("doenetML syllabus!!!")
        console.log(this.doenetML)
        
      this.Syllabus_doenetML=this.doenetML;
      this.alreadyLoadSyllabus = true
      this.loadFirstTrue=(<Syllabus doenetML={this.Syllabus_doenetML}/>)

        // this.buildSyllabus()
        this.forceUpdate();
      })
      .catch(error=>{this.setState({error:error})});
    
    
  }

  buildSyllabus(){
    this.mainSection = this.loadingScreen;

    //talk to database to load fresh info
    this.overview = (<React.Fragment>
      {/* <h2 data-cy="sectionTitle">Syllabus</h2>  */}
      {this.doenetML!=""?
      <div><DoenetViewer 
              key={"doenetviewer"+this.updateNumber} //each component has their own key, change the key will trick Reach to look for new component
              free={{doenetCode: this.Syllabus_doenetML}} 
              mode={{
                solutionType:this.state.solutionType,
                allowViewSolutionWithoutRoundTrip:this.state.allowViewSolutionWithoutRoundTrip,
                showHints:this.state.showHints,
                showFeedback:this.state.showFeedback,
                showCorrectness:this.state.showCorrectness,
              }}           
            /></div>:null}   
    </React.Fragment>)

    this.mainSection = this.overview;
  }

  //   // TODO: what assignment get un-publish ?

  loadGrades(){
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
          this.forceUpdate();
          
        })
        .catch(error=>{this.setState({error:error})});
  }
  
  buildGrades(){
    
    if (this.assignmentsData === null){
      this.mainSection = this.loadingScreen;
    }else{
      this.buildGradesHelper();
    }

    
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


  componentDidCatch(error, info){
    this.setState({error:error,errorInfo:info});
  }

  // creditUpdate({credit}){

  //   if (credit > this.assignmentObj.credit || !this.assignmentObj.credit){
  //     this.assignmentObj.credit = credit;
  //   }
  //   this.forceUpdate();
  // }
  loadSection(){
    console.log("active is "+this.activeSection)
    console.log("this.alreadyLoadOverview: "+this.alreadyLoadOverview)
    console.log("Overview code: "+this.Overview_doenetML)
    console.log("this.alreadyLoadSyllabus: "+this.alreadyLoadSyllabus)
    console.log("Syllabus code: "+this.Syllabus_doenetML)
    if (this.activeSection==="overview" && !this.alreadyLoadOverview){
      console.log("====MAKING====")
      this.loadOverview();
      // this.alreadyLoadOverview=true
    } else if (this.activeSection==="syllabus"&& !this.alreadyLoadSyllabus) {
      console.log("====MAKING====")
      this.loadSyllabus();
      // this.alreadyLoadSyllabus = true
    } else if (this.activeSection==="grade") {
      this.loadFirstTrue=(<Grades/>)
    } 
    else if (this.activeSection==="assignments") {
      this.loadFirstTrue=(<p>Select an assignments</p>)
    }
    else {
      console.log("====ALREADY MADE=====")
    }

  }
  makeTreeVisible({loadSpecificId}) {
    const url_header_assignment = "/api/getHeaderAndAssignmentInfo.php";
    if (!this.alreadyMadeTree){
      axios (url_header_assignment)
    .then (resp=>{
      console.log("RUNNING PHP")
      this.obj_return = resp.data;
      //let lengthOfReturnArray = (this.obj_return.length)
      console.log("obj is")
      console.log(resp.data)
      this.alreadyMadeTree=true;
      let iterator=0;      
      let keys = (Object.keys(this.obj_return));
      let length = keys.length;
      while (iterator<length){
        let currentId = keys[iterator];
        let name = this.obj_return[currentId]['name'];
        let parent = this.obj_return[currentId]['parent']
        if (parent==null || parent=="null" || parent==""){
          parent=null;
        }
        console.log("checking..")
        let currentIdAttribute = this.obj_return[currentId]['attribute']
        console.log(currentIdAttribute)
        if (currentIdAttribute==='header'){
          let assignmentId = this.obj_return[currentId]['headingId']
          let headingId = this.obj_return[currentId]['assignmentId']
          let childrenArray = this.obj_return[currentId]['childrenId'];
          
            childrenArray.forEach(element=>{
              if (element!=null && element!=""){
                let childAttribute = this.obj_return[element]['attribute']
                console.log("still checking..")
                console.log(childAttribute)
                if (childAttribute==="header"){
                  headingId.push(element)
                } else {
                  assignmentId.push(element)
                }
              }               
            })
                                 
          this.heading_obj [currentId]={name:name,attribute:"header",parent:parent,headingId:headingId,assignmentId:assignmentId}
        } else {
          let contentId = this.obj_return[currentId]['contentId']
          let branchId = this.obj_return[currentId]['branchId']
          let assignedDate = this.obj_return[currentId]['assignedDate']
          let dueDate = this.obj_return[currentId]['dueDate']
          let numberOfAttemptsAllowed = this.obj_return[currentId]['numberOfAttemptsAllowed']
          this.assignment_obj [currentId]={name:name,attribute:"assignment",
          parent:parent,branchId:branchId,contentId:contentId,
          assignedDate:assignedDate,dueDate:dueDate,numberOfAttemptsAllowed:numberOfAttemptsAllowed
        }
        }
        iterator++;
      }
        this.buildTreeArray()
        this.buildTree()
        this.assignmentTree = this.tree;
        if (this.LoadAssignmentFromTheBeginningFlag) {
        this.loadAssignmentContent({contentId:null,branchId:null,assignmentId:loadSpecificId})
        this.LoadAssignmentFromTheBeginningFlag=false
        }
      console.log("DONE LOOPING YES")
      console.log(this.assignmentTree)
      this.forceUpdate();
      
    }).catch(error=>{this.setState({error:error})});
    }
    
    
  }
  render() {
    console.log("====RENDER====");
    console.log(this.tree_route)
  
    return (
    <React.Fragment>
      <div className="courseContainer">
        
        <DoenetHeader toolTitle="Course" headingTitle={this.courseName} />
        <Router>
          <>
         {/* {this.activeSection==="overview"?this.loadOverview:this.loadSyllabus} */}
            <div className="homeLeftNav">
              {this.overview_link}
              {this.syllabus_link}
              {this.grade_link}
              {this.state.assignment?this.assignment_link:null}
              {/* <Link to={'/overview'} className="homeMainMenuItem" data-cy="overviewNavItem" onClick={()=>{this.activeSection="overview";this.loadSection();this.componentLoadedFromNavigationBar=null;this.forceUpdate()}}>{this.activeSection === "overview" ? "* " : null}Overview4</Link> */}
              {/* <Link to={'/syllabus'} className="homeMainMenuItem" data-cy="syllabusNavItem"onClick={()=>{this.activeSection="syllabus";this.loadSection();this.componentLoadedFromNavigationBar=null;this.forceUpdate()}}>{this.activeSection === "syllabus" ? "* " : null}Syllabus2</Link> */}
              {/* <Link to={'/grades'} className="homeMainMenuItem" data-cy="gradesNavItem"onClick={()=>{this.activeSection="grade";this.componentLoadedFromNavigationBar=null;this.loadSection()}}>{this.activeSection === "grades" ? "* " : null}Grades</Link> */}
              {/* <Link to={'/assignments'} className="homeMainMenuItem" data-cy="assignmentsNavItem"onClick={()=>{this.activeSection="assignments";this.showsAllAssignment=!this.showsAllAssignment;this.componentLoadedFromNavigationBar=null;this.makeTreeVisible({loadSpecificId:""})}}>{this.activeSection === "assignments" ? "* " : null}Assignments</Link> */}
              {this.assignmentTree}
            </div>
            <div className="homeActiveSection">
            {this.componentLoadedFromNavigationBar}
              <Switch>
                {/* <Route path="/:id" children={<Child />}> */}
                <Route key="overview" exact path="/overview">
                  {this.Overview_doenetML!=""?<Overview doenetML={this.Overview_doenetML}/>:null}
                </Route>
                <Route key="syllabus" exact path="/syllabus">
                {this.Syllabus_doenetML!=""?<Syllabus doenetML={this.Syllabus_doenetML}/>:null}             
                </Route>
                <Route key="grade" exact path="/grades">
                  <Grades />
                </Route>
                <Route key="/" exact path="/">
                {this.loadFirstTrue}
                {/* {this.Overview_doenetML!=""?<Overview doenetML={this.Overview_doenetML}/>:null} */}
                </Route>
                <Route key ="assignments" exact path='/assignments'>
                  <div>Select an Assignment</div>
                </Route>
                {/* TODO: ask kevin how to load the tree, treat each assignment as Route ? If so, how to do that */}
                {this.tree_route}
              </Switch>
              
            </div>
          </>
        </Router>
        {/* <div className="homeLeftNav">
          {overview_component}
          {syllabus_component}
          {grade_component}
          {this.state.assignment?ModifyTreeInsertAssignmentHeadingModeComponent:null}
          {this.state.assignment?tree_component:null}
          
        <select style={{marginTop:"10px"}} onChange={this.EnableThese}>
          <option>Enable Section</option>
          {this.enableThese }
        </select>
        </div> */}

        {/* <div className="homeActiveSection">
          {this.mainSection}
        </div>
        <div className="info">
        <span className="Section-Icon-Box">         
        <FontAwesomeIcon className="Section-Icon" onClick={()=>window.location.href="/editor/?branchId="+this.assignment_branchId} icon={faEdit}/></span>
          <p>Assignment Name: {this.assignmentName?this.assignmentName:"not yet assigned"}</p>
          <p>Due Date: {this.dueDate?this.dueDate:"not yet assigned"}</p>
          <p>assigned Date: {this.assignedDate?this.assignedDate:"not yet assigned"}</p>
          <p>number Of Attempts Allowed: {this.numberOfAttemptsAllowed?this.numberOfAttemptsAllowed:"not yet assigned"}</p>
        </div> */}
      </div>
      
    </React.Fragment>);
  }
}
// class DoenetCourse extends Component {
//   constructor(props) {
//     super(props);

//     this.assignmentIndex = 0;
//     this.loadingScreen = (<React.Fragment><p>Loading...</p></React.Fragment>);

//     const envurl = '/api/env.php';
//     axios.get(envurl)
//       .then(resp => {
//         this.username = resp.data.user;
//         this.access = resp.data.access;
//         this.forceUpdate();
//       });


//     let url_string = window.location.href;
//     var url = new URL(url_string);

//     this.username = "";
//     this.courseId = "aI8sK4vmEhC5sdeSP3vNW"; //Temporary TODO: Choose courses
//     this.courseName = "Calculus and Dynamical Systems in Biology";
//     this.assignmentId = url.searchParams.get("assignmentId");
//     this.mode = url.searchParams.get("mode");
//     this.activeSection = url.searchParams.get("active");
//     //Temporary not use params
//     this.mode = "preview"; //Temp
//     console.log(`The courseId id is ${this.courseId}`);
//     this.courseInfo = {};
//     this.finishedContructor = false;

//     let code = "";

//     //Get code and mode from the database
//     const loadOutlineUrl = '/api/loadOutline.php';
//     const data = {
//       courseId: this.courseId,
//     }
//     const payload = {
//       params: data
//     }
//     console.log("data");
//     console.log(data);

//     axios.get(loadOutlineUrl, payload)
//       .then(resp => {
//         console.log(resp.data);
//         this.finishContruction({ data: resp.data });
//         this.setState({ assignmentIndex: this.assignmentIndex, code: this.assignmentIdList[this.assignmentIndex].code });
//         if (this.activeSection === "assignments") {
//           this.loadAssignment({ assignmentId: this.assignmentId });
//           this.buildAssignment();
//         }
//       });

//     this.state = {
//       courseId: "",
//       error: null,
//       errorInfo: null,
//       outlineType: "outline",
//     };

//     //detect forward or back browser buttons
//     // window.onpopstate = function(e){
//     //   // alert(`${document.location} ${JSON.stringify(e.state)}`);
//     //   // this.loadAssignment({assignmentInfo:e.state.assignmentId})
//     // }.bind(this);
//     if (this.activeSection === "assignments") {
//       this.mainSection = this.loadingScreen;
//       // wait for completion of finishConstruction then buildAssignment
//     }

//     this.updateNumber = 0;
//     this.updateLocationBar = this.updateLocationBar.bind(this);
//     this.assignmentDataToCourseInfo = this.assignmentDataToCourseInfo.bind(this);
//     this.buildOutline = this.buildOutline.bind(this);
//     this.buildAssignmentArray = this.buildAssignmentArray.bind(this);
//     this.loadAssignment = this.loadAssignment.bind(this);
//     this.finishContruction = this.finishContruction.bind(this);
//     this.handlePrev = this.handlePrev.bind(this);
//     this.handleNext = this.handleNext.bind(this);
//     this.buildAssignmentList = this.buildAssignmentList.bind(this);
//     this.setAssignmentObj = this.setAssignmentObj.bind(this);
//     this.generateNewAttempt = this.generateNewAttempt.bind(this);
//     this.creditUpdate = this.creditUpdate.bind(this);
//     this.buildAssignment = this.buildAssignment.bind(this);
//     this.updateAssignmentList = this.updateAssignmentList.bind(this);
//   }

//   // updateLocationBar({assignmentId, activeSection=this.activeSection}){
//   //   history.replaceState({},"title","?active="+activeSection);
//   //   if (this.activeSection === "assignment")
//   //     history.replaceState({assignmentId:this.assignmentObj.assignmentId},"title","?assignmentId="+this.assignmentObj.assignmentId);
//   // }

//   updateLocationBar(assignmentId = this.assignmentId, activeSection = this.activeSection) {
//     history.replaceState({}, "title", "?active=" + activeSection);
//     if (this.activeSection === "assignments") {
//       console.log(this.assignmentId);
//       history.replaceState({}, "title", "?active=" + activeSection + "&assignmentId=" + assignmentId);
//     }
//   }

//   buildAssignment() {
//     this.mainSection = this.loadingScreen;
//     this.activeSection = "assignments";

//     if (this.mode === "") { return null; }
//     if (this.finishedContructor === false) { return null; }

//     let disablePrev = false;
//     if (this.assignmentIndex === 0) { disablePrev = true; }
//     let disableNext = false;
//     if (this.assignmentIndex === (this.assignmentIdList.length - 1)) { disableNext = true; }

//     console.log("-----------this.assignmentObj-------------");

//     console.log(this.assignmentObj);

//     let solutionType = "button";
//     if (Number(this.assignmentObj.showSolution) === 0) {
//       solutionType = "none";
//     }
//     let showHints = true;
//     if (Number(this.assignmentObj.showHints) === 0) {
//       showHints = false;
//     }
//     let showFeedback = true;
//     if (Number(this.assignmentObj.showFeedback) === 0) {
//       showFeedback = false;
//     }
//     let showCorrectness = true;
//     if (Number(this.assignmentObj.showCorrectness) === 0) {
//       showCorrectness = false;
//     }

//     this.assignmentFragment = <React.Fragment>
//       <div className="assignmentContainer">
//         <div className="assignmentActivity">
//           <DoenetViewer
//             key={"doenetviewer" + this.updateNumber}
//             free={{
//               doenetCode: this.assignmentObj.code,
//               doenetState: this.assignmentObj.latestDocumentState,
//               requestedVariant: { index: this.assignmentObj.assignedVariant },
//             }}
//             assignmentId={this.assignmentObj.assignmentId}
//             creditUpdate={this.creditUpdate}
//             attemptNumber={this.assignmentObj.attemptNumber}
//             mode={{
//               solutionType: solutionType,
//               allowViewSolutionWithoutRoundTrip: false,
//               showHints,
//               showFeedback,
//               showCorrectness,
//             }}
//             course={true}
//           />
//         </div>
//       </div>
//     </React.Fragment>;

//     this.mainSection = this.assignmentFragment;
//     this.updateLocationBar(this.assignmentObj.assignmentId);
//     this.forceUpdate();
//   }

//   setAssignmentObj({ outlineType }) {
//     if (outlineType === "outline") {
//       this.assignmentObj = this.assignmentIdList[this.assignmentIndex];
//     } else if (outlineType === "assignment") {
//       this.assignmentObj = this.assignmentAssignedList[this.assignmentIndex];
//     } else if (outlineType === "due") {
//       this.assignmentObj = this.assignmentDueList[this.assignmentIndex];
//     }
//   }

//   finishContruction({ data }) {

//     this.courseAssignmentChoiceList = [];
//     this.assignmentDataToCourseInfo({ courseId: this.courseId, data: data });

//     this.assignmentIdList = [];
//     this.buildAssignmentArray({ courseId: this.courseId, assignmentId: this.assignmentId });
//     this.assignmentAssignedList = [...this.assignmentIdList];
//     this.assignmentAssignedList.sort(
//       (a, b) => {
//         return new Date(a.assignedDate) - new Date(b.assignedDate)
//       }
//     );
//     this.assignmentDueList = [...this.assignmentIdList];
//     this.assignmentDueList.sort(
//       (a, b) => {
//         return new Date(a.dueDate) - new Date(b.dueDate)
//       }
//     );

//     // let outlineType = "outline";
//     // this.setAssignmentObj({ outlineType: outlineType });
//     // this.resolveVariant({ outlineType: outlineType });

//     if (this.state.outlineType === "outline") {
//       this.buildOutline({ courseId: this.courseId });
//     } else if (this.state.outlineType === "assignment") {
//       this.buildAssignmentList({ courseId: this.courseId });
//     } else {
//       this.buildDueList();
//     }

//     this.finishedContructor = true;

//     // console.log("END OF CONSTRUCTION");
//     // console.log(this.assignmentIdList);
//     // console.log(this.assignmentIdList[this.assignmentIndex].code);
//     // this.setState({code:this.assignmentIdList[this.assignmentIndex].code});
//   }

//   updateAssignmentList({ outlineType }) {
//     if (outlineType === "outline") {
//       this.buildOutline({ courseId: this.courseId });
//     } else if (outlineType === "assignment") {
//       this.buildAssignmentList({ courseId: this.courseId });
//     } else {
//       this.buildDueList();
//     }
//   }

//   resolveVariant({ outlineType }) {

//     if (this.assignmentObj.assignedVariant === undefined || this.assignmentObj.assignedVariant === null) {
//       this.assignmentObj.attemptNumber = 1;

//       if (Number(this.assignmentObj.multipleAttempts) === 1) {

//         //VariantIndex is the same offline and online
//         this.assignmentObj.assignedVariant = this.variantNumberFromAttemptNumber();
//       } else {
//         this.assignmentObj.assignedVariant = 0;
//       }


//       //Save assignedVariant to DB
//       const url = '/api/saveVariant.php';
//       const data = {
//         assignmentId: this.assignmentObj.assignmentId,
//         assignedVariant: this.assignmentObj.assignedVariant,
//         attemptNumber: this.assignmentObj.attemptNumber,
//         contentId: this.assignmentObj.contentId,
//       }
//       const payload = {
//         params: data
//       }
//       console.log("saveVariant data");
//       console.log(data);


//       axios.get(url, payload)
//         .then(resp => {
//           console.log(resp.data);
//         });

//     }


//   }

//   variantNumberFromAttemptNumber() {
//     let preseed = this.assignmentObj.attemptNumber + this.assignmentObj.assignmentId
//     if (Number(this.assignmentObj.individualize) === 1) {
//       preseed += this.username;
//     }
//     let seed = hashStringToInteger(preseed);

//     let rng = new MersenneTwister(seed);
//     let randomNumber = rng.random();
//     return Math.floor(randomNumber * 1000000000);
//   }

//   assignmentDataToCourseInfo({ courseId, data }) {

//     this.courseInfo[courseId] = {};
//     this.courseInfo[courseId].heading = {};
//     let parentHeadingIds = [];

//     let prevLoopLevel = 1;
//     let potentialParentHeadingId = "";
//     for (let i = 0; i < data.headingText.length; i++) {

//       let headingText = data.headingText[i];
//       let headingLevel = data.headingLevel[i];
//       let headingId = data.headingId[i];
//       if (prevLoopLevel < headingLevel) {
//         if (potentialParentHeadingId !== "") {
//           parentHeadingIds.push(potentialParentHeadingId);
//         }
//       } else if (prevLoopLevel > headingLevel) {
//         for (var x = 0; x < (prevLoopLevel - headingLevel); x++) {
//           parentHeadingIds.pop();
//         }
//       }


//       let baseObj = this.courseInfo[courseId];
//       for (let headingId of parentHeadingIds) {
//         baseObj = baseObj.heading[headingId];
//       }

//       if (baseObj.headingsOrder === undefined) {
//         baseObj.headingsOrder = [];
//         baseObj.heading = {};
//       }

//       // Add the heading information to the base object
//       baseObj.headingsOrder.push({
//         courseHeadingId: headingId,
//         headingText: headingText,
//       });
//       baseObj.heading[headingId] = {};
//       if (data.assignments[headingId] !== undefined) {
//         baseObj.heading[headingId].assignmentOrder = [];
//         baseObj.heading[headingId].assignments = {};
//         for (let assignmentInfo of data.assignments[headingId]) {
//           baseObj.heading[headingId].assignmentOrder.push(assignmentInfo.assignmentId);


//           baseObj.heading[headingId].assignments[assignmentInfo.assignmentId] = {
//             documentName: assignmentInfo.assignmentName,
//             code: assignmentInfo.doenetML,
//             latestDocumentState: assignmentInfo.latestDocumentState,
//             docTags: [],
//             contentId: assignmentInfo.contentId,
//             sourceBranchId: assignmentInfo.sourceBranchId,
//             dueDate: assignmentInfo.dueDate,
//             assignedDate: assignmentInfo.assignedDate,
//             individualize: assignmentInfo.individualize,
//             multipleAttempts: assignmentInfo.multipleAttempts,
//             showSolution: assignmentInfo.showSolution,
//             showFeedback: assignmentInfo.showFeedback,
//             showHints: assignmentInfo.showHints,
//             showCorrectness: assignmentInfo.showCorrectness,
//             proctorMakesAvailable: assignmentInfo.proctorMakesAvailable,
//             dueDateOverride: assignmentInfo.dueDateOverride,
//             timeLimitOverride: assignmentInfo.timeLimitOverride,
//             numberOfAttemptsAllowedOverride: assignmentInfo.numberOfAttemptsAllowedOverride,
//             attemptNumber: assignmentInfo.attemptNumber,
//             assignedVariant: assignmentInfo.assignedVariant,
//             generatedVariant: assignmentInfo.generatedVariant,
//             totalPointsOrPercent: assignmentInfo.totalPointsOrPercent,
//             credit: assignmentInfo.credit,
//             proctorMakesAvailable: assignmentInfo.proctorMakesAvailable,


//           };


//         }

//       }


//       prevLoopLevel = headingLevel;
//       potentialParentHeadingId = headingId;
//     }

//   }

//   componentDidCatch(error, info) {
//     this.setState({ error: error, errorInfo: info });
//   }

//   buildAssignmentArray({ courseId, headingIdArray = [], assignmentIndex = -1, assignmentId = this.assignmentObj.assignmentId }) {

//     let baseObj = this.courseInfo[courseId];
//     //Adjust the baseObj so it is at the current heading level
//     for (let headingId of headingIdArray) {
//       baseObj = baseObj.heading[headingId];
//     }

//     if (baseObj.assignmentOrder !== undefined) {
//       for (let baseObjAssignmentId of baseObj.assignmentOrder) {

//         // let assignmentInfo = Object.assign({},baseObj.assignments[assignmentId]);
//         let assignmentInfo = baseObj.assignments[baseObjAssignmentId];
//         assignmentInfo.assignmentId = baseObjAssignmentId;


//         this.assignmentIdList.push(assignmentInfo);
//         assignmentIndex++;
//         if (baseObjAssignmentId === assignmentId) {
//           this.assignmentIndex = assignmentIndex;
//         }
//       }
//     }


//     if (baseObj.headingsOrder !== undefined) {
//       for (let [index, headingObj] of baseObj.headingsOrder.entries()) {
//         let headingId = headingObj.courseHeadingId;

//         let nextLevelHeadingIdArray = []; //break the association for recursion
//         for (let headingId of headingIdArray) {
//           nextLevelHeadingIdArray.push(headingId);
//         }
//         nextLevelHeadingIdArray.push(headingId);
//         assignmentIndex = this.buildAssignmentArray({ courseId: courseId, headingIdArray: nextLevelHeadingIdArray, assignmentIndex: assignmentIndex, assignmentId: assignmentId });
//       }
//     }
//     return assignmentIndex;
//   }

//   buildAssignmentList({ courseId }) {

//     this.courseAssignmentChoiceList = [];

//     for (let [index, assignmentObj] of this.assignmentAssignedList.entries()) {
//       if (index === this.assignmentIndex) {
//         let selectedAssignment = this.buildSelectedAssignment({ assignmentObj: assignmentObj });
//         this.courseAssignmentChoiceList.push(selectedAssignment);
//         this.assignmentIndex = index;
//       } else {
//         this.courseAssignmentChoiceList.push(
//           <div
//             style={{ margins: "10px", height: "30px" }}
//             key={'assignmentList' + assignmentObj.assignmentId}
//             onClick={() => { this.loadAssignment({ assignmentId: assignmentObj.assignmentId }) }}
//           >{assignmentObj.documentName}</div>
//         )
//       }

//     }

//   }

//   buildDueList() {

//     this.courseAssignmentChoiceList = [];

//     for (let [index, assignmentObj] of this.assignmentDueList.entries()) {
//       if (index === this.assignmentIndex) {
//         let selectedAssignment = this.buildSelectedAssignment({ assignmentObj: assignmentObj });
//         this.courseAssignmentChoiceList.push(selectedAssignment);
//         this.assignmentIndex = index;
//       } else {
//         this.courseAssignmentChoiceList.push(
//           <div
//             style={{ margins: "10px", height: "30px" }}
//             key={'assignmentList' + assignmentObj.assignmentId}
//             onClick={() => { this.loadAssignment({ assignmentId: assignmentObj.assignmentId }) }}
//           >{assignmentObj.documentName}</div>
//         )
//       }
//     }
//   }

//   generateNewAttempt() {
//     this.assignmentObj.attemptNumber++;
//     this.assignmentObj.assignedVariant = this.variantNumberFromAttemptNumber();
//     this.assignmentObj.latestDocumentState = null;
//     this.updateNumber++;
//     //Save attempt number to database
//     //Save assignedVariant to DB
//     const url = '/api/saveVariant.php';
//     const data = {
//       assignmentId: this.assignmentObj.assignmentId,
//       assignedVariant: this.assignmentObj.assignedVariant,
//       attemptNumber: this.assignmentObj.attemptNumber,
//       contentId: this.assignmentObj.contentId,
//     }
//     const payload = {
//       params: data
//     }
//     console.log("saveVariant on Generate New Attempt data");
//     console.log(data);


//     axios.get(url, payload)
//       .then(resp => {
//         console.log(resp.data);
//       });

//     this.forceUpdate();
//   }

//   buildSelectedAssignment() {


//     let available = "null";
//     if (this.assignmentObj.assignedDate !== null) {
//       available = this.assignmentObj.assignedDate.toLocaleString("en-US");
//     }
//     let due = "null";
//     if (this.assignmentObj.dueDate !== null) {
//       due = this.assignmentObj.dueDate.toLocaleString("en-US");
//     }

//     let newAttemptElements = null;
//     let adjustment = 0;


//     // console.log("this.assignmentObj multipleAttempts");
//     // console.log(this.assignmentObj);
//     // console.log(this.assignmentObj.multipleAttempts);

//     if (Number(this.assignmentObj.multipleAttempts) === 1) {
//       adjustment = adjustment + 40;
//       newAttemptElements = (<React.Fragment>
//         <div>Attempt Number: {this.assignmentObj.attemptNumber}</div>
//         <button style={{ marginTop: "4px" }} onClick={() => {
//           this.generateNewAttempt();
//         }}>Generate New Attempt</button>
//       </React.Fragment>);
//     }

//     let gradeLinkElement = null;
//     if (this.assignmentObj.totalPointsOrPercent) {
//       adjustment = adjustment + 20;
//       let percentText = 0;
//       if (this.assignmentObj.credit) {
//         percentText = Math.round(this.assignmentObj.credit * 1000) / 10;
//       }
//       gradeLinkElement = (<React.Fragment>
//         <div style={{ cursor: "pointer" }} onClick={() => {
//           location.href = "/course/?active=grades&assignmentId=" + this.assignmentObj.assignmentId;
//         }}>Credit: {percentText}%</div>
//       </React.Fragment>)
//     }

//     let heightOfOutsideBox = 110 + adjustment + "px";

//     return (<React.Fragment key={`selected ${this.assignmentObj.assignmentId}`}>
//       <div style={{ margins: "10px", height: heightOfOutsideBox, backgroundColor: "#cce2ff" }} onClick={this.buildAssignment}>
//         <div style={{ textAlign: "center", backgroundColor: "grey" }} >
//           <div style={{ display: "inline-block", fontWeight: "bold", fontSize: "16px" }}>{this.assignmentObj.documentName}</div>
//         </div>
//         <div>Available</div>
//         <div> {available}</div>
//         <div>Due</div>
//         <div> {due}</div>
//         {gradeLinkElement}
//         {newAttemptElements}
//       </div>
//     </React.Fragment>
//     );
//   }

//   buildOutline({ courseId, headingIdArray = [] }) {
//     //Initialize the array before building
//     if (headingIdArray.length === 0) {
//       this.courseAssignmentChoiceList = [];
//     }
//     let indentPx = "20";
//     let baseObj = this.courseInfo[courseId];
//     //Adjust the baseObj so it is at the current heading level
//     for (let headingId of headingIdArray) {
//       baseObj = baseObj.heading[headingId];
//     }

//     if (baseObj.headingsOrder !== undefined) {
//       let headingIndent = headingIdArray.length * Number(indentPx);
//       for (let [index, headingObj] of baseObj.headingsOrder.entries()) {
//         let headingId = headingObj.courseHeadingId;
//         let headingText = headingObj.headingText;

//         var assignmentList = [];
//         let headingInfo = baseObj.heading[headingId];


//         if (headingInfo.assignmentOrder !== undefined) {

//           for (let assignmentId of headingInfo.assignmentOrder) {
//             let assignmentObj = headingInfo.assignments[assignmentId];

//             if (this.assignmentObj.assignmentId === assignmentId) {
//               let selectedObj = this.buildSelectedAssignment();
//               assignmentList.push(selectedObj);
//             } else {
//               assignmentList.push(
//                 <div
//                   style={{ marginLeft: headingIndent + "px", minWidth: "160px" }}
//                   key={'assignmentList' + assignmentId}
//                   onClick={() => { this.loadAssignment({ assignmentId: assignmentId }) }}
//                 >{assignmentObj.documentName}</div>
//               )
//             }

//           }
//         }

//         this.courseAssignmentChoiceList.push(
//           <React.Fragment key={"outline" + headingObj.courseHeadingId}>
//             <div style={{ marginLeft: headingIndent + "px", fontWeight: "bold", minWidth: "160px" }}>{headingText}</div>
//             {assignmentList}
//           </React.Fragment>
//         );

//         let nextLevelHeadingIdArray = []; //break the association for recursion
//         for (let headingId of headingIdArray) {
//           nextLevelHeadingIdArray.push(headingId);
//         }
//         nextLevelHeadingIdArray.push(headingId);
//         this.buildOutline({ courseId: courseId, headingIdArray: nextLevelHeadingIdArray });

//       }
//     }


//   }

//   // loadAssignment({ assignmentId, outlineType = this.state.outlineType }) {
//   //   this.updateAssignmentIndex({ outlineType: outlineType, assignmentId: assignmentId });
//   //   this.courseOutlineList = [];
//   //   this.updateNumber++;
//   //   this.assignmentId = assignmentId;
//   //   this.setAssignmentObj({ outlineType: this.state.outlineType });
//   //   this.resolveVariant({ outlineType: this.state.outlineType });
//   //   this.updateAssignmentList({ outlineType: this.state.outlineType });
//   //   this.updateLocationBar();
//   //   this.forceUpdate();
//   // }

//   // handlePrev() {
//   //   if (this.assignmentIndex > 0) this.assignmentIndex = this.assignmentIndex - 1;
//   //   this.courseOutlineList = [];
//   //   this.updateNumber++;
//   //   this.setAssignmentObj({ outlineType: this.state.outlineType });
//   //   this.resolveVariant({ outlineType: this.state.outlineType });
//   //   this.updateAssignmentList({ outlineType: this.state.outlineType });
//   //   this.updateLocationBar();
//   //   this.forceUpdate();
//   // }

//   // handleNext() {
//   //   if (this.assignmentIndex < this.assignmentIdList.length - 1) this.assignmentIndex = this.assignmentIndex + 1;
//   //   console.log(this.assignmentIndex);
//   //   console.log(this.assignmentIdList.length);
//   //   this.courseOutlineList = [];
//   //   this.updateNumber++;
//   //   this.setAssignmentObj({ outlineType: this.state.outlineType });
//   //   this.resolveVariant({ outlineType: this.state.outlineType });
//   //   this.updateAssignmentList({ outlineType: this.state.outlineType });
//   //   this.updateLocationBar();
//   //   this.forceUpdate();
//   // }

//   // updateAssignmentIndex({ outlineType, assignmentId = this.assignmentObj.assignmentId }) {
//   //   this.assignmentIndex = 0;
//   //   console.log(assignmentId)

//   //   if (outlineType === "outline") {
//   //     for (let [index, assignmentObj] of this.assignmentIdList.entries()) {
//   //       if (assignmentObj.assignmentId === assignmentId) {
//   //         this.assignmentIndex = index;
//   //         break;
//   //       }
//   //     }

//   //   } else if (outlineType === "assignment") {
//   //     for (let [index, assignmentObj] of this.assignmentAssignedList.entries()) {
//   //       if (assignmentObj.assignmentId === assignmentId) {
//   //         this.assignmentIndex = index;
//   //         break;
//   //       }
//   //     }
//   //   } else if (outlineType === "due") {
//   //     for (let [index, assignmentObj] of this.assignmentDueList.entries()) {
//   //       if (assignmentObj.assignmentId === assignmentId) {
//   //         this.assignmentIndex = index;
//   //         break;
//   //       }
//   //     }
//   //   }


//   // }

//   creditUpdate({ credit }) {

//     if (credit > this.assignmentObj.credit || !this.assignmentObj.credit) {
//       this.assignmentObj.credit = credit;
//     }
//     this.forceUpdate();
//   }
// }
  // render() {

  //   //We have an error so doen't show the viewer
  //   if (this.state.error) {

  //     return (<React.Fragment>
  //       <p style={{ color: "red" }}>{this.state.error && this.state.error.toString()}</p>
  //     </React.Fragment>);
  //   }

  //   return (<>
  //     <div className="courseContainer">
  //       <DoenetHeader toolTitle="Course" headingTitle={this.courseName} />

  //     </div>
  //   </>)

  //   let disablePrev = false;
  //   if (this.assignmentIndex === 0) { disablePrev = true; }
  //   let disableNext = false;
  //   if (this.assignmentIndex === (this.assignmentIdList.length - 1)) { disableNext = true; }
  // }



export default DoenetCourse;