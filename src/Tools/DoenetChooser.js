import React, { Component, useState } from 'react';
import axios from 'axios';
import crypto from 'crypto';
import nanoid from 'nanoid';
import "./chooser.css";
import "../imports/doenet.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus, faDotCircle, faFileAlt, faEdit,
  faChalkboard, faArrowCircleLeft, faTimesCircle, faPlusCircle, faFolder, faSave,
  faLink, faAlignJustify, faStream, faColumns, faFolderOpen, faInfoCircle,
   faChevronDown, faChevronRight
}
  from '@fortawesome/free-solid-svg-icons';
import IndexedDB from '../services/IndexedDB';
import DoenetBranchBrowser from './DoenetBranchBrowser';
import SpinningLoader from './SpinningLoader';
import { TreeView } from './TreeView/TreeView';
import Accordion from "../imports/Accordion";
import Overlay from "../imports/Overlay";
import styled from 'styled-components';
import { ToastContext, useToasts, ToastProvider } from './ToastManager';
import ChooserConstants from './chooser/ChooserConstants';
import InfoPanel from './chooser/InfoPanel';
import {
  SwitchableContainers,
  SwitchableContainer,
  SwitchableContainerPanel,
} from './chooser/SwitchableContainer';
import DoenetEditor from "./DoenetEditor";
import ToolLayout from "./ToolLayout/ToolLayout";
import ToolLayoutPanel from "./ToolLayout/ToolLayoutPanel";
import SplitLayoutPanel from "./ToolLayout/SplitLayoutPanel";
import DropDownSelect from '../imports/PanelHeaderComponents/DropDownSelect';
import ButtonGroup from '../imports/PanelHeaderComponents/ButtonGroup';

import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  useParams
} from "react-router-dom";
import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';

const getUrlVars = () => {
  var vars = {};
  var params = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, val) => vars[key] = val);
  return vars
}

class DoenetChooser extends Component {

  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor(props) {
    super(props);

    const queryParams = getUrlVars()
    this.state = {
      error: null,
      errorInfo: null,
      modalOpen: queryParams['overlay'] === "true",
      selectedDrive: "Content",
      modalHeaderTitle: "Untitled",
      selectedCourse: null,
      selectedItems: [],
      selectedItemsType: [],
      showNewButtonMenu: false,
      activeSection: "chooser",
      directoryStack: [],
      splitPanelDirectoryStack: [],
      splitPanelSelectedItems: [],
      splitPanelSelectedItemsType: [],
      currentDraggedObject: { id: null, type: null, sourceContainerId: null, dataObject: null, sourceParentId: null },
      splitPanelCurrentDraggedObject: { id: null, type: null, sourceContainerId: null, dataObject: null, sourceParentId: null },
      panelsCollection: { "first": { values: ["browser", "tree"], activeContainer: "browser" } },
      splitPanelsCollection: { "second": { values: ["browser", "tree"], activeContainer: "browser" } },
      splitPanelLayout: false,
      courseActiveChild: false,
      contentActiveChild: false,
      userFolderInfo: {}
    };


    this.containerCache = {};
    this.cachedCurrentDraggedObject = null;
    this.lastDroppedContainerId = null;
    this.validDrop = true;
    this.selectedBranchId = queryParams['branchId'] || '';
    this.selectedContentId = (queryParams['contentId'] && queryParams['contentId'] !== 'content') ? queryParams['contentId'] : '';

    this.courseFolderInfo = {};
    this.courseContentInfo = {};
    this.courseUrlInfo = {};
    this.headingsInfo = {};
    this.assignmentsInfo = {};

    this.loadUserContentBranches();
    this.loadUserFoldersAndRepo();
    this.loadUserUrls();
    this.loadAllCourses();
    this.loadUserProfile();

    this.branches_loaded = false;
    this.courses_loaded = false;
    this.folders_loaded = false;
    this.urls_loaded = false;
    this.assignments_and_headings_loaded = true;
    this.userContentReloaded = false;

    this.updateNumber = 0;

    this.browser = React.createRef();
    this.browserSec = React.createRef();



    this.onBrowserDragStart = this.onBrowserDragStart.bind(this);
    this.onSplitPanelBrowserFolderDrop = this.onSplitPanelBrowserFolderDrop.bind(this);
    this.toggleSplitPanel = this.toggleSplitPanel.bind(this);
    this.goToFolder = this.goToFolder.bind(this);
    this.splitPanelGoToFolder = this.splitPanelGoToFolder.bind(this);
    this.handleSplitPanelDropdownCallback = this.handleSplitPanelDropdownCallback.bind(this);
    this.splitPanelUpdateSelectedItems = this.splitPanelUpdateSelectedItems.bind(this);
    this.splitPanelUpdateDirectoryStack = this.splitPanelUpdateDirectoryStack.bind(this);
    this.onSplitPanelBrowserDragStart = this.onSplitPanelBrowserDragStart.bind(this);
    this.onSplitPanelBrowserDragEnd = this.onSplitPanelBrowserDragEnd.bind(this);
    this.handleContentItemDoubleClick = this.handleContentItemDoubleClick.bind(this);
    this.tempSet = new Set();
    this.customizedTempSet = new Set();
    this.history = null
  }

  buildCourseList = () => {
    this.courseList = [];
    for (let courseId of this.courseIds) {
      let courseCode = this.courseInfo[courseId].courseCode;

      let classes = (this.state.selectedDrive === "Courses") && (courseId === this.state.selectedCourse) ?
        "leftNavPanelMenuItem activeLeftNavPanelMenuItem" : "leftNavPanelMenuItem";
      this.courseList.push(
        <li className={classes}
          key={"course" + courseId}
          style={{ "padding": "6px 1px 6px 5px", "width": "90%" }}
          onClick={() => this.selectDrive("Courses", courseId)}>
          <FontAwesomeIcon className="menuDoughnutIcon" icon={faDotCircle} />
          <span>{courseCode}</span>
          {this.state.selectedItems.length !== 0 &&
            <div className="addContentToCourseButtonWrapper">
              {this.state.selectedDrive !== "Courses" &&
                <FontAwesomeIcon icon={faPlus} className="addContentButton"
                  onClick={() => this.addContentToCourse(courseId, this.state.selectedItems, this.state.selectedItemsType)} />}
            </div>}
        </li>
      );
    }
  }

  buildLeftNavPanel = () => {
    this.leftNavPanel = <React.Fragment>
      <div className="leftNavPanel">
        <div id="leftNavPanelMenu">
          <div className={"Content" === this.state.selectedDrive ?
            "leftNavPanelMenuItem activeLeftNavPanelMenuItem" : "leftNavPanelMenuItem"}
            onClick={() => { this.selectDrive("Content") }}>
            <FontAwesomeIcon className="menuDoughnutIcon" icon={faDotCircle} />
            <span>Content</span>
          </div>
          <div className="leftNavPanelMenuItem">
            <Accordion>
              <div label="Courses">
                <ul style={{ "paddingLeft": "20px", "margin": "5px 0 0 0" }}>
                  {this.courseList}
                </ul>
              </div>
            </Accordion>
          </div>
          <div className={"Global" === this.state.selectedDrive ?
            "leftNavPanelMenuItem activeLeftNavPanelMenuItem" : "leftNavPanelMenuItem"}
            onClick={() => { this.selectDrive("Global") }}>
            <FontAwesomeIcon className="menuDoughnutIcon" icon={faDotCircle} />
            <span>Global</span>
          </div>
        </div>
      </div>
    </React.Fragment>
  }

  buildTopToolbar = () => {
    let toolbarTitle = "";

    if (this.state.activeSection === "chooser") {
      // show selectedDrive if chooser is active
      if (this.state.selectedDrive === "Content") {
        toolbarTitle = this.state.selectedDrive;
      } else if (this.state.selectedDrive === "Courses") {
        toolbarTitle = this.courseInfo[this.state.selectedCourse].courseCode + ' - '
          + this.courseInfo[this.state.selectedCourse].courseName;
      } else if (this.state.selectedDrive === "Global") {
        toolbarTitle = <React.Fragment>
          <FilterPanel loadFilteredContent={this.loadFilteredContent} />
        </React.Fragment>
      }
    }

    this.topToolbar = <React.Fragment>
      <div id="topToolbar">
        <span>{toolbarTitle}</span>
      </div>
    </React.Fragment>
  }

  handleNewDocument = () => {

    if (!Object.keys(this.props.cookies["cookies"]).includes("JWT_JS")) {
      this.displayToast("Please sign in to create new content");
      return;
    }

    let newBranchId = nanoid();
    let title = "Untitled Document";
    // let num = 1;
    // let title = "Untitled Document " + num;
    // console.log('branchId_info',this.branchId_info)
    //   while ( Object.values(this.branchId_info).filter(content => content.title.includes(title)).length != 0 ) {
    //     num++;
    //     title = "Untitled Document " + num;
    //   }

    let currentFolderId = this.state.directoryStack.length == 0 ? "root" : this.state.directoryStack[this.state.directoryStack.length - 1];

    Promise.all([
      new Promise(resolve => this.saveContentToServer({
        documentName: title,
        code: "",
        branchId: newBranchId,
        publish: true
      }, () => { resolve() })),
      new Promise(resolve => this.saveUserContent([newBranchId], ["content"], "insert", () => { resolve() })),
      new Promise(resolve => this.addContentToFolder([newBranchId], ["content"], currentFolderId, () => { resolve() })),
    ])
    .then(() => {
      this.loadUserContentBranches(() => {
        // set as selected
        this.setState({
          // directoryStack: [], //Why go to root?
          selectedItems: [newBranchId],
          selectedItemsType: ["content"],
          activeSection: "chooser",
          selectedDrive: "Content"
        });
      })      
    })  
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

  toggleFormModal = (mode) => {
    let modeTitleMap = {
      [ChooserConstants.CREATE_COURSE_MODE]: "Add New Course",
      [ChooserConstants.EDIT_COURSE_INFO_MODE]: `Edit Course Info}`,
      [ChooserConstants.CREATE_URL_MODE]: "Add New URL",
      [ChooserConstants.EDIT_URL_INFO_MODE]: `Edit URL Info`
    }
    const { location: { pathname = '' } } = this.history
    this.history.push(`${pathname}?overlay=true&${mode}`);
    this.setState({ modalOpen: !this.state.modalOpen, activeSection: mode });  
  }

  handleNewCourseCreated = ({courseId, courseName, courseCode, term, description, department, section}, callback=(()=>{})) => {
    if (!Object.keys(this.props.cookies["cookies"]).includes("JWT_JS")) {
      this.displayToast("Please sign in to create new course");
      return;
    }

    // TODO: add user to course instructor

    // // create new documents for overview and syllabus, get branchIds
    // let overviewId = nanoid();
    // let overviewDocumentName = courseName + " Overview";

    // let syllabusId = nanoid();
    // let syllabusDocumentName = courseName + " Syllabus";

    Promise.all([
      // new Promise(resolve => this.saveContentToServer({
      //   documentName: overviewDocumentName,
      //   code: "",
      //   branchId: overviewId,
      //   publish: true
      // }, () => { resolve() })),
      // new Promise(resolve => this.saveContentToServer({
      //   documentName: syllabusDocumentName,
      //   code: "",
      //   branchId: syllabusId,
      //   publish: true
      // }, () => { resolve() })),
      // new Promise(resolve => this.addContentToCourse(courseId, [overviewId, syllabusId], ["content", "content"], () => { resolve() })),
      // new Promise(resolve => this.saveUserContent([overviewId, syllabusId], ["content", "content"], "insert", () => { resolve() }))
      new Promise(resolve => this.saveCourse({
        courseName: courseName,
        courseId: courseId,
        courseCode: courseCode,
        term: term,
        description: description,
        department: department,
        section: section,
        overviewId: "",
        syllabusId: ""
      }, () => { resolve() })),
    ])
      .then(() => {
        console.log("HERERERERERERREEEEEEEE!!!!!!!!!!!!!!!")
        this.loadAllCourses(() => {
          this.selectDrive("Courses", courseId);
          this.forceUpdate();
        })
        callback();
      })
  }

  toggleManageUrlForm = (mode) => {
    if (this.state.activeSection !== mode) {
      this.setState({ activeSection: mode });
    } else {
      this.setState({ activeSection: "chooser" });
    }
  }

  handleNewUrlCreated = ({urlId, title, url, description, usesDoenetAPI}, callback=(()=>{})) => {
    if (!Object.keys(this.props.cookies["cookies"]).includes("JWT_JS")) {
      this.displayToast("Please sign in to create new content");
      return;
    }
    const currentFolderId = this.state.directoryStack.length == 0 ? "root" : this.state.directoryStack[this.state.directoryStack.length - 1];
    Promise.all([
      new Promise(resolve => this.saveUrl({
        urlId: urlId,
        title: title,
        url: url,
        description: description,
        usesDoenetAPI: usesDoenetAPI
      }, () => { resolve() })),
      new Promise(resolve => this.saveUserContent([urlId], ["url"], "insert", () => { resolve() })), // add to user root
      new Promise(resolve => this.addContentToFolder([urlId], ["url"], currentFolderId, () => { resolve() })), // add url to current folder
    ])
      .then(() => {
        this.loadUserUrls(() => {
          this.setState({
            selectedItems: [urlId],
            selectedItemsType: ["url"],
            activeSection: "chooser",
            selectedDrive: "Content"
          });
        });
        callback();
      })
  }

  saveUrl = ({ urlId, title, url, description, usesDoenetAPI }, callback = (() => { })) => {
    const apiUrl = '/api/saveUrl.php';
    const data = {
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
        this.setState({ error: error });
      })
  }

  loadUserUrls = (callback = (() => { })) => {
    this.urls_loaded = false;

    const loadUserUrlsUrl = '/api/loadUserUrls.php';
    const payload = {};

    axios.get(loadUserUrlsUrl, payload)
      .then(resp => {
        this.urlInfo = Object.assign({}, this.urlInfo, resp.data.urlInfo);
        this.userUrlInfo = resp.data.urlInfo;
        this.urlIds = resp.data.urlIds;
        this.urls_loaded = true;
        this.userContentReloaded = true;
        callback();
        this.forceUpdate();
      });
  }

  loadUserContentBranches = (callback = (() => { })) => {
    this.branches_loaded = false;

    let currentFolderId = this.state.directoryStack.length === 0 ?
      "root" : this.state.directoryStack[this.state.directoryStack.length - 1];

    const data = { folderId: currentFolderId };
    const payload = { params: data };

    const loadBranchesUrl = '/api/loadUserContent.php';

    axios.get(loadBranchesUrl, payload)
      .then(resp => {
        console.log(resp)
        this.branchId_info = Object.assign({}, this.branchId_info, resp.data.branchId_info);
        this.userContentInfo = resp.data.branchId_info;
        this.sort_order = resp.data.sort_order;
        this.branches_loaded = true;
        this.userContentReloaded = true;
        callback();
        this.forceUpdate();
      });
  }

  saveContentToServer = ({ documentName, code, branchId, publish = false }, callback = (() => { })) => {
    const url = '/api/saveContent.php';
    let ID = this.getContentId({ code: code }) //get contentid
    const data = {
      title: documentName,
      doenetML: code,
      branchId: branchId,
      contentId: ID,
      author: this.props.username,
      publish: publish,
      change_title_not_code: true,
    }
    axios.post(url, data)
      .then(() => {
        callback(branchId);
      })
      .catch(function (error) {
        this.setState({ error: error });
      })
  }

  getContentId = ({ code }) => {
    const hash = crypto.createHash('sha256');
    if (code === undefined) {
      return;
    }

    hash.update(code);
    let contentId = hash.digest('hex');
    return contentId;
  }

