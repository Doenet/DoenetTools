import React, { Component } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faFolder, faArrowUp, 
  faArrowDown, faDotCircle, faEdit, faArrowRight, faSpinner} from '@fortawesome/free-solid-svg-icons';
import "./branchBrowser.css";

class DoenetBranchBrowser extends Component {
  static defaultProps = {
    addContentToFolder: null,
    removeContentFromFolder: null,
    selectedDrive: "Content",
    selectedCourse: null,
    directoryData: [],
    selectedItems: [],
    selectedItemsType: [],
  }
  constructor(props) {
    super(props);

    this.state = {
      directoryStack: props.directoryData,
      selectedItems: props.selectedItems,
      selectedItemsType: props.selectedItemsType,
      sortBy: "title",
      sortOrderAsc: "ASC"
    }

    // handle null props
    this.hideAddRemoveButtons = this.disableEditing = this.props.addContentToFolder === null
                     || this.props.removeContentFromFolder === null;

    this.handleAddContentToFolder = this.handleAddContentToFolder.bind(this);
    this.handleRemoveContentFromCurrentFolder = this.handleRemoveContentFromCurrentFolder.bind(this);
    this.handleRemoveContentFromCourse = this.handleRemoveContentFromCourse.bind(this);
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
    this.jumpToDirectory = this.jumpToDirectory.bind(this);
    this.updateSortOrder = this.updateSortOrder.bind(this);
    this.sortContent = this.sortContent.bind(this);
    this.sortFolders = this.sortFolders.bind(this);
  }

  getAllSelectedItems() {
    let allSelectedContent = [];
    for (let i =0; i < this.state.selectedItemsType.length; i++) {
      if (this.state.selectedItemsType[i] === "folder") {
        // flatten folders to get all content
        allSelectedContent = allSelectedContent.concat(this.flattenFolder(this.state.selectedItems[i]));
      } else {
        allSelectedContent.push({
          branchId: this.state.selectedItems[i],
          contentIds: this.props.allContentInfo[this.state.selectedItems[i]].contentIds
        });
      }
    }

    return allSelectedContent;
  }

  flattenFolder(folderId) {
    let itemIds = [];
    let childFolder = this.props.allFolderInfo[folderId].childFolder;
    childFolder.forEach((childFolderId) => {
      itemIds = itemIds.concat(this.flattenFolder(childFolderId));
    })
    this.props.allFolderInfo[folderId].childContent.forEach((childContentBranchId) => {
      itemIds.push({
        branchId: childContentBranchId,
        contentIds: this.props.allContentInfo[childContentBranchId].contentIds
      });
    })
    return itemIds;
  }

  handleAddContentToFolder(folderId) {
    this.props.addContentToFolder(this.state.selectedItems, this.state.selectedItemsType, folderId);
    this.setState({selectedItems: [], selectedItemType: []});
  }

  handleRemoveContentFromCurrentFolder() {
    let folderId = this.peekDirectoryStack();
    this.props.removeContentFromFolder(this.state.selectedItems, this.state.selectedItemsType, folderId);
    this.setState({selectedItems: [], selectedItemType: []});
  }

  handleRemoveContentFromCourse() {
    this.props.removeContentFromCourse(this.state.selectedItems);
  }

  buildBreadcrumb() {
    let directoryList = [];
    // build directory list
    // always add current drive/course as first item
    directoryList.push(
      <div 
      onClick={() => this.jumpToDirectory("")} 
      key="breadcrumbDrive"
      data-cy="breadcrumbbase">
        <label>
          {this.props.selectedDrive === "Courses" ? 
            this.props.allCourseInfo[this.props.selectedCourse].courseCode 
            : this.props.selectedDrive}
        </label>
      </div>
    );

    // add items in directoryStack if any
    this.state.directoryStack.forEach((folderId) => {
      let folderTitle = this.props.allFolderInfo[folderId].title;

      directoryList.push(
        <div 
        onClick={() => this.jumpToDirectory(folderId)} 
        key={"breadcrumb"+folderId}
        data-cy={"breadcrumb"+folderId}>
          <label>{folderTitle}</label>
        </div>
      );
    });

    this.breadcrumb = <Breadcrumb separator='>'>
                        {directoryList}
                      </Breadcrumb>;
  }

