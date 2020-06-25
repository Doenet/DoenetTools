import React, { Component } from 'react';
import DoenetViewer from '../Tools/DoenetViewer';
import axios from 'axios';
import MersenneTwister from 'mersenne-twister';
import './exam.css';



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

class DoenetExam extends Component {
  constructor(props){
    super(props);

    this.state = {
      mode: "",
      code: "<p>Loading...</p>",
      gradesOpen: true,
      error: null,
      errorInfo: null,
      minutes:null,
      searchField: "",
      page: "loading",
    };

    this.gradeReport = null;

    this.functionsSuppliedByChild = {};
    this.legitAccessKey = '0';
    this.learnersInfo = null;
    this.log = [];


    //TODO: need to choose from courses that are currently being held

   
    this.courseId = "aI8sK4vmEhC5sdeSP3vNW";
    this.authPasscode = "";

    this.updateNumber = 0;
    this.loadExam = this.loadExam.bind(this);
    this.beginExam = this.beginExam.bind(this);
    this.updateTimer = this.updateTimer.bind(this);
    this.buildExamGrade = this.buildExamGrade.bind(this);
    this.buildExamGradeHelper = this.buildExamGradeHelper.bind(this);
    this.getLearnersInfo = this.getLearnersInfo.bind(this);
    this.showExamGrade = this.showExamGrade.bind(this);
    this.getPasscode = this.getPasscode.bind(this);
    this.getExams = this.getExams.bind(this);

    this.getPasscode();

  }

  getPasscode(){
    const url='/open_api/getPasscode.php';
      const data={
        courseId: this.courseId,
      }
      const payload = {
        params: data
      }

      axios.get(url,payload)
        .then(resp=>{
          this.authPasscode = resp.data.authPasscode;
          this.legitAccessKey = resp.data.legitAccessKey;
          
          if(Number(this.legitAccessKey) === 0){
            this.setState({page:"no access"});
          }else{
            this.setState({page:"enter passcode"});
          }

        });
  }

  getExams(){
    const url='/open_api/getExams.php';
      const data={
        courseId: this.courseId,
        learnerUsername: this.learner.username,
      }
      const payload = {
        params: data
      }
      console.log("getExams");
      console.log(this.learner);
      console.log("data");
      console.log(data);
      
      
      axios.get(url,payload)
        .then(resp=>{
          console.log("resp.data");
          console.log(resp.data);
          
          this.exams = resp.data.exams;
          
          this.setState({page:"choose exam"});
        });
  }

  componentDidCatch(error, info){
    this.setState({error:error,errorInfo:info});
  }

  loadExam({examInfo}){
    // console.log("----");
    // console.log(examInfo);
    this.activeExam = examInfo;
    this.assignmentId = examInfo.assignmentId;

      const url='/open_api/getExamCoverPage.php';
          const data={
            assignmentId: this.assignmentId,
            courseId: this.courseId,
            learnerUsername: this.learner.username,

          }
          const payload = {
            params: data
          }
          axios.get(url,payload)
          .then(resp=>{
            console.log(resp.data);
            // this.examHTML = resp.data;
            this.examHTML = resp.data.examHTML;
            this.timeLimit = resp.data.timeLimit;
            this.courseTitle = resp.data.courseTitle;
            this.setState({page:"show coverpage"});
          });
    

    
  }

  updateTimer(){
    let current = new Date();
    let expiredMinutes = (current.getTime() - this.startTime.getTime()) / 1000 / 60;
    // let expiredMinutes = (current.getTime() - this.startTime.getTime()) / 1000;
    let minutesRemaining = this.timeLimit - expiredMinutes;

    if (minutesRemaining > 0 && !this.isExamSubmitted){
      setTimeout(this.updateTimer,1000);
    }

    this.setState({minutes:minutesRemaining})
  }

  beginExam(){
    this.startTime = new Date();
    setTimeout(this.updateTimer,1000);

      const url='/open_api/beginSecureExam.php';
      const data={
        assignmentId: this.assignmentId,
        courseId: this.courseId,
        learnerUsername: this.learner.username,
      }
      const payload = {
        params: data
      }
      
      axios.get(url,payload)
      .then(resp=>{
        
        
        this.doenetML = resp.data.doenetML;
        this.attemptNumber = resp.data.attemptNumber;
        this.individualize = resp.data.individualize;
        this.contentId = resp.data.contentId;
        this.assignedVariant = this.variantNumberFromAttemptNumber();

        //Save attempt number to database
        //Save assignedVariant to DB
        const url='/open_api/saveVariant.php';
      const data={
        assignmentId: this.assignmentId,
        assignedVariant:this.assignedVariant,
        attemptNumber:this.attemptNumber,
        contentId:this.contentId,
        learnerUsername: this.learner.username,
      }
      const payload = {
        params: data
      }
   
      
      
      axios.get(url,payload)
        .then(resp=>{
          // console.log(resp.data);
        this.setState({page:"begin exam"})
        });
        


      });
    
        
  }

