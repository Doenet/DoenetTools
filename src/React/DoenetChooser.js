import React, { Component } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;
import crypto from 'crypto';
import nanoid from 'nanoid';
import "./chooser.css";
import DoenetHeader from './DoenetHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faDotCircle, faFileAlt, faEdit, faCaretRight, faCaretDown, 
  faChalkboard, faArrowCircleLeft, faTimesCircle, faPlusCircle, faCopy, faFolder,
  faMinusCircle} from '@fortawesome/free-solid-svg-icons';


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
    };

    const loadBranchesUrl='/api/loadAllBranches.php';
    
    axios.get(loadBranchesUrl,{})
    .then(resp=>{
      this.branchId_info = resp.data.branchId_info;
      this.sort_order = this.publishDate_sort_order = resp.data.sort_order;
      this.branches_loaded = true;
      this.forceUpdate();
    });

    this.loadAllFolders();
    this.loadAllCourses();

    this.branches_loaded = false;
    this.courses_loaded = false;
    this.folders_loaded =false;

    this.browser = React.createRef();

    this.handleNewDocument = this.handleNewDocument.bind(this);
    this.saveContentToServer = this.saveContentToServer.bind(this);
    this.getContentId = this.getContentId.bind(this);
    this.toggleAddCourseMenu = this.toggleAddCourseMenu.bind(this);
    this.saveCourse = this.saveCourse.bind(this);
    this.handleNewCourseCreated = this.handleNewCourseCreated.bind(this);
    this.handleNewFolder = this.handleNewFolder.bind(this);
    this.addNewFolder = this.addNewFolder.bind(this);
    this.addContentToFolder = this.addContentToFolder.bind(this);
    this.removeContentFromFolder = this.removeContentFromFolder.bind(this);
    this.addContentToCourse = this.addContentToCourse.bind(this);
    this.removeContentFromCourse = this.removeContentFromCourse.bind(this);
    this.updateSelectedItems = this.updateSelectedItems.bind(this);
  }

  buildCourseList() {
    this.courseList = [];
    for(let courseId of this.courseIds){
      let courseCode = this.courseInfo[courseId].courseCode;

      let classes = (this.state.selectedDrive === "Courses") && (courseId === this.state.selectedCourse) ? 
                      "leftNavPanelMenuItem activeLeftNavPanelMenuItem": "leftNavPanelMenuItem";
      this.courseList.push(
        <li className={classes} 
            key={courseCode}
            style={{"padding":"6px 1px 6px 5px","width": "90%"}}
            onClick={() => {
              this.setState({
                selectedItems: [],
                selectedItemsType: [],
                activeSection: "chooser",
                selectedDrive: "Courses",
                selectedCourse: courseId})}}>
            <FontAwesomeIcon className="menuDoughnutIcon" icon={faDotCircle}/>
            <span>{courseCode}</span>
            {this.state.selectedItems.length !== 0 &&
            <div className="addContentToCourseButtonWrapper">
              <FontAwesomeIcon icon={faPlus} className="addContentButton" 
              onClick={() => this.addContentToCourse(courseId, this.state.selectedItems, this.state.selectedItemsType)}/>
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
                    <span>Document</span>
                  </div>
                  <div className="newContentButtonMenuItem" onClick={this.handleNewFolder} data-cy="newFolderButton">
                    <FontAwesomeIcon icon={faFolder} style={{"fontSize":"18px", "color":"#a7a7a7", "marginRight":"18px"}}/>
                    <span>Folder</span>
                  </div>
                </div>
                <div className="newContentButtonMenuSection">
                  <div className="newContentButtonMenuItem" onClick={this.toggleAddCourseMenu} data-cy="newCourseButton">
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
            onClick={() => {
              this.setState({
                selectedItems: [],
                selectedDrive: "Content",
                activeSection: "chooser",
                directoryStack: []})}}>
            <FontAwesomeIcon className="menuDoughnutIcon" icon={faDotCircle}/>
            <span>Content</span>
          </div>
          <div className="leftNavPanelMenuItem">
            <Accordion>
              <div label="Courses">
                <ul style={{"paddingLeft":"20px"}}>
                  { this.courseList }
                </ul>
              </div>
            </Accordion>    
          </div>
        </div>        
      </div>
    </React.Fragment>
  }

  buildInfoPanel() {
    let itemTitle = "";
    let itemType = "";
    let itemDetails = {};
    let selectedItemId = "";
    let selectedItemType = "";
    // get all data needed to populate info panel
    if (this.state.selectedItems.length === 0) {
      // handle when no file selected, show folder/drive info
      if (this.state.selectedDrive === "Courses") {
        let courseId = this.state.selectedCourse;
        let courseName = this.courseInfo[courseId].courseName;
        let courseCode = this.courseInfo[courseId].courseCode;
        let term = this.courseInfo[courseId].term;
        let description = this.courseInfo[courseId].description;
        let department = this.courseInfo[courseId].department;
        let section = this.courseInfo[courseId].section;

        itemTitle = courseName;
        itemType = "Drive";
        itemDetails = {
          "Owner" : "Me",
          "Course Code" : courseCode,
          "Term": term,
          "Department": department,
          "Section": section,
          "Description": description, 
        }; 
      } else {
        itemTitle = "Content";
        itemType = "Drive";
        itemDetails = {
          "Owner" : "Me",
          "Modified" : "Today",
          "Published" : "Today",
        };
      }
    } else {
      // if file selected, show selectedFile/Folder info
      selectedItemId = this.state.selectedItems[this.state.selectedItems.length - 1];
      selectedItemType = this.state.selectedItemsType[this.state.selectedItemsType.length - 1];
      let itemInfoSource = this.branchId_info;
      if (selectedItemType === "folder") {
        itemInfoSource = this.folderInfo;
      }
      
      itemTitle = itemInfoSource[selectedItemId].title;  
      let pubDate = itemInfoSource[selectedItemId].publishDate; 

      itemDetails = {
        "Location" : "Content",
        "Owner" : "Me",
        "Published" : pubDate,
        "Related content" : ["-r2N80PgcHTX4233vX90Q", "ah5klZOjgjMpP24-WPsET", "pfDEeDobZ6y9MR9PpWkeY"]
      };
    }
    
    this.infoPanel = <React.Fragment>
      <div className="infoPanel">
        <div className="infoPanelTitle">
          <div className="infoPanelItemIcon">
            {selectedItemType === "content" ? 
              <FontAwesomeIcon icon={faFileAlt} style={{"fontSize":"18px", "color":"#3D6EC9"}}/> :
              selectedItemType === "folder" ?
              <FontAwesomeIcon icon={faFolder} style={{"fontSize":"18px", "color":"#737373"}}/> :
              <FontAwesomeIcon icon={faDotCircle} style={{"fontSize":"18px", "color":"#737373"}}/>}
          </div>
          <span>{ itemTitle }</span>
        </div>
        <div className="infoPanelPreview">
          <span>Preview</span>
          <FontAwesomeIcon icon={faFileAlt} style={{"fontSize":"100px", "color":"#bfbfbf"}}/>
        </div>
        <div className="infoPanelDetails">
          <table id="infoPanelDetailsTable">
            <tbody>
              {Object.keys(itemDetails).map(itemDetailsKey => {
                // populate table with selected item info / drive info  
                let itemDetailsValue = itemDetails[itemDetailsKey];
                // check if item has related content
                if (itemDetailsKey == "Related content") {
                  // flatten out and format related content
                  itemDetailsValue = [];
                  itemDetails[itemDetailsKey].map(relatedItemBranchID => {
                    let relatedItemTitle = this.branchId_info[relatedItemBranchID].title;
                    itemDetailsValue.push(
                      <div style={{"display":"block"}} key={"relatedItem" + relatedItemBranchID}>
                        <a href={`/editor?branchId=${relatedItemBranchID}`}>{ relatedItemTitle }</a>
                      </div>                      
                    ); 
                  });
                }
                return (
                <tr key={"contentDetailsItem" + itemDetailsKey}>
                  <td className="itemDetailsKey">{ itemDetailsKey }</td>
                  <td className="itemDetailsValue">{ itemDetailsValue }</td>
                </tr>)
              })}
            </tbody>
          </table>
          {selectedItemId && selectedItemType === "content" && 
          <div id="editContentButtonContainer">
            <div id="editContentButton" data-cy="editContentButton"
            onClick={()=> {window.location.href=`/editor?branchId=${selectedItemId}`}}>
              <FontAwesomeIcon icon={faEdit} style={{"fontSize":"25px", "color":"#43aa90"}}/>
              <span>Edit</span>
            </div>
          </div> }
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
      }
      // TODO: check if in any folder, true then append (> folderName)
      // if (this.state.currentDirectory !== null) {
      //   toolbarTitle += " > " + this.folderInfo[this.state.currentDirectory].title;
      // }
    } else if (this.state.activeSection === "add_course") {
      toolbarTitle = "Add New Course";
    }

    this.topToolbar = <React.Fragment>
      <div id="topToolbar">
        <span>{ toolbarTitle }</span>
      </div>
    </React.Fragment>
  }

  handleNewDocument(){
    let newBranchId = nanoid();
    // check if documentName already exists, true then append (1)?
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
      const loadBranchesUrl='/api/loadAllBranches.php';
      axios.get(loadBranchesUrl,{})
      .then((resp) => {
        // reload branches from database
        this.branchId_info = resp.data.branchId_info;
        this.sort_order = this.publishDate_sort_order = resp.data.sort_order;
        if (branchId in this.branchId_info) {
          // successfully created new document, set as selected and redirect to editor
          this.setState({selectedItems: [branchId], selectedItemType: ["content"]});
          window.location.href=`/editor?branchId=${branchId}`;
        }
        this.forceUpdate();
      });
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

  toggleAddCourseMenu() {
    if (this.state.activeSection !== "add_course") {
      this.setState({ activeSection: "add_course" });
    } else {
      this.setState({ activeSection: "chooser" });
    }
  }

  handleNewCourseCreated(courseId) {
    // reload list of courses
    this.loadAllCourses(() => {
      if (this.courseIds.includes(courseId)) {
        // successfully created new document, set as selected and redirect to editor
        this.setState({
          selectedItems: [],
          activeSection: "chooser",
          selectedCourse: courseId,
          selectedDrive: "Courses",
        });
        this.forceUpdate();
      } else {
        // TODO: Show warning message, failed to create course
        
      }
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

  saveCourse({courseId, courseName, courseCode, term, description, department, section}, callback=(()=>{})) {
    // create new documents for overview and syllabus, get branchIds
    let overviewId = nanoid();
    let overviewDocumentName = courseName + " Overview";
    this.saveContentToServer({
      documentName:overviewDocumentName,
      code:"",
      branchId:overviewId,
      publish:true
    });

    let syllabusId = nanoid();
    let syllabusDocumentName = courseName + " Syllabus";    
    this.saveContentToServer({
      documentName:syllabusDocumentName,
      code:"",
      branchId:syllabusId,
      publish:true
    });

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

  addContentToCourse(courseId, itemIds, itemTypes) {
    let operationType = "insert";
    this.saveCourseContent(courseId, itemIds, itemTypes, operationType ,(courseId) => {
      this.loadAllCourses();
    });
  }

  removeContentFromCourse(itemId) {
    let operationType = "remove";
    let courseId = this.state.selectedCourse;
    itemId = [itemId];
    this.saveCourseContent(courseId, "", itemId, [], operationType ,(courseId) => {
      this.loadAllCourses();
    });
  }

  saveFolder(folderId, title, childContent, childType, operationType, callback=(()=>{})) {
    // saveFolder.php
    const url='/api/saveFolder.php';
    const data={
      title: title,
      folderId: folderId,
      childContent: childContent,
      childType: childType,
      operationType: operationType,
    }
    axios.post(url, data)
    .then((resp) => {
      callback(folderId);
    })
    .catch(function (error) {
      this.setState({error:error});
    })
  }

  loadAllFolders(callback=(()=>{})) {
    const loadAllFoldersUrl='/api/loadAllFolders.php';
    const data={}
    const payload = {params: data}
    
    axios.get(loadAllFoldersUrl,payload)
    .then(resp=>{
      this.folderInfo = resp.data.folderInfo;
      this.folderIds = resp.data.folderIds;
      this.folders_loaded = true;
      callback();
      this.forceUpdate();
    });
  }

  addNewFolder(title) {
    let folderId = nanoid();
    this.saveFolder(folderId, title, [], (folderId) => {
      this.loadAllFolders(() => {
        if (this.folderIds.includes(folderId)) {
          // successfully created new folder, set as selected
          this.setState({
            selectedItems: [folderId],
            selectedItemsType: ["folder"]
          });
        }
      });
    });
  }

  addContentToFolder(childId, childType, folderId) {
    let operationType = "insert";
    let title = this.folderInfo[folderId];
    this.saveFolder(folderId, title, childId, childType, operationType ,(folderId) => {
      this.loadAllFolders();
    });
  }

  removeContentFromFolder(childId, folderId) {
    let operationType = "remove";
    let title = this.folderInfo[folderId];
    this.saveFolder(folderId, title, childId, [], operationType ,(folderId) => {
      this.loadAllFolders();
    });
  }

  handleNewFolder() {
    // TODO: let user input folder title
    let num = 1;
    let title = "New Folder " + num; 
    while (Object.values(this.folderInfo).filter(folder => folder.title.includes(title)).length != 0) {
      num++;
      title = "New Folder " + num; 
    }
    this.addNewFolder(title);
  }

  updateSelectedItems(selectedItems, selectedItemsType) {
    this.setState({
      selectedItems: selectedItems,
      selectedItemsType: selectedItemsType,
    })
  }

  getAllSelectedItems = () => {
    this.browser.current.getAllSelectedItems();
  }

  render(){

    if (!this.branches_loaded || !this.courses_loaded 
      || !this.folders_loaded){
      return <p>Loading...</p>
    }

    this.buildCourseList();
    this.buildLeftNavPanel();
    this.buildInfoPanel();
    this.buildTopToolbar();

    // setup mainSection to be chooser / NewCourseForm
    this.mainSection;
    if (this.state.activeSection === "add_course") {
      this.mainSection = <NewCourseForm 
                          handleBack={this.toggleAddCourseMenu}
                          handleNewCourseCreated={this.handleNewCourseCreated}
                          saveCourse={this.saveCourse}/>;
    } else {
      let folderList = [];
      let contentList = [];
      if (this.state.selectedDrive === "Content") {
        folderList = this.folderIds;
        contentList = this.sort_order;
      } else if (this.state.selectedDrive === "Courses") {
        folderList = this.courseInfo[this.state.selectedCourse].folders;
        contentList = this.courseInfo[this.state.selectedCourse].content;
      }

      // hide folders based on directory
      if (this.state.directoryStack.length !== 0) {
        let folderId = this.peekDirectoryStack();
        contentList = this.folderInfo[folderId].childContent;
        folderList = this.folderInfo[folderId].childFolder;
      }
      
      this.mainSection = <React.Fragment>
        <Browser
          ref={this.browser}  
          allContentInfo={this.branchId_info}
          allFolderInfo={this.folderInfo}
          folderList={folderList}
          contentList={contentList}
          updateSelectedItems={this.updateSelectedItems}
          selectedDrive={this.state.selectedDrive}
          addContentToFolder={this.addContentToFolder}
          removeContentFromFolder={this.removeContentFromFolder}/>
        {this.infoPanel}
      </React.Fragment>
    }

    return (<React.Fragment>
      <DoenetHeader toolTitle="Chooser" headingTitle={"Choose Branches"} />
      <div id="chooserContainer">
      {/* <button onClick={this.getAllSelectedItems}>Click</button> */}
        { this.leftNavPanel }
        { this.topToolbar }
        { this.mainSection }     
      </div>
    </React.Fragment>);
  }
}

class Browser extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      directoryStack: [],
      selectedItems: [],
      selectedItemsType: [],
    }

    // handle null props
    this.hideAddRemoveButtons = this.props.addContentToFolder === null
                     || this.props.removeContentFromFolder === null
                     || this.props.selectedDrive === null;
                     
    this.handleAddContentToFolder = this.handleAddContentToFolder.bind(this);
    this.handleRemoveContentFromCurrentFolder = this.handleRemoveContentFromCurrentFolder.bind(this);
    this.handleContentItemClick = this.handleContentItemClick.bind(this);
    this.handleContentItemDoubleClick = this.handleContentItemDoubleClick.bind(this);
    this.handleFolderDoubleClick = this.handleFolderDoubleClick.bind(this);
    this.upOneDirectory = this.upOneDirectory.bind(this);
    this.openFolder = this.openFolder.bind(this);
    this.pushDirectoryStack = this.pushDirectoryStack.bind(this);
    this.popDirectoryStack = this.popDirectoryStack.bind(this);
    this.peekDirectoryStack = this.peekDirectoryStack.bind(this);
    this.getAllSelectedItems = this.getAllSelectedItems.bind(this);
    this.flattenFolder = this.flattenFolder.bind(this);
  }

  getAllSelectedItems() {
    // let itemIds = [];
    // for (let i =0; i < this.state.selectedItemsType.length; i++) {
    //   if (this.state.selectedItemsType[i] === "folder") {
    //     // flatten folders to get all content
    //     itemIds.concat(this.flattenFolder(this.state.selectedItems[i]));
    //   } else {
    //     itemIds.push(this.state.selectedItems[i]);
    //   }
    // }
    // return itemIds;
    let selectedItems = {
      selectedContent: [],
      selectedFolders: []
    }

    this.state.selectedItems.forEach((itemId, i) => {
      if (this.state.selectedItemsType[i] === "folder") {
        selectedItems.selectedFolders.push(itemId);
      } else {
        selectedItems.selectedContent.push(itemId);
      }
    })
    return selectedItems;
  }

  flattenFolder(folderId) {
    let itemIds = [];
    let childFolder = this.props.allFolderInfo[folderId].childFolder;
    childFolder.forEach((childFolderId) => {
      itemIds.concat(this.flattenFolder(childFolderId));
    })
    this.props.allFolderInfo[folderId].childContent.forEach((childContentId) => {
      itemIds.push(childContentId);
    })
    return itemIds;
  }

  handleAddContentToFolder(folderId) {
    this.props.addContentToFolder(this.state.selectedItems, this.state.selectedItemsType, folderId);
  }

  handleRemoveContentFromCurrentFolder() {
    let folderId = this.peekDirectoryStack();
    this.props.removeContentFromFolder(this.state.selectedItems, folderId);
  }

  buildFolderItems() {
    this.folderItems = [];
    this.folderList = this.props.folderList;
      // show items in current directory
    if (this.state.directoryStack.length !== 0) {
      let folderId = this.peekDirectoryStack();
      this.folderList = this.props.allFolderInfo[folderId].childFolder;
    }

    this.tableIndex = 0;
    // create table row items to be rendered in chooser
    for (let folderId of this.folderList){
      let title = this.props.allFolderInfo[folderId].title;
      let publishDate = this.props.allFolderInfo[folderId].publishDate;
      let childContent = this.props.allFolderInfo[folderId].childContent;
      let childFolder = this.props.allFolderInfo[folderId].childFolder;
      let classes = this.state.selectedItems.includes(folderId) ?
                      "browserDataRow browserSelectedRow": "browserDataRow";
      let notInBaseDirOfContent = true;
      if (this.props.selectedDrive === "Content") {
        // disable remove content in base dir when in mycontent
        notInBaseDirOfContent = this.state.directoryStack.length !== 0;
      }
      this.folderItems.push(
        <Folder      
          onClick={this.handleContentItemClick}
          onDoubleClick={this.openFolder}
          title={title}
          publishDate={publishDate}
          childContent={childContent}
          childFolder={childFolder}
          folderId={folderId}
          classes={classes}
          key={"folder" + folderId}
          tableIndex={this.tableIndex++}
          showAddItemIcon={!this.hideAddRemoveButtons &&
                          this.state.selectedItems.length !== 0 &&
                          !this.state.selectedItems.includes(folderId) &&
                          !this.state.selectedItems.includes(this.state.directoryStack[this.state.directoryStack.length - 1])}
          showRemoveItemIcon={!this.hideAddRemoveButtons && 
                              notInBaseDirOfContent &&
                              this.state.selectedItems.length !== 0 &&
                              this.state.selectedItems.includes(folderId)}
          handleAddContentToFolder={this.handleAddContentToFolder}
          handleRemoveContentFromCurrentFolder={this.handleRemoveContentFromCurrentFolder}/>
      );
    }
  }
  
  buildContentItems(){
    this.contentItems = [];

    this.contentList = this.props.contentList;
    // show items in current directory
    if (this.state.directoryStack.length !== 0) {
      let folderId = this.peekDirectoryStack();
      this.contentList = this.props.allFolderInfo[folderId].childContent;
    }

    // build files
    for (let branchId of this.contentList){
      let title = this.props.allContentInfo[branchId].title;
      let publishDate = this.props.allContentInfo[branchId].publishDate;
      let classes = this.state.selectedItems.includes(branchId) ?
                      "browserDataRow browserSelectedRow": "browserDataRow";
      
      let notInBaseDirOfContent = true;
      if (this.props.selectedDrive === "Content") {
        // disable remove content in base dir when in mycontent
        notInBaseDirOfContent = this.state.directoryStack.length !== 0;
      }

      // create table row items to be rendered in chooser
      this.contentItems.push(
        <File
        branchId={branchId}
        classes={classes}
        onClick={this.handleContentItemClick}
        onDoubleClick={this.handleContentItemDoubleClick}
        title={title}
        publishDate={publishDate}
        key={"contentItem" + branchId}
        tableIndex={this.tableIndex++}
        showRemoveItemIcon={!this.hideAddRemoveButtons && 
                            notInBaseDirOfContent &&
                            this.state.selectedItems.length !== 0 &&
                            this.state.selectedItems.includes(branchId)}
        handleRemoveContentFromCurrentFolder={this.handleRemoveContentFromCurrentFolder}/>
      );
    }
  }

  handleContentItemClick (itemId, type, tableIndex) {
    // show content/folder info on infoPanel
    // check for keystroke
    if (window.event.ctrlKey || window.event.metaKey) {
      let currentSelectedItems = this.state.selectedItems;
      let currentSelectedItemsType = this.state.selectedItemsType;
      let index = currentSelectedItems.indexOf(itemId);
      if (index > -1) {
        currentSelectedItems.splice(index, 1);
        currentSelectedItemsType.splice(index, 1);
      } else {
        currentSelectedItems.push(itemId);
        currentSelectedItemsType.push(type);
      }

      this.setState({
        selectedItems: currentSelectedItems,
        selectedItemsType: currentSelectedItemsType
      });
      
      if (this.props.updateSelectedItems !== null) {
        this.props.updateSelectedItems(currentSelectedItems, currentSelectedItemsType);
      }
    } else if (window.event.shiftKey) {
      let currentSelectedItems = this.state.selectedItems;
      let currentSelectedItemsType = this.state.selectedItemsType;
      
      let allTableItems = this.props.folderList.concat(this.props.contentList);

      // if no previous items selected
      if (currentSelectedItems.length === 0) {
        // select current item
        this.setState({
          selectedItems: [itemId],
          selectedItemsType: [type]
        });

        if (this.props.updateSelectedItems !== null) {
          this.props.updateSelectedItems([itemId], [type]);
        }
        return;
      }
      
      // get lastSelectedItemIndex, currentSelectedItemIndex
      let lastSelectedItemIndex = allTableItems.indexOf(currentSelectedItems[currentSelectedItems.length - 1]);
      let currentSelectedItemIndex = tableIndex;

      // maintain last < current order
      if (currentSelectedItemIndex < lastSelectedItemIndex) {
        let temp = lastSelectedItemIndex;
        lastSelectedItemIndex = currentSelectedItemIndex;
        currentSelectedItemIndex = temp;
      }

      // select all items between last and current
      while (lastSelectedItemIndex <= currentSelectedItemIndex) {
        // get id and type of item to be selected
        let currentItemId = allTableItems[lastSelectedItemIndex];
        let currentItemType = "content";
        if (this.props.allContentInfo[currentItemId] === undefined) currentItemType = "folder";

        // check if already inside, if true then continue
        if (!currentSelectedItems.includes(currentItemId)) {
          currentSelectedItems.push(currentItemId);
          currentSelectedItemsType.push(currentItemType);
        }
        lastSelectedItemIndex++;
      }
    
      this.setState({
        selectedItems: currentSelectedItems,
        selectedItemsType: currentSelectedItemsType
      });

      if (this.props.updateSelectedItems !== null) {
        this.props.updateSelectedItems(currentSelectedItems, currentSelectedItemsType);
      }
    } else {
      this.setState({
        selectedItems: [itemId],
        selectedItemsType: [type]
      });

      if (this.props.updateSelectedItems !== null) {
        this.props.updateSelectedItems([itemId], [type]);
      }
    }    
  }

  handleContentItemDoubleClick(branchId) {
    // redirect to editor
    window.location.href=`/editor?branchId=${branchId}`;
    this.props.updateSelectedItemss(itemId, type);
  }

  handleFolderDoubleClick(folderId) {
    this.setState({
      currentDirectory: folderId
    });
  }

  pushDirectoryStack(folderId) {
    let directoryStack = this.state.directoryStack;
    directoryStack.push(folderId);
    this.setState({
      directoryStack: directoryStack
    }); 
  }

  popDirectoryStack() {
    let directoryStack = this.state.directoryStack;
    directoryStack.pop();
    this.setState({
      directoryStack: directoryStack
    });
  }

  peekDirectoryStack() {
    return this.state.directoryStack[this.state.directoryStack.length - 1];
  }

  openFolder(folderId) {
    this.pushDirectoryStack(folderId);
  }

  upOneDirectory() {
    this.popDirectoryStack();
  }

  render() {
    this.buildFolderItems();
    this.buildContentItems();

    return(
      <div id="contentList">
      <table id="browser">
        <tbody>
          <tr className="browserHeadingsRow" key="browserHeadingsRow">
            <th style={{width:"70%"}}>Name</th>
            <th style={{width:"30%"}}>Published Date</th>
          </tr>
          {this.state.directoryStack.length !== 0 &&
          <tr
          className="browserDataRow"
          onDoubleClick={this.upOneDirectory}>
            <td className="browserItemName">
              <FontAwesomeIcon icon={faFolder} style={{"fontSize":"18px", "color":"#737373", "margin": "0px 15px"}}/>
              <span>{"..."}</span>
            </td>
            <td className="pubishedDate"></td>
          </tr>}
          {this.folderItems}
          {this.contentItems}
        </tbody>
      </table>
    </div>
    );
  }
}

class File extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <tr
      className={this.props.classes}
      onClick={() => this.props.onClick(this.props.branchId, "content", this.props.tableIndex)}
      onDoubleClick={() => this.props.onDoubleClick(this.props.branchId)}>
        <td className="browserItemName">
          <FontAwesomeIcon icon={faFileAlt} style={{"fontSize":"18px", "color":"#3D6EC9", "margin": "0px 15px"}}/>
          <span>{this.props.title}</span>
        </td>
        <td className="pubishedDate">
          <div style={{"position":"relative"}}>
            {this.props.showRemoveItemIcon && 
            <div className="removeContentButtonWrapper">
              <FontAwesomeIcon icon={faMinusCircle} className="removeContentButton" 
              onClick={() => this.props.handleRemoveContentFromCurrentFolder(this.props.branchId)}/>
            </div>}
            <span>{this.props.publishDate}</span>
          </div>          
        </td>
      </tr>
    );
  }
}