  buildFolderItems() {
    this.folderItems = [];
    this.folderList = this.props.folderList;
    this.sortFolders();
    
    this.tableIndex = 0;
    // create table row items to be rendered in chooser
    for (let folderId of this.folderList){
      let title = this.props.allFolderInfo[folderId].title;
      let publishDate = this.props.allFolderInfo[folderId].publishDate;
      let childContent = this.props.allFolderInfo[folderId].childContent;
      let childFolder = this.props.allFolderInfo[folderId].childFolder;
      let classes = this.state.selectedItems.includes(folderId) ?
                      "browserDataRow browserSelectedRow": "browserDataRow";
      
      let showRemoveItemIcon = false;
      let showAddItemIcon = true;
      if (this.props.selectedDrive === "Content") {
        // disable remove content in base dir when in mycontent
        let notInBaseDirOfContent = this.state.directoryStack.length !== 0;
        showRemoveItemIcon = !this.hideAddRemoveButtons && 
                              notInBaseDirOfContent &&
                              this.state.selectedItems.length !== 0 &&
                              this.state.selectedItems.includes(folderId);

        showAddItemIcon = !this.hideAddRemoveButtons &&
                          this.state.selectedItems.length !== 0 &&
                          !this.state.selectedItems.includes(folderId) &&
                          !this.state.selectedItems.includes(this.state.directoryStack[this.state.directoryStack.length - 1]);

      } else if (this.props.selectedDrive === "Courses") {
        // disable remove content when not in base dir
        let inBaseDir = this.state.directoryStack.length === 0;
        showRemoveItemIcon = !this.hideAddRemoveButtons &&
                              inBaseDir &&
                              this.state.selectedItems.length !== 0 &&
                              this.state.selectedItems.includes(folderId);
        // restrict content editing in courses
        showAddItemIcon = false;
      }


      this.folderItems.push(
        <Folder      
          onClick={this.handleContentItemClick}
          onDoubleClick={this.openFolder}
          title={title}
          publishDate={publishDate}
          draftDate={" — "}
          childContent={childContent}
          childFolder={childFolder}
          folderId={folderId}
          classes={classes}
          key={"folder" + folderId}
          tableIndex={this.tableIndex++}
          handleAddContentToFolder={this.handleAddContentToFolder}
          showAddItemIcon={showAddItemIcon}
          showRemoveItemIcon={showRemoveItemIcon}
          handleRemoveContent={this.props.selectedDrive === "Content" ? 
                              this.handleRemoveContentFromCurrentFolder :
                              this.handleRemoveContentFromCourse}/>
      );
    }
  }
  
