import React, { Component, useState } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;
import crypto from 'crypto';
import nanoid from 'nanoid';
import "./chooser.css";
import DoenetHeader from './DoenetHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faDotCircle, faFileAlt, faEdit, faCaretRight, faCaretDown, 
  faChalkboard, faArrowCircleLeft, faTimesCircle, faPlusCircle, faFolder, faSave, faLink} 
  from '@fortawesome/free-solid-svg-icons';
import IndexedDB from '../services/IndexedDB';
import DoenetBranchBrowser from './DoenetBranchBrowser';
import SpinningLoader from './SpinningLoader';
import { TreeView } from './TreeView/TreeView';
import styled from 'styled-components';
import { ToastContext, useToasts, ToastProvider } from './ToastManager';
import ChooserConstants from './chooser/ChooserConstants';


class DoenetChooser extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      error: null,
      errorInfo: null,
      selectedDrive: "Content",
      selectedCourse: null,
      selectedItems: [],
      selectedItemsType: [],
      showNewButtonMenu: false,
      activeSection: "chooser",
      directoryStack: [],
      currentDraggedObject: {id: null, type: null, sourceContainerId: null, dataObject: null, sourceParentId: null},
    };

    this.containerCache = {};
    this.cachedCurrentDraggedObject = null;
    this.lastDroppedContainerId = null;
    this.validDrop = true;

    this.loadUserContentBranches();
    this.loadUserFoldersAndRepo();
    this.loadUserUrls();
    this.loadAllCourses();
    this.loadCourseHeadingsAndAssignments('aI8sK4vmEhC5sdeSP3vNW');

    this.branches_loaded = false;
    this.courses_loaded = false;
    this.folders_loaded = false;
    this.urls_loaded = false;
    this.assignments_and_headings_loaded = false;

    this.updateNumber = 0;

    this.browser = React.createRef();

    this.handleNewDocument = this.handleNewDocument.bind(this);
    this.saveContentToServer = this.saveContentToServer.bind(this);
    this.getContentId = this.getContentId.bind(this);
    this.toggleManageCourseForm = this.toggleManageCourseForm.bind(this);
    this.saveCourse = this.saveCourse.bind(this);
    this.selectDrive = this.selectDrive.bind(this);
    this.handleNewCourseCreated = this.handleNewCourseCreated.bind(this);
    this.handleNewFolder = this.handleNewFolder.bind(this);
    this.addNewFolder = this.addNewFolder.bind(this);
    this.handleNewRepo = this.handleNewRepo.bind(this);
    this.addNewRepo = this.addNewRepo.bind(this);
    this.addContentToFolder = this.addContentToFolder.bind(this);
    this.removeContentFromFolder = this.removeContentFromFolder.bind(this);
    this.addContentToCourse = this.addContentToCourse.bind(this);
    this.removeContentFromCourse = this.removeContentFromCourse.bind(this);
    this.updateSelectedItems = this.updateSelectedItems.bind(this);
    this.updateDirectoryStack = this.updateDirectoryStack.bind(this);
    this.jumpToDirectory = this.jumpToDirectory.bind(this);
    this.saveUserContent = this.saveUserContent.bind(this);
    this.modifyRepoAccess = this.modifyRepoAccess.bind(this);
    this.modifyFolderChildrenRoot = this.modifyFolderChildrenRoot.bind(this);
    this.flattenFolder = this.flattenFolder.bind(this);
    this.renameFolder = this.renameFolder.bind(this);
    this.modifyPublicState = this.modifyPublicState.bind(this);
    this.addContentToRepo = this.addContentToRepo.bind(this);
    this.loadFilteredContent = this.loadFilteredContent.bind(this);
    this.publicizeRepo = this.publicizeRepo.bind(this);
    this.toggleManageUrlForm = this.toggleManageUrlForm.bind(this);
    this.saveUrl = this.saveUrl.bind(this);
    this.handleNewUrlCreated = this.handleNewUrlCreated.bind(this);
    this.updateHeadingsAndAssignments = this.updateHeadingsAndAssignments.bind(this);
    this.saveTree = this.saveTree.bind(this);
    this.ToastWrapper = this.ToastWrapper.bind(this);
    this.displayToast = this.displayToast.bind(this);
    this.onTreeDragStart = this.onTreeDragStart.bind(this);
    this.onTreeDragEnd = this.onTreeDragEnd.bind(this);
    this.onTreeDraggableDragOver = this.onTreeDraggableDragOver.bind(this);
    this.onTreeDropEnter = this.onTreeDropEnter.bind(this);
    this.onTreeDropLeave = this.onTreeDropLeave.bind(this);
    this.onTreeDrop = this.onTreeDrop.bind(this);
    this.onBrowserDragStart = this.onBrowserDragStart.bind(this);
    this.onBrowserDragEnd = this.onBrowserDragEnd.bind(this);
    this.onBrowserDropEnter = this.onBrowserDropEnter.bind(this);
    this.onBrowserDrop = this.onBrowserDrop.bind(this);
  }

  buildCourseList() {
    this.courseList = [];
    for(let courseId of this.courseIds){
      let courseCode = this.courseInfo[courseId].courseCode;

      let classes = (this.state.selectedDrive === "Courses") && (courseId === this.state.selectedCourse) ? 
                      "leftNavPanelMenuItem activeLeftNavPanelMenuItem": "leftNavPanelMenuItem";
      this.courseList.push(
        <li className={classes} 
            key={"course" + courseId}
            style={{"padding":"6px 1px 6px 5px","width": "90%"}}
            onClick={() => this.selectDrive("Courses", courseId)}>
            <FontAwesomeIcon className="menuDoughnutIcon" icon={faDotCircle}/>
            <span>{courseCode}</span>
            {this.state.selectedItems.length !== 0 &&
            <div className="addContentToCourseButtonWrapper">
              {this.state.selectedDrive !== "Courses" && 
                <FontAwesomeIcon icon={faPlus} className="addContentButton"
                onClick={() => this.addContentToCourse(courseId, this.state.selectedItems, this.state.selectedItemsType)}/>}
            </div>}
        </li>
      );
    }
  }

  buildLeftNavPanel() {
    this.leftNavPanel = <React.Fragment>
      <div className="leftNavPanel">
        <div id="newContentButtonContainer">
          <div id="newContentButton" data-cy="newContentButton" onClick={this.toggleNewButtonMenu}>
            <FontAwesomeIcon icon={faPlus} style={{"fontSize":"25px", "color":"#43aa90"}}/>
            <span>New</span>
            {this.state.showNewButtonMenu && 
              <div id="newContentButtonMenu" data-cy="newContentMenu">
                <div className="newContentButtonMenuSection">
                  <div className="newContentButtonMenuItem" onClick={this.handleNewDocument} data-cy="newDocumentButton">
                    <FontAwesomeIcon icon={faFileAlt} style={{"fontSize":"18px", "color":"#a7a7a7", "marginRight":"18px"}}/>
                    <span>DoenetML</span>
                  </div>
                  <div className="newContentButtonMenuItem" onClick={() => this.toggleManageUrlForm("add_url")} data-cy="newUrlButton">
                    <FontAwesomeIcon icon={faLink} style={{"fontSize":"18px", "color":"#a7a7a7", "marginRight":"18px"}}/>
                    <span>URL</span>
                  </div>
                  <div className="newContentButtonMenuItem" onClick={this.handleNewFolder} data-cy="newFolderButton">
                    <FontAwesomeIcon icon={faFolder} style={{"fontSize":"18px", "color":"#a7a7a7", "marginRight":"18px"}}/>
                    <span>Folder</span>
                  </div>
                  <div className="newContentButtonMenuItem" onClick={this.handleNewRepo} data-cy="newRepoButton">
                    <FontAwesomeIcon icon={faFolder} style={{"fontSize":"18px", "color":"#3aac90", "marginRight":"18px"}}/>
                    <span>Repository</span>
                  </div>
                </div>
                <div className="newContentButtonMenuSection">
                  <div className="newContentButtonMenuItem" onClick={() => this.toggleManageCourseForm("add_course")} data-cy="newCourseButton">
                    <FontAwesomeIcon icon={faChalkboard} style={{"fontSize":"16px", "color":"#a7a7a7", "marginRight":"13px"}}/>
                    <span>Course</span>
                  </div>
                </div>                
              </div>}
          </div>
        </div>
        <div id="leftNavPanelMenu">
          <div className={"Content" === this.state.selectedDrive ? 
                    "leftNavPanelMenuItem activeLeftNavPanelMenuItem": "leftNavPanelMenuItem"} 
            onClick={() => {this.selectDrive("Content")}}>
            <FontAwesomeIcon className="menuDoughnutIcon" icon={faDotCircle}/>
            <span>Content</span>
          </div>
          <div className="leftNavPanelMenuItem">
            <Accordion>
              <div label="Courses">
                <ul style={{"paddingLeft":"20px","margin":"5px 0 0 0"}}>
                  { this.courseList }
                </ul>
              </div>
            </Accordion>    
          </div>
          <div className={"Global" === this.state.selectedDrive ? 
                    "leftNavPanelMenuItem activeLeftNavPanelMenuItem": "leftNavPanelMenuItem"} 
            onClick={() => {this.selectDrive("Global")}}>
            <FontAwesomeIcon className="menuDoughnutIcon" icon={faDotCircle}/>
            <span>Global</span>
          </div>
        </div>        
      </div>
    </React.Fragment>
  }

  buildTopToolbar() {
    let toolbarTitle = "";

    if (this.state.activeSection === "chooser") {
      // show selectedDrive if chooser is active
      if (this.state.selectedDrive === "Content") {
        toolbarTitle = this.state.selectedDrive;
      } else if (this.state.selectedDrive === "Courses") {
        toolbarTitle = this.courseInfo[this.state.selectedCourse].courseCode + ' - '
        + this.courseInfo[this.state.selectedCourse].courseName;
      }  else if (this.state.selectedDrive === "Global") {
        toolbarTitle = <React.Fragment>
            <FilterPanel loadFilteredContent={this.loadFilteredContent}/>
          </React.Fragment>
      }

    } else if (this.state.activeSection === "add_course") {
      toolbarTitle = "Add New Course";
    } else if (this.state.activeSection === "edit_course") {
      toolbarTitle = "Edit Course - " + this.courseInfo[this.state.selectedCourse].courseCode;
    } else if (this.state.activeSection === "add_url") {
      toolbarTitle = "Add New URL";
    } else if (this.state.activeSection === "edit_url") {
      toolbarTitle = "Edit URL - " + this.urlInfo[this.state.selectedItems[0]].title;
    }

    this.topToolbar = <React.Fragment>
      <div id="topToolbar">
        <span>{ toolbarTitle }</span>
      </div>
    </React.Fragment>
  }

  handleNewDocument(){
    let newBranchId = nanoid();
    let num = 1;
    let title = "Untitled Document " + num; 
    while (Object.values(this.branchId_info).filter(content => content.title.includes(title)).length != 0) {
      num++;
      title = "Untitled Document " + num; 
    }

    this.saveContentToServer({
      documentName:title,
      code:"",
      branchId:newBranchId,
      publish:true
    }, (branchId) => {
      this.loadUserContentBranches(() => {
        // if not in base dir, add document to current folder
        if (this.state.directoryStack.length !== 0) {
          let currentFolderId = this.state.directoryStack[this.state.directoryStack.length - 1];
          this.addContentToFolder([branchId], ["content"], currentFolderId);
        } else {
          this.saveUserContent([branchId], ["content"], "insert"); // add to user root
        }
      
        // set as selected and redirect to /editor 
        this.setState({
          directoryStack: [],
          selectedItems: [branchId],
          selectedItemsType: ["content"],
          activeSection: "chooser",
          selectedDrive: "Content"
        }, () => {
          // this.forceUpdate();   
          this.updateNumber++;
          setTimeout(function(){ window.location.href=`/editor?branchId=${branchId}`;}, 500);
        });
      })
    });
  }

  toggleNewButtonMenu = () => {
    if (!this.state.showNewButtonMenu) {
      document.addEventListener('click', this.toggleNewButtonMenu, false);
    } else {
      document.removeEventListener('click', this.toggleNewButtonMenu, false);
    }
    
    this.setState(prevState => ({
      showNewButtonMenu: !prevState.showNewButtonMenu
    }));    
  }

  toggleManageCourseForm(mode) {
    if (this.state.activeSection !== mode) {
      this.setState({ activeSection: mode });
    } else {
      this.setState({ activeSection: "chooser" });
    }
  }

  handleNewCourseCreated({courseId, courseName, courseCode, term, description, department, section}, callback=(()=>{})) {
    // create new documents for overview and syllabus, get branchIds
    let overviewId = nanoid();
    let overviewDocumentName = courseName + " Overview";

    let syllabusId = nanoid();
    let syllabusDocumentName = courseName + " Syllabus";    
    
    Promise.all([
      this.saveContentToServer({
        documentName:overviewDocumentName,
        code:"",
        branchId:overviewId,
        publish:true
      }),
      this.saveContentToServer({
        documentName:syllabusDocumentName,
        code:"",
        branchId:syllabusId,
        publish:true
      }),
      this.saveCourse({
        courseName: courseName,
        courseId: courseId,
        courseCode: courseCode,
        term: term,
        description: description,
        department: department,
        section: section,
        overviewId: overviewId,
        syllabusId: syllabusId
      }),
      this.addContentToCourse(courseId, [overviewId, syllabusId], ["content", "content"]),
      this.saveUserContent([overviewId, syllabusId], ["content", "content"], "insert")
    ])
    .then(() => {
      this.loadAllCourses(() => {
        this.selectDrive("Courses", courseId);
        this.forceUpdate();
      })
      callback();
    })
  }

  toggleManageUrlForm(mode) {
    if (this.state.activeSection !== mode) {
      this.setState({ activeSection: mode });
    } else {
      this.setState({ activeSection: "chooser" });
    }
  }

  handleNewUrlCreated({urlId, title, url, description, usesDoenetAPI}, callback=(()=>{})) {
    Promise.all([
      this.saveUrl({
        urlId: urlId,
        title: title,
        url: url,
        description: description,
        usesDoenetAPI: usesDoenetAPI
      }, () => {
        if (this.state.directoryStack.length !== 0) {
          let currentFolderId = this.state.directoryStack[this.state.directoryStack.length - 1];
          this.addContentToFolder([urlId], ["url"], currentFolderId, () => {
            this.loadUserUrls();
          });        
        } else {
          this.saveUserContent([urlId], ["url"], "insert", () => {  // add to user root
            this.loadUserUrls(() => {
              this.setState({
                selectedItems: [urlId],
                selectedItemsType: ["url"],
                activeSection: "chooser",
                selectedDrive: "Content"
              }, () => { 
                this.updateNumber++;
              });
            });
          })  
        }        
      }),
    ])
    .then(() => {
      callback();
    })
  }

  saveUrl({urlId, title, url, description, usesDoenetAPI}, callback=(()=>{})){
    const apiUrl='/api/saveUrl.php';
    const data={
      urlId: urlId,
      title: title,
      url: url,
      description: description,
      usesDoenetAPI: usesDoenetAPI,
    }
    axios.post(apiUrl, data)
    .then(resp => {
      callback();
    })
    .catch(function (error) {
      this.setState({error:error});
    })
  }

  loadUserUrls(callback=(()=>{})) {
    this.urls_loaded = false;

    const loadUserUrlsUrl ='/api/loadUserUrls.php';
    const payload = {};
    
    axios.get(loadUserUrlsUrl,payload)
    .then(resp=>{
      this.urlInfo = Object.assign({}, this.urlInfo, resp.data.urlInfo);
      this.userUrlInfo = resp.data.urlInfo;
      this.urlIds = resp.data.urlIds;
      this.urls_loaded = true;
      callback();
      this.forceUpdate();
    });
  }

  loadUserContentBranches(callback=(()=>{})) {
    this.branches_loaded = false;

    let currentFolderId = this.state.directoryStack.length === 0 ?
                            "root" : this.state.directoryStack[this.state.directoryStack.length - 1];

    const data={folderId: currentFolderId};
    const payload = {params: data};

    const loadBranchesUrl='/api/loadUserContent.php';
    
    axios.get(loadBranchesUrl, payload)
    .then(resp=>{
      this.branchId_info = Object.assign({}, this.branchId_info, resp.data.branchId_info);
      this.userContentInfo = resp.data.branchId_info;
      this.sort_order = resp.data.sort_order;
      this.branches_loaded = true;
      callback();
      this.forceUpdate();
    });
  }

  saveContentToServer({documentName,code,branchId,publish=false}, callback=(()=>{})){
    const url='/api/saveContent.php';
    let ID = this.getContentId({code:code}) //get contentid
    const data={
      title: documentName,
      doenetML: code,
      branchId: branchId,
      contentId:ID,
      author: this.props.username,
      publish: publish,
      change_title_not_code:true,
    }
    axios.post(url, data)
    .then(() => {
      callback(branchId);
    })
    .catch(function (error) {
      this.setState({error:error});
    })
  }

  getContentId ({code}){
    const hash = crypto.createHash('sha256');
    if (code === undefined){
      return;
    }
    
    hash.update(code);
    let contentId = hash.digest('hex');
    return contentId;
  }

  saveCourse({courseId, courseName, courseCode, term, description, department, section, overviewId, syllabusId}, callback=(()=>{})) {
    const url='/api/saveCourse.php';
    const data={
      longName: courseName,
      courseId: courseId,
      shortName: courseCode,
      term: term,
      description: description,
      overviewId: overviewId,
      syllabusId: syllabusId,
      department: department,
      section: section,
    }
    axios.post(url, data)
    .then(resp => {
      // reload list of courses
      this.loadAllCourses(() => {
        this.loadCourseContent(courseId, () => {
          this.setState({
            selectedItems: [],
            activeSection: "chooser",
          });
          this.forceUpdate();
        });
      });
      callback(courseId);
    })
    .catch(function (error) {
      this.setState({error:error});
    })
  }

  loadAllCourses(callback=(()=>{})) {
    const loadCoursesUrl='/api/loadAllCourses.php';
    const data={
    }
    const payload = {
      params: data
    }

    axios.get(loadCoursesUrl,payload)
    .then(resp=>{
      this.courseInfo = resp.data.courseInfo;
      this.courseIds = resp.data.courseIds;
      callback();
      this.courses_loaded = true;
      this.forceUpdate();
    });
  }

  loadCourseContent(courseId, callback=(()=>{})) {
    this.folders_loaded = false;
    this.branches_loaded = false;
    this.url_loaded = false;
    const loadCoursesUrl='/api/loadCourseContent.php';
    const data={
      courseId: courseId
    }
    const payload = {
      params: data
    }

    axios.get(loadCoursesUrl,payload)
    .then(resp=>{
      this.branchId_info = Object.assign({}, this.branchId_info, resp.data.branchInfo);
      this.urlInfo = Object.assign({}, this.urlInfo, resp.data.urlInfo);
      this.folderInfo = {...this.folderInfo, ...resp.data.folderInfo};
      this.courseContentInfo = Object.assign({}, this.courseContentInfo, {[courseId]: resp.data.branchInfo});
      this.courseFolderInfo = Object.assign({}, this.courseFolderInfo, {[courseId]: resp.data.folderInfo});
      this.courseUrlInfo = Object.assign({}, this.courseUrlInfo, {[courseId]: resp.data.urlInfo});
      this.folders_loaded = true;
      this.branches_loaded = true;
      this.url_loaded = true;
      callback();
      this.forceUpdate();
    });
  }

  saveCourseContent(courseId, itemIds, itemTypes, operationType, callback=(()=>{})) {
    const url='/api/saveCourseContent.php';
    const data={
      courseId: courseId,
      itemIds: itemIds,
      itemTypes: itemTypes,
      operationType: operationType,
    }
    axios.post(url, data)
    .then((resp) => {
      callback(courseId);
    })
    .catch(function (error) {
      this.setState({error:error});
    })
  }

  selectDrive(drive, courseId=null) {
    if (drive === "Courses") {
      this.setState({
        selectedItems: [],
        selectedItemsType: [],
        activeSection: "chooser",
        selectedDrive: drive,
        selectedCourse: courseId,
        directoryStack: []});
      this.folders_loaded = false;
      this.branches_loaded = false;
      this.updateIndexedDBCourseContent(courseId);
      this.loadCourseContent(courseId);
    } else if (drive === "Global") {
      this.setState({
        selectedItems: [],
        selectedItemsType: [],
        activeSection: "chooser",
        selectedDrive: drive,
        directoryStack: []});
      this.sort_order = [];
      this.folderIds = [];
      this.urlIds = [];
    } else {
      this.setState({
        selectedItems: [],
        selectedItemsType: [],
        activeSection: "chooser",
        selectedDrive: drive,
        directoryStack: []}, () => {
          this.loadUserContentBranches();
          this.loadUserFoldersAndRepo();
          this.loadUserUrls();
      });
    }
    this.updateNumber++;
  }

  addContentToCourse(courseId, itemIds, itemTypes) {
    let operationType = "insert";
    this.saveCourseContent(courseId, itemIds, itemTypes, operationType ,(courseId) => {
      this.loadAllCourses(() => {
        this.selectDrive("Courses", courseId);
      });
    });
  }

  removeContentFromCourse(itemIds) {
    let operationType = "remove";
    let courseId = this.state.selectedCourse;
    this.saveCourseContent(courseId, itemIds, [], operationType ,(courseId) => {
      this.loadAllCourses();
    });
  }

  saveFolder(folderId, title, childContent, childType, operationType, isRepo, isPublic, callback=(()=>{})) {
    // get current directory folderId/root
    let currentFolderId = this.state.directoryStack.length == 0 ? "root" : this.state.directoryStack[this.state.directoryStack.length - 1];
    // setup parent
    let parentId = this.folderInfo[folderId] ? this.folderInfo[folderId].parentId : currentFolderId;
    if (isRepo) parentId = "root";  // repo always at root

    const url='/api/saveFolder.php';
    const data={
      title: title,
      folderId: folderId,
      childContent: childContent,
      childType: childType,
      operationType: operationType,
      parentId: parentId,
      isRepo: isRepo,
      isPublic: isPublic
    }
    axios.post(url, data)
    .then((resp) => {
      callback(folderId);
    })
    .catch(function (error) {
      this.setState({error:error});
    })
  }

  loadUserFoldersAndRepo(callback=(()=>{})) {
    this.folders_loaded = false;

    const loadUserFoldersAndRepoUrl='/api/loadUserFoldersAndRepo.php';
    const payload = {};
    
    axios.get(loadUserFoldersAndRepoUrl,payload)
    .then(resp=>{
      this.folderInfo = Object.assign({}, this.folderInfo, resp.data.folderInfo);
      this.folderIds = resp.data.folderIds;
      this.userFolderInfo = resp.data.folderInfo;
      this.folders_loaded = true;
      callback();
      this.forceUpdate();
    });
  }

  addNewFolder(title) {
    // generate new folderId
    let folderId = nanoid();

    // check if parent folder is private or isPublic
    let isPublic = false;
    if (this.state.directoryStack.length != 0  // not in root
      && this.folderInfo[this.state.directoryStack[0]].isRepo  // in repo
      && this.folderInfo[this.state.directoryStack[0]].isPublic) {  // in public repo
      isPublic = true;
    }

    this.saveFolder(folderId, title, [], [], "insert", false, isPublic, () => {
      // if not in base dir, add folder to current folder
      if (this.state.directoryStack.length !== 0) {
        let currentFolderId = this.state.directoryStack[this.state.directoryStack.length - 1];
        this.addContentToFolder([folderId], ["folder"], currentFolderId, () => {
          this.loadUserFoldersAndRepo(() => {
            this.setState({
              selectedItems: [folderId],
              selectedItemsType: ["folder"],
              activeSection: "chooser",
              selectedDrive: "Content"
            }, () => { 
              this.updateNumber++;
            });
          });
        });        
      } else {
        this.saveUserContent([folderId], ["folder"], "insert", () => {  // add to user root
          this.loadUserFoldersAndRepo(() => {
            this.setState({
              selectedItems: [folderId],
              selectedItemsType: ["folder"],
              activeSection: "chooser",
              selectedDrive: "Content"
            }, () => { 
              this.updateNumber++;
            });
          });
        });  
      }
    });
  }

  addContentToRepo(childIds, childType, repoId) {
    let isPublic = this.folderInfo[repoId].isPublic;

    // modify public/private state if parent is repo
    if (isPublic) {
      childIds.forEach(childId => {
        this.modifyPublicState(isPublic, [].concat(this.flattenFolder(childId).itemIds),
          [].concat(this.flattenFolder(childId).itemType));
      });
      this.addContentToFolder(childIds, childType, repoId);
    } else {
      // private (personal / in private repo) -> private allowed
      // public (in public repo) -> private not allowed
      let itemsToBeAdded = [];
      let typeOfItemsToBeAdded = [];
      childIds.forEach((childId, i) => {
        if (childType[i] == "folder") {
          // check if public
          if (!this.folderInfo[childId].isPublic) {
            this.modifyPublicState(isPublic, [].concat(this.flattenFolder(childId).itemIds),
              [].concat(this.flattenFolder(childId).itemType));
            itemsToBeAdded.push(childId);
            typeOfItemsToBeAdded.push("folder");
          } else {
            this.displayToast(`Public content cannot be made private: ${this.folderInfo[childId].title}`);
          }
        } else if (childType[i] == "content") {
          // check if public
          if (!this.branchId_info[childId].isPublic) {
            this.modifyPublicState(isPublic, [childId], ["content"]);
            itemsToBeAdded.push(childId);
            typeOfItemsToBeAdded.push("content");
          } else {
            this.displayToast(`Public content cannot be made private: ${this.branchId_info[childId].title}`);
          }
        } else if (childType[i] == "url") {
          // check if public
          if (!this.urlInfo[childId].isPublic) {
            this.modifyPublicState(isPublic, [childId], ["url"]);
            itemsToBeAdded.push(childId);
            typeOfItemsToBeAdded.push("url");
          } else {
            this.displayToast(`Public content cannot be made private: ${this.folderInfo[childId].title}`);
          }
        }
      });
      this.addContentToFolder(itemsToBeAdded, typeOfItemsToBeAdded, repoId);
    }
  }

  addContentToFolder(childIds, childType, folderId, callback=(()=>{})) {
    let operationType = "insert";
    let title = this.folderInfo[folderId].title;
    let isRepo = this.folderInfo[folderId].isRepo;
    let isPublic = this.folderInfo[folderId].isPublic;


    this.saveFolder(folderId, title, childIds, childType, operationType, isRepo, isPublic, (folderId) => {
      // creating new folder
      //    in a folder ~ set childItem.rootId = folderId.rootId
      //    at root ~ addContentToFolder not invoked
      // moving into folder
      //    from another root ~ set childItem.rootId = folderId.rootId
      //    from same root ~ set childItem.rootId = folderId.rootId
      if (this.folderInfo[folderId].parentId == "root") { 
        this.saveUserContent(childIds, childType, "remove");
      }
      let itemIds = [];
      childIds.forEach(childId => {
          itemIds = itemIds.concat(this.flattenFolder(childId).itemIds);
      });
      
      this.modifyFolderChildrenRoot(this.folderInfo[folderId].rootId, itemIds, () => {
        this.loadUserFoldersAndRepo();
        this.loadUserContentBranches();
        this.loadUserUrls();
        callback();
      });
    });
  }

  removeContentFromFolder(childIds, childType, folderId, callback=(()=>{})) {
    let operationType = "remove";
    let title = this.folderInfo[folderId].title;
    let isRepo = this.folderInfo[folderId].isRepo;
    let isPublic = this.folderInfo[folderId].isPublic;

    // modify public/private state if parent is repo
    if (isRepo) {
      if (isPublic) {
        this.displayToast(`Public content cannot be made private`);
        return; // public -> private not allowed
      } 
      // private -> private redundant, continue with removing    
    }

    this.saveFolder(folderId, title, childIds, childType, operationType, isRepo, isPublic, (folderId) => {
      // within same root ~ set childItem.rootId = folderId.rootId (unchanged)
      // to diff root ~ set childItem.rootId = folderId.rootId (changed)
      // to root ~ set childItem.rootId = childItem.id
      if (this.folderInfo[folderId].parentId == "root") {
        this.saveUserContent(childIds, childType, "insert");
        childIds.forEach(folderAtRoot => {
          this.modifyFolderChildrenRoot(folderAtRoot, [].concat(this.flattenFolder(folderAtRoot).itemIds), () => {
          });
        });
      }
      this.loadUserContentBranches();
      this.loadUserFoldersAndRepo();
      this.loadUserUrls();
      // this.forceUpdate();
      callback();
    });
  }

  publicizeRepo(repoId) {
    // display alert message
    if (window.confirm('This change is irreversible, proceed?')) {
      let repoChildren = [];
      let repoChildrenType = [];

      this.folderInfo[repoId].childFolders.forEach((childId, i) => {
        repoChildren = repoChildren.concat(this.flattenFolder(childId).itemIds);
        repoChildrenType = repoChildrenType.concat(this.flattenFolder(childId).itemType);
      });
      this.folderInfo[repoId].childContent.forEach((childId, i) => {
        repoChildren.push(childId);
        repoChildrenType.push("content");
      });
      this.folderInfo[repoId].childUrls.forEach((childId, i) => {
        repoChildren.push(childId);
        repoChildrenType.push("url");
      });
      this.modifyPublicState(true, [repoId].concat(repoChildren), ["folder"].concat(repoChildrenType), () => {
        this.loadUserFoldersAndRepo();
        this.loadUserContentBranches();
        this.loadUserUrls();
      });
    }
  }

  modifyPublicState(isPublic, itemIds, itemType, callback=(()=>{})) {
    const url='/api/modifyPublicState.php';
    const data={
      isPublic: isPublic,
      itemIds: itemIds,
      itemType: itemType
    }
    axios.post(url, data)
    .then((resp) => {
      callback();
    })
    .catch(function (error) {
      this.setState({error:error});
    })
  }

  renameFolder(folderId, newTitle) {
    this.saveFolder(folderId, newTitle, [], [], "", 
      this.folderInfo[folderId].isRepo, this.folderInfo[folderId].isPublic, () => {
      this.loadUserFoldersAndRepo();
    });
  }

  modifyFolderChildrenRoot(newRoot, itemIds, callback=(()=>{})) {
    const url='/api/modifyFolderChildrenRoot.php';
    const data={
      newRoot: newRoot,
      itemIds: itemIds
    }
    axios.post(url, data)
    .then((resp) => {
      callback();
    })
    .catch(function (error) {
      this.setState({error:error});
    })
  }

  flattenFolder(folderId) {
    if (!this.folderInfo[folderId]) {
      let currItemType =  this.branchId_info[folderId] === undefined ? "url" : "content";
      return {itemIds: [folderId], itemType: [currItemType]};
    }

    let itemIds = [folderId]; 
    let itemType = ["folder"];
    this.folderInfo[folderId].childFolders.forEach((childFolderId) => {
      itemIds = itemIds.concat(this.flattenFolder(childFolderId).itemIds);
      itemType = itemType.concat(this.flattenFolder(childFolderId).itemType);
    })
    this.folderInfo[folderId].childContent.forEach((childContentId) => {
      itemIds.push(childContentId);
      itemType.push("content");
    })
    this.folderInfo[folderId].childUrls.forEach((childUrlId) => {
      itemIds.push(childUrlId);
      itemType.push("url");
    })
    return {itemIds: itemIds, itemType: itemType};
  }

  saveUserContent(childIds, childType, operationType, callback=(()=>{})) {
    const url='/api/saveUserContent.php';
    const data={
      childIds: childIds,
      childType: childType,
      operationType: operationType
    }
    axios.post(url, data)
    .then(resp => {
      callback();
    })
    .catch(function (error) {
      this.setState({error:error});
    })
  }

  handleNewFolder() {
    // TODO: let user input folder title
    let num = 1;
    let title = "New Folder " + num; 
    while (Object.values(this.folderInfo).filter(folder => 
      folder.title && folder.title.includes(title)).length != 0) {
      num++;
      title = "New Folder " + num; 
    }
    this.displayToast("New folder created.");
    this.addNewFolder(title);
  }

  handleNewRepo() {
    // TODO: let user input repo title
    let title = "New Repository" 
    this.addNewRepo(title);
  }

  addNewRepo(title) {
    let folderId = nanoid();
    this.saveFolder(folderId, title, [], [], "insert", true, false, () => {
      this.modifyRepoAccess(folderId, "insert", true, () => {  // add user to repo_access
        this.loadUserFoldersAndRepo(() => {
          this.setState({
            directoryStack: [],
            selectedItems: [folderId],
            selectedItemsType: ["folder"],
            activeSection: "chooser",
            selectedDrive: "Content"
          }, () => { 
            this.updateNumber++;
          });
        });
      });  
    })
  }

  modifyRepoAccess(folderId, operationType, owner=false, callback=(()=>{})) {
    const url='/api/modifyRepoAccess.php';
    const data={
      repoId: folderId,
      operationType: operationType,
      owner: owner
    }
    axios.post(url, data)
    .then(resp => {
      callback();
    })
    .catch(function (error) {
      this.setState({error:error});
    })
  }

  jumpToDirectory(directoryData) {
    this.setState({
      directoryStack: directoryData,
      selectedItems: directoryData,
      selectedItemsType: ["folder"],
    })
  }

  updateSelectedItems(selectedItems, selectedItemsType) {
    this.setState({
      selectedItems: selectedItems,
      selectedItemsType: selectedItemsType,
    })
  }

  updateDirectoryStack(directoryStack) {
    this.setState({
      directoryStack: directoryStack
    })
    // this.loadUserFoldersAndRepo();
    // this.loadUserContentBranches();
  }

  getAllSelectedItems = () => {
    this.browser.current.getAllSelectedItems();
  }

  updateIndexedDBCourseContent(courseId) {
    // create a new database object
    let indexedDB = new IndexedDB(); 

    // open a connection to the database
    indexedDB.openDB((result) => {
      // update current course content
      indexedDB.insert("course_content_store", { 
        courseId: courseId,
        courseContent: this.courseInfo[courseId].content,
        courseFolders: this.courseInfo[courseId].folders,
      });

      // update last selected course
      indexedDB.insert("tool_state_store", { 
        toolName: "chooser",
        lastSelectedCourse: courseId,
      });
    });
  }

  loadFilteredContent(filters, callback=(()=>{})) {

    const typeToSQLMap = {
      "Folder name" : "title",
      "Content name" : "title",
      "Author" : "author",
      "Creation date" : "timestamp"
    }
    const operatorsToSQLMap = {
      "IS" : "=",
      "IS NOT" : "!=",
      "IS LIKE" : "LIKE",
      "IS NOT LIKE" : "NOT LIKE",
      "ON" : "=",
      "<" : "<",
      "<=" : "<=",
      ">" : ">",
      ">=" : ">="
    }
    // process filters
    this.branches_loaded = false;
    let processedFilters = [];
    let folderOnly = false;
    let contentOnly = false;
    filters.forEach(filter => {
      let sql = "";
      let filterValue = filter.value;
      if (filter.type == "Folder name") folderOnly = true;
      else if (filter.type == "Content name") contentOnly = true;
      else if (filter.type == "Creation date") filterValue = new Date(filterValue).toISOString().slice(0, 19).replace('T', ' ');

      sql += `${typeToSQLMap[filter.type]} ${operatorsToSQLMap[filter.operator]} `;
      if (filter.operator == "IS LIKE" || filter.operator == "IS NOT LIKE") {
        sql += `'%${filterValue}%'`;        
      } else {
        sql += `'${filterValue}'`;
      }
      if (filterValue != null) processedFilters.push(sql);
    })

    if (folderOnly && contentOnly) {
      folderOnly = false;
      contentOnly = false;
    }

    const url='/api/loadFilteredContent.php';
    const data={
      folderOnly: folderOnly,
      contentOnly: contentOnly,
      filters: processedFilters
    }
    axios.post(url, data)
    .then(resp => {
      callback();
      this.branchId_info = Object.assign({}, this.branchId_info, resp.data.branchId_info);
      this.sort_order = resp.data.sort_order;
      this.branches_loaded = true;
      this.forceUpdate();
    })
    .catch(function (error) {
      this.setState({error:error});
    })
  }

  loadCourseHeadingsAndAssignments(courseId) {
    this.assignments_and_headings_loaded = false;
    const url = "/api/getHeaderAndAssignmentInfo.php";
    const data = {
      courseId: courseId
    }
    const payload = {
      params: data
    }
    axios.get(url, payload).then(resp=>{
      let tempHeadingsInfo = {};
      let tempAssignmentsInfo = {};
      Object.keys(resp.data).map(itemId => {
        if (resp.data[itemId]["type"] == "header") {
          tempHeadingsInfo[itemId] = resp.data[itemId];
          tempHeadingsInfo[itemId]["childFolders"] = [];
          tempHeadingsInfo[itemId]["childContent"] = [];
          // process children
          for (let i in resp.data[itemId]["childrenId"]) {
            let childId = resp.data[itemId]["childrenId"][i];
            if (childId == "") continue;
            if (resp.data[childId]["type"] == "header") {
              tempHeadingsInfo[itemId]["childFolders"].push(childId);
            } else {
              tempHeadingsInfo[itemId]["childContent"].push(childId);
            }
          }
        } else {
          tempAssignmentsInfo[itemId] = resp.data[itemId];
        }
      })
      this.headingsInfo = Object.assign({}, this.headingsInfo, {[courseId]: tempHeadingsInfo});
      this.assignmentsInfo = Object.assign({}, this.assignmentsInfo, {[courseId]: tempAssignmentsInfo});
      this.assignments_and_headings_loaded = true;
      this.forceUpdate();
    }).catch(error =>{
      this.setState({error:error})
    }); 
  }

  updateHeadingsAndAssignments(headingsInfo, assignmentsInfo) {
    this.headingsInfo = headingsInfo;
    this.assignmentsInfo = assignmentsInfo;
    this.saveTree(this.headingsInfo, this.assignmentsInfo);
  }

  saveTree(headingsInfo, assignmentsInfo){
    let assignmentId_parentID_array = [];
    let assignmentId_array = Object.keys(assignmentsInfo)
    assignmentId_array.forEach(id=>{
      assignmentId_parentID_array.push(assignmentsInfo[id]['parentId']);
    })
    let headerID_array = Object.keys(headingsInfo);
    let headerID_array_to_payload = []
    let headerID_childrenId_array_to_payload=[]
    let headerID_parentId_array_to_payload = []
    let headerID_name = []
    headerID_array.forEach(currentHeaderId=>{
      let currentHeaderObj=headingsInfo[currentHeaderId]
      let name = currentHeaderObj['title']
      if (name==null){
        name="NULL"
      }
      let currentHeaderObjHeadingIdArray = currentHeaderObj['childFolders']
      let lengthOfHeadingId = currentHeaderObjHeadingIdArray.length
      let currentHeaderObjAssignmentIdArray = currentHeaderObj['childContent']
      let currentHeaderObjParentId = currentHeaderObj['parentId']
      let lengthOfAssigmentId = currentHeaderObjAssignmentIdArray.length
      let iterator = 0
      if (lengthOfHeadingId==0 && lengthOfAssigmentId==0){
        headerID_array_to_payload.push(currentHeaderId)
        if (currentHeaderObjParentId==null){
          headerID_parentId_array_to_payload.push("NULL")
        } else {
        headerID_parentId_array_to_payload.push(currentHeaderObjParentId)
        }
        headerID_childrenId_array_to_payload.push("NULL")
        headerID_name.push(name);
      }
      while (iterator < lengthOfHeadingId){
        headerID_array_to_payload.push(currentHeaderId)
        headerID_childrenId_array_to_payload.push(currentHeaderObjHeadingIdArray[iterator])
        headerID_name.push(name);
        if (currentHeaderObjParentId==null){
          headerID_parentId_array_to_payload.push("NULL")
        } else {
        headerID_parentId_array_to_payload.push(currentHeaderObjParentId)
        }
        iterator+=1
      }
      iterator = 0
      while (iterator < lengthOfAssigmentId){
        headerID_array_to_payload.push(currentHeaderId)
        headerID_childrenId_array_to_payload.push(currentHeaderObjAssignmentIdArray[iterator])
        headerID_name.push(name);
        if (currentHeaderObjParentId==null){
          headerID_parentId_array_to_payload.push("NULL")
        } else {
        headerID_parentId_array_to_payload.push(currentHeaderObjParentId)
        }
        iterator+=1
      }
    })
    const urlGetCode = '/api/saveTree.php';
    const data = {
      assignmentId_array: assignmentId_array,
      assignmentId_parentID_array: assignmentId_parentID_array,
      headerID_array_to_payload:headerID_array_to_payload,
      headerID_name:headerID_name,
      headerID_parentId_array_to_payload:headerID_parentId_array_to_payload,
      headerID_childrenId_array_to_payload:headerID_childrenId_array_to_payload,
      courseId:"aI8sK4vmEhC5sdeSP3vNW"
    }
    axios.post(urlGetCode,data)
    .then(resp=>{
      // console.log(resp.data)
    })
    .catch(error=>{this.setState({error:error})});
  }
 
  ToastWrapper() {
    const { add } = useToasts();
    this.addToast = add;
    return <React.Fragment></React.Fragment>
  }

  displayToast(message) {
    this.addToast(message);
  }

  onTreeDragStart(draggedId, draggedType, sourceContainerId, sourceContainerType) {
    console.log("onTreeDragStart")
    // get dataObjectSource
    let dataObjectSource = {};
    if (sourceContainerType == ChooserConstants.COURSE_ASSIGNMENTS_TYPE) {
      dataObjectSource = draggedType == "leaf" ? this.assignmentsInfo[sourceContainerId] : this.headingsInfo[sourceContainerId];
      this.containerCache = {
        ...this.containerCache,
        [sourceContainerId]: {
          parents: JSON.parse(JSON.stringify(this.headingsInfo[sourceContainerId])), 
          leaves: JSON.parse(JSON.stringify(this.assignmentsInfo[sourceContainerId]))
        }
      }
      
    } else if (sourceContainerType == ChooserConstants.COURSE_ASSIGNMENTS_TYPE) {
      dataObjectSource = draggedType == "leaf" ? this.assignmentsInfo[sourceContainerId] : this.headingsInfo[sourceContainerId];
      this.containerCache = {
        ...this.containerCache,
        [sourceContainerId]: {
          parents: JSON.parse(JSON.stringify(this.headingsInfo[sourceContainerId])), 
          leaves: JSON.parse(JSON.stringify(this.assignmentsInfo[sourceContainerId]))
        }
      }
    } else if (sourceContainerType == ChooserConstants.COURSE_ASSIGNMENTS_TYPE) {
      dataObjectSource = draggedType == "leaf" ? this.assignmentsInfo[sourceContainerId] : this.headingsInfo[sourceContainerId];
      this.containerCache = {
        ...this.containerCache,
        [sourceContainerId]: {
          parents: JSON.parse(JSON.stringify(this.headingsInfo[sourceContainerId])), 
          leaves: JSON.parse(JSON.stringify(this.assignmentsInfo[sourceContainerId]))
        }
      }
    }
    const dataObject = dataObjectSource[draggedId];
    const sourceParentId = dataObjectSource[draggedId].parentId;
    
    this.setState({
      currentDraggedObject: {id: draggedId, type: draggedType, sourceContainerId: sourceContainerId, dataObject: dataObject, sourceParentId: sourceParentId},
    })
    this.cachedCurrentDraggedObject = {id: draggedId, type: draggedType, sourceContainerId: sourceContainerId, dataObject: dataObject, sourceParentId: sourceParentId};
    this.validDrop = false;
    this.lastDroppedContainerId = null;
  }

  onTreeDraggableDragOver(id, type, containerId, containerType) {
    // draggedType must be equal to dragOver type
    if (type != this.state.currentDraggedObject.type || id == "UltimateHeader") return;

    const draggedOverItemInfo = type == "leaf" ? this.assignmentsInfo[containerId] : this.headingsInfo[containerId];
    const headingsChildrenListKey = type == "leaf" ? "childContent" : "childFolders";
    const currentDraggedObjectInfo = this.state.currentDraggedObject.type == "leaf" ? this.assignmentsInfo[containerId] : this.headingsInfo[containerId];

    const draggedOverItemParentListId = draggedOverItemInfo[id]["parentId"];
    const draggedOverItemIndex = this.headingsInfo[containerId][draggedOverItemParentListId][headingsChildrenListKey]
      .findIndex(itemId => itemId == id);

    const draggedItemParentListId = currentDraggedObjectInfo[this.state.currentDraggedObject.id]["parentId"];

    // if the item is dragged over itself, ignore
    if (this.state.currentDraggedObject.id == id || draggedItemParentListId != draggedOverItemParentListId) {
      return;
    } 

    // filter out the currently dragged item
    const items = this.headingsInfo[containerId][draggedOverItemParentListId][headingsChildrenListKey].filter(itemId => itemId != this.state.currentDraggedObject.id);
    // add the dragged item after the dragged over item
    items.splice(draggedOverItemIndex, 0, this.state.currentDraggedObject.id);

    this.headingsInfo[containerId][draggedOverItemParentListId][headingsChildrenListKey] = items;
    this.forceUpdate();
  };

  onTreeDropEnter (listId, containerId) {
    console.log("onTreeDropEnter")

    // check current draggable source == tree
    // false then (extract from original source, insert into tree at base level)
    // dragged object coming from different container
    if (this.state.currentDraggedObject.sourceContainerId != containerId) {
      // create clone of current tree structure (headings, assignments)
      this.containerCache = {
        ...this.containerCache,
        [containerId]: {
          parents: JSON.parse(JSON.stringify(this.headingsInfo[containerId])),   // TODO: handle multiple courses/content
          leaves: JSON.parse(JSON.stringify(this.assignmentsInfo[containerId]))
        }
      }
      // insert copy into current container at base level (parentId = listId) 
      const draggedObjectInfo = this.state.currentDraggedObject.dataObject;
      let newObject = {};
      let newObjectChildren = [];
      switch (this.state.currentDraggedObject.type) {
        case "content":
          newObject = {
            title: draggedObjectInfo.title,
            type: "assignment",
            contentId: draggedObjectInfo.contentIds[0].contentId,
            branchId: this.state.currentDraggedObject.id,
            assignedDate: null,
            dueDate: null,
            numberOfAttemptsAllowed: "3",
            parentId: listId
          };
          break;
        case "folder":
          // create new heading + assignments
          break;
        case "leaf":
          // TODO: verify if working correctly
          newObject = draggedObjectInfo;
          break;
        case "parent":
          newObject = draggedObjectInfo;
          // TODO: get all assignments in parent, insert -> newObjectChildren
          break;
      }

      if (this.state.currentDraggedObject.type == "content" || this.state.currentDraggedObject.type == "leaf") {
        this.assignmentsInfo[containerId] = Object.assign({}, this.assignmentsInfo[containerId], {[this.state.currentDraggedObject.id]: newObject});
        this.headingsInfo[containerId][listId].childrenId.push(newObject.branchId);
        this.headingsInfo[containerId][listId].childContent.push(newObject.branchId);
        const currentDraggedObject = this.state.currentDraggedObject;
        currentDraggedObject.dataObject = newObject;
        currentDraggedObject.type = "leaf";
        currentDraggedObject.sourceParentId = listId;
        currentDraggedObject.sourceContainerId = containerId;
        this.setState({currentDraggedObject: currentDraggedObject});  
      } else {  // "folder" || "heading"
        // insert new heading into headings
        // if any objectChildren, insert into assignments
      }

      return;
    }

    const currentDraggedObjectInfo = this.state.currentDraggedObject.dataObject;
    const previousParentId = currentDraggedObjectInfo.parentId;

    if (previousParentId == listId || listId == this.state.currentDraggedObject.id) // prevent heading from becoming a child of itself 
      return;
    
    const headingsChildrenListKey = this.state.currentDraggedObject.type == "leaf" ? "childContent" : "childFolders";
    const previousList = this.headingsInfo[containerId][previousParentId][headingsChildrenListKey];
    const currentList = this.headingsInfo[containerId][listId][headingsChildrenListKey];
    // remove from previous list
    if (previousParentId !== this.state.currentDraggedObject.sourceParentId) {
      const indexInList = previousList.findIndex(itemId => itemId == this.state.currentDraggedObject.id);
      if (indexInList > -1) {
        previousList.splice(indexInList, 1);
      }
    }
    if (listId !== this.state.currentDraggedObject.sourceParentId) {
      // add to current list
      currentList.push(this.state.currentDraggedObject.id);     
    }

    this.headingsInfo[containerId][previousParentId][headingsChildrenListKey] = previousList;
    this.headingsInfo[containerId][listId][headingsChildrenListKey] = currentList;
    const currentDraggedObject = this.state.currentDraggedObject;
    currentDraggedObject.dataObject.parentId = listId;
    this.setState({ currentDraggedObject: currentDraggedObject })
  }

  onTreeDropLeave() {
    // if not across containers, return
    // Content -> Course :  Reset course data, reset content data (object return to source content), reset draggedObj
    // Content -> Content :  Reset content data (object return to source content), reset draggedObj
    // Course -> Content : Not allowed
    // Course -> Course : Reset both courses data (object return to source course), reset draggedObj
    
    console.log("onTreeDropLeave")
  }

  onTreeDragEnd (containerId) {
    console.log("onTreeDragEnd")
    // dropped outsize valid dropzone
    let currTreeHeadings = this.headingsInfo[containerId];
    let currTreeAssignments = this.assignmentsInfo[containerId];
    if (!this.validDrop) {
      currTreeHeadings = this.containerCache[containerId].parents;
      currTreeAssignments = this.containerCache[containerId].leaves;
    }
    // updateHeadingsAndAssignments(currTreeHeadings, currTreeAssignments);

    this.headingsInfo[containerId] = currTreeHeadings;
    this.assignmentsInfo[containerId] = currTreeAssignments;
    this.setState({
      currentDraggedObject: {id: null, type: null, sourceContainerId: null},
    });
    this.containerCache = {};
    this.cachedCurrentDraggedObject = null;
    this.validDrop = true;
    this.lastDroppedContainerId = null;
  }

  onTreeDrop (containerId) {
    console.log("onTreeDrop")
    // update courseHeadingsInfo/courseAssignmentsInfo currentDraggedObject parentId
    // remove currentDraggedObject from sourceParentId children list
    if (this.state.currentDraggedObject.type == "leaf") {
      const newCourseAssignments = this.assignmentsInfo[containerId];
      newCourseAssignments[this.state.currentDraggedObject.id] = this.state.currentDraggedObject.dataObject;
      this.assignmentsInfo[containerId] = newCourseAssignments;
    }
    const headingsChildrenListKey = this.state.currentDraggedObject.type == "leaf" ? "childContent" : "childFolders";
    const sourceParentChildrenList = this.headingsInfo[containerId][this.state.currentDraggedObject.sourceParentId][headingsChildrenListKey];
    
    if (this.state.currentDraggedObject.dataObject.parentId !== this.state.currentDraggedObject.sourceParentId) {
      const indexInSourceParentChildrenList = sourceParentChildrenList.findIndex(itemId => itemId == this.state.currentDraggedObject.id);
      if (indexInSourceParentChildrenList > -1) {
        sourceParentChildrenList.splice(indexInSourceParentChildrenList, 1);
      }
    }
    
    // updateHeadingsAndAssignments(courseHeadingsInfo, courseAssignmentsInfo);
    
    // update headings
    this.headingsInfo[containerId][this.state.currentDraggedObject.sourceParentId][headingsChildrenListKey] = sourceParentChildrenList;
    if (this.state.currentDraggedObject.type == "parent") this.headingsInfo[containerId][this.state.currentDraggedObject.id] = this.state.currentDraggedObject.dataObject;
    this.setState({
      currentDraggedObject: {id: null, type: null, sourceContainerId: null},
    })
    this.validDrop = true;
    this.lastDroppedContainerId = containerId;
  }

  onBrowserDragStart({draggedId, draggedType, sourceContainerId, parentsInfo, leavesInfo}) {
    console.log("onDragStart")

    let dataObjectSource = leavesInfo;
    if (draggedType == "folder") dataObjectSource = parentsInfo;
    else if (draggedType == "url") dataObjectSource = this.urlInfo;

    const dataObject = dataObjectSource[draggedId];
    const sourceParentId = dataObjectSource[draggedId].parentId;
    
    this.setState({
      currentDraggedObject: {id: draggedId, type: draggedType, sourceContainerId: sourceContainerId, dataObject: dataObject, sourceParentId: sourceParentId},
    })
    this.containerCache = {
      ...this.containerCache,
      [sourceContainerId]: {
        parents: JSON.parse(JSON.stringify(parentsInfo)), 
        leaves: JSON.parse(JSON.stringify(leavesInfo))
      }
    }
    this.cachedCurrentDraggedObject = {id: draggedId, type: draggedType, sourceContainerId: sourceContainerId, dataObject: dataObject, sourceParentId: sourceParentId};
    this.validDrop = false;
  }

  onBrowserDropEnter (listId) {
    console.log("onDropEnter")

  }

  onBrowserDragEnd ({containerId, parentsInfo, leavesInfo}) {
    console.log("onBrowserDragEnd")
    let currParentsInfo = parentsInfo;
    let currChildrenInfo = leavesInfo;
    // dropped across containers && content -> content
    if (this.validDrop && containerId != this.lastDroppedContainerId) { 
      // remove current dragged item from data
      // save data
    } else if (!this.validDrop){
      // dropped outsize valid dropzone, reset all data
      currParentsInfo = this.containerCache[containerId].parents;
      currChildrenInfo = this.containerCache[containerId].leaves;
      const newSourceContainerId = this.state.currentDraggedObject.sourceContainerId;
      if (newSourceContainerId != containerId) {
        this.headingsInfo[newSourceContainerId] = this.containerCache[newSourceContainerId].parents;
        this.assignmentsInfo[newSourceContainerId] = this.containerCache[newSourceContainerId].leaves;
      }      
    }
    this.folderInfo = currParentsInfo;
    this.branchId_info = currChildrenInfo;
    // save folderInfo and branchId_info

    this.setState({
      currentDraggedObject: {id: null, type: null, sourceContainerId: null},
    })
    this.containerCache = {};
    this.cachedCurrentDraggedObject = null;
  }

  onBrowserDrop (containerId, parentsInfo, leavesInfo) {
    console.log("onDrop")
    
  }

  render(){

    if (!this.courses_loaded || !this.assignments_and_headings_loaded){
      return <div style={{display:"flex",justifyContent:"center",alignItems:"center", height:"100vh"}}>
                <SpinningLoader/>
             </div>
    }
    // return <DoenetCourseOutline treeHeadingsInfo={this.headingsInfo} treeAssignmentsInfo={this.assignmentsInfo} 
      // updateHeadingsAndAssignments={this.updateHeadingsAndAssignments}/>
      const CourseOutlineFrame = styled('div')`
      display: flex;
      flex-direction: row;
      justify-content: left;
      align-items: left;
      text-align: left;
      padding: 2em;
      overflow-y: scroll;
      overflow-x: hidden;
      grid-row: 2 / 3;
      grid-column: 3 / 4;
      transform: scale(1.2);
      transform-origin: top left;
      margin-top: 15px;
      `

    // let tempTree = <div className="tree">
    //   <TreeView
    //     containerId={"aI8sK4vmEhC5sdeSP3vNW"}
    //     loading={!this.assignments_and_headings_loaded}
    //     parentsInfo={this.headingsInfo["aI8sK4vmEhC5sdeSP3vNW"]} 
    //     childrenInfo={this.assignmentsInfo["aI8sK4vmEhC5sdeSP3vNW"]} 
    //     currentDraggedObject={this.state.currentDraggedObject}
    //     onDragStart={this.onTreeDragStart}
    //     onDragEnd={this.onTreeDragEnd}
    //     onDraggableDragOver={this.onTreeDraggableDragOver} 
    //     onDropEnter={this.onTreeDropEnter}
    //     onDrop={this.onTreeDrop} />
    //   </div>

    // process root folder for tree rendering
    if (this.folders_loaded && this.branches_loaded && this.urls_loaded) {
      this.userFolderInfo["UltimateHeader"] = {};
      this.userFolderInfo["UltimateHeader"]["childContent"] = [];
      this.userFolderInfo["UltimateHeader"]["childFolders"] = [];
      this.userFolderInfo["UltimateHeader"]["childUrls"] = [];
      Object.keys(this.userContentInfo).forEach((branchId) => {
        if (this.userContentInfo[branchId].parentId == "root") this.userFolderInfo["UltimateHeader"]["childContent"].push(branchId);
      })
      Object.keys(this.userUrlInfo).forEach((urlId) => {
        if (this.userUrlInfo[urlId].parentId == "root") this.userFolderInfo["UltimateHeader"]["childUrls"].push(urlId);
      })
      Object.keys(this.userFolderInfo).forEach((folderId) => {
        if (this.userFolderInfo[folderId].parentId == "root") this.userFolderInfo["UltimateHeader"]["childFolders"].push(folderId);
      })
      for (let folderId in this.userFolderInfo) {
        this.userFolderInfo[folderId]["childrenList"] = [...this.userFolderInfo[folderId]["childContent"],
          ...this.userFolderInfo[folderId]["childFolders"], ...this.userFolderInfo[folderId]["childUrls"]];
      }
    }

    let tempTree = <div className="tree">
      <TreeView
        containerId={"user"}
        loading={!this.folders_loaded || !this.branches_loaded || !this.urls_loaded}
        parentsInfo={this.userFolderInfo} 
        childrenInfo={{...this.userFolderInfo, ...this.userContentInfo, ...this.userUrlInfo}} 
        currentDraggedObject={this.state.currentDraggedObject}
        onDragStart={this.onTreeDragStart}
        onDragEnd={this.onTreeDragEnd}
        onDraggableDragOver={this.onTreeDraggableDragOver} 
        onDropEnter={this.onTreeDropEnter}
        onDrop={this.onTreeDrop} />
      </div>

    this.buildCourseList();
    this.buildLeftNavPanel();
    this.buildTopToolbar();

    // setup mainSection to be chooser / CourseForm
    this.mainSection;
    if (this.state.activeSection === "add_course" || this.state.activeSection === "edit_course") {
      this.mainSection = <CourseForm 
                          mode={this.state.activeSection}
                          handleBack={this.toggleManageCourseForm}
                          handleNewCourseCreated={this.handleNewCourseCreated}
                          saveCourse={this.saveCourse}
                          selectedCourse={this.state.selectedCourse}
                          selectedCourseInfo={this.courseInfo[this.state.selectedCourse]}
                          />;
    } else if (this.state.activeSection === "add_url" || this.state.activeSection === "edit_url") {
      this.mainSection = <UrlForm 
                          mode={this.state.activeSection}
                          handleBack={this.toggleManageUrlForm}
                          handleNewUrlCreated={this.handleNewUrlCreated}
                          saveUrl={this.saveUrl}
                          selectedUrl={this.state.selectedItems[this.state.selectedItems.length - 1]}
                          selectedUrlInfo={this.urlInfo[this.state.selectedItems[this.state.selectedItems.length - 1]]}
                          />;
    }
    else {
      let folderList = [];
      let contentList = [];
      let urlList = [];
      if (this.state.selectedDrive == "Content" || this.state.selectedDrive == "Global") {
        folderList = this.folderIds;
        contentList = this.sort_order;
        urlList = this.urlIds;
      } else if (this.state.selectedDrive == "Courses") {
        folderList = this.courseInfo[this.state.selectedCourse].folders;
        contentList = this.courseInfo[this.state.selectedCourse].content;
        urlList = this.courseInfo[this.state.selectedCourse].urls;
      }
      this.mainSection = <React.Fragment>
        <DoenetBranchBrowser
          loading={!this.folders_loaded || !this.branches_loaded || !this.urls_loaded}
          containerId={"browser"}
          allContentInfo={this.branchId_info}
          allFolderInfo={this.folderInfo}
          allUrlInfo={this.urlInfo}
          folderList={folderList}
          contentList={contentList}
          urlList={urlList}
          ref={this.browser}                                      // optional
          key={"browser"+this.updateNumber}                       // optional
          selectedDrive={this.state.selectedDrive}                // optional
          selectedCourse={this.state.selectedCourse}              // optional
          allCourseInfo={this.courseInfo}                         // optional
          updateSelectedItems={this.updateSelectedItems}          // optional
          updateDirectoryStack={this.updateDirectoryStack}        // optional
          addContentToFolder={this.addContentToFolder}            // optional
          addContentToRepo ={this.addContentToRepo}               // optional
          removeContentFromCourse={this.removeContentFromCourse}  // optional
          removeContentFromFolder={this.removeContentFromFolder}  // optional                  
          directoryData={this.state.directoryStack}               // optional
          selectedItems={this.state.selectedItems}                // optional
          selectedItemsType={this.state.selectedItemsType}        // optional
          renameFolder={this.renameFolder}                        // optional
          openEditCourseForm={() => this.toggleManageCourseForm("edit_course")} // optional
          publicizeRepo={this.publicizeRepo}                      // optional
          onDragStart={this.onBrowserDragStart}
          onDragEnd={this.onBrowserDragEnd}
          onDraggableDragOver={() => {}} 
          onDropEnter={this.onBrowserDropEnter}
          onDrop={this.onBrowserDrop}

        />
      </React.Fragment>
    }

   

    return (<React.Fragment>
      <DoenetHeader toolTitle="Chooser" headingTitle={"Choose Branches"} />
      <ToastProvider>
        <div id="chooserContainer">
          <this.ToastWrapper/>
          { this.leftNavPanel }
          { this.topToolbar }
          { this.mainSection }     
          { tempTree }
          {/* <InfoPanel
            selectedItems={this.state.selectedItems}
            selectedItemsType={this.state.selectedItemsType}
            selectedDrive={this.state.selectedDrive}
            selectedCourse={this.state.selectedCourse}
            allFolderInfo={this.folderInfo}
            allContentInfo={this.branchId_info}
            allUrlInfo={this.urlInfo}
            allCourseInfo={this.courseInfo}
            publicizeRepo={this.publicizeRepo}
            openEditCourseForm={() => this.toggleManageCourseForm("edit_course")} // optional
            openEditUrlForm={() => this.toggleManageUrlForm("edit_url")} */}
          />
        </div>
      </ToastProvider>
    </React.Fragment>);
  }
}

