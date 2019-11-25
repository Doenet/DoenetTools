import React, { Component } from 'react';
import DoenetEditor from "./DoenetEditor";
import DoenetAdmin from "./DoenetAdmin";
import { Label,Icon } from 'semantic-ui-react';
import "./app.css";
import axios from 'axios';
import doenetImage from '../images/doenet.png';


class DoenetApp extends Component {
    constructor(props) {
      super(props);
      this.username = "";
     
    
        const url='/api/env.php';
        axios.get(url)
        .then(resp=>{
            this.username = resp.data.user;
            this.access = resp.data.access;
            this.forceUpdate();
        });
 



      const content = [
          {
            searchQuery:{all:true}, //Placeholder
            content:{},
            documentOrder:[], //Array of ids
          }
      ]

      this.state = {
        //   appMode:"Admin",
          appMode:"Edit",
          showLeftNavExtended:true,
          content:content,
          error:"",
      }

      this.courseInfo = {};
      this.numberLoaded = 0;
      this.loadAllCoursesAndTheirAssignments();
      this.sharedContent = {}; //both have this
      this.loadSharedContent();//both have this
      

      this.adminMode = this.adminMode.bind(this);
      this.editMode = this.editMode.bind(this);
      this.loadAllCoursesAndTheirAssignments = this.loadAllCoursesAndTheirAssignments.bind(this);
      this.loadSharedContent = this.loadSharedContent.bind(this);
      this.assignmentDataToCourseInfo = this.assignmentDataToCourseInfo.bind(this);
    }

    loadSharedContent(){
     
        const url='/api/loadWithKeywords.php';
        axios.get(url)
        .then(resp=>{
    
        //reset data
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
        //console.log("-----PUSHING------")
        this.sharedContent.documentOrder.push(data.branchId);

        }
        this.numberLoaded = this.numberLoaded + 1;
        
        this.forceUpdate();
      })
      .catch(error=>{this.setState({error:error})});
        

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

    loadAllCoursesAndTheirAssignments(){

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
    console.log("load Course Outline data");
    console.log(data);
    
    
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

    adminMode(){
        
        let showLeftNavExtended = this.state.showLeftNavExtended;
        if (this.state.appMode === "Admin"){
            if (this.state.showLeftNavExtended){
                showLeftNavExtended = false;
            }else{
                showLeftNavExtended = true;
            }
        }
        this.setState({appMode:"Admin",showLeftNavExtended:showLeftNavExtended});
    }

    editMode(){
        let showLeftNavExtended = this.state.showLeftNavExtended;
        if (this.state.appMode === "Edit"){
            if (this.state.showLeftNavExtended){
                showLeftNavExtended = false;
            }else{
                showLeftNavExtended = true;
            }
        }
        this.setState({appMode:"Edit",showLeftNavExtended:showLeftNavExtended});
    }

    usernameClick(){
        alert("Respond by showing user settings.");
    }

    render(){
        if (this.username === ""){ return null;}
        if (this.access !== 1){ return "No Access for "+this.username;}
        if (this.numberLoaded < 2){ return null;} //wait for the content to load

        let mode = null;
        if(this.state.appMode === "Admin"){
            console.log("courseInfo");
            console.log(this.courseInfo);
            
            
            mode = <DoenetAdmin sharedContent={this.sharedContent} courseInfo={this.courseInfo} username={this.username} />
        }else{
            mode = <DoenetEditor sharedContent={this.sharedContent}  username={this.username} />
        }

        let appContainerStyle = {};
        if (this.state.showLeftNavExtended){
            appContainerStyle = {gridTemplateColumns: "50px 200px auto 300px"};
        }
        return (
            
            
        <div className="appcontainer" style={appContainerStyle}>
            <div className="appLeftNav">
                {this.state.appMode === "Edit" ? 
                <Icon className="leftNavIcon leftNavSelectedIcon" name='edit' size='big' onClick={this.editMode} />
                :
                <Icon className="leftNavIcon leftNavUnSelectedIcon" name='edit' size='big' onClick={this.editMode} />
                }
                {this.state.appMode === "Admin" ? 
                <Icon className="leftNavIcon leftNavSelectedIcon" name='users' size='big' onClick={this.adminMode} />
                :
                <Icon className="leftNavIcon leftNavUnSelectedIcon" name='users' size='big' onClick={this.adminMode} />
                }
            </div>
            <div className="appUserPanel" style={{display:"flex", justifyContent:"space-between"}}>
            <img src={doenetImage} width='100px' />
            <Label as='a' style={{float:"right"}} onClick={this.usernameClick}>
                <Icon name='user' />
                {this.username}
            </Label>
            </div>
            {mode}
        </div>
        )
    }
}

export default DoenetApp;
