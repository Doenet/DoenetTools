import React, { Component } from 'react';
import DoenetViewer from '../React/DoenetViewer';
import axios from 'axios';
import MersenneTwister from 'mersenne-twister';
import './admin.css';
import nanoid from 'nanoid';
import DoenetHeader from './DoenetHeader';
import { faPlus, faDotCircle, faWindowClose, faEdit, faCaretRight, faChalkboard } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
function assignment_false(){
  console.log("====calling assignment_false====");
  window.location.href="/admin/?assignment=false"
};
let assignmentID = null;

class DoenetAdmin extends Component {
  constructor(props){
    super(props);
     console.log("===RESTART===")
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
    this.activeSection = url.searchParams.get("active");
    this.assignment_state_1 = url.searchParams.get("assignment"); // get false
    if (this.activeSection==='grade'){
      this.loadGrades()
    } 
    this.enableThese=[]
    this.overview_branchId=""
    this.syllabus_branchId=""

    this.state = {
      courseId: "",
      error: null,
      errorInfo: null,
      outlineType:"outline",
      overview:null,
      grade:null,
      assignment:this.assignment_state_1,
      syllabus:null,
      newChange:false,
      loadingTree:false,
    };
    if (this.assignment_state_1===undefined || this.assignment_state_1===null){
      this.assignment_state_1=true
    } else {
      this.assignment_state_1=false
    }


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
    console.log("CREATING SOME ID");
    console.log(nanoid())
    const url_header_assignment = "/api/getHeaderAndAssignmentInfo.php";
     this.arr_return=[];
     this.id_arr=[];
     // 3oSXu2L31eZBlZKKc4F7X is a header
     // null parent should be UltimateHeader with empty assignment and heading contains all other header
     this.downloadObj = [
      {"kwpKwEwW144tqROdo9dl5":{name:"header1",attribute:"header",assignmentId:["4P7WK6V4HvxS9fIT8IY4i","yfP_Pslr-WC1D8g2rEqhF"],
      headingId:["3oSXu2L31eZBlZKKc4F7X"],parent:"null"}},
      {"Sj7wQR-L2xFIxmS6QFMKn":{name:"header2",attribute:"header",assignmentId:["VffOCH1I0h_ymB9KQHR24"],headingId:[]}},
      {"3oSXu2L31eZBlZKKc4F7X":{name:"header3",attribute:"header",assignmentId:[],headingId:[],parent:"kwpKwEwW144tqROdo9dl5"}},
      {"4P7WK6V4HvxS9fIT8IY4i":{name:"Gateway exam practice",attribute:"assignment",parent:"kwpKwEwW144tqROdo9dl5"}},
     {"yfP_Pslr-WC1D8g2rEqhF":{name:"assignement2",attribute:"assignment",parent:"kwpKwEwW144tqROdo9dl5"}},
     {"VffOCH1I0h_ymB9KQHR24":{name:"assignment3",attribute:"assignment",parent:"L2xFIxmS6QFMKn"}}
     ]
    //  console.log(this.downloadObj)

    // {h2ID:{name:"header2",assignmentId = ["a3ID"],headingId=[]}, parent:null},
    // {h3ID:{name:"header3",assignmentId=[],headingId=[],parent:"h1ID"}}
    //5RdWCHX3Z-zHGi3-rupzq
    //fm3-3BxtVsMA0vqCyAOMA
     this.heading_obj = [
      {"kwpKwEwW144tqROdo9dl5":{name:"header1",attribute:"header",assignmentId:["4P7WK6V4HvxS9fIT8IY4i","yfP_Pslr-WC1D8g2rEqhF"],
      headingId:["Sj7wQR-L2xFIxmS6QFMKn","qAgAnGbEblNmlebe3sJOh"],parent:"null"}},
      {"Sj7wQR-L2xFIxmS6QFMKn":{name:"header2",attribute:"header",assignmentId:["VffOCH1I0h_ymB9KQHR24","zxVi-pXiUtf3PodIXm45n"],headingId:["5RdWCHX3Z-zHGi3-rupzq"],parent:"kwpKwEwW144tqROdo9dl5"}},
      {"3oSXu2L31eZBlZKKc4F7X":{name:"header3",attribute:"header",assignmentId:["iaROshxrgaz63vZ5xFdxE"],headingId:[],parent:"null"}},
      {"qAgAnGbEblNmlebe3sJOh":{name:"header4",attribute:"header",assignmentId:["mBUlzP63SK38l7XrWpyC"],headingId:[],parent:"kwpKwEwW144tqROdo9dl5"}},
      {"5RdWCHX3Z-zHGi3-rupzq":{name:"header6",attribute:"header",assignmentId:["fm3-3BxtVsMA0vqCyAOMA"],headingId:[],parent:"Sj7wQR-L2xFIxmS6QFMKn"}}
     ];
     console.log("this heading obj")
     console.log(this.heading_obj)

     this.assignment_obj = [
     {"4P7WK6V4HvxS9fIT8IY4i":{name:"Gateway exam practice",parent:"kwpKwEwW144tqROdo9dl5"}},
     {"yfP_Pslr-WC1D8g2rEqhF":{name:"assignement2",parent:"kwpKwEwW144tqROdo9dl5"}},
     {"VffOCH1I0h_ymB9KQHR24":{name:"assignment3",parent:"L2xFIxmS6QFMKn"}},
      {"iaROshxrgaz63vZ5xFdxE":{name:"assignment4",parent:"3oSXu2L31eZBlZKKc4F7X"}},
    {"zxVi-pXiUtf3PodIXm45n":{name:"assignment5",parent:"L2xFIxmS6QFMKn"}},
    {"mBUlzP63SK38l7XrWpyC":{name:"assignment6",parent:"qAgAnGbEblNmlebe3sJOh"}},
    {"fm3-3BxtVsMA0vqCyAOMA":{name:"assignment7",parent:"5RdWCHX3Z-zHGi3-rupzq"}}
  ];
     this.makeTreeArray=[]; // filled in buildTreeArray
     this.tree=[] // made in buildTree
     this.buildTreeArray()
     this.buildTree()

     console.log("this assignment obj")
     console.log(this.assignment_obj)
    axios (url_header_assignment)
      .then (resp=>{
        console.log("RUNNING PHP")
        this.arr_return = resp.data;
        let lengthOfReturnArray = (this.arr_return.length)
        console.log("arr is")
        let iterator=0;
        while (iterator<lengthOfReturnArray){
          this.id_arr.push(Object.keys(this.arr_return[iterator]));
          iterator++;
        }
        // now we have this.id_arr to access this.arr_return
        // also we can have a dictionary to look up name
        //TODO: load AND consolidate obj with the same key
        
        console.log(Object.values(this.arr_return))
        
        this.setState ({loadingTree:true});
        this.forceUpdate();
      }).catch(error=>{this.setState({error:error})});
      if (this.state.loadingTree){
        console.log("hell yas")
      }
      



    

      const loadUrl = '/api/loadEnable.php'
      this.payLoad = {
        overview:0,
        syllabus:0,
        grade:0,
        assignment:0
      }
      
      axios.get(loadUrl,this.payLoad)
        .then (resp=>{
         
               //!!+ is to convert string to boolean
          this.payLoad.overview=+(resp.data["overview"])
          this.payLoad.grade=+(resp.data["grade"])
          this.payLoad.syllabus=+(resp.data["syllabus"])
          this.payLoad.assignment=+(resp.data["assignment"])
          this.overview_branchId=resp.data["overview_branchId"]
          this.syllabus_branchId=resp.data["syllabus_branchId"]
          // assignment_state =+(resp.data["assignment"])
          // this.enabledDisabledArray = {
          //   overview:!!+payLoad.overview,
          //   syllabus:!!+payLoad.grade,
          //   grade:!!+payLoad.syllabus,
          //   assignment:!!+payLoad.assignment,
          // }

          this.state.overview=+(resp.data["overview"])
          this.state.grade=+(resp.data["grade"])
          this.state.syllabus=+(resp.data["syllabus"])
          this.state.assignment=+(resp.data["assignment"])
          if (!this.assignment_state_1){
            this.state.assignment=false;
          }
          Object.keys(this.payLoad).map((e)=>{
                if (this.payLoad[e]===1 && this.activeSection===null ){
                    console.log("finding")
                    console.log(e)
                    this.activeSection=e
                    //window.location.href="/admin/?active="+e
                    }
                })
          console.log("ACTIVE is..."+this.activeSection)
          console.log(`The courseId id is ${this.courseId}`);
          if (this.assignment_state_1===false){
            this.state.newChange=true;
          }
          this.DoneLoading=true;
          if(this.activeSection==='overview'){
            this.loadOverview();
          }else if(this.activeSection==='syllabus'){
            this.loadSyllabus();
          }
          // console.log("done")
          // this.forceUpdate()

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
    // this.PutInUnPublishList = this.PutInUnPublishList.bind(this);
    this.ToggleList = this.ToggleList.bind(this);
    this.loadGrades = this.loadGrades.bind(this);
    this.EnableThese = this.EnableThese.bind(this);
    this.loadOverview = this.loadOverview.bind(this);
    this.buildTree = this.buildTree.bind(this);
  }

  buildTreeArray(){
    //console.log(this.arr_return[this.id_arr.indexOf(this.id_arr[0])][this.id_arr[0]])
    // first get pId that is null
    // this.result_arr.splice(index,0,obj);=
    let headerObjectLength = this.heading_obj.length;
    let assignmentObjectLength = this.assignment_obj.length;
    let iterator = 0;
    this.headerId_arr=[]
    let already_built_header_id = {}
    this.assignmentId_arr=[]
    this.makeTreeArray=[]
    // create a header_id_arr to access header_obj
    
    while (iterator < headerObjectLength){
      let string_id = Object.keys(this.heading_obj[iterator]).toString()
      this.headerId_arr.push(string_id);
      already_built_header_id[string_id]=false;
      iterator++;
    }
    console.log("already built arr")
    console.log(already_built_header_id)
    iterator=0;
    while (iterator < assignmentObjectLength){
      this.assignmentId_arr.push(Object.keys(this.assignment_obj[iterator]).toString());
      iterator++;
    }
    console.log("inside build tree")
    console.log(this.headerId_arr)
    console.log(this.assignmentId_arr)
    iterator = 0;
    // establish level 0
    while (iterator < headerObjectLength) {
      let currentHeaderObject = 
      this.heading_obj[this.headerId_arr.indexOf(this.headerId_arr[iterator])][this.headerId_arr[iterator]];
      if (currentHeaderObject["parent"]==="null") {
        let object = {id:this.headerId_arr[iterator].toString(),name:currentHeaderObject["name"],attribute:"header",level:0}
        this.makeTreeArray.push(object)
      }
      iterator++;
    }
    // add header first, level = level's parent + 1
    iterator = 0;
    console.log(this.makeTreeArray)
    console.log(this.makeTreeArray[0]["id"])
    
    // .splice(index,0,obj)
     while (iterator < this.makeTreeArray.length){
      let indexOfHeader = this.headerId_arr.indexOf(this.makeTreeArray[iterator]["id"])
      let currentHeaderObject = 
      this.heading_obj[indexOfHeader][this.makeTreeArray[iterator]["id"]];
      (currentHeaderObject["headingId"]).forEach(e=>{
        console.log("id is " + e.toString())
        e  = e.toString();
        // check if name built already
        if (already_built_header_id[e]===false) {  // not built yet
          let name = this.heading_obj[this.headerId_arr.indexOf(e)][e]["name"];
          let attribute = this.heading_obj[this.headerId_arr.indexOf(e)][e]["attribute"]
          let newLevel = this.makeTreeArray[iterator]["level"]+1;
          let object = {id:e.toString(),name:name,attribute:attribute,level:newLevel}
          this.makeTreeArray.splice(iterator+1,0,object)
        }
      })
      iterator++;
    }
   //add assignments
    iterator = 0;
    console.log(this.makeTreeArray)
    console.log("adding assignment")
    while (iterator < this.makeTreeArray.length){
      if (this.makeTreeArray[iterator]["attribute"]==="header"){
        console.log("iterator is" + iterator)
        let indexOfHeader = this.headerId_arr.indexOf(this.makeTreeArray[iterator]["id"])
        let currentHeaderObject = 
        this.heading_obj[indexOfHeader][this.makeTreeArray[iterator]["id"]];
      let assignment_list = currentHeaderObject["assignmentId"]
      if (assignment_list!=[]) {
      (assignment_list).forEach(e=>{
        // assume unique assignment has unique headers
          let name = this.assignment_obj[this.assignmentId_arr.indexOf(e.toString())][e.toString()]["name"];
          let newLevel = this.makeTreeArray[iterator]["level"]+1;
          let object1 = {id:e.toString(),name:name,level:newLevel}
          console.log(object1)
          this.makeTreeArray.splice(iterator+1,0,object1)
      })
    }
      }
      iterator++;
    }

    console.log("make tree")
    console.log(this.makeTreeArray)
  }
buildTree(){
  console.log("inside build tree array")
  // making space
  this.tree = [];
  this.makeTreeArray.forEach(element=>{
  let name = element["name"]
  let level = element["level"];
  let leftMargin = `${level*20}px`;
  let tree_branch = (<div style={{marginLeft:leftMargin}}>{name}</div>)
  this.tree.push(tree_branch)
  })
  console.log("YES TREE")
  console.log(this.tree)
}

EnableThese(e){
  let name = e.target.value
  if (name==="overview"){
    this.state.overview = true
  } else if (name==="syllabus") {
    this.state.syllabus = true
  }else if (name==="grade") {
    this.state.grade = true
  }else if (name==="assignment") {
    this.state.assignment = true
  }
  e.target.value="adding back"
  // if (this.assignment_state_1===false){
  //   window.location.href="/admin"
  // }
  this.setState({newChange:true})
  this.forceUpdate()
}

  ToggleList(){
    // TODO: why this always get called when reset page ?
    console.log("=====TOGGLE=====")
    // this.enabledDisabledArray[this.activeSection]=!this.enabledDisabledArray[this.activeSection];
    // //console.log("active section is..."+this.activeSection)
    // if (this.activeSection==="overview"){
    //   this.setState({overview:this.enabledDisabledArray[this.activeSection]})
    // }else if (this.activeSection==="grade"){
    //   this.setState({grade:this.enabledDisabledArray[this.activeSection]})
    // }else if (this.activeSection==="assignment"){
    //   this.setState({assignment:this.enabledDisabledArray[this.activeSection]})
    // }else if (this.activeSection==="syllabus"){
    //   this.setState({syllabus:this.enabledDisabledArray[this.activeSection]})
    // }
    const url = '/api/save_enable_disable_category.php'
    console.log(this.state.overview)
    console.log(this.state.grade)
    console.log(this.state.syllabus)
    console.log(this.state.assignment)

    const data = {
      overview:Number(this.state.overview),
      grade:Number(this.state.grade),
      syllabus:Number(this.state.syllabus),
      assignment:Number(this.state.assignment)
    }
    console.log(data)
    axios.post(url, data)
    .then(function (response) {
      // console.log(response);
      // console.log("-------DATA is---------")
      // console.log(response.data);
      
    })
    .catch(function (error) {
      this.setState({error:error});

    })
    // adding list
    this.setState({newChange:false})

    //this.forceUpdate()
    if (data[this.activeSection]===0){
      if (data.overview===1){
        this.loadOverview();
        this.buildOverview();
        this.updateLocationBar({});
      }else if (data.syllabus===1){
        this.loadSyllabus();
        this.buildSyllabus();
        this.updateLocationBar({});
      }else if (data.grade===1){
        this.loadGrades();
        this.buildGrades();
        this.updateLocationBar({});
      }else if (data.assignment===1){
        this.mainSection=null;
        this.updateLocationBar({});
      }else {
        this.updateLocationBar({activeSection:null})
      }
    }

  }

  updateLocationBar(assignmentId=this.assignmentId, activeSection=this.activeSection){
    history.replaceState({},"title","?active="+activeSection);
    if (this.activeSection === "assignments") {
      console.log(this.assignmentId);
      history.replaceState({},"title","?active="+activeSection+"&assignmentId="+assignmentId);
    }
  }

  loadOverview(){
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
        this.forceUpdate();
      })
      .catch(error=>{this.setState({error:error})});
  }