class CourseForm extends React.Component {
  static defaultProps = {
    selectedCourse: null,
    selectedCourseInfo: null
  }

  constructor(props) {
    super(props);
    this.state = {
      edited: "",
      courseName: "",
      department: "",
      courseCode: "",
      section: "",
      year: "",
      semester: "Spring",
      description: "",
      roles: [],
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.addRole = this.addRole.bind(this);
  }

  componentDidMount() {
    if (this.props.mode == "edit_course" && this.props.selectedCourseInfo !== null) {
      let term = this.props.selectedCourseInfo.term.split(" ");
      this.setState({
        courseName: this.props.selectedCourseInfo.courseName,
        department: this.props.selectedCourseInfo.department,
        courseCode: this.props.selectedCourseInfo.courseCode,
        section: this.props.selectedCourseInfo.section,
        semester: term[0],
        year: term[1],
        description: this.props.selectedCourseInfo.description
      });
    }
  }

  handleChange(event) {
    // set edited to true once any input is detected
    this.setState({ edited: true });
    
    let name = event.target.name;
    let value = event.target.value;
    this.setState({[name]: value});
  }

  handleSubmit(event) {
    let term = this.state.semester + " " + this.state.year;
    if (this.props.mode == "add_course") {
      let courseId = nanoid();
      this.props.handleNewCourseCreated({
        courseName:this.state.courseName,
        courseId: courseId,
        courseCode:this.state.courseCode,
        term: term,
        description: this.state.description,
        department: this.state.department,
        section: this.state.section,
        }, () => {
          event.preventDefault();
        });
    } else {
      this.props.saveCourse({
        courseName:this.state.courseName,
        courseId: this.props.selectedCourse,
        courseCode:this.state.courseCode,
        term: term,
        description: this.state.description,
        department: this.state.department,
        section: this.state.section,
        overviewId: this.props.selectedCourseInfo.overviewId,
        syllabusId: this.props.selectedCourseInfo.syllabusId
      });
    }
  }

  handleBack() {
    // popup confirm dialog if form is edited
    if (this.state.edited) {
      if (!window.confirm('All of your input will be discarded, are you sure you want to proceed?')) {
        return;
      }
    }

    this.props.handleBack(this.props.mode);
  }

  addRole(role) {
    //create a unike key for each new role
    var timestamp = (new Date()).getTime();
    this.state.roles['role-' + timestamp ] = role;
    this.setState({ roles : this.state.roles });
  }


  render() {
    return (
      <div id="formContainer">
        <div id="formTopbar">
          <div id="formBackButton" onClick={this.handleBack} data-cy="newCourseFormBackButton">
            <FontAwesomeIcon icon={faArrowCircleLeft} style={{"fontSize":"17px", "marginRight":"5px"}}/>
            <span>Back to Chooser</span>
          </div>          
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="formGroup-12">
            <label className="formLabel">COURSE NAME</label>
            <input className="formInput" required type="text" name="courseName" value={this.state.courseName}
              placeholder="Course name goes here." onChange={this.handleChange} data-cy="newCourseFormNameInput"/>
          </div>
          <div className="formGroupWrapper">
            <div className="formGroup-4" >
              <label className="formLabel">DEPARTMENT</label>
              <input className="formInput" required type="text" name="department" value={this.state.department}
              placeholder="DEP" onChange={this.handleChange} data-cy="newCourseFormDepInput"/>
            </div>
            <div className="formGroup-4">
              <label className="formLabel">COURSE CODE</label>
              <input className="formInput" required type="text" name="courseCode" value={this.state.courseCode}
                placeholder="MATH 1241" onChange={this.handleChange} data-cy="newCourseFormCodeInput"/>
            </div>
            <div className="formGroup-4">
              <label className="formLabel">SECTION</label>
              <input className="formInput" type="number" name="section" value={this.state.section}
              placeholder="00000" onChange={this.handleChange} data-cy="newCourseFormSectionInput"/>
            </div>
          </div>          
          <div className="formGroupWrapper">
            <div className="formGroup-4" >
              <label className="formLabel">YEAR</label>
              <input className="formInput" required type="number" name="year" value={this.state.year}
              placeholder="2019" onChange={this.handleChange} data-cy="newCourseFormYearInput"/>
            </div>
            <div className="formGroup-4">
              <label className="formLabel">SEMESTER</label>
              <select className="formSelect" required name="semester" onChange={this.handleChange} value={this.state.semester}>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Fall">Fall</option>
              </select>
            </div>
            <div className="formGroup-4">
            </div>
          </div> 
          <div className="formGroup-12">
            <label className="formLabel">DESCRIPTION</label>
            <textarea className="formInput" type="text" name="description" value={this.state.description}
              placeholder="Official course description here" onChange={this.handleChange} data-cy="newCourseFormDescInput"/>
          </div>
          <div className="formGroup-12">
            <label className="formLabel">ROLES</label>
              <AddRoleForm addRole={this.addRole}/>
              <RoleList roles={this.state.roles}/>
          </div>
          <div id="formButtonsContainer">
            <button id="formSubmitButton" type="submit" data-cy="newCourseFormSubmitButton">
              <div className="formButtonWrapper">
                { this.props.mode == "add_course" ?
                  <React.Fragment>
                    <span>Create Course</span>
                    <FontAwesomeIcon icon={faPlusCircle} style={{"fontSize":"20px", "color":"#fff", "cursor":"pointer", "marginLeft":"8px"}}/>
                  </React.Fragment>                  
                  : 
                  <React.Fragment>
                    <span>Save Changes</span>
                    <FontAwesomeIcon icon={faSave} style={{"fontSize":"20px", "color":"#fff", "cursor":"pointer", "marginLeft":"8px"}}/>
                  </React.Fragment>
                }
              </div>              
            </button>
            <button id="formCancelButton" onClick={this.handleBack} data-cy="newCourseFormCancelButton">
              <div className="formButtonWrapper">
                <span>Cancel</span>
                <FontAwesomeIcon icon={faTimesCircle} style={{"fontSize":"20px", "color":"#fff", "cursor":"pointer", "marginLeft":"8px"}}/>
              </div>
            </button>
          </div>          
        </form>
      </div>  
    );
  }
}

function RoleList(props){
  return (
    <div className="roleListContainer">
      <ul style={{"fontSize":"16px"}}>{
          Object.keys(props.roles).map(function(key) {
            return <li key={key}>{props.roles[key]}</li>
          })}
      </ul>
      </div>
    );
  };

class AddRoleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: ""
    };

    this.addRole = this.addRole.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  addRole(event) {
    this.props.addRole(this.state.input);
    this.setState({ input: ""});
    event.preventDefault();
  };

  handleChange(event) {
    this.setState({ input: event.target.value });
  }

  render() {
    return(
      <div className="formGroup-4" style={{"display":"flex"}}>
        <input className="formInput" type="text" value={this.state.input} onChange={this.handleChange}
        type="text" placeholder="Admin"/>
        <button type="submit" style={{"whiteSpace":"nowrap"}} onClick={this.addRole}>Add Role</button>
      </div>
    )
  }
}