class Folder extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <tr
      className={this.props.classes}
      onClick={() => this.props.onClick(this.props.folderId, "folder", this.props.tableIndex)}
      onDoubleClick={() => this.props.onDoubleClick(this.props.folderId)}>
        <td className="browserItemName">
          <div style={{"position":"relative"}}>
            {this.props.showAddItemIcon && 
            <div className="addContentButtonWrapper">
              <FontAwesomeIcon icon={faPlus} className="addContentButton" 
              onClick={() => this.props.handleAddContentToFolder(this.props.folderId)}/>
              <div className="addContentButtonInfo"><span>Add to Folder</span></div>
            </div>}
            <FontAwesomeIcon icon={faFolder} style={{"fontSize":"18px", "color":"#737373", "margin": "0px 15px"}}/>
            <span>{this.props.title}</span>
          </div>          
        </td>
        <td className="pubishedDate">
          <div style={{"position":"relative"}}>
            {this.props.showRemoveItemIcon && 
            <div className="removeContentButtonWrapper">
              <FontAwesomeIcon icon={faMinusCircle} className="removeContentButton" 
              onClick={() => this.props.handleRemoveContentFromCurrentFolder(this.props.folderId)}/>
            </div>}
            <span>{this.props.publishDate}</span>
          </div>          
        </td>
      </tr>
    );
  }
}

