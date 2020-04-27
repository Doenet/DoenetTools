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
import DoenetCourseOutline from './DoenetCourseOutline';
import styled from 'styled-components';
import { ToastContext, useToasts, ToastProvider } from './ToastManager';


class DoenetChooser extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      error: null,
      errorInfo: null,
      selectedDrive: "Content",
      selectedCourse: null,

      showNewButtonMenu: false,
      activeSection: "chooser",
    };

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
  }

  buildCourseList() {
    this.courseList = [];
    for(let courseId of this.props.data.dataLists.courseIds){
      let courseCode = this.props.data.dataInfo.courseInfo[courseId].courseCode;

      let classes = (this.state.selectedDrive === "Courses") && (courseId === this.state.selectedCourse) ? 
                      "leftNavPanelMenuItem activeLeftNavPanelMenuItem": "leftNavPanelMenuItem";
      this.courseList.push(
        <li className={classes} 
            key={"course" + courseId}
            style={{"padding":"6px 1px 6px 5px","width": "90%"}}
            onClick={() => this.selectDrive("Courses", courseId)}>
            <FontAwesomeIcon className="menuDoughnutIcon" icon={faDotCircle}/>
            <span>{courseCode}</span>
            {this.props.appState.selectedItems.length !== 0 &&
            <div className="addContentToCourseButtonWrapper">
              {this.state.selectedDrive !== "Courses" && 
                <FontAwesomeIcon icon={faPlus} className="addContentButton"
                onClick={() => this.addContentToCourse(courseId, this.props.appState.selectedItems, this.props.appState.selectedItemsType)}/>}
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
        toolbarTitle = this.props.data.dataInfo.courseInfo[this.state.selectedCourse].courseCode + ' - '
        + this.props.data.dataInfo.courseInfo[this.state.selectedCourse].courseName;
      }  else if (this.state.selectedDrive === "Global") {
        toolbarTitle = <React.Fragment>
            <FilterPanel loadFilteredContent={this.loadFilteredContent}/>
          </React.Fragment>
      }

    } else if (this.state.activeSection === "add_course") {
      toolbarTitle = "Add New Course";
    } else if (this.state.activeSection === "edit_course") {
      toolbarTitle = "Edit Course - " + this.props.data.dataInfo.courseInfo[this.state.selectedCourse].courseCode;
    } else if (this.state.activeSection === "add_url") {
      toolbarTitle = "Add New URL";
    } else if (this.state.activeSection === "edit_url") {
      toolbarTitle = "Edit URL - " + this.props.data.dataInfo.urlInfo[this.props.appState.selectedItems[0]].title;
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
    while (Object.values(this.props.data.dataInfo.contentInfo).filter(content => content.title.includes(title)).length != 0) {
      num++;
      title = "Untitled Document " + num; 
    }

    this.saveContentToServer({
      documentName:title,
      code:"",
      branchId:newBranchId,
      publish:true
    }, (branchId) => {
      this.props.methods.loadUserContentBranches(() => {
        // if not in base dir, add document to current folder
        if (this.props.appState.directoryStack.length !== 0) {
          let currentFolderId = this.props.appState.directoryStack[this.props.appState.directoryStack.length - 1];
          this.addContentToFolder([branchId], ["content"], currentFolderId);
        } else {
          this.saveUserContent([branchId], ["content"], "insert"); // add to user root
        }
      
        // set as selected and redirect to /editor 
        this.setState({
          activeSection: "chooser",
          selectedDrive: "Content"
        }, () => {
          // this.forceUpdate();   
          this.updateNumber++;
          setTimeout(function(){ window.location.href=`/editor?branchId=${branchId}`;}, 500);
        });
        this.props.methods.updateDirectoryStack([]);
        this.props.methods.updateSelectedItems({
          selectedItems: [branchId],
          selectedItemsType: ["content"]
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
            this.props.methods.loadUserUrls();
          });        
        } else {
          this.saveUserContent([urlId], ["url"], "insert", () => {  // add to user root
            this.props.methods.loadUserUrls(() => {
              this.setState({
                activeSection: "chooser",
                selectedDrive: "Content"
              }, () => { 
                this.updateNumber++;
              });
              this.props.methods.updateSelectedItems({
                selectedItems: [urlId],
                selectedItemsType: ["url"]
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
        this.props.methods.loadCourseContent(courseId, () => {
          this.setState({
            activeSection: "chooser",
          });
          this.props.methods.updateSelectedItems({
            selectedItems: [],
            selectedItemsType: []
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
        activeSection: "chooser",
        selectedDrive: drive,
        selectedCourse: courseId,
      });
      this.updateIndexedDBCourseContent(courseId);
      this.props.methods.loadCourseContent(courseId);
    } else if (drive === "Global") {
      this.setState({
        activeSection: "chooser",
        selectedDrive: drive,
      });
      this.props.data.dataLists.contentIds = [];
      this.props.data.dataLists.folderIds = [];
      this.props.data.dataLists.urlIds = [];
    } else {
      this.setState({
        activeSection: "chooser",
        selectedDrive: drive
      }, () => {
        this.props.methods.loadUserContentBranches();
        this.props.methods.loadUserFoldersAndRepo();
        this.props.methods.loadUserUrls();
      });
    }
    this.props.methods.updateSelectedItems({
      selectedItems: [],
      selectedItemsType: []
    });
    this.props.methods.updateDirectoryStack([]);
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
    let parentId = this.props.data.dataInfo.folderInfo[folderId] ? this.props.data.dataInfo.folderInfo[folderId].parentId : currentFolderId;
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

  addNewFolder(title) {
    // generate new folderId
    let folderId = nanoid();

    // check if parent folder is private or isPublic
    let isPublic = false;
    if (this.state.directoryStack.length != 0  // not in root
      && this.props.data.dataInfo.folderInfo[this.state.directoryStack[0]].isRepo  // in repo
      && this.props.data.dataInfo.folderInfo[this.state.directoryStack[0]].isPublic) {  // in public repo
      isPublic = true;
    }

    this.saveFolder(folderId, title, [], [], "insert", false, isPublic, () => {
      // if not in base dir, add folder to current folder
      if (this.state.directoryStack.length !== 0) {
        let currentFolderId = this.state.directoryStack[this.state.directoryStack.length - 1];
        this.addContentToFolder([folderId], ["folder"], currentFolderId, () => {
          this.props.methods.loadUserFoldersAndRepo(() => {
            this.setState({
              activeSection: "chooser",
              selectedDrive: "Content"
            }, () => { 
              this.updateNumber++;
            });
            this.props.methods.updateSelectedItems({
              selectedItems: [folderId],
              selectedItemsType: ["folder"]
            });
          });
        });        
      } else {
        this.saveUserContent([folderId], ["folder"], "insert", () => {  // add to user root
          this.props.methods.loadUserFoldersAndRepo(() => {
            this.setState({
              activeSection: "chooser",
              selectedDrive: "Content"
            }, () => { 
              this.updateNumber++;
            });
            this.props.methods.updateSelectedItems({
              selectedItems: [folderId],
              selectedItemsType: ["folder"]
            });
          });
        });  
      }
    });
  }

  addContentToRepo(childIds, childType, repoId) {
    let isPublic = this.props.data.dataInfo.folderInfo[repoId].isPublic;

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
          if (!this.props.data.dataInfo.folderInfo[childId].isPublic) {
            this.modifyPublicState(isPublic, [].concat(this.flattenFolder(childId).itemIds),
              [].concat(this.flattenFolder(childId).itemType));
            itemsToBeAdded.push(childId);
            typeOfItemsToBeAdded.push("folder");
          } else {
            this.displayToast(`Public content cannot be made private: ${this.props.data.dataInfo.folderInfo[childId].title}`);
          }
        } else if (childType[i] == "content") {
          // check if public
          if (!this.props.data.dataInfo.contentInfo[childId].isPublic) {
            this.modifyPublicState(isPublic, [childId], ["content"]);
            itemsToBeAdded.push(childId);
            typeOfItemsToBeAdded.push("content");
          } else {
            this.displayToast(`Public content cannot be made private: ${this.props.data.dataInfo.contentInfo[childId].title}`);
          }
        } else if (childType[i] == "url") {
          // check if public
          if (!this.props.data.dataInfo.urlInfo[childId].isPublic) {
            this.modifyPublicState(isPublic, [childId], ["url"]);
            itemsToBeAdded.push(childId);
            typeOfItemsToBeAdded.push("url");
          } else {
            this.displayToast(`Public content cannot be made private: ${this.props.data.dataInfo.folderInfo[childId].title}`);
          }
        }
      });
      this.addContentToFolder(itemsToBeAdded, typeOfItemsToBeAdded, repoId);
    }
  }

  addContentToFolder(childIds, childType, folderId, callback=(()=>{})) {
    let operationType = "insert";
    let title = this.props.data.dataInfo.folderInfo[folderId].title;
    let isRepo = this.props.data.dataInfo.folderInfo[folderId].isRepo;
    let isPublic = this.props.data.dataInfo.folderInfo[folderId].isPublic;


    this.saveFolder(folderId, title, childIds, childType, operationType, isRepo, isPublic, (folderId) => {
      // creating new folder
      //    in a folder ~ set childItem.rootId = folderId.rootId
      //    at root ~ addContentToFolder not invoked
      // moving into folder
      //    from another root ~ set childItem.rootId = folderId.rootId
      //    from same root ~ set childItem.rootId = folderId.rootId
      if (this.props.data.dataInfo.folderInfo[folderId].parentId == "root") { 
        this.saveUserContent(childIds, childType, "remove");
      }
      let itemIds = [];
      childIds.forEach(childId => {
          itemIds = itemIds.concat(this.flattenFolder(childId).itemIds);
      });
      
      this.modifyFolderChildrenRoot(this.props.data.dataInfo.folderInfo[folderId].rootId, itemIds, () => {
        this.props.methods.loadUserFoldersAndRepo();
        this.props.methods.loadUserContentBranches();
        this.props.methods.loadUserUrls();
        callback();
      });
    });
  }

  removeContentFromFolder(childIds, childType, folderId, callback=(()=>{})) {
    let operationType = "remove";
    let title = this.props.data.dataInfo.folderInfo[folderId].title;
    let isRepo = this.props.data.dataInfo.folderInfo[folderId].isRepo;
    let isPublic = this.props.data.dataInfo.folderInfo[folderId].isPublic;

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
      if (this.props.data.dataInfo.folderInfo[folderId].parentId == "root") {
        this.saveUserContent(childIds, childType, "insert");
        childIds.forEach(folderAtRoot => {
          this.modifyFolderChildrenRoot(folderAtRoot, [].concat(this.flattenFolder(folderAtRoot).itemIds), () => {
          });
        });
      }
      this.props.methods.loadUserContentBranches();
      this.props.methods.loadUserFoldersAndRepo();
      this.props.methods.loadUserUrls();
      // this.forceUpdate();
      callback();
    });
  }

  publicizeRepo(repoId) {
    // display alert message
    if (window.confirm('This change is irreversible, proceed?')) {
      let repoChildren = [];
      let repoChildrenType = [];

      this.props.data.dataInfo.folderInfo[repoId].childFolders.forEach((childId, i) => {
        repoChildren = repoChildren.concat(this.flattenFolder(childId).itemIds);
        repoChildrenType = repoChildrenType.concat(this.flattenFolder(childId).itemType);
      });
      this.props.data.dataInfo.folderInfo[repoId].childContent.forEach((childId, i) => {
        repoChildren.push(childId);
        repoChildrenType.push("content");
      });
      this.props.data.dataInfo.folderInfo[repoId].childUrls.forEach((childId, i) => {
        repoChildren.push(childId);
        repoChildrenType.push("url");
      });
      this.modifyPublicState(true, [repoId].concat(repoChildren), ["folder"].concat(repoChildrenType), () => {
        this.props.methods.loadUserFoldersAndRepo();
        this.props.methods.loadUserContentBranches();
        this.props.methods.loadUserUrls();
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
      this.props.data.dataInfo.folderInfo[folderId].isRepo, this.props.data.dataInfo.folderInfo[folderId].isPublic, () => {
      this.props.methods.loadUserFoldersAndRepo();
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
    if (!this.props.data.dataInfo.folderInfo[folderId]) {
      let currItemType =  this.props.data.dataInfo.contentInfo[folderId] === undefined ? "url" : "content";
      return {itemIds: [folderId], itemType: [currItemType]};
    }

    let itemIds = [folderId]; 
    let itemType = ["folder"];
    this.props.data.dataInfo.folderInfo[folderId].childFolders.forEach((childFolderId) => {
      itemIds = itemIds.concat(this.flattenFolder(childFolderId).itemIds);
      itemType = itemType.concat(this.flattenFolder(childFolderId).itemType);
    })
    this.props.data.dataInfo.folderInfo[folderId].childContent.forEach((childContentId) => {
      itemIds.push(childContentId);
      itemType.push("content");
    })
    this.props.data.dataInfo.folderInfo[folderId].childUrls.forEach((childUrlId) => {
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
    while (Object.values(this.props.data.dataInfo.folderInfo).filter(folder => 
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
        this.props.methods.loadUserFoldersAndRepo(() => {
          this.setState({
            activeSection: "chooser",
            selectedDrive: "Content"
          }, () => { 
            this.updateNumber++;
          });
          this.props.methods.updateSelectedItems({
            selectedItems: [folderId],
            selectedItemsType: ["folder"]
          });
          this.props.methods.updateDirectoryStack([]);
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
    this.props.methods.updateSelectedItems({
      selectedItems: directoryData,
      selectedItemsType: ["folder"]
    });
    this.props.methods.updateDirectoryStack(directoryData);
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
        courseContent: this.props.data.dataInfo.courseInfo[courseId].content,
        courseFolders: this.props.data.dataInfo.courseInfo[courseId].folders,
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
      this.props.data.dataInfo.contentInfo = Object.assign({}, this.props.data.dataInfo.contentInfo, resp.data.branchId_info);
      this.props.data.dataLists.contentIds = resp.data.sort_order;
      this.branches_loaded = true;
      this.forceUpdate();
    })
    .catch(function (error) {
      this.setState({error:error});
    })
  }

  // loadHeadingsAndAssignments() {
  //   const url = "/api/getHeaderAndAssignmentInfo.php";
  //   const data = {
  //     courseId: "aI8sK4vmEhC5sdeSP3vNW"
  //   }
  //   const payload = {
  //     params: data
  //   }
  //   axios.get(url, payload).then(resp=>{
  //     this.headingsInfo = {};
  //     this.assignmentsInfo = {};
  //     Object.keys(resp.data).map(itemId => {
  //         // console.log(resp.data[itemId]["name"]);
  //       if (resp.data[itemId]["attribute"] == "header") {
  //         this.headingsInfo[itemId] = resp.data[itemId];
  //         // process children
  //         for (let i in resp.data[itemId]["childrenId"]) {
  //           let childId = resp.data[itemId]["childrenId"][i];
  //           if (childId == "") continue;
  //           if (resp.data[childId]["attribute"] == "header") {
  //             this.headingsInfo[itemId]["headingId"].push(childId);
  //           } else {
  //             this.headingsInfo[itemId]["assignmentId"].push(childId);
  //           }
  //         }
  //       } else {
  //         this.assignmentsInfo[itemId] = resp.data[itemId];
  //       }
  //     })
  //     this.assignments_and_headings_loaded = true;
  //     this.forceUpdate();
  //   }).catch(error =>{
  //     this.setState({error:error})
  //   }); 
  // }

  updateHeadingsAndAssignments(headingsInfo, assignmentsInfo) {
    this.headingsInfo = headingsInfo;
    this.assignmentsInfo = assignmentsInfo;
    this.saveTree(this.headingsInfo, this.assignmentsInfo);
  }

  saveTree(headingsInfo, assignmentsInfo){
    let assignmentId_parentID_array = [];
    let assignmentId_array = Object.keys(assignmentsInfo)
    assignmentId_array.forEach(id=>{
      assignmentId_parentID_array.push(assignmentsInfo[id]['parent']);
    })
    let headerID_array = Object.keys(headingsInfo);
    let headerID_array_to_payload = []
    let headerID_childrenId_array_to_payload=[]
    let headerID_parentId_array_to_payload = []
    let headerID_name = []
    headerID_array.forEach(currentHeaderId=>{
      let currentHeaderObj=headingsInfo[currentHeaderId]
      let name = currentHeaderObj['name']
      if (name==null){
        name="NULL"
      }
      let currentHeaderObjHeadingIdArray = currentHeaderObj['headingId']
      let lengthOfHeadingId = currentHeaderObjHeadingIdArray.length
      let currentHeaderObjAssignmentIdArray = currentHeaderObj['assignmentId']
      let currentHeaderObjParentId = currentHeaderObj['parent']
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

  render(){
    const { data, flags } = this.props;

    if (!flags.courses_loaded || !flags.assignments_and_headings_loaded){
      return <div style={{display:"flex",justifyContent:"center",alignItems:"center", height:"100vh"}}>
                <SpinningLoader/>
             </div>
    }
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

    let tempTree = <CourseOutlineFrame>
      <TreeView 
          headingsInfo={this.props.data.dataInfo.courseHeadingsInfo} 
          assignmentsInfo={this.props.data.dataInfo.courseAssignmentsInfo} 
          currentDraggedObject={this.props.appState.currentDraggedObject}
          onDragStart={this.props.methods.onDragStart}
          onDragEnd={this.props.methods.onDragEnd}
          onDraggableDragOver={this.props.methods.onTreeDraggableDragOver} 
          onDropEnter={this.props.methods.onDropEnter}
          onDrop={this.props.methods.onDrop} />
      <DoenetCourseOutline 
          treeHeadingsInfo={data.dataInfo.courseHeadingsInfo} 
          treeAssignmentsInfo={data.dataInfo.courseAssignmentsInfo} 
          updateHeadingsAndAssignments={this.updateHeadingsAndAssignments}/>
    </CourseOutlineFrame>

    return tempTree;

    // return <DoenetCourseOutline 
    //   treeHeadingsInfo={data.dataInfo.courseHeadingsInfo} 
    //   treeAssignmentsInfo={data.dataInfo.courseAssignmentsInfo} 
    //   updateHeadingsAndAssignments={this.updateHeadingsAndAssignments}/>

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
                          selectedCourseInfo={this.props.data.dataInfo.courseInfo[this.state.selectedCourse]}
                          />;
    } else if (this.state.activeSection === "add_url" || this.state.activeSection === "edit_url") {
      this.mainSection = <UrlForm 
                          mode={this.state.activeSection}
                          handleBack={this.toggleManageUrlForm}
                          handleNewUrlCreated={this.handleNewUrlCreated}
                          saveUrl={this.saveUrl}
                          selectedUrl={this.props.appState.selectedItems[this.props.appState.selectedItems.length - 1]}
                          selectedUrlInfo={this.props.data.dataInfo.urlInfo[this.props.appState.selectedItems[this.props.appState.selectedItems.length - 1]]}
                          />;
    }
    else {
      let folderList = [];
      let contentList = [];
      let urlList = [];
      if (this.state.selectedDrive == "Content" || this.state.selectedDrive == "Global") {
        folderList = this.props.data.dataLists.folderIds;
        contentList = this.props.data.dataLists.contentIds;
        urlList = this.props.data.dataLists.urlIds;
      } else if (this.state.selectedDrive == "Courses") {
        folderList = this.props.data.dataInfo.courseInfo[this.state.selectedCourse].folders;
        contentList = this.props.data.dataInfo.courseInfo[this.state.selectedCourse].content;
        urlList = this.props.data.dataInfo.courseInfo[this.state.selectedCourse].urls;
      }
      this.mainSection = <React.Fragment>
        <DoenetBranchBrowser
          loading={!this.props.flags.folders_loaded || !this.props.flags.branches_loaded || !this.props.flags.urls_loaded}
          allContentInfo={this.props.data.dataInfo.contentInfo}
          allFolderInfo={this.props.data.dataInfo.folderInfo}
          allUrlInfo={this.props.data.dataInfo.urlInfo}
          folderList={folderList}
          contentList={contentList}
          urlList={urlList}
          ref={this.browser}                                      // optional
          key={"browser"+this.updateNumber}                       // optional
          selectedDrive={this.state.selectedDrive}                // optional
          selectedCourse={this.state.selectedCourse}              // optional
          allCourseInfo={this.props.data.dataInfo.courseInfo}                         // optional
          updateSelectedItems={this.props.methods.updateSelectedItems}          // optional
          updateDirectoryStack={this.props.methods.updateDirectoryStack}        // optional
          addContentToFolder={this.addContentToFolder}            // optional
          addContentToRepo ={this.addContentToRepo}               // optional
          removeContentFromCourse={this.removeContentFromCourse}  // optional
          removeContentFromFolder={this.removeContentFromFolder}  // optional                  
          directoryData={this.state.directoryStack}               // optional
          selectedItems={this.props.appState.selectedItems}                // optional
          selectedItemsType={this.props.appState.selectedItemsType}        // optional
          renameFolder={this.renameFolder}                        // optional
          openEditCourseForm={() => this.toggleManageCourseForm("edit_course")} // optional
          publicizeRepo={this.publicizeRepo}                      // optional
          openEditUrlForm={() => this.toggleManageUrlForm("edit_url")}
        />
      </React.Fragment>
    }

    // const CourseOutlineFrame = styled('div')`
    //   display: flex;
    //   flex-direction: row;
    //   justify-content: left;
    //   align-items: left;
    //   text-align: left;
    //   padding: 2em;
    //   overflow-y: scroll;
    //   overflow-x: hidden;
    //   grid-row: 2 / 3;
    //   grid-column: 3 / 4;
    //   transform: scale(1.2);
    //   transform-origin: top left;
    //   margin-top: 15px;
    //   `

    // let tempTree = <CourseOutlineFrame>
    //   <TreeView 
    //       headingsInfo={this.props.data.dataInfo.courseHeadingsInfo} 
    //       assignmentsInfo={this.props.data.dataInfo.courseAssignmentsInfo} 
    //       currentDraggedObject={this.props.appState.currentDraggedObject}
    //       onDragStart={this.props.methods.onDragStart}
    //       onDragEnd={this.props.methods.onDragEnd}
    //       onDraggableDragOver={this.props.methods.onTreeDraggableDragOver} 
    //       onDropEnter={this.props.methods.onDropEnter}
    //       onDrop={this.props.methods.onDrop} />
    // </CourseOutlineFrame>

    return (<React.Fragment>
      <DoenetHeader toolTitle="Chooser" headingTitle={"Choose Branches"} />
      <ToastProvider>
        <div id="chooserContainer">
          <this.ToastWrapper/>
          { this.leftNavPanel }
          { this.topToolbar }
          { this.mainSection }
          { tempTree }
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


export default DoenetChooser;