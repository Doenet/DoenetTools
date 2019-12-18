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
// import queryString from 'query-string'
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
class DoenetAdmin extends Component {
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
            this.assignment_link = (<Link to={'/assignments'} className="homeMainMenuItem" data-cy="assignmentsNavItem"onClick={()=>{console.log("HELLO THERE");this.activeSection="assignments";this.showsAllAssignment=!this.showsAllAssignment;this.componentLoadedFromNavigationBar=null;this.makeTreeVisible({loadSpecificId:""})}}>{this.activeSection === "assignments" ? "* " : null}Assignments</Link>
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
    // const queryString = require('query-string');

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
    console.log("running buildTreeArray")
    console.log(this.heading_obj)
    console.log(this.assignment_obj)
    console.log("this.makeTreeArray0")
    console.log(this.makeTreeArray)
    // first get pId that is null
    this.makeTreeArray=[]
    if (this.heading_obj.length!=1){
      console.log("HERE01")
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
    console.log("this.makeTreeArray1")
    console.log(this.makeTreeArray)
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
    console.log("this.makeTreeArray2")
    console.log(this.makeTreeArray)
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
    console.log("this.makeTreeArray3")
    console.log(this.makeTreeArray)
  }
buildTree(){
  console.log("building tree")
  let ClassName = "headerSelection"
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
    console.log("RUNNING makeTreeVisible")
    const url_header_assignment = "/api/getHeaderAndAssignmentInfo.php";
    if (!this.alreadyMadeTree){
      axios (url_header_assignment)
    .then (resp=>{
      console.log("RUNNING PHP here")
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
      console.log ("this.assignment_obj")
      console.log(this.assignment_obj)
      console.log ("this.heading_obj")
      console.log(this.heading_obj)
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
    // console.log("====RENDER====");
    // console.log(this.tree_route)
    console.log("assignment link")
    console.log(this.assignment_link)
  
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
// class DoenetAdmin extends Component {
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



export default DoenetAdmin;

// import React, { Component } from 'react';
// import DoenetViewer from '../React/DoenetViewer';
// import axios from 'axios';
// import MersenneTwister from 'mersenne-twister';
// import './admin.css';
// import nanoid from 'nanoid';
// import DoenetHeader from './DoenetHeader';
// import { faWindowClose, faEdit, faArrowUp,faArrowDown,faArrowLeft,faArrowRight,faPlus,faFolderPlus} from '@fortawesome/free-solid-svg-icons';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// function hashStringToInteger(s) {
//   var hash = 0, i, chr;
//   if (s.length === 0) return hash;
//   for (i = 0; i < s.length; i++) {
//     chr   = s.charCodeAt(i);
//     hash  = ((hash << 5) - hash) + chr;
//     hash |= 0; // Convert to 32bit integer
//   }
//   return hash;
// };

// let assignmentID = null;

// class DoenetAdmin extends Component {
//   constructor(props){
//     super(props);
//      console.log("===RESTART===")
//     this.assignmentIndex = 0;
//     this.loadingScreen = (<React.Fragment><p>Loading...</p></React.Fragment>);

//       const envurl='/api/env.php';
//       axios.get(envurl)
//         .then(resp=>{
//             this.username = resp.data.user;
//             this.access = resp.data.access;
//             this.forceUpdate();
//         });
     
      
//     let url_string = window.location.href;
//     var url = new URL(url_string);
    
//     this.username = "";
//     this.courseId = "aI8sK4vmEhC5sdeSP3vNW"; //Temporary TODO: Choose courses
//     this.courseName = "Calculus and Dynamical Systems in Biology";
//     this.gradeCategories = ['Gateway','Problem Sets','Projects','Exams','Participation'];
//     this.assignmentId = url.searchParams.get("assignmentId");
//     this.activeSection = url.searchParams.get("active");
//     this.assignment_state_1 = url.searchParams.get("assignment"); // get false
//     // if (this.activeSection==='grade'){
//     //   this.loadGrades()
//     // } 
//     this.enableThese=[]
//     this.overview_branchId=""
//     this.syllabus_branchId=""
//     this.selectedAssignmentId=""
//     this.state = {
//       courseId: "",
//       error: null,
//       errorInfo: null,
//       outlineType:"outline",
//       overview:null,
//       grade:null,
//       assignment:null,
//       syllabus:null,
//       newChange:false,
//       loadingTree:false,
//       changeToTree:false,
//       enableMode:"position",
//       showTree:false,
//       selectedAssignmentId:"",
//     };
//     if (this.assignment_state_1===undefined || this.assignment_state_1===null){
//       this.assignment_state_1=true
//     } else {
//       this.assignment_state_1=false
//     }


//     this.assignmentsData = null;
//     this.DoneLoading=false;
//     /**
//          * to construct a tree:
//          * construct an array that contains objects 
//          * (key is id with no pId, value is level, which is 0)
//          * secondly,
//          *  place pointer at first Id and find what id that it is a pId.
//          *  level is value of first id +1. if found
//          *  then add that right after the first Id with the current level
//          *  when reach the end of this.arr_return, place pointer at second.
//          * thirdly, we level is value of second id +1, it will find its children
//          */

//     // getting info for creating tree from DB
//      this.result_arr=[];
//     console.log("CREATING SOME ID");
//     console.log(nanoid())
//     const url_header_assignment = "/api/getHeaderAndAssignmentInfo.php";
//      this.arr_return=[];
//      this.id_arr=[];
//      this.assignmentName="";
//      this.assignment_branchId = null;
//      this.dueDate=null;
//      this.assignedDate=null;
//      this.numberOfAttemptsAllowed=null;

//      this.AddedAssignmentObjArray = [ 
//        // this contains contentIds NOT assignmentId,
//       // assignmentId created 
//        'T0XvjDItzSs_GXBixY8fa',
//        'z3rOQm9o6XXjInAZrz6tV',
//        'nwrAL9TIEup9ItRdqYhfR'       
//       ]
//      this.makeTreeArray=[]; // filled in buildTreeArray
//      this.tree=[] // made in buildTree
//      this.headerId_arr = []
//      this.assignmentId_arr=[]
//      console.log("inside CONSTRUCTOR")
//       // this.buildTreeArray()
//       // this.buildTree()
//       this.obj_return={};
//       this.heading_obj={};
//       this.assignment_obj={};
//       this.listOfAssignmentIdNeedDeletingFromDB = []
//       this.enableMode='position'
//     axios (url_header_assignment)
//       .then (resp=>{
//         console.log("RUNNING PHP")
//         this.obj_return = resp.data;
//         //let lengthOfReturnArray = (this.obj_return.length)
//         console.log("obj is")
//         console.log(resp.data )
//         let iterator=0;      
//         let keys = (Object.keys(this.obj_return));
//         let length = keys.length;
//         while (iterator<length){
//           let currentId = keys[iterator];
//           let name = this.obj_return[currentId]['name'];
//           let parent = this.obj_return[currentId]['parent']
//           if (parent==null || parent=="null" || parent==""){
//             parent=null;
//           }
//           console.log("checking..")
//           let currentIdAttribute = this.obj_return[currentId]['attribute']
//           console.log(currentIdAttribute)
//           if (currentIdAttribute==='header'){
//             let assignmentId = this.obj_return[currentId]['headingId']
//             let headingId = this.obj_return[currentId]['assignmentId']
//             let childrenArray = this.obj_return[currentId]['childrenId'];
            
//               childrenArray.forEach(element=>{
//                 if (element!=null && element!=""){
//                   let childAttribute = this.obj_return[element]['attribute']
//                   console.log("still checking..")
//                   console.log(childAttribute)
//                   if (childAttribute==="header"){
//                     headingId.push(element)
//                   } else {
//                     assignmentId.push(element)
//                   }
//                 }               
//               })
                                   
//             this.heading_obj [currentId]={name:name,attribute:"header",parent:parent,headingId:headingId,assignmentId:assignmentId}
//           } else {
//             let contentId = this.obj_return[currentId]['contentId']
//             let branchId = this.obj_return[currentId]['branchId']
//             let assignedDate = this.obj_return[currentId]['assignedDate']
//             let dueDate = this.obj_return[currentId]['dueDate']
//             let numberOfAttemptsAllowed = this.obj_return[currentId]['numberOfAttemptsAllowed']
//             this.assignment_obj [currentId]={name:name,attribute:"assignment",
//             parent:parent,branchId:branchId,contentId:contentId,
//             assignedDate:assignedDate,dueDate:dueDate,numberOfAttemptsAllowed:numberOfAttemptsAllowed
//           }
//           }
//           iterator++;
//         }
//         console.log("DONE LOOPING YES")
//         console.log(this.assignment_obj)
//           this.buildTreeArray()
//           this.buildTree()
//           this.forceUpdate();
        
//       }).catch(error=>{this.setState({error:error})});
      



    

//       const loadUrl = '/api/loadEnable.php'
//       this.payLoad = {
//         overview:0,
//         syllabus:0,
//         grade:0,
//         assignment:0
//       }
      
//       axios.get(loadUrl,this.payLoad)
//         .then (resp=>{
         
//                //!!+ is to convert string to boolean
//           this.payLoad.overview=+(resp.data["overview"])
//           this.payLoad.grade=+(resp.data["grade"])
//           this.payLoad.syllabus=+(resp.data["syllabus"])
//           this.payLoad.assignment=+(resp.data["assignment"])
//           this.overview_branchId=resp.data["overview_branchId"]
//           this.syllabus_branchId=resp.data["syllabus_branchId"]
//           // assignment_state =+(resp.data["assignment"])
//           // this.enabledDisabledArray = {
//           //   overview:!!+payLoad.overview,
//           //   syllabus:!!+payLoad.grade,
//           //   grade:!!+payLoad.syllabus,
//           //   assignment:!!+payLoad.assignment,
//           // }

//           this.state.overview=+(resp.data["overview"])
//           this.state.grade=+(resp.data["grade"])
//           this.state.syllabus=+(resp.data["syllabus"])
//           this.state.assignment=+(resp.data["assignment"])
//           if (!this.assignment_state_1){
//             this.state.assignment=false;
//           }
//           // let foundit=false
//           Object.keys(this.payLoad).map((e)=>{
//                 console.log("looping payload here")
//                 if (this.payLoad[e]===1 && this.activeSection===null ){
//                     console.log("finding")
//                     console.log(e)
//                     this.activeSection=e
//                     this.updateLocationBar()
//                     // foundit=true
//                     //window.location.href="/admin/?active="+e
//                     }
//                 })
//           console.log("ACTIVE is..."+this.activeSection)
//           console.log(`The courseId id is ${this.courseId}`);
//           if (this.assignment_state_1===false){
//             this.state.newChange=true;
//           }
//           this.DoneLoading=true;
//           if(this.activeSection==='overview'){
//             this.loadOverview();
//           }else if(this.activeSection==='syllabus'){
//             this.loadSyllabus();
//           } else if (this.activeSection==='grade'){
//             this.loadGrades()
//           } 
//           // console.log("done")
//           // this.forceUpdate()

//         });
         
//     this.courseInfo = {};
//     this.finishedContructor = false;
 


    
//       //Get code and mode from the database
//     const loadOutlineUrl='/api/loadOutline.php';
//     const data={
//       courseId: this.courseId,
//     }
//     const payload = {
//       params: data
//     }

    


//     this.updateNumber = 0;
//     this.updateLocationBar = this.updateLocationBar.bind(this);
//     this.buildAssignmentGrades = this.buildAssignmentGrades.bind(this);
//     this.buildItemGrade = this.buildItemGrade.bind(this);
//     this.buildAttemptItemGradesHelper = this.buildAttemptItemGradesHelper.bind(this);
//     this.assignmentDataToCourseInfo = this.assignmentDataToCourseInfo.bind(this);
//     this.generateNewAttempt = this.generateNewAttempt.bind(this);
//     this.creditUpdate = this.creditUpdate.bind(this);
//     this.ToggleList = this.ToggleList.bind(this);
//     this.loadGrades = this.loadGrades.bind(this);
//     this.EnableThese = this.EnableThese.bind(this);
//     this.loadOverview = this.loadOverview.bind(this);
//     this.buildTree = this.buildTree.bind(this);
//     this.deleteHeader = this.deleteHeader.bind(this);
//     this.deleteAssignment = this.deleteAssignment.bind(this);
//     this.moveHeaderDown = this.moveHeaderDown.bind(this);
//     this.moveHeaderUp = this.moveHeaderUp.bind(this);
//     this.addAssignmentIdsUnderHeader = this.addAssignmentIdsUnderHeader.bind(this)
//     this.axiosDeleteAssignmentFromDB = this.axiosDeleteAssignmentFromDB.bind(this)
//   }

//   buildTreeArray(){
//     //console.log(this.arr_return[this.id_arr.indexOf(this.id_arr[0])][this.id_arr[0]])
//     // first get pId that is null
//     // this.result_arr.splice(index,0,obj);=
//     this.makeTreeArray=[]
//     if (this.heading_obj.length!=1){

//     // let assignmentObjectLength = this.assignmentId_arr.length;
//     let iterator = 0;
//     this.headerId_arr=[]
//     let already_built_header_id = {}
//     this.assignmentId_arr=[]
//     this.makeTreeArray=[]
//     // create a header_id_arr to access header_obj

//     this.headerId_arr = Object.keys(this.heading_obj)
//     let headerObjectLength = this.headerId_arr.length;

//     iterator=0;
//     this.assignmentId_arr = Object.keys(this.assignment_obj)

//     iterator = 0;
//     // establish level 0
//     this.heading_obj["UltimateHeader"]["headingId"].forEach(element=>{
//       element= element.toString()
//       console.log("loop 1")
//       console.log(this.heading_obj[element])
//       let name = this.heading_obj[element]["name"]
//       let object = {id:element,name:name,attribute:"header",level:0}
//       this.makeTreeArray.unshift(object)
//     })

//     // add header first, level = level's parent + 1
//     iterator = 0;
    
//     // .splice(index,0,obj)
//      while (iterator < this.makeTreeArray.length){

//       //let indexOfHeader = this.headerId_arr.indexOf(this.makeTreeArray[iterator]["id"])
//       let currentHeaderObject = 
//       this.heading_obj[this.makeTreeArray[iterator]["id"]];

//       if (currentHeaderObject["headingId"]!=undefined){
//         (currentHeaderObject["headingId"]).forEach(header=>{
//           header = header.toString();
//           console.log("loop 2")
//           console.log(this.heading_obj[header])
//             let name = this.heading_obj[header]["name"];
//             let attribute = "header"
//             let newLevel = this.makeTreeArray[iterator]["level"]+1;
//             let object = {id:header,name:name,attribute:attribute,level:newLevel}
//             this.makeTreeArray.splice(iterator+1,0,object)
//             already_built_header_id[header]=true;
//           //}
//         })
//       }
      
//       iterator++;
//     }
//    //add assignments
//    // add arrow when this.enableMode==='assignment'
//     iterator = 0;
//     while (iterator < this.makeTreeArray.length){
//       if (this.makeTreeArray[iterator]["attribute"]==="header"){
//         let indexOfHeader = this.headerId_arr.indexOf(this.makeTreeArray[iterator]["id"])
//         let currentHeaderObject = 
//         this.heading_obj[this.makeTreeArray[iterator]["id"]];
//       let assignment_list = currentHeaderObject["assignmentId"]
//       console.log("assignment list..")
//       console.log(assignment_list)
//       if (assignment_list!=[]) {
//       (assignment_list).forEach(e=>{
//         // assume unique assignment has unique headers
//         console.log("loop 3")
//         console.log(e)
//         console.log(this.assignment_obj[e.toString()])
//           let name = this.assignment_obj[e.toString()]["name"];
//           let newLevel = this.makeTreeArray[iterator]["level"]+1;
//           let attribute = "assignment"
//           let object1 = {id:e.toString(),name:name,attribute:attribute,level:newLevel}
//           this.makeTreeArray.splice(iterator+1,0,object1)
//       })
//     }
//       }
//       iterator++;
//     }
//     }
    
//   }
// buildTree(){
//   console.log("inside build tree")
//   console.log(this.assignment_obj)
//   console.log(this.heading_obj)
//   console.log(this.makeTreeArray)
//   let ClassName = "headerSelection"
//   let countChildrenOfUltimate=0
//   let lengthChildrenOfUltimate=0
//   // making space
//   this.tree = [];
//   let addHeaderToTheEndOfUltimateHeader=(<span className="Section-Icon-Box">         
//       <FontAwesomeIcon className="Section-Icon" 
//        onClick ={()=>{this.addNewHeaderAtTheEndUltimateHeader()}} icon={faPlus}/></span>);
//   let addingAssignmentArray = this.AddedAssignmentObjArray 
//   if (this.makeTreeArray.length>0) {
//     this.makeTreeArray.forEach((element,index)=>{
//       let name = element["name"]
//       let level = element["level"];
//       let id = element["id"]; // id of either header or assignment
//       let type = element ["attribute"]
//       let headerParentId=null;
//       if (type==='header'){
//         headerParentId=this.heading_obj[id]['parent']
//       }
//       let leftMargin = `${level*20}px`;
//       let leftArrow = null;
//       let rightArrow=null;
//       let upArrow=null;
//       let downArrow=null;
//       let addHeaderPlus = null;
//       let addAssignmentPlus=null;
//       let remove = null;
//       let addingArrowAfterAssignment = null;
//       let addingArrowUnderHeader=null;
//       let contentID=null;
//       let branchID=null;
//       let addHeaderPlusUnderUltimateHeader=null;
//       if (level==0) { // only header can have level 0
//         if (this.enableMode==='header'){
//           addHeaderPlusUnderUltimateHeader=(<span className="Section-Icon-Box">         
//         <FontAwesomeIcon className="Section-Icon" data-cy ="plus"
//          onClick ={()=>{this.addNewHeaderUnderUltimateHeader({headerObj:element})}} icon={faPlus}/></span>)
//       }}
//       // making up, down Arrow
//       if (type==='header'){
//         let id1 = element["id"];
//         //console.log("id1 is "+id1)
//         if (this.enableMode==='position'){
//           let myParent = this.heading_obj[id1]['parent']
//         let myParentHeadingIdArray = this.heading_obj[myParent]['headingId']
//         if (myParentHeadingIdArray.indexOf(id1)!=(myParentHeadingIdArray.length-1)){
//           upArrow=(<span className="Section-Icon-Box">         
//         <FontAwesomeIcon className="Section-Icon" data-cy={"arrowUp"+index}
//          onClick ={()=>{this.moveHeaderUp({headerObj:element})}} icon={faArrowUp}/></span>)
//         }
//         if (myParentHeadingIdArray.indexOf(id)!=0){
//           downArrow=(<span className="Section-Icon-Box">         
//         <FontAwesomeIcon className="Section-Icon" data-cy={"arrowDown"+index}
//          onClick ={()=>{this.moveHeaderDown({headerObj:element})}} icon={faArrowDown}/></span>)
//         }
//         if (myParentHeadingIdArray.length>=2
//           && myParentHeadingIdArray.indexOf(id)!=(myParentHeadingIdArray.length-1)){
//             rightArrow = (<span className="Section-Icon-Box">         
//         <FontAwesomeIcon className="Section-Icon" data-cy={"arrowRight"+index}
//          onClick ={()=>{this.moveHeaderRight({headerObj:element})}} icon={faArrowRight}/></span>)
//           }
//           console.log(this.heading_obj[id])
//         if (this.heading_obj[id]['parent']!="UltimateHeader"){
//             leftArrow = (<span className="Section-Icon-Box">         
//             <FontAwesomeIcon className="Section-Icon" data-cy={"arrowLeft"+index}
//              onClick ={()=>{this.moveHeaderLeft({headerObj:element})}} icon={faArrowLeft}/></span>)
//           }  
//       } else if (this.enableMode==='remove'){
//         remove=(<span className="Section-Icon-Box">         
//       <FontAwesomeIcon className="Section-Icon" data-cy={"close"+index}
//        onClick ={()=>{this.deleteHeader({headerObj:element});this.buildTreeArray();
//        this.buildTree();
//        this.forceUpdate();}} icon={faWindowClose}/></span>)
//       } else if (this.enableMode==='header'){
//           addHeaderPlus=(<span className="Section-Icon-Box">         
//         <FontAwesomeIcon className="Section-Icon" data-cy={"plus"+index}
//          onClick ={()=>{this.addNewHeaderToHeader({headerObj:element})}} icon={faPlus}/></span>)
//         } 
//         else if (this.enableMode==='assignment'){
//           id = element["id"];
//           let parentId = this.heading_obj[id]['parent']
//           addingArrowUnderHeader=(<div style={{marginLeft:leftMargin}}><span className="Section-Icon-Box">         
//           <FontAwesomeIcon className="Section-Icon" data-cy={"arrowLeft"+index}
//            onClick ={
//              ()=>{this.addAssignmentIdsUnderHeader({currentHeaderId:id,arrayOfIncomingAssignments:this.AddedAssignmentObjArray})}}
//            icon={faArrowLeft}/></span></div>)
//         }
//       }else {
//         let myParent = this.assignment_obj[id]['parent']
//         ClassName = "AssignmentSelection"
//         contentID = this.assignment_obj[id]['contentId']
//         branchID = this.assignment_obj[id]['branchId']
//         // branchID = this.assignment_obj[id]['branchId']
//         let myParentHeadingIdArray = this.heading_obj[myParent]['assignmentId']
//         if (this.enableMode==='position'){
//           if (myParentHeadingIdArray.indexOf(id)!=((myParentHeadingIdArray.length)-1)){
//             upArrow=(<span className="Section-Icon-Box">         
//             <FontAwesomeIcon className="Section-Icon" data-cy={"arrowUp"+index}
//              onClick ={()=>{this.moveAssignmentUp({assignmentObj:element})}} icon={faArrowUp}/></span>)
//           }
//           if (myParentHeadingIdArray.indexOf(id)!=0){
//             downArrow=(<span className="Section-Icon-Box">         
//           <FontAwesomeIcon className="Section-Icon" data-cy={"arrowDown"+index}
//            onClick ={()=>{this.moveAssignmentDown({assignmentObj:element})}} icon={faArrowDown}/></span>)
//           }
//         } else if (this.enableMode==='remove'){
//           remove=(<span className="Section-Icon-Box">         
//         <FontAwesomeIcon className="Section-Icon" data-cy={"close"+index}
//          onClick ={()=>{this.deleteAssignment({assignmentObj:element})}} icon={faWindowClose}/></span>)
//         } else if (this.enableMode==='assignment'){
//           id = element["id"];
//           addingArrowAfterAssignment=(<div style={{marginLeft:leftMargin}}><span className="Section-Icon-Box">         
//         <FontAwesomeIcon className="Section-Icon" data-cy={"arrowLeft"+index}
//          onClick =
//          {()=>{this.addAssignmentIdsAfterAnAssignment({currentAssignmentId:id,arrayOfIncomingAssignments:this.AddedAssignmentObjArray})}}
//          icon={faArrowLeft}/></span></div>)
//         }       
//       }
//       let data_cy=type+index
//       let styleAssignment={marginLeft:leftMargin,display:"flex"}
//       if (this.selectedAssignmentId===id) {
//         styleAssignment={marginLeft:leftMargin,display:"flex",backgroundColor: "#979B97"}
//       }
//       let tree_branch = 
//       (
//         <div key={"tree_branch"+index} data-cy={data_cy} className={ClassName} style={styleAssignment}>
//         <span className="Section-Text" onClick={()=>{this.loadAssignmentContent({contentId:contentID,branchId:branchID,assignmentId:id})}}>
//             {name}
//             </span>
//             {leftArrow}
//             {rightArrow}
//             {upArrow}
//             {downArrow}
//             {addHeaderPlus}
//             {remove}
//              </div>
      
//       )
//       if (addHeaderPlusUnderUltimateHeader!=null && type==='header'){
//         this.tree.push(addHeaderPlusUnderUltimateHeader)
//       }
//       this.tree.push(tree_branch)
//       if (addingArrowAfterAssignment!=null && type==='assignment'){
//         this.tree.push(addingArrowAfterAssignment)
//       } 
      
//       if (addingArrowUnderHeader!=null && type==='header'
//       && headerParentId!=null){
//         this.tree.push(addingArrowUnderHeader);
//       }
      
//       // if (addingArrow!=null && type==='assignment'){
//       //   this.tree.push(addingArrow)
//       // }
//       })
//   } else {
//     console.log("EMPTY TREE")
//   }
//   if (this.enableMode==='header'){
//     console.log("yes plzzz")
//     this.tree.push(addHeaderToTheEndOfUltimateHeader)
//   }
//   console.log("finish building tree")
// }
// saveTree(){
//   console.log("saving the tree")
//   /**
//    * here passing in a payload of
//    * for UPDATE:
//    *  a assignment set where all row in assignment match the id will be updated in parent
//    * for DELETE:
//    *  a header set where all row in course's heading match the id will be deleted
//    * for INSERT:
//    *  for inserting into assignment
//    *   a set of assignment id
//    *   a list of parent id as 1 header Id can have multiple assignment id
//    *   index of children id associated with index of assignment id
//    *  for inserting into heading
//    *    a list of header id where duplicate may occur as a header may contain several different children id
//    *    a set of children id as no children Id can be owned by 2 different parents
//    * 
//    * delete multiple rows: DELETE FROM table WHERE col1 IN (1,2,3,4,5)
//       insert multiple rows:
//       INSERT INTO 
//             projects(name, start_date, end_date)
//       VALUES
//             ('AI for Marketing','2019-08-01','2019-12-31'),
//             ('ML for Sales','2019-05-15','2019-11-20');
//    */
//   let assignmentId_parentID_array = [];
//   let assignmentId_array = Object.keys(this.assignment_obj)
//   assignmentId_array.forEach(id=>{
//     assignmentId_parentID_array.push(this.assignment_obj[id]['parent']);
//   })
//   let headerID_array = Object.keys(this.heading_obj);
//   let headerID_array_to_payload = []
//   let headerID_childrenId_array_to_payload=[]
//   let headerID_parentId_array_to_payload = []
//   let headerID_name = []
//   headerID_array.forEach(currentHeaderId=>{
//     let currentHeaderObj=this.heading_obj[currentHeaderId]
//     let name = currentHeaderObj['name']
//     if (name==null){
//       name="NULL"
//     }
//     let currentHeaderObjHeadingIdArray = currentHeaderObj['headingId']
//     let lengthOfHeadingId = currentHeaderObjHeadingIdArray.length
//     let currentHeaderObjAssignmentIdArray = currentHeaderObj['assignmentId']
//     let currentHeaderObjParentId = currentHeaderObj['parent']
//     let lengthOfAssigmentId = currentHeaderObjAssignmentIdArray.length
//     let iterator = 0
//     if (lengthOfHeadingId==0 && lengthOfAssigmentId==0){
//       headerID_array_to_payload.push(currentHeaderId)
//       if (currentHeaderObjParentId==null){
//         headerID_parentId_array_to_payload.push("NULL")
//       } else {
//       headerID_parentId_array_to_payload.push(currentHeaderObjParentId)
//       }
//       headerID_childrenId_array_to_payload.push("NULL")
//       headerID_name.push(name);
//     }
//     while (iterator < lengthOfHeadingId){
//       headerID_array_to_payload.push(currentHeaderId)
//       headerID_childrenId_array_to_payload.push(currentHeaderObjHeadingIdArray[iterator])
//       headerID_name.push(name);
//       if (currentHeaderObjParentId==null){
//         headerID_parentId_array_to_payload.push("NULL")
//       } else {
//       headerID_parentId_array_to_payload.push(currentHeaderObjParentId)
//       }
//       iterator+=1
//     }
//     iterator = 0
//     while (iterator < lengthOfAssigmentId){
//       headerID_array_to_payload.push(currentHeaderId)
//       headerID_childrenId_array_to_payload.push(currentHeaderObjAssignmentIdArray[iterator])
//       headerID_name.push(name);
//       if (currentHeaderObjParentId==null){
//         headerID_parentId_array_to_payload.push("NULL")
//       } else {
//       headerID_parentId_array_to_payload.push(currentHeaderObjParentId)
//       }
//       iterator+=1
//     }
//   })
//   //JSON.stringify()
//   // assignmentId_array =JSON.stringify(assignmentId_array) 
//   // assignmentId_parentID_array = JSON.stringify(assignmentId_parentID_array) 
//   // headerID_array_to_payload = JSON.stringify(headerID_array_to_payload) 
//   // headerID_childrenId_array_to_payload = JSON.stringify(headerID_childrenId_array_to_payload) 
//   // console.log(headerID_name)
//   //   console.log("headerID_array_to_payload..")
//   //   console.log(headerID_array_to_payload)
//   //   console.log("headerID_childrenId_array_to_payload..")
//   //   console.log(headerID_childrenId_array_to_payload)
//   //   console.log("headerID_parentId_array_to_payload")
//   //   console.log(headerID_parentId_array_to_payload)
//     const urlGetCode = '/api/saveTree.php';
//     const data = {
//       assignmentId_array: assignmentId_array,
//       assignmentId_parentID_array: assignmentId_parentID_array,
//       headerID_array_to_payload:headerID_array_to_payload,
//       headerID_name:headerID_name,
//       headerID_parentId_array_to_payload:headerID_parentId_array_to_payload,
//       headerID_childrenId_array_to_payload:headerID_childrenId_array_to_payload
//     }

//     axios.post(urlGetCode,data)
//     .then(resp=>{
//       console.log(resp.data)
//     })
//     .catch(error=>{this.setState({error:error})});

// }
// moveHeaderUp({headerObj}){
// /**
//  * posses up arrow iff your id not first appear inside your parentId's headerId array
//  * get the id of the current header
//  * find current header parentId in this.header_obj
//  * find current header parent obj in this.header_obj base on parentId
//  * get current header index inside current header parent obj headerId
//  * swap it with the element whose index before
//  */

// let currentHeaderId = headerObj["id"]

// let myParentId = this.heading_obj[currentHeaderId]["parent"]
// let parentObj = this.heading_obj[myParentId];

// let currentHeaderIndexInParentHeaderIdArray = parentObj["headingId"].indexOf(currentHeaderId)
// let previousIndex = currentHeaderIndexInParentHeaderIdArray+1;

// let previousId = parentObj["headingId"][previousIndex]
// let temp = previousId;
// // swapping
// parentObj["headingId"][previousIndex]=currentHeaderId;
// parentObj["headingId"][currentHeaderIndexInParentHeaderIdArray] = temp;

// this.buildTreeArray();
// this.buildTree();
// this.forceUpdate();
// this.saveTree();
// }
// moveAssignmentUp({assignmentObj}){
//   /**
//  * posses up arrow iff your id not first appear inside your parentId's assignment array
//  * get the id of the current assignment
//  * find current assignment parentId in this.header_obj
//  * find current assignment's parent obj in this.header_obj base on parentId
//  * get current assignment index inside current header's parent obj assignmentId
//  * swap it with the element whose index before
//  */
// let currentAssignmentId = assignmentObj["id"]
// let myParentId = this.assignment_obj[currentAssignmentId]["parent"]
// let parentObj = this.heading_obj[myParentId];
// let currentHeaderIndexInParentHeaderIdArray = parentObj["assignmentId"].indexOf(currentAssignmentId)
// let previousIndex = currentHeaderIndexInParentHeaderIdArray+1;
// let previousId = parentObj["assignmentId"][previousIndex]
// let temp = previousId;
// // swapping
// parentObj["assignmentId"][previousIndex]=currentAssignmentId;
// parentObj["assignmentId"][currentHeaderIndexInParentHeaderIdArray] = temp;
// this.buildTreeArray();
// this.buildTree();
// this.forceUpdate();
// this.saveTree();
// }
// moveHeaderDown({headerObj}){
//   /**
//    * posses down arrow iff your id not last appear inside your parentId's headerId array
//    * get the id of the current header
//    * find current header parentId in this.header_obj
//    * find current header parent obj in this.header_obj base on parentId
//    * get current header index inside current header parent obj headerId
//    * swap it with the element whose index after
//    */
// let currentHeaderId = headerObj["id"]
// let myParentId = this.heading_obj[currentHeaderId]["parent"]
// let parentObj = this.heading_obj[myParentId];
// let currentHeaderIndexInParentHeaderIdArray = parentObj["headingId"].indexOf(currentHeaderId)
// let previousIndex = currentHeaderIndexInParentHeaderIdArray-1;
// let previousId = parentObj["headingId"][previousIndex]
// let temp = previousId;
// // swapping
// parentObj["headingId"][previousIndex]=currentHeaderId;
// parentObj["headingId"][currentHeaderIndexInParentHeaderIdArray] = temp;
// this.buildTreeArray();
// this.buildTree();
// this.forceUpdate();
// this.saveTree();
// }
// moveAssignmentDown({assignmentObj}){
//     /**
//    * posses down arrow iff your id not lasr appear inside your parentId's assignment array
//    * get the id of the current assignment
//    * find current assignment parentId in this.header_obj
//    * find current assignment's parent obj in this.header_obj base on parentId
//    * get current assignment index inside current header's parent obj assignmentId
//    * swap it with the element whose index after
//    */
//   let currentAssignmentId = assignmentObj["id"]
//   let myParentId = this.assignment_obj[currentAssignmentId]["parent"]
//   let parentObj = this.heading_obj[myParentId];
//   let currentHeaderIndexInParentHeaderIdArray = parentObj["assignmentId"].indexOf(currentAssignmentId)
//   let previousIndex = currentHeaderIndexInParentHeaderIdArray-1;
//   let previousId = parentObj["assignmentId"][previousIndex]
//   let temp = previousId;
//   // swapping
//   parentObj["assignmentId"][previousIndex]=currentAssignmentId;
//   parentObj["assignmentId"][currentHeaderIndexInParentHeaderIdArray] = temp;
//   this.buildTreeArray();
//   this.buildTree();
//   this.forceUpdate();
//   this.saveTree();

// }
// moveHeaderLeft({headerObj}){
//   /**
//    * possess a left arrow when exists parent that not "UltimateHeader"
//    * get the id of the current header as currentHeaderId
//    * find currentHeaderId's parentId in this.header_obj
//    * splice currentHeaderId out of currentHeaderId's parentId headingId array
//    * store parentId of currentHeaderId's parentId as newParentId
//    * change currentHeaderId's parentId attribute value to newParentId
//    */
//   let currentHeaderId = headerObj["id"]
//   let myparentId = this.heading_obj[currentHeaderId]["parent"]
//   let myNewParentId = this.heading_obj[myparentId]["parent"]
//   let myParentHeaderIdArray = this.heading_obj[myparentId]["headingId"]
//   let currentHeaderIdIndexInsidemyParentHeaderIdArray = myParentHeaderIdArray.indexOf(currentHeaderId)
//   this.heading_obj[myparentId]["headingId"].splice(currentHeaderIdIndexInsidemyParentHeaderIdArray,1)
//   this.heading_obj[currentHeaderId]["parent"] = myNewParentId;
//   if (currentHeaderIdIndexInsidemyParentHeaderIdArray===(myParentHeaderIdArray-1)){
//     this.heading_obj[myNewParentId]["headingId"].push(currentHeaderId)   // when u last
//   }else {
//     this.heading_obj[myNewParentId]["headingId"].unshift(currentHeaderId)
//   }
//   console.log("moveHeaderLeft")
//   console.log(this.heading_obj)
//   this.buildTreeArray();
//   this.buildTree();
//   this.forceUpdate();
//   this.saveTree();

// }
// moveHeaderRight({headerObj}){
//   /**
//    * possess right arrow when my id not the only in my parentID's headerId
//    * get the id of the current header as id
//    * find the next header inside the current header's parent headingId
//    * find the index of the previous header inside headerId_arr
//    * continue to seek previous header by decreasing the index
//    * when found a header where its level is at least current header
//    *    then store the header Id as newParentID. Then look parentID up in header_obj
//    *    then access its headerId array and append id to the array
//    * change id's parent to newParentID
//    */
//   let currentHeaderId = headerObj['id']
//   let myParentId = this.heading_obj[currentHeaderId]['parent']
//   let myParentHeadingIdArray = this.heading_obj[myParentId]["headingId"]
//   let prevHeaderIndexInsidemyParentHeadingIdArray = myParentHeadingIdArray.indexOf(currentHeaderId)+1
//   if (prevHeaderIndexInsidemyParentHeadingIdArray===myParentHeadingIdArray.length){
//     prevHeaderIndexInsidemyParentHeadingIdArray=myParentHeadingIdArray.indexOf(currentHeaderId)-1
//   }
//   let prevHeaderId = myParentHeadingIdArray[prevHeaderIndexInsidemyParentHeadingIdArray]
//   let prevHeaderObj = this.heading_obj[prevHeaderId]
//   let currentHeaderIdIndexInsideParentObjHeadingIdArray = this.heading_obj[myParentId]['headingId'].indexOf(currentHeaderId)
//   if (currentHeaderIdIndexInsideParentObjHeadingIdArray==this.heading_obj[myParentId]['headingId'].length-1){
//   prevHeaderObj['headingId'].push(currentHeaderId)  // when u last
//   } else {
//     prevHeaderObj['headingId'].unshift(currentHeaderId)  // when u not last
//   }
//   this.heading_obj[currentHeaderId]['parent']=prevHeaderId
//   this.heading_obj[myParentId]['headingId'].splice(currentHeaderIdIndexInsideParentObjHeadingIdArray,1)
//   this.buildTreeArray();
//   this.buildTree();
//   this.forceUpdate();
// this.saveTree();

// }
// addAssignmentIdsAfterAnAssignment({currentAssignmentId,arrayOfIncomingAssignments}){
//   /**
//    * create a fake assignment array of assignment obj
//    * get the parentId of the current assignment
//    * look up parentId obj in header_obj
//    * iterate thru the each element and add the key id to parentId obj's assignmentId array
//    */

// let arr = arrayOfIncomingAssignments
// let myParentID = this.assignment_obj[currentAssignmentId]['parent'];
// let myParentObj = this.heading_obj[myParentID];
// let assignmentIdArray = myParentObj['assignmentId']
// let length = arr.length;
// let currentAssignmentIdIndexInsideParentAssignmentIdArray = 
//             myParentObj['assignmentId'].indexOf(currentAssignmentId)
// let addAtIndex=currentAssignmentIdIndexInsideParentAssignmentIdArray
// let iterator =0;
// while (iterator<length){
//   let addedAssignmentId = arr[iterator];
//   let ID = nanoid();
//   this.heading_obj[myParentID]['assignmentId'].splice(addAtIndex,0,ID)
//   console.log("NEW ID is.."+ID)
//   let name = "untitle assignment "+iterator;
//   this.assignment_obj [ID]={name:name,parent:myParentID,contentId:addedAssignmentId}
// iterator+=1;
// }
// // change enableMode to "position" .Adding duplicate assignmentId will break the rule of adding arrow
// // as one ID can both a middle and first element at the same time
// this.buildTreeArray();
// this.buildTree();
// this.forceUpdate();
// this.saveTree();

// }
// addAssignmentIdsUnderHeader({currentHeaderId,arrayOfIncomingAssignments}){
// /**
//  * get headerId as id
//  * look up id to get the id obj in header_obj
//  * iterate thru the each element and add the key id to id obj's assignmentId array
//  */
// /*Assume AddedAssignmentIdsArray is fully filled and 
// stores only {IdOfAssignment:<someID>,name:<someName>} */
// let arr = arrayOfIncomingAssignments
// let currentHeaderObj = this.heading_obj[currentHeaderId];
// let iterator=arr.length-1; // last index of Adding AssignmentID
// while (iterator>=0){
//   let ID = nanoid();
//   console.log("NEW ID is.."+ID)
//   let name = "untitle assignment "+iterator;
//   this.assignment_obj [ID]={name:name,parent:currentHeaderId,contentId:arr[iterator]}
//   // adding ID to currentHeaderId's assignmentId array
//   this.heading_obj[currentHeaderId]['assignmentId'].push(ID);
//   iterator--;
// }
// this.buildTreeArray();
// this.buildTree();
// this.forceUpdate();
// this.saveTree();

// }
// addNewHeaderUnderUltimateHeader ({headerObj}){
// let currentHeaderId = headerObj['id']
// let myParentObj = this.heading_obj["UltimateHeader"];
// let length = myParentObj['headingId'].length
// let currentHeaderIdIndexInsideParentHeadingIdArray = 
//             myParentObj['headingId'].indexOf(currentHeaderId)
// let addAtIndex=currentHeaderIdIndexInsideParentHeadingIdArray
// let ID = nanoid();

//   if (addAtIndex===0){
//     console.log("case 1")
//     this.heading_obj["UltimateHeader"]['headingId'].unshift(ID)
//   } else if (addAtIndex===(length-1)){
//     console.log("case 2")
//     this.heading_obj["UltimateHeader"]['headingId'].push(ID)
//   } else {
//     console.log("case 3")
//     this.heading_obj["UltimateHeader"]['headingId'].splice(addAtIndex+1,0,ID)
//   }
//   this.heading_obj [ID]={name:"untitled header",parent:"UltimateHeader",assignmentId:[],headingId:[]}

// // change enableMode to "position" .Adding duplicate assignmentId will break the rule of adding arrow
// // as one ID can both a middle and first element at the same time
// this.buildTreeArray();
// this.buildTree();
// this.forceUpdate();
// this.saveTree();

// }
// addNewHeaderAtTheEndUltimateHeader(){
// let ID = nanoid();
//   this.heading_obj["UltimateHeader"]['headingId'].unshift(ID)
//   this.heading_obj [ID]={name:"untitled header",parent:"UltimateHeader",assignmentId:[],headingId:[]}
//   this.buildTreeArray();
// this.buildTree();
// this.forceUpdate();
// this.saveTree();

// }
// addNewHeaderToHeader({headerObj}){
//   /**
//    * create a new id from nanoid as newId
//    * add a new header object to header_obj with newId empty headerId and assignmentId
//    * get the current header id as id
//    * add newId to id's headerId array
//    */
//   /*Assume addedHeader is fully filled and 
//   stores only {IdOfAssignment:<someID>,name:<someName>} */
//   // TODO: header can't be added under UltimateHeader
//   console.log("running addNewHeaderToHeader")
//   let currentHeaderId = headerObj['id']
//   let newHeaderId = nanoid();
//   let newHeaderName = "untitled header";
//   this.heading_obj [newHeaderId] = {name:newHeaderName,assignmentId:[],headingId:[],parent:currentHeaderId}
//   this.heading_obj[currentHeaderId]['headingId'].unshift(newHeaderId)
//   this.buildTreeArray();
//   this.buildTree();
//   this.forceUpdate();
// this.saveTree();

// }
// deleteHeader ({headerObj}){
//   /**
//    * delete header will delete its children including header and assignment
//    */
//   console.log("deleting obj")
//   console.log(headerObj)
// let id = headerObj['id']
// // delete it as heading, get parent
// // let indexOfHeader = this.headerId_arr.indexOf(id)
// let currentHeaderObject = 
//       this.heading_obj[id];
// let parentId;
// //if (currentHeaderObject["parent"]!="UltimateHeader"){
// parentId = currentHeaderObject["parent"]
  
// //}
// let listOfMyAssignment = currentHeaderObject["assignmentId"]
// let listOfDeletingAssignment = []
// listOfMyAssignment.forEach (element=>{
//   listOfDeletingAssignment.push(element.toString())
// })
// // before deleting myself, delete all my assignment object
// this.deleteChildrenAssignment({list:listOfDeletingAssignment})
// // before deleting myself, delete all my header object
// let listOfMyHeaders = currentHeaderObject["headingId"]
// console.log("listOfMyHeaders")
// console.log(listOfMyHeaders)
// let listOfDeletingHeader = []
// listOfMyHeaders.forEach (element=>{
//   let currentChildHeaderObjID = element
//   let name = this.heading_obj[element]['name']
//   let attribute = "header"
//   let parent = this.heading_obj[element]['parent']
//   let currentChildHeaderObjHeadingId = this.heading_obj[element]["headingId"]
//   let currentChildHeaderObjAssignmentId = this.heading_obj[element]["assignmentId"]

//   let currentChildHeaderObj = {id:currentChildHeaderObjID,name:name,attribute:attribute,parent:parent,headingId:currentChildHeaderObjHeadingId,assignmentId:currentChildHeaderObjAssignmentId}
//   this.deleteHeader({headerObj:currentChildHeaderObj})
// })
// //delete myself
// //this.heading_obj.splice(indexOfHeader,1)
// delete this.heading_obj[id]
// //if (currentHeaderObject["parent"]!="UltimateHeader"){
// // let indexOfHeaderParent = this.headerId_arr.indexOf(parentId)  
// let currentHeaderObjectParentHeadingId = 
//       this.heading_obj[parentId]["headingId"];
// let indexOfCurrentHeaderInsideItsParentHeadingId = currentHeaderObjectParentHeadingId.indexOf(id)
//   this.heading_obj[parentId]["headingId"].splice(indexOfCurrentHeaderInsideItsParentHeadingId,1)

// //}
// // deleting it inside the parent headingId

// console.log("delete header")
// console.log(this.heading_obj)
// console.log(this.assignment_obj)
// this.axiosDeleteAssignmentFromDB({listOfAssignment:this.listOfAssignmentIdNeedDeletingFromDB})

// // this.buildTreeArray();
// // this.buildTree();
// // this.forceUpdate();
// // this.saveTree();

// }
// deleteChildrenAssignment({list}){
//   // let listOfAssignmentIdNeedDeletingFromDB = []
// list.forEach(element=>{
//   this.listOfAssignmentIdNeedDeletingFromDB.push(element);
//   delete this.assignment_obj[element]
// })
// }
// deleteAssignment ({assignmentObj}){
//   let id = assignmentObj['id']
//   let indexOfAssignment = this.assignmentId_arr.indexOf(id)
//   let myParentId = this.assignment_obj[id]["parent"]
//   //delete me from parent
//   let indexOfHeaderParent = this.headerId_arr.indexOf(myParentId)
//   let currentHeaderObjectParentAssignmentId = 
//   this.heading_obj[myParentId]["assignmentId"]
//   delete this.assignment_obj[id]
//   //this.assignment_obj.splice(indexOfAssignment,1)

//   this.heading_obj[myParentId]["assignmentId"].splice(currentHeaderObjectParentAssignmentId.indexOf(id),1)
//   this.listOfAssignmentIdNeedDeletingFromDB = [id]
//   this.axiosDeleteAssignmentFromDB({listOfAssignment:this.listOfAssignmentIdNeedDeletingFromDB})
//   // here write axios called to delete one selected assignment
//   // const urlGetCode = '/api/deleteAssignment.php';
//   // const data = {
//   //   branchId: ["b2branchid"],
//   //   contentId: ["268edfaf6999ea0182e6ac360854c7d739e35eccbb6384dd193b301de845b707"],
//   // }
//   // const payload = {
//   //   params: data
//   // }
//   // axios.get(urlGetCode,payload)
//   // .then(resp=>{
//   //   let doenetML = resp.data.doenetML;
//   //   console.log("doenetML !")
//   //   console.log(resp.data)
//   //   this.updateNumber++;
//   //   this.doenetML=doenetML;
//   //   this.forceUpdate();
//   // })

//   // this.buildTreeArray();
//   // this.buildTree();
//   // this.saveTree();
//   //this.forceUpdate();

  

// }
// axiosDeleteAssignmentFromDB ({listOfAssignment}) {
//   // listOfAssignment.forEach(element=>{
//   console.log("axios here")
//   //   console.log(element)
//   // })
//     // here write axios called to delete one selected assignment
//   let list = listOfAssignment
//   const urlGetCode = '/api/deleteAssignment.php';
//   const data = {
//     list : list
//   }

//   axios.post(urlGetCode,data)
//   .then(resp=>{
//     console.log(resp.data)
//     this.buildTreeArray();
//     this.buildTree();
//     this.forceUpdate();
//     this.saveTree();
//   })
//   .catch(error=>{this.setState({error:error})});
// }
// EnableThese(e){
//   let name = e.target.value
//   if (name==="overview"){
//     this.state.overview = true
//   } else if (name==="syllabus") {
//     this.state.syllabus = true
//   }else if (name==="grade") {
//     this.state.grade = true
//   }else if (name==="assignment") {
//     this.state.assignment = true
//   }
//   e.target.value="adding back"
//   // if (this.assignment_state_1===false){
//   //   window.location.href="/admin"
//   // }
//   this.setState({newChange:true})
//   this.forceUpdate()
// }
// loadAssignmentContent({contentId,branchId,assignmentId}) {
//   console.log("trying to load content")
//   console.log(contentId)
//   console.log(branchId)
//   console.log(assignmentId)
//   // given contentId, get me doenetML
//   if (contentId!=null && branchId!=null){
//     this.selectedAssignmentId = assignmentId
//     this.assignmentName = this.assignment_obj[assignmentId]['name']
//     this.assignment_branchId = this.assignment_obj[assignmentId]['branchId']
//     this.dueDate = this.assignment_obj[assignmentId]['dueDate']
//     this.assignedDate = this.assignment_obj[assignmentId]['assignedDate']
//     this.numberOfAttemptsAllowed = this.assignment_obj[assignmentId]['numberOfAttemptsAllowed']

//     console.log("exists both")
//     const urlGetCode = '/api/getDoenetML.php';
//     const data = {
//       branchId:branchId,
//       contentId:contentId
//       // branchId: "9gBr0dW6tFqqA1UyLEBVD",
//       // contentId: "268edfaf6999ea0182e6ac360854c7d739e35eccbb6384dd193b301de845b707",
//     }
//     const payload = {
//       params: data
//     }
//     axios.get(urlGetCode,payload)
//     .then(resp=>{
//       let doenetML = resp.data.doenetML;
//       console.log("doenetML !")
//       console.log(resp.data)
//       this.updateNumber++;
//       this.doenetML=doenetML;
//       this.mainSection=(<DoenetViewer 
//               key={"doenetviewer"+this.updateNumber} //each component has their own key, change the key will trick Reach to look for new component
//               free={{doenetCode: this.doenetML}} 
//               mode={{
//                 solutionType:this.state.solutionType,
//                 allowViewSolutionWithoutRoundTrip:this.state.allowViewSolutionWithoutRoundTrip,
//                 showHints:this.state.showHints,
//                 showFeedback:this.state.showFeedback,
//                 showCorrectness:this.state.showCorrectness,
//               }}           
//             />)
//             this.activeSection="assignment"
//             console.log("here in loading assignment content")
//             this.updateLocationBar({assignmentId:assignmentId,activeSection:this.activeSection})
//             this.forceUpdate();
//     })
//     .catch(error=>{this.setState({error:error})});
//   } 
//   // else {
//   //   if (assignmentId!=null) {
//   //     console.log(assignmentId)
//   //     // let contentId = this.assignment_obj[assignmentId]['contentId']
//   //   this.assignment_branchId = this.assignment_obj[assignmentId]
    
//   //   // this.assignment_branchId = this.assignment_branchId ['contentId']

//   //     // console.log(contentId)
//   //     console.log(this.assignment_branchId.prototype.valueOf = function (){return name;})
//   //     // loadAssignmentContent({})
//   //   }
//   // }

// }
//   ToggleList(){
//     console.log("=====TOGGLE=====")
//     // this.enabledDisabledArray[this.activeSection]=!this.enabledDisabledArray[this.activeSection];
//     // //console.log("active section is..."+this.activeSection)
//     // if (this.activeSection==="overview"){
//     //   this.setState({overview:this.enabledDisabledArray[this.activeSection]})
//     // }else if (this.activeSection==="grade"){
//     //   this.setState({grade:this.enabledDisabledArray[this.activeSection]})
//     // }else if (this.activeSection==="assignment"){
//     //   this.setState({assignment:this.enabledDisabledArray[this.activeSection]})
//     // }else if (this.activeSection==="syllabus"){
//     //   this.setState({syllabus:this.enabledDisabledArray[this.activeSection]})
//     // }
//     const url = '/api/save_enable_disable_category.php'
//     console.log(this.state.overview)
//     console.log(this.state.grade)
//     console.log(this.state.syllabus)
//     console.log(this.state.assignment)

//     const data = {
//       overview:Number(this.state.overview),
//       grade:Number(this.state.grade),
//       syllabus:Number(this.state.syllabus),
//       assignment:Number(this.state.assignment)
//     }
//     console.log(data)
//     axios.post(url, data)
//     .then(function (response) {
//       // console.log(response);
//       // console.log("-------DATA is---------")
//       // console.log(response.data);
      
//     })
//     .catch(function (error) {
//       this.setState({error:error});

//     })
//     // adding list
//     this.setState({newChange:false})

//     //this.forceUpdate()
//     if (data[this.activeSection]===0){
//       if (data.overview===1){
//         this.loadOverview();
//         this.buildOverview();
//         this.updateLocationBar({});
//       }else if (data.syllabus===1){
//         this.loadSyllabus();
//         this.buildSyllabus();
//         this.updateLocationBar({});
//       }else if (data.grade===1){
//         this.loadGrades();
//         this.buildGrades();
//         this.updateLocationBar({});
//       }else if (data.assignment===1){
//         this.mainSection=(<p>Pick an Assignment</p>);
//         this.updateLocationBar({});
//       }else {
//         this.updateLocationBar({activeSection:null})
//       }
//     }

//   }

//   updateLocationBar(assignmentId=this.assignmentId, activeSection=this.activeSection){
//     console.log("inside updateLocationBar")
//     history.replaceState({},"title","?active="+activeSection);
//     if (assignmentId!=undefined && assignmentId!=null){
//       assignmentId=assignmentId['assignmentId']
//     }
//     console.log(this.activeSection)
//     if (this.activeSection === "assignment") {
//       console.log("assignmentId in")
//       console.log(assignmentId)
//       history.replaceState({},"title","?active="+activeSection+"&assignmentId="+assignmentId);
//     }
//     this.buildTree()
//   }

//   loadOverview(){
//     this.doenetML="";
//     const phpUrl='/api/getDoenetML.php';
//     const data={        
//       branchId: this.overview_branchId,
//       contentId:"",
//       ListOfContentId:"", //this is to store all contentID of one branchID for publish indication 
//       List_Of_Recent_doenetML:[], // this is to store list of (date:doenetML) 
//     }
//     const payload = {
//       params: data
//     }
//     axios.get(phpUrl,payload)
//       .then(resp=>{
//         let doenetML = resp.data.doenetML;
//         this.updateNumber++;
//         this.doenetML=doenetML;
//         this.forceUpdate();
//       })
//       .catch(error=>{this.setState({error:error})});
//   }

//   buildOverview(){
//     this.mainSection = this.loadingScreen;
//     //talk to database to load fresh info
//     this.overview = (<div className="assignmentContent">
//       {/* <h2 data-cy="sectionTitle">Overview</h2>  */}
//       {this.doenetML!=""?
      
//       <DoenetViewer 
//               key={"doenetviewer"+this.updateNumber} //each component has their own key, change the key will trick Reach to look for new component
//               free={{doenetCode: this.doenetML}} 
//               mode={{
//                 solutionType:this.state.solutionType,
//                 allowViewSolutionWithoutRoundTrip:this.state.allowViewSolutionWithoutRoundTrip,
//                 showHints:this.state.showHints,
//                 showFeedback:this.state.showFeedback,
//                 showCorrectness:this.state.showCorrectness,
//               }}           
//             />:null}
//     </div>)

//     this.mainSection = this.overview;
//   }

//   loadSyllabus(){
//     console.log("LOAD Syllabus")
//     this.doenetML="";
//     console.log("branch id...")
//     console.log(this.syllabus_branchId)
//     const phpUrl='/api/getDoenetML.php';
//     const data={        
//       branchId: this.syllabus_branchId,
//       contentId:"",
//       ListOfContentId:"", //this is to store all contentID of one branchID for publish indication 
//       List_Of_Recent_doenetML:[], // this is to store list of (date:doenetML) 
//     }
//     const payload = {
//       params: data
//     }
//     axios.get(phpUrl,payload)
//       .then(resp=>{
//         let doenetML = resp.data.doenetML;
//         console.log("doenetML!!!!!!!!!!!!");
//         console.log(doenetML);
//         this.updateNumber++;
//         this.doenetML=doenetML;
//         this.forceUpdate();
//       })
//       .catch(error=>{this.setState({error:error})});
//   }

//   buildSyllabus(){
//     this.mainSection = this.loadingScreen;

//     //talk to database to load fresh info
//     this.overview = (<React.Fragment>
//       {/* <h2 data-cy="sectionTitle">Syllabus</h2>  */}
//       {this.doenetML!=""?
//       <div><DoenetViewer 
//               key={"doenetviewer"+this.updateNumber} //each component has their own key, change the key will trick Reach to look for new component
//               free={{doenetCode: this.doenetML}} 
//               mode={{
//                 solutionType:this.state.solutionType,
//                 allowViewSolutionWithoutRoundTrip:this.state.allowViewSolutionWithoutRoundTrip,
//                 showHints:this.state.showHints,
//                 showFeedback:this.state.showFeedback,
//                 showCorrectness:this.state.showCorrectness,
//               }}           
//             /></div>:null}   
//     </React.Fragment>)

//     this.mainSection = this.overview;
//   }

//   buildAssignment() {
//     this.mainSection = this.loadingScreen;
//     this.activeSection="assignment"; // this is kept
//     this.selectedAssignmentId=""
//     if (this.finishedContructor === false) {return null;}

//     let disablePrev = false;
//     if (this.assignmentIndex === 0){disablePrev = true;}
//     let disableNext = false;
//     if (this.assignmentIndex === (this.assignmentIdList.length - 1)){disableNext = true;}

//     console.log("-----------this.assignmentObj-------------");
    
//     console.log(this.assignmentObj);

//     let solutionType = "button";
//     if (Number(this.assignmentObj.showSolution) === 0){
//       solutionType = "none";
//     }
//     let showHints = true;
//     if (Number(this.assignmentObj.showHints) === 0){
//       showHints = false;
//     }
//     let showFeedback = true;
//     if (Number(this.assignmentObj.showFeedback) === 0){
//       showFeedback = false;
//     }
//     let showCorrectness = true;
//     if (Number(this.assignmentObj.showCorrectness) === 0){
//       showCorrectness = false;
//     }
//     // TODO: what assignment get un-publish ?
//     console.log("assignment ID OVER HERE !!!!")
//     assignmentID = this.assignmentObj.assignmentId;
//     this.assignmentFragment = <React.Fragment>
//       <div className="assignmentContainer">     
//         <div className="assignmentActivity">
//               {this.assignmentObj.assignmentId?<DoenetViewer 
//               key={"doenetviewer"+this.updateNumber} 
//               free={{
//                 doenetCode: this.assignmentObj.code,
//                 doenetState: this.assignmentObj.latestDocumentState,
//                 requestedVariant:{index:this.assignmentObj.assignedVariant},
//               }} 
//               assignmentId={this.assignmentObj.assignmentId}
//               creditUpdate={this.creditUpdate}
//               attemptNumber={this.assignmentObj.attemptNumber}
//               mode={{
//                 solutionType:solutionType,
//                 allowViewSolutionWithoutRoundTrip:false,
//                 showHints,
//                 showFeedback,
//                 showCorrectness,
//               }}
//               course={true}
//               />:<p>Loading...</p>}
//         </div>
//       </div>
//     </React.Fragment>;

//     this.mainSection = this.assignmentFragment;
//     console.log("from build assignment")
//     this.updateLocationBar(this.assignmentObj.assignmentId);
//     this.forceUpdate();
//   }

//   loadGrades(){
//     this.scores = {};
//     this.subTotals = {};
      
//       const loadGradsUrl='/api/loadGradsLearner.php';
      
//       // this.courseId
//       const data={
//         courseId: this.courseId,
//       }
//       const payload = {
//         params: data
//       }
      
      
//       axios.get(loadGradsUrl,payload)
//         .then(resp=>{
//           this.assignmentsData = resp.data.grades;
//           this.student = resp.data.student;
//           this.course = resp.data.course;
//           this.section = resp.data.section;
//           this.group = resp.data.group;
//           this.forceUpdate();
          
//         })
//         .catch(error=>{this.setState({error:error})});
//   }
  
//   buildGrades(){
    
//     if (this.assignmentsData === null){
//       this.mainSection = this.loadingScreen;
//     }else{
//       this.buildGradesHelper();
//     }

    
//   }

//   buildGradesHelper(){
    
//     this.total = {possible:0,score:0,percentage:'0%'}

//     for (let gcat of this.gradeCategories){
//       this.scores[gcat] = [];
//       this.subTotals[gcat] = {possible:0,score:0,percentage:'0%'};

//       for (let dObj of this.assignmentsData){
//         if (dObj.gradeCategory === gcat){
//           let possible = dObj.totalPointsOrPercent;
//           let percentFLAG = false;
//           if (possible === null){
//             possible = '--';
//             percentFLAG = true;
//           }else{
//             possible = Number(possible);
//             this.subTotals[gcat].possible += possible;
//           }
//           let score = dObj.credit;
//           if (score === null || possible === null){
//             score = '--';
//             percentFLAG = true;
//           }else{
//             score = Number(score)*possible;
//             if (!isNaN(score)){
//               this.subTotals[gcat].score += score;
//             }
//           }
//           let percentage;
//           if (percentFLAG){
//             percentage = '--';
//           }else{
//             percentage = Math.round(score/possible*1000)/10 + '%';
//           }

//           if (isNaN(score)){
//             score = "--";
//           }

//           this.scores[gcat].push({gradeItem:dObj.assignmentName,
//             assignmentId:dObj.assignmentId,
//             possible:possible,
//             score:score,
//             percentage:percentage
//           });
//         }
//       }

//       if (this.subTotals[gcat].score > 0 && this.subTotals[gcat].possible > 0){
//         this.subTotals[gcat].percentage = Math.round(this.subTotals[gcat].score / this.subTotals[gcat].possible*1000)/10 + '%';
//         this.total.score += Number(this.subTotals[gcat].score);
//         this.total.possible += Number(this.subTotals[gcat].possible);
//       }
      
//     }
//     this.total.percentage = '0%';
//     if(!isNaN(this.total.score / this.total.possible*1000)/10){
//       this.total.percentage = Math.round(this.total.score / this.total.possible*1000)/10 + '%';
//     }
 
//     //talk to database to load fresh info
//     this.overview = (<React.Fragment>
//       <h2 data-cy="sectionTitle">Grades</h2>
//       <div style={{marginLeft:"10px"}}>
//         <div>Student: {this.student}</div>
//         {/* <div>Course: {this.course}</div> */}
//         <div>Section: {this.section}</div>
//         {this.group !== '' ? <div>Group: {this.group}</div> : null}
//       </div>
      
      

//       <table id="grades">
//       <tbody>
//         <tr className="colHeadingsRow">
//           <th width="581">Grade item</th>
//           <th width="75">Possible points</th>
//           <th width="56">Score</th>
//           <th width="95">Percentage</th>
//         </tr>

//       { this.gradeCategories.map( cat => <React.Fragment key={'option'+cat}>
      
//         <tr>
//           <td className="typeHeadingRow" colSpan="4">{cat}</td>
//         </tr>
     

//         {this.scores[cat].map(
//           (score)=><React.Fragment key={'score_row'+score.assignmentId}>
//           <tr className="typeDataRow"> 
//             <td><span className="assignmentLink" onClick={()=>{
//               this.buildAssignmentGrades({assignment:score});
              
//             }}>{score.gradeItem}</span></td>
//             <td>{score.possible}</td>
//             <td>{score.score}</td>
//             <td>{score.percentage}</td>
//           </tr>
//           </React.Fragment>
//         )}

//         <tr className="typeSubTotalDataRow"> 
//           <td><span>Subtotal for {cat}</span></td>
//           <td>{this.subTotals[cat].possible}</td>
//           <td>{this.subTotals[cat].score}</td>
//           <td>{this.subTotals[cat].percentage}</td>
//         </tr>
        

//       </React.Fragment>)}

        
//         <tr className="colTotalRow">
//           <td>Total</td>
//           <td>{this.total.possible}</td>
//           <td>{this.total.score}</td>
//           <td>{this.total.percentage}</td>
//         </tr>
       
//         </tbody>
//       </table>
//     </React.Fragment>)
//     this.mainSection = this.overview;
//   }

//   buildAssignmentGrades({assignment}){
//     this.mainSection = this.loadingScreen;
//     this.assignment = assignment;
//     this.assignmentId = assignment.assignmentId;

//       const url='/api/loadItemGrades.php';
      
//       const data={
//         courseId: this.courseId,
//         assignmentId: assignment.assignmentId,
//       }
//       const payload = {
//         params: data
//       }
      
      
//       axios.get(url,payload)
//         .then(resp=>{
//           this.assignmentItems = resp.data.assignmentItems;

//           this.latestAttemptNumber = resp.data.attemptNumber;
//           this.latestAttemptCredit = resp.data.attemptCredit;

//           this.buildAssignmentGradesHelper();
//         })
//         .catch(error=>{this.setState({error:error})});
//   }

//   buildAssignmentGradesHelper(){
//     let latestAttemptPercentage = Math.round(Number(this.latestAttemptCredit)*10000,2)/100;
//     latestAttemptPercentage = `${latestAttemptPercentage}%`;
//     for (var item of this.assignmentItems){
//       let percentage = Math.round(Number(item.credit)*10000,2)/100;
//       item.percentage = `${percentage}%`;
      
//     }


//     this.mainSection = (<React.Fragment>
//       <button onClick={()=>{
//         this.buildGradesHelper({data:this.assignmentsData});
//       }}>Back to grades</button>
//       <h2 style={{marginLeft:"10px"}}>{this.assignment.gradeItem}</h2>
//       {this.latestAttemptNumber > 1 ? <p style={{marginLeft:"10px",fontSize:"16px"}}>Attempt Number: {this.latestAttemptNumber} </p>: null }

//       <table id="grades" style={{width:"400px"}}>
//       <tbody>
//         <tr className="colHeadingsRow">
//           <th width="581">Grade item</th>
//           <th width="95">Percentage</th>
//         </tr>

//         {this.assignmentItems.map(
//           (item)=><React.Fragment key={'assignmentItem'+item.title}>
//           <tr className="typeDataRow"> 
//             <td><span className="assignmentLink" onClick={()=>{
//               // this.buildAssignmentGrades({assignment:score});
//               this.buildItemGrade({item});
              
//             }}>{item.title}</span></td>
//             <td>{item.percentage}</td>
//           </tr>
//           </React.Fragment>
//         )}

        
//         {this.latestAttemptNumber > 1 ? 
//           <tr className="colTotalRow">
//             <td>Total for attempt {this.latestAttemptNumber}</td>
//           <td>{latestAttemptPercentage}</td>
//           </tr>
//           : null }
          
//         <tr className="colTotalRow">
//           <td>Total</td>
//           <td>{this.assignment.percentage}</td>
//         </tr>
//         </tbody>
//         </table>
//       </React.Fragment>);

//     this.forceUpdate();

//   }

//   buildItemGrade({item}){


//     const url='/api/loadItemAttemptGrades.php';
      
//       // this.courseId
//       const data={
//         assignmentId: this.assignmentId,
//         itemNumber: item.itemNumber,
//         attemptNumber: this.latestAttemptNumber,
//       }
//       const payload = {
//         params: data
//       }
      
      
//       axios.get(url,payload)
//         .then(resp=>{
          
//           this.buildAttemptItemGradesHelper({
//             itemTitle:item.title,
//             itemState:resp.data.itemState,
//             submissionNumber:resp.data.submissionNumber,
//             submittedDate:resp.data.submittedDate,
//             valid:resp.data.valid,
//             });
//         })
//         .catch(error=>{this.setState({error:error})});
    
//   }

//   buildAttemptItemGradesHelper({itemTitle, itemState, submissionNumber, submittedDate, valid, }){
//     console.log('itemState');
//     console.log(itemState);
    
//     this.mainSection = (<React.Fragment>
//       <button onClick={()=>{
//         this.buildGradesHelper({data:this.assignmentsData});
//       }}>Back to grades</button>
//       <button onClick={()=>{
//         this.buildAssignmentGradesHelper();
//       }}>Back to {this.assignment.gradeItem}</button>
//     <h2 style={{marginLeft:"10px"}}>{this.assignment.gradeItem}: {itemTitle}</h2>
//       {this.latestAttemptNumber > 1 ? <p style={{marginLeft:"10px",fontSize:"16px"}}>Attempt Number: {this.latestAttemptNumber} </p>: null }

//             <DoenetViewer 
//             key={"doenetviewer"} 
//             free={{
//             doenetState: itemState,
//           }} 
//           course={true}
//             attemptNumber={this.latestAttemptNumber}
//               mode={{
//                 solutionType:"displayed",
//                 allowViewSolutionWithoutRoundTrip:false,
//                 showHints:false,
//                 showFeedback:true,
//                 showCorrectness:true,
//                 interactive:false,
//               }}
//             />

//     </React.Fragment>);
//     this.forceUpdate();
//   }

//   setAssignmentObj({outlineType}){
//     if (outlineType === "outline"){
//       this.assignmentObj = this.assignmentIdList[this.assignmentIndex];
//     } else if (outlineType === "assignment"){
//       this.assignmentObj = this.assignmentAssignedList[this.assignmentIndex];
//     } else if (outlineType === "due"){
//       this.assignmentObj = this.assignmentDueList[this.assignmentIndex];
//     } 
//   }



//   updateAssignmentList({outlineType}) {
//     if (outlineType === "outline"){
//       this.buildOutline({courseId:this.courseId});
//     }else if (outlineType === "assignment"){
//       this.buildAssignmentList({courseId:this.courseId});
//     }else{
//       this.buildDueList();
//     } 
//   }

//   resolveVariant({outlineType}){
    
//     if (this.assignmentObj.assignedVariant === undefined || this.assignmentObj.assignedVariant === null){
//       this.assignmentObj.attemptNumber = 1;

//       if (Number(this.assignmentObj.multipleAttempts) === 1){

//         //VariantIndex is the same offline and online
//         this.assignmentObj.assignedVariant = this.variantNumberFromAttemptNumber();
//       }else{
//         this.assignmentObj.assignedVariant = 0;
//       }

     
//       //Save assignedVariant to DB
//       // no saveVariant.php
//     //   const url='/api/saveVariant.php';
//     // const data={
//     //   assignmentId: this.assignmentObj.assignmentId,
//     //   assignedVariant:this.assignmentObj.assignedVariant,
//     //   attemptNumber:this.assignmentObj.attemptNumber,
//     //   contentId:this.assignmentObj.contentId,
//     // }
//     // const payload = {
//     //   params: data
//     // }
//     // console.log("saveVariant data");
//     // console.log(data);
    
    
//     // axios.get(url,payload)
//     //   .then(resp=>{
//     //     console.log(resp.data);
//     //   });
      
//     }
    

//   }

//   variantNumberFromAttemptNumber(){
//     let preseed = this.assignmentObj.attemptNumber+this.assignmentObj.assignmentId
//     if(Number(this.assignmentObj.individualize) === 1){
//       preseed += this.username;
//     }
//     let seed = hashStringToInteger(preseed);

//     let rng = new MersenneTwister(seed);
//     let randomNumber = rng.random();
//     return Math.floor(randomNumber * 1000000000);
//   }

//   assignmentDataToCourseInfo({courseId,data}){
        
//     this.courseInfo[courseId] = {};
//     this.courseInfo[courseId].heading = {};
//     let parentHeadingIds = [];
    
//     let prevLoopLevel = 1;
//     let potentialParentHeadingId = "";
//     for(let i = 0; i < data.headingText.length; i++){

//         let headingText = data.headingText[i];
//         let headingLevel = data.headingLevel[i];
//         let headingId = data.headingId[i];
//         if (prevLoopLevel < headingLevel){
//             if (potentialParentHeadingId !== ""){
//                 parentHeadingIds.push(potentialParentHeadingId);
//             }
//         }else if (prevLoopLevel > headingLevel){
//             for (var x = 0; x < (prevLoopLevel - headingLevel); x++){
//                 parentHeadingIds.pop();
//             }
//         }
        

//         let baseObj = this.courseInfo[courseId];
//         for (let headingId of parentHeadingIds){
//             baseObj = baseObj.heading[headingId];
//         }
        
//         if (baseObj.headingsOrder === undefined){
//             baseObj.headingsOrder = [];
//             baseObj.heading = {};
//         }
        
//         // Add the heading information to the base object
//         baseObj.headingsOrder.push({
//                 courseHeadingId:headingId,
//                 headingText:headingText,
//             });
//         baseObj.heading[headingId] = {};
//         if (data.assignments[headingId] !== undefined){
//                 baseObj.heading[headingId].assignmentOrder = [];
//                 baseObj.heading[headingId].assignments = {};
//                 for (let assignmentInfo of data.assignments[headingId]){
//                 baseObj.heading[headingId].assignmentOrder.push(assignmentInfo.assignmentId);  
                
                  
//                   baseObj.heading[headingId].assignments[assignmentInfo.assignmentId] = {
//                     documentName:assignmentInfo.assignmentName,
//                     code:assignmentInfo.doenetML,
//                     latestDocumentState: assignmentInfo.latestDocumentState,
//                     docTags:[],
//                     contentId:assignmentInfo.contentId,
//                     sourceBranchId:assignmentInfo.sourceBranchId,
//                     dueDate:assignmentInfo.dueDate,
//                     assignedDate:assignmentInfo.assignedDate,
//                     individualize:assignmentInfo.individualize,
//                     multipleAttempts:assignmentInfo.multipleAttempts,
//                     showSolution:assignmentInfo.showSolution,
//                     showFeedback:assignmentInfo.showFeedback,
//                     showHints:assignmentInfo.showHints,
//                     showCorrectness:assignmentInfo.showCorrectness,
//                     proctorMakesAvailable:assignmentInfo.proctorMakesAvailable,
//                     dueDateOverride:assignmentInfo.dueDateOverride,
//                     timeLimitOverride:assignmentInfo.timeLimitOverride,
//                     numberOfAttemptsAllowedOverride:assignmentInfo.numberOfAttemptsAllowedOverride,
//                     attemptNumber:assignmentInfo.attemptNumber,
//                     assignedVariant:assignmentInfo.assignedVariant,
//                     generatedVariant:assignmentInfo.generatedVariant,
//                     totalPointsOrPercent:assignmentInfo.totalPointsOrPercent,
//                     credit:assignmentInfo.credit,
//                     proctorMakesAvailable:assignmentInfo.proctorMakesAvailable,


//                 };
              
                
//             }
            
//         }


//         prevLoopLevel = headingLevel;
//         potentialParentHeadingId = headingId;
//     }

//   }

//   componentDidCatch(error, info){
//     this.setState({error:error,errorInfo:info});
//   }


//   generateNewAttempt(){
//       this.assignmentObj.attemptNumber++;
//       this.assignmentObj.assignedVariant = this.variantNumberFromAttemptNumber();
//       this.assignmentObj.latestDocumentState = null;
//       this.updateNumber++;
//       //Save attempt number to database
//         //Save assignedVariant to DB
//         const url='/api/saveVariant.php';
//       const data={
//         assignmentId: this.assignmentObj.assignmentId,
//         assignedVariant:this.assignmentObj.assignedVariant,
//         attemptNumber:this.assignmentObj.attemptNumber,
//         contentId:this.assignmentObj.contentId,
//       }
//       const payload = {
//         params: data
//       }
//       console.log("saveVariant on Generate New Attempt data");
//       console.log(data);
      
      
//       axios.get(url,payload)
//         .then(resp=>{
//           console.log(resp.data);
//         });
        
//       this.forceUpdate();
//   }
//   loadAssignment({assignmentId,outlineType=this.state.outlineType}){
//     this.updateAssignmentIndex({outlineType:outlineType,assignmentId:assignmentId});
//     this.courseOutlineList = [];
//     this.updateNumber++;
//     this.assignmentId = assignmentId;
//     this.setAssignmentObj({outlineType:this.state.outlineType});
//     this.resolveVariant({outlineType:this.state.outlineType});
//     this.updateAssignmentList({outlineType:this.state.outlineType});
//     console.log("from loadAssignment")
//     this.updateLocationBar();
//     this.forceUpdate();
//   }

//   handlePrev(){
//     if (this.assignmentIndex > 0) this.assignmentIndex = this.assignmentIndex-1;
//     this.courseOutlineList = [];
//     this.updateNumber++;
//     this.setAssignmentObj({outlineType:this.state.outlineType});
//     this.resolveVariant({outlineType:this.state.outlineType});
//     this.updateAssignmentList({outlineType:this.state.outlineType});
//     console.log("from handlePrev")
//     this.updateLocationBar();
//     this.forceUpdate();
//   }

//   handleNext(){
//     if (this.assignmentIndex < this.assignmentIdList.length - 1) this.assignmentIndex = this.assignmentIndex+1;
//     console.log(this.assignmentIndex);
//     console.log(this.assignmentIdList.length);
//     this.courseOutlineList = [];
//     this.updateNumber++;
//     this.setAssignmentObj({outlineType:this.state.outlineType});
//     this.resolveVariant({outlineType:this.state.outlineType});
//     this.updateAssignmentList({outlineType:this.state.outlineType});
//     console.log("from handleNext")
//     this.updateLocationBar();
//     this.forceUpdate();
//   }

//   updateAssignmentIndex({outlineType,assignmentId=this.assignmentObj.assignmentId}){
//     this.assignmentIndex = 0;
//     console.log(assignmentId)

//     if (outlineType === "outline"){
//       for (let [index,assignmentObj] of this.assignmentIdList.entries()){
//         if (assignmentObj.assignmentId === assignmentId){
//           this.assignmentIndex = index;
//           break;
//         }
//       }

//     }else if (outlineType === "assignment"){
//       for (let [index,assignmentObj] of this.assignmentAssignedList.entries()){
//         if (assignmentObj.assignmentId === assignmentId){
//           this.assignmentIndex = index;
//           break;
//         }
//       }
//     }else if (outlineType === "due"){
//       for (let [index,assignmentObj] of this.assignmentDueList.entries()){
//         if (assignmentObj.assignmentId === assignmentId){
//           this.assignmentIndex = index;
//           break;
//         }
//       }
//     }


//   }

//   creditUpdate({credit}){

//     if (credit > this.assignmentObj.credit || !this.assignmentObj.credit){
//       this.assignmentObj.credit = credit;
//     }
//     this.forceUpdate();
//   }

//   render() {
//     console.log("====RENDER====");
//     if (this.state.newChange===true){
//     this.ToggleList();
//     }
//     this.enableThese=[]
//     this.enabledDisabledArray = {
//       "overview":!!+this.state.overview,
//       "syllabus":!!+this.state.syllabus,
//       "grade":!!+this.state.grade,
//       "assignment":!!+this.state.assignment,
//     }
//     Object.keys(this.enabledDisabledArray).map(e=>{
//       if (this.enabledDisabledArray[e]===false){
//         this.enableThese.push(<option value={e}>{e}</option>)
//       }
//     });
//         this.TrueList = []
//     Object.keys(this.enabledDisabledArray).map(e=>{
//       if (this.enabledDisabledArray[e]===true){
//         this.TrueList.push(e)
//       }
//     });
//     let temp = false
//     this.TrueList.forEach(e=>{
//       if (e===this.activeSection && temp===false){
//         temp=true
//       }
//     });
//     if ( this.DoneLoading===true && temp===false && this.activeSection!=null){
//       this.activeSection=this.TrueList[0]
//       console.log("this might")
//       this.updateLocationBar() // this make sure it has the correct URL
//     }

//     //We have an error so doen't show the viewer
//     if (this.state.error){

//       return (<React.Fragment>
//         <p style={{color: "red"}}>{this.state.error && this.state.error.toString()}</p>
//         </React.Fragment>);
//     }

//     if (this.activeSection === "overview"){
//        this.buildOverview();
//     } else if (this.activeSection === "syllabus"){
//       this.buildSyllabus();
//     } else if (this.activeSection === "grade"){
//       this.buildGrades();
//     }
//     let overview_component=null;
//     let syllabus_component=null;
//     let grade_component=null;
//     let assignment_component=null;
//     let overview_class = "SectionContainer";
//     let syllabus_class = "SectionContainer";
//     let grade_class = "SectionContainer";
//     let assignment_class = "SectionContainer";
//     /**
//      * how can we tell that the current tree is saved ?
//      * answer: maybe we need a flag to indicate you have saved the current tree
//      * for now: we havent have such flag yet
//      */
//     if (this.activeSection==="overview"){
//       overview_class = "SectionContainer-Active";
//     } else if (this.activeSection === "syllabus"){
//       syllabus_class = "SectionContainer-Active";
//     } else if (this.activeSection === "grade"){
//       grade_class = "SectionContainer-Active";
//     } else if (this.activeSection === "assignment"){
//       assignment_class = "SectionContainer-Active";
//     }
//     let ModifyTreeInsertAssignmentHeadingModeComponent=
//     (<div>
//       <div className={assignment_class} onClick={()=>{
//       this.activeSection = "assignment";
//       this.updateLocationBar({});
//       this.forceUpdate()
//       this.mainSection=(<div><h4>Assignments</h4><p>Select an assignment</p></div>);
//     }}>
//       <span className="Section-Text">Assignments</span>
//       <span className="Section-Icon-Box">         
//         <FontAwesomeIcon className="Section-Icon" onClick={()=>window.location.href="/editor/?branchId="+this.overview_branchId} icon={faEdit}/></span>
//       <span className="Section-Icon-Box">         
//         <FontAwesomeIcon className="Section-Icon" onClick={()=>{this.setState({assignment:false,newChange:true});}} icon={faWindowClose}/></span>
//         </div>

//       <button className={this.enableMode==="position"?"selectedEnableButton":"button"} data-cy="modifyTree"
//       onClick={()=>{this.enableMode='position';this.buildTree();this.forceUpdate()}}>Modify position</button>

//       <button className={this.enableMode==="remove"?"selectedEnableButton":"button"} data-cy="removeTree"
//       onClick={()=>{this.enableMode='remove';this.buildTree();this.forceUpdate()}}>Remove tree</button>

//       <button className={this.enableMode==='header'?"selectedEnableButton":"button"} data-cy="addHeader"
//       onClick={()=>{this.enableMode='header';this.buildTree();this.forceUpdate()}}>Add Header</button>

//       <button className={this.enableMode==='assignment'?"selectedEnableButton":"button"} data-cy="addAssignment"
//       onClick={()=>{this.enableMode='assignment';this.buildTree();this.forceUpdate()}}>Add Assignment</button>

//     </div>);
//       let tree_component = (<div >{this.tree}</div>)

//     if (this.state.overview){
//        overview_component = (<div className={overview_class} data-cy="overviewNavItem" onClick={() => {
//         this.activeSection = "overview";
//         this.selectedAssignmentId=""
//         this.loadOverview();
//         this.updateLocationBar({});
//         this.forceUpdate();
//       }}><span className="Section-Text">Overview</span>
//       <span className="Section-Icon-Box">         
//         <FontAwesomeIcon className="Section-Icon" onClick={()=>window.location.href="/editor/?branchId="+this.overview_branchId} icon={faEdit}/></span>
//       <span className="Section-Icon-Box">         
//         <FontAwesomeIcon className="Section-Icon" onClick={()=>{this.setState({overview:false,newChange:true});}} icon={faWindowClose}/></span>
//       </div>)
//     }
//     if (this.state.syllabus){
//        syllabus_component =(
//         <div className={syllabus_class} data-cy="syllabusNavItem" onClick={() => {
//           this.activeSection = "syllabus";
//           this.loadSyllabus();
//           this.updateLocationBar({});
//           this.selectedAssignmentId=""
//           this.buildTree()
//           this.forceUpdate();
//         }}><span className="Section-Text">Syllabus</span>
//           <span className="Section-Icon-Box">         
//         <FontAwesomeIcon className="Section-Icon" onClick={()=>window.location.href="/editor/?branchId="+this.syllabus_branchId} icon={faEdit}/></span>
//       <span className="Section-Icon-Box">         
//         <FontAwesomeIcon className="Section-Icon" onClick={()=>{this.setState({syllabus:false,newChange:true});}} icon={faWindowClose}/></span>
//         </div>)
//     }
//     if (this.state.grade){
//        grade_component = (<div className={grade_class} data-cy="gradesNavItem" onClick={() => {
//         this.activeSection="grade";
//         this.selectedAssignmentId=""
//         this.loadGrades();
//         this.updateLocationBar({});
//          this.forceUpdate();
//         // className="GradeDisableButton" onClick={()=>{this.setState({grade:false,newChange:true});}}
//       }}><span className="Section-Text">Grade</span>
//       <span className="Section-Icon-Box">         
//     <FontAwesomeIcon className="Section-Icon" icon={faEdit}/></span>
//   <span className="Section-Icon-Box">
//     <FontAwesomeIcon className="Section-Icon" onClick={()=>{this.setState({grade:false,newChange:true});}} icon={faWindowClose}/></span>
//       </div>)
//     }

  
//     return (<React.Fragment>
//       <div className="courseContainer">
        
//         <DoenetHeader toolTitle="Admin" headingTitle={this.courseName} />
//         <div className="homeLeftNav">
//           {overview_component}
//           {syllabus_component}
//           {grade_component}
//           {/* {assignment_component} */}
//           {this.state.assignment?ModifyTreeInsertAssignmentHeadingModeComponent:null}
//           {this.state.assignment?tree_component:null}
          
//         <select style={{marginTop:"10px"}} onChange={this.EnableThese}>
//           <option>Enable Section</option>
//           {this.enableThese }
//         </select>
//         </div>
//         <div className="homeActiveSection">
//           {this.mainSection}
//           {/* {this.state.loading ? (<div>Loading...</div>): this.mainSection} */}
//         </div>
//         <div className="info">
//         <span className="Section-Icon-Box">         
//         <FontAwesomeIcon className="Section-Icon" onClick={()=>window.location.href="/editor/?branchId="+this.assignment_branchId} icon={faEdit}/></span>
//           <p>Assignment Name: {this.assignmentName?this.assignmentName:"not yet assigned"}</p>
//           <p>Due Date: {this.dueDate?this.dueDate:"not yet assigned"}</p>
//           <p>assigned Date: {this.assignedDate?this.assignedDate:"not yet assigned"}</p>
//           <p>number Of Attempts Allowed: {this.numberOfAttemptsAllowed?this.numberOfAttemptsAllowed:"not yet assigned"}</p>
//         </div>
//       </div>
      
//     </React.Fragment>);

//     let disablePrev = false;
//     if (this.assignmentIndex === 0){disablePrev = true;}
//     let disableNext = false;
//     if (this.assignmentIndex === (this.assignmentIdList.length - 1)){disableNext = true;}
//   }
// }






// export default DoenetAdmin;