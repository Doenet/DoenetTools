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
      margin-top: ${props => '-' + props.extendedMarginOffTop + 'px'};
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
    if (this.props.rights) {
      this.currentCourseId = this.props.rights.defaultId
    }


    this.options = []
    if (this.props.rights && this.props.rights.arrayIds != []) {
      this.props.rights.arrayIds.map((id, index) => {
        this.options.push(<option key={this.updateNumber++} value={id}>{this.props.rights.courseInfo[id]['courseName']}</option>)
      })
    } else {
      this.options.push(<option key={this.updateNumber++}>No courses</option>)
    }

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
        this.props.rights.parentFunction(e.target.value);
        this.forceUpdate()
      }}>
      {this.options}
    </select>)


    this.toolTitleToLinkMap = {
      "Chooser": "/chooser/",
      "Course": "/course/",
      "Documentation": "/docs/",
      "Gradebook": "/gradebook/",
      // "Profile": "/profile/",
    }

    this.menuToolBoxItems = [
      {
        id: "Chooser",
        label: "Chooser",
        link: "/chooser/"
      },
      {
        id: "Course",
        label: "Course",
        link: "/course/"
      },
      {
        id: "Documentation",
        label: "Documentation",
        link: "/docs/"
      },
      {
        id: "Gradebook",
        label: "Gradebook",
        link: "/gradebook/"
      }];
    this.profileMenuMap = [
  
      {
        id: "Account",
        label: "Account settings",
        link: "/accountsettings/"
      }];
    if (props.isSignedIn) {
      this.profileMenuMap.push({
        id: "SignOut",
        label: "Sign out",
        link: "/signout/",
      });
    } else {
      this.profileMenuMap.push({
        id: "SignIn",
        label: "Sign in",
        link: "/signin/",
      });
    }

  }

  componentWillReceiveProps(props) {
    // console.log(props.headerChangesFromLayout);
    if (props.headerChangesFromLayout) {
      this.setState({
        myProfile: props.headerChangesFromLayout
      });
    }
    if (props.headerRoleFromLayout) {
      this.setState({
        myRoles: props.headerRoleFromLayout
      });
    }
  }

  rolesToChoose(data) {
  }

  // loadMyProfile() {
  // axios
  //   .get(`/api/loadMyProfile.php?timestamp=${new Date().getTime()}`) // added timestamp to eliminate browser caching
  //   .then(resp => {
  //     // console.dir(resp.data);
  //     this.setState({
  //       myProfile: resp.data
  //     });
  //     this.rolesToChoose(resp.data);

  //   })
  //   .catch(err => console.error(err.response.toString()));
  // }

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
    // let toolBox = {};


    // toolBox = this.toolTitleToLinkMap &&

    //   <div className="toolboxContainer" data-cy="toolboxButton" onClick={this.toogleToolbox}>

    //     <FontAwesomeIcon id="toolboxButton" icon={faTh} />
    //     {this.state.showToolbox &&
    //       <Toolbox show={this.state.showToolbox} toogleToolbox={this.toogleToolbox}>
    //         {Object.keys(this.toolTitleToLinkMap).length > 0 ?
    //           <div>
    //             {Object.keys(this.toolTitleToLinkMap).sort().map((toolName, index) => {
    //               let currentUrl = window.location.href;
    //               const navLinkClassName = currentUrl.includes(this.toolTitleToLinkMap[toolName]) ?
    //                 "selectedToolboxNavLink" : "toolboxNavLink";
    //               return (
    //                  <div className={navLinkClassName} key={"toolboxNavLink" + index} data-cy={"toolboxNavLinkTo" + toolName}>
    //                   <a href={this.toolTitleToLinkMap[toolName]}>{toolName}</a>
    //                 </div>
    //               )
    //             }
    //             )}
    //           </div>
    //           : ''}
    //       </Toolbox>}
    //   </div>
    const menuToolBox = <MenuDropDown position={'left'} menuIcon={faTh} offset={-20} showThisMenuText={this.props.toolName} options={this.menuToolBoxItems} />;
    const profileMenu = <MenuDropDown position={'left'}
      picture={this.props.profile.profilePicture}
      offset={-20} showThisMenuText={''} options={this.profileMenuMap} />;

    const isMultipleRoles = !!this.state.myRoles && !!this.state.myRoles.permissionRoles ? Object.keys(this.state.myRoles.permissionRoles).length > 1 : false;
    const isSingleRole = !!this.state.myRoles && !!this.state.myRoles.permissionRoles ? Object.keys(this.state.myRoles.permissionRoles).length === 1 : false;
    return (
      <React.Fragment>
        <div className="headingContainer">
          <div className="headerPlayBtn" onClick={this.toggleSlider}>
            <FontAwesomeIcon id='headerPlayBtn-icon' fontSize='16px' icon={this.state.sliderVisible ? faCaretDown : faCaretRight} />
          </div>
          <div className="toolName">
            <img id="doenetLogo" onClick={() => { location.href = "/dashboard"; }} src={doenetImage} height='40px' />
            <span>{this.props.toolName}</span>
          </div>

          {this.props.headingTitle && <div className="headingTitle">
            <span>{this.props.headingTitle}</span>
          </div>}
          {!this.props.guestUser && <div className="headingToolbar">
            {/* {isMultipleRoles && <Menu showThisRole={'Instructor'} itemsToShow={this.state.myRoles.permissionRoles} />} */}
            {isMultipleRoles && <MenuDropDown offsetPos={-20} showThisMenuText={'Instructor'} options={this.state.myRoles.permissionRoles} placeholder={"Select Course"} />}
            {isSingleRole && <button style={{
              // display: "flex",
              alignItems: "center",
              // padding: "10px",
              borderRadius: "5px"
            }}>{this.state.myRoles.permissionRoles[Object.keys(this.state.myRoles.permissionRoles)[0]].showText}</button>}
            {/* {toolBox} */}
            {menuToolBox}
            {profileMenu}
            {/* <MenuDropDown offsetPos={-20} showThisMenuText={'Instructor'} options={this.state.myRoles.permissionRoles} placeholder={"Select Course"} /> */}



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
              {isMultipleRoles && <MenuDropDown showThisMenuText={'Instructor'} options={this.state.myRoles.permissionRoles} />}
              {isSingleRole && <button style={{
                // display: "flex",
                alignItems: "center",
                // padding: "10px",
                borderRadius: "5px"
              }}>{this.state.myRoles.permissionRoles[Object.keys(this.state.myRoles.permissionRoles)[0]].showText}</button>}
              {/* {toolBox} */}
              {menuToolBox}

              {profileMenu}

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