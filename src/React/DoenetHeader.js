import React, { Component, useState } from 'react';
import './header.css'
import doenetImage from '../media/Doenet_Logo_cloud_only.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh , faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import styled from "styled-components";

// import {animated,useSpring} from 'react-spring';
import Menu from './menu.js'
// import IndexedDB from '../services/IndexedDB';
// import axios from 'axios';
// import ConstrainToAngles from '../Doenet/components/ConstrainToAngles';

const Picture = styled.div`
    width:30px;
    height:30px;
  `

class DoenetHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      pic:(this.props.willProvideProfile?this.props.profile['profilePicture']:null),
      profile:{}
    }
    this.pics = [
      "bird",
      "cat",
      "dog",
      "emu",
      "fox",
      "horse",
      "penguin",
      "squirrel",
      "swan",
      "turtle"
    ];
    //////////
  this.profile={}
  this.test=0
  this._isMounted = false;
    //////////
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
    if (this.coursesPermissions['courseInfo'] && this.currentCourseId){
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
      "Profile": "/profile/",
    }
    this.navigationMenu = {}
  this.currentProfilePicture="emu"
    
    this.itemsToShowUpdated={}
    if (this.accessAllowed==="1"){
      this.itemsToShowUpdated['Student']={
        showText:"Student",
      callBackFunction: (this.props.rights.itemsToShow['Student']?
      this.props.rights.itemsToShow['Student']['callBackFunction']:null)
      }
      if (this.adminAccess==="1"){
        this.itemsToShowUpdated['Instructor']={
          showText:"Instructor",
        callBackFunction: (
          this.props.rights.itemsToShow['Instructor']?
          this.props.rights.itemsToShow['Instructor']['callBackFunction']:
          null)
        }
      }
    }
    this.changeOrderOfItemsToShowUpdated()
    this.permissionMenu=(
      <Menu 
              currentTool={this.props.toolTitle}
              key={"menu02"+(this.updateNumber++)}
              // showDropDown={this.state.menuVisble}
              showThisRole={this.props.rights?(this.props.rights.defaultRole+"  "):""} 
              itemsToShow = {this.itemsToShowUpdated}
              offsetPos={-47}
              // itemsToShow={this.props.rights?this.props.rights.itemsToShow:{}} 
              // menuIcon={this.props.rights?this.props.rights.menuIcon:null}
              />
    )
    if (this.props.willProvideProfile && this.props.profile){
      this.profile = this.props.profile
      this.creatingToolsList();
    }
  }
creatingToolsList(){
  this.pics.map((pic)=>{
    if (pic===this.profile['profilePicture'])
    this.currentProfilePicture=pic
  })
  if(this.profile['toolAccess']!=undefined){
    this.navigationMenu[this.props.toolTitle]={
      showText:this.props.toolTitle,
      url:undefined
    }
    this.profile['toolAccess'].map((toolTitle)=> {
      if (toolTitle!=this.props.toolTitle){
        this.navigationMenu[toolTitle]={
          showText:toolTitle,
          url:this.toolTitleToLinkMap[toolTitle]
      }
      }
      
  })
  
  // below reorganize list
  /*let thisArray01 = []
    Object.keys(this.navigationMenu).map((e)=>{
      thisArray01.push(e)
    })
    
    let copy01 = this.navigationMenu
      thisArray01.map((e,index)=>{
        if (e===this.props.toolTitle){
          thisArray01.splice(index,1)
          thisArray01.unshift(this.props.toolTitle)
        }
        
      })
      console.log("thisArray01")
      console.log(thisArray01)
      this.navigationMenu={}
      thisArray01.map((e)=>{
  
          this.navigationMenu[e]={
            showText:copy01[e]['showText'],
            url: copy01[e]['url']}
        
        
      })    
      console.log("updated one:")
      console.log(this.navigationMenu)*/
  
    }
  }
changeOrderOfItemsToShowUpdated(){
  let thisArray = []
  Object.keys(this.itemsToShowUpdated).map((e)=>{
    thisArray.push(e)
  })
  let copy = {}
  if (this.props.rights){
    thisArray.map((e,index)=>{
      if (e===this.props.rights.defaultRole){
        thisArray.splice(index,1)
        thisArray.unshift(this.props.rights.defaultRole)
      }
      
    })

    thisArray.map((e)=>{
      copy[e]={
        showText:this.itemsToShowUpdated[e]['showText'],
        callBackFunction: this.itemsToShowUpdated[e]['callBackFunction']}
    })    
    this.itemsToShowUpdated = copy
    
  }
}

changeOrderOfNavigationMenu(){
  let thisArray01 = []
  Object.keys(this.navigationMenu).map((e)=>{
    thisArray01.push(e)
  })
  // console.log("thisArray01")
  // console.log(thisArray01)
  let copy01 = {}
  if (this.props.rights){
    thisArray01.map((e,index)=>{
      if (e===this.props.toolTitle){
        thisArray01.splice(index,1)
        thisArray01.unshift(this.props.toolTitle)
      }
      
    })

    thisArray01.map((e)=>{
      if(this.navigationMenu[e]){
        copy01[e]={
          showText:this.navigationMenu[e]['showText'],
          url: this.navigationMenu[e]['url']}
      }
      
    })    
    this.navigationMenu = copy01
  }
}

courseChosenCallBack({e}){
      if (this.coursesPermissions['courseInfo'])
      {
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
      this.forceUpdate()}
}
loadMyProfile(){
  if (this._isMounted){
    axios
      .get(`/api/loadMyProfile.php`)
      .then(resp => {
        this.profile=resp.data
        console.log("LOADING MY PROFILE")
        this.creatingToolsList();
        if (this._isMounted){
        this.setState({pic:this.profile['profilePicture']})
        }
      })
      .catch(error=>{this.setState({error:error})});
  }


  
}

componentDidMount(){

  this._isMounted = true;
  if (!this.props.willProvideProfile){
  this.loadMyProfile();
  }
////////MANIPULATE THE this.navigationMenu 

}
  componentWillUnmount(){
    // this.setState({pic:null})
    this._isMounted = false;
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




  render() {  
    console.log("inside header")
    console.log(this.state.pic)
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
              currentTool={this.props.toolTitle}
              width={"500px"}
              key={"menu00"+(this.updateNumber++)}           
              showThisRole={this.props.rights?(this.props.rights.courseInfo[this.currentCourseId]['courseName']+"  "):""}
              itemsToShow = {this.coursesToChoose}
              offsetPos={-47}
              menuWidth={"500px"}
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
              {<Menu
              currentTool={this.props.toolTitle}
              key={"menu01"+(this.updateNumber++)}           
              showThisRole={this.props.toolTitle} 
              itemsToShow = {this.navigationMenu}
              offsetPos={-20}
              menuIcon={faTh}
              grayTheseOut={this.props.toolTitle}
              />}
              
              </div>
              <Picture>
                {this.state.pic?
                <img 
                src={`/profile_pictures/${this.state.pic}.jpg`}
                width="30"
                height="30"
                >
                </img>:null}
              </Picture>

              {/* <div id="userButton" onClick={()=>alert('User Setting Feature Not Yet Available')}>
                  <div className="ModalPicsContainer">{picElements}</div>
                <div
                key={`modalpic-${value}`}
                pic={`/profile_pictures/${value}.jpg`}
                alt={`${value} profile picture`}
                >pic</div>
                <div id="username" style={{display:"inline", marginLeft:"3px"}}>{ this.username }</div>
              </div> */}
            </div>
          </div>
        </div>        
      </React.Fragment>
    );
  }
}

export default DoenetHeader;