class NewCourseForm extends React.Component {
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

  handleChange(event) {
    // set edited to true once any input is detected
    this.setState({ edited: true });
    
    let name = event.target.name;
    let value = event.target.value;
    this.setState({[name]: value});
  }

  handleSubmit(event) {

    let courseId = nanoid();
    let term = this.state.semester + " " + this.state.year;

    this.props.saveCourse({
      courseName:this.state.courseName,
      courseId: courseId,
      courseCode:this.state.courseCode,
      term: term,
      description: this.state.description,
      department: this.state.department,
      section: this.state.section,
    }, (courseId) => {
      this.props.handleNewCourseCreated(courseId);  
    });
    event.preventDefault();    
    this.props.handleBack();
  }

  handleBack() {
    // popup confirm dialog if form is edited
    if (this.state.edited) {
      if (!window.confirm('All of your input will be discardeed, are you sure you want to proceed?')) {
        return;
      }
    }

    this.props.handleBack();
  }

  addRole(role) {
    //create a unike key for each new role
    var timestamp = (new Date()).getTime();
    this.state.roles['role-' + timestamp ] = role;
    this.setState({ roles : this.state.roles });
  }


  render() {
    return (
      <div id="newCourseFormContainer">
        <div id="newCourseFormTopbar">
          <div id="newCourseFormBackButton" onClick={this.handleBack} data-cy="newCourseFormBackButton">
            <FontAwesomeIcon icon={faArrowCircleLeft} style={{"fontSize":"17px", "marginRight":"5px"}}/>
            <span>Back to Chooser</span>
          </div>          
        </div>
        <form onSubmit={this.handleSubmit}>
          <div className="newCourseFormGroup-12">
            <label className="newCourseFormLabel">COURSE NAME</label>
            <input className="newCourseFormInput" required type="text" name="courseName" 
              placeholder="Course name goes here." onChange={this.handleChange} data-cy="newCourseFormNameInput"/>
          </div>
          <div className="newCourseFormGroupWrapper">
            <div className="newCourseFormGroup-4" >
              <label className="newCourseFormLabel">DEPARTMENT</label>
              <input className="newCourseFormInput" required type="text" name="department" 
              placeholder="DEP" onChange={this.handleChange} data-cy="newCourseFormDepInput"/>
            </div>
            <div className="newCourseFormGroup-4">
              <label className="newCourseFormLabel">COURSE CODE</label>
              <input className="newCourseFormInput" required type="text" name="courseCode" 
                placeholder="MATH 1241" onChange={this.handleChange} data-cy="newCourseFormCodeInput"/>
            </div>
            <div className="newCourseFormGroup-4">
              <label className="newCourseFormLabel">SECTION</label>
              <input className="newCourseFormInput" required type="number" name="section" 
              placeholder="00000" onChange={this.handleChange} data-cy="newCourseFormSectionInput"/>
            </div>
          </div>          
          <div className="newCourseFormGroupWrapper">
            <div className="newCourseFormGroup-4" >
              <label className="newCourseFormLabel">YEAR</label>
              <input className="newCourseFormInput" required type="number" name="year" 
              placeholder="2019" onChange={this.handleChange} data-cy="newCourseFormYearInput"/>
            </div>
            <div className="newCourseFormGroup-4">
              <label className="newCourseFormLabel">SEMESTER</label>
              <select className="newCourseFormSelect" required name="semester" onChange={this.handleChange}>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Fall">Fall</option>
              </select>
            </div>
            <div className="newCourseFormGroup-4">
            </div>
          </div> 
          <div className="newCourseFormGroup-12">
            <label className="newCourseFormLabel">DESCRIPTION</label>
            <textarea className="newCourseFormInput" required type="text" name="description" 
              placeholder="Official course description here" onChange={this.handleChange} data-cy="newCourseFormDescInput"/>
          </div>
          <div className="newCourseFormGroup-12">
            <label className="newCourseFormLabel">ROLES</label>
              <AddRoleForm addRole={this.addRole}/>
              <RoleList roles={this.state.roles}/>
          </div>
          <div id="newCourseFormButtonsContainer">
            <button id="newCourseFormSubmitButton" type="submit" data-cy="newCourseFormSubmitButton">
              <div className="newCourseFormButtonWrapper">
                <span>Create Course</span>
                <FontAwesomeIcon icon={faPlusCircle} style={{"fontSize":"20px", "color":"#fff", "cursor":"pointer", "marginLeft":"8px"}}/>
              </div>              
            </button>
            <button id="newCourseFormCancelButton" onClick={this.handleBack} data-cy="newCourseFormCancelButton">
              <div className="newCourseFormButtonWrapper">
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
      <div className="newCourseFormGroup-4" style={{"display":"flex"}}>
        <input className="newCourseFormInput" type="text" value={this.state.input} onChange={this.handleChange}
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
        <div onClick={onClick}>
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


export default DoenetChooser;