  variantNumberFromAttemptNumber(){
    let preseed = this.attemptNumber+this.assignmentId;
    if(Number(this.individualize) === 1){
      preseed += this.learner.username;
    }
    let seed = hashStringToInteger(preseed);

    let rng = new MersenneTwister(seed);
    let randomNumber = rng.random();
    return Math.floor(randomNumber * 1000000000);
  }

  buildExamGradeHelper(){
 
    let attemptPercentage = Math.round(Number(this.attemptCredit)*10000,2)/100;
    attemptPercentage = `${attemptPercentage}%`;
    for (var item of this.assignmentItems){
      let percentage = Math.round(Number(item.credit)*10000,2)/100;
      item.percentage = `${percentage}%`;
      
    }


    this.gradeReport = (<React.Fragment>

      <div style={{position:"absolute",
                    width:"600px",
                    left:"50%",
                    top:"50%",
                    marginLeft:"-300px",
                    transform: "translateY(-50%)",
                    textAlign:"center", 
                    backgroundColor:"#f5f5f5",
                    paddingTop:"30px",
                    paddingBottom:"30px",
                    }}>
                      <div>
                      <h2> Your exam has been submitted. </h2>
                      </div>
     

      {this.state.gradesOpen ? 
      <React.Fragment>
      
        <div style={{
          border:"1px solid black",
          borderRadius:"10px",
          margin:"20px 60px 10px 60px",
          padding:"0px 0px 20px 0px",
          }}>
            <button style={{
        position:"Absolute",
        left:"470px",
        top:"72px",
      }}
      onClick={()=>{
        this.setState({gradesOpen:false})
      }
}>Close</button>
          
      <h3>Total Percent: {attemptPercentage}</h3>

       <table id="grades" style={{width:"400px"}}>
       <tbody>
         <tr className="colHeadingsRow">
           <th width="581">Grade item</th>
           <th width="95">Percentage</th>
         </tr>

         {this.assignmentItems.map(
           (item)=><React.Fragment key={'assignmentItem'+item.title}>
           <tr className="typeDataRow"> 
             <td>{item.title}</td>
             <td>{item.percentage}</td>
           </tr>
           </React.Fragment>
         )}

        

         <tr className="colTotalRow">
           <td>Total</td>
         <td>{attemptPercentage}</td>
         </tr>

   
         </tbody>
         </table>
        </div>
        </React.Fragment>
        
        
        
        : null}
      
        </div>
      </React.Fragment>);

  }

  showExamGrade(){
    this.setState({page:"show grades"});
  }

  buildExamGrade(){
    
    if (this.assignmentItems !== undefined){
      console.log("this.assignmentItems is defined");
      
      this.buildExamGradeHelper();
      return;
    }
    console.log("this.assignmentItems is NOT defined");
    console.log(this.assignmentItems);
    

      const url='/open_api/loadItemGrades.php';
      
      // this.courseId
      const data={
        courseId: this.courseId,
        assignmentId: this.assignmentId,
        attemptNumber: this.attemptNumber,
        learnerUsername: this.learner.username,
      }
      const payload = {
        params: data
      }
      console.log('Data');
      console.log(data);
      
    
      axios.get(url,payload)
        .then(resp=>{
          console.log("item grades response");
          console.log(resp);
          this.assignmentItems = resp.data.assignmentItems;
          this.attemptCredit = resp.data.attemptCredit;

          this.buildExamGradeHelper();
          this.forceUpdate();
        })
        .catch(error=>{this.setState({error:error})});
  }

  getLearnersInfo() {
    const url='/open_api/loadLearnerInfo.php';
      
    const data={
      courseId: this.courseId
    }
    const payload = {
      params: data
    }
    
    axios.get(url,payload)
      .then(resp=>{
        this.learnersInfo = resp.data.learnersInfo;
        this.setState({page:"choose learner"});
      })
    .catch(error=>{this.setState({error:error})});
  }

  onSearchBoxChange = (value) => {
    this.setState({searchField: value});
  }

  authenticate = (value) => {
    if (value === this.authPasscode) {
      this.getLearnersInfo();
      return true;
    }
    return false;
  }
 