  saveCourse = ({ courseId, courseName, courseCode, term, description, department, section, overviewId, syllabusId }, callback = (() => { })) => {
    const url = '/api/saveCourse.php';
    const data = {
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
        this.setState({ error: error });
      })
  }

  loadAllCourses = (callback = (() => { })) => {

    const loadCoursesUrl = '/api/loadAllCourses.php';
    const data = {
    }
    const payload = {
      params: data
    }

    axios.get(loadCoursesUrl, payload)
      .then(resp => {
        // console.log("loadcourses:",resp.data)
        // this.courseInfo = resp.data.courseInfo;
        // this.courseIds = resp.data.courseIds;
         this.courseInfo = {};
        this.courseIds = [];
        callback();
        this.courses_loaded = true;
        this.forceUpdate();
      });

    // this.courseInfo = [];
    // this.courseIds = [];
      
    // callback();
  }

  loadCourseContent = (courseId, callback = (() => { })) => {
    this.folders_loaded = false;
    this.branches_loaded = false;
    this.url_loaded = false;
    const loadCoursesUrl = '/api/loadCourseContent.php';
    const data = {
      courseId: courseId
    }
    const payload = {
      params: data
    }

    axios.get(loadCoursesUrl, payload)
      .then(resp => {
        this.branchId_info = Object.assign({}, this.branchId_info, resp.data.branchInfo);
        this.urlInfo = Object.assign({}, this.urlInfo, resp.data.urlInfo);
        this.folderInfo = Object.assign({}, this.folderInfo, resp.data.folderInfo);
        this.courseContentInfo = Object.assign({}, this.courseContentInfo, { [courseId]: resp.data.branchInfo });
        this.courseFolderInfo = Object.assign({}, this.courseFolderInfo, { [courseId]: resp.data.folderInfo });
        this.courseUrlInfo = Object.assign({}, this.courseUrlInfo, { [courseId]: resp.data.urlInfo });
        this.folders_loaded = true;
        this.branches_loaded = true;
        this.url_loaded = true;
        callback();
        this.forceUpdate();
      });
  }

  saveCourseContent = (courseId, itemIds, itemTypes, operationType, callback = (() => { })) => {
    const url = '/api/saveCourseContent.php';
    const data = {
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
        this.setState({ error: error });
      })
  }

  selectDrive = (drive, courseId = null) => {
    if (drive === "Courses") {
      this.setState({
        selectedItems: [],
        selectedItemsType: [],
        activeSection: "chooser",
        selectedDrive: drive,
        selectedCourse: courseId,
        directoryStack: []
      });
      // this.folders_loaded = false;
      // this.branches_loaded = false;
      this.updateIndexedDBCourseContent(courseId);
      // this.loadCourseContent(courseId);
      this.loadCourseHeadingsAndAssignments(courseId);
    } else if (drive === "Global") {
      this.setState({
        selectedItems: [],
        selectedItemsType: [],
        activeSection: "chooser",
        selectedDrive: drive,
        directoryStack: []
      });
      this.sort_order = [];
      this.folderIds = [];
      this.urlIds = [];
    } else {
      this.setState({
        selectedItems: [],
        selectedItemsType: [],
        activeSection: "chooser",
        selectedDrive: drive,
        directoryStack: []
      }, () => {
        this.loadUserContentBranches();
        this.loadUserFoldersAndRepo();
        this.loadUserUrls();
      });
    }
    // this.updateNumber++;
  }

  addContentToCourse = (courseId, itemIds, itemTypes, callback = () => { }) => {
    let operationType = "insert";
    this.saveCourseContent(courseId, itemIds, itemTypes, operationType, (courseId) => {
      this.loadAllCourses(() => {
        this.selectDrive("Courses", courseId);
        callback();
      });
    });
  }

  removeContentFromCourse = (itemIds) => {
    let operationType = "remove";
    let courseId = this.state.selectedCourse;
    this.saveCourseContent(courseId, itemIds, [], operationType, (courseId) => {
      this.loadAllCourses();
    });
  }

  saveFolder = (folderId, title, childContent, childType, operationType, isRepo, isPublic, callback = (() => { })) => {
    // get current directory folderId/root
    let currentFolderId = this.state.directoryStack.length == 0 ? "root" : this.state.directoryStack[this.state.directoryStack.length - 1];
    // setup parent
    let parentId = this.folderInfo[folderId] ? this.folderInfo[folderId].parentId : currentFolderId;
    if (isRepo) parentId = "root";  // repo always at root

    const url = '/api/saveFolder.php';
    const data = {
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
        callback(resp);
      })
      .catch(function (error) {
        this.setState({ error: error });
      })
  }

  saveContentTree = ({ folderInfo, callback = (() => { }) }) => {
    const url = '/api/saveContentTree.php';
    const data = {
      folderInfo: folderInfo
    }
    axios.post(url, data)
      .then((resp) => {
        callback();
      })
      .catch(function (error) {
        this.setState({ error: error });
      });
  }

  loadUserFoldersAndRepo = (callback = (() => { })) => {
    this.folders_loaded = false;

    const loadUserFoldersAndRepoUrl = '/api/loadUserFoldersAndRepo.php';
    const payload = {};

    axios.get(loadUserFoldersAndRepoUrl, payload)
      .then(resp => {
        // console.log(resp)
        this.folderInfo = Object.assign({}, this.folderInfo, resp.data.folderInfo);
        this.folderIds = resp.data.folderIds;
        this.userFolderInfo = resp.data.folderInfo;
        this.folders_loaded = true;
        // console.log("here", this.folderInfo)
        this.userContentReloaded = true;
        callback();
        this.forceUpdate();
      });
  }

  addNewFolder = (title) => {
    // generate new folderId
    let folderId = nanoid();

    // check if parent folder is private or isPublic
    let isPublic = false;
    if (this.state.directoryStack.length != 0  // not in root
      && this.folderInfo[this.state.directoryStack[0]].isRepo  // in repo
      && this.folderInfo[this.state.directoryStack[0]].isPublic) {  // in public repo
      isPublic = true;
    }

    const currentFolderId = this.state.directoryStack.length == 0 ? "root" : this.state.directoryStack[this.state.directoryStack.length - 1];
    Promise.all([
      new Promise(resolve => this.saveFolder(folderId, title, [], [], "insert", false, isPublic, () => { resolve() })), // add new folder
      new Promise(resolve => this.saveUserContent([folderId], ["folder"], "insert", () => { resolve() })),  // add to user root
      new Promise(resolve => this.addContentToFolder([folderId], ["folder"], currentFolderId, () => { resolve() })) // add to folder
    ]).then(() => {
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
    })
  }

  addContentToRepo = (childIds, childType, repoId) => {
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

  addContentToFolder = (childIds, childType, folderId, callback = (() => { })) => {
    let operationType = "insert";
    let title = this.folderInfo[folderId].title;
    let isRepo = this.folderInfo[folderId].isRepo;
    let isPublic = this.folderInfo[folderId].isPublic;

    const getDataObjects = (itemType) => {
      let data = {};
      switch (itemType) {
        case "content":
          data = {
            "idList": this.sort_order,
            "info": this.branchId_info,
            "folderChildList": "childContent"
          }
          break;
        case "folder":
          data = {
            "idList": this.folderIds,
            "info": this.folderInfo,
            "folderChildList": "childFolders"
          }
          break;
        case "url":
          data = {
            "idList": this.urlIds,
            "info": this.urlInfo,
            "folderChildList": "childUrls"
          }
          break;
      }
      return data;
    }

    // check if moving item out of public repo 
    const itemDataInfo = getDataObjects(childType[0])["info"]
    if (itemDataInfo[childIds[0]] != undefined) {
      const firstParentId = itemDataInfo[childIds[0]].parentId;
      const movingOutOfPublicRepo = this.folderInfo[firstParentId].isRepo &&
        this.folderInfo[firstParentId].isPublic &&
        folderId == "root";

      if (movingOutOfPublicRepo) {
        this.displayToast(`Public content cannot be made private`);
        return; // public -> private not allowed
      }
    }

    // filter selected repos in childIds
    let filteredChildIds = [], filteredChildType = [];
    for (let i = 0; i < childIds.length; i++) {
      if (childType[i] == "folder" && itemDataInfo[childIds[i]]["isRepo"]) {
        const repoTitle = itemDataInfo[childIds[i]]["title"];
        this.displayToast(`Failed to move '${repoTitle}': Item of type Repository must be at root directory`);
      } else {
        filteredChildIds.push(childIds[i]);
        filteredChildType.push(childType[i]);
      }
    }
    
    this.saveFolder(folderId, title, filteredChildIds, filteredChildType, operationType, isRepo, isPublic, (resp) => {
      // creating new folder
      //    in a folder ~ set childItem.rootId = folderId.rootId
      //    at root ~ addContentToFolder not invoked
      // moving into folder
      //    from another root ~ set childItem.rootId = folderId.rootId
      //    from same root ~ set childItem.rootId = folderId.rootId
      if (resp.status != 200) return;
      for (let i = 0; i < filteredChildIds.length; i++) {
        let childId = filteredChildIds[i];
        let childDataObject = getDataObjects(filteredChildType[i]);
        let childDataInfo = childDataObject["info"];
        let childDataIdList = childDataObject["idList"];
        let childListKey = childDataObject["folderChildList"]
        // not new item
        if (childDataObject["info"][childId] != undefined) {
          let originalParent = childDataInfo[childId].parentId;
          let originalIndex = this.folderInfo[originalParent][childListKey].indexOf(childId);
          this.folderInfo[originalParent][childListKey].splice(originalIndex, 1);
          this.folderInfo[folderId][childListKey].push(childId);
          childDataInfo[childId].parentId = folderId;
          if (folderId == "root") childDataIdList.push(childId);
          if (originalParent == "root") {
            let index = childDataIdList.indexOf(childId);
            childDataIdList.splice(index, 1);
          }
        } else {
          this.folderInfo[folderId][childListKey].push(childId);
          if (folderId == "root") childDataIdList.push(childId);
        }
      }
      this.userContentReloaded = true;

      let allItems = { itemIds: [], itemType: [] };
      filteredChildIds.forEach(childId => {
        let res = this.flattenFolder(childId);
        allItems.itemIds = allItems.itemIds.concat(res.itemIds);
        allItems.itemType = allItems.itemType.concat(res.itemType);
      });

      this.modifyFolderChildrenRoot(this.folderInfo[folderId].rootId, allItems.itemIds, () => {
        for (let i = 0; i < allItems.itemIds.length; i++) {
          let currentItemType = allItems.itemType[i];
          let currentItemId = allItems.itemIds[i];
          let childDataObject = getDataObjects(currentItemType);
          let childDataInfo = childDataObject["info"];
          if (childDataInfo[currentItemId]) {
            childDataInfo[currentItemId].rootId = this.folderInfo[folderId].rootId;
          } else {
            this.loadUserContentBranches();
            this.loadUserFoldersAndRepo();
            this.loadUserUrls();
          }
        }
        this.modifyPublicState(isPublic, allItems.itemIds, allItems.itemType, () => {});
        this.forceUpdate();
        callback();
      });
    });
  }

  removeContentFromFolder = (childIds, childType, folderId, callback = (() => { })) => {
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

    this.saveFolder(folderId, title, childIds, childType, operationType, isRepo, isPublic, (resp) => {
      // within same root ~ set childItem.rootId = folderId.rootId (unchanged)
      // to diff root ~ set childItem.rootId = folderId.rootId (changed)
      // to root ~ set childItem.rootId = childItem.id
      if (this.folderInfo[folderId].parentId == "root") {
        for (let i = 0; i < childIds.length; i++) {
          if (childType[i] == "folder") {
            this.modifyFolderChildrenRoot(childIds[i], [].concat(this.flattenFolder(childIds[i]).itemIds));
          } else {
            this.modifyFolderChildrenRoot("root", [childIds[i]]);
          }
        }
      }
      this.loadUserContentBranches();
      this.loadUserFoldersAndRepo();
      this.loadUserUrls();
      // this.forceUpdate();
      callback();
    });
  }

  publicizeRepo = (repoId) => {
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

  modifyPublicState = (isPublic, itemIds, itemType, callback = (() => { })) => {
    const url = '/api/modifyPublicState.php';
    const data = {
      isPublic: isPublic,
      itemIds: itemIds,
      itemType: itemType
    }
    axios.post(url, data)
      .then((resp) => {
        callback();
      })
      .catch(function (error) {
        this.setState({ error: error });
      })
  }

  renameFolder = (folderId, newTitle) => {
    this.saveFolder(folderId, newTitle, [], [], "",
      this.folderInfo[folderId].isRepo, this.folderInfo[folderId].isPublic, () => {
        this.loadUserFoldersAndRepo();
      });
  }

  modifyFolderChildrenRoot = (newRoot, itemIds, callback = (() => { })) => {
    const url = '/api/modifyFolderChildrenRoot.php';
    const data = {
      newRoot: newRoot,
      itemIds: itemIds
    }
    axios.post(url, data)
      .then((resp) => {
        callback(resp);
      })
      .catch(function (error) {
        this.setState({ error: error });
      })
  }

  flattenFolder = (folderId) => {
    if (!this.folderInfo[folderId]) {
      let currItemType = this.branchId_info[folderId] === undefined ? "url" : "content";
      return { itemIds: [folderId], itemType: [currItemType] };
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
    return { itemIds: itemIds, itemType: itemType };
  }

  saveUserContent = (childIds, childType, operationType, callback = (() => { })) => {
    const url = '/api/saveUserContent.php';
    const data = {
      childIds: childIds,
      childType: childType,
      operationType: operationType
    }
    axios.post(url, data)
      .then(resp => {
        callback();
      })
      .catch(function (error) {
        this.setState({ error: error });
      })
  }

  handleNewFolder = () => {
    
    if (!Object.keys(this.props.cookies["cookies"]).includes("JWT_JS")) {
      this.displayToast("Please sign in to create new folder");
      return;
    }

    let title = "New Folder";

    // TODO: let user input folder title
    // let num = 1;
    // let title = "New Folder " + num;
    // while (Object.values(this.folderInfo).filter(folder =>
    //   folder.title && folder.title.includes(title)).length != 0) {
    //   num++;
    //   title = "New Folder " + num;
    // }
    this.displayToast("New folder created.");
    this.addNewFolder(title);
  }

  handleNewRepo = () => {
    if (!Object.keys(this.props.cookies["cookies"]).includes("JWT_JS")) {
      this.displayToast("Please sign in to create new repository");
      return;
    }
    // TODO: let user input repo title
    let title = "New Repository"
    this.addNewRepo(title);
  }

  addNewRepo = (title) => {
    let folderId = nanoid();
    Promise.all([
      new Promise(resolve => this.saveFolder(folderId, title, [], [], "insert", true, false, () => { resolve() })),
      new Promise(resolve => this.grantRepoAccess({repoId: folderId, email: this.userProfile["email"], owner: true, callback: ()=>{ resolve() }}))
    ])
      .then(() => {
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
      })
  }

  modifyRepoAccess = (folderId, operationType, owner = false, callback = (() => { })) => {
    const url = '/api/modifyRepoAccess.php';
    const data = {
      repoId: folderId,
      operationType: operationType,
      owner: owner
    }
    axios.post(url, data)
      .then(resp => {
        callback();
      })
      .catch(function (error) {
        this.setState({ error: error });
      })
  }

  jumpToDirectory = (directoryData) => {
    this.setState({
      directoryStack: directoryData,
      selectedItems: directoryData,
      selectedItemsType: ["folder"],
    })
  }

  getFolderPath(id, foldersInfo) {
    let path = [id];
    let flag = true;
    while (flag) {
      if (foldersInfo[id].parentId !== 'root') {
        path.unshift(foldersInfo[id].parentId);
      } else {
        flag = false;
      }
      id = foldersInfo[id].parentId;
    }
    return path;
  }

  goToFolder(id, foldersInfo) {
    const path = this.getFolderPath(id, foldersInfo);
    this.setState({
      directoryStack: path,
      selectedItems: path,
      selectedItemsType: ["folder"],
    })
  }

  splitPanelGoToFolder(id, foldersInfo) {
    const path = this.getFolderPath(id, foldersInfo);
    this.setState({
      splitPanelDirectoryStack: path,
      splitPanelSelectedItems: path,
      splitPanelSelectedItemsType: ["folder"],
    })
  }

  handleSplitPanelDropdownCallback(child) {
    this.setState({
      splitPanelDirectoryStack: child.path,
      splitPanelSelectedItems: child.path,
      splitPanelSelectedItemsType: ["folder"],
    })
  }

  updateSelectedItems = (selectedItems, selectedItemsType) => {
    this.setState({
      selectedItems: selectedItems,
      selectedItemsType: selectedItemsType,
    })
    this.tempSet = new Set([selectedItems[selectedItems.length - 1]]);
  }

  handleContentItemDoubleClick([branchId], contentId) {
    const { directoryStack } = this.state
    this.selectedBranchId = branchId;
    this.selectedContentId = null;    
    // console.log("branchid", branchId , "contentId" , contentId);
    const contentIdParam = contentId ? `&contentId=${contentId}` : '';
    const path = directoryStack.join('/')
    this.history.push(`/content/${path}?overlay=true&branchId=${branchId}${contentIdParam}`)
    this.setState({ modalOpen: true , activeSection:""});  
  }

  versionCallback = (e, branchId, contentId) => {
    const { location: { pathname = '' } } = this.history
    // console.log('this.props:', pathname, branchId, contentId)
    this.selectedBranchId = branchId;
    this.selectedContentId = contentId;
    const contentIdParam = contentId ? `&contentId=${contentId}` : ''
    this.history.push(`${pathname}?overlay=true&branchId=${branchId}${contentIdParam}`)
    this.setState({ modalOpen: true, activeSection: "" });
  }

  splitPanelUpdateSelectedItems(selectedItems, selectedItemsType) {
    this.setState({
      splitPanelSelectedItems: selectedItems,
      splitPanelSelectedItemsType: selectedItemsType,
    })
    this.tempSet = new Set([selectedItems[selectedItems.length - 1]]);
  }

  updateDirectoryStack = (directoryStack) => {
    // console.log(this.history);
    this.setState({
      directoryStack: directoryStack
    })
  }

  splitPanelUpdateDirectoryStack(directoryStack) {
    this.setState({
      splitPanelDirectoryStack: directoryStack

    })
  }

  getAllSelectedItems = () => {
    this.browser.current.getAllSelectedItems();
  }

  updateIndexedDBCourseContent = (courseId) => {
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

  loadFilteredContent = (filters, callback = (() => { })) => {

    const typeToSQLMap = {
      "Folder name": "title",
      "Content name": "title",
      "Author": "author",
      "Creation date": "timestamp"
    }
    const operatorsToSQLMap = {
      "IS": "=",
      "IS NOT": "!=",
      "IS LIKE": "LIKE",
      "IS NOT LIKE": "NOT LIKE",
      "ON": "=",
      "<": "<",
      "<=": "<=",
      ">": ">",
      ">=": ">="
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

    const url = '/api/loadFilteredContent.php';
    const data = {
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
        this.setState({ error: error });
      })
  }

  loadCourseHeadingsAndAssignments = (courseId) => {
    this.assignments_and_headings_loaded = false;
    const url = "/api/getHeaderAndAssignmentInfo.php";
    const data = {
      courseId: courseId
    }
    const payload = {
      params: data
    }
    axios.get(url, payload).then(resp => {
      let tempHeadingsInfo = {};
      let tempAssignmentsInfo = {};
      let tempUrlsInfo = {};
      Object.keys(resp.data).map(itemId => {
        if (resp.data[itemId]["type"] == "folder") {
          tempHeadingsInfo[itemId] = resp.data[itemId];
          tempHeadingsInfo[itemId]["type"] = "folder";
          tempHeadingsInfo[itemId]["isRepo"] = false;
          if (itemId == "root") tempHeadingsInfo[itemId]["title"] = `${this.courseInfo[courseId]["courseCode"]} Assignments`;
          // process children
          for (let i in resp.data[itemId]["childrenId"]) {
            let childId = resp.data[itemId]["childrenId"][i];
            if (childId == "") continue;
            if (resp.data[childId]["type"] == "folder") {
              tempHeadingsInfo[itemId]["childFolders"].push(childId);
            } else if (resp.data[childId]["type"] == "content") {
              tempHeadingsInfo[itemId]["childContent"].push(childId);
            } else {
              tempHeadingsInfo[itemId]["childUrls"].push(childId);
            }
          }
        } else if (resp.data[itemId]["type"] == "content") {
          tempAssignmentsInfo[itemId] = resp.data[itemId];
          tempAssignmentsInfo[itemId]["type"] = "content";
        }
      })
      this.headingsInfo = Object.assign({}, this.headingsInfo, { [courseId]: tempHeadingsInfo });
      this.assignmentsInfo = Object.assign({}, this.assignmentsInfo, { [courseId]: tempAssignmentsInfo });
      this.assignments_and_headings_loaded = true;
      this.forceUpdate();
    }).catch(error => {
      this.setState({ error: error })
    });
  }

  updateHeadingsAndAssignments = (headingsInfo, assignmentsInfo) => {
    this.headingsInfo = headingsInfo;
    this.assignmentsInfo = assignmentsInfo;
    this.saveAssignmentsTree(this.headingsInfo, this.assignmentsInfo);
  }

  saveAssignmentsTree = ({ courseId, headingsInfo, assignmentsInfo, callback = (() => { }) }) => {
    let assignmentId_parentID_array = [];
    let assignmentId_array = Object.keys(assignmentsInfo)
    assignmentId_array.forEach(id => {
      assignmentId_parentID_array.push(assignmentsInfo[id]['parentId']);
    })
    let headerID_array = Object.keys(headingsInfo);
    let headerID_array_to_payload = []
    let headerID_childrenId_array_to_payload = []
    let headerID_parentId_array_to_payload = []
    let headerID_name = []
    headerID_array.forEach(currentHeaderId => {
      let currentHeaderObj = headingsInfo[currentHeaderId]
      let name = currentHeaderObj['title']
      if (name == null) {
        name = "NULL"
      }
      let currentHeaderObjHeadingIdArray = currentHeaderObj['childFolders']
      let lengthOfHeadingId = currentHeaderObjHeadingIdArray.length
      let currentHeaderObjAssignmentIdArray = currentHeaderObj['childContent']
      let currentHeaderObjParentId = currentHeaderObj['parentId']
      let lengthOfAssigmentId = currentHeaderObjAssignmentIdArray.length
      let iterator = 0
      if (lengthOfHeadingId == 0 && lengthOfAssigmentId == 0) {
        headerID_array_to_payload.push(currentHeaderId)
        if (currentHeaderObjParentId == null) {
          headerID_parentId_array_to_payload.push("NULL")
        } else {
          headerID_parentId_array_to_payload.push(currentHeaderObjParentId)
        }
        headerID_childrenId_array_to_payload.push("NULL")
        headerID_name.push(name);
      }
      while (iterator < lengthOfHeadingId) {
        headerID_array_to_payload.push(currentHeaderId)
        headerID_childrenId_array_to_payload.push(currentHeaderObjHeadingIdArray[iterator])
        headerID_name.push(name);
        if (currentHeaderObjParentId == null) {
          headerID_parentId_array_to_payload.push("NULL")
        } else {
          headerID_parentId_array_to_payload.push(currentHeaderObjParentId)
        }
        iterator += 1
      }
      iterator = 0
      while (iterator < lengthOfAssigmentId) {
        headerID_array_to_payload.push(currentHeaderId)
        headerID_childrenId_array_to_payload.push(currentHeaderObjAssignmentIdArray[iterator])
        headerID_name.push(name);
        if (currentHeaderObjParentId == null) {
          headerID_parentId_array_to_payload.push("NULL")
        } else {
          headerID_parentId_array_to_payload.push(currentHeaderObjParentId)
        }
        iterator += 1
      }
    })
    const urlGetCode = '/api/saveTree.php';
    const data = {
      assignmentId_array: assignmentId_array,
      assignmentId_parentID_array: assignmentId_parentID_array,
      headerID_array_to_payload: headerID_array_to_payload,
      headerID_name: headerID_name,
      headerID_parentId_array_to_payload: headerID_parentId_array_to_payload,
      headerID_childrenId_array_to_payload: headerID_childrenId_array_to_payload,
      courseId: courseId
    }
    axios.post(urlGetCode, data)
      .then(resp => {
        callback();
      })
      .catch(error => { this.setState({ error: error }) });
  }

  ToastWrapper = () => {
    const { add } = useToasts();
    this.addToast = add;
    return <React.Fragment></React.Fragment>
  }

  displayToast = (message) => {
    this.addToast(message);
  }

  onTreeDragStart = (draggedId, draggedType, sourceContainerId, sourceContainerType) => {
    ////console.log("onTreeDragStart")
    ////console.log(draggedId, draggedType, sourceContainerId, sourceContainerType)
    // get dataObjectSource
    let data = this.getDataSource(sourceContainerId, sourceContainerType);
    let dataObjectSource = data[draggedType];
    this.containerCache = {
      ...this.containerCache,
      [sourceContainerId]: {
        folders: JSON.parse(JSON.stringify(data["folder"])),
        content: JSON.parse(JSON.stringify(data["content"])),
        urls: JSON.parse(JSON.stringify(data["url"])),
      }
    }

    const dataObject = dataObjectSource[draggedId];
    const sourceParentId = dataObjectSource[draggedId].parentId;

    this.setState({
      currentDraggedObject: { id: draggedId, type: draggedType, sourceContainerId: sourceContainerId, dataObject: dataObject, sourceParentId: sourceParentId },
    })
    this.cachedCurrentDraggedObject = { id: draggedId, type: draggedType, sourceContainerId: sourceContainerId, dataObject: dataObject, sourceParentId: sourceParentId };
    this.validDrop = false;
    this.lastDroppedContainerId = null;
  }

  onTreeDraggableDragOver = (id, type, containerId, containerType) => {
    // draggedType must be equal to dragOver type
    if (type != this.state.currentDraggedObject.type || id == "root") return;

    const childrenListKeyMap = {
      "folder": "childFolders",
      "content": "childContent",
      "url": "childUrls",
    }
  
    // determine data type and its corresponding data source
    let data = this.getDataSource(containerId, containerType);
    let draggedOverDataSource = data[type];
    let draggedOverParentDataSource = data["folder"];
    let headingsChildrenListKey = childrenListKeyMap[type];

    const draggedOverItemParentListId = draggedOverDataSource[id]["parentId"];
    const draggedOverItemIndex = draggedOverParentDataSource[draggedOverItemParentListId][headingsChildrenListKey]
      .findIndex(itemId => itemId == id);

    const draggedItemParentListId = this.state.currentDraggedObject.dataObject["parentId"];

    // if the item is dragged over itself, ignore
    if (this.state.currentDraggedObject.id == id || draggedItemParentListId != draggedOverItemParentListId) {
      return;
    }

    // filter out the currently dragged item
    const items = draggedOverParentDataSource[draggedOverItemParentListId][headingsChildrenListKey].filter(itemId => itemId != this.state.currentDraggedObject.id);
    // add the dragged item after the dragged over item
    items.splice(draggedOverItemIndex, 0, this.state.currentDraggedObject.id);

    draggedOverParentDataSource[draggedOverItemParentListId][headingsChildrenListKey] = items;

    this.forceUpdate();
  };

  splitPanelOnTreeDragStart(draggedId, draggedType, sourceContainerId, sourceContainerType) {
    ////console.log("onTreeDragStart")
    ////console.log(draggedId, draggedType, sourceContainerId, sourceContainerType)
    // get dataObjectSource
    let data = this.getDataSource(sourceContainerId, sourceContainerType);
    let dataObjectSource = data[draggedType];
    this.containerCache = {
      ...this.containerCache,
      [sourceContainerId]: {
        folders: JSON.parse(JSON.stringify(data["folder"])),
        content: JSON.parse(JSON.stringify(data["content"])),
        urls: JSON.parse(JSON.stringify(data["url"])),
      }
    }

    const dataObject = dataObjectSource[draggedId];
    const sourceParentId = dataObjectSource[draggedId].parentId;

    this.setState({
      splitPanelCurrentDraggedObject: { id: draggedId, type: draggedType, sourceContainerId: sourceContainerId, dataObject: dataObject, sourceParentId: sourceParentId },
    })
    this.cachedCurrentDraggedObject = { id: draggedId, type: draggedType, sourceContainerId: sourceContainerId, dataObject: dataObject, sourceParentId: sourceParentId };
    this.validDrop = false;
    this.lastDroppedContainerId = null;
  }

  splitPanelOnTreeDraggableDragOver(id, type, containerId, containerType) {
    // draggedType must be equal to dragOver type
    if (type != this.state.splitPanelCurrentDraggedObject.type || id == "root") return;

    const childrenListKeyMap = {
      "folder": "childFolders",
      "content": "childContent",
      "url": "childUrls",
    }

    // determine data type and its corresponding data source
    let data = this.getDataSource(containerId, containerType);
    let draggedOverDataSource = data[type];
    let draggedOverParentDataSource = data["folder"];
    let headingsChildrenListKey = childrenListKeyMap[type];

    const draggedOverItemParentListId = draggedOverDataSource[id]["parentId"];
    const draggedOverItemIndex = draggedOverParentDataSource[draggedOverItemParentListId][headingsChildrenListKey]
      .findIndex(itemId => itemId == id);

    const draggedItemParentListId = this.state.splitPanelCurrentDraggedObject.dataObject["parentId"];

    // if the item is dragged over itself, ignore
    if (this.state.splitPanelCurrentDraggedObject.id == id || draggedItemParentListId != draggedOverItemParentListId) {
      return;
    }

    // filter out the currently dragged item
    const items = draggedOverParentDataSource[draggedOverItemParentListId][headingsChildrenListKey].filter(itemId => itemId != this.state.splitPanelCurrentDraggedObject.id);
    // add the dragged item after the dragged over item
    items.splice(draggedOverItemIndex, 0, this.state.splitPanelCurrentDraggedObject.id);

    draggedOverParentDataSource[draggedOverItemParentListId][headingsChildrenListKey] = items;

    this.forceUpdate();
  };

  getDataSource = (containerId, containerType) => {
    let data = {};
    switch (containerType) {
      case ChooserConstants.COURSE_ASSIGNMENTS_TYPE:
        data = {
          "folder": this.headingsInfo[containerId],
          "content": this.assignmentsInfo[containerId],
          "url": {}
        }
        break;
      case ChooserConstants.USER_CONTENT_TYPE:
        data = {
          "folder": this.userFolderInfo,
          "content": this.userContentInfo,
          "url": this.userUrlInfo
        }
        break;
      case ChooserConstants.COURSE_CONTENT_TYPE:
        data = {
          "folder": this.headingsInfo[containerId],
          "content": this.assignmentsInfo[containerId],
          "url": {}
        }
        break;
    }
    return data;
  }

  onTreeDropEnter = (listId, containerId, containerType) => {
    console.log("onTreeDropEnter5", listId + '----'+containerId + '----'+containerType)

    const childrenListKeyMap = {
      "folder": "childFolders",
      "content": "childContent",
      "url": "childUrls",
    }

    // get data
    let data = this.getDataSource(containerId, containerType);
    let parentDataSource = data["folder"];
    let itemDataSource = data[this.state.currentDraggedObject.type];
    let childrenListKey = childrenListKeyMap[this.state.currentDraggedObject.type];

    // handle dragged object coming from different container
    if (this.state.currentDraggedObject.sourceContainerId != containerId) {
      // create new item, handle type conversion:
      // content -> assignments || create copy of object
      // insert new object into data

      // create backup of current tree data
      this.containerCache = {
        ...this.containerCache,
        [sourceContainerId]: {
          folders: JSON.parse(JSON.stringify(data["folder"])),
          content: JSON.parse(JSON.stringify(data["content"])),
          urls: JSON.parse(JSON.stringify(data["url"])),
        }
      }

      // insert copy into current container at base level (parentId = listId) 
      const draggedObjectInfo = this.state.currentDraggedObject.dataObject;
      let newObject = draggedObjectInfo;
      let newObjectChildren = [];

      if (this.state.currentDraggedObject.type == "content") {
        itemDataSource = Object.assign({}, itemDataSource, { [this.state.currentDraggedObject.id]: newObject });
        parentDataSource[listId]["childrenId"].push(newObject.branchId);
        parentDataSource[listId][childrenListKey].push(newObject.branchId);
        const currentDraggedObject = this.state.currentDraggedObject;
        currentDraggedObject.dataObject = newObject;
        currentDraggedObject.type = "leaf";
        currentDraggedObject.sourceParentId = listId;
        currentDraggedObject.sourceContainerId = containerId;
        this.setState({ currentDraggedObject: currentDraggedObject });
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

    const previousList = parentDataSource[previousParentId][childrenListKey];
    const currentList = parentDataSource[listId][childrenListKey];
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

    parentDataSource[previousParentId][childrenListKey] = previousList;
    parentDataSource[listId][childrenListKey] = currentList;
    const currentDraggedObject = this.state.currentDraggedObject;
    currentDraggedObject.dataObject.parentId = listId;
    this.setState({ currentDraggedObject: currentDraggedObject })
  }

  onTreeDropLeave = () => {
    // if not across containers, return
    // Content -> Course :  Reset course data, reset content data (object return to source content), reset draggedObj
    // Content -> Content :  Reset content data (object return to source content), reset draggedObj
    // Course -> Content : Not allowed
    // Course -> Course : Reset both courses data (object return to source course), reset draggedObj

    // //console.log("onTreeDropLeave")
  }

  onTreeDragEnd = (containerId, containerType) => {
    //console.log("onTreeDragEnd")
    // // dropped outsize valid dropzone
    // let currTreeHeadings = this.headingsInfo[containerId];
    // let currTreeAssignments = this.assignmentsInfo[containerId];
    // if (!this.validDrop) {
    //   currTreeHeadings = this.containerCache[containerId]["folders"];
    //   currTreeAssignments = this.containerCache[containerId]["content"];
    // }
    // // updateHeadingsAndAssignments(currTreeHeadings, currTreeAssignments);

    // this.headingsInfo[containerId] = currTreeHeadings;
    // this.assignmentsInfo[containerId] = currTreeAssignments;
    this.setState({
      currentDraggedObject: { id: null, type: null, sourceContainerId: null },
    });
    this.containerCache = {};
    this.cachedCurrentDraggedObject = null;
    this.validDrop = true;
    this.lastDroppedContainerId = null;
  }

  onTreeDrop = (containerId, containerType) => {
    //console.log("onTreeDrop")
    // update courseHeadingsInfo/courseAssignmentsInfo currentDraggedObject parentId
    // remove currentDraggedObject from sourceParentId children list
    // if (this.state.currentDraggedObject.type == "leaf") {
    //   const newCourseAssignments = this.assignmentsInfo[containerId];
    //   newCourseAssignments[this.state.currentDraggedObject.id] = this.state.currentDraggedObject.dataObject;
    //   this.assignmentsInfo[containerId] = newCourseAssignments;
    // }

    const childrenListKeyMap = {
      "folder": "childFolders",
      "content": "childContent",
      "url": "childUrls",
    }

    // get data
    let data = this.getDataSource(containerId, containerType);
    let parentDataSource = data["folder"];
    let childrenListKey = childrenListKeyMap[this.state.currentDraggedObject.type];

    const sourceParentChildrenList = parentDataSource[this.state.currentDraggedObject.sourceParentId][childrenListKey];

    if (this.state.currentDraggedObject.dataObject.parentId !== this.state.currentDraggedObject.sourceParentId) {
      const indexInSourceParentChildrenList = sourceParentChildrenList.findIndex(itemId => itemId == this.state.currentDraggedObject.id);
      if (indexInSourceParentChildrenList > -1) {
        sourceParentChildrenList.splice(indexInSourceParentChildrenList, 1);
      }
    }

    this.updateTree({
      containerType: containerType,
      folderInfo: data["folder"],
      contentInfo: data["content"],
      urlInfo: data["url"],
      courseId: containerId
    })

    // update headings
    parentDataSource[this.state.currentDraggedObject.sourceParentId][childrenListKey] = sourceParentChildrenList;
    if (this.state.currentDraggedObject.type == "header") parentDataSource[this.state.currentDraggedObject.id] = this.state.currentDraggedObject.dataObject;
    this.setState({
      currentDraggedObject: { id: null, type: null, sourceContainerId: null },
    })
    this.validDrop = true;
    this.lastDroppedContainerId = containerId;
  }

  onLeftNavDropEnter = (listId, containerId, containerType) => {
    console.log("HERE")
    console.log("onTreeDropEnter5", listId + '----'+containerId + '----'+containerType)
    
    // const childrenListKeyMap = {
    //   "folder": "childFolders",
    //   "content": "childContent",
    //   "url": "childUrls",
    // }

    // // get data
    // let data = this.getDataSource(containerId, containerType);
    // let parentDataSource = data["folder"];
    // let itemDataSource = data[this.state.currentDraggedObject.type];
    // let childrenListKey = childrenListKeyMap[this.state.currentDraggedObject.type];

    // // handle dragged object coming from different container
    // if (this.state.currentDraggedObject.sourceContainerId != containerId) {
    //   // create new item, handle type conversion:
    //   // content -> assignments || create copy of object
    //   // insert new object into data

    //   // create backup of current tree data
    //   this.containerCache = {
    //     ...this.containerCache,
    //     [sourceContainerId]: {
    //       folders: JSON.parse(JSON.stringify(data["folder"])),
    //       content: JSON.parse(JSON.stringify(data["content"])),
    //       urls: JSON.parse(JSON.stringify(data["url"])),
    //     }
    //   }

    //   // insert copy into current container at base level (parentId = listId) 
    //   const draggedObjectInfo = this.state.currentDraggedObject.dataObject;
    //   let newObject = draggedObjectInfo;
    //   let newObjectChildren = [];

    //   if (this.state.currentDraggedObject.type == "content") {
    //     itemDataSource = Object.assign({}, itemDataSource, { [this.state.currentDraggedObject.id]: newObject });
    //     parentDataSource[listId]["childrenId"].push(newObject.branchId);
    //     parentDataSource[listId][childrenListKey].push(newObject.branchId);
    //     const currentDraggedObject = this.state.currentDraggedObject;
    //     currentDraggedObject.dataObject = newObject;
    //     currentDraggedObject.type = "leaf";
    //     currentDraggedObject.sourceParentId = listId;
    //     currentDraggedObject.sourceContainerId = containerId;
    //     this.setState({ currentDraggedObject: currentDraggedObject });
    //   } else {  // "folder" || "heading"
    //     // insert new heading into headings
    //     // if any objectChildren, insert into assignments
    //   }
    //   return;
    // }

    // const currentDraggedObjectInfo = this.state.currentDraggedObject.dataObject;
    // const previousParentId = currentDraggedObjectInfo.parentId;

    // if (previousParentId == listId || listId == this.state.currentDraggedObject.id) // prevent heading from becoming a child of itself 
    //   return;

    // const previousList = parentDataSource[previousParentId][childrenListKey];
    // const currentList = parentDataSource[listId][childrenListKey];
    // // remove from previous list
    // if (previousParentId !== this.state.currentDraggedObject.sourceParentId) {
    //   const indexInList = previousList.findIndex(itemId => itemId == this.state.currentDraggedObject.id);
    //   if (indexInList > -1) {
    //     previousList.splice(indexInList, 1);
    //   }
    // }
    // if (listId !== this.state.currentDraggedObject.sourceParentId) {
    //   // add to current list
    //   currentList.push(this.state.currentDraggedObject.id);
    // }

    // parentDataSource[previousParentId][childrenListKey] = previousList;
    // parentDataSource[listId][childrenListKey] = currentList;
    // const currentDraggedObject = this.state.currentDraggedObject;
    // currentDraggedObject.dataObject.parentId = listId;
    // this.setState({ currentDraggedObject: currentDraggedObject })
  }

  onLeftNavDrop = (containerId, containerType) => {
    console.log("onTreeDrop")
    // update courseHeadingsInfo/courseAssignmentsInfo currentDraggedObject parentId
    // remove currentDraggedObject from sourceParentId children list
    // if (this.state.currentDraggedObject.type == "leaf") {
    //   const newCourseAssignments = this.assignmentsInfo[containerId];
    //   newCourseAssignments[this.state.currentDraggedObject.id] = this.state.currentDraggedObject.dataObject;
    //   this.assignmentsInfo[containerId] = newCourseAssignments;
    // }

    const childrenListKeyMap = {
      "folder": "childFolders",
      "content": "childContent",
      "url": "childUrls",
    }

    // get data
    let data = this.getDataSource(containerId, containerType);
    let parentDataSource = data["folder"];
    let childrenListKey = childrenListKeyMap[this.state.currentDraggedObject.type];

    const sourceParentChildrenList = parentDataSource[this.state.currentDraggedObject.sourceParentId][childrenListKey];

    if (this.state.currentDraggedObject.dataObject.parentId !== this.state.currentDraggedObject.sourceParentId) {
      const indexInSourceParentChildrenList = sourceParentChildrenList.findIndex(itemId => itemId == this.state.currentDraggedObject.id);
      if (indexInSourceParentChildrenList > -1) {
        sourceParentChildrenList.splice(indexInSourceParentChildrenList, 1);
      }
    }

    // this.updateTree({
    //   containerType: containerType,
    //   folderInfo: data["folder"],
    //   contentInfo: data["content"],
    //   urlInfo: data["url"],
    //   courseId: containerId
    // })

    // update headings
    parentDataSource[this.state.currentDraggedObject.sourceParentId][childrenListKey] = sourceParentChildrenList;
    if (this.state.currentDraggedObject.type == "header") parentDataSource[this.state.currentDraggedObject.id] = this.state.currentDraggedObject.dataObject;
    this.setState({
      currentDraggedObject: { id: null, type: null, sourceContainerId: null },
    })
    this.validDrop = true;
    this.lastDroppedContainerId = containerId;
  }

  splitPanelOnTreeDropEnter(listId, containerId, containerType) {
    //console.log("onTreeDropEnter5", listId + '----' + containerId + '----' + containerType)

    const childrenListKeyMap = {
      "folder": "childFolders",
      "content": "childContent",
      "url": "childUrls",
    }

    // get data
    let data = this.getDataSource(containerId, containerType);
    let parentDataSource = data["folder"];
    let itemDataSource = data[this.state.splitPanelCurrentDraggedObject.type];
    let childrenListKey = childrenListKeyMap[this.state.splitPanelCurrentDraggedObject.type];

    // handle dragged object coming from different container
    if (this.state.splitPanelCurrentDraggedObject.sourceContainerId != containerId) {
      // create new item, handle type conversion:
      // content -> assignments || create copy of object
      // insert new object into data

      // create backup of current tree data
      this.containerCache = {
        ...this.containerCache,
        [sourceContainerId]: {
          folders: JSON.parse(JSON.stringify(data["folder"])),
          content: JSON.parse(JSON.stringify(data["content"])),
          urls: JSON.parse(JSON.stringify(data["url"])),
        }
      }

      // insert copy into current container at base level (parentId = listId) 
      const draggedObjectInfo = this.state.splitPanelCurrentDraggedObject.dataObject;
      let newObject = draggedObjectInfo;
      let newObjectChildren = [];

      if (this.state.splitPanelCurrentDraggedObject.type == "content") {
        itemDataSource = Object.assign({}, itemDataSource, { [this.state.splitPanelCurrentDraggedObject.id]: newObject });
        parentDataSource[listId]["childrenId"].push(newObject.branchId);
        parentDataSource[listId][childrenListKey].push(newObject.branchId);
        const splitPanelCurrentDraggedObject = this.state.splitPanelCurrentDraggedObject;
        splitPanelCurrentDraggedObject.dataObject = newObject;
        splitPanelCurrentDraggedObject.type = "leaf";
        splitPanelCurrentDraggedObject.sourceParentId = listId;
        splitPanelCurrentDraggedObject.sourceContainerId = containerId;
        this.setState({ splitPanelCurrentDraggedObject: splitPanelCurrentDraggedObject });
      } else {  // "folder" || "heading"
        // insert new heading into headings
        // if any objectChildren, insert into assignments
      }
      return;
    }

    const currentDraggedObjectInfo = this.state.splitPanelCurrentDraggedObject.dataObject;
    const previousParentId = currentDraggedObjectInfo.parentId;

    if (previousParentId == listId || listId == this.state.splitPanelCurrentDraggedObject.id) // prevent heading from becoming a child of itself 
      return;

    const previousList = parentDataSource[previousParentId][childrenListKey];
    const currentList = parentDataSource[listId][childrenListKey];
    // remove from previous list
    if (previousParentId !== this.state.splitPanelCurrentDraggedObject.sourceParentId) {
      const indexInList = previousList.findIndex(itemId => itemId == this.state.splitPanelCurrentDraggedObject.id);
      if (indexInList > -1) {
        previousList.splice(indexInList, 1);
      }
    }
    if (listId !== this.state.splitPanelCurrentDraggedObject.sourceParentId) {
      // add to current list
      currentList.push(this.state.splitPanelCurrentDraggedObject.id);
    }

    parentDataSource[previousParentId][childrenListKey] = previousList;
    parentDataSource[listId][childrenListKey] = currentList;
    const splitPanelCurrentDraggedObject = this.state.splitPanelCurrentDraggedObject;
    splitPanelCurrentDraggedObject.dataObject.parentId = listId;
    this.setState({ splitPanelCurrentDraggedObject: splitPanelCurrentDraggedObject })
  }

  splitPanelOnTreeDropLeave() {
    // if not across containers, return
    // Content -> Course :  Reset course data, reset content data (object return to source content), reset draggedObj
    // Content -> Content :  Reset content data (object return to source content), reset draggedObj
    // Course -> Content : Not allowed
    // Course -> Course : Reset both courses data (object return to source course), reset draggedObj

    // //console.log("onTreeDropLeave")
  }

  splitPanelOnTreeDragEnd(containerId, containerType) {
    // //console.log("onTreeDragEnd")
    // // dropped outsize valid dropzone
    // let currTreeHeadings = this.headingsInfo[containerId];
    // let currTreeAssignments = this.assignmentsInfo[containerId];
    // if (!this.validDrop) {
    //   currTreeHeadings = this.containerCache[containerId]["folders"];
    //   currTreeAssignments = this.containerCache[containerId]["content"];
    // }
    // // updateHeadingsAndAssignments(currTreeHeadings, currTreeAssignments);

    // this.headingsInfo[containerId] = currTreeHeadings;
    // this.assignmentsInfo[containerId] = currTreeAssignments;
    this.setState({
      splitPanelCurrentDraggedObject: { id: null, type: null, sourceContainerId: null },
    });
    this.containerCache = {};
    this.cachedCurrentDraggedObject = null;
    this.validDrop = true;
    this.lastDroppedContainerId = null;
  }

  splitPanelOnTreeDrop(containerId, containerType) {
    // //console.log("onTreeDrop")
    // update courseHeadingsInfo/courseAssignmentsInfo currentDraggedObject parentId
    // remove currentDraggedObject from sourceParentId children list
    // if (this.state.currentDraggedObject.type == "leaf") {
    //   const newCourseAssignments = this.assignmentsInfo[containerId];
    //   newCourseAssignments[this.state.currentDraggedObject.id] = this.state.currentDraggedObject.dataObject;
    //   this.assignmentsInfo[containerId] = newCourseAssignments;
    // }

    const childrenListKeyMap = {
      "folder": "childFolders",
      "content": "childContent",
      "url": "childUrls",
    }

    // get data
    let data = this.getDataSource(containerId, containerType);
    let parentDataSource = data["folder"];
    let childrenListKey = childrenListKeyMap[this.state.splitPanelCurrentDraggedObject.type];

    const sourceParentChildrenList = parentDataSource[this.state.splitPanelCurrentDraggedObject.sourceParentId][childrenListKey];

    if (this.state.splitPanelCurrentDraggedObject.dataObject.parentId !== this.state.splitPanelCurrentDraggedObject.sourceParentId) {
      const indexInSourceParentChildrenList = sourceParentChildrenList.findIndex(itemId => itemId == this.state.splitPanelCurrentDraggedObject.id);
      if (indexInSourceParentChildrenList > -1) {
        sourceParentChildrenList.splice(indexInSourceParentChildrenList, 1);
      }
    }

    this.updateTree({
      containerType: containerType,
      folderInfo: data["folder"],
      contentInfo: data["content"],
      urlInfo: data["url"],
      courseId: containerId
    })

    // update headings
    parentDataSource[this.state.splitPanelCurrentDraggedObject.sourceParentId][childrenListKey] = sourceParentChildrenList;
    if (this.state.splitPanelCurrentDraggedObject.type == "header") parentDataSource[this.state.splitPanelCurrentDraggedObject.id] = this.state.splitPanelCurrentDraggedObject.dataObject;
    this.setState({
      currentDraggedObject: { id: null, type: null, sourceContainerId: null },
    })
    this.validDrop = true;
    this.lastDroppedContainerId = containerId;
  }

  splitPanelOnTreeDropEnter(listId, containerId, containerType) {
    //console.log("onTreeDropEnter5", listId + '----' + containerId + '----' + containerType)

    const childrenListKeyMap = {
      "folder": "childFolders",
      "content": "childContent",
      "url": "childUrls",
    }

    // get data
    let data = this.getDataSource(containerId, containerType);
    let parentDataSource = data["folder"];
    let itemDataSource = data[this.state.splitPanelCurrentDraggedObject.type];
    let childrenListKey = childrenListKeyMap[this.state.splitPanelCurrentDraggedObject.type];

    // handle dragged object coming from different container
    if (this.state.splitPanelCurrentDraggedObject.sourceContainerId != containerId) {
      // create new item, handle type conversion:
      // content -> assignments || create copy of object
      // insert new object into data

      // create backup of current tree data
      this.containerCache = {
        ...this.containerCache,
        [sourceContainerId]: {
          folders: JSON.parse(JSON.stringify(data["folder"])),
          content: JSON.parse(JSON.stringify(data["content"])),
          urls: JSON.parse(JSON.stringify(data["url"])),
        }
      }

      // insert copy into current container at base level (parentId = listId) 
      const draggedObjectInfo = this.state.splitPanelCurrentDraggedObject.dataObject;
      let newObject = draggedObjectInfo;
      let newObjectChildren = [];

      if (this.state.splitPanelCurrentDraggedObject.type == "content") {
        itemDataSource = Object.assign({}, itemDataSource, { [this.state.splitPanelCurrentDraggedObject.id]: newObject });
        parentDataSource[listId]["childrenId"].push(newObject.branchId);
        parentDataSource[listId][childrenListKey].push(newObject.branchId);
        const splitPanelCurrentDraggedObject = this.state.splitPanelCurrentDraggedObject;
        splitPanelCurrentDraggedObject.dataObject = newObject;
        splitPanelCurrentDraggedObject.type = "leaf";
        splitPanelCurrentDraggedObject.sourceParentId = listId;
        splitPanelCurrentDraggedObject.sourceContainerId = containerId;
        this.setState({ splitPanelCurrentDraggedObject: splitPanelCurrentDraggedObject });
      } else {  // "folder" || "heading"
        // insert new heading into headings
        // if any objectChildren, insert into assignments
      }
      return;
    }

    const currentDraggedObjectInfo = this.state.splitPanelCurrentDraggedObject.dataObject;
    const previousParentId = currentDraggedObjectInfo.parentId;

    if (previousParentId == listId || listId == this.state.splitPanelCurrentDraggedObject.id) // prevent heading from becoming a child of itself 
      return;

    const previousList = parentDataSource[previousParentId][childrenListKey];
    const currentList = parentDataSource[listId][childrenListKey];
    // remove from previous list
    if (previousParentId !== this.state.splitPanelCurrentDraggedObject.sourceParentId) {
      const indexInList = previousList.findIndex(itemId => itemId == this.state.splitPanelCurrentDraggedObject.id);
      if (indexInList > -1) {
        previousList.splice(indexInList, 1);
      }
    }
    if (listId !== this.state.splitPanelCurrentDraggedObject.sourceParentId) {
      // add to current list
      currentList.push(this.state.splitPanelCurrentDraggedObject.id);
    }

    parentDataSource[previousParentId][childrenListKey] = previousList;
    parentDataSource[listId][childrenListKey] = currentList;
    const splitPanelCurrentDraggedObject = this.state.splitPanelCurrentDraggedObject;
    splitPanelCurrentDraggedObject.dataObject.parentId = listId;
    this.setState({ splitPanelCurrentDraggedObject: splitPanelCurrentDraggedObject })
  }

  splitPanelOnTreeDropLeave() {
    // if not across containers, return
    // Content -> Course :  Reset course data, reset content data (object return to source content), reset draggedObj
    // Content -> Content :  Reset content data (object return to source content), reset draggedObj
    // Course -> Content : Not allowed
    // Course -> Course : Reset both courses data (object return to source course), reset draggedObj

    // //console.log("onTreeDropLeave")
  }

  splitPanelOnTreeDragEnd(containerId, containerType) {
    // //console.log("onTreeDragEnd")
    // // dropped outsize valid dropzone
    // let currTreeHeadings = this.headingsInfo[containerId];
    // let currTreeAssignments = this.assignmentsInfo[containerId];
    // if (!this.validDrop) {
    //   currTreeHeadings = this.containerCache[containerId]["folders"];
    //   currTreeAssignments = this.containerCache[containerId]["content"];
    // }
    // // updateHeadingsAndAssignments(currTreeHeadings, currTreeAssignments);

    // this.headingsInfo[containerId] = currTreeHeadings;
    // this.assignmentsInfo[containerId] = currTreeAssignments;
    this.setState({
      splitPanelCurrentDraggedObject: { id: null, type: null, sourceContainerId: null },
    });
    this.containerCache = {};
    this.cachedCurrentDraggedObject = null;
    this.validDrop = true;
    this.lastDroppedContainerId = null;
  }

  splitPanelOnTreeDrop(containerId, containerType) {
    // //console.log("onTreeDrop")
    // update courseHeadingsInfo/courseAssignmentsInfo currentDraggedObject parentId
    // remove currentDraggedObject from sourceParentId children list
    // if (this.state.currentDraggedObject.type == "leaf") {
    //   const newCourseAssignments = this.assignmentsInfo[containerId];
    //   newCourseAssignments[this.state.currentDraggedObject.id] = this.state.currentDraggedObject.dataObject;
    //   this.assignmentsInfo[containerId] = newCourseAssignments;
    // }

    const childrenListKeyMap = {
      "folder": "childFolders",
      "content": "childContent",
      "url": "childUrls",
    }

    // get data
    let data = this.getDataSource(containerId, containerType);
    let parentDataSource = data["folder"];
    let childrenListKey = childrenListKeyMap[this.state.splitPanelCurrentDraggedObject.type];

    const sourceParentChildrenList = parentDataSource[this.state.splitPanelCurrentDraggedObject.sourceParentId][childrenListKey];

    if (this.state.splitPanelCurrentDraggedObject.dataObject.parentId !== this.state.splitPanelCurrentDraggedObject.sourceParentId) {
      const indexInSourceParentChildrenList = sourceParentChildrenList.findIndex(itemId => itemId == this.state.splitPanelCurrentDraggedObject.id);
      if (indexInSourceParentChildrenList > -1) {
        sourceParentChildrenList.splice(indexInSourceParentChildrenList, 1);
      }
    }

    this.updateTree({
      containerType: containerType,
      folderInfo: data["folder"],
      contentInfo: data["content"],
      urlInfo: data["url"],
      courseId: containerId
    })

    // update headings
    parentDataSource[this.state.splitPanelCurrentDraggedObject.sourceParentId][childrenListKey] = sourceParentChildrenList;
    if (this.state.splitPanelCurrentDraggedObject.type == "header") parentDataSource[this.state.splitPanelCurrentDraggedObject.id] = this.state.splitPanelCurrentDraggedObject.dataObject;
    this.setState({
      currentDraggedObject: { id: null, type: null, sourceContainerId: null },
    })
    this.validDrop = true;
    this.lastDroppedContainerId = containerId;
  }

  splitPanelOnTreeDropEnter(listId, containerId, containerType) {
    //console.log("onTreeDropEnter5", listId + '----' + containerId + '----' + containerType)

    const childrenListKeyMap = {
      "folder": "childFolders",
      "content": "childContent",
      "url": "childUrls",
    }

    // get data
    let data = this.getDataSource(containerId, containerType);
    let parentDataSource = data["folder"];
    let itemDataSource = data[this.state.splitPanelCurrentDraggedObject.type];
    let childrenListKey = childrenListKeyMap[this.state.splitPanelCurrentDraggedObject.type];

    // handle dragged object coming from different container
    if (this.state.splitPanelCurrentDraggedObject.sourceContainerId != containerId) {
      // create new item, handle type conversion:
      // content -> assignments || create copy of object
      // insert new object into data

      // create backup of current tree data
      this.containerCache = {
        ...this.containerCache,
        [sourceContainerId]: {
          folders: JSON.parse(JSON.stringify(data["folder"])),
          content: JSON.parse(JSON.stringify(data["content"])),
          urls: JSON.parse(JSON.stringify(data["url"])),
        }
      }

      // insert copy into current container at base level (parentId = listId) 
      const draggedObjectInfo = this.state.splitPanelCurrentDraggedObject.dataObject;
      let newObject = draggedObjectInfo;
      let newObjectChildren = [];

      if (this.state.splitPanelCurrentDraggedObject.type == "content") {
        itemDataSource = Object.assign({}, itemDataSource, { [this.state.splitPanelCurrentDraggedObject.id]: newObject });
        parentDataSource[listId]["childrenId"].push(newObject.branchId);
        parentDataSource[listId][childrenListKey].push(newObject.branchId);
        const splitPanelCurrentDraggedObject = this.state.splitPanelCurrentDraggedObject;
        splitPanelCurrentDraggedObject.dataObject = newObject;
        splitPanelCurrentDraggedObject.type = "leaf";
        splitPanelCurrentDraggedObject.sourceParentId = listId;
        splitPanelCurrentDraggedObject.sourceContainerId = containerId;
        this.setState({ splitPanelCurrentDraggedObject: splitPanelCurrentDraggedObject });
      } else {  // "folder" || "heading"
        // insert new heading into headings
        // if any objectChildren, insert into assignments
      }
      return;
    }

    const currentDraggedObjectInfo = this.state.splitPanelCurrentDraggedObject.dataObject;
    const previousParentId = currentDraggedObjectInfo.parentId;

    if (previousParentId == listId || listId == this.state.splitPanelCurrentDraggedObject.id) // prevent heading from becoming a child of itself 
      return;

    const previousList = parentDataSource[previousParentId][childrenListKey];
    const currentList = parentDataSource[listId][childrenListKey];
    // remove from previous list
    if (previousParentId !== this.state.splitPanelCurrentDraggedObject.sourceParentId) {
      const indexInList = previousList.findIndex(itemId => itemId == this.state.splitPanelCurrentDraggedObject.id);
      if (indexInList > -1) {
        previousList.splice(indexInList, 1);
      }
    }
    if (listId !== this.state.splitPanelCurrentDraggedObject.sourceParentId) {
      // add to current list
      currentList.push(this.state.splitPanelCurrentDraggedObject.id);
    }

    parentDataSource[previousParentId][childrenListKey] = previousList;
    parentDataSource[listId][childrenListKey] = currentList;
    const splitPanelCurrentDraggedObject = this.state.splitPanelCurrentDraggedObject;
    splitPanelCurrentDraggedObject.dataObject.parentId = listId;
    this.setState({ splitPanelCurrentDraggedObject: splitPanelCurrentDraggedObject })
  }

  splitPanelOnTreeDropLeave() {
    // if not across containers, return
    // Content -> Course :  Reset course data, reset content data (object return to source content), reset draggedObj
    // Content -> Content :  Reset content data (object return to source content), reset draggedObj
    // Course -> Content : Not allowed
    // Course -> Course : Reset both courses data (object return to source course), reset draggedObj

    // //console.log("onTreeDropLeave")
  }

  splitPanelOnTreeDragEnd(containerId, containerType) {
    // //console.log("onTreeDragEnd")
    // // dropped outsize valid dropzone
    // let currTreeHeadings = this.headingsInfo[containerId];
    // let currTreeAssignments = this.assignmentsInfo[containerId];
    // if (!this.validDrop) {
    //   currTreeHeadings = this.containerCache[containerId]["folders"];
    //   currTreeAssignments = this.containerCache[containerId]["content"];
    // }
    // // updateHeadingsAndAssignments(currTreeHeadings, currTreeAssignments);

    // this.headingsInfo[containerId] = currTreeHeadings;
    // this.assignmentsInfo[containerId] = currTreeAssignments;
    this.setState({
      splitPanelCurrentDraggedObject: { id: null, type: null, sourceContainerId: null },
    });
    this.containerCache = {};
    this.cachedCurrentDraggedObject = null;
    this.validDrop = true;
    this.lastDroppedContainerId = null;
  }

  splitPanelOnTreeDrop(containerId, containerType) {
    // //console.log("onTreeDrop")
    // update courseHeadingsInfo/courseAssignmentsInfo currentDraggedObject parentId
    // remove currentDraggedObject from sourceParentId children list
    // if (this.state.currentDraggedObject.type == "leaf") {
    //   const newCourseAssignments = this.assignmentsInfo[containerId];
    //   newCourseAssignments[this.state.currentDraggedObject.id] = this.state.currentDraggedObject.dataObject;
    //   this.assignmentsInfo[containerId] = newCourseAssignments;
    // }

    const childrenListKeyMap = {
      "folder": "childFolders",
      "content": "childContent",
      "url": "childUrls",
    }

    // get data
    let data = this.getDataSource(containerId, containerType);
    let parentDataSource = data["folder"];
    let childrenListKey = childrenListKeyMap[this.state.splitPanelCurrentDraggedObject.type];

    const sourceParentChildrenList = parentDataSource[this.state.splitPanelCurrentDraggedObject.sourceParentId][childrenListKey];

    if (this.state.splitPanelCurrentDraggedObject.dataObject.parentId !== this.state.splitPanelCurrentDraggedObject.sourceParentId) {
      const indexInSourceParentChildrenList = sourceParentChildrenList.findIndex(itemId => itemId == this.state.splitPanelCurrentDraggedObject.id);
      if (indexInSourceParentChildrenList > -1) {
        sourceParentChildrenList.splice(indexInSourceParentChildrenList, 1);
      }
    }

    this.updateTree({
      containerType: containerType,
      folderInfo: data["folder"],
      contentInfo: data["content"],
      urlInfo: data["url"],
      courseId: containerId
    })

    // update headings
    parentDataSource[this.state.splitPanelCurrentDraggedObject.sourceParentId][childrenListKey] = sourceParentChildrenList;
    if (this.state.splitPanelCurrentDraggedObject.type == "header") parentDataSource[this.state.splitPanelCurrentDraggedObject.id] = this.state.splitPanelCurrentDraggedObject.dataObject;
    this.setState({
      splitPanelCurrentDraggedObject: { id: null, type: null, sourceContainerId: null },
    })
    this.validDrop = true;
    this.lastDroppedContainerId = containerId;
  }

  updateTree = ({ containerType, folderInfo = {}, contentInfo = {}, urlInfo = {}, courseId = "" }) => {
    switch (containerType) {
      case ChooserConstants.COURSE_ASSIGNMENTS_TYPE:
        this.saveAssignmentsTree({ courseId: courseId, headingsInfo: folderInfo, assignmentsInfo: contentInfo, callback: () => { } });
        break;
      case ChooserConstants.USER_CONTENT_TYPE:
        this.saveContentTree({ folderInfo, callback: () => { } });
        break;
      case ChooserConstants.COURSE_CONTENT_TYPE:
        this.saveAssignmentsTree({ courseId: courseId, headingsInfo: folderInfo, assignmentsInfo: contentInfo, callback: () => { } });
        break;
    }
  }

  onBrowserDragStart =({ draggedId, draggedType, sourceContainerId, parentsInfo, leavesInfo }) => { 
    //console.log("onDragStart")

    let dataObjectSource = leavesInfo;
    if (draggedType == "folder") dataObjectSource = parentsInfo;
    else if (draggedType == "url") dataObjectSource = this.urlInfo;

    const dataObject = dataObjectSource[draggedId];
    const sourceParentId = dataObjectSource[draggedId].parentId;

    this.setState({
      currentDraggedObject: { id: draggedId, type: draggedType, sourceContainerId: sourceContainerId, dataObject: dataObject, sourceParentId: sourceParentId },
    })
    this.containerCache = {
      ...this.containerCache,
      [sourceContainerId]: {
        parents: JSON.parse(JSON.stringify(parentsInfo)),
        leaves: JSON.parse(JSON.stringify(leavesInfo))
      }
    }
    this.cachedCurrentDraggedObject = { id: draggedId, type: draggedType, sourceContainerId: sourceContainerId, dataObject: dataObject, sourceParentId: sourceParentId };
    this.validDrop = false;
  }

  onSplitPanelBrowserDragStart({ draggedId, draggedType, sourceContainerId, parentsInfo, leavesInfo }) {
    ////console.log("onDragStart")

    let dataObjectSource = leavesInfo;
    if (draggedType == "folder") dataObjectSource = parentsInfo;
    else if (draggedType == "url") dataObjectSource = this.urlInfo;

    const dataObject = dataObjectSource[draggedId];
    const sourceParentId = dataObjectSource[draggedId].parentId;

    this.setState({
      splitPanelCurrentDraggedObject: { id: draggedId, type: draggedType, sourceContainerId: sourceContainerId, dataObject: dataObject, sourceParentId: sourceParentId },
    })
    this.containerCache = {
      ...this.containerCache,
      [sourceContainerId]: {
        parents: JSON.parse(JSON.stringify(parentsInfo)),
        leaves: JSON.parse(JSON.stringify(leavesInfo))
      }
    }
    this.cachedCurrentDraggedObject = { id: draggedId, type: draggedType, sourceContainerId: sourceContainerId, dataObject: dataObject, sourceParentId: sourceParentId };
    this.validDrop = false;
  }

  onBrowserDropEnter = (listId) => {
    //console.log("onDropEnter")
  }

  onBrowserDragEnd = ({ containerId, parentsInfo, leavesInfo }) => {
    //console.log("onBrowserDragEnd")
    let currParentsInfo = parentsInfo;
    let currChildrenInfo = leavesInfo;
    // dropped across containers && content -> content
    if (this.validDrop && containerId != this.lastDroppedContainerId) {
      // remove current dragged item from data
      // save data
    } else if (!this.validDrop) {
      // dropped outsize valid dropzone, reset all data
      // currParentsInfo = this.containerCache[containerId].parents;
      // currChildrenInfo = this.containerCache[containerId].leaves;
      // const newSourceContainerId = this.state.currentDraggedObject.sourceContainerId;
      // if (newSourceContainerId != containerId) {
      //   if (this.state.selectedDrive == "Content") {
      //     // TODO: reset content from cache
      //   } else if (this.state.selectedDrive == "Courses") {
      //     this.headingsInfo[newSourceContainerId] = this.containerCache[newSourceContainerId].parents;
      //     this.assignmentsInfo[newSourceContainerId] = this.containerCache[newSourceContainerId].leaves;
      //   }
      // }
    }
    this.folderInfo = currParentsInfo;
    this.branchId_info = currChildrenInfo;
    // save folderInfo and branchId_info

    this.setState({
      currentDraggedObject: { id: null, type: null, sourceContainerId: null },
    })
    this.containerCache = {};
    this.cachedCurrentDraggedObject = null;
  }

  onSplitPanelBrowserDragEnd({ containerId, parentsInfo, leavesInfo }) {
    ////console.log("onBrowserDragEnd")
    let currParentsInfo = parentsInfo;
    let currChildrenInfo = leavesInfo;
    // dropped across containers && content -> content
    if (this.validDrop && containerId != this.lastDroppedContainerId) {
      // remove current dragged item from data
      // save data
    } else if (!this.validDrop) {
      // dropped outsize valid dropzone, reset all data
      currParentsInfo = this.containerCache[containerId].parents;
      currChildrenInfo = this.containerCache[containerId].leaves;
      const newSourceContainerId = this.state.splitPanelCurrentDraggedObject.sourceContainerId;
      if (newSourceContainerId != containerId) {
        this.headingsInfo[newSourceContainerId] = this.containerCache[newSourceContainerId].parents;
        this.assignmentsInfo[newSourceContainerId] = this.containerCache[newSourceContainerId].leaves;
      }
    }
    this.folderInfo = currParentsInfo;
    this.branchId_info = currChildrenInfo;
    // save folderInfo and branchId_info

    this.setState({
      splitPanelCurrentDraggedObject: { id: null, type: null, sourceContainerId: null },
    })
    this.containerCache = {};
    this.cachedCurrentDraggedObject = null;
  }

  onBrowserDrop = (containerId, parentsInfo, leavesInfo) => {
    ////console.log("onBrowserDrop")

  }

  switchPanelContainer = (view) => {
    const values = this.state.panelsCollection['first'].values;
    const newPanelData = {
      values: values,
      activeContainer: view

    }
    this.setState({
      panelsCollection: {
        ...this.state.panelsCollection,
        ["first"]: newPanelData
      }
    })
  }

  splitSwitchPanelContainer(view) {
    const values = this.state.splitPanelsCollection['second'].values;
    const newPanelData = {
      values: values,
      activeContainer: view

    }
    this.setState({
      splitPanelsCollection: {
        ...this.state.splitPanelsCollection,
        ["second"]: newPanelData
      }
    })
  }

  onBrowserFolderDrop = ({ containerId, droppedId }) =>{
    // handle dragging folder onto itself
    if (this.state.currentDraggedObject.id == droppedId) return;
    let draggedItems = {
      id: this.state.selectedItems,
      type: this.state.selectedItemsType
    }
    // remove droppedId, repos from (draggedIds, draggedTypes)
    for (let i = 0; i < draggedItems.id.length; i++) {
      if (draggedItems.id[i] == droppedId || (draggedItems.type == "folder" && draggedItems.isRepo)) {
        draggedItems.id.splice(i, 1);
        draggedItems.type.splice(i, 1);
      }
    }
    let targetDroppedId = droppedId;
    if (droppedId == ChooserConstants.PREVIOUS_DIR_ID) {
      // add content to previous directory
      targetDroppedId = this.state.directoryStack.slice(-2)[0];
      if (this.state.directoryStack.length < 2) targetDroppedId = "root"; 
    }

    // add draggedIds to folder with targetDroppedId
    if (this.state.selectedDrive == "Content") {
      this.addContentToFolder(draggedItems.id, draggedItems.type, targetDroppedId);
    } else if (this.state.selectedDrive == "Courses") {
      const dataSource = this.getDataSource(containerId, ChooserConstants.COURSE_ASSIGNMENTS_TYPE);
      const childrenListKeyMap = {
        "folder": "childFolders",
        "content": "childContent",
        "url": "childUrls",
      }
      for (let i = 0; i < draggedItems.id.length; i++) {
        const itemId = draggedItems.id[i]
        const itemType = draggedItems.type[i];
        const itemParentId = dataSource[itemType][itemId]["parentId"];
        const folderListKey = childrenListKeyMap[itemType];
        const indexInList = dataSource["folder"][itemParentId][folderListKey].findIndex(id => id == itemId);
        if (indexInList > -1) {
          dataSource["folder"][itemParentId][folderListKey].splice(indexInList, 1);
        }
        dataSource["folder"][targetDroppedId][folderListKey].push(itemId);
        dataSource[itemType][itemId]["parentId"] = targetDroppedId;
      }
      this.updateTree({
        containerType: ChooserConstants.COURSE_ASSIGNMENTS_TYPE,
        folderInfo: dataSource["folder"],
        contentInfo: dataSource["content"],
        urlInfo: dataSource["url"],
        courseId: containerId
      })
    }
  }
  
  onSplitPanelBrowserFolderDrop = ({ containerId, droppedId }) => {
    // handle dragging folder onto itself
    if (this.state.splitPanelCurrentDraggedObject.id == droppedId) return;
    let draggedItems = {
      id: this.state.selectedItems,
      type: this.state.selectedItemsType
    }
    // remove droppedId, repos from (draggedIds, draggedTypes)
    for (let i = 0; i < draggedItems.id.length; i++) {
      if (draggedItems.id[i] == droppedId || (draggedItems.type == "folder" && draggedItems.isRepo)) {
        draggedItems.id.splice(i, 1);
        draggedItems.type.splice(i, 1);
      }
    }
    if (droppedId == ChooserConstants.PREVIOUS_DIR_ID) {
      // add content to previous directory
      let previousDirectoryId = this.state.directoryStack.slice(-2)[0];
      if (this.state.directoryStack.length < 2) previousDirectoryId = "root";
      this.addContentToFolder(draggedItems.id, draggedItems.type, previousDirectoryId);
    } else {
      // add draggedIds to folder with droppedId
      this.addContentToFolder(draggedItems.id, draggedItems.type, droppedId);
    }
  }
  
  toggleSplitPanel() {
    this.setState({ splitPanelLayout: !this.state.splitPanelLayout });
  }

  getPathToFolder = (folderId, parentDataObject) => {
    let pathToFolder = [folderId];
    let currentParentId = parentDataObject[folderId].parentId;
    while (currentParentId != "root") {
      pathToFolder.unshift(currentParentId);
      currentParentId = parentDataObject[currentParentId].parentId;
    }
    return pathToFolder;
  }

  handleLeftNavSearch(e) {
    const searchTerm = e.target.value || '';
    const copyUserFolderInfo = JSON.parse(JSON.stringify(this.userFolderInfo));

    const filteredUserFolderInfo = Object.keys(copyUserFolderInfo)
                                    .filter((key) => {
                                      const { title } = copyUserFolderInfo[key]
                                      return title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 && key !== 'root'
                                    })
                                    .reduce((acc, key) => {
                                      return {
                                        ...acc,
                                        [key]: {
                                          ...copyUserFolderInfo[key],
                                          childFolders: [],
                                          childUrls: [],
                                        },
                                      }
                                    }, {})

    const filteredChildFolders = Object.keys(copyUserFolderInfo)
                                  .filter((key) => {
                                    const { title } = copyUserFolderInfo[key]
                                    return title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 && key !== 'root'
                                  })
                                  .map((key) => copyUserFolderInfo[key].parentId === 'root' ? key : '')
                                  .filter((i) => i)
    
    const filteredInfo = { 
                          ...filteredUserFolderInfo, 
                          root: { 
                            ...copyUserFolderInfo['root'],
                            childFolders: filteredChildFolders,
                          } 
                        }
    this.setState({ userFolderInfo: filteredInfo });
  }

  overlayOnClose() {
    const { location: { pathname = '' } } = this.history
    this.history.push(`${pathname}`)
    this.setState({ modalOpen: false });
    this.loadUserContentBranches();
    this.loadUserFoldersAndRepo();
    this.loadUserUrls();
  }

  loadUserProfile = () => {
    const phpUrl = '/api/loadProfile.php';
    const data = {}
    const payload = {
      params: data
    }
    axios.get(phpUrl, payload)
    .then(resp => {
      if (resp.data.success === "1") {
        this.userProfile = resp.data.profile;
      }
    })
    .catch(error => { this.setState({ error: error }) });
  }

  grantRepoAccess = ({repoId, email, owner, callback=()=>{}}) => {
    const loadCoursesUrl = '/api/addRepoUser.php';
    const data = {
      repoId: repoId,
      email: email,
      owner: owner,
    }
    const payload = {
      params: data
    }

    axios.get(loadCoursesUrl, payload)
    .then(resp => {
      if (resp.data.success === "1") {
        if (this.folderInfo[repoId]) this.folderInfo[repoId].user_access_info = resp.data.users;
      } else {
        this.displayToast(resp.data.message);
      }      
      this.userContentReloaded = true;
      callback(resp);
      this.forceUpdate();
    });
  }

  revokeRepoAccess = ({repoId, email, callback=()=>{}}) => {
    const loadCoursesUrl = '/api/removeRepoUser.php';
    const data = {
      repoId: repoId,
      email: email,
    }
    const payload = {
      params: data
    }

    axios.get(loadCoursesUrl, payload)
      .then(resp => {
        if (resp.data.success === "1") {
          this.folderInfo[repoId].user_access_info = resp.data.users;
        } else {
          this.displayToast(resp.data.message);
        }      
        this.userContentReloaded = true;
        callback(resp);
        this.forceUpdate();
      });
  }

  headerTitleChange(title) {
    this.setState({modalHeaderTitle: title});
  }

  createModalContent = () => {
    let modalContent = <React.Fragment></React.Fragment>

    switch(this.state.activeSection) {
      case ChooserConstants.CREATE_COURSE_MODE || ChooserConstants.EDIT_COURSE_INFO_MODE:
        modalContent = <CourseForm
          mode={this.state.activeSection}
          handleBack={this.toggleFormModal}
          handleNewCourseCreated={this.handleNewCourseCreated}
          saveCourse={this.saveCourse}
          selectedCourse={this.state.selectedCourse}
          selectedCourseInfo={this.courseInfo[this.state.selectedCourse]}
        />;
        break;
      case ChooserConstants.CREATE_URL_MODE || ChooserConstants.EDIT_URL_INFO_MODE:
        modalContent = <UrlForm
          mode={this.state.activeSection}
          handleBack={this.toggleFormModal}
          handleNewUrlCreated={this.handleNewUrlCreated}
          saveUrl={this.saveUrl}
          selectedUrl={this.state.selectedItems[this.state.selectedItems.length - 1]}
          selectedUrlInfo={this.urlInfo[this.state.selectedItems[this.state.selectedItems.length - 1]]}
        />;
        break;
      default:
        modalContent =  <DoenetEditor hideHeader={true} 
        branchId={this.selectedBranchId}
        contentId={this.selectedContentId}
        headerTitleChange={this.headerTitleChange.bind(this)}/> 
    }    
    return modalContent;
  }

  render() {
    if (!this.courses_loaded || !this.assignments_and_headings_loaded) {
      return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <SpinningLoader />
      </div>
    }
    // return <DoenetAssignmentTree treeHeadingsInfo={this.headingsInfo} treeAssignmentsInfo={this.assignmentsInfo} 
    // updateHeadingsAndAssignments={this.updateHeadingsAndAssignments}/>
    let assignmentsTree = <div className="tree" style={{ padding: "5em 2em" }}>
      <TreeView
        containerId={this.state.selectedCourse}
        containerType={ChooserConstants.COURSE_ASSIGNMENTS_TYPE}
        loading={!this.assignments_and_headings_loaded}
        parentsInfo={this.headingsInfo[this.state.selectedCourse]}
        childrenInfo={this.assignmentsInfo[this.state.selectedCourse]}
        treeNodeIcons={TreeIcons}
        currentDraggedObject={this.state.currentDraggedObject}
        onDragStart={this.onTreeDragStart}
        onDragEnd={this.onTreeDragEnd}
        onDraggableDragOver={this.onTreeDraggableDragOver}
        onDropEnter={this.onTreeDropEnter}
        onDrop={this.onTreeDrop} />
    </div>

    // process root folder for tree rendering
    if (this.folders_loaded && this.branches_loaded && this.urls_loaded && this.userContentReloaded) {
      this.userContentReloaded = false;
      console.log(this.userFolderInfo);
      this.userFolderInfo["root"] = {
        title: "User Content Tree",
        childContent: [],
        childFolders: [],
        childUrls: [],
        isPublic: false,
        type: "folder",
      };
      this.userFolderInfo["root"]["title"] = "User Content Tree"
      this.userFolderInfo["root"]["childContent"] = [];
      this.userFolderInfo["root"]["childFolders"] = [];
      this.userFolderInfo["root"]["childUrls"] = [];
      Object.keys(this.userContentInfo).forEach((branchId) => {
        if (this.userContentInfo[branchId].parentId == "root") this.userFolderInfo["root"]["childContent"].push(branchId);
      })
      Object.keys(this.userUrlInfo).forEach((urlId) => {
        if (this.userUrlInfo[urlId].parentId == "root") this.userFolderInfo["root"]["childUrls"].push(urlId);
      })
      Object.keys(this.userFolderInfo).forEach((folderId) => {
        if (this.userFolderInfo[folderId].parentId == "root") this.userFolderInfo["root"]["childFolders"].push(folderId);
      })
    }

    this.buildCourseList();
    this.buildLeftNavPanel();
    this.buildTopToolbar();

    // setup mainSection to be chooser / CourseForm
    this.mainSection;
    let loading = true;
    let browserContainerId = ""
    let browserContentInfo = {}
    let browserFolderInfo = {}
    let browserUrlInfo = {}
    let folderList = [];
    let contentList = [];
    let urlList = [];
    let treeContainerId = "";
    let treeContainerType = "";
    let treeParentsInfo = {};
    let treeChildrenInfo = {};
    
    if (this.state.selectedDrive == "Content" || this.state.selectedDrive == "Global") {
      loading = !this.folders_loaded || !this.branches_loaded || !this.urls_loaded;

      // browser data
      browserContainerId = "user";
      folderList = this.folderIds;
      contentList = this.sort_order;
      urlList = this.urlIds;
      browserFolderInfo = this.folderInfo;
      browserContentInfo= this.branchId_info;
      browserUrlInfo = this.urlInfo;

      // tree data
      treeContainerId = "user";
      treeContainerType = ChooserConstants.USER_CONTENT_TYPE;
      treeParentsInfo = this.userFolderInfo;
      treeChildrenInfo = { ...this.userContentInfo, ...this.userUrlInfo };
      console.log(treeParentsInfo)

    } else if (this.state.selectedDrive == "Courses") {
      loading = !this.assignments_and_headings_loaded;


      // browser data
      browserContainerId = this.state.selectedCourse;
      if (this.headingsInfo[this.state.selectedCourse]["root"]) {
        folderList = this.headingsInfo[this.state.selectedCourse]["root"]["childFolders"]; 
        contentList = this.headingsInfo[this.state.selectedCourse]["root"]["childContent"]; 
      }
      browserFolderInfo = this.headingsInfo[this.state.selectedCourse]
      browserContentInfo = this.assignmentsInfo[this.state.selectedCourse]

      // tree data
      treeContainerId = this.state.selectedCourse;
      treeContainerType = ChooserConstants.COURSE_ASSIGNMENTS_TYPE;
      treeParentsInfo = this.headingsInfo[this.state.selectedCourse];
      treeChildrenInfo = this.assignmentsInfo[this.state.selectedCourse];
    }


const TreeNodeItem = ({title, icon}) => {
  const contentInfo = this.folderInfo        
  const currentInfo = Object.keys(contentInfo).filter((i) => contentInfo[i].title === title)    
  const parentId = contentInfo[currentInfo[0]]?.parentId || ''
  const parentTitle = currentInfo.length && parentId ? contentInfo[parentId]?.title : 'Content'
  const path = (parentTitle === 'Content' || parentTitle === 'root') ? currentInfo[0] : `${parentId}/${currentInfo[0]}`
  
  
  return <div>
    {icon}
    <Link 
      to={`/content/${path || ''}`} 
      style={{
        textDecoration:"none", 
        marginLeft:"5px", 
        color: "rgba(0, 0, 0, 0.8)", 
        border: "0px", 
        background: "none", 
        padding: "0px"
      }}>
        {title}
    </Link>

  </div>
};


          this.tree = <div className="tree" style={{ paddingLeft: "1em" }}>
        <TreeView
          containerId={treeContainerId}
          containerType={treeContainerType}
          loading={!this.folders_loaded || !this.branches_loaded || !this.urls_loaded}
          parentsInfo={treeParentsInfo}
          childrenInfo={treeChildrenInfo}
          treeNodeIcons={TreeIcons}
          currentDraggedObject={this.state.currentDraggedObject}
          onDragStart={this.onTreeDragStart}
          onDragEnd={this.onTreeDragEnd}
          onDraggableDragOver={this.onTreeDraggableDragOver}
          onDropEnter={this.onTreeDropEnter}
          onDrop={this.onTreeDrop}
          directoryData={[...this.state.directoryStack]}
          parentNodeItem={TreeNodeItem}
          leafNodeItem={TreeNodeItem}
          specialNodes={this.tempSet}
          // specialNodes={new Set(this.tempSet).add(selectedItem.parentId)}
          treeStyles={{
            specialChildNode: {
              "title": { color: "#2675ff" },
              "frame": { color: "#2675ff", background: "#e6efff", paddingLeft: "5px", borderRadius: "0 50px 50px 0" },
            },
            specialParentNode: {
              "title": { color: "#2675ff", background: "#e6efff", paddingLeft: "5px", borderRadius: "0 50px 50px 0" },
            },
            // parentNode: {
            //   "node": { background: "rgba(58,172,144)" },
            // },
            emptyParentExpanderIcon: <span></span>,
          }}
          onLeafNodeClick={(id, type) => {
            // get path to item
            const dataSource = this.getDataSource(treeContainerId, treeContainerType);
            const itemParentId = dataSource[type][id]["parentId"];
            const pathToSelectedFolder = itemParentId == "root" ? [] : this.getPathToFolder(itemParentId, treeParentsInfo);
            // select item and switch to directory            
            this.setState({
              selectedItems: [id],
              selectedItemsType: [type],
              directoryStack: pathToSelectedFolder
            })
            this.setState({ selectedItems: [id], selectedItemsType: [type] })
            this.tempSet.clear()
            this.tempSet.add(id);
            this.customizedTempSet.clear();
            this.customizedTempSet.add(itemParentId);
            this.forceUpdate();
          }}
          onLeafNodeDoubleClick={(id, type) => {
            const dataSource = this.getDataSource(treeContainerId, treeContainerType);
            const itemParentId = dataSource[type][id]["parentId"];
            const pathToSelectedFolder = itemParentId == "root" ? [] : this.getPathToFolder(itemParentId, treeParentsInfo);      
            this.setState({
              selectedItems: [id],
              selectedItemsType: [type],
              directoryStack: pathToSelectedFolder
            })

            this.customizedTempSet.clear();
            this.customizedTempSet.add(itemParentId);
            this.handleContentItemDoubleClick([id]);
          }}

          onParentNodeClick={(id, type) => {
            // get path to item
            let pathToSelectedFolder = this.getPathToFolder(id, treeParentsInfo);
            // select item and switch to directory            
            this.setState({
              selectedItems: [id],
              selectedItemsType: [type],
              directoryStack: pathToSelectedFolder
            })
            this.customizedTempSet.clear();
            this.customizedTempSet.add(id);
            this.tempSet.clear();
            this.tempSet.add(id);
            this.setState({});
            this.forceUpdate();
          }}
          onParentNodeDoubleClick={(id) => {
            // openSubtree
          }}
        />
    </div>

const TreeNodeItemSplit = ({title, icon}) => {
return <div>
  {icon}
  <span style={{
    verticalAlign: 'middle',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  }}
  >{title}</span>
</div>
};
  
    this.splitPanelTree =  <div className="tree" style={{ paddingLeft: "1em" }}>
      <TreeView
        containerId={treeContainerId}
        containerType={treeContainerType}
        loading={!this.folders_loaded || !this.branches_loaded || !this.urls_loaded}
        parentsInfo={treeParentsInfo}
        childrenInfo={treeChildrenInfo}
        parentNodeItem={TreeNodeItemSplit}
        leafNodeItem={TreeNodeItemSplit}
        treeNodeIcons={TreeIcons}
        currentDraggedObject={this.state.splitPanelCurrentDraggedObject}
        onDragStart={this.onTreeDragStart}
        onDragEnd={this.onTreeDragEnd}
        onDraggableDragOver={this.onTreeDraggableDragOver}
        onDropEnter={this.onTreeDropEnter}
        onDrop={this.onTreeDrop}
        directoryData={[...this.state.splitPanelDirectoryStack]}
        specialNodes={this.tempSet}
        treeStyles={{
          specialChildNode: {
            "title": { color: "#2675ff" },
            "frame": { color: "#2675ff", background: "#e6efff", paddingLeft: "5px", borderRadius: "0 50px 50px 0" },
          },
          specialParentNode: {
            "title": { color: "#2675ff", background: "#e6efff", paddingLeft: "5px", borderRadius: "0 50px 50px 0" },
          },
          emptyParentExpanderIcon: <span></span>
        }}
        onLeafNodeClick={(id, type) => {
          // get path to item
          const dataSource = this.getDataSource(treeContainerId, treeContainerType);
          const itemParentId = dataSource[type][id]["parentId"];
          const pathToSelectedFolder = itemParentId == "root" ? [] : this.getPathToFolder(itemParentId);
          // select item and switch to directory            
          this.setState({
            splitPanelSelectedItems: [id],
            splitPanelSelectedItemsType: [type],
            splitPanelDirectoryStack: pathToSelectedFolder
          })
          this.setState({ splitPanelSelectedItems: [id], splitPanelSelectedItemsType: [type] })
          this.tempSet = new Set([id]);
          this.forceUpdate()
        }}
        onParentNodeClick={(id, type) => {
          // get path to item
          let pathToSelectedFolder = this.getPathToFolder(id);
          // select item and switch to directory            
          this.setState({
            splitPanelSelectedItems: [id],
            splitPanelSelectedItemsType: [type],
            splitPanelDirectoryStack: pathToSelectedFolder
          })
          this.tempSet = new Set([id]);
          this.setState({})
          this.forceUpdate()
        }}
        onParentNodeDoubleClick={(id) => {
          // openSubtree
        }}
      />
    </div>

    // let customizedContentTreeParentInfo = {"root": {}};
    // let customizedContentTreeChildrenInfo = {};
    
    // if (treeParentsInfo && treeChildrenInfo) {
    //   customizedContentTreeParentInfo = JSON.parse(JSON.stringify({...this.userFolderInfo})),
    //   customizedContentTreeChildrenInfo = JSON.parse(JSON.stringify({ ...this.userContentInfo, ...this.userUrlInfo }))
    //   customizedContentTreeParentInfo.root.title = "Content";
    //   customizedContentTreeParentInfo.root.childContent = [];
    // }

    let contentParentInfo = treeParentsInfo || {};
    if (!!Object.keys(this.state.userFolderInfo).length) {
      contentParentInfo = this.state.userFolderInfo
    }
    let coursesParentInfo = treeParentsInfo;
    if (!!Object.keys(this.state.userFolderInfo).length) {
      coursesParentInfo = this.state.userFolderInfo
    }
    let customizedContentTreeParentInfo = JSON.parse(JSON.stringify(contentParentInfo));
    let customizedContentTreeChildrenInfo = JSON.parse(JSON.stringify(treeChildrenInfo));
    if (!!Object.keys(customizedContentTreeParentInfo).length) {
      customizedContentTreeParentInfo["root"]["title"] = "Content";
      customizedContentTreeParentInfo["root"]["childContent"] = [];
    }
    for (let key in customizedContentTreeParentInfo) {
      if (key !== 'root') {
        customizedContentTreeParentInfo[key].childContent = [];
        // customizedContentTreeParentInfo[key].childFolders = [];
        customizedContentTreeParentInfo[key].childUrls = [];
      }
    }

    let customizedCoursesTreeParentInfo = {
      root: {
        title: "Courses",
        type: "folder",
        parentId: "root",
        childFolders: [],
        childContent: [],
        childUrls: [],
      }
    };
    let customizedCoursesTreeChildrenInfo = { ...this.courseInfo };
    for (let key in customizedCoursesTreeChildrenInfo) {
      customizedCoursesTreeChildrenInfo[key].parentId = 'root';
      customizedCoursesTreeChildrenInfo[key].rootId = 'root';
      customizedCoursesTreeChildrenInfo[key].title = customizedCoursesTreeChildrenInfo[key]['courseCode'];
      customizedCoursesTreeChildrenInfo[key].type = 'content';
      customizedCoursesTreeParentInfo['root']['childContent'].push(key);
    }



const customizedTreeNodeItem = (nodeItem, item) => {
      const { title, icon } = nodeItem
      const contentInfo = customizedContentTreeParentInfo
      const coursesInfo = { ...customizedCoursesTreeChildrenInfo, ...customizedCoursesTreeParentInfo }
      const folderInfo = item === 'content' ? contentInfo : coursesInfo
      const currentInfo = Object.keys(folderInfo).filter((i) => folderInfo[i].title === title)
      const { parentId } = folderInfo[currentInfo[0]]
      const parentTitle = folderInfo[parentId]?.title
      // const path = (parentTitle === 'Content' || parentTitle === 'Courses') ? title : `${parentTitle}/${title}`
      const path = (parentTitle === 'Content' || parentTitle === 'Courses') ? currentInfo[0] : `${parentId}/${currentInfo[0]}`
      
      return <div>
        {icon}
        <Link 
          to={`/${item === 'content' ? 'content' : 'courses'}/${path}`} 
          style={{ 
            color: 'white', 
            textDecoration: 'none', 
            paddingLeft: "5px", 
            fontSize: "16px",
            fontWeight:"700"
          }}>
            {title}
        </Link>

      </div>
    };
    this.customizedTree = <div className="tree-column">
      <Accordion>
        <div label="CONTENT" activeChild={this.state.contentActiveChild}>
          <TreeView
            containerId={treeContainerId}
            containerType={treeContainerType}
            loading={!this.folders_loaded || !this.branches_loaded || !this.urls_loaded}
            parentsInfo={customizedContentTreeParentInfo}
            childrenInfo={{}}
            specialNodes={this.customizedTempSet}
            hideRoot={true}
            parentNodeItem={(node) => customizedTreeNodeItem(node, 'content')}
            leafNodeItem={(node) => customizedTreeNodeItem(node, 'content')}
            treeNodeIcons={(itemType) => {
              let map = {
              }
              return map[itemType]
            }}

            treeStyles={{
        
              parentNode: {
                "title": { color: "white" , paddingLeft:'5px'},
                "node":{
                  width:"100%",
                  height:"2.6em"
                },
              },
              childNode: {
                "title": {
                  color:"white",
                  paddingLeft: "5px"
                },
                "node":{
                  backgroundColor:"rgba(192, 220, 242,0.3)",
                  color: "white",
                  // marginRight:"10px",
                  borderLeft:'8px solid #1b216e',
                  height:"2.6em",
                  width:"100%"
                }
              },
              specialChildNode: {
                "title": { color: "gray" },
              },
              specialParentNode: {
                "title": {
                  color:"white",
                  paddingLeft: "5px"
                },
                "node":{
                  backgroundColor:"rgba(192, 220, 242,0.3)",
                  color: "white",
                  // marginRight:"10px",
                  borderLeft:'8px solid #1b216e',
                  height:"2.6em",
                  width:"100%"
                }
              },

              emptyParentExpanderIcon: {
                opened: <FontAwesomeIcon  
                style={{
                  padding: '1px',
                  width: '1.3em',
                  height: '1.2em',
                  border: "1px solid darkblue",
                  borderRadius: '2px',
                  marginLeft: "5px"

                }} 
                icon={faChevronDown}/>,
                closed: <FontAwesomeIcon  
                style={{
                  padding: '1px',
                  width: '1.3em',
                  height: '1.2em',
                  border: "1px solid darkblue",
                  borderRadius: '2px',
                  marginLeft: "5px"

                }}
                icon={faChevronRight}/>,
              },
              // <span style={{ padding: '5px' }}></span>,
              expanderIcons: {
                opened: <FontAwesomeIcon icon={faChevronDown}
                  style={{
                    padding: '1px',
                    width: '1.3em',
                    height: '1.2em',
                    border: "1px solid darkblue",
                    borderRadius: '2px',
                    marginLeft: "5px"

                  }}
                />,
                closed: <FontAwesomeIcon icon={faChevronRight}
                  style={{
                    padding: '1px',
                    width: '1.3em',
                    height: '1.2em',
                    border: "1px solid darkblue",
                    borderRadius: "2px",
                    marginLeft: "5px"
                  }} />,
              }

            }}
              onLeafNodeClick={(nodeId) => {
                if (this.tempSet.has(nodeId)) this.tempSet.delete(nodeId);
                else this.tempSet.add(nodeId);
                this.forceUpdate();
              }}
              onParentNodeClick={(nodeId) => {
                this.customizedTempSet.clear();
                this.customizedTempSet.add(nodeId);
                this.tempSet.clear();
                this.tempSet.add(nodeId);
                this.goToFolder(nodeId, customizedContentTreeParentInfo);
                if (!this.state.splitPanelLayout) {
                  this.splitPanelGoToFolder(nodeId, customizedContentTreeParentInfo);
                }
                this.setState({ contentActiveChild: true });
                this.forceUpdate();
              }}
              onDropEnter={this.onLeftNavDropEnter}
              onDrop={this.onLeftNavDrop}
            />
          </div>
        </Accordion>
        <Accordion>
          <div label="COURSES" activeChild={this.state.courseActiveChild}>
            <TreeView
              containerId={treeContainerId}
              containerType={treeContainerType}
              loading={!this.folders_loaded || !this.branches_loaded || !this.urls_loaded}
              parentsInfo={customizedCoursesTreeParentInfo}
              childrenInfo={customizedCoursesTreeChildrenInfo}
              hideRoot={true}
              specialNodes={this.customizedTempSet}
              parentNodeItem={(node) => customizedTreeNodeItem(node, 'course')}
              leafNodeItem={(node) => customizedTreeNodeItem(node, 'course')}
              treeNodeIcons={(itemType) => {
                let map = {
                }
                return map[itemType]
              }}
              treeStyles={{
                parentNode: {
                  "title": { color: "white" , paddingLeft:'5px'},
                  "node":{
                    width:"100%",
                    height:"30px"
                  },
             
                },
                childNode: {
                  "title": {
                    color:"white",
                    paddingLeft: "5px"
                  },
                  "node":{
                    backgroundColor:"rgba(192, 220, 242,0.3)",
                    color: "white",
                    // marginRight:"10px",
                    borderLeft:'8px solid #1b216e',
                    height:"30px",
                    width:"100%"
                  }
                },
                specialChildNode: {
                },
                specialParentNode: {
                  "title": { color: "#d9eefa", background: "#e6efff", paddingLeft: "5px" },
                },
                // expanderIcon: <FontAwesomeIcon icon={faFolderOpen} style={{ paddingRight: "8px" }} />
              }}
              onLeafNodeClick={(nodeId) => {
                if (this.tempSet.has(nodeId)) this.tempSet.delete(nodeId);
                else this.tempSet.add(nodeId);
                // this.selectDrive("Courses", nodeId)
                this.forceUpdate();

                // this.tempSet.clear();
                // this.tempSet.add(nodeId);
              }}
              onParentNodeClick={(nodeId, type) => {
                this.customizedTempSet.clear();
                this.customizedTempSet.add(nodeId);
                // this.tempSet.clear();
                // this.tempSet.add(nodeId);
                this.goToFolder(nodeId, customizedCoursesTreeParentInfo);

                this.setState({courseActiveChild: true});
                this.forceUpdate()

                // this.tempSet.clear();
                // this.tempSet.add(nodeId);
              }}
              onParentNodeDoubleClick={(nodeId) => {
                ////console.log(`${nodeId} double clicked!`)
              }}
            />
          </div>
        </Accordion>
      </div>
     // console.log('branch id info', this.branchId_info);
      this.mainSection = (history) => (<React.Fragment>
        <DoenetBranchBrowser
          loading={loading}
          containerId={browserContainerId}
          allFolderInfo={browserFolderInfo}
          allContentInfo={browserContentInfo}
          allUrlInfo={browserUrlInfo}
          folderList={folderList}
          contentList={contentList}
          urlList={urlList}
          ref={this.browser}         
          key={"browser" + this.updateNumber}                     
          selectedDrive={this.state.selectedDrive}                
          selectedCourse={this.state.selectedCourse}             
          allCourseInfo={this.courseInfo}                        
          updateSelectedItems={this.updateSelectedItems}    
          handleContentItemDoubleClick={this.handleContentItemDoubleClick}          // optional
          updateDirectoryStack={this.updateDirectoryStack}       
          addContentToFolder={this.addContentToFolder}           
          addContentToRepo={this.addContentToRepo}               
          removeContentFromCourse={this.removeContentFromCourse} 
          removeContentFromFolder={this.removeContentFromFolder} 
          directoryData={this.state.directoryStack}              
          selectedItems={this.state.selectedItems}               
          selectedItemsType={this.state.selectedItemsType}       
          renameFolder={this.renameFolder}                       
          openEditCourseForm={() => this.toggleFormModal(ChooserConstants.EDIT_COURSE_INFO_MODE)}
          publicizeRepo={this.publicizeRepo}                     
          onDragStart={this.onBrowserDragStart}
          onDragEnd={this.onBrowserDragEnd}
          onDraggableDragOver={() => { }}
          onDropEnter={this.onBrowserDropEnter}
          onDrop={this.onBrowserDrop}
          onFolderDrop={this.onBrowserFolderDrop}
          history={history}
        />
      </React.Fragment>)

////console.log('branch id onfo 2 ',this.branchId_info);
    this.splitPanelMainSection = (history) => (<React.Fragment>
      <DoenetBranchBrowser
        loading={!this.folders_loaded || !this.branches_loaded || !this.urls_loaded}
        containerId={"browser"}
        allContentInfo={this.branchId_info}
        allFolderInfo={this.folderInfo}
        allUrlInfo={this.urlInfo}
        folderList={folderList}
        contentList={contentList}
        urlList={urlList}
        ref={this.browserSec}                                      // optional
        key={"browserSec" + this.updateNumber}                       // optional
        selectedDrive={this.state.selectedDrive}                // optional
        selectedCourse={this.state.selectedCourse}              // optional
        allCourseInfo={this.courseInfo}                         // optional
        updateSelectedItems={this.splitPanelUpdateSelectedItems}          // optional
        updateDirectoryStack={this.splitPanelUpdateDirectoryStack}        // optional
        addContentToFolder={this.addContentToFolder}            // optional
        addContentToRepo={this.addContentToRepo}               // optional
        removeContentFromCourse={this.removeContentFromCourse}  // optional
        removeContentFromFolder={this.removeContentFromFolder}  // optional                  
        directoryData={this.state.splitPanelDirectoryStack}               // optional
        selectedItems={this.state.splitPanelSelectedItems}                // optional
        selectedItemsType={this.state.splitPanelSelectedItemsType}        // optional
        renameFolder={this.renameFolder}                        // optional
        openEditCourseForm={() => this.toggleFormModal(ChooserConstants.EDIT_COURSE_INFO_MODE)} // optional
        publicizeRepo={this.publicizeRepo}                      // optional
        onDragStart={this.onSplitPanelBrowserDragStart}
        onDragEnd={this.onSplitPanelBrowserDragEnd}
        onDraggableDragOver={() => { }}
        // onDropEnter={this.onSplitPanelBrowserDropEnter}
        // onDrop={this.onSplitPanelBrowserDrop}
        onFolderDrop={this.onSplitPanelBrowserFolderDrop}
        history={history}
      />
    </React.Fragment>)
    

    const newItemButton = <div id="newContentButtonContainer">
      <div id="newContentButton" data-cy="newContentButton" onClick={this.toggleNewButtonMenu}>
        <FontAwesomeIcon icon={faPlus} style={{ "fontSize": "21px", "color": "#43aa90" }} />
        <span>New</span>
        {this.state.showNewButtonMenu &&
          <div id="newContentButtonMenu" data-cy="newContentMenu">
            <div className="newContentButtonMenuSection">
              <div className="newContentButtonMenuItem" onClick={this.handleNewDocument} data-cy="newDocumentButton">
                <FontAwesomeIcon icon={faFileAlt} style={{ "fontSize": "18px", "color": "#a7a7a7", "marginRight": "18px" }} />
                <span>DoenetML</span>
              </div>
              <div className="newContentButtonMenuItem" onClick={() => this.toggleFormModal(ChooserConstants.CREATE_URL_MODE)} data-cy="newUrlButton">
                <FontAwesomeIcon icon={faLink} style={{ "fontSize": "18px", "color": "#a7a7a7", "marginRight": "18px" }} />
                <span>URL</span>
              </div>
              <div className="newContentButtonMenuItem" onClick={this.handleNewFolder} data-cy="newFolderButton">
                <FontAwesomeIcon icon={faFolder} style={{ "fontSize": "18px", "color": "#a7a7a7", "marginRight": "18px" }} />
                <span>Folder</span>
              </div>
              <div className="newContentButtonMenuItem" onClick={this.handleNewRepo} data-cy="newRepoButton">
                <FontAwesomeIcon icon={faFolder} style={{ "fontSize": "18px", "color": "#3aac90", "marginRight": "18px" }} />
                <span>Repository</span>
              </div>
            </div>
            <div className="newContentButtonMenuSection">
              <div className="newContentButtonMenuItem" onClick={() => this.toggleFormModal(ChooserConstants.CREATE_COURSE_MODE)} data-cy="newCourseButton">
                <FontAwesomeIcon icon={faChalkboard} style={{ "fontSize": "16px", "color": "#a7a7a7", "marginRight": "13px" }} />
                <span>Course</span>
              </div>
            </div>
          </div>}
      </div>
    </div>


    let buttonGroupData = [{
      label: '',
      icon: faAlignJustify,
      value: 'browser',
      default: true
    }, {
      label: '',
      icon: faStream,
      value: 'tree',
      default: false
    }];
    let splitPanelButtonGroupData = [{
      label: '',
      icon: faAlignJustify,
      value: 'browser',
      default: true
    }, {
      label: '',
      icon: faStream,
      value: 'tree',
      default: false
    }];
    buttonGroupData.map(b => b.default = b.value === this.state.panelsCollection.first.activeContainer);
    splitPanelButtonGroupData.map(b => b.default = b.value === this.state.splitPanelsCollection.second.activeContainer);
    const switchPanelButton = <ButtonGroup clickCallBack={this.switchPanelContainer} data={buttonGroupData}></ButtonGroup>
    const splitSwitchPanelButton = <ButtonGroup clickCallBack={this.splitSwitchPanelContainer.bind(this)} data={splitPanelButtonGroupData}></ButtonGroup>
    const splitPanelButton = <button style={{ background: "none", border: "none", cursor: "pointer", outline: "none", height: "20px" }}>
      <FontAwesomeIcon onClick={() => this.toggleSplitPanel()} icon={faColumns} style={{ fontSize: "17px" }} />
    </button>;
    let courses = [];
    for (let key in this.courseInfo) {
      courses.push({
        label: this.courseInfo[key].title,
        value: this.courseInfo[key].courseCode,
        icon: faDotCircle,
        path: this.getFolderPath(key, this.courseInfo),
        callback: this.handleSplitPanelDropdownCallback
      })
    }

    let content = [];
    for (let key in this.userFolderInfo) {
      if (key !== 'root' && this.userFolderInfo[key].parentId === 'root') {
        content.push({
          label: this.userFolderInfo[key].title,
          value: key,
          icon: faFolderOpen,
          path: this.getFolderPath(key, this.userFolderInfo),
          callback: this.handleSplitPanelDropdownCallback
        })
      }
    }
    const dropdownData = [
      {
        parent: {
          title: 'Content'
        },
        children: content
      },
      {
        parent: {
          title: 'Courses'
        },
        children: courses
      }
    ];

    const dropDownSelectButton = <DropDownSelect data={dropdownData} />

    const testSaveContentTreeButton = <button style={{ background: "none", border: "none", cursor: "pointer", outline: "none" }}>
      <FontAwesomeIcon onClick={() => this.saveContentTree({ folderInfo: this.userFolderInfo })} icon={faEdit} style={{ fontSize: "17px" }} />
    </button>;

    const navigationPanelMenuControls = [newItemButton];
    // const mainPanelMenuControls = [switchPanelButton];
    const mainPanelMenuControls = [switchPanelButton];
    const middlePanelMenuControls = [splitPanelButton];
    const rightPanelMenuControls = [dropDownSelectButton, splitSwitchPanelButton];
    const createMiddlePanelContent = (props) => {      
      const { match, location, history } = props
      const extURL = location.pathname.replace(match.url, '')
      // console.log('match', match, location.pathname, extURL, extURL.split('/').map(i => i));
      this.history = history
      return (
        <ToolLayoutPanel
          panelName="Main Panel"
          splitPanel={this.state.splitPanelLayout}
          panelHeaderControls={[mainPanelMenuControls, navigationPanelMenuControls, middlePanelMenuControls]}
          disableSplitPanelScroll={[true, false]}
          key={'middle'}
        >
          <MainPanel
            initialContainer="browser"
            activeContainer={this.state.panelsCollection["first"].activeContainer}
            containersData={[
              { name: "browser", container: this.mainSection(history) },
              { name: "tree", container: this.tree },
            ]}
            path={match.params.leftNavRoute}
            keyProp={'mainPanel'}
          />
          <SplitLayoutPanel
            defaultVisible={false}
            keyProp={'splitMainPanel'}
            panelHeaderControls={[rightPanelMenuControls, <button style={{ height: '24px', padding: '1px' }} onClick={() => this.toggleSplitPanel()}><FontAwesomeIcon icon={faTimesCircle} style={{ fontSize: "20px", height: '20px', padding: '2px' }} /></button>]}>
            <SplitPanelMainContent
              initialContainer="browser"
              activeContainer={this.state.splitPanelsCollection["second"].activeContainer}
              containersData={[
                { name: "browser", container: this.splitPanelMainSection(history) },
                { name: "tree", container: this.splitPanelTree },
              ]}
              path={match.params.leftNavRoute}
            />
          </SplitLayoutPanel>
        </ToolLayoutPanel>)
    };
    

    return (<React.Fragment>
      <ToastProvider>
        <this.ToastWrapper />
        <Overlay 
             open={this.state.modalOpen} 
             name="Editor"
             header= {this.state.modalHeaderTitle}
             body={ this.state.modalOpen && this.createModalContent() }
          onClose={this.overlayOnClose.bind(this)} />
        <Router>
          <ToolLayout
            toolName="Chooser"
            leftPanelWidth="235"
            rightPanelWidth="365"
          >

            <ToolLayoutPanel panelName="Navigation Panel" key={'left'}>
              <div style={{width:"100%"}}>
                <div style={{ padding: "10px", marginBottom: "30px" }}>
                  <input
                    className="search-input"
                    onChange={this.handleLeftNavSearch.bind(this)}
                    placeholder="Search..."
                    style={{ minHeight: "40px", padding: "10px" , width:"100%"}}
                  />
                </div>

                {this.customizedTree}
              </div>
            </ToolLayoutPanel>


            <Switch>
              <Route exact path="/" render={(props) => createMiddlePanelContent(props)} />
              <Route path="/content/" render={(props) => createMiddlePanelContent(props)} />
              {
                [ ...Array(10).keys() ].map((i) => {
                  return <Route path={`/content/${[ ...Array(i).keys() ].map((item) => `:level${item + 1}`).join('/')}`} render={(props) => createMiddlePanelContent(props)} />
                })
              }
              <Route path="/courses/" render={(props) => createMiddlePanelContent(props)} />
              {
                [ ...Array(10).keys() ].map((i) => {
                  return <Route path={`/courses/${[ ...Array(i).keys() ].map((item) => `:level${item + 1}`).join('/')}`} render={(props) => createMiddlePanelContent(props)} />
                })
              }
            </Switch>

          <ToolLayoutPanel panelName="Info Panel" key={'right'}>
            <InfoPanel
              selectedItems={this.state.selectedItems}
              selectedItemsType={this.state.selectedItemsType}
              selectedDrive={this.state.selectedDrive}
              selectedCourse={this.state.selectedCourse}
              allFolderInfo={browserFolderInfo}
              allContentInfo={browserContentInfo}
              allUrlInfo={browserUrlInfo}
              allCourseInfo={this.courseInfo}
              publicizeRepo={this.publicizeRepo}
              grantRepoAccess={this.grantRepoAccess}
              revokeRepoAccess={this.revokeRepoAccess}
              openEditCourseForm={() => this.toggleFormModal(ChooserConstants.EDIT_COURSE_INFO_MODE)} // optional
              openEditUrlForm={() => this.toggleFormModal(ChooserConstants.EDIT_URL_INFO_MODE)}
              versionCallback={this.versionCallback.bind(this)}
            />
          </ToolLayoutPanel>
        </ToolLayout>
        </Router>
      </ToastProvider>
    </React.Fragment>);

  }
}

const MainPanel = ({ panelId, initialContainer, activeContainer, containersData, keyProp }) => {
  return <div className="mainPanel" key={keyProp}>
    <SwitchableContainers initialValue={initialContainer} currentValue={activeContainer}>
      {containersData.map((containerData) => {
        return <SwitchableContainerPanel name={containerData.name}>
          {containerData.container}
        </SwitchableContainerPanel>
      })}
    </SwitchableContainers>
  </div>;
}

const SplitPanelMainContent = ({ panelId, initialContainer, activeContainer, containersData, path }) => {

  return <div className="mainPanel">
    <SwitchableContainers initialValue={initialContainer} currentValue={activeContainer}>
      {containersData.map((containerData) => {
        return <SwitchableContainerPanel name={containerData.name}>
          {containerData.container}
        </SwitchableContainerPanel>
      })}
    </SwitchableContainers>
  </div>;
}

const TreeIcons = ({iconName, isPublic}) => {
  const FolderIcon = <FontAwesomeIcon className="treeNodeIcon" icon={faFolder}
    style={{
      fontSize: "16px",
      color: "#737373",
      position: "relative",
      top: "2px",
      marginRight: "8px",
    }}
  />;
  const RepoIcon = <FontAwesomeIcon className="treeNodeIcon" icon={faFolder}
    style={{
      fontSize: "16px",
      color: "#3aac90",
      position: "relative",
      top: "2px",
      marginRight: "8px",
    }}
  />;
  const ContentIcon = <FontAwesomeIcon className="treeNodeIcon" icon={faFileAlt}
    style={{
      fontSize: "16px",
      color: "#3D6EC9",
      marginRight: "8px",
    }}
  />;
  const UrlIcon = <FontAwesomeIcon className="treeNodeIcon" icon={faLink}
    style={{
      fontSize: "16px",
      color: "#a7a7a7",
      marginRight: "8px",
    }}
  />;
  const HeadingIcon = <FontAwesomeIcon className="treeNodeIcon" icon={faFolder}
    style={{
      fontSize: "16px",
      color: "#a7a7a7",
      position: "relative",
      top: "2px",
      marginRight: "8px",
    }}
  />;
  const AssignmentIcon = <FontAwesomeIcon className="treeNodeIcon" icon={faFileAlt}
    style={{
      fontSize: "16px",
      color: "#a7a7a7",
      marginRight: "8px",
    }}
  />;
  const PublicRepoIcon = <FontAwesomeIcon className="treeNodeIcon" icon={faFolderOpen}
    style={{
      fontSize: "16px",
      color: "#3aac90",
      position: "relative",
      top: "2px",
      marginRight: "8px",
    }}
  />;
  const PublicFolderIcon = <FontAwesomeIcon className="treeNodeIcon" icon={faFolder}
    style={{
      fontSize: "16px",
      color: "#3aac90",
      position: "relative",
      top: "2px",
      marginRight: "8px",
    }}
  />;
  const PublicUrlIcon = <FontAwesomeIcon className="treeNodeIcon" icon={faLink}
    style={{
      fontSize: "16px",
      color: "#3aac90",
      marginRight: "8px",
    }}
  />;
  const PublicContentIcon = <FontAwesomeIcon className="treeNodeIcon" icon={faFileAlt}
    style={{
      fontSize: "16px",
      color: "#3aac90",
      marginRight: "8px",
    }}
  />;

  switch (iconName) {
    case "folder":
      return isPublic ? PublicFolderIcon : FolderIcon;
    case "repo":
      return isPublic ? PublicRepoIcon : RepoIcon;
    case "content":
      return isPublic ? PublicContentIcon : ContentIcon;
    case "url":
      return isPublic ? PublicUrlIcon : UrlIcon;
    case "header":
      return HeadingIcon;
    case "assignment":
      return AssignmentIcon;
    default:
      return <span></span>;
  }
};

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
      roles: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.addRole = this.addRole.bind(this);
  }

  componentDidMount() {
    if (this.props.mode == ChooserConstants.EDIT_COURSE_INFO_MODE && this.props.selectedCourseInfo !== null) {
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
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    let term = this.state.semester + " " + this.state.year;
    if (this.props.mode == ChooserConstants.CREATE_COURSE_MODE) {
      let courseId = nanoid();
      this.props.handleNewCourseCreated({
        courseName: this.state.courseName,
        courseId: courseId,
        courseCode: this.state.courseCode,
        term: term,
        description: this.state.description,
        department: this.state.department,
        section: this.state.section,
      }, () => {
        event.preventDefault();
      });
    } else {
      this.props.saveCourse({
        courseName: this.state.courseName,
        courseId: this.props.selectedCourse,
        courseCode: this.state.courseCode,
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
    this.state.roles['role-' + timestamp] = role;
    this.setState({ roles: this.state.roles });
  }


  render() {
    return (
      <div id="formContainer">
        <div id="formTopbar">
          <div id="formBackButton" onClick={this.handleBack} data-cy="newCourseFormBackButton">
            <FontAwesomeIcon icon={faArrowCircleLeft} style={{ "fontSize": "17px", "marginRight": "5px" }} />
            <span>Back to Chooser</span>
          </div>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="formGroup-12">
            <label className="formLabel">COURSE NAME</label>
            <input className="formInput" required type="text" name="courseName" value={this.state.courseName}
              placeholder="Course name goes here." onChange={this.handleChange} data-cy="newCourseFormNameInput" />
          </div>
          <div className="formGroupWrapper">
            <div className="formGroup-4" >
              <label className="formLabel">DEPARTMENT</label>
              <input className="formInput" required type="text" name="department" value={this.state.department}
                placeholder="DEP" onChange={this.handleChange} data-cy="newCourseFormDepInput" />
            </div>
            <div className="formGroup-4">
              <label className="formLabel">COURSE CODE</label>
              <input className="formInput" required type="text" name="courseCode" value={this.state.courseCode}
                placeholder="MATH 1241" onChange={this.handleChange} data-cy="newCourseFormCodeInput" />
            </div>
            <div className="formGroup-4">
              <label className="formLabel">SECTION</label>
              <input className="formInput" type="number" name="section" value={this.state.section}
                placeholder="00000" onChange={this.handleChange} data-cy="newCourseFormSectionInput" />
            </div>
          </div>
          <div className="formGroupWrapper">
            <div className="formGroup-4" >
              <label className="formLabel">YEAR</label>
              <input className="formInput" required type="number" name="year" value={this.state.year}
                placeholder="2019" onChange={this.handleChange} data-cy="newCourseFormYearInput" />
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
              placeholder="Official course description here" onChange={this.handleChange} data-cy="newCourseFormDescInput" />
          </div>
          <div className="formGroup-12">
            <label className="formLabel">ROLES</label>
            <AddRoleForm addRole={this.addRole} />
            <RoleList roles={this.state.roles} />
          </div>
          <div id="formButtonsContainer">
            <button id="formSubmitButton" type="submit" data-cy="newCourseFormSubmitButton">
              <div className="formButtonWrapper">
                {this.props.mode == ChooserConstants.CREATE_COURSE_MODE ?
                  <React.Fragment>
                    <span>Create Course</span>
                    <FontAwesomeIcon icon={faPlusCircle} style={{ "fontSize": "20px", "color": "#fff", "cursor": "pointer", "marginLeft": "8px" }} />
                  </React.Fragment>
                  :
                  <React.Fragment>
                    <span>Save Changes</span>
                    <FontAwesomeIcon icon={faSave} style={{ "fontSize": "20px", "color": "#fff", "cursor": "pointer", "marginLeft": "8px" }} />
                  </React.Fragment>
                }
              </div>
            </button>
            <button id="formCancelButton" onClick={this.handleBack} data-cy="newCourseFormCancelButton">
              <div className="formButtonWrapper">
                <span>Cancel</span>
                <FontAwesomeIcon icon={faTimesCircle} style={{ "fontSize": "20px", "color": "#fff", "cursor": "pointer", "marginLeft": "8px" }} />
              </div>
            </button>
          </div>
        </form>
      </div>
    );
  }
}

function RoleList(props) {
  return (
    <div className="roleListContainer">
      <ul style={{ "fontSize": "16px" }}>{
        Object.keys(props.roles).map(function (key) {
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
    this.setState({ input: "" });
    event.preventDefault();
  };

  handleChange(event) {
    this.setState({ input: event.target.value });
  }

  render() {
    return (
      <div className="formGroup-4" style={{ "display": "flex" }}>
        <input className="formInput" type="text" value={this.state.input} onChange={this.handleChange}
          type="text" placeholder="Admin" />
        <button type="submit" style={{ "whiteSpace": "nowrap" }} onClick={this.addRole}>Add Role</button>
      </div>
    )
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
        <FilterForm show={this.state.showFilters} loadFilteredContent={this.props.loadFilteredContent} togglePanel={this.togglePanel} />
      </div>
    );
  }
}

const FilterForm = (props) => {

  let filterTypes = ["Content name", "Folder name", "Author", "Creation date"];

  let allowedOperators = {
    "Content name": ["IS LIKE", "IS NOT LIKE", "IS", "IS NOT"],
    "Folder name": ["IS LIKE", "IS NOT LIKE", "IS", "IS NOT"],
    "Author": ["IS", "IS NOT"],
    "Creation date": ["ON", "<", "<=", ">", ">="]
  }

  const [filters, setFilters] = useState([{ type: "Content name", operator: "IS LIKE", value: null }]);

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
    values.push({ type: "Content name", operator: "IS LIKE", value: null });
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
            {filter.type == "Creation date" ?
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
    if (this.props.mode == ChooserConstants.EDIT_URL_INFO_MODE && this.props.selectedUrlInfo !== null) {
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
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    if (this.props.mode == ChooserConstants.CREATE_URL_MODE) {
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
            <FontAwesomeIcon icon={faArrowCircleLeft} style={{ "fontSize": "17px", "marginRight": "5px" }} />
            <span>Back to Chooser</span>
          </div>
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="formGroup-12">
            <label className="formLabel">TITLE</label>
            <input className="formInput" required type="text" name="title" value={this.state.title}
              placeholder="Doenet Homepage" onChange={this.handleChange} data-cy="urlFormTitleInput" />
          </div>
          <div className="formGroup-12" >
            <label className="formLabel">URL</label>
            <input className="formInput" required type="text" name="url" value={this.state.url}
              placeholder="https://www.doenet.org/" onChange={this.handleChange} data-cy="urlFormUrlInput" />
          </div>
          <div className="formGroup-12">
            <label className="formLabel">DESCRIPTION</label>
            <textarea className="formInput" type="text" name="description" value={this.state.description}
              placeholder="URL description here" onChange={this.handleChange} data-cy="urlFormDescInput" />
          </div>
          <div className="formGroup-12" >
            <label className="formLabel" style={{ "display": "inline-block" }}>Uses DoenetML</label>
            <input className="formInput" type="checkbox" name="usesDoenetAPI" checked={this.state.usesDoenetAPI}
              onChange={this.handleChange} data-cy="urlFormUsesDoenetAPICheckbox" style={{ "width": "auto", "marginLeft": "7px" }} />
          </div>
          <div id="formButtonsContainer">
            <button id="formSubmitButton" type="submit" data-cy="urlFormSubmitButton">
              <div className="formButtonWrapper">
                {this.props.mode == ChooserConstants.CREATE_URL_MODE ?
                  <React.Fragment>
                    <span>Add New URL</span>
                    <FontAwesomeIcon icon={faPlusCircle} style={{ "fontSize": "20px", "color": "#fff", "cursor": "pointer", "marginLeft": "8px" }} />
                  </React.Fragment>
                  :
                  <React.Fragment>
                    <span>Save Changes</span>
                    <FontAwesomeIcon icon={faSave} style={{ "fontSize": "20px", "color": "#fff", "cursor": "pointer", "marginLeft": "8px" }} />
                  </React.Fragment>
                }
              </div>
            </button>
            <button id="formCancelButton" onClick={this.handleBack} data-cy="urlFormCancelButton">
              <div className="formButtonWrapper">
                <span>Cancel</span>
                <FontAwesomeIcon icon={faTimesCircle} style={{ "fontSize": "20px", "color": "#fff", "cursor": "pointer", "marginLeft": "8px" }} />
              </div>
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default withCookies(DoenetChooser);