class Accordion extends Component {

  constructor(props) {
    super(props);
    const openSections = {};
    this.state = { openSections };
  }

  onClick = label => {
    const {
      state: { openSections },
    } = this;

    const isOpen = !!openSections[label];

    this.setState({
      openSections: {
        [label]: !isOpen
      }
    });
  };

  render() {
    const {
      onClick,
      props: { children },
      state: { openSections },
    } = this;

    return (
        <AccordionSection
          isOpen={!!openSections[children.props.label]}
          label={children.props.label}
          onClick={onClick}>
          {children.props.children}
        </AccordionSection>
    );
  }
}

class AccordionSection extends Component {

  onClick = () => {
    this.props.onClick(this.props.label);
  };

  render() {
    const {
      onClick,
      props: { isOpen, label },
    } = this;

    return (
      <div style={{ "width":"100%","height":"100%", "cursor":'pointer'}}>
        <div onClick={onClick} data-cy="coursesAccordion"> 
          {isOpen? <FontAwesomeIcon className="menuTwirlIcon" icon={faCaretDown}/> :
          <FontAwesomeIcon className="menuTwirlIcon" icon={faCaretRight}/>}
          {label}
        </div>
        {isOpen && (
          <div>
            {this.props.children}
          </div>
        )}
      </div>
    );
  }
}

