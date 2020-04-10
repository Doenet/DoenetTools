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
    this.permissionMenu=null
    this.select=null
    this.updateNumber = 0;
    this.roles={}
    this.adminAccess = 0;
    this.accessAllowed = 0;
    this.currentCourseId=""

    if (this.props.rights){
      this.rightToView = this.props.rights.rightToView
      this.rightToEdit = this.props.rights.rightToEdit
      this.instructorRights = this.props.rights.instructorRights
      
      this.coursesPermissions = this.props.rights.permissions  
    this.currentCourseId = this.props.rights.defaultId
    if (this.coursesPermissions && this.currentCourseId){
      this.accessAllowed = this.coursesPermissions['courseInfo'][this.currentCourseId]['accessAllowed'];
      this.adminAccess=this.coursesPermissions['courseInfo'][this.currentCourseId]['adminAccess'];
    }


    } else {
      this.rightToView = false
      this.rightToEdit = false
      this.instructorRights = false
    }

    this.selectPermission = null
    // if (this.props.rights){
    // this.currentCourseId = this.props.rights.defaultId

    // }

    // this.options = []
    // if (this.props.rights && this.props.rights.arrayIds!=[]){
    //   this.props.rights.arrayIds.map((id,index)=>{
    //     this.options.push(<option key={this.updateNumber++} value={id}>{this.props.rights.courseInfo[id]['courseName']}</option>)        
    //     // this.options.push(<option value={id} selected={defaultId===id?true:false}>{this.props.rights.courseInfo[id]['courseName']}</option>)
    //   })
    // } else {
    //   this.options.push(<option key={this.updateNumber++}>No courses</option>)
    // }


    this.coursesToChoose={}
    if (this.props.rights && this.props.rights.arrayIds!=[]){
      this.props.rights.arrayIds.map((id)=>{
        this.coursesToChoose[id]={
          showText:this.props.rights.courseInfo[id]['courseName'],
          callBackFunction:(e)=>{
          this.currentCourseId = e;
            this.courseChosenCallBack({e:e})} 
        }
      })
    }

    
  
   
    this.toolTitleToLinkMap = {
      "Chooser" : "/chooser/",
      "Course" : "/course/",
      "Documentation" : "/docs/",
      "Gradebook": "/gradebook/",
    }
    this.navigationMenu = {}
    Object.keys(this.toolTitleToLinkMap).map((toolTitle)=> {
      if (toolTitle!=this.props.toolTitle){
        this.navigationMenu[toolTitle]={
          showText:toolTitle,
          url:this.toolTitleToLinkMap[toolTitle]
                     
      }
      }
      
    })
    this.itemsToShowUpdated={}
    if (this.accessAllowed==="1"){
      this.itemsToShowUpdated['Student']={
        showText:"Student",
      callBackFunction: this.props.rights.itemsToShow['Student']['callBackFunction']
      }
      if (this.adminAccess==="1"){
        this.itemsToShowUpdated['Instructor']={
          showText:"Instructor",
        callBackFunction: this.props.rights.itemsToShow['Instructor']['callBackFunction']
        }
      }
    }
    this.permissionMenu=(
      <Menu 
              key={"menu02"+(this.updateNumber++)}
              // showDropDown={this.state.menuVisble}
              showThisRole={this.props.rights?this.props.rights.defaultRole:""} 
              itemsToShow = {this.itemsToShowUpdated}
              // itemsToShow={this.props.rights?this.props.rights.itemsToShow:{}} 
              // menuIcon={this.props.rights?this.props.rights.menuIcon:null}
              />
    )
  }

courseChosenCallBack({e}){
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
      this.props.rights.parentFunction(e);
      this.forceUpdate()
}

  componentWillUnmount(){
    // this.select = undefined
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
    this.props.rights.itemsToShow = undefined
    this.props.rights.menuIcon = undefined
    this.props.rights.permissions = undefined

    this.props.rights.arrayIds = undefined
    this.props.rights.courseInfo = undefined
    this.props.rights.defaultId = undefined
    this.props.rights.defaultRole = undefined

    this.props.rights.permissionCallBack = undefined
    this.props.rights.parentFunction = undefined
    }
    
  }
  // toggleToolbox = () => {
  //   if (!this.state.showToolbox) {
  //     document.addEventListener('click', this.toggleToolbox, false);
  //   } else {
  //     document.removeEventListener('click', this.toggleToolbox, false);
  //   }

  //   this.setState(prevState => ({
  //     showToolbox: !prevState.showToolbox,
  //   }));    
  // }



  render() {  
    return (
      <React.Fragment>
        <div className="headingContainerWrapper">
          <div className="headingContainer">
            <div className="toolTitle">
              <img id="doenetLogo" onClick={()=>{location.href = "/";}} src={doenetImage} height='45px' />
              <span>{this.props.toolTitle}</span>
            </div>
            {this.props.headingTitle && <div className="headingTitle">
              <Menu
              width={"500px"}
              key={"menu00"+(this.updateNumber++)}           
              showThisRole={this.props.rights?this.props.rights.courseInfo[this.currentCourseId]['courseName']:""}
              itemsToShow = {this.coursesToChoose}
              />
            </div>}
            <div className="headingToolbar">
            <div 
            >                
              </div>

              <div className="toolboxContainer" data-cy="toolboxButton" 
            >                
              {this.permissionMenu}

              </div>
              <div className="toolboxContainer" data-cy="toolboxButton" >
              <Menu
              key={"menu01"+(this.updateNumber++)}           
              showThisRole={this.props.toolTitle} 
              itemsToShow = {this.navigationMenu}
              menuIcon={faTh}
              />
              
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

export default DoenetHeader;