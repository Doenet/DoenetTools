import React, { Component } from 'react';
import DoenetViewer from '../React/DoenetViewer';
import axios from 'axios';
import './course.css';
import nanoid from 'nanoid';
import query from '../queryParamFuncs';
import DoenetBox from '../React/DoenetBox';
import { faWindowClose, faEdit, faArrowLeft, faPlus, faUserSecret } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ToolLayout from "./ToolLayout/ToolLayout";
import ToolLayoutPanel from "./ToolLayout/ToolLayoutPanel";
import Menu from './menu.js'
import SelectionSet from "./Selector/SelectionSet";
import DoenetAssignmentTree from "./DoenetAssignmentTree"

import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

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
  render() {
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
  loadOverview() {
    console.log("loading overview")
    this.doenetML = "";
    const phpUrl = '/api/getDoenetML.php';
    const data = {
      branchId: this.props.branchID,
      contentId: "",
      ListOfContentId: "", //this is to store all contentID of one branchID for publish indication 
      List_Of_Recent_doenetML: [], // this is to store list of (date:doenetML) 
    }
    const payload = {
      params: data
    }
    axios.get(phpUrl, payload)
      .then(resp => {
        let doenetML = resp.data.doenetML;
        this.updateNumber++;
        this.doenetML = doenetML;
        //console.log("forceUpdate from class Overview !!!")
        this.forceUpdate();
      })
      .catch(error => { this.setState({ error: error }) });
  }
  buildOverview() {
    this.mainSection = this.loadingScreen;
    //talk to database to load fresh info
    this.overview = (<div className="assignmentContent">
      {/* <h2 data-cy="sectionTitle">Overview</h2>  */}
      {this.doenetML != "" ?

        <DoenetViewer
          key={"doenetviewer"}
          // free={{doenetCode: this.doenetML}}
          doenetML={this.doenetML}
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
        /> : null}
    </div>)

    this.mainSection = this.overview;
  }
  render() {
    // this.buildOverview();
    // this.doenetML=""?this.loadOverview():console.log("ML exists")
    return (
      <div data-cy="overviewNavItem">
        <span className="Section-Text">new_Overview6</span>
        {this.doenetML != "" ?
          <DoenetViewer
            key={"doenetviewer"}
            // free={{doenetCode: this.doenetML}}
            doenetML={this.doenetML}
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
          /> : null}
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
  loadSyllabus() {
    this.doenetML = "";
    const phpUrl = '/api/getDoenetML.php';
    const data = {
      branchId: this.props.branchID,
      contentId: "",
      ListOfContentId: "", //this is to store all contentID of one branchID for publish indication 
      List_Of_Recent_doenetML: [], // this is to store list of (date:doenetML) 
    }
    const payload = {
      params: data
    }
    axios.get(phpUrl, payload)
      .then(resp => {
        let doenetML = resp.data.doenetML;
        this.updateNumber++;
        this.doenetML = doenetML;
        //console.log("forceUpdate from class Syllabus !!!")
        this.forceUpdate();
      })
      .catch(error => { this.setState({ error: error }) });
  }

  buildSyllabus() {
    this.mainSection = this.loadingScreen;
    //talk to database to load fresh info
    this.syllabus = (<React.Fragment>
      {/* <h2 data-cy="sectionTitle">Syllabus</h2>  */}
      {this.doenetML != "" ?
        <div><DoenetViewer
          key={"doenetviewer"}
          // free={{doenetCode: this.doenetML}}
          doenetML={this.doenetML}
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
        /></div> : null}
    </React.Fragment>)

    this.mainSection = this.syllabus;
  }
  render() {
    // this.buildSyllabus();
    // this.doenetML=""?this.loadSyllabus():console.log("ML exists")
    return (
      <div data-cy="syllabusNavItem">
        <span className="Section-Text">new_Syllabus3</span>
        {this.doenetML != "" ?

          <DoenetViewer
            key={"doenetviewer"}
            // free={{doenetCode: this.doenetML}}
            doenetML={this.doenetML}
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
          /> : null}
      </div>
    )
  }
}

class Grades extends Component {
  constructor(props) {
    super(props);
    //this.props.student, this.props.sections, this.props.group,
    // this.props.gradeCategories, this.props.score, this.props.subtotal
    // this.props.total
    //console.log("GRADE CONSTRUCTOR")
    // console.log(this.props.student)
    // console.log(this.props.sections)
    // console.log(this.props.group)
    // console.log(this.props.gradeCategories)
    // console.log(this.props.score)
    // console.log(this.props.subtotal)
    // console.log(this.props.total)
    // this.student = this.props.student
    // this.sections = this.props.sections
    // this.group = this.props.group
    // this.gradeCategories = this.props.gradeCategories
    // this.score = this.props.score
    // this.subtotal = this.props.subtotal
    // this.total = this.props.total

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
  trclick() { 
    // console.log('tr clicked') 

 };
  tdclick(event) {
    //console.log(event)
  }

  render() {
    //console.log("===GRADES===")
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
                  <td onClick={() => { this.tdclick() }}
                  >
                    {/* {score.gradeItem} */}
                    <Link to={`/assignments/${score.assignmentId}`} className="assignmentLink"
                      onClick={() => { this.props.parentFunction(score.assignmentId) }}
                    >{score.gradeItem}
                    </Link>
                  </td>
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
        // free={{
        //   doenetState: this.itemState,
        // }}
        doenetML={this.doenetML}

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
    //console.log("from assignments")
    //console.log(this.assignmentDoenetML)

  }
  render() {
    return (
      // <React.Fragment>

      <>
        {/* <span className="Section-Text">Assignment is loading if not already here</span> */}
        {this.assignmentDoenetML != "" && this.assignmentDoenetML != null ?

          <DoenetViewer
            key={"doenetviewer" + this.assignmentDoenetML}
            // free={{doenetCode: this.assignmentDoenetML}}
            doenetML={this.assignmentDoenetML}

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
          /> : <p>Not yet available</p>}
      </>

      // </React.Fragment>
    )
  }
}
class DoenetCourse extends Component {
  constructor(props) {
    super(props);
    this.selectedCourseId = 0;
    this.parentUpdateDownloadPermission = true
    this.permissionRoles = {}
    this.rightToEdit = false
    this.rightToView = false
    // this.instructorRights = false
    this.assignmentIndex = 0;
    this.loadingScreen = (<React.Fragment><p>Loading...</p></React.Fragment>);
    this.showSelectionItem = true;
    this.editCategoryButton = null
    this.switchCategoryButton = null
    this.state = { currentNode: null };
    this.AssignmentInfoPackageReady = false
    this.thisAssignmentInfo = ""
    this.grade_route = null
    this.assignmentName = null;
    this.individualize = false;
    this.multipleAttempts = false;
    this.showSolution = false;
    this.showFeedback = false;
    this.showHints = false;
    this.showCorrectness = false;
    this.proctorMakesAvailable = false;
    this.assignment_branchId = null;
    this.dueDate = "";
    this.gradeCategory = ""
    this.totalPointsOrPercent = ""
    this.assignedDate = "";
    this.timeLimit = null;
    this.numberOfAttemptsAllowed = 0;
    this.assignmentsIndexAndDoenetML = {}
    this.coursesToChoose = {}
    this.allElementsCopy = {}
    this.listOfOptions = ["None", "Gateway", "Problem Sets", "Projects", "Exams", "Participation"]

    this.alreadyHadAssignmentsIndexAndDoenetML = false
    const envurl = '/api/env01.php';
    // this.adminAccess = 0;
    // this.accessAllowed = 0;
    this.roleStudent = 0;
    this.roleInstructor = 0;
    this.phone_info_style = {}

    this.coursesPermissions = {}
    axios.get(envurl)
      .then(resp => {
        this.coursesPermissions = resp.data
        //console.log("forceUpdate from getting this.coursesPermissions !!!")
        this.forceUpdate();
      });




    let url_string = window.location.href;
    var url = new URL(url_string);

    this.username = "";
    this.assignmentOnScreen = false;
    this.treeOnScreen = true;
    this.courseId = "aI8sK4vmEhC5sdeSP3vNW"; //Temporary TODO: Choose courses
    this.courseName = "";
    this.alreadyLoadAllCourses = false;
    this.gradeCategories = ['Gateway', 'Problem Sets', 'Projects', 'Exams', 'Participation'];
    this.assignmentId = url.searchParams.get("assignmentId");
    this.activeSection = window.location.hash.substring(2);
    // console.log("active section is "+this.activeSection)
    this.assignment_state_1 = url.searchParams.get("assignment"); // get false

    this.courseId = COURSE_ID // TODO: get from url
    this.scores = {};
    this.subTotals = {};
    this.gradeCategories = ['Gateway', 'Problem Sets', 'Projects', 'Exams', 'Participation'];
    this.resetTreeArray = false
    this.gradeComponent = null
    this.enableThese = []
    this.alreadyLoadAssignment = []
    this.loadFirstTrue = null;
    this.trueList = []
    this.assignmentTree = null;
    this.showsAllAssignment = false;
    this.alreadyMadeTree = false;
    this.LoadAssignmentFromTheBeginningFlag = false;
    this.loadAssignmentFromGrade = false;
    this.assignmentDoenetML = ""
    this.ListOfAlreadyDownLoadDoenetML = {}  // {assignmentId:doenetML}
    this.overview_branchId = ""
    this.syllabus_branchId = ""
    this.selectedAssignmentId = ""
    this.alreadyLoadOverview = false;
    this.Overview_doenetML = ""
    this.alreadyLoadSyllabus = false;
    this.Syllabus_doenetML = ""
    this.componentLoadedFromNavigationBar = null;
    this.newChange = false
    this.state = {
      courseId: "",
      error: null,
      errorInfo: null,
      outlineType: "outline",
      overview: null,
      grade: null,
      assignment: null,
      syllabus: null,
      showTree: false,
      selectedAssignmentId: "",
      newChange: false,
      error: null,
      errorInfo: null,
      dataLoaded: false,
      headerRoleFromLayout: {
        permissionRoles: {},
        currentRole: 'N/A',

      }
    };


    this.assignmentsData = null;
    this.DoneLoading = false;
    this.assignments_and_headings_loaded = false;
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
    this.result_arr = [];
    const url_header_assignment = "/api/getHeaderAndAssignmentInfo.php";
    this.arr_return = [];
    this.id_arr = [];
    this.courseIdsArray = []
    this.assignmentName = "";
    this.assignment_branchId = null;
    this.dueDate = null;
    this.assignedDate = null;
    this.numberOfAttemptsAllowed = null;

    this.AddedAssignmentObjArray = [
      // this contains contentIds NOT assignmentId,
      // assignmentId created 
      'T0XvjDItzSs_GXBixY8fa',
      'z3rOQm9o6XXjInAZrz6tV',
      'nwrAL9TIEup9ItRdqYhfR'
    ]
    this.makeTreeArray = []; // filled in buildTreeArray
    this.tree = [] // made in buildTree
    this.tree_route = []
    this.tree_route_right_column = []
    this.alreadyMadeLink = []
    this.headerId_arr = []
    this.assignmentId_arr = []
    this.doenetML = ""
    // this.buildTreeArray()
    // this.buildTree()
    this.obj_return = {};
    this.heading_obj = {};
    this.assignment_obj = {};
    this.listOfAssignmentIdNeedDeletingFromDB = []
    this.enableMode = "remove"

    this.overview_link = null;
    this.syllabus_link = null;
    this.grade_link = null;
    this.assignment_link = null;
    this.assignmentIsClicked = false;


    this.enableOverview = false
    this.enableSyllabus = false
    this.enableGrade = false
    this.enableAssignment = false


    this.loadAllCourses()

    this.courseInfo = {};
    this.alreadyHasCourseInfo = false
    this.finishedContructor = false;




    //Get code and mode from the database
    const loadOutlineUrl = '/api/loadOutline.php';
    const data = {
      courseId: this.courseId,
    }
    const payload = {
      params: data
    }



    this.usingDefaultCourseId = true
    this.updateNumber = 0;
    this.buildAssignmentGrades = this.buildAssignmentGrades.bind(this);
    this.buildItemGrade = this.buildItemGrade.bind(this);
    this.findEnabledCategory = this.findEnabledCategory.bind(this)
    this.buildAttemptItemGradesHelper = this.buildAttemptItemGradesHelper.bind(this);
    this.loadGrades = this.loadGrades.bind(this);
    this.loadOverview = this.loadOverview.bind(this);
    this.buildTree = this.buildTree.bind(this);
    this.makeTreeVisible = this.makeTreeVisible.bind(this);
    this.deleteHeader = this.deleteHeader.bind(this);
    this.deleteAssignment = this.deleteAssignment.bind(this);
    this.moveHeaderDown = this.moveHeaderDown.bind(this);
    this.moveHeaderUp = this.moveHeaderUp.bind(this);
    this.addAssignmentIdsUnderHeader = this.addAssignmentIdsUnderHeader.bind(this)
    this.axiosDeleteAssignmentFromDB = this.axiosDeleteAssignmentFromDB.bind(this)
    this.ToggleList = this.ToggleList.bind(this);

  }

  getCurrentRole(roles) {
    const keys = Object.keys(roles);
    if (!!keys.length) {
      return roles[keys[0]].showText;
    } else {
      return 'N/A';
    }
    this.loadCourseHeadingsAndAssignments = this.loadCourseHeadingsAndAssignments.bind(this);
  }

  loadAllCourses() {
    this.makeTreeArray = []
    this.alreadyLoadOverview = false
    this.alreadyLoadSyllabus = false
    this.alreadyLoadAssignment = []
    this.Overview_doenetML = ""
    this.Syllabus_doenetML = ""
    this.assignmentTree = null
    const loadCoursesUrl = '/api/loadAllCourses.php';
    const data = {
      overview: 0,
      syllabus: 0,
      grade: 0,
      assignment: 0
    }
    const payload = {
      params: data
    }
    if (!this.alreadyHasCourseInfo) {
      axios.get(loadCoursesUrl, payload)
        .then(resp => {

          let location = window.location.hash;
          this.alreadyHasCourseInfo = true;
          this.courseInfo = resp.data.courseInfo;
          this.courseIdsArray = resp.data.courseIds;
          this.coursesToChoose = {};
          this.courseIdsArray.map((id) => {
            this.coursesToChoose[id] = {
              showText: this.courseInfo[id]['courseName'],
              callBackFunction: (e) => { // changing

                this.updateNumber += 1
                this.alreadyHasCourseInfo = false
                this.alreadyLoadAssignment = []
                this.alreadyMadeLink = []
                this.tree_route = []
                this.tree_route_right_column = []


                this.overview_branchId = ""
                this.syllabus_branchId = ""

                this.currentCourseId = e;
                this.selectedCourseId = e;
                this.roleInstructor= this.coursesPermissions['courseInfo'][this.currentCourseId]['roleInstructor'];
                this.roleStudent= this.coursesPermissions['courseInfo'][this.currentCourseId]['roleStudent'];
                
                if (this.roleStudent === "1") {
                  this.rightToView = true;
                  this.rightToEdit = false;
                }
                if (this.roleInstructor === "1") {
                  this.rightToView = true;
                  this.rightToEdit = true;
                }
                this.usingDefaultCourseId = false;
                this.alreadyLoadAllCourses = false;
              }
            }
          })

          if (this.usingDefaultCourseId) {
            this.currentCourseId = resp.data.courseIds[0] // default when first load
          }

          if (this.coursesPermissions['courseInfo']) {
            this.roleInstructor= this.coursesPermissions['courseInfo'][this.currentCourseId]['roleInstructor'];
            this.roleStudent= this.coursesPermissions['courseInfo'][this.currentCourseId]['roleStudent'];
           
            if (this.roleStudent === "1") {
              this.rightToView = true;
              this.rightToEdit = false;
            }
             if (this.roleInstructor === "1") {
              this.rightToView = true;
              this.rightToEdit = true;
            }
          }

          this.permissionRoles = {};
          if (this.roleInstructor === "1") {
            this.permissionRoles['Instructor'] = {
              showText: "Instructor",
              callBackFunction: (e) => { this.permissionCallBack({ e: e }) }
            }
          }
          if (this.roleStudent === "1") {
            this.permissionRoles['Student'] = {
              showText: "Student",
              callBackFunction: (e) => { this.permissionCallBack({ e: e }) }
            }

          }
          this.setState({
            headerRoleFromLayout: {
              permissionRoles: this.permissionRoles,
              currentRole: this.getCurrentRole(this.permissionRoles)
            }
          });
          this.alreadyLoadAllCourses = true;
          this.courseName = this.courseInfo[this.currentCourseId]['courseName']
          //////////////////
          this.enableOverview = !!(+(resp.data.courseInfo[this.currentCourseId]["overviewEnabled"]))
          if (this.enableOverview || this.rightToEdit) {
            this.trueList.push("overview")
            this.overview_branchId = resp.data.courseInfo[this.currentCourseId]["overviewId"]
          }
          this.enableSyllabus = !!(+(resp.data.courseInfo[this.currentCourseId]["syllabusEnabled"]))
          if (this.enableSyllabus || this.rightToEdit) {
            this.trueList.push("syllabus")
            this.syllabus_branchId = resp.data.courseInfo[this.currentCourseId]["syllabusId"]
          }
          this.enableGrade = !!(+(resp.data.courseInfo[this.currentCourseId]["gradeEnabled"]))
          if (this.enableGrade || this.rightToEdit) {
            this.trueList.push("grades")
          }
          this.enableAssignment = !!(+(resp.data.courseInfo[this.currentCourseId]["assignmentEnabled"]))
          if (this.enableAssignment || this.rightToEdit) {
            this.trueList.push("assignments")
          }
          this.DoneLoading = true;
          if (location == "#/" || location == "") {
            if (this.trueList != []) {
              this.activeSection = this.trueList[0]
            }
          }
          else if (location == "#/overview") {
            this.activeSection = "overview"
          } else if (location == "#/syllabus") {
            this.activeSection = "syllabus"
          } else if (location == "#/grades") {
            this.activeSection = "grades"
          } else {
            this.activeSection = "assignments"
            this.LoadAssignmentFromTheBeginning({ location: location })
          }
          this.loadSection()
          this.forceUpdate()
        });
    }
    else {
      // console.log("ALREADY LOAD ALL COURSES")
      this.alreadyLoadAllCourses = true;
      this.courseName = this.courseInfo[this.currentCourseId]['courseName']
      //////////////////
      this.enableOverview = !!(+(this.courseInfo[this.currentCourseId]["overviewEnabled"]))
      if (this.enableOverview) {
        this.trueList.push("overview")
        this.overview_branchId = this.courseInfo[this.currentCourseId]["overviewId"]
      }
      this.enableSyllabus = !!(+(this.courseInfo[this.currentCourseId]["syllabusEnabled"]))
      if (this.enableSyllabus) {
        this.trueList.push("syllabus")
        this.syllabus_branchId = this.courseInfo[this.currentCourseId]["syllabusId"]
      }
      this.enableGrade = !!(+(this.courseInfo[this.currentCourseId]["gradeEnabled"]))
      if (this.enableGrade) {
        this.trueList.push("grades")
      }
      this.enableAssignment = !!(+(this.courseInfo[this.currentCourseId]["assignmentEnabled"]))
      if (this.enableAssignment) {
        this.trueList.push("assignments")
      }
      this.DoneLoading = true;
      if (location == "#/" || location == "") {
        if (this.trueList != []) {
          this.activeSection = this.trueList[0]
        }
      }
      else if (location == "#/overview") {
        this.activeSection = "overview"
      } else if (location == "#/syllabus") {
        this.activeSection = "syllabus"
      } else if (location == "#/grades") {
        this.activeSection = "grades"
      } else {
        this.activeSection = "assignments"
        this.LoadAssignmentFromTheBeginning({ location: location })
      }
      this.loadSection()
      this.makeTreeVisible({ loadSpecificId: "" })
      //console.log("after calling makeTreeVisible()")
      this.forceUpdate()
    }
  }
  permissionCallBack({ e }) {
    if (e === "Student") {
      this.rightToEdit = false;
      this.rightToView = true;
    }
    if (e === "Instructor") {
      this.rightToEdit = true;
      this.rightToView = true;
    }

    this.makeTreeArray = [];
    this.alreadyLoadOverview = false;
    this.alreadyLoadSyllabus = false;
    this.Overview_doenetML = "";
    this.Syllabus_doenetML = "";
    this.assignmentTree = null;

    this.alreadyLoadAssignment = [];
    this.alreadyMadeLink = [];
    this.tree_route = [];
    this.tree_route_right_column = [];
    this.overview_link = null;
    this.syllabus_link = null;
    this.grade_link = null;
    this.assignment_link = null;
    if (this.activeSection === "assignments" && this.enableAssignment) {
      this.makeTreeVisible({ loadSpecificId: "" });
    }
    this.forceUpdate();
  }
  findEnabledCategory() {
    const loadUrl = '/api/loadEnable.php';
    this.payLoad = {
      overview: 0,
      syllabus: 0,
      grade: 0,
      assignment: 0
    }
    let location = window.location.hash

    axios.get(loadUrl, this.payLoad)
      .then(resp => {
        if (this.enableOverview) {
          this.trueList.push("overview")
          this.overview_branchId = resp.data["overview_branchId"]

        }
        if (this.enableSyllabus) {
          this.trueList.push("syllabus")
          this.syllabus_branchId = resp.data["syllabus_branchId"]
        }
        if (this.enableGrade) {
          this.trueList.push("grades")
        }
        if (this.enableAssignment) {
          this.trueList.push("assignments")
        }
        this.forceUpdate()
      });
  }
  ToggleList() {
    const url = '/api/save_enable_disable_category.php'
    const data = {
      courseId: this.currentCourseId,
      overview: Number(this.enableOverview),
      grade: Number(this.enableGrade),
      syllabus: Number(this.enableSyllabus),
      assignment: Number(this.enableAssignment)
    }
    axios.post(url, data)
      .then(function (response) {

      })
      .catch(function (error) {
        this.setState({ error: error });

      })
    // adding list
    this.newChange = false
    this.loadSection()
    // this.forceUpdate()


  }

  loadThisAssignmentInfo({ link }) {
    this.rightSideInfoColumn = null
    const urlDownload = "/api/loadAssignmentInfo.php";
    const data = { assignmentId: this.thisAssignmentInfo }
    const payload = {
      params: data
    }
    this.assignment_branchId = this.assignment_obj[this.thisAssignmentInfo]['branchId']
    axios.get(urlDownload, payload)
      .then(resp => {
        // console.log(resp.data)
        this.assignmentName = resp.data['assignmentName']
        this.assignedDate = resp.data['assignedDate']
        this.dueDate = resp.data['dueDate']
        this.numberOfAttemptsAllowed = resp.data['numberOfAttemptsAllowed']
        this.timeLimit = resp.data['timeLimit']
        this.gradeCategory = resp.data['gradeCategory']
        this.totalPointsOrPercent = resp.data['totalPointsOrPercent']

        this.individualize = resp.data['individualize'] === "1" ? true : false
        this.multipleAttempts = resp.data['multipleAttempts'] === "1" ? true : false
        this.showSolution = resp.data['showSolution'] === "1" ? true : false
        this.showFeedback = resp.data['showFeedback'] === "1" ? true : false
        this.showHints = resp.data['showHints'] === "1" ? true : false
        this.showCorrectness = resp.data['showCorrectness'] === "1" ? true : false
        this.proctorMakesAvailable = resp.data['proctorMakesAvailable'] === "1" ? true : false
        // this.buildRightSideInfoColumn()
        this.AssignmentInfoPackageReady = true
        this.buildRightSideInfoColumn()
        // console.log("link is "+link)
        this.makeTreeRoute({ link: link, assignmentId: this.thisAssignmentInfo })

        this.makeTreeVisible({ loadSpecificId: this.thisAssignmentInfo })
        // this.forceUpdate();

      });
  }
  changeCurrentAssignmentRoute({ id }) {
    let link = "/assignments/" + id
    this.thisAssignmentInfo = id
    let position = this.assignmentsIndexAndDoenetML[id]['indexInRouterArray']
    this.assignmentDoenetML = this.assignmentsIndexAndDoenetML[id]['doenetML']
    this.tree_route_temp = []
    this.tree_route_right_column_temp = []
    for (let i = 0; i < this.tree_route.length; i++) {
      if (i != position) {
        this.tree_route_temp.push(this.tree_route[i])
      }
    }
    this.tree_route = this.tree_route_temp
    ///
    for (let i = 0; i < this.tree_route_right_column.length; i++) {
      if (i != position) {
        this.tree_route_right_column_temp.push(this.tree_route[i])
      }
    }
    this.tree_route_right_column = this.tree_route_right_column_temp
    ///
    this.alreadyMadeLink_temp = []
    for (let i = 0; i < this.alreadyMadeLink.length; i++) {
      if (i != position) {
        this.alreadyMadeLink_temp.push(this.alreadyMadeLink[i])
      }
    }
    this.alreadyMadeLink = this.alreadyMadeLink_temp


    this.buildRightSideInfoColumn()
    this.makeTreeRoute({ link: link, assignmentId: id })


  }
  saveAssignmentInfo() {
    const urlDownload = "/api/saveAssignmentInfo.php";
    this.resetTreeArray = true

    this.changeCurrentAssignmentRoute({ id: this.thisAssignmentInfo })
    const data = {
      assignmentId: this.thisAssignmentInfo,
      assignmentName: this.assignmentName,
      assignedDate: this.assignedDate,

      gradeCategory: this.gradeCategory,
      totalPointsOrPercent: (this.totalPointsOrPercent === null ? 0 : this.totalPointsOrPercent),
      individualize: (this.individualize === true ? 1 : 0),
      multipleAttempts: (this.multipleAttempts === true ? 1 : 0),
      showSolution: (this.showSolution === true ? 1 : 0),
      showFeedback: (this.showFeedback === true ? 1 : 0),
      showHints: (this.showHints === true ? 1 : 0),
      showCorrectness: (this.showCorrectness === true ? 1 : 0),
      proctorMakesAvailable: (this.proctorMakesAvailable === true ? 1 : 0),

      dueDate: this.dueDate,
      numberOfAttemptsAllowed: (this.numberOfAttemptsAllowed === "" ? 0 : this.numberOfAttemptsAllowed),
      timeLimit: (this.timeLimit === "" ? "00:00:00" : this.timeLimit)
    }


    axios.post(urlDownload, data)
      .then(resp => {
        // console.log("resp")
        // console.log(resp.data)
      })
      .catch(error => { this.setState({ error: error }) });
  }



  buildRightSideInfoColumn() {
    let evenOrOdd = 0

    this.rightSideInfoColumn = (
      <div
      >

        <span className="Section-Icon-Box">
          <FontAwesomeIcon className="Section-Icon" onClick={() => window.location.href = "/editor/?branchId=" + this.assignment_branchId} icon={faEdit} />
        </span>
        {/* <SettingContainer> */}

        <DoenetBox key={"title" + (this.updateNumber++)}
          readPriviledge={this.rightToView}
          writePriviledge={this.rightToEdit}
          evenOrOdd={evenOrOdd += 1}
          parentFunction={(e) => {
            this.updateNumber += 1
            this.assignmentName = e;
            this.AssignmentInfoChanged = true;
            this.forceUpdate()
          }}
          type="text"
          title="Assignment Name: "
          value={this.assignmentName ? this.assignmentName : ""} />

        <DoenetBox key={"duedate" + (this.updateNumber++)}
          readPriviledge={this.rightToView}
          writePriviledge={this.rightToEdit}
          evenOrOdd={evenOrOdd += 1}
          parentFunction={(e) => {
            this.updateNumber += 1
            let date = e.split(" ")
            let result = date[3] + "-" + this.months[date[1]] + "-" + date[2] + " " + date[4]
            this.dueDate = result;
            this.AssignmentInfoChanged = true;
            //console.log("from DoenetBox parentFunction")
            this.forceUpdate()
          }}
          type="Calendar"
          title="Due Date: "
          value={this.dueDate ? this.dueDate : ""}
        />

        <DoenetBox key={"assignedDate" + (this.updateNumber++)}
          readPriviledge={this.rightToView}
          writePriviledge={this.rightToEdit}
          evenOrOdd={evenOrOdd += 1}
          parentFunction={(e) => {
            this.updateNumber += 1
            let date = e.split(" ")
            let result = date[3] + "-" + this.months[date[1]] + "-" + date[2] + " " + date[4]
            this.assignedDate = result;

            this.AssignmentInfoChanged = true;
            //console.log("from DoenetBox parentFunction")

            this.forceUpdate()
          }}
          type="Calendar"
          title="Assigned Date: "
          value={this.assignedDate ? this.assignedDate : ""} />

        <DoenetBox key={"TimeLimit" + (this.updateNumber++)}
          readPriviledge={this.rightToView}
          writePriviledge={this.rightToEdit}
          evenOrOdd={evenOrOdd += 1}
          parentFunction={(e) => {
            this.updateNumber += 1
            this.timeLimit = e;
            this.AssignmentInfoChanged = true;
            //console.log("from DoenetBox parentFunction")

            this.forceUpdate()
          }}
          type="text"
          title="Time Limit: "
          value={this.timeLimit ? this.timeLimit : ""} />

        <DoenetBox key={"attempts" + (this.updateNumber++)}
          readPriviledge={this.rightToView}
          writePriviledge={this.rightToEdit}
          evenOrOdd={evenOrOdd += 1}
          parentFunction={(e) => {
            this.updateNumber += 1
            this.numberOfAttemptsAllowed = e;
            if (!this.multipleAttempts) {
              this.numberOfAttemptsAllowed = 0
            }
            this.AssignmentInfoChanged = true;
            //console.log("from DoenetBox parentFunction")

            this.forceUpdate()
          }}
          type="number"
          title="Number Of Attempts: "
          value={this.numberOfAttemptsAllowed ? this.numberOfAttemptsAllowed : ""} />

        <DoenetBox key={"points" + (this.updateNumber++)}
          readPriviledge={this.rightToView}
          writePriviledge={this.rightToEdit}
          evenOrOdd={evenOrOdd += 1}
          parentFunction={(e) => {
            this.updateNumber += 1
            this.totalPointsOrPercent = e;
            this.AssignmentInfoChanged = true;
            //console.log("from DoenetBox parentFunction")

            this.forceUpdate()
          }}
          type="number"
          title="Total Points Or Percent: "
          value={this.totalPointsOrPercent ? this.totalPointsOrPercent : ""} />

        <DoenetBox key={"category" + (this.updateNumber++)}
          readPriviledge={this.rightToView}
          writePriviledge={this.rightToEdit}
          evenOrOdd={evenOrOdd += 1}
          parentFunction={(e) => {
            this.updateNumber += 1
            this.gradeCategory = e;
            this.AssignmentInfoChanged = true;
            //console.log("from DoenetBox parentFunction")

            this.forceUpdate()
          }}
          type="select"
          options={this.listOfOptions}
          title="Grade Category: "
          value={this.gradeCategory} />

        <DoenetBox key={"indiv" + (this.updateNumber++)}
          readPriviledge={this.rightToView}
          writePriviledge={this.rightToEdit}
          evenOrOdd={evenOrOdd += 1}
          parentFunction={(e) => {
            this.updateNumber += 1
            this.individualize = e;
            this.AssignmentInfoChanged = true;
            //console.log("from DoenetBox parentFunction")

            this.forceUpdate()
          }}
          type="checkbox"
          title="Individualize: "
          value={this.individualize} />
        <DoenetBox key={"multiple att" + (this.updateNumber++)}
          readPriviledge={this.rightToView}
          writePriviledge={this.rightToEdit}
          evenOrOdd={evenOrOdd += 1}
          parentFunction={(e) => {
            this.updateNumber += 1
            this.multipleAttempts = e;
            if (!this.multipleAttempts) {
              this.numberOfAttemptsAllowed = 0
            }
            this.AssignmentInfoChanged = true;
            //console.log("from DoenetBox parentFunction")

            this.forceUpdate()
          }}
          type="checkbox"
          title="Multiple Attempts: "
          value={this.multipleAttempts} />
        <DoenetBox key={"show sol" + (this.updateNumber++)}
          readPriviledge={this.rightToView}
          writePriviledge={this.rightToEdit}
          evenOrOdd={evenOrOdd += 1}
          parentFunction={(e) => {
            this.updateNumber += 1
            this.showSolution = e;
            this.AssignmentInfoChanged = true;
            //console.log("from DoenetBox parentFunction")

            this.forceUpdate()
          }}
          type="checkbox"
          title="Show solution: "
          value={this.showSolution} />
        <DoenetBox key={"show fback" + (this.updateNumber++)}
          readPriviledge={this.rightToView}
          writePriviledge={this.rightToEdit}
          evenOrOdd={evenOrOdd += 1}
          parentFunction={(e) => {
            this.updateNumber += 1
            this.showFeedback = e;
            this.AssignmentInfoChanged = true;
            //console.log("from DoenetBox parentFunction")

            this.forceUpdate()
          }}
          type="checkbox"
          title="Show feedback: "
          value={this.showFeedback} />
        <DoenetBox key={"show hints" + (this.updateNumber++)}
          readPriviledge={this.rightToView}
          writePriviledge={this.rightToEdit}
          evenOrOdd={evenOrOdd += 1}
          parentFunction={(e) => {
            this.updateNumber += 1
            this.showHints = e;
            this.AssignmentInfoChanged = true;
            //console.log("from DoenetBox parentFunction")

            this.forceUpdate()
          }}
          type="checkbox"
          title="Show hints: "
          value={this.showHints} />
        <DoenetBox key={"show corr" + (this.updateNumber++)}
          readPriviledge={this.rightToView}
          writePriviledge={this.rightToEdit}
          evenOrOdd={evenOrOdd += 1}
          parentFunction={(e) => {
            this.updateNumber += 1
            this.showCorrectness = e;
            this.AssignmentInfoChanged = true;
            //console.log("from DoenetBox parentFunction")

            this.forceUpdate()
          }}
          type="checkbox"
          title="Show correctness: "
          value={this.showCorrectness} />
        <DoenetBox key={"proctor" + (this.updateNumber++)}
          readPriviledge={this.rightToView}
          writePriviledge={this.rightToEdit}
          evenOrOdd={evenOrOdd += 1}
          lastComponet={true}
          parentFunction={(e) => {
            this.updateNumber += 1
            this.proctorMakesAvailable = e;
            this.AssignmentInfoChanged = true;
            //console.log("from DoenetBox parentFunction")

            this.forceUpdate()
          }}
          type="checkbox"
          title="Proctor make available: "
          value={this.proctorMakesAvailable} />
      </div>)
    this.AssignmentInfoPackageReady = false
    //console.log("from buildRightSideInfoColumn")

    this.forceUpdate()
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

  }
  LoadAssignmentFromTheBeginning({ location }) {
    this.assignmentOnScreen = true
    this.treeOnScreen = false;
    let path = "#/assignments/"
    let index = path.length
    if (location.length == (path.length + 21)) {
      let currentAssignmentId = location.substring(index)
      this.thisAssignmentInfo = currentAssignmentId

      this.LoadAssignmentFromTheBeginningFlag = true
      this.makeTreeVisible({ loadSpecificId: currentAssignmentId })

    }
    else {
      this.makeTreeVisible({ loadSpecificId: "" })
      //console.log("before this.makeTreeVisible line 1630")
      this.forceUpdate()
    }
  }
  buildTreeArray() {

    this.makeTreeArray = []
    if (this.heading_obj.length != 1) {

      let iterator = 0;
      this.headerId_arr = []
      let already_built_header_id = {}
      this.assignmentId_arr = []
      this.makeTreeArray = []
      // create a header_id_arr to access header_obj

      this.headerId_arr = Object.keys(this.heading_obj)
      let headerObjectLength = this.headerId_arr.length;

      iterator = 0;
      this.assignmentId_arr = Object.keys(this.assignment_obj)

      iterator = 0;
      // establish level 0
      this.heading_obj["root"]["childHeadings"].forEach(element => {
        element = element.toString()
        let title = this.heading_obj[element]["title"]
        let object = { id: element, title: title, type: "header", level: 0 }
        this.makeTreeArray.unshift(object)
      })
      // console.log("this.makeTreeArray1")
      // console.log(this.makeTreeArray)
      // add header first, level = level's parent + 1
      iterator = 0;
      while (iterator < this.makeTreeArray.length) {
        let currentHeaderObject =
          this.heading_obj[this.makeTreeArray[iterator]["id"]];

        if (currentHeaderObject["childHeadings"] != undefined) {
          (currentHeaderObject["childHeadings"]).forEach(header => {
            header = header.toString();
            let title = this.heading_obj[header]["title"];
            let type = "header"
            let newLevel = this.makeTreeArray[iterator]["level"] + 1;
            let object = { id: header, title: title, type: type, level: newLevel }
            this.makeTreeArray.splice(iterator + 1, 0, object)
            already_built_header_id[header] = true;
            //}
          })
        }

        iterator++;
      }

      //add assignments
      // add arrow when this.enableMode==='assignment'
      iterator = 0;
      while (iterator < this.makeTreeArray.length) {
        if (this.makeTreeArray[iterator]["type"] === "header") {
          let indexOfHeader = this.headerId_arr.indexOf(this.makeTreeArray[iterator]["id"])
          let currentHeaderObject =
            this.heading_obj[this.makeTreeArray[iterator]["id"]];
          let assignment_list = currentHeaderObject["childAssignments"]
          if (assignment_list != []) {
            (assignment_list).forEach(e => {
              // assume unique assignment has unique headers
              let title = this.assignment_obj[e.toString()]["title"];
              let newLevel = this.makeTreeArray[iterator]["level"] + 1;
              let type = "assignment"
              let object1 = { id: e.toString(), title: title, type: type, level: newLevel }
              this.makeTreeArray.splice(iterator + 1, 0, object1)
            })
          }
        }
      }

    }}
    buildTree(){
      let ClassName = "headerSelection"
      // making space
      this.tree = [];
      let addHeaderToTheEndOfUltimateHeader = (<span className="Section-Icon-Box">
        <FontAwesomeIcon className="Section-Icon"
          onClick={() => { this.addNewHeaderAtTheEndUltimateHeader() }} icon={faPlus} /></span>);
      let addingAssignmentArray = this.AddedAssignmentObjArray

      if (this.makeTreeArray.length > 0) {

        let leftArrow = null;
        let rightArrow = null;
        let upArrow = null;
        let downArrow = null;
        let addHeaderPlus = null;
        let addAssignmentPlus = null;
        let remove = null;
        let addingArrowAfterAssignment = null;
        let addingArrowUnderHeader = null;

        let addHeaderPlusUnderRoot = null;

        this.makeTreeArray.forEach((element, index) => {
          let title = element["title"]
          let level = element["level"];
          let id = element["id"]; // id of either header or assignment

          let type = element["type"]
          let headerParentId = null;
          if (type === 'header') {
            headerParentId = this.heading_obj[id]['parentId']

            let id1 = element["id"];

            if (this.enableMode === 'remove') {
              remove = (<span className="Section-Icon-Box">
                <FontAwesomeIcon className="Section-Icon" data-cy={"close" + index}
                  onClick={() => {
                    this.deleteHeader({ headerObj: element }); this.buildTreeArray();
                    this.buildTree();
                    this.makeTreeVisible({ loadSpecificId: "" });
                  }} icon={faWindowClose} /></span>)
            } else if (this.enableMode === 'header') {
              addHeaderPlus = (<span className="Section-Icon-Box">
                <FontAwesomeIcon className="Section-Icon" data-cy={"plus" + index}
                  onClick={() => { this.addNewHeaderToHeader({ headerObj: element }); this.makeTreeVisible({ loadSpecificId: "" }) }} icon={faPlus} /></span>)
            }
            else if (this.enableMode === 'assignments') {
              id = element["id"];
              let parentId = this.heading_obj[id]['parentId']
              addingArrowUnderHeader = (<div style={{ marginLeft: leftMargin }}><span className="Section-Icon-Box">
                <FontAwesomeIcon className="Section-Icon" data-cy={"arrowLeft" + index}
                  onClick={
                    () => {
                      this.addAssignmentIdsUnderHeader({ currentHeaderId: id, arrayOfIncomingAssignments: this.AddedAssignmentObjArray });
                      this.makeTreeVisible({ loadSpecificId: "" })
                    }}
                  icon={faArrowLeft} /></span></div>)
            }


          }
          let leftMargin = `${level * 20}px`;
          let contentID = null;
          let branchID = null;
          // making up, down Arrow
          if (type == "assignment") {
            let myParent = this.assignment_obj[id]['parentId']
            ClassName = "AssignmentSelection"
            contentID = this.assignment_obj[id]['contentId']
            branchID = this.assignment_obj[id]['branchId']
            let myParentHeadingIdArray = this.heading_obj[myParent]['childAssignments']
            if (this.enableMode === 'position') {
              // if (myParentHeadingIdArray.indexOf(id)!=((myParentHeadingIdArray.length)-1)){
              //   upArrow=(<span className="Section-Icon-Box">         
              //   <FontAwesomeIcon className="Section-Icon" data-cy={"arrowUp"+index}
              //    onClick ={()=>{this.moveAssignmentUp({assignmentObj:element})}} icon={faArrowUp}/></span>)
              // }
              // if (myParentHeadingIdArray.indexOf(id)!=0){
              //   downArrow=(<span className="Section-Icon-Box">         
              // <FontAwesomeIcon className="Section-Icon" data-cy={"arrowDown"+index}
              //  onClick ={()=>{this.moveAssignmentDown({assignmentObj:element})}} icon={faArrowDown}/></span>)
              // }
            } else if (this.enableMode === 'remove') {
              remove = (<span className="Section-Icon-Box">
                <FontAwesomeIcon className="Section-Icon" data-cy={"close" + index}
                  onClick={() => { this.deleteAssignment({ assignmentObj: element }); this.makeTreeVisible({ loadSpecificId: "" }) }} icon={faWindowClose} /></span>)
            } else if (this.enableMode === 'assignments') {
              id = element["id"];
              addingArrowAfterAssignment = (<div style={{ marginLeft: leftMargin }}><span className="Section-Icon-Box">
                <FontAwesomeIcon className="Section-Icon" data-cy={"arrowLeft" + index}
                  onClick=
                  {() => {
                    this.addAssignmentIdsAfterAnAssignment({ currentAssignmentId: id, arrayOfIncomingAssignments: this.AddedAssignmentObjArray });
                    this.makeTreeVisible({ loadSpecificId: "" })
                  }}
                  icon={faArrowLeft} /></span></div>)
            }
          }
          let data_cy = type + index
          let styleAssignment = { marginLeft: leftMargin, display: "flex" }
          if (this.selectedAssignmentId === id) {
            styleAssignment = { marginLeft: leftMargin, display: "flex", backgroundColor: "#979B97" }
          }
          let link = "/assignments/" + id
          if (!this.alreadyHadAssignmentsIndexAndDoenetML) {
            this.assignmentsIndexAndDoenetML[id] = { doenetML: "", indexInRouterArray: -1 }
          }

          // console.log("link is "+link)
          if (level == 0) { // only header can have level 0
            if (this.enableMode === 'header') {
              addHeaderPlusUnderRoot = (<span className="Section-Icon-Box">
                <FontAwesomeIcon className="Section-Icon" data-cy="plus"
                  onClick={() => {
                    this.addNewHeaderUnderRoot({ headerObj: element });
                    this.makeTreeVisible({ loadSpecificId: "" })
                  }} icon={faPlus} /></span>)
            }
          }
          let tree_branch = null;
          if (!this.rightToEdit) {
            leftArrow = null;
            rightArrow = null;
            upArrow = null;
            downArrow = null;
            addHeaderPlus = null;
            addAssignmentPlus = null;
            remove = null;
            addingArrowAfterAssignment = null;
            addingArrowUnderHeader = null;
          }
          if (type === "assignment") {
            tree_branch =
              (
                <Link to={link} key={"tree_branch" + index}
                  data-cy={data_cy} className={ClassName} style={styleAssignment}
                  onClick={() => {
                  this.thisAssignmentInfo = id;
                    // console.log("clicking link")
                    this.loadAssignmentContent({ contentId: contentID, branchId: branchID, assignmentId: id });
                  }}
                >
                  <span className="Section-Text" >
                    {title}
                  </span>
                  {leftArrow}
                  {rightArrow}
                  {upArrow}
                  {downArrow}
                  {remove}
                </Link>
              )
          }


          if (type === "header") {
            tree_branch = (<div to={link} key={"tree_branch" + index}
              data-cy={data_cy} className={ClassName} style={styleAssignment}
            >
              <span className="Section-Text" >
                {title}
              </span>
              {leftArrow}
              {rightArrow}
              {upArrow}
              {downArrow}
              {addHeaderPlus}
              {remove}
            </div>)
          }
          // this.tree.push(tree_branch)
          if (addHeaderPlusUnderRoot != null && type === 'header') {
            this.tree.push(addHeaderPlusUnderRoot)
          }
          this.tree.push(tree_branch)
          if (addingArrowAfterAssignment != null && type === 'assignment') {
            this.tree.push(addingArrowAfterAssignment)
          }

          if (addingArrowUnderHeader != null && type === 'header'
            && headerParentId != null) {
            this.tree.push(addingArrowUnderHeader);
          }

        // if (addingArrowUnderHeader != null && type === 'header'
        //   && headerParentId != null) {
        //   this.tree.push(addingArrowUnderHeader);
        // }

        })
      } else {
        //console.log("EMPTY TREE")
        //  this.tree.push(<p>Empty Tree</p>)
      }
      if (this.enableMode === 'header') {
        this.tree.push(addHeaderToTheEndOfRoot)
      }

    }

    saveTree = ({courseId, headingsInfo, assignmentsInfo, callback=(()=>{})}) => {
      // console.log("saving the tree")
      /**
       * here passing in a payload of
       * for UPDATE:
       *  a assignment set where all row in assignment match the id will be updated in parentId
       * for DELETE:
       *  a header set where all row in course's heading match the id will be deleted
       * for INSERT:
       *  for inserting into assignment
       *   a set of assignment id
       *   a list of parent id as 1 header Id can have multiple assignment id
       *   index of children id associated with index of assignment id
       *  for inserting into heading
       *    a list of header id where duplicate may occur as a header may contain several different children id
       *    a set of children id as no children Id can be owned by 2 different parents
       * 
       * delete multiple rows: DELETE FROM table WHERE col1 IN (1,2,3,4,5)
          insert multiple rows:
          INSERT INTO 
                projects(name, start_date, end_date)
          VALUES
                ('AI for Marketing','2019-08-01','2019-12-31'),
                ('ML for Sales','2019-05-15','2019-11-20');
       */
      let assignmentId_parentID_array = [];
      let assignmentId_array = Object.keys(assignmentsInfo)
      assignmentId_array.forEach(id=>{
        assignmentId_parentID_array.push(assignmentsInfo[id]['parentId']);
      })
      let headerID_array = Object.keys(headingsInfo);
      let headerID_array_to_payload = []
      let headerID_childrenId_array_to_payload=[]
      let headerID_parentId_array_to_payload = []
      let headerID_name = []
      headerID_array.forEach(currentHeaderId=>{
        let currentHeaderObj=headingsInfo[currentHeaderId]
        let name = currentHeaderObj['title']
        if (name==null){
          name="NULL"
        }
        let currentHeaderObjHeadingIdArray = currentHeaderObj['childFolders']
        let lengthOfHeadingId = currentHeaderObjHeadingIdArray.length
        let currentHeaderObjAssignmentIdArray = currentHeaderObj['childContent']
        let currentHeaderObjParentId = currentHeaderObj['parentId']
        let lengthOfAssigmentId = currentHeaderObjAssignmentIdArray.length
        let iterator = 0
        if (lengthOfHeadingId==0 && lengthOfAssigmentId==0){
          headerID_array_to_payload.push(currentHeaderId)
          if (currentHeaderObjParentId==null){
            headerID_parentId_array_to_payload.push("NULL")
          } else {
          headerID_parentId_array_to_payload.push(currentHeaderObjParentId)
          }
          headerID_childrenId_array_to_payload.push("NULL")
          headerID_name.push(name);
        }
        while (iterator < lengthOfHeadingId){
          headerID_array_to_payload.push(currentHeaderId)
          headerID_childrenId_array_to_payload.push(currentHeaderObjHeadingIdArray[iterator])
          headerID_name.push(name);
          if (currentHeaderObjParentId==null){
            headerID_parentId_array_to_payload.push("NULL")
          } else {
          headerID_parentId_array_to_payload.push(currentHeaderObjParentId)
          }
          iterator+=1
        }
        iterator = 0
        while (iterator < lengthOfAssigmentId){
          headerID_array_to_payload.push(currentHeaderId)
          headerID_childrenId_array_to_payload.push(currentHeaderObjAssignmentIdArray[iterator])
          headerID_name.push(name);
          if (currentHeaderObjParentId==null){
            headerID_parentId_array_to_payload.push("NULL")
          } else {
          headerID_parentId_array_to_payload.push(currentHeaderObjParentId)
          }
          iterator+=1
        }
      })
      const urlGetCode = '/api/saveTree.php';
      const data = {
        assignmentId_array: assignmentId_array,
        assignmentId_parentID_array: assignmentId_parentID_array,
        headerID_array_to_payload:headerID_array_to_payload,
        headerID_name:headerID_name,
        headerID_parentId_array_to_payload:headerID_parentId_array_to_payload,
        headerID_childrenId_array_to_payload:headerID_childrenId_array_to_payload,
        courseId: courseId
      }
      axios.post(urlGetCode,data)
      .then(resp=>{
        callback();
      })
      .catch(error=>{this.setState({error:error})});
    }

    moveHeaderUp({ headerObj }){
      /**
      * posses up arrow iff your id not first appear inside your parentId's headerId array
      * get the id of the current header
      * find current header parentId in this.header_obj
      * find current header parent obj in this.header_obj base on parentId
      * get current header index inside current header parent obj headerId
      * swap it with the element whose index before
      */

      let currentHeaderId = headerObj["id"]

      let myParentId = this.heading_obj[currentHeaderId]["parentId"]
      let parentObj = this.heading_obj[myParentId];

      let currentHeaderIndexInParentHeaderIdArray = parentObj["childHeadings"].indexOf(currentHeaderId)
      let previousIndex = currentHeaderIndexInParentHeaderIdArray + 1;

      let previousId = parentObj["childHeadings"][previousIndex]
      let temp = previousId;
      // swapping
      parentObj["childHeadings"][previousIndex] = currentHeaderId;
      parentObj["childHeadings"][currentHeaderIndexInParentHeaderIdArray] = temp;

      this.buildTreeArray();
      this.buildTree();
      this.forceUpdate();
      this.saveTree();
    }
    moveAssignmentUp({ assignmentObj }){
      /**
      * posses up arrow iff your id not first appear inside your parentId's assignment array
      * get the id of the current assignment
      * find current assignment parentId in this.header_obj
      * find current assignment's parent obj in this.header_obj base on parentId
      * get current assignment index inside current header's parent obj assignmentId
      * swap it with the element whose index before
      */
      let currentAssignmentId = assignmentObj["id"]
      let myParentId = this.assignment_obj[currentAssignmentId]["parentId"]
      let parentObj = this.heading_obj[myParentId];
      let currentHeaderIndexInParentHeaderIdArray = parentObj["childAssignments"].indexOf(currentAssignmentId)
      let previousIndex = currentHeaderIndexInParentHeaderIdArray + 1;
      let previousId = parentObj["childAssignments"][previousIndex]
      let temp = previousId;
      // swapping
      parentObj["childAssignments"][previousIndex] = currentAssignmentId;
      parentObj["childAssignments"][currentHeaderIndexInParentHeaderIdArray] = temp;
      this.buildTreeArray();
      this.buildTree();
      this.forceUpdate();
      this.saveTree();
    }
    moveHeaderDown({ headerObj }){
      /**
       * posses down arrow iff your id not last appear inside your parentId's headerId array
       * get the id of the current header
       * find current header parentId in this.header_obj
       * find current header parent obj in this.header_obj base on parentId
       * get current header index inside current header parent obj headerId
       * swap it with the element whose index after
       */
      let currentHeaderId = headerObj["id"]
      let myParentId = this.heading_obj[currentHeaderId]["parentId"]
      let parentObj = this.heading_obj[myParentId];
      let currentHeaderIndexInParentHeaderIdArray = parentObj["childHeadings"].indexOf(currentHeaderId)
      let previousIndex = currentHeaderIndexInParentHeaderIdArray - 1;
      let previousId = parentObj["childHeadings"][previousIndex]
      let temp = previousId;
      // swapping
      parentObj["childHeadings"][previousIndex] = currentHeaderId;
      parentObj["childHeadings"][currentHeaderIndexInParentHeaderIdArray] = temp;
      this.buildTreeArray();
      this.buildTree();
      this.forceUpdate();
      this.saveTree();
    }
    moveAssignmentDown({ assignmentObj }){
      /**
     * posses down arrow iff your id not lasr appear inside your parentId's assignment array
     * get the id of the current assignment
     * find current assignment parentId in this.header_obj
     * find current assignment's parent obj in this.header_obj base on parentId
     * get current assignment index inside current header's parent obj assignmentId
     * swap it with the element whose index after
     */
      let currentAssignmentId = assignmentObj["id"]
      let myParentId = this.assignment_obj[currentAssignmentId]["parentId"]
      let parentObj = this.heading_obj[myParentId];
      let currentHeaderIndexInParentHeaderIdArray = parentObj["childAssignments"].indexOf(currentAssignmentId)
      let previousIndex = currentHeaderIndexInParentHeaderIdArray - 1;
      let previousId = parentObj["childAssignments"][previousIndex]
      let temp = previousId;
      // swapping
      parentObj["childAssignments"][previousIndex] = currentAssignmentId;
      parentObj["childAssignments"][currentHeaderIndexInParentHeaderIdArray] = temp;
      this.buildTreeArray();
      this.buildTree();
      this.forceUpdate();
      this.saveTree();

    }
    moveHeaderLeft({ headerObj }){
      /**
       * possess a left arrow when exists parent that not "root"
       * get the id of the current header as currentHeaderId
       * find currentHeaderId's parentId in this.header_obj
       * splice currentHeaderId out of currentHeaderId's parentId headingId array
       * store parentId of currentHeaderId's parentId as newParentId
       * change currentHeaderId's parentId type value to newParentId
       */
      let currentHeaderId = headerObj["id"]
      let myparentId = this.heading_obj[currentHeaderId]["parentId"]
      let myNewParentId = this.heading_obj[myparentId]["parentId"]
      let myParentHeaderIdArray = this.heading_obj[myparentId]["childHeadings"]
      let currentHeaderIdIndexInsidemyParentHeaderIdArray = myParentHeaderIdArray.indexOf(currentHeaderId)
      this.heading_obj[myparentId]["childHeadings"].splice(currentHeaderIdIndexInsidemyParentHeaderIdArray, 1)
      this.heading_obj[currentHeaderId]["parentId"] = myNewParentId;
      if (currentHeaderIdIndexInsidemyParentHeaderIdArray === (myParentHeaderIdArray - 1)) {
        this.heading_obj[myNewParentId]["childHeadings"].push(currentHeaderId)   // when u last
      } else {
        this.heading_obj[myNewParentId]["childHeadings"].unshift(currentHeaderId)
      }
      // console.log("moveHeaderLeft")
      // console.log(this.heading_obj)
      this.buildTreeArray();
      this.buildTree();
      this.forceUpdate();
      this.saveTree();

    }
    moveHeaderRight({ headerObj }){
      /**
       * possess right arrow when my id not the only in my parentID's headerId
       * get the id of the current header as id
       * find the next header inside the current header's parent headingId
       * find the index of the previous header inside headerId_arr
       * continue to seek previous header by decreasing the index
       * when found a header where its level is at least current header
       *    then store the header Id as newParentID. Then look parentID up in header_obj
       *    then access its headerId array and append id to the array
       * change id's parent to newParentID
       */
      let currentHeaderId = headerObj['id']
      let myParentId = this.heading_obj[currentHeaderId]['parentId']
      let myParentHeadingIdArray = this.heading_obj[myParentId]["childHeadings"]
      let prevHeaderIndexInsidemyParentHeadingIdArray = myParentHeadingIdArray.indexOf(currentHeaderId) + 1
      if (prevHeaderIndexInsidemyParentHeadingIdArray === myParentHeadingIdArray.length) {
        prevHeaderIndexInsidemyParentHeadingIdArray = myParentHeadingIdArray.indexOf(currentHeaderId) - 1
      }
      let prevHeaderId = myParentHeadingIdArray[prevHeaderIndexInsidemyParentHeadingIdArray]
      let prevHeaderObj = this.heading_obj[prevHeaderId]
      let currentHeaderIdIndexInsideParentObjHeadingIdArray = this.heading_obj[myParentId]['childHeadings'].indexOf(currentHeaderId)
      if (currentHeaderIdIndexInsideParentObjHeadingIdArray == this.heading_obj[myParentId]['childHeadings'].length - 1) {
        prevHeaderObj['childHeadings'].push(currentHeaderId)  // when u last
      } else {
        prevHeaderObj['childHeadings'].unshift(currentHeaderId)  // when u not last
      }
      this.heading_obj[currentHeaderId]['parentId'] = prevHeaderId
      this.heading_obj[myParentId]['childHeadings'].splice(currentHeaderIdIndexInsideParentObjHeadingIdArray, 1)
      this.buildTreeArray();
      this.buildTree();
      this.forceUpdate();
      this.saveTree();

    }
    addAssignmentIdsAfterAnAssignment({ currentAssignmentId, arrayOfIncomingAssignments }){
      /**
       * create a fake assignment array of assignment obj
       * get the parentId of the current assignment
       * look up parentId obj in header_obj
       * iterate thru the each element and add the key id to parentId obj's assignmentId array
       */

      let arr = arrayOfIncomingAssignments
      let myParentID = this.assignment_obj[currentAssignmentId]['parentId'];
      let myParentObj = this.heading_obj[myParentID];
      let assignmentIdArray = myParentObj['childAssignments']
      let length = arr.length;
      let currentAssignmentIdIndexInsideParentAssignmentIdArray =
        myParentObj['childAssignments'].indexOf(currentAssignmentId)
      let addAtIndex = currentAssignmentIdIndexInsideParentAssignmentIdArray
      let iterator = 0;
      while (iterator < length) {
        let addedAssignmentId = arr[iterator];
        let ID = nanoid();
        this.heading_obj[myParentID]['childAssignments'].splice(addAtIndex, 0, ID)
        // console.log("NEW ID is.."+ID)
        let title = "untitle assignment " + iterator;
        this.assignment_obj[ID] = { title: title, parentId: myParentID, contentId: addedAssignmentId }
        iterator += 1;
      }
      // change enableMode to "position" .Adding duplicate assignmentId will break the rule of adding arrow
      // as one ID can both a middle and first element at the same time
      this.buildTreeArray();
      this.buildTree();
      this.forceUpdate();
      this.saveTree();

    }
    addAssignmentIdsUnderHeader({ currentHeaderId, arrayOfIncomingAssignments }){
      /**
      * get headerId as id
      * look up id to get the id obj in header_obj
      * iterate thru the each element and add the key id to id obj's assignmentId array
      */
      /*Assume AddedAssignmentIdsArray is fully filled and 
      stores only {IdOfAssignment:<someID>,name:<someName>} */
      let arr = arrayOfIncomingAssignments
      let currentHeaderObj = this.heading_obj[currentHeaderId];
      let iterator = arr.length - 1; // last index of Adding AssignmentID
      while (iterator >= 0) {
        let ID = nanoid();
        // console.log("NEW ID is.."+ID)
        let title = "untitle assignment " + iterator;
        this.assignment_obj[ID] = { title: title, parentId: currentHeaderId, contentId: arr[iterator] }
        // adding ID to currentHeaderId's assignmentId array
        this.heading_obj[currentHeaderId]['childAssignments'].push(ID);
        iterator--;
      }
      this.buildTreeArray();
      this.buildTree();
      this.forceUpdate();
      this.saveTree();

    }
    addNewHeaderUnderRoot({ headerObj }){
      let currentHeaderId = headerObj['id']
      let myParentObj = this.heading_obj["root"];
      let length = myParentObj['childHeadings'].length
      let currentHeaderIdIndexInsideParentHeadingIdArray =
        myParentObj['childHeadings'].indexOf(currentHeaderId)
      let addAtIndex = currentHeaderIdIndexInsideParentHeadingIdArray
      let ID = nanoid();

      if (addAtIndex === 0) {
        // console.log("case 1")
        this.heading_obj["root"]['childHeadings'].unshift(ID)
      } else if (addAtIndex === (length - 1)) {
        // console.log("case 2")
        this.heading_obj["root"]['childHeadings'].push(ID)
      } else {
        // console.log("case 3")
        this.heading_obj["root"]['childHeadings'].splice(addAtIndex + 1, 0, ID)
      }
      this.heading_obj[ID] = { title: "untitled header", parentId: "root", childAssignments: [], childHeadings: [] }

    }
    addNewHeaderAtTheEndUltimateHeader() {
      let ID = nanoid();
      this.heading_obj["UltimateHeader"]['headingId'].unshift(ID)
      this.heading_obj[ID] = { name: "untitled header", parent: "UltimateHeader", assignmentId: [], headingId: [] }
      this.buildTreeArray();
      this.buildTree();
      this.forceUpdate();
      this.saveTree();

    }
    addNewHeaderAtTheEndRoot(){
      let ID = nanoid();
      this.heading_obj["root"]['childHeadings'].unshift(ID)
      this.heading_obj[ID] = { title: "untitled header", parentId: "root", childAssignments: [], childHeadings: [] }
      this.buildTreeArray();
      this.buildTree();
      this.forceUpdate();
      this.saveTree();

    }
    addNewHeaderToHeader({ headerObj }){
      /**
       * create a new id from nanoid as newId
       * add a new header object to header_obj with newId empty headerId and assignmentId
       * get the current header id as id
       * add newId to id's headerId array
       */
      /*Assume addedHeader is fully filled and 
      stores only {IdOfAssignment:<someID>,title:<someName>} */
      // TODO: header can't be added under Root
      // console.log("running addNewHeaderToHeader")
      let currentHeaderId = headerObj['id']
      let newHeaderId = nanoid();
      let newHeaderName = "untitled header";
      this.heading_obj[newHeaderId] = { title: newHeaderName, childAssignments: [], childHeadings: [], parentId: currentHeaderId }
      this.heading_obj[currentHeaderId]['childHeadings'].unshift(newHeaderId)
      this.buildTreeArray();
      this.buildTree();
      this.forceUpdate();
      this.saveTree();

    }
    deleteHeader({ headerObj }){
      /**
       * delete header will delete its children including header and assignment
       */
      // console.log("deleting obj")
      // console.log(headerObj)
      let id = headerObj['id']
      // delete it as heading, get parent
      // let indexOfHeader = this.headerId_arr.indexOf(id)
      let currentHeaderObject =
        this.heading_obj[id];
      let parentId;
      //if (currentHeaderObject["parentId"]!="root"){
      parentId = currentHeaderObject["parentId"]

      //}
      let listOfMyAssignment = currentHeaderObject["childAssignments"]
      let listOfDeletingAssignment = []
      listOfMyAssignment.forEach(element => {
        listOfDeletingAssignment.push(element.toString())
      })
      // before deleting myself, delete all my assignment object
      this.deleteChildrenAssignment({ list: listOfDeletingAssignment })
      // before deleting myself, delete all my header object
      let listOfMyHeaders = currentHeaderObject["childHeadings"]
      // console.log("listOfMyHeaders")
      // console.log(listOfMyHeaders)
      let listOfDeletingHeader = []
      listOfMyHeaders.forEach(element => {
        let currentChildHeaderObjID = element
        let title = this.heading_obj[element]['title']
        let type = "header"
        let parentId = this.heading_obj[element]['parentId']
        let currentChildHeaderObjHeadingId = this.heading_obj[element]["childHeadings"]
        let currentChildHeaderObjAssignmentId = this.heading_obj[element]["childAssignments"]

        let currentChildHeaderObj = { id: currentChildHeaderObjID, title: title, type: type, parentId: parentId, childHeadings: currentChildHeaderObjHeadingId, childAssignments: currentChildHeaderObjAssignmentId }
        this.deleteHeader({ headerObj: currentChildHeaderObj })
      })

      delete this.heading_obj[id]
      // let currentHeaderObjectParentHeadingId =
      //   this.heading_obj[parentId]["childHeadings"];
      // let indexOfCurrentHeaderInsideItsParentHeadingId = currentHeaderObjectParentHeadingId.indexOf(id)
      // this.heading_obj[parentId]["childHeadings"].splice(indexOfCurrentHeaderInsideItsParentHeadingId, 1)


      this.axiosDeleteAssignmentFromDB({ listOfAssignment: this.listOfAssignmentIdNeedDeletingFromDB })

      let currentHeaderObjectParentHeadingId =
        this.heading_obj[parentId]["headingId"];
      let indexOfCurrentHeaderInsideItsParentHeadingId = currentHeaderObjectParentHeadingId.indexOf(id)
      this.heading_obj[parentId]["headingId"].splice(indexOfCurrentHeaderInsideItsParentHeadingId, 1)


    }
    deleteChildrenAssignment({ list }){
      list.forEach(element => {
        this.listOfAssignmentIdNeedDeletingFromDB.push(element);
        delete this.assignment_obj[element]
      })
    }
    deleteAssignment({ assignmentObj }){
      let id = assignmentObj['id']
      let indexOfAssignment = this.assignmentId_arr.indexOf(id)
      let myParentId = this.assignment_obj[id]["parentId"]
      //delete me from parent
      let indexOfHeaderParent = this.headerId_arr.indexOf(myParentId)
      let currentHeaderObjectParentAssignmentId =
        this.heading_obj[myParentId]["childAssignments"]
      delete this.assignment_obj[id]
      //this.assignment_obj.splice(indexOfAssignment,1)

      this.heading_obj[myParentId]["childAssignments"].splice(currentHeaderObjectParentAssignmentId.indexOf(id), 1)
      this.listOfAssignmentIdNeedDeletingFromDB = [id]
      this.axiosDeleteAssignmentFromDB({ listOfAssignment: this.listOfAssignmentIdNeedDeletingFromDB })


    }
    deleteChildrenAssignment({ list }) {
      list.forEach(element => {
        this.listOfAssignmentIdNeedDeletingFromDB.push(element);
        delete this.assignment_obj[element]
      })
    }
    deleteAssignment({ assignmentObj }) {
      let id = assignmentObj['id']
      let indexOfAssignment = this.assignmentId_arr.indexOf(id)
      let myParentId = this.assignment_obj[id]["parent"]
      //delete me from parent
      let indexOfHeaderParent = this.headerId_arr.indexOf(myParentId)
      let currentHeaderObjectParentAssignmentId =
        this.heading_obj[myParentId]["assignmentId"]
      delete this.assignment_obj[id]
      //this.assignment_obj.splice(indexOfAssignment,1)

      this.heading_obj[myParentId]["assignmentId"].splice(currentHeaderObjectParentAssignmentId.indexOf(id), 1)
      this.listOfAssignmentIdNeedDeletingFromDB = [id]
      this.axiosDeleteAssignmentFromDB({ listOfAssignment: this.listOfAssignmentIdNeedDeletingFromDB })




    }
    axiosDeleteAssignmentFromDB({ listOfAssignment }) {

      let list = listOfAssignment
      const urlGetCode1 = '/api/deleteAssignment.php';
      const data = {
        list: list
      }

      axios.post(urlGetCode1, data)
        .then(resp => {
          // console.log(resp.data)
          this.buildTreeArray();
          this.buildTree();
          this.forceUpdate();
          this.saveTree();
        })
        .catch(error => { this.setState({ error: error }) });
    }

    makeTreeRoute({ link, assignmentId }) {

      this.assignmentsIndexAndDoenetML[assignmentId]['doenetML'] = this.assignmentDoenetML
      if (!(this.alreadyMadeLink.includes(link)) && link) {
        //console.log("===Making route====")
        let tree_route_right_column_branch =
          (
            <Route key={link} exact path={link}>
              <>

                {this.rightSideInfoColumn}
              </>

            </Route>

          )
        this.tree_route_right_column.push(tree_route_right_column_branch);

        let tree_route_branch =
          (
            <Route key={link} exact path={link}>
              <>
                <Assignments assignmentDoenetML={this.assignmentDoenetML} />

              </>
            </Route>
          )
        this.tree_route.push(tree_route_branch);
        this.alreadyMadeLink.push(link)
        this.assignmentsIndexAndDoenetML[assignmentId]['indexInRouterArray'] = this.tree_route.length - 1

      }


    }

    loadAssignmentContent({ contentId, branchId, assignmentId }) {
      this.thisAssignmentInfo = assignmentId;
      this.assignmentDoenetML = ""
      this.assignmentOnScreen = true
      this.treeOnScreen = false;
      this.componentLoadedFromNavigationBar = null

      //console.log("=======DOWNLOADING ASSIGNMENTS========")
      this.selectedAssignmentId = assignmentId
      this.assignmentName = this.assignment_obj[assignmentId]['title']
      this.assignment_branchId = this.assignment_obj[assignmentId]['branchId']
      this.dueDate = this.assignment_obj[assignmentId]['dueDate']
      this.assignedDate = this.assignment_obj[assignmentId]['assignedDate']
      this.numberOfAttemptsAllowed = this.assignment_obj[assignmentId]['numberOfAttemptsAllowed']
      contentId = this.assignment_obj[assignmentId]['contentId']
      branchId = this.assignment_obj[assignmentId]['branchId']
      const urlGetCode = '/api/getDoenetML.php';
      //console.log(contentId)
      const data = {
        branchId: branchId,
        contentId: contentId

      }
      const payload = {
        params: data
      }
      let link = null;
      if (!(this.alreadyLoadAssignment.includes(assignmentId))) {
        this.alreadyLoadAssignment.push(assignmentId)
        axios.get(urlGetCode, payload)
          .then(resp => {
            let doenetML = resp.data.doenetML;

            this.updateNumber++;
            this.assignmentDoenetML = doenetML;
            this.ListOfAlreadyDownLoadDoenetML[assignmentId] = this.assignmentDoenetML
            //console.log("DOENET ML !!")
            //console.log(resp.data)
            link = "/assignments/" + assignmentId
            this.loadThisAssignmentInfo({ link: link })
            if (this.LoadAssignmentFromTheBeginningFlag) {
              //console.log("===LOADING ASSIGNMENT FROM URL===")
              this.componentLoadedFromNavigationBar = (<Assignments assignmentDoenetML={this.assignmentDoenetML} />)
              this.LoadAssignmentFromTheBeginningFlag = false
            }
          })
          .catch(error => { this.setState({ error: error }) });
      }
      else {
        this.thisAssignmentInfo = assignmentId
        this.loadThisAssignmentInfo({ link: link })
        //console.log("==ALREADY DOWNLOAD THAT ASSIGNMENT===")
      }

    }




    loadOverview() {

      this.doenetML = "";
      const phpUrl = '/api/getDoenetML.php';
      const data = {
        branchId: this.overview_branchId,
        contentId: "",
        ListOfContentId: "", //this is to store all contentID of one branchID for publish indication 
        List_Of_Recent_doenetML: [], // this is to store list of (date:doenetML) 
      }
      const payload = {
        params: data
      }

      axios.get(phpUrl, payload)
        .then(resp => {
          let doenetML = resp.data.doenetML;
          this.updateNumber++;
          this.doenetML = doenetML;
          this.Overview_doenetML = this.doenetML;
          this.alreadyLoadOverview = true
          this.loadFirstTrue = (this.Overview_doenetML != "" ? <Overview doenetML={this.Overview_doenetML} /> : null)
          //console.log("from loadOverview line 2606")
          this.forceUpdate();
        })
        .catch(error => { this.setState({ error: error }) });


    }

    buildOverview() {
      this.mainSection = this.loadingScreen;
      //talk to database to load fresh info
      this.overview = (<div className="assignmentContent">
        {this.doenetML != "" ?

          <DoenetViewer
            key={"doenetviewer" + this.updateNumber} //each component has their own key, change the key will trick Reach to look for new component
            doenetML={this.Overview_doenetML}
            mode={{
              solutionType: this.state.solutionType,
              allowViewSolutionWithoutRoundTrip: this.state.allowViewSolutionWithoutRoundTrip,
              showHints: this.state.showHints,
              showFeedback: this.state.showFeedback,
              showCorrectness: this.state.showCorrectness,
            }}
          /> : null}
      </div>)

      this.mainSection = this.overview;
    }

    loadSyllabus() {
      //console.log("loading SYLLABUS")
      this.doenetML = "";

      const phpUrl = '/api/getDoenetML.php';
      const data = {
        branchId: this.syllabus_branchId,
        contentId: "",
        ListOfContentId: "", //this is to store all contentID of one branchID for publish indication 
        List_Of_Recent_doenetML: [], // this is to store list of (date:doenetML) 
      }
      const payload = {
        params: data
      }

      axios.get(phpUrl, payload)
        .then(resp => {
          let doenetML = resp.data.doenetML;

          this.updateNumber++;
          this.doenetML = doenetML;


          this.Syllabus_doenetML = this.doenetML;
          this.alreadyLoadSyllabus = true
          this.loadFirstTrue = (<Syllabus doenetML={this.Syllabus_doenetML} />)

          //console.log("from loadSyllabus line 2666")
          this.forceUpdate();
        })
        .catch(error => { this.setState({ error: error }) });


    }

    buildSyllabus() {
      this.mainSection = this.loadingScreen;

      //talk to database to load fresh info
      this.overview = (<React.Fragment>
        {this.doenetML != "" ?
          <div><DoenetViewer
            key={"doenetviewer" + this.updateNumber} //each component has their own key, change the key will trick Reach to look for new component
            doenetML={this.Syllabus_doenetML}

            mode={{
              solutionType: this.state.solutionType,
              allowViewSolutionWithoutRoundTrip: this.state.allowViewSolutionWithoutRoundTrip,
              showHints: this.state.showHints,
              showFeedback: this.state.showFeedback,
              showCorrectness: this.state.showCorrectness,
            }}
          /></div> : null}
      </React.Fragment>)

      this.mainSection = this.overview;
    }


    loadGrades() {
      this.scores = {};
      this.subTotals = {};

      const loadGradsUrl = '/api/loadGradsLearner.php';

      // this.courseId
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
          //console.log("from loadGrades line 2722")
          this.forceUpdate();

        })
        .catch(error => { this.setState({ error: error }) });
    }



    buildGradesHelper() {

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
              if (!isNaN(score)) {
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

      //talk to database to load fresh info
      this.overview = (<React.Fragment>
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

            {this.gradeCategories.map(cat => <React.Fragment key={'option' + cat}>

              <tr>
                <td className="typeHeadingRow" colSpan="4">{cat}</td>
              </tr>


              {this.scores[cat].map(
                (score) => <React.Fragment key={'score_row' + score.assignmentId}>
                  <tr className="typeDataRow">
                    <td><span className="assignmentLink" onClick={() => {
                      this.buildAssignmentGrades({ assignment: score });

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

    buildAssignmentGrades({ assignment }) {
      this.mainSection = this.loadingScreen;
      this.assignment = assignment;
      this.assignmentId = assignment.assignmentId;

      const url = '/api/loadItemGrades.php';

      const data = {
        courseId: this.courseId,
        assignmentId: assignment.assignmentId,
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

    buildAssignmentGradesHelper() {
      let latestAttemptPercentage = Math.round(Number(this.latestAttemptCredit) * 10000, 2) / 100;
      latestAttemptPercentage = `${latestAttemptPercentage}%`;
      for (var item of this.assignmentItems) {
        let percentage = Math.round(Number(item.credit) * 10000, 2) / 100;
        item.percentage = `${percentage}%`;

      }


      this.mainSection = (<React.Fragment>
        <button onClick={() => {
          this.buildGradesHelper({ data: this.assignmentsData });
        }}>Back to grades</button>
        <h2 style={{ marginLeft: "10px" }}>{this.assignment.gradeItem}</h2>
        {this.latestAttemptNumber > 1 ? <p style={{ marginLeft: "10px", fontSize: "16px" }}>Attempt Number: {this.latestAttemptNumber} </p> : null}

        <table id="grades" style={{ width: "400px" }}>
          <tbody>
            <tr className="colHeadingsRow">
              <th width="581">Grade item</th>
              <th width="95">Percentage</th>
            </tr>

            {this.assignmentItems.map(
              (item) => <React.Fragment key={'assignmentItem' + item.title}>
                <tr className="typeDataRow">
                  <td><span className="assignmentLink" onClick={() => {
                    // this.buildAssignmentGrades({assignment:score});
                    this.buildItemGrade({ item });

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
              : null}

            <tr className="colTotalRow">
              <td>Total</td>
              <td>{this.assignment.percentage}</td>
            </tr>
          </tbody>
        </table>
      </React.Fragment>);

      this.forceUpdate();

    }

    buildItemGrade({ item }) {


      const url = '/api/loadItemAttemptGrades.php';

      // this.courseId
      const data = {
        assignmentId: this.assignmentId,
        itemNumber: item.itemNumber,
        attemptNumber: this.latestAttemptNumber,
      }
      const payload = {
        params: data
      }


      axios.get(url, payload)
        .then(resp => {

          this.buildAttemptItemGradesHelper({
            itemTitle: item.title,
            itemState: resp.data.itemState,
            submissionNumber: resp.data.submissionNumber,
            submittedDate: resp.data.submittedDate,
            valid: resp.data.valid,
          });
        })
        .catch(error => { this.setState({ error: error }) });

    }

    buildAttemptItemGradesHelper({ itemTitle, itemState, submissionNumber, submittedDate, valid, }) {


      this.mainSection = (<React.Fragment>
        <button onClick={() => {
          this.buildGradesHelper({ data: this.assignmentsData });
        }}>Back to grades</button>
        <button onClick={() => {
          this.buildAssignmentGradesHelper();
        }}>Back to {this.assignment.gradeItem}</button>
        <h2 style={{ marginLeft: "10px" }}>{this.assignment.gradeItem}: {itemTitle}</h2>
        {this.latestAttemptNumber > 1 ? <p style={{ marginLeft: "10px", fontSize: "16px" }}>Attempt Number: {this.latestAttemptNumber} </p> : null}

        <DoenetViewer
          key={"doenetviewer"}
          //   free={{
          //   doenetState: itemState,
          // }} 
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

      </React.Fragment>);
      this.forceUpdate();
    }


    componentDidCatch(error, info) {
      this.setState({ error: error, errorInfo: info });
    }


    loadingGrade() {
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
          this.loadFirstTrue = (<Grades parentFunction={(e) => {
            this.activeSection = "assignments";
            this.loadAssignmentFromGrade = true;
            this.makeTreeVisible({ loadSpecificId: e })
          }} />)


          this.forceUpdate()
        })
        .catch(error => { this.setState({ error: error }) });
    }
    loadSection() {

      this.loadFirstTrue = null
      //console.log("loading section !")
      if (this.activeSection === "overview") {


        if (!this.alreadyLoadOverview) {
          this.loadOverview();
        }
      } else if (this.activeSection === "syllabus") {


        if (!this.alreadyLoadSyllabus) {
          this.loadSyllabus();
        }
      } else if (this.activeSection === "grades") {
        this.editCategoryButton = null


        this.loadingGrade();
      }
      else if (this.activeSection === "assignments") {
        this.editCategoryButton = null
        this.assignments_and_headings_loaded = false;
        //console.log("loading assignment")

        this.assignmentIsClicked = true;
        this.showsAllAssignment = !this.showsAllAssignment;
        this.assignmentOnScreen = false;
        this.treeOnScreen = true;
        this.thisAssignmentInfo = ""
        this.componentLoadedFromNavigationBar = null;
        if (this.enableAssignment) {
          this.makeTreeVisible({ loadSpecificId: "" })
        }
      }


    }

    loadCourseHeadingsAndAssignments(courseId) {
      this.assignments_and_headings_loaded = false;
      const url = "/api/getHeaderAndAssignmentInfo.php";
      const data = {
        courseId: courseId
      }
      const payload = {
        params: data
      }
      axios.get(url, payload).then(resp => {
        //console.log(resp.data);
        let tempHeadingsInfo = {};
        let tempAssignmentsInfo = {};
        let tempUrlsInfo = {};
        Object.keys(resp.data).map(itemId => {
          if (resp.data[itemId]["type"] == "folder") {
            tempHeadingsInfo[itemId] = resp.data[itemId];
            tempHeadingsInfo[itemId]["type"] = "folder";
            if (itemId == "root") tempHeadingsInfo[itemId]["title"] = this.courseInfo[courseId]["courseName"];
            // process children
            for (let i in resp.data[itemId]["childrenId"]) {
              let childId = resp.data[itemId]["childrenId"][i];
              if (childId == "") continue;
              if (resp.data[childId]["type"] == "folder") {
                tempHeadingsInfo[itemId]["childFolders"].push(childId);
              } else if (resp.data[childId]["type"] == "content") {
                tempHeadingsInfo[itemId]["childContent"].push(childId);
              } else {
                tempHeadingsInfo[itemId]["childUrls"].push(childId);
              }
            }
          } else if (resp.data[itemId]["type"] == "content") {
            tempAssignmentsInfo[itemId] = resp.data[itemId];
            tempAssignmentsInfo[itemId]["type"] = "content";
          }
        })
        this.headingsInfo = Object.assign({}, this.headingsInfo, { [courseId]: tempHeadingsInfo });
        this.assignmentsInfo = Object.assign({}, this.assignmentsInfo, { [courseId]: tempAssignmentsInfo });
        this.assignments_and_headings_loaded = true;
        this.forceUpdate();
      }).catch(error => {
        this.setState({ error: error })
      });
    }

    makeTreeVisible({ loadSpecificId }) {
      this.loadCourseHeadingsAndAssignments(this.currentCourseId);
    }

    // makeTreeVisible({loadSpecificId}) {
    //   const url_header_assignment = "/api/getHeaderAndAssignmentInfo.php";
    //   this.assignment_obj = {}
    //   this.heading_obj = {}
    //   const data={        
    //     courseId:this.currentCourseId
    //   }
    //   const payload = {
    //     params: data
    //   }
    //     axios.get(url_header_assignment,payload)
    //   .then (resp=>{
    //     this.obj_return = resp.data;

    //     this.alreadyMadeTree=true;
    //     let iterator=0;      
    //     let keys = (Object.keys(this.obj_return));
    //     let length = keys.length;
    //     while (iterator<length){
    //       let currentId = keys[iterator];
    //       let title = this.obj_return[currentId]['title'];
    //       let parentId = this.obj_return[currentId]['parentId']
    //       if (parentId==null || parentId=="null" || parentId==""){
    //         parentId=null;
    //       }
    //       let currentIdAttribute = this.obj_return[currentId]['type']
    //       if (currentIdAttribute==='header'){
    //         let childAssignments = this.obj_return[currentId]['childAssignments']
    //         let childHeadings = this.obj_return[currentId]['childHeadings']
    //         let childrenArray = this.obj_return[currentId]['childrenId'];

    //           childrenArray.forEach(element=>{
    //             if (element!=null && element!=""){
    //               let childAttribute = this.obj_return[element]['type']
    //               if (childAttribute==="header"){
    //                 childHeadings.push(element)
    //               } else {
    //                 childAssignments.push(element)
    //               }
    //             }               
    //           })

    //         this.heading_obj [currentId]={title:title,type:"header",parentId:parentId,childHeadings:childHeadings,childAssignments:childAssignments}
    //       } else {
    //         let contentId = this.obj_return[currentId]['contentId']
    //         let branchId = this.obj_return[currentId]['branchId']
    //         let assignedDate = this.obj_return[currentId]['assignedDate']
    //         let dueDate = this.obj_return[currentId]['dueDate']
    //         let numberOfAttemptsAllowed = this.obj_return[currentId]['numberOfAttemptsAllowed']
    //         this.assignment_obj [currentId]={title:title,type:"assignment",
    //         parentId:parentId,branchId:branchId,contentId:contentId,
    //         assignedDate:assignedDate,dueDate:dueDate,numberOfAttemptsAllowed:numberOfAttemptsAllowed
    //       }
    //       }
    //       iterator++;
    //     }
    //       this.buildTreeArray()
    //       this.buildTree()
    //       this.alreadyHadAssignmentsIndexAndDoenetML = true
    //       this.assignmentTree = (<div 
    //         // className="homeActiveSectionMainTree"
    //       >{this.tree}</div>);

    //       if (this.LoadAssignmentFromTheBeginningFlag) {
    //       this.loadAssignmentContent({contentId:null,branchId:null,assignmentId:loadSpecificId})
    //       this.LoadAssignmentFromTheBeginningFlag=false
    //       }
    //       if (this.loadAssignmentFromGrade){
    //       this.loadAssignmentContent({contentId:null,branchId:null,assignmentId:loadSpecificId})
    //       this.loadAssignmentFromGrade=false
    //       }
    //     this.forceUpdate();

    //   }).catch(error=>{this.setState({error:error})});


    // }

    updateLocationBar(assignmentId = this.assignmentId, activeSection = this.activeSection){
      window.location.href = "/course/#/" + this.activeSection

    }
    makingSwitchAndEditButton() {
      this.editCategoryButton = null
      this.switchCategoryButton = null;
      if (this.rightToEdit) {
        if (this.activeSection === "overview") {
          this.editCategoryButton = (
            <button
              style={{
                backgroundColor: "#4CAF50",
                border: "none",
                color: "white",
                padding: "8px 15px",
                textAlign: "center",
                textDecoration: "none",
                display: "inline-block",
                fontSize: "16px",
                margin: "4px 2px",
                cursor: "pointer"
              }}
              onClick={() => window.location.href = "/editor/?branchId=" + this.overview_branchId}
            >
              <FontAwesomeIcon className="Section-Icon" icon={faEdit} />
            </button>
          )
          this.switchCategoryButton = (
            <div style={{ padding: "2px 2px 2px 2px", margin: "5px 2px 2px 2px" }}>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={this.enableOverview}
                  onChange={(e) => {
                    this.enableOverview = !this.enableOverview;
                    this.newChange = true;
                    this.findEnabledCategory();
                  }} />
                <span className="slider round"></span>
              </label>
            </div>
          )
        }
        else if (this.activeSection === "syllabus") {

          this.editCategoryButton = (
            <button
              style={{
                backgroundColor: "#4CAF50",
                border: "none",
                color: "white",
                padding: "8px 15px",
                textAlign: "center",
                textDecoration: "none",
                display: "inline-block",
                fontSize: "16px",
                margin: "4px 2px",
                cursor: "pointer"
              }}
              onClick={() => window.location.href = "/editor/?branchId=" + this.syllabus_branchId}
            >
              <FontAwesomeIcon className="Section-Icon" icon={faEdit} />
            </button>
          )
          this.switchCategoryButton = (
            <div style={{ padding: "2px 2px 2px 2px", margin: "5px 2px 2px 2px" }}>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={this.enableSyllabus}
                  onChange={(e) => {
                    this.enableSyllabus = !this.enableSyllabus;
                    this.newChange = true;
                    this.findEnabledCategory();
                  }} />
                <span className="slider round"></span>
              </label>
            </div>
          )
        }
        else if (this.activeSection === "grades") {
          this.editCategoryButton = null
          this.switchCategoryButton = (
            <div style={{ padding: "2px 2px 2px 2px", margin: "5px 2px 2px 2px" }}>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={this.enableGrade}
                  onChange={(e) => {
                    this.enableGrade = !this.enableGrade;
                    this.newChange = true;
                    this.findEnabledCategory();
                  }} />
                <span className="slider round"></span>
              </label>
            </div>
          )
        }
        else if (this.activeSection === "assignments") {
          this.editCategoryButton = null
          this.switchCategoryButton = (
            <div style={{ padding: "2px 2px 2px 2px", margin: "5px 2px 2px 2px" }}>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={this.enableAssignment}
                  onChange={(e) => {
                    this.enableAssignment = !this.enableAssignment;
                    this.newChange = true;
                    this.findEnabledCategory();
                  }} />
                <span className="slider round"></span>
              </label>
            </div>
          )
        }
      }
    }
    render() {
      //console.log("====RENDER====");

      this.makingSwitchAndEditButton()
      this.overview_link = null
      this.syllabus_link = null
      this.grade_link = null
      this.assignment_link = null

      if (!this.alreadyLoadAllCourses) {
        this.loadAllCourses()
      }
      if (this.courseIdsArray == []) {
        //console.log(" from line 3240, this.courseIdsArray==[]")
        this.forceUpdate()
      }
      let found = false
      this.trueList.forEach(e => {
        if (e === this.activeSection && found === false) {
          found = true
        }
      });
      if (this.DoneLoading === true && found === false && this.activeSection != null) {
        this.activeSection = this.trueList[0]
        this.updateLocationBar() // this make sure it has the correct URL
      }


      if (this.newChange === true) {
        this.ToggleList();
      }
      let overview_class = "SectionContainer";
      let syllabus_class = "SectionContainer";
      let grade_class = "SectionContainer";
      let assignment_class = "SectionContainer";

      let overview_class_text = "Section-Text";
      let syllabus_class_text = "Section-Text";
      let grade_class_text = "Section-Text";
      let assignment_class_text = "Section-Text";
      if (!this.enableOverview) {
        overview_class_text += " disabled"
      }
      if (!this.enableSyllabus) {
        syllabus_class_text += " disabled"
      }
      if (!this.enableGrade) {
        grade_class_text += " disabled"
      }
      if (!this.enableAssignment) {
        assignment_class_text += " disabled"
      }
      if (this.activeSection === "overview") {
        overview_class = "SectionContainer-Active";
      } else if (this.activeSection === "syllabus") {
        syllabus_class = "SectionContainer-Active";
      } else if (this.activeSection === "grades") {
        grade_class = "SectionContainer-Active";
      } else if (this.activeSection === "assignments") {
        assignment_class = "SectionContainer-Active";
      }
      if (this.rightToEdit || (this.rightToView && this.enableOverview)) {
        this.allElementsCopy['element01'] = {
          type: "IndependentItem",
          thisElementLabel: "overview",
          grayOut: !this.enableOverview,
          callBack: (() => {
            this.activeSection = "overview";
            this.thisAssignmentInfo = "";
            this.loadSection();
            this.componentLoadedFromNavigationBar = null;
            //console.log("clicking overview_link")
            this.forceUpdate()
          }
          ),
        }

      }
      if (this.rightToEdit || (this.rightToView && this.enableSyllabus)) {
        this.allElementsCopy['element02'] = {
          type: "IndependentItem",
          thisElementLabel: "syllabus",
          grayOut: !this.enableSyllabus,
          callBack: (() => {
            this.activeSection = "syllabus";
            this.thisAssignmentInfo = "";
            this.loadSection();
            this.componentLoadedFromNavigationBar = null;
            //console.log("clicking syllabus_link")
            this.forceUpdate()
          }
          ),
        }


      }
      //console.log(this.assignment_obj);
      //console.log(this.heading_obj);
      if (this.rightToEdit || (this.rightToView && this.enableGrade)) {
        this.allElementsCopy['element03'] = {
          type: "IndependentItem",
          thisElementLabel: "grades",
          grayOut: !this.enableGrade,
          callBack: (() => {
            this.activeSection = "grades";
            this.thisAssignmentInfo = "";
            this.loadSection();
            this.componentLoadedFromNavigationBar = null;
            this.editCategoryButton = null
            //console.log("clicking grade_link")
            this.forceUpdate()
          }
          ),
        }

        this.grade_route = (
          <Route key="grades" exact path="/grades">
            <Grades parentFunction={(e) => { this.activeSection = "assignments"; this.loadAssignmentFromGrade = true; this.makeTreeVisible({ loadSpecificId: e }) }} />
            {/* //this.props.student, this.props.sections, this.props.group,
                  // this.props.gradeCategories, this.props.score, this.props.subtotal
                  // this.props.total */}
            {/* {this.gradeComponent} */}
          </Route>
        )
      }
      if (this.rightToEdit || (this.rightToView && this.enableAssignment)) {
        this.allElementsCopy['element04'] = {
          type: "IndependentItem",
          thisElementLabel: "assignments",
          grayOut: !this.enableAssignment,
          callBack: (() => {
            this.activeSection = "assignments";
            this.thisAssignmentInfo = "";
            this.loadSection();
            this.componentLoadedFromNavigationBar = null;
            this.editCategoryButton = null
            //console.log("clicking assignment_link")
            this.forceUpdate()
          }
          ),
        }


      }

      if (this.AssignmentInfoChanged) {
        this.AssignmentInfoChanged = false;
        this.saveAssignmentInfo()
      }
      // making courses to choose
      if (this.courseIdsArray != []) {
        this.coursesToChoose = {}
        this.courseIdsArray.map((id) => {
          this.coursesToChoose[id] = {
            showText: this.courseInfo[id]['courseName'],
            callBackFunction: (e) => { // changing

              this.updateNumber += 1
              this.alreadyHasCourseInfo = false
              this.alreadyLoadAssignment = []
              this.alreadyMadeLink = []
              this.tree_route = []
              this.tree_route_right_column = []


              this.overview_branchId = ""
              this.syllabus_branchId = ""

              this.overview_link = null
              this.syllabus_link = null
              this.grade_link = null
              this.assignment_link = null
              this.currentCourseId = e;
              this.selectedCourseId = e;

              this.roleInstructor = this.coursesPermissions['courseInfo'][this.currentCourseId]['roleInstructor'];
              this.roleStudent = this.coursesPermissions['courseInfo'][this.currentCourseId]['roleStudent'];
              
              if (this.roleStudent === "1") {
                this.rightToView = true;
                this.rightToEdit = false;
              }
              if (this.roleInstructor === "1") {
                this.rightToView = true;
                this.rightToEdit = true;
              }

              this.usingDefaultCourseId = false;
              this.alreadyLoadAllCourses = false;
              this.forceUpdate()
            }
          }
        })
      }
  const currentCourseName = this.selectedCourseId && this.courseInfo ? (this.courseInfo[this.selectedCourseId]['courseName']) : "";
      return (
        <React.Fragment>
          {/* <div className="courseContainer"> */}

      <ToolLayout
        headerRoleFromLayout={this.state.headerRoleFromLayout}
         toolName="Course" headingTitle={currentCourseName}>
            <ToolLayoutPanel
              key={"TLP01" + this.updateNumber++}
              panelName="context"
              panelHeaderControls={[
                (this.coursesToChoose ?
                  <Menu
                    currentTool={"something"}
                    width={"200px"}
                    key={"menu00" + (this.updateNumber++)}
                    //showThisRole={"N/A"}

                    showThisRole={this.selectedCourseId && this.courseInfo ? (this.courseInfo[this.selectedCourseId]['courseName'] + "  ") : " "}
                    itemsToShow={this.coursesToChoose}
                    offsetPos={-20}
                    menuWidth={"200px"}
                  />
                  : null)
              ]}
            >
              <Router>
                <>



                  {/* {this.activeSection==="assignments"?this.assignmentTree:null}  */}


                </>
              </Router>
              <SelectionSet
                key={"SelectSet1" + (this.updateNumber++)}
                // CommonCallBack={(e)=>{console.log(e)}}
                allElements={this.allElementsCopy}
                type={"Link"}
                forceSelected={this.activeSection}
                gradeOut={[this.listGrayOut]}
              />
              {/* {this.activeSection==="assignments"?this.assignmentTree:null} */}
              {/* <SelectionSet 
            key={"SelectSet1"+(this.updateNumber++)}
            CommonCallBack={(e)=>{console.log("common callback: "+e)}} //default callBack for every choices
            allElements={
              {
                element01:{
                  type:"IndependentItem",
                  thisElementLabel:"choice01",
                  // callBack:(()=>{console.log("choice001")}),
                },
                element02:{
                  type:"IndependentSet",
                  thisElementLabel:"Set01",
                  subSet:["choiceA","choiceB","choiceC"],
                  OverloadingFunctionOnItems:{
                    "choiceB":(()=>{console.log("IT IS choiceB")})
                  }
                },
                element03:{
                  type:"IndependentSet",
                  thisElementLabel:"Set02",
                  subSet:["choiceX","choiceY","choiceZ"],
                  OverloadingFunctionOnItems:{
                    "choiceZ":(()=>{console.log("choiceZZZ")})
                  }
                }
              }
            }
            /> */}

            </ToolLayoutPanel>

            <ToolLayoutPanel
              key={"TLP02" + this.updateNumber++}
              panelName="Editor"
              panelHeaderControls={[
                (this.activeSection === "grades" || this.activeSection === "assignments" ? null :
                  this.editCategoryButton),
                this.switchCategoryButton

              ]}
            >
              <Router>
                <>
                  <Switch>
                    <Route key="overview" exact path="/overview">
                      {this.Overview_doenetML != "" && this.Overview_doenetML != undefined ?
                        <Overview doenetML={this.Overview_doenetML}

                        />
                        : null}
                    </Route>
                    <Route key="syllabus" exact path="/syllabus">
                      {this.Syllabus_doenetML != "" && this.Syllabus_doenetML != undefined ? <Syllabus doenetML={this.Syllabus_doenetML} /> : null}
                    </Route>
                    {this.grade_route}
                    <Route key="/" exact path="/">
                      {this.loadFirstTrue}
                    </Route>
                    <Route key="assignments" exact path='/Assignments'>
                      {this.assignments_and_headings_loaded && <DoenetAssignmentTree
                        loading={!this.assignments_and_headings_loaded}
                        containerId={this.currentCourseId}
                        treeHeadingsInfo={this.headingsInfo[this.currentCourseId] ? this.headingsInfo[this.currentCourseId] : {}}
                        treeAssignmentsInfo={this.assignmentsInfo[this.currentCourseId] ? this.assignmentsInfo[this.currentCourseId] : {}}
                        updateHeadingsAndAssignments={() => this.saveTree({
                          courseId: this.currentCourseId,
                          headingsInfo: this.headingsInfo[this.currentCourseId],
                          assignmentsInfo: this.assignmentsInfo[this.currentCourseId],
                        })}
                      />}
                      
                    </Route>
                    {/* {this.tree_route} */}
                  </Switch>
                </>
              </Router>
            </ToolLayoutPanel>

            <ToolLayoutPanel
              key={"TLP03" + this.updateNumber++}>
              <Router>
                <>
                  <Switch>
                    {this.tree_route_right_column}
                  </Switch>
                </>
              </Router>
            </ToolLayoutPanel>
          </ToolLayout>

          {/* </div> */}



        </React.Fragment>)

    }
  }



  export default DoenetCourse;