class FilterPanel extends Component {

  constructor(props) {
    super(props);
    this.state = { showFilters: false };

    this.togglePanel = this.togglePanel.bind(this);
  }

  togglePanel = () => {
    this.setState(prevState => ({
      showFilters: !prevState.showFilters
    }));    
  }

  render() {
    return (
      <div id="filterPanel">
        <span>Search Globally</span>
        <button id="editFiltersButton" onClick={this.togglePanel}>Edit Filters</button>
        <FilterForm show={this.state.showFilters} loadFilteredContent={this.props.loadFilteredContent} togglePanel={this.togglePanel}/>
      </div>
    );
  }
}

const FilterForm = (props) => {

  let filterTypes = ["Content name", "Folder name", "Author", "Creation date"];

  let allowedOperators = {
    "Content name" : ["IS LIKE", "IS NOT LIKE", "IS", "IS NOT"],
    "Folder name" : ["IS LIKE", "IS NOT LIKE", "IS", "IS NOT"],
    "Author" : ["IS", "IS NOT"],
    "Creation date" : ["ON", "<", "<=", ">", ">="]
  }
  
  const [filters, setFilters] = useState([{ type: "Content name", operator: "IS LIKE", value: null}]);

  function handleChange(i, event, field) {
    const values = [...filters];
    if (field == "type") {
      values[i].type = event.target.value;
      values[i].operator = allowedOperators[event.target.value][0];
      if (values[i].type == "Creation date") values[i].value = "2020-01-01T00:00";
      else values[i].value = "";
    } else if (field == "operator") {
      values[i].operator = event.target.value;
    } else {
      values[i].value = event.target.value;
    }
    setFilters(values);
  }

  function handleAdd() {
    const values = [...filters];
    values.push({ type: "Content name", operator: "IS LIKE", value: null});
    setFilters(values);
  }

  function handleRemove(i) {
    const values = [...filters];
    if (values.length != 1) {
      values.splice(i, 1);
    }
    setFilters(values);
  }

  function handleSearch() {
    const values = [...filters];
    props.loadFilteredContent(values);
    props.togglePanel();
  }

  return (
    props.show && 
    <div id="filterForm">
      <button id="addFilterButton" type="button" onClick={() => handleAdd()}> + </button>
      {filters.map((filter, idx) => {
        return (
          <div className="filter" key={`${filter}-${idx}`}>
            <select className="filterSelectInput" onChange={e => handleChange(idx, e, "type")} value={filter.type}>
              {filterTypes.map(filterType => {
                return <option key={"filterType" + Math.random() * 50} value={filterType}>{filterType}</option>
              })}
            </select>
            <select className="filterSelectInput" onChange={e => handleChange(idx, e, "operator")} value={filter.operator}>
              {allowedOperators[filter.type].map(operator => {
                return <option key={"filterType" + Math.random() * 50} value={operator}>{operator}</option>
              })}
            </select>
            { filter.type == "Creation date" ?
            <input type="datetime-local" id="meeting-time"
              className="filterValueInput"
              name="meeting-time" onChange={e => handleChange(idx, e, "value")}
              value={filter.value || "2020-01-01T00:00"}
              ></input>
            :
            <input
              type="text"
              className="filterValueInput"
              placeholder={filter.type == "Author" ? "Username/Last or First Name" : ""}
              value={filter.value || ""}
              onChange={e => handleChange(idx, e, "value")}
            />
            }
            <button id="removeFilterButton" type="button" onClick={() => handleRemove(idx)}>
              X
            </button>
          </div>
        );
      })}
      <button id="applyFilterButton" type="button" onClick={() => handleSearch()}> Apply Filters </button>
    </div>
  );
}

