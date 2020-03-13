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
    const envurl='/api/env01.php';
    this.adminAccess = 0;
    this.accessAllowed = 0;
    this.rightToView = this.props.rightToView
    this.rightToEdit = this.props.rightToEdit
    this.instructorRights = this.props.instructorRights
    this.selectPermission = null
    this.coursesPermissions = {}
    if (this.props.downloadPermission){
      axios.get(envurl)
      .then(resp=>{
          // console.log("downloading header permission")
          this.coursesPermissions = resp.data
          if (this.coursesPermissions['courseInfo'][this.currentCourseId]){
            this.accessAllowed = this.coursesPermissions['courseInfo'][this.currentCourseId]['accessAllowed'];
          this.adminAccess=this.coursesPermissions['courseInfo'][this.currentCourseId]['adminAccess'];
          }
          
          // this.props.parentUpdateDownloadPermission()
          this.forceUpdate();
      });
    }
   
    this.currentCourseId=""
    const {arrayIds,courseInfo,defaultId,permissions} = this.props
    this.currentCourseId = defaultId



    this.options = []
    if (arrayIds){
      arrayIds.map((id,index)=>{
        this.options.push(<option value={id} selected={defaultId===id?true:false}>{courseInfo[id]['courseName']}</option>)
      })
    } else {
      this.options.push(<option selected={true}>No courses</option>)
    }

    // console.log(this.options)
    this.select = (<select 
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
      this.props.parentFunction(e.target.value);
      this.forceUpdate()}}>
      {this.options}
    </select>)
    // this.headingTitle = this.props.courseInfo[this.currentCourseId]['courseName']
    this.toolTitleToLinkMap = {
      "Admin" : "/admin/",
      "Chooser" : "/chooser/",
      "Course" : "/course/",
      "Documentation" : "/docs/",
      // "Editor" : "/editor/",
      "Gradebook": "/gradebook/",
    }

    this.username = "";
    this.access = 0;
    const url='/api/env.php';
        axios.get(url)
        .then(resp=>{
            this.username = resp.data.user;
            this.access = resp.data.access;
            this.forceUpdate();
        });

    // this.setupDatabase();
  }
  makePermissionList(){
    // console.log("making list for header")
    if (this.instructorRights){
      this.selectPermission=(
        <select onChange={(e)=>{
          {
            if (e.target.value==="Student"){
              this.rightToEdit=false
            }
            if (e.target.value==="Instructor"){
              this.rightToEdit=true
            }
            this.props.permissionCallBack(e.target.value);
            this.forceUpdate()
          }
        }}>
        {this.rightToView?(<option selected = {!this.rightToEdit?true:false} value="Student">Student</option>):null}
        {(<option selected = {this.rightToEdit?true:false} value="Instructor">Instructor</option>)}
          
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
            this.props.permissionCallBack(e.target.value);
            this.forceUpdate()
          }
        }}>
        {this.rightToView?(<option selected = {!this.rightToEdit?true:false} value="Student">Student</option>):null}
          
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
    const { toolTitle, headingTitle} = this.props;
    if(this.coursesPermissions!={}){
      this.makePermissionList()
    }
    return (
      <React.Fragment>
        <div className="headingContainerWrapper">
          <div className="headingContainer">
            <div className="toolTitle">
              <img id="doenetLogo" onClick={()=>{location.href = "/";}} src={doenetImage} height='45px' />
              <span>{ toolTitle }</span>
            </div>
            {headingTitle && <div className="headingTitle">
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
                        <a href={ this.toolTitleToLinkMap[toolTitle] }>{ toolTitle }</a>
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