  buildContentItems(){
    this.contentItems = [];
    this.contentList = this.props.contentList;
    this.sortContent();

    // build files
    for (let branchId of this.contentList){
      let title = this.props.allContentInfo[branchId].title;
      let publishDate = this.props.allContentInfo[branchId].publishDate;
      let draftDate = this.props.allContentInfo[branchId].draftDate;
      let classes = this.state.selectedItems.includes(branchId) ?
                      "browserDataRow browserSelectedRow": "browserDataRow";
      
      let showRemoveItemIcon = false;
      if (this.props.selectedDrive === "Content") {
        // disable remove content in base dir when in mycontent
        let notInBaseDirOfContent = this.state.directoryStack.length !== 0;
        showRemoveItemIcon = !this.hideAddRemoveButtons && 
                              notInBaseDirOfContent &&
                              this.state.selectedItems.length !== 0 &&
                              this.state.selectedItems.includes(branchId);

      } else if (this.props.selectedDrive === "Courses") {
        // disable remove content when not in base dir
        let inBaseDir = this.state.directoryStack.length === 0;
        showRemoveItemIcon = !this.hideAddRemoveButtons &&
                              inBaseDir &&
                              this.state.selectedItems.length !== 0 &&
                              this.state.selectedItems.includes(branchId);
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
        draftDate={draftDate}
        key={"contentItem" + branchId}
        tableIndex={this.tableIndex++}
        showRemoveItemIcon={showRemoveItemIcon}
        handleRemoveContent={this.props.selectedDrive === "Content" ? 
                            this.handleRemoveContentFromCurrentFolder :
                            this.handleRemoveContentFromCourse}/>);
        
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
      
      let allTableItems = this.folderList.concat(this.contentList);

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
    if (!this.disableEditing) {
      // redirect to editor
      window.location.href=`/editor?branchId=${branchId}`;
      this.props.updateSelectedItems([branchId], ["content"]);
    }
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
    this.setState({selectedItems: [], selectedItemType: []});
    if (this.props.updateDirectoryStack !== null) {
      this.props.updateDirectoryStack(this.state.directoryStack);
    }
  }

  upOneDirectory() {
    this.popDirectoryStack();
    this.setState({selectedItems: [], selectedItemType: []});
    if (this.props.updateDirectoryStack !== null) {
      this.props.updateDirectoryStack(this.state.directoryStack);
    }
  }

  jumpToDirectory(folderId) {
    // pop all items after folderId
    this.setState({selectedItems: [], selectedItemType: []});
    while (this.state.directoryStack.length > 0 && this.peekDirectoryStack() !== folderId) {
      this.upOneDirectory();      
    }
  }

  updateSortOrder(colName) {
    if (colName !== this.state.sortBy) {
      this.setState({sortBy: colName, sortOrderAsc: true});
    } else {
      this.setState({sortOrderAsc: !this.state.sortOrderAsc});
    }
  }

  sortContent() {
    if (this.state.sortOrderAsc) {
      if (this.state.sortBy === "publishedDate") {
        this.contentList.sort(
          (a,b) => { 
            return new Date(this.props.allContentInfo[a].publishDate) - new Date(this.props.allContentInfo[b].publishDate)}
        );
      } else if (this.state.sortBy === "draftDate") {
        this.contentList.sort(
          (a,b) => { 
            return new Date(this.props.allContentInfo[a].draftDate) - new Date(this.props.allContentInfo[b].draftDate)}
        );
      } else if (this.state.sortBy === "title") {
        this.contentList.sort(
          (a,b) => { 
            return (this.props.allContentInfo[a].title.localeCompare(this.props.allContentInfo[b].title))}
        );
      }
    } else {
      if (this.state.sortBy === "publishedDate") {
        this.contentList.sort(
          (b,a) => { 
            return new Date(this.props.allContentInfo[a].publishDate) - new Date(this.props.allContentInfo[b].publishDate)}
        );
      } else if (this.state.sortBy === "draftDate") {
        this.contentList.sort(
          (b,a) => { 
            return new Date(this.props.allContentInfo[a].draftDate) - new Date(this.props.allContentInfo[b].draftDate)}
        );
      } else if (this.state.sortBy === "title") {
        this.contentList.sort(
          (b,a) => { 
            return (this.props.allContentInfo[a].title.localeCompare(this.props.allContentInfo[b].title))}
        );
      }
    }
  }

  sortFolders() {
    if (this.state.sortOrderAsc) {
      if (this.state.sortBy === "publishedDate") {
        this.folderList.sort(
          (a,b) => { 
            return new Date(this.props.allFolderInfo[a].publishDate) - new Date(this.props.allFolderInfo[b].publishDate)}
        );
      } else if (this.state.sortBy === "title") {
        this.folderList.sort(
          (a,b) => { 
            return (this.props.allFolderInfo[a].title.localeCompare(this.props.allFolderInfo[b].title));}
        );
      }
    }else {
      if (this.state.sortBy === "publishedDate") {
        this.folderList.sort(
          (b,a) => { 
            return new Date(this.props.allFolderInfo[a].publishDate) - new Date(this.props.allFolderInfo[b].publishDate)}
        );
      } else if (this.state.sortBy === "title") {
        this.folderList.sort(
          (b,a) => { 
            return (this.props.allFolderInfo[a].title.localeCompare(this.props.allFolderInfo[b].title));}
        );
      }
    }
  }

  render() {

    if (this.props.loading){
      return <div id="branchBrowser" style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
        <FontAwesomeIcon style={{animation: `spin 1.5s linear infinite, spinnerColor 2s linear infinite`, 
                                fontSize:"35px"}} icon={faSpinner}/>
      </div>
    }

    this.buildBreadcrumb();
    this.buildFolderItems();
    this.buildContentItems();

    return(
      <React.Fragment>
        <div id="branchBrowser">
          <div id="contentList">
            {this.breadcrumb}
            <table id="browser">
              <tbody>
                <tr className="browserHeadingsRow" key="browserHeadingsRow">
                  <th 
                  className={this.state.sortBy === "title" ? "browserItemName browserSelectedHeading" : "browserItemName"}
                  onClick={() => this.updateSortOrder("title")}>
                    Name   {this.state.sortBy === "title" ? this.state.sortOrderAsc ? 
                                                          <FontAwesomeIcon icon={faArrowUp} className="sortOrderIcon"/> :
                                                          <FontAwesomeIcon icon={faArrowDown} className="sortOrderIcon"/> : ""}
                  </th>
                  <th 
                  className={this.state.sortBy === "draftDate" ? "draftDate browserSelectedHeading" : "draftDate"}
                  onClick={() => this.updateSortOrder("draftDate")}>
                    Draft Date   {this.state.sortBy === "draftDate" ? this.state.sortOrderAsc ? 
                                                          <FontAwesomeIcon icon={faArrowUp} className="sortOrderIcon"/> :
                                                          <FontAwesomeIcon icon={faArrowDown} className="sortOrderIcon"/> : ""}
                  </th>
                  <th 
                  className={this.state.sortBy === "publishedDate" ? "publishDate browserSelectedHeading" : "publishDate"}
                  onClick={() => this.updateSortOrder("publishedDate")}>
                    Published Date  {this.state.sortBy === "publishedDate" ? this.state.sortOrderAsc ? 
                                                          <FontAwesomeIcon icon={faArrowUp} className="sortOrderIcon"/> :
                                                          <FontAwesomeIcon icon={faArrowDown} className="sortOrderIcon"/> : ""}
                  </th>
                </tr>
                {this.state.directoryStack.length !== 0 &&
                <tr
                className="browserDataRow"
                data-cy="upOneDirectory"
                onDoubleClick={this.upOneDirectory}>
                  <td className="browserItemName">
                    <FontAwesomeIcon icon={faFolder} style={{"fontSize":"18px", "color":"#737373", "margin": "0px 15px"}}/>
                    <span>{"..."}</span>
                  </td>
                  <td className="draftDate"></td>
                  <td className="publishDate"></td>
                </tr>}
                {this.folderItems}
                {this.contentItems}
              </tbody>
            </table>
          </div>
          <InfoPanel
            selectedItems={this.state.selectedItems}
            selectedItemsType={this.state.selectedItemsType}
            selectedDrive={this.props.selectedDrive}
            selectedCourse={this.props.selectedCourse}
            allFolderInfo={this.props.allFolderInfo}
            allContentInfo={this.props.allContentInfo}
            allCourseInfo={this.props.allCourseInfo}
            disableEditing={this.disableEditing}
          />
        </div>
      </React.Fragment>
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
      onDoubleClick={() => this.props.onDoubleClick(this.props.branchId)}
      data-cy={this.props.branchId}>
        <td className="browserItemName">
          <FontAwesomeIcon icon={faFileAlt} style={{"fontSize":"18px", "color":"#3D6EC9", "margin": "0px 15px"}}/>
          <span>{this.props.title}</span>
        </td>
        <td className="draftDate">
          <span>{this.props.draftDate}</span>
        </td>
        <td className="publishDate">
          <div style={{"position":"relative"}}>
            {this.props.showRemoveItemIcon && 
            <div className="removeContentButtonWrapper">
              <FontAwesomeIcon icon={faArrowRight} className="removeContentButton" 
              onClick={() => this.props.handleRemoveContent(this.props.branchId)}/>
              <div className="removeContentButtonInfo"><span>Move out folder</span></div>
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
      onDoubleClick={() => this.props.onDoubleClick(this.props.folderId)}
      data-cy={this.props.folderId}>
        <td className="browserItemName">
          <div style={{"position":"relative"}}>
            {this.props.showAddItemIcon && 
            <div className="addContentButtonWrapper">
              <FontAwesomeIcon icon={faArrowRight} className="addContentButton" 
              onClick={() => this.props.handleAddContentToFolder(this.props.folderId)}/>
              <div className="addContentButtonInfo"><span>Move to Folder</span></div>
            </div>}
            <FontAwesomeIcon icon={faFolder} style={{"fontSize":"18px", "color":"#737373", "margin": "0px 15px"}}/>
            <span>{this.props.title}</span>
          </div>          
        </td>
        <td className="draftDate">
          <span>{this.props.draftDate}</span>
        </td>
        <td className="publishDate">
          <div style={{"position":"relative"}}>
            {this.props.showRemoveItemIcon && 
            <div className="removeContentButtonWrapper">
              <FontAwesomeIcon icon={faArrowRight} className="removeContentButton" 
              onClick={() => this.props.handleRemoveContent(this.props.folderId)}/>
              <div className="removeContentButtonInfo"><span>Move out folder</span></div>
            </div>}
            <span>{this.props.publishDate}</span>
          </div>          
        </td>
      </tr>
    );
  }
}

class InfoPanel extends Component {
  constructor(props) {
    super(props);
  }

  buildInfoPanel() {
    let selectedItemId = null;
    let selectedItemType = null;
    let itemTitle = "";

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
      } else {
        itemTitle = this.props.allContentInfo[selectedItemId].title;
      }

      this.buildInfoPanelItemDetails(selectedItemId, selectedItemType);  
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
    </React.Fragment>
  }

  buildInfoPanelItemDetails(selectedItemId, selectedItemType) {
    this.infoPanelDetails = [];
    let itemDetails = {};
    if (selectedItemType === "folder") {

      itemDetails = {
        "Location"  : "Content",
        "Published" : this.props.allFolderInfo[selectedItemId].publishDate,
      };

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
      </React.Fragment>

    } else {
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
        "Published" : this.props.allContentInfo[selectedItemId].publishDate,
        "Versions" : versions,
        // "Related content" : relatedContent,
      };

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
        {!this.props.disableEditing &&
        <div id="editContentButtonContainer">
          <div id="editContentButton" data-cy="editContentButton"
          onClick={()=> {window.location.href=`/editor?branchId=${selectedItemId}`}}>
            <FontAwesomeIcon icon={faEdit} style={{"fontSize":"20px", "color":"#43aa90"}}/>
            <span>Edit Draft</span>
          </div>
        </div> 
        }
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

const BreadcrumbItem = ({ children, ...props }) => (
  <li className='breadcrumbItem' {...props}>
    {children}
  </li>
)

const BreadcrumbSeparator = ({ children, ...props }) => (
  <li className='breadcrumbSeparator' {...props}>
    {children}
  </li>
)

const Breadcrumb = ({ separator = '/', ...props }) => {
  let children = React.Children.toArray(props.children)

  children = children.map((child, index) => (
    <BreadcrumbItem key={`breadcrumbItem${index}`}>{child}</BreadcrumbItem>
  ));

  const lastIndex = children.length - 1;

  children = children.reduce((acc, child, index) => {
    let notLast = index < lastIndex;
    if (notLast) {
      acc.push(
        child,
        <BreadcrumbSeparator key={`breadcrumbSep${index}`}>
          {separator}
        </BreadcrumbSeparator>,
      )
    } else {
      acc.push(child);
    }
    return acc;
  }, [])

  return (<ol className="breadcrumbList">{children}</ol>);
}

export default DoenetBranchBrowser;