import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDotCircle, faFileAlt, faFolder, faInfoCircle, faEdit } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { formatTimestamp } from './utility';
import styled from 'styled-components';
import axios from 'axios';

class InfoPanel extends Component {
  constructor(props) {
    super(props);
    this.addUsername = {};

    this.buildInfoPanelItemDetails = this.buildInfoPanelItemDetails.bind(this);
  }

  buildInfoPanel() {
    let selectedItemId = null;
    let selectedItemType = null;
    let itemTitle = "";
    let itemIcon = <FontAwesomeIcon icon={faDotCircle} style={{ "fontSize": "18px", "color": "#737373" }} />;

    if (this.props.selectedItems.length === 0) {
      // handle when no file selected, show folder/drive info
      selectedItemType = "Drive";
      if (this.props.selectedDrive === "Courses") {
        itemTitle = this.props.allCourseInfo[this.props.selectedCourse].courseName;
      } else {
        itemTitle = "Content";
      }

      // this.buildInfoPanelDriveDetails();
      this.infoPanel = <React.Fragment>
        <div className="infoPanel">
          <div style={{display: "flex", alignItems: "center", height: "100%", flexDirection: "column"}}>
            <FontAwesomeIcon icon={faInfoCircle} style={{fontSize:"95px", color: "rgb(165, 165, 165)", padding: "1rem"}}/>
            <span style={{fontSize: "13px", color: "rgb(124, 124, 124)"}}>Select a files or folder to view its details</span>
          </div>
        </div>
      </React.Fragment>
    } else {
      // if file selected, show selectedFile/Folder info
      selectedItemId = this.props.selectedItems[this.props.selectedItems.length - 1];
      selectedItemType = this.props.selectedItemsType[this.props.selectedItemsType.length - 1];
      // get title
      if (selectedItemType === "folder") {
        itemTitle = this.props.allFolderInfo[selectedItemId].title;
        itemIcon = this.props.allFolderInfo[selectedItemId].isRepo ?
          <FontAwesomeIcon icon={faFolder} style={{ "fontSize": "18px", "color": "#3aac90" }} /> :
          <FontAwesomeIcon icon={faFolder} style={{ "fontSize": "18px", "color": "#737373" }} />;
      } else if (selectedItemType === "url") {
        itemTitle = this.props.allUrlInfo[selectedItemId].title;
      } else {
        itemTitle = this.props.allContentInfo[selectedItemId].title;
        itemIcon = <FontAwesomeIcon icon={faFileAlt} style={{ "fontSize": "18px", "color": "#3D6EC9" }} />;
      }

      this.buildInfoPanelItemDetails(selectedItemId, selectedItemType);
      this.infoPanel = <React.Fragment>
        <div className="infoPanel">
          <div className="infoPanelTitle" data-cy="infoPanelTitle">
            <div className="infoPanelItemIcon">{itemIcon}</div>
            <span>{itemTitle}</span>
          </div>
          <div className="infoPanelPreview">
            {/* <span>Preview</span> */}
            <FontAwesomeIcon icon={faFileAlt} style={{ "fontSize": "100px", "color": "#bfbfbf" }} />
          </div>
          <div className="infoPanelDetails">
            {this.infoPanelDetails}
          </div>
        </div>
      </React.Fragment>
    }
  }

  buildInfoPanelDriveDetails() {

    let itemDetails = {};
    this.infoPanelDetails = [];
    // handle when no file selected, show folder/drive info
    if (this.props.selectedDrive === "Courses") {
      let courseId = this.props.selectedCourse;
      let courseCode = this.props.allCourseInfo[courseId].courseCode;
      let term = this.props.allCourseInfo[courseId].term;
      let description = this.props.allCourseInfo[courseId].description;
      let department = this.props.allCourseInfo[courseId].department;
      let section = this.props.allCourseInfo[courseId].section;

      itemDetails = {
        "Owner": "Me",
        "Course Code": courseCode,
        "Term": term,
        "Department": department,
        "Section": section,
        "Description": description,
      };
    } else {
      itemDetails = {
        "Owner": "Me",
        "Modified": "Today",
        "Published": "Today",
      };
    }

    Object.keys(itemDetails).map(itemDetailsKey => {
      let itemDetailsValue = itemDetails[itemDetailsKey];
      this.infoPanelDetails.push(
        <tr key={"contentDetailsItem" + itemDetailsKey}>
          <td className="itemDetailsKey">{itemDetailsKey}</td>
          <td className="itemDetailsValue">{itemDetailsValue}</td>
        </tr>);
    })

    this.infoPanelDetails = <React.Fragment>
      <table id="infoPanelDetailsTable">
        <tbody>
          {this.infoPanelDetails}
        </tbody>
      </table>
      {this.props.selectedDrive === "Courses" &&
      <div id="editContentButtonContainer" data-cy="editContentButton">
        <div id="editContentButton"
        onClick={this.props.openEditCourseForm}>
          <FontAwesomeIcon icon={faEdit} style={{"fontSize":"20px", "color":"#43aa90"}}/>
          <span>Edit</span>
        </div>
        </div>
      }
    </React.Fragment>
  }