class UrlForm extends React.Component {
  static defaultProps = {
    selectedUrl: null,
    selectedUrlInfo: null
  }

  constructor(props) {
    super(props);
    this.state = {
      edited: "",
      title: "",
      url: "",
      description: "",
      usesDoenetAPI: false
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  componentDidMount() {
    if (this.props.mode == "edit_url" && this.props.selectedUrlInfo !== null) {
      this.setState({
        title: this.props.selectedUrlInfo.title,
        url: this.props.selectedUrlInfo.url,
        description: this.props.selectedUrlInfo.description,
        usesDoenetAPI: this.props.selectedUrlInfo.usesDoenetAPI
      });
    }
  }

  handleChange(event) {
    // set edited to true once any input is detected
    this.setState({ edited: true });
    let name = event.target.name;
    let value = event.target.value;
    if (event.target.type == "checkbox") {
      value = event.target.checked;
    }
    this.setState({[name]: value});
  }

  handleSubmit(event) {
    if (this.props.mode == "add_url") {
      let urlId = nanoid();
      event.preventDefault();
      this.props.handleNewUrlCreated({
        urlId: urlId,
        title: this.state.title,
        url: this.state.url,
        description: this.state.description,
        usesDoenetAPI: this.state.usesDoenetAPI
        }, () => {
          this.props.handleBack();
        });
    } else {
      this.props.saveUrl({
        urlId: this.props.selectedUrl,
        title: this.state.title,
        url: this.state.url,
        description: this.state.description,
        usesDoenetAPI: this.state.usesDoenetAPI
      });
    }
  }

  handleBack() {
    // popup confirm dialog if form is edited
    if (this.state.edited) {
      if (!window.confirm('All of your input will be discarded, are you sure you want to proceed?')) {
        return;
      }
    }
    this.props.handleBack(this.props.mode);
  }

  render() {
    
    return (
      <div id="formContainer">
        <div id="formTopbar">
          <div id="formBackButton" onClick={this.handleBack} data-cy="urlFormBackButton">
            <FontAwesomeIcon icon={faArrowCircleLeft} style={{"fontSize":"17px", "marginRight":"5px"}}/>
            <span>Back to Chooser</span>
          </div>          
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="formGroup-12">
            <label className="formLabel">TITLE</label>
            <input className="formInput" required type="text" name="title" value={this.state.title}
              placeholder="Doenet Homepage" onChange={this.handleChange} data-cy="urlFormTitleInput"/>
          </div>
          <div className="formGroup-12" >
            <label className="formLabel">URL</label>
            <input className="formInput" required type="text" name="url" value={this.state.url}
            placeholder="https://www.doenet.org/" onChange={this.handleChange} data-cy="urlFormUrlInput"/>
          </div>
          <div className="formGroup-12">
            <label className="formLabel">DESCRIPTION</label>
            <textarea className="formInput" type="text" name="description" value={this.state.description}
              placeholder="URL description here" onChange={this.handleChange} data-cy="urlFormDescInput"/>
          </div>
          <div className="formGroup-12" >
            <label className="formLabel" style={{"display":"inline-block"}}>Uses DoenetML</label>
            <input className="formInput" type="checkbox" name="usesDoenetAPI" checked={this.state.usesDoenetAPI}
            onChange={this.handleChange} data-cy="urlFormUsesDoenetAPICheckbox" style={{"width":"auto", "marginLeft":"7px"}}/>
          </div>
          <div id="formButtonsContainer">
            <button id="formSubmitButton" type="submit" data-cy="urlFormSubmitButton">
              <div className="formButtonWrapper">
                { this.props.mode == "add_url" ?
                  <React.Fragment>
                    <span>Add New URL</span>
                    <FontAwesomeIcon icon={faPlusCircle} style={{"fontSize":"20px", "color":"#fff", "cursor":"pointer", "marginLeft":"8px"}}/>
                  </React.Fragment>                  
                  : 
                  <React.Fragment>
                    <span>Save Changes</span>
                    <FontAwesomeIcon icon={faSave} style={{"fontSize":"20px", "color":"#fff", "cursor":"pointer", "marginLeft":"8px"}}/>
                  </React.Fragment>
                }
              </div>              
            </button>
            <button id="formCancelButton" onClick={this.handleBack} data-cy="urlFormCancelButton">
              <div className="formButtonWrapper">
                <span>Cancel</span>
                <FontAwesomeIcon icon={faTimesCircle} style={{"fontSize":"20px", "color":"#fff", "cursor":"pointer", "marginLeft":"8px"}}/>
              </div>
            </button>
          </div>          
        </form>
      </div>  
    );
  }
}

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
    let itemIcon = <FontAwesomeIcon icon={faDotCircle} style={{"fontSize":"18px", "color":"#737373"}}/>;

    if (this.props.selectedItems.length === 0) {
      // handle when no file selected, show folder/drive info
      selectedItemType = "Drive";
      if (this.props.selectedDrive === "Courses") {
        itemTitle = this.props.allCourseInfo[this.props.selectedCourse].courseName;
      } else {
        itemTitle = "Content";
      }

      this.buildInfoPanelDriveDetails();
    } else {
      // if file selected, show selectedFile/Folder info
      selectedItemId = this.props.selectedItems[this.props.selectedItems.length - 1];
      selectedItemType = this.props.selectedItemsType[this.props.selectedItemsType.length - 1];

      // get title
      if (selectedItemType === "folder") {
        itemTitle = this.props.allFolderInfo[selectedItemId].title;
        itemIcon = this.props.allFolderInfo[selectedItemId].isRepo ?
          <FontAwesomeIcon icon={faFolder} style={{"fontSize":"18px", "color":"#3aac90"}}/> :
          <FontAwesomeIcon icon={faFolder} style={{"fontSize":"18px", "color":"#737373"}}/>;
      } else if (selectedItemType === "url") {
        itemTitle = this.props.allUrlInfo[selectedItemId].title;
      } else {
        itemTitle = this.props.allContentInfo[selectedItemId].title;
        itemIcon = <FontAwesomeIcon icon={faFileAlt} style={{"fontSize":"18px", "color":"#3D6EC9"}}/>;
      }

      this.buildInfoPanelItemDetails(selectedItemId, selectedItemType);  
    }
    
    this.infoPanel = <React.Fragment>
      <div className="infoPanel">
        <div className="infoPanelTitle">
          <div className="infoPanelItemIcon">{itemIcon}</div>
          <span>{ itemTitle }</span>
        </div>
        <div className="infoPanelPreview">
          <span>Preview</span>
          <FontAwesomeIcon icon={faFileAlt} style={{"fontSize":"100px", "color":"#bfbfbf"}}/>
        </div>
        <div className="infoPanelDetails">
          {this.infoPanelDetails}
        </div>
      </div>
    </React.Fragment>
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
        "Owner" : "Me",
        "Course Code" : courseCode,
        "Term": term,
        "Department": department,
        "Section": section,
        "Description": description, 
      }; 
    } else {
      itemDetails = {
        "Owner" : "Me",
        "Modified" : "Today",
        "Published" : "Today",
      };
    }

    Object.keys(itemDetails).map(itemDetailsKey => {
      let itemDetailsValue = itemDetails[itemDetailsKey];
      this.infoPanelDetails.push(
      <tr key={"contentDetailsItem" + itemDetailsKey}>
        <td className="itemDetailsKey">{ itemDetailsKey }</td>
        <td className="itemDetailsValue">{ itemDetailsValue }</td>
      </tr>);
    })

    this.infoPanelDetails = <React.Fragment>
      <table id="infoPanelDetailsTable">
        <tbody>
          {this.infoPanelDetails}
        </tbody>
      </table>
      {this.props.selectedDrive === "Courses" &&
      <div id="editContentButtonContainer">
        <div id="editContentButton" data-cy="editContentButton"
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
        "Location"  : "Content",
        "Published" : formatTimestamp(this.props.allFolderInfo[selectedItemId].publishDate),
      };

      let isShared = this.props.allFolderInfo[this.props.allFolderInfo[selectedItemId].rootId].isRepo;
      if (this.props.allFolderInfo[selectedItemId].isRepo || isShared) {
        itemDetails = Object.assign(itemDetails, {"Public": this.props.allFolderInfo[selectedItemId].isPublic ? "Yes" : "No"});
      }
      // show change to public button if private repo
      if (this.props.allFolderInfo[selectedItemId].isRepo && !this.props.allFolderInfo[selectedItemId].isPublic) {
        itemDetails["Public"] = <React.Fragment>
            <span>No</span><button id="publicizeRepoButton" onClick={() => this.props.publicizeRepo(selectedItemId)}>Make Public</button>
        </React.Fragment>
      }
      //Display controls for who it's shared with
      let sharedJSX = null;
      if (this.props.allFolderInfo[selectedItemId].isRepo){
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
        for (let userInfo of this.props.allFolderInfo[selectedItemId].user_access_info){
          let removeAccess = <span>Owner</span>;
          if (userInfo.owner === "0"){
            removeAccess = <button onClick={()=>{
              const loadCoursesUrl='/api/removeRepoUser.php';
              const data={
                repoId: selectedItemId,
                username: userInfo.username,
              }
              const payload = {
                params: data
              }
      
              axios.get(loadCoursesUrl,payload)
              .then(resp=>{
                if (resp.data.success === "1"){
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
          <input type="text" value={this.addUsername[selectedItemId]} onChange={(e)=>{
            e.preventDefault();
            
            this.addUsername[selectedItemId] = e.target.value;
            // console.log(e.target.value);
            // console.log(this.addUsername);

          }}></input>
        <button onClick={()=>{
          const loadCoursesUrl='/api/addRepoUser.php';
        const data={
          repoId: selectedItemId,
          username: this.addUsername[selectedItemId],
        }
        const payload = {
          params: data
        }

        axios.get(loadCoursesUrl,payload)
        .then(resp=>{
          if (resp.data.success === "1"){
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
          <td className="itemDetailsKey">{ itemDetailsKey }</td>
          <td className="itemDetailsValue">{ itemDetailsValue }</td>
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
          <div style={{"display":"block"}} key={"relatedItem" + relatedItemBranchID}>
            <FontAwesomeIcon icon={faFileAlt} style={{"fontSize":"14px", "color":"#3D6EC9", "marginRight": "10px"}}/>
            <a href={`/editor?branchId=${relatedItemBranchID}`}>{ relatedItemTitle }</a>
          </div>                      
        ); 
      });

      // build content versions
      let versions = [];
      let versionNumber = 1;
      // get and format versions
      this.props.allContentInfo[selectedItemId].contentIds.reverse().forEach(contentIdObj => {
        if (contentIdObj.draft !== "1") {
          let versionTitle = "Version " + versionNumber++;
          versions.push(
            <div style={{"display":"block"}} key={"version" + versionNumber}>
              <FontAwesomeIcon icon={faFileAlt} style={{"fontSize":"14px", "color":"#3D6EC9", "marginRight": "10px"}}/>
              <a href={`/editor?branchId=${selectedItemId}&contentId=${contentIdObj.contentId}`}>{ versionTitle }</a>
            </div>
          ); 
        } 
      });

      itemDetails = {
        "Location" : "Content",
        "Published" : formatTimestamp(this.props.allContentInfo[selectedItemId].publishDate),
        "Versions" : versions,
        // "Related content" : relatedContent,
      };

      let isShared = this.props.allContentInfo[selectedItemId].rootId == "root" ? false :
        this.props.allFolderInfo[this.props.allContentInfo[selectedItemId].rootId].isRepo;

      if (isShared) {
        itemDetails = Object.assign(itemDetails, {"Public": this.props.allContentInfo[selectedItemId].isPublic ? "Yes" : "No"});
      }

      Object.keys(itemDetails).map(itemDetailsKey => {
        let itemDetailsValue = itemDetails[itemDetailsKey];
        this.infoPanelDetails.push(
        <tr key={"contentDetailsItem" + itemDetailsKey}>
          <td className="itemDetailsKey">{ itemDetailsKey }</td>
          <td className="itemDetailsValue">{ itemDetailsValue }</td>
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
          onClick={()=> {window.location.href=`/editor?branchId=${selectedItemId}`}}>
            <FontAwesomeIcon icon={faEdit} style={{"fontSize":"20px", "color":"#43aa90"}}/>
            <span>Edit Draft</span>
          </div>
        </div> 
      </React.Fragment>
    } else {
      itemDetails = {
        "Location" : "Content",
        "Published" : formatTimestamp(this.props.allUrlInfo[selectedItemId].publishDate),
        "Description" : this.props.allUrlInfo[selectedItemId].description,
        "Uses DoenetAPI" : this.props.allUrlInfo[selectedItemId].usesDoenetAPI == true ? "Yes" : "No",
      };

      let isShared = this.props.allUrlInfo[selectedItemId].rootId == "root" ? false :
        this.props.allFolderInfo[this.props.allUrlInfo[selectedItemId].rootId].isRepo;

      if (isShared) {
        itemDetails = Object.assign(itemDetails, {"Public": this.props.allUrlInfo[selectedItemId].isPublic ? "Yes" : "No"});
      }

      Object.keys(itemDetails).map(itemDetailsKey => {
        let itemDetailsValue = itemDetails[itemDetailsKey];
        this.infoPanelDetails.push(
        <tr key={"contentDetailsItem" + itemDetailsKey}>
          <td className="itemDetailsKey">{ itemDetailsKey }</td>
          <td className="itemDetailsValue">{ itemDetailsValue }</td>
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
            <FontAwesomeIcon icon={faEdit} style={{"fontSize":"20px", "color":"#43aa90"}}/>
            <span>Edit Link</span>
          </div>
        </div> 
      </React.Fragment>
    }
  }

  render() {
    this.buildInfoPanel();
    return(<React.Fragment>
      {this.infoPanel}
    </React.Fragment>);
  };
}


export default DoenetChooser;