  render() {

    // return (<React.Fragment> <p>{this.state.page}</p> </React.Fragment>);

     //We have an error so doen't show the viewer
    if (this.state.error){
      return (<React.Fragment>
      <p style={{color: "red"}}>{this.state.error && this.state.error.toString()}</p>
      </React.Fragment>);
    }

    if (this.state.page === "loading"){
      return (<React.Fragment>
      <p>Loading...</p>
      </React.Fragment>);
      
    }else if (this.state.page === "no access"){
     return (<React.Fragment>
        <p>Exams are only available in a proctored environment.</p>
        </React.Fragment>);

    }else if (this.state.page === "enter passcode"){
      return (<React.Fragment>
      <div style={{position:"absolute",
                    width:"600px",
                    left:"50%",
                    top:"50%",
                    marginLeft:"-300px",
                    transform: "translateY(-50%)",
                    textAlign:"center", 
                    backgroundColor:"#f5f5f5",
                    paddingTop:"30px",
                    paddingBottom:"30px",
                    }}>
        <h2>Enter passcode</h2>
        <AuthInput authenticate={this.authenticate}/>
      </div>
    </React.Fragment>);
    }else if (this.state.page === "choose learner"){

    
      const filteredLearners = this.learnersInfo.filter(learner =>
        Object.keys(learner).some(key => learner[key].toLowerCase().includes(this.state.searchField.toLowerCase())));

      return (<React.Fragment>
      <div style={{position:"absolute",
                    width:"700px",
                    left:"50%",
                    top:"50%",
                    marginLeft:"-350px",
                    transform: "translateY(-50%)",
                    textAlign:"center", 
                    backgroundColor:"#f5f5f5",
                    paddingTop:"30px",
                    paddingBottom:"30px",
                    height: "700px",
                    overflowY: "scroll",
                    }}>

        <h2>Select learner to take the exam</h2>
        <SearchBox onSearchBoxChange={this.onSearchBoxChange}/>
        <table id="learnersData">
          <tbody>
            <tr className="colHeadingsRow">
              <th>#</th>
              <th>x500</th>
              <th>Learner ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th style={{width: "80px"}}></th>
            </tr>

            {filteredLearners.map(
              (learner, index)=>
              <React.Fragment key={learner.username}>
                <tr className="typeDataRow"> 
                  <td>{index + 1}</td>
                  <td>{learner.username}</td>
                  <td>{learner.learnerID}</td>
                  <td>{learner.firstName}</td>
                  <td>{learner.lastName}</td>
                  <td><button className="selectButton" onClick={() => {
                    this.learner = learner;
                    console.log("learner selected");
                    console.log(this.learner);
                    
                    this.setState({searchField:"", page:"verify learner"});

                  }}>Select</button></td>
                </tr>
              </React.Fragment>
            )}
            </tbody>
        </table>
      </div>
    </React.Fragment>);

    }else if (this.state.page === "verify learner"){
      let keyStyle = {width:"300px",textAlign:"right",fontSize:"12pt",padding:"2px"};
      let valueStyle = {textAlign:"left",fontSize:"12pt",fontWeight:"bold",padding:"2px 5px 2px 10px"};
      let buttonStyle = {width:"150px",height:"50px",fontSixe:"30pt"};
      return (<React.Fragment>
        <div style={{position:"absolute",
                      width:"600px",
                      left:"50%",
                      top:"50%",
                      marginLeft:"-300px",
                      transform: "translateY(-50%)",
                      textAlign:"center", 
                      backgroundColor:"#f5f5f5",
                      display:"flex",
                      flexDirection:"column",
                      }}>

        <h1>Is this you?</h1>
        <table style={{width:"580px",margin:"10px"}}>
          <tbody>
          <tr><td style={keyStyle}>First Name</td><td style={valueStyle}>{this.learner.firstName}</td></tr>
          <tr><td style={keyStyle}>Last Name</td><td style={valueStyle}>{this.learner.firstName}</td></tr>
          <tr><td style={keyStyle}>Student ID</td><td style={valueStyle}>{this.learner.learnerID}</td></tr>
          <tr><td style={keyStyle}>Username</td><td style={valueStyle}>{this.learner.username}</td></tr>
          </tbody>
        </table>

        <div style={{display:"flex", width:"500px", justifyContent:"space-between",paddingLeft:"100px",margin:"10px 0px 20px 0px"}}>
        <button style={buttonStyle} onClick={()=>{this.setState({page:"enter passcode"})}}>No</button>
        <button style={buttonStyle} onClick={this.getExams}>Yes</button>
        </div>
        
        </div>
        </React.Fragment>);

    }else if (this.state.page === "choose exam"){

        
      if (this.exams.length > 0){
        
        let examButtons = [];

        for(let [index,exam] of this.exams.entries()){
          
          examButtons.push(
          <button onClick={()=>{this.loadExam({examInfo:exam});}}
            key={"exambutton"+exam.contentId+index} 
            style={{margin:"10px",padding:"12px"}}>
            {exam.title}</button>);
        }

          return (<React.Fragment>
          <div style={{position:"absolute",
                        width:"600px",
                        left:"50%",
                        top:"50%",
                        marginLeft:"-300px",
                        transform: "translateY(-50%)",
                        textAlign:"center", 
                        backgroundColor:"#f5f5f5",
                        display:"flex",
                        flexDirection:"column",
                        }}>

          <h1>Please select the exam you are here to take</h1>

          {examButtons}
          </div>
          </React.Fragment>);


      }else{
        return (<React.Fragment>
          <div style={{position:"absolute",
                        width:"600px",
                        left:"50%",
                        top:"50%",
                        marginLeft:"-300px",
                        transform: "translateY(-50%)",
                        textAlign:"center", 
                        backgroundColor:"#f5f5f5",
                        display:"flex",
                        flexDirection:"column",
                        }}>
          <h1>No exams available.</h1>
          </div>
          </React.Fragment>);
      }




    }else if (this.state.page === "show coverpage"){

      return (<React.Fragment>
             <div style={{position:"absolute",
                            width:"600px",
                            left:"50%",
                            top:"50%",
                            marginLeft:"-300px",
                            transform: "translateY(-50%)",
                            textAlign:"center", 
                            backgroundColor:"#f5f5f5",
                            height: "700px",
                            overflowY: "scroll",
                            }}>
              <div style={{textAlign:"left",padding:"14px"}} dangerouslySetInnerHTML={{__html:this.examHTML}} />
              <div style={{display:"inline-block",padding:"10px"}}><button onClick={this.beginExam}>Begin Exam</button></div>
              </div>
            </React.Fragment>);

    }else if (this.state.page === "begin exam"){
      let backgroundColor = "white";
      let footerText = "";
      let timerText = "";
      if (this.state.minutes !== null){
        let floorMins = Math.floor(this.state.minutes);
        
        timerText = `${floorMins} Minutes Remaining`;
        if (this.state.minutes <= 1 && this.state.minutes >= .001){
          timerText = "Less Than One Minute Remaining";
        }
        if (this.state.minutes < .001 ){
          timerText = "Time Expired - Answers no longer recorded.";
          backgroundColor = "#f2c9c9";
          footerText = "Time Expired - Answers no longer recorded.";
        }
      }

      return (<React.Fragment>
        <div style={{backgroundColor,fontSize:"18px"}}>

        <div style={{width:"100%", height:"50px", backgroundColor:"#cce2ff",display:"flex"}}>
          <div style={{marginLeft:"20px",marginTop:"20px",fontSize:"20px"}}>{this.courseTitle}</div>
          {/* <div style={{marginLeft:"20px",marginTop:"20px",fontSize:"20px"}}>{this.activeExam.title}</div> */}
          <div style={{marginLeft:"20px",marginTop:"20px",fontSize:"20px"}}>{timerText}</div>
        </div>
        <DoenetViewer key={"doenetviewer"+this.updateNumber} 
        free={{doenetCode: this.doenetML,requestedVariant:{index:this.assignedVariant}}} 
        assignmentId={this.assignmentId}
        attemptNumber={this.attemptNumber}
        learnerUsername={this.learner.username}
        course={true}
        mode={{showHints:false,showFeedback:false,showCorrectness:false,solutionType:"none"}}
        functionsSuppliedByChild = {this.functionsSuppliedByChild}
        viewerExternalFunctions = {{ allAnswersSubmitted: this.showExamGrade }}
        />
              
        <div style={{width:"100%", height:"50px", backgroundColor:"#cce2ff",display:"flex"}}>
          <div style={{marginLeft:"20px",marginTop:"10px",fontSize:"20px"}}>
            <button onClick={() => 
                this.functionsSuppliedByChild.submitAllAnswers()
              
              }>Submit Exam</button>
            </div>
          <div  style={{marginLeft:"20px",marginTop:"20px",fontSize:"20px"}}>{footerText}</div>
        </div>
        </div>

      </React.Fragment>);

    }else if (this.state.page === "show grades"){
        this.buildExamGrade();
        return this.gradeReport;
    }
    
  }
}

class SearchBox extends Component {

  handleChange = e => {
    this.props.onSearchBoxChange(e.target.value);
  };

  render() {
    return (
        <input
          type="text"
          autoFocus
          className="searchInput"
          onChange={this.handleChange}
          placeholder="Search for learner..."
        />
    );
  }
};

class AuthInput extends Component {

  constructor(props) {
    super(props);
    this.incorrectPassword = true;
  }

  onKeyDown = e => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.incorrectPassword = this.props.authenticate(e.target.value);
      this.forceUpdate();
    }
  };

  render() {
    return (
      <div>
          <input
            autoFocus
            className="authInput"
            type="password"
            onKeyDown={this.onKeyDown}/>
        {!this.incorrectPassword && <p style={{color:"red"}}>Incorrect password.</p>}
      </div>      
    );
  }
};


export default DoenetExam;
