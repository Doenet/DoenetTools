import React, { Component } from 'react';
import './header.css'
import doenetImage from '../media/Doenet_Logo_cloud_only.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh , faUser, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import IndexedDB from '../services/IndexedDB';
import axios from 'axios';
import ConstrainToAngles from '../Doenet/components/ConstrainToAngles';


class DoenetHeader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showToolbox: false,
    }
    this.select=null
    this.mounted=false;
    this.updateNumber = 0;
    this.adminAccess = 0;
    this.accessAllowed = 0;
    if (this.props.rights){
      this.rightToView = this.props.rights.rightToView
      this.rightToEdit = this.props.rights.rightToEdit
      this.instructorRights = this.props.rights.instructorRights
      this.coursesPermissions = this.props.rights.permissions  
    } else {
      this.rightToView = false
      this.rightToEdit = false
      this.instructorRights = false
    }

    this.selectPermission = null
    this.currentCourseId=""
    // const {this.props.rights.arrayIds,this.props.rights.courseInfo,defaultId,permissions} = this.props.rights
    if (this.props.rights){
    this.currentCourseId = this.props.rights.defaultId
    }



    this.options = []
    if (this.props.rights && this.props.rights.arrayIds!=[]){
      this.props.rights.arrayIds.map((id,index)=>{
        this.options.push(<option key={this.updateNumber++} value={id}>{this.props.rights.courseInfo[id]['courseName']}</option>)        
        // this.options.push(<option value={id} selected={defaultId===id?true:false}>{this.props.rights.courseInfo[id]['courseName']}</option>)
      })
    } else {
      this.options.push(<option key={this.updateNumber++}>No courses</option>)
    }

    // console.log(this.options)
    this.select = (<select 
    value = {this.props.rights?this.props.rights.defaultId:undefined}
    className="select"
    onChange = {(e)=>{
      this.currentCourseId = e.target.value;
      this.accessAllowed = this.coursesPermissions['courseInfo'][this.currentCourseId]['accessAllowed'];
      this.adminAccess=this.coursesPermissions['courseInfo'][this.currentCourseId]['adminAccess'];
      if (this.accessAllowed==="1"){
        this.rightToView = true
        if (this.adminAccess==="1"){
          this.rightToEdit = true
          this.instructorRights = true
        }
      }
      // this.makePermissionList()
      this.props.rights.parentFunction(e.target.value);
      this.forceUpdate()}}>
      {this.options}
    </select>)
    
  
   
    // this.headingTitle = this.props.this.props.rights.courseInfo[this.currentCourseId]['courseName']
    this.toolTitleToLinkMap = {
      "Chooser" : "/chooser/",
      "Course" : "/course/",
      "Documentation" : "/docs/",
      // "Editor" : "/editor/",
      "Gradebook": "/gradebook/",
    }

    // this.username = "";
    // this.access = 0;
    // const url='/api/env.php';
    //     axios.get(url)
    //     .then(resp=>{
    //         this.username = resp.data.user;
    //         this.access = resp.data.access;
    //         this.forceUpdate();
    //     });

    // this.setupDatabase();
  }
  // componentDidMount(){

    // const envurl='/api/env01.php';
    // const CancelToken = axios.CancelToken;
    // const source = CancelToken.source();
    // if (this.props.rights && this.props.rights.downloadPermission){
    //   axios.get(envurl)
    //   .then(resp=>{
    //       // console.log("downloading header permission")
    //       this.coursesPermissions = resp.data
    //       if (this.coursesPermissions['courseInfo'][this.currentCourseId]){
    //         this.accessAllowed = this.coursesPermissions['courseInfo'][this.currentCourseId]['accessAllowed'];
    //       this.adminAccess=this.coursesPermissions['courseInfo'][this.currentCourseId]['adminAccess'];
    //       }

    //       this.forceUpdate();
    //   });
    // }
  // }
  componentWillUnmount(){
    this.select = undefined
    this.selectPermission =undefined
    this.username = undefined;
    // this.access = undefined;
    this.coursesPermissions = undefined
    this.accessAllowed = undefined
    this.adminAccess =undefined
    if(this.props.rights){
      this.props.rights.rightToView = undefined
    this.props.rights.rightToEdit = undefined
    this.props.rights.instructorRights = undefined
    this.props.rights.downloadPermission = undefined
    this.props.rights.permissions = undefined
    // this.props.toolTitle = undefined
    this.props.rights.arrayIds = undefined
    this.props.rights.courseInfo = undefined
    // this.props.headingTitle = undefined
    this.props.rights.defaultId = undefined
    this.props.rights.permissionCallBack = undefined
    this.props.rights.parentFunction = undefined
    }
    
  }
  makePermissionList(){
    // console.log("making list for header")
    if (this.instructorRights){
      this.selectPermission=(
        <select 
        value={!this.rightToEdit?"Student":"Instructor"}
        onChange={(e)=>{
          {
            if (e.target.value==="Student"){
              this.rightToEdit=false
            }
            if (e.target.value==="Instructor"){
              this.rightToEdit=true
            }
            this.props.rights.permissionCallBack(e.target.value);
            this.forceUpdate()
          }
        }}>
        {this.rightToView?(<option key={this.updateNumber++} value="Student">Student</option>):null}
        {(<option key={this.updateNumber++} value="Instructor">Instructor</option>)}
          
          </select>  
      )
    }
    else {
      this.selectPermission=(
        <span onChange={(e)=>{
          {
            if (e.target.value==="Student"){
              this.rightToEdit=false
            }
            if (e.target.value==="Instructor"){
              this.rightToEdit=true
            }
            this.props.rights.permissionCallBack(e.target.value);
            this.forceUpdate()
          }
        }}>
        {this.rightToView?(<option key={this.updateNumber++}  value="Student">Student</option>):null}
          
          </span>  
      )
    }
    
  }


  toogleToolbox = () => {
    if (!this.state.showToolbox) {
      document.addEventListener('click', this.toogleToolbox, false);
    } else {
      document.removeEventListener('click', this.toogleToolbox, false);
    }

    this.setState(prevState => ({
      showToolbox: !prevState.showToolbox
    }));    
  }


  render() {
    // console.log("header render")
    // console.log(this.select)
    // console.log(this.props)
    // const { toolTitle, headingTitle} = this.props;
    if(this.coursesPermissions!={}){
      this.makePermissionList()
    }
    return (
      <React.Fragment>
        <div className="headingContainerWrapper">
          <div className="headingContainer">
            <div className="toolTitle">
              <img id="doenetLogo" onClick={()=>{location.href = "/";}} src={doenetImage} height='45px' />
              <span>{this.props.toolTitle}</span>
            </div>
            {this.props.headingTitle && <div className="headingTitle">
              {/* <span>{ headingTitle }</span> */}
              <span>{ this.select }</span>
            </div>}
            <div className="headingToolbar">
            {this.selectPermission}          
              <div className="toolboxContainer" data-cy="toolboxButton" onClick={this.toogleToolbox}>  
              <FontAwesomeIcon id="toolboxButton" icon={faTh}/>
                {this.state.showToolbox && 
                <Toolbox show={this.state.showToolbox} toogleToolbox={this.toogleToolbox}>
                  {Object.keys(this.toolTitleToLinkMap).map((toolTitle, index)=> {
                    let currentUrl = window.location.href;
                    const navLinkClassName = currentUrl.includes(this.toolTitleToLinkMap[toolTitle]) ? 
                      "selectedToolboxNavLink" : "toolboxNavLink";
                    return( 
                      <div className={ navLinkClassName } key={"toolboxNavLink" + index} data-cy={"toolboxNavLinkTo" + toolTitle }>
                        <a href={ this.toolTitleToLinkMap[toolTitle] }>{toolTitle }</a>
                      </div>
                    )
                  })}
                </Toolbox>}
              </div>
              <div id="userButton" onClick={()=>alert('User Setting Feature Not Yet Available')}>
                <FontAwesomeIcon id="userButtonIcon" icon={faUser}/>
                <div id="username" style={{display:"inline", marginLeft:"3px"}}>{ this.username }</div>
              </div>
            </div>
          </div>
        </div>        
      </React.Fragment>
    );
  }
}

const Toolbox = ({ toogleToolbox, children }) => {

  return (
    <section className="toolbox" data-cy="toolbox">
      {children}
    </section>
  );
}

export default DoenetHeader;