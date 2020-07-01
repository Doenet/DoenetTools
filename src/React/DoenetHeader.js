import React, { Component, useState } from 'react';
import './header.css'
import doenetImage from '../media/Doenet_Logo_cloud_only.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faUser, faArrowLeft, faBars, faCaretRight, faCaretDown } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
axios.defaults.withCredentials = true;
import styled from "styled-components";

// import { animated, useSpring } from 'react-spring';
import Menu from './menu.js'
import MenuDropDown from '../imports/MenuDropDown.js';
// import IndexedDB from '../services/IndexedDB';
// import axios from 'axios';
// import ConstrainToAngles from '../Doenet/components/ConstrainToAngles';

const ProfilePicture = styled.button`
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0)),
    url("/profile_pictures/${props => props.pic}.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  transition: 300ms;
  color: #333333;
  width:40px;
  height:40px;
  display: inline;
  color: rgba(0, 0, 0, 0);
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  border-style:none;
  
`;
const ExtendedHeader = styled.div`
  display: none;
  width: 100%;
  background-color: white;
  z-index: 1;
  transition: all 0.5s ease-in-out;
  @media (max-width: 768px){
    display: block !important;
    &.on {
      margin-top: 0px;
      opacity: 1;
    }
     
    &.off {
      margin-top: ${props => '-'+props.extendedMarginOffTop+'px'};
      opacity: 0;
      margin-bottom: 50px;
    }
  }

   
`;


class DoenetHeader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      menuVisble: false,
      showToolbox: false,
      sliderVisible: false,
      myProfile: {},
      myRoles: {}
    }

    this.select = null
    this.updateNumber = 0;
    this.roles = [];
    this.adminAccess = 0;
    this.accessAllowed = 0;
    this.headerSectionCount = 1;
    if (this.props.rights) {
      this.rightToView = this.props.rights.rightToView
      this.rightToEdit = this.props.rights.rightToEdit
      this.instructorRights = this.props.rights.instructorRights

      if (this.instructorRights) {
        this.roles.push("Instructor")
      }
      if (this.rightToView) {
        this.roles.push("Student")
      }

      this.coursesPermissions = this.props.rights.permissions
    } else {
      this.rightToView = false
      this.rightToEdit = false
      this.instructorRights = false
    }

    this.selectPermission = null
    this.currentCourseId = ""
    // const {this.props.rights.arrayIds,this.props.rights.courseInfo,defaultId,permissions} = this.props.rights
    if (this.props.rights) {
      this.currentCourseId = this.props.rights.defaultId
    }


    this.options = []
    if (this.props.rights && this.props.rights.arrayIds != []) {
      this.props.rights.arrayIds.map((id, index) => {
        this.options.push(<option key={this.updateNumber++} value={id}>{this.props.rights.courseInfo[id]['courseName']}</option>)
        // this.options.push(<option value={id} selected={defaultId===id?true:false}>{this.props.rights.courseInfo[id]['courseName']}</option>)
      })
    } else {
      this.options.push(<option key={this.updateNumber++}>No courses</option>)
    }

    // console.log(this.options)
    this.select = (<select
      value={this.props.rights ? this.props.rights.defaultId : undefined}
      className="select"
      onChange={(e) => {
        this.currentCourseId = e.target.value;
        this.accessAllowed = this.coursesPermissions['courseInfo'][this.currentCourseId]['accessAllowed'];
        this.adminAccess = this.coursesPermissions['courseInfo'][this.currentCourseId]['adminAccess'];
        if (this.accessAllowed === "1") {
          this.rightToView = true
          if (this.adminAccess === "1") {
            this.rightToEdit = true
            this.instructorRights = true
          }
        }
        // this.makePermissionList()
        this.props.rights.parentFunction(e.target.value);
        this.forceUpdate()
      }}>
      {this.options}
    </select>)


    // this.headingTitle = this.props.this.props.rights.courseInfo[this.currentCourseId]['courseName']
    this.toolTitleToLinkMap = {
      "Chooser": "/chooser/",
      "Course": "/course/",
      "Documentation": "/docs/",
      "Gradebook": "/gradebook/",
      // "Profile": "/profile/",
    };
    this.menuToolBoxItems = {
      "Chooser": {
        showText: "Chooser",
        link: "/chooser/"
      },
      "Course": {
        showText: "Course",
        link: "/course/"
      },
      "Documentation": {
        showText: "Documentation",
        link: "/docs/"
      },
      "Gradebook": {
        showText: "Gradebook",
        link: "/gradebook/"
      }
    };
    this.profileMenuMap = {
      "Account": {
        showText: "My Account",
        link: "/profile/"
      },
      "SignOut": {
        showText: "Sign in",
        link: "/signin/",
      }
    }
  }

  componentDidMount() {
    this.loadMyProfile();
  }

  componentWillReceiveProps(props) {
    // console.log(props.headerChangesFromLayout);
    if (props.headerChangesFromLayout) {
      this.setState({
        myProfile: props.headerChangesFromLayout
      });
    }
    if(props.headerRoleFromLayout){
      this.setState({
        myRoles:props.headerRoleFromLayout
      });
    }
  }

  rolesToChoose(data) {
  }

  loadMyProfile() {
    axios
      .get(`/api/loadMyProfile.php?timestamp=${new Date().getTime()}`) // added timestamp to eliminate browser caching
      .then(resp => {
        // console.dir(resp.data);
        this.setState({
          myProfile: resp.data
        });
        this.rolesToChoose(resp.data);

      })
      .catch(err => console.error(err.response.toString()));
  }

  componentWillUnmount() {
    this.select = undefined
    this.selectPermission = undefined
    this.username = undefined;
    // this.access = undefined;
    this.coursesPermissions = undefined
    this.accessAllowed = undefined
    this.adminAccess = undefined
    if (this.props.rights) {
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

  makePermissionList({ menuBarAnimation }) {

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

  toggleSlider = () => {
    this.setState(prevState => ({
      sliderVisible: !prevState.sliderVisible
    }));
    this.props.onChange(!this.state.sliderVisible, this.headerSectionCount);
  }


  render() {
    const sliderClass = this.state.sliderVisible ? 'on' : 'off';
    if (!!this.refs.extendedHeader) {
      this.headerSectionCount = this.refs.extendedHeader.children.length;
    }
    const extendedMarginOffTop = (this.headerSectionCount + 1) * 50;
    let toolBox = {};


    toolBox = this.toolTitleToLinkMap &&
        <div className="toolboxContainer" data-cy="toolboxButton" onClick={this.toogleToolbox}>

          <FontAwesomeIcon id="toolboxButton" icon={faTh} />
          {this.state.showToolbox &&
            <Toolbox show={this.state.showToolbox} toogleToolbox={this.toogleToolbox}>
              {Object.keys(this.toolTitleToLinkMap).length > 0 ?
                <div>
                  {Object.keys(this.toolTitleToLinkMap).sort().map((toolName, index) => {
                    let currentUrl = window.location.href;
                    const navLinkClassName = currentUrl.includes(this.toolTitleToLinkMap[toolName]) ?
                      "selectedToolboxNavLink" : "toolboxNavLink";
                    const toolBoxItemsHidden = this.state.myProfile.toolAccess.indexOf(toolName) < 0;
                    return (
                      !toolBoxItemsHidden && <div className={navLinkClassName} key={"toolboxNavLink" + index} data-cy={"toolboxNavLinkTo" + toolName}>
                        <a href={this.toolTitleToLinkMap[toolName]}>{toolName}</a>
                      </div>
                    )
                  }
                  )}
                </div>
                : ''}
              {!this.state.myProfile.toolAccess.length && <p>Loading..!</p>}
            </Toolbox>}
        </div>
    const menuToolBox = <MenuDropDown menuIcon= {faTh} offsetPos={-20} showThisRole={''} itemsToShow={this.menuToolBoxItems} />;

    const isMultipleRoles = !!this.state.myRoles && !!this.state.myRoles.permissionRoles ? Object.keys(this.state.myRoles.permissionRoles).length > 1 : false;
    const isSingleRole = !!this.state.myRoles && !!this.state.myRoles.permissionRoles ? Object.keys(this.state.myRoles.permissionRoles).length === 1 : false;
    return (
      <React.Fragment>
        <div className="headingContainer">
          <div className="headerPlayBtn" onClick={this.toggleSlider}>
            <FontAwesomeIcon id='headerPlayBtn-icon' fontSize='16px' icon={this.state.sliderVisible ? faCaretDown : faCaretRight} />
          </div>
          <div className="toolName">
            <img id="doenetLogo" onClick={() => { location.href = "/"; }} src={doenetImage} height='40px' />
            <span>{this.props.toolName}</span>
          </div>

         {this.props.headingTitle && <div className="headingTitle">
            <span>{this.props.headingTitle}</span>
          </div>}
          {!this.props.guestUser && <div className="headingToolbar">
            {/* {isMultipleRoles && <Menu showThisRole={'Instructor'} itemsToShow={this.state.myRoles.permissionRoles} />} */}
             {isMultipleRoles && <MenuDropDown offsetPos={-20} showThisRole={'Instructor'} itemsToShow={this.state.myRoles.permissionRoles} placeholder={"Select Course"} />}
            {isSingleRole && <button style={{
              alignItems: "center",
               borderRadius: "5px"
               }}>{this.state.myRoles.permissionRoles[Object.keys(this.state.myRoles.permissionRoles)[0]].showText}</button>}
            {menuToolBox}
            {/* {!this.state.myProfile.profilePicture && <div id="userButton-anonymous" onClick={() => { location.href = "/Profile"; }}>
              <FontAwesomeIcon id="userButtonIcon" icon={faUser} />
            </div>
            } */}
           
            {/* {this.state.myProfile.profilePicture && <div id="userButton-registered" 
            onClick={() => { location.href = "/Profile"; }}
            >
              <ProfilePicture
                pic={this.state.myProfile.profilePicture}
                name="changeProfilePicture"
                id="changeProfilePicture"
              >
              </ProfilePicture>
            </div>

            }*/}
          <MenuDropDown menuIcon={faUser} offsetPos={-20} showThisRole={''} itemsToShow={this.profileMenuMap} />
          </div>}
        </div>

        <ExtendedHeader className={sliderClass} ref='extendedHeader' extendedMarginOffTop={extendedMarginOffTop}>
          {this.props.headingTitle && <div className="extended-header">
            <div className="headingTitlePhone">
              <span>{this.props.headingTitle}</span>
            </div>
          </div>}
            {!this.props.guestUser && 
          <div className="extended-header">
          {isMultipleRoles && <MenuDropDown showThisRole={'Instructor'} itemsToShow={this.state.myRoles.permissionRoles} />}
          {isSingleRole && <button style={{
              // display: "flex",
              alignItems: "center",
              // padding: "10px",
               borderRadius: "5px"
               }}>{this.state.myRoles.permissionRoles[Object.keys(this.state.myRoles.permissionRoles)[0]].showText}</button>}
            {/* {toolBox} */}
            {menuToolBox}
            <MenuDropDown menuIcon={faUser} offsetPos={-20} showThisRole={''} itemsToShow={this.profileMenuMap} />

            {/* {!this.state.myProfile.profilePicture &&
              <div id="userButton-anonymous-phone" onClick={() => { location.href = "/Profile"; }}>
                <FontAwesomeIcon id="userButtonIcon" icon={faUser} />
              </div>
            }
            {this.state.myProfile.profilePicture &&
              <div id="userButton-phone" onClick={() => { location.href = "/Profile"; }}>
                <ProfilePicture
                  pic={this.state.myProfile.profilePicture}
                  name="changeProfilePicture"
                  id="changeProfilePicture"
                >
                </ProfilePicture>
              </div>} */}
          </div>}
        </ExtendedHeader>
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