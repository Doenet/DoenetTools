import React, { Component, useState } from 'react';
import './header.css'
import doenetImage from '../media/Doenet_Logo_cloud_only.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh , faUser, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import {animated,useSpring} from 'react-spring';
import Menu from './menu.js'
// import IndexedDB from '../services/IndexedDB';
// import axios from 'axios';
// import ConstrainToAngles from '../Doenet/components/ConstrainToAngles';



class DoenetHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      menuVisble:false,
      showToolbox: false,
    }
    this.select=null

    this.updateNumber = 0;
    this.roles=[]

    this.adminAccess = 0;
    this.accessAllowed = 0;
    if (this.props.rights){
      this.rightToView = this.props.rights.rightToView
      this.rightToEdit = this.props.rights.rightToEdit
      this.instructorRights = this.props.rights.instructorRights

      if (this.instructorRights){
        this.roles.push("Instructor")
      }
      if (this.rightToView){
        this.roles.push("Student")
      }

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
      "Gradebook": "/gradebook/",
      // "Profile": "/profile/",
    }

  }
  // componentDidMount(){


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

    this.props.rights.arrayIds = undefined
    this.props.rights.courseInfo = undefined
    this.props.rights.defaultId = undefined
    this.props.rights.defaultRole = undefined

    this.props.rights.permissionCallBack = undefined
    this.props.rights.parentFunction = undefined
    }
    
  }

  makePermissionList({menuBarAnimation}){

      /*this.selectPermission=(
        <select 
        value={!this.rightToEdit?"Student":"Instructor"}
        onChange={(e)=>{

            if (e.target.value==="Student"){
              this.rightToEdit=false
            }
            if (e.target.value==="Instructor"){
              this.rightToEdit=true
            }
            this.props.rights.permissionCallBack(e.target.value);
            this.forceUpdate()

          
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

    }*/

    
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

    let toolBox = {};
    this.toolUrl={
      "Chooser" : "/chooser/",
      "Course" : "/course/",
      "Documentation" : "/docs/",
      "Gradebook": "/gradebook/",
      "Profile" : "/profile",
    }
    
 
    // if(this.toolTitleToLinkMap === null ){
    //   return ( 
    //       <>  
    //     <div className={ navLinkClassName } key={"toolboxNavLink" + index} data-cy={"toolboxNavLinkTo" + toolTitle }
    //     >
    //       {/* <a href={ this.toolTitleToLinkMap[toolTitle] }>{toolTitle}</a> */}
    //       <p>Loading...</p>
    //     </div>
    //     </>
    //   )
    // }
    
    toolBox =  this.toolTitleToLinkMap &&
  
  <div className="toolboxContainer" data-cy="toolboxButton" onClick={this.toogleToolbox}>  
   
    <FontAwesomeIcon id="toolboxButton" icon={faTh}/>
      { this.state.showToolbox &&
       <Toolbox show={this.state.showToolbox} toogleToolbox={this.toogleToolbox}>
       { Object.keys(this.toolTitleToLinkMap).length > 0 ?
       <div>
        { Object.keys(this.toolTitleToLinkMap).sort().map((toolTitle, index)=> {
          let currentUrl = window.location.href;
          const navLinkClassName = currentUrl.includes(this.toolTitleToLinkMap[toolTitle]) ? 
            "selectedToolboxNavLink" : "toolboxNavLink";
          return(
            <div className={ navLinkClassName } key={"toolboxNavLink" + index} data-cy={"toolboxNavLinkTo" + toolTitle }>
              <a href={ this.toolTitleToLinkMap[toolTitle] }>{toolTitle}</a>
            </div>
          ) 
        }
        ) }
        </div>
        : <p>Loading</p> }
      </Toolbox> }
      </div> 

    return (
      <React.Fragment>
        <div className="headingContainerWrapper">
          <div className="headingContainer">
            <div className="toolTitle">
              <img id="doenetLogo" onClick={()=>{location.href = "/";}} src={doenetImage} height='45px' />
              <span>{this.props.toolTitle}</span>
            </div>
            {this.props.headingTitle && <div className="headingTitle">
              <span>{this.props.headingTitle }</span>
              {/* <span>{ this.select }</span> */}
            </div>}
            <div className="headingToolbar">

              <Menu showThisRole={this.props.rights?this.props.rights.defaultRole:""} roles={this.roles} permissionCallback={this.props.rights?this.props.rights.permissionCallBack:null}/>
            {/* {this.selectPermission}     */}

              {toolBox}

              {/* <div className="toolboxContainer" data-cy="toolboxButton" onClick={this.toogleToolbox}>  
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
              </div> */}
               <div id="userButton" onClick={()=>{location.href = "/Profile";}}>
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