  buildInfoPanelItemDetails(selectedItemId, selectedItemType) {
    this.infoPanelDetails = [];
    let itemDetails = {};
    if (selectedItemType === "folder") {

      itemDetails = {
        "Location": "Content",
        "Published": formatTimestamp(this.props.allFolderInfo[selectedItemId].publishDate),
      };

      let isShared = this.props.allFolderInfo[this.props.allFolderInfo[selectedItemId].rootId].isRepo;
      if (this.props.allFolderInfo[selectedItemId].isRepo || isShared) {
        itemDetails = Object.assign(itemDetails, { "Public": this.props.allFolderInfo[selectedItemId].isPublic ? "Yes" : "No" });
      }
      // show change to public button if private repo
      if (this.props.allFolderInfo[selectedItemId].isRepo && !this.props.allFolderInfo[selectedItemId].isPublic) {
        itemDetails["Public"] = <React.Fragment>
          <span>No</span><button id="publicizeRepoButton" onClick={() => this.props.publicizeRepo(selectedItemId)}>Make Public</button>
        </React.Fragment>
      }
      //Display controls for who it's shared with
      let sharedJSX = null;
      if (this.props.allFolderInfo[selectedItemId].isRepo) {
        const SharedUsersContainer = styled.div`
        display: flex;
        flex-direction: column;
        `;
        const UserPanel = styled.div`
        width: 320px;
        padding: 10px;
        border-bottom: 1px solid grey;
        `;


        let users = [];
        for (let userInfo of this.props.allFolderInfo[selectedItemId].user_access_info) {
          let removeAccess = <span>Owner</span>;
          if (userInfo.owner === "0") {
            removeAccess = <button onClick={() => {
              const loadCoursesUrl = '/api/removeRepoUser.php';
              const data = {
                repoId: selectedItemId,
                username: userInfo.username,
              }
              const payload = {
                params: data
              }

              axios.get(loadCoursesUrl, payload)
                .then(resp => {
                  if (resp.data.success === "1") {
                    this.props.allFolderInfo[selectedItemId].user_access_info = resp.data.users;
                  }
                  this.forceUpdate();
                });

            }}>X</button>
          }
          users.push(<UserPanel key={`userpanel${userInfo.username}`}>
            {userInfo.firstName} {userInfo.lastName} - {userInfo.email} - {removeAccess}
          </UserPanel>)
        }

        const AddWrapper = styled.div`
        margin-top: 10px;
        `;

        sharedJSX = <>
          <p className="itemDetailsKey">Sharing Settings</p>
          <SharedUsersContainer>{users}</SharedUsersContainer>
          <AddWrapper>Add Username
          <input type="text" value={this.addUsername[selectedItemId]} onChange={(e) => {
              e.preventDefault();

              this.addUsername[selectedItemId] = e.target.value;

            }}></input>
            <button onClick={() => {
              const loadCoursesUrl = '/api/addRepoUser.php';
              const data = {
                repoId: selectedItemId,
                username: this.addUsername[selectedItemId],
              }
              const payload = {
                params: data
              }

              axios.get(loadCoursesUrl, payload)
                .then(resp => {
                  if (resp.data.success === "1") {
                    this.props.allFolderInfo[selectedItemId].user_access_info = resp.data.users;
                  }
                  this.addUsername = {};
                  this.forceUpdate();
                });

            }}>Add</button>
          </AddWrapper>
        </>
      }

      Object.keys(itemDetails).map(itemDetailsKey => {
        let itemDetailsValue = itemDetails[itemDetailsKey];
        // add only if content not empty
        this.infoPanelDetails.push(
          <tr key={"contentDetailsItem" + itemDetailsKey}>
            <td className="itemDetailsKey">{itemDetailsKey}</td>
            <td className="itemDetailsValue">{itemDetailsValue}</td>
          </tr>);
      })


      this.infoPanelDetails = <React.Fragment>
        <table id="infoPanelDetailsTable">
          <tbody>
            {this.infoPanelDetails}
          </tbody>
        </table>
        {sharedJSX}
      </React.Fragment>

    } else if (selectedItemType === "content") {
      // populate table with selected item info / drive info  
      let itemRelatedContent = [];
      // build related content
      let relatedContent = [];
      // flatten out and format related content
      itemRelatedContent.forEach(relatedItemBranchID => {
        let relatedItemTitle = this.props.allContentInfo[relatedItemBranchID].title;
        relatedContent.push(
          <div style={{ "display": "block" }} key={"relatedItem" + relatedItemBranchID}>
            <FontAwesomeIcon icon={faFileAlt} style={{ "fontSize": "14px", "color": "#3D6EC9", "marginRight": "10px" }} />
            <a href={`/editor?branchId=${relatedItemBranchID}`}>{relatedItemTitle}</a>
          </div>
        );
      });

      // build content versions
      let versions = [];
      let versionNumber = 1;
      // get and format versions
      console.log(this.props.allContentInfo[selectedItemId])
      this.props.allContentInfo[selectedItemId].contentIds.reverse().forEach(contentIdObj => {
        if (contentIdObj.draft !== "1") {
          let versionTitle = "Version " + versionNumber++;
          versions.push(
            <div style={{ "display": "block" }} key={"version" + versionNumber}>
              <FontAwesomeIcon icon={faFileAlt} style={{ "fontSize": "14px", "color": "#3D6EC9", "marginRight": "10px" }} />
              <a href={`/editor?branchId=${selectedItemId}&contentId=${contentIdObj.contentId}`}>{versionTitle}</a>
            </div>
          );
        }
      });

      itemDetails = {
        "Location": "Content",
        "Published": formatTimestamp(this.props.allContentInfo[selectedItemId].publishDate),
        "Versions": versions,
        // "Related content" : relatedContent,
      };
      let isShared = this.props.allContentInfo[selectedItemId].rootId == "root" ? false :
        this.props.allFolderInfo[this.props.allContentInfo[selectedItemId].rootId].isRepo;

      if (isShared) {
        itemDetails = Object.assign(itemDetails, { "Public": this.props.allContentInfo[selectedItemId].isPublic ? "Yes" : "No" });
      }

      Object.keys(itemDetails).map(itemDetailsKey => {
        let itemDetailsValue = itemDetails[itemDetailsKey];
        this.infoPanelDetails.push(
          <tr key={"contentDetailsItem" + itemDetailsKey}>
            <td className="itemDetailsKey">{itemDetailsKey}</td>
            <td className="itemDetailsValue">{itemDetailsValue}</td>
          </tr>);
      })

      this.infoPanelDetails = <React.Fragment>
        <table id="infoPanelDetailsTable">
          <tbody>
            {this.infoPanelDetails}
          </tbody>
        </table>
        <div id="editContentButtonContainer">
          <div id="editContentButton" data-cy="editContentButton"
            onClick={() => { window.location.href = `/editor?branchId=${selectedItemId}` }}>
            <FontAwesomeIcon icon={faEdit} style={{ "fontSize": "20px", "color": "#43aa90" }} />
            <span>Edit Draft</span>
          </div>
        </div>
      </React.Fragment>
    } else {
      itemDetails = {
        "Location": "Content",
        "Published": formatTimestamp(this.props.allUrlInfo[selectedItemId].publishDate),
        "Description": this.props.allUrlInfo[selectedItemId].description,
        "Uses DoenetAPI": this.props.allUrlInfo[selectedItemId].usesDoenetAPI == true ? "Yes" : "No",
      };

      let isShared = this.props.allUrlInfo[selectedItemId].rootId == "root" ? false :
        this.props.allFolderInfo[this.props.allUrlInfo[selectedItemId].rootId].isRepo;

      if (isShared) {
        itemDetails = Object.assign(itemDetails, { "Public": this.props.allUrlInfo[selectedItemId].isPublic ? "Yes" : "No" });
      }

      Object.keys(itemDetails).map(itemDetailsKey => {
        let itemDetailsValue = itemDetails[itemDetailsKey];
        this.infoPanelDetails.push(
          <tr key={"contentDetailsItem" + itemDetailsKey}>
            <td className="itemDetailsKey">{itemDetailsKey}</td>
            <td className="itemDetailsValue">{itemDetailsValue}</td>
          </tr>);
      })

      this.infoPanelDetails = <React.Fragment>
        <table id="infoPanelDetailsTable">
          <tbody>
            {this.infoPanelDetails}
            <tr key={"contentDetailsItemUrl"}>
              <td className="itemDetailsKey">URL</td>
              <td className="itemDetailsValue"><a href={this.props.allUrlInfo[selectedItemId].url}>{this.props.allUrlInfo[selectedItemId].url}</a></td>
            </tr>
          </tbody>
        </table>
        <div id="editContentButtonContainer">
          <div id="editContentButton" data-cy="editContentButton"
            onClick={this.props.openEditUrlForm}>
            <FontAwesomeIcon icon={faEdit} style={{ "fontSize": "20px", "color": "#43aa90" }} />
            <span>Edit Link</span>
          </div>
        </div>
      </React.Fragment>
    }
  }

  render() {
    this.buildInfoPanel();
    return (<React.Fragment>
      {this.infoPanel}
    </React.Fragment>);
  }
}

InfoPanel.propTypes = {
  selectedItems: PropTypes.array,
  selectedItemsType: PropTypes.array,
  selectedDrive: PropTypes.string,
  selectedCourse: PropTypes.string,
  allFolderInfo: PropTypes.object,
  allContentInfo: PropTypes.object,
  allUrlInfo: PropTypes.object,
  allCourseInfo: PropTypes.object,
  publicizeRepo: PropTypes.func,
  openEditCourseForm: PropTypes.func,
  openEditUrlForm: PropTypes.func,
}

export default InfoPanel;