  buildOverview(){
    this.mainSection = this.loadingScreen;
    //talk to database to load fresh info
    this.overview = (<React.Fragment>
      <h2 data-cy="sectionTitle">Overview</h2> 
      {this.doenetML!=""?
      
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
            />:null}
    </React.Fragment>)

    this.mainSection = this.overview;
  }

  loadSyllabus(){
    console.log("LOAD Syllabus")
    this.doenetML="";
    console.log("branch id...")
    console.log(this.syllabus_branchId)
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
        console.log("doenetML!!!!!!!!!!!!");
        console.log(doenetML);
        this.updateNumber++;
        this.doenetML=doenetML;
        this.forceUpdate();
      })
      .catch(error=>{this.setState({error:error})});
  }

  buildSyllabus(){
    this.mainSection = this.loadingScreen;

    //talk to database to load fresh info
    this.overview = (<React.Fragment>
      <h2 data-cy="sectionTitle">Syllabus</h2> 
      {this.doenetML!=""?
      <div><button onClick={()=>window.location.href="/editor/?branchId="+this.syllabus_branchId}><FontAwesomeIcon icon={faEdit}/></button><DoenetViewer 
              key={"doenetviewer"+this.updateNumber} //each component has their own key, change the key will trick Reach to look for new component
              free={{doenetCode: this.doenetML}} 
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

  buildAssignment() {
    this.mainSection = this.loadingScreen;
    this.activeSection="assignment"; // this is kept 
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
    // TODO: what assignment get un-publish ?
    console.log("assignment ID OVER HERE !!!!")
    assignmentID = this.assignmentObj.assignmentId;
    this.assignmentFragment = <React.Fragment>
      <div className="assignmentContainer">     
        <div className="assignmentActivity">
              {this.assignmentObj.assignmentId?<DoenetViewer 
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
              />:<p>Loading...</p>}
        </div>
      </div>
    </React.Fragment>;

    this.mainSection = this.assignmentFragment;
    this.updateLocationBar(this.assignmentObj.assignmentId);
    this.forceUpdate();
  }

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
  }s

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
      // no saveVariant.php
    //   const url='/api/saveVariant.php';
    // const data={
    //   assignmentId: this.assignmentObj.assignmentId,
    //   assignedVariant:this.assignmentObj.assignedVariant,
    //   attemptNumber:this.assignmentObj.attemptNumber,
    //   contentId:this.assignmentObj.contentId,
    // }
    // const payload = {
    //   params: data
    // }
    // console.log("saveVariant data");
    // console.log(data);
    
    
    // axios.get(url,payload)
    //   .then(resp=>{
    //     console.log(resp.data);
    //   });
      
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
    console.log("====RENDER====");
    if (this.state.newChange===true){
    this.ToggleList();
    }
    this.enableThese=[]
    this.enabledDisabledArray = {
      "overview":!!+this.state.overview,
      "syllabus":!!+this.state.syllabus,
      "grade":!!+this.state.grade,
      "assignment":!!+this.state.assignment,
    }
    Object.keys(this.enabledDisabledArray).map(e=>{
      if (this.enabledDisabledArray[e]===false){
        this.enableThese.push(<option value={e}>{e}</option>)
      }
    });
        this.TrueList = []
    Object.keys(this.enabledDisabledArray).map(e=>{
      if (this.enabledDisabledArray[e]===true){
        this.TrueList.push(e)
      }
    });
    let temp = false
    this.TrueList.forEach(e=>{
      if (e===this.activeSection && temp===false){
        temp=true
      }
    });
    if ( this.DoneLoading===true && temp===false && this.activeSection!=null){
      this.activeSection=this.TrueList[0]
      this.updateLocationBar() // this make sure it has the correct URL
    }

    //We have an error so doen't show the viewer
    if (this.state.error){

      return (<React.Fragment>
        <p style={{color: "red"}}>{this.state.error && this.state.error.toString()}</p>
        </React.Fragment>);
    }

    if (this.activeSection === "overview"){
       this.buildOverview();
    } else if (this.activeSection === "syllabus"){
      this.buildSyllabus();
    } else if (this.activeSection === "grade"){
      this.buildGrades();
    }
    let overview_component=null;
    let syllabus_component=null;
    let grade_component=null;
    let assignment_component=null;
    let overview_class = "SectionContainer";
    let syllabus_class = "SectionContainer";
    let grade_class = "SectionContainer";
    let assignment_class = "SectionContainer";
    if (this.activeSection==="overview"){
      overview_class = "SectionContainer-Active";
    } else if (this.activeSection === "syllabus"){
      syllabus_class = "SectionContainer-Active";
    } else if (this.activeSection === "grade"){
      grade_class = "SectionContainer-Active";
    } else if (this.activeSection === "assignment"){
      assignment_class = "SectionContainer-Active";
    }

      let tree_component = (<div >{this.tree}</div>)

    if (this.state.overview){
       overview_component = (<div className={overview_class} data-cy="overviewNavItem" onClick={() => {
        this.activeSection = "overview";
        this.loadOverview();
        this.updateLocationBar({});
        //this.forceUpdate();
      }}><span className="Section-Text">Overview</span>
      <span className="Section-Icon-Box">         
        <FontAwesomeIcon className="Section-Icon" onClick={()=>window.location.href="/editor/?branchId="+this.overview_branchId} icon={faEdit}/></span>
      <span className="Section-Icon-Box">         
        <FontAwesomeIcon className="Section-Icon" onClick={()=>{this.setState({overview:false,newChange:true});}} icon={faWindowClose}/></span>
      </div>)
    }
    if (this.state.syllabus){
       syllabus_component =(
        <div className={syllabus_class} data-cy="syllabusNavItem" onClick={() => {
          this.activeSection = "syllabus";
          this.loadSyllabus();
          this.updateLocationBar({});
          //this.forceUpdate();
        }}><span className="Section-Text">Syllabus</span>
          <span className="Section-Icon-Box">         
        <FontAwesomeIcon className="Section-Icon" onClick={()=>window.location.href="/editor/?branchId="+this.syllabus_branchId} icon={faEdit}/></span>
      <span className="Section-Icon-Box">         
        <FontAwesomeIcon className="Section-Icon" onClick={()=>{this.setState({syllabus:false,newChange:true});}} icon={faWindowClose}/></span>
        </div>)
    }
    if (this.state.grade){
       grade_component = (<div className={grade_class} data-cy="gradesNavItem" onClick={() => {
        this.activeSection="grade";
        this.loadGrades();
        this.updateLocationBar({});
        // this.forceUpdate();
        // className="GradeDisableButton" onClick={()=>{this.setState({grade:false,newChange:true});}}
      }}><span className="Section-Text">Grade</span>
      <span className="Section-Icon-Box">         
    <FontAwesomeIcon className="Section-Icon" icon={faEdit}/></span>
  <span className="Section-Icon-Box">         
    <FontAwesomeIcon className="Section-Icon" onClick={()=>{this.setState({grade:false,newChange:true});}} icon={faWindowClose}/></span>
      </div>)
    }
    

    

    
    if (this.state.assignment){
      assignment_component = (
        <div className="homeMainMenuItem" data-cy="assignmentsAccordion">            
          <Accordion>
            <div label= "Assignments" >
           
              <div className="courseLeftNav">
                <div style={{display:"flex",marginBottom:"10px"}}>
                  <select style={{fontSize:"16px",width:"320px"}}
                  value={this.state.outlineType} 
                  onChange={(e)=>{
                    this.activeSection="assignment"
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
      </div>) 
    }
     

  
    return (<React.Fragment>
      <div className="courseContainer">
        
        <DoenetHeader toolTitle="Admin" headingTitle={this.courseName} />
        <div className="homeLeftNav">
          {overview_component}
          {syllabus_component}
          {grade_component}
          {assignment_component}
          {tree_component}
          
        <select style={{marginTop:"10px"}} onChange={this.EnableThese}>
          <option>Enable Section</option>
          {this.enableThese }
        </select>
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
        <div style={{ cursor: 'pointer' }}>
          <span className="Section-Text" onClick={onClick} >{label}</span>&nbsp;
          <span><FontAwesomeIcon className="Section-Icon" onClick={()=>{console.log("assignmentID is"+assignmentID);}}icon={faEdit}/></span>
  <span className="Section-Icon-Box">         
    <FontAwesomeIcon className="Section-Icon" onClick={()=>{assignment_false()}} icon={faWindowClose}/></span>
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

export default DoenetAdmin;