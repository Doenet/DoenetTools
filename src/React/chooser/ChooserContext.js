import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const ChooserContext = createContext();

export const ChooserProvider = ({ children }) => {
  const [dataLists, setDataLists] = useState({
    contentIds: [],
    folderIds: [],
    urlIds: [],
    courseIds: [],
  });
  const [dataInfo, setDataInfo] = useState({
    contentInfo: {},
    folderInfo: {},
    urlInfo: {},
    courseInfo: {},
    courseHeadingsInfo: {},
    courseAssignmentsInfo: {}
  });
  const [flags, setFlags] = useState({
    branches_loaded: false,
    courses_loaded: false,
    folders_loaded: false,
    urls_loaded: false,
    assignments_and_headings_loaded: false
  });
  const [appState, setAppState] = useState({
    selectedItems: [],
    selectedItemsType: [],
    directoryStack: [],
    currentDraggedObject: {id: null, type: null, sourceContainerId: null, dataObject: null, sourceParentId: null},
    originalTreeParentsAndLeaves: { parents: null, leaves: null },
    validDrop: true,
  });
  
  useEffect(() => {
    loadAllCourses();
  }, [])

  useEffect(() => {
    loadUserContentBranches();
  }, [])

  useEffect(() => {
    loadUserFoldersAndRepo();
  }, [])

  useEffect(() => {
    loadUserUrls();
  }, [])

  useEffect(() => {
    loadCourseHeadingsAndAssignments();
  }, [])  

  const loadCourseHeadingsAndAssignments = () => {
    setFlags({ ...flags, assignments_and_headings_loaded: false });
    const url = "/api/getHeaderAndAssignmentInfo.php";
    const data = {
      courseId: "aI8sK4vmEhC5sdeSP3vNW"
    }
    const payload = {
      params: data
    }
    axios.get(url, payload).then(resp=>{
      let tempHeadingsInfo = {};
      let tempAssignmentsInfo = {};
      Object.keys(resp.data).map(itemId => {
          // console.log(resp.data[itemId]["name"]);
        if (resp.data[itemId]["attribute"] == "header") {
          tempHeadingsInfo[itemId] = resp.data[itemId];
          // process children
          for (let i in resp.data[itemId]["childrenId"]) {
            let childId = resp.data[itemId]["childrenId"][i];
            if (childId == "") continue;
            if (resp.data[childId]["attribute"] == "header") {
              tempHeadingsInfo[itemId]["headingId"].push(childId);
            } else {
              tempHeadingsInfo[itemId]["assignmentId"].push(childId);
            }
          }
        } else {
          tempAssignmentsInfo[itemId] = resp.data[itemId];
        }
      })

      setDataInfo(dataInfo => ({
        ...dataInfo,
        courseHeadingsInfo: tempHeadingsInfo, 
        courseAssignmentsInfo: tempAssignmentsInfo, 
      }))
      setFlags(flags => ({ ...flags, assignments_and_headings_loaded: true }));
    })
  } 

  const loadUserContentBranches = (callback=(()=>{})) => {
    setFlags({ ...flags, branches_loaded: false });
    const directoryStack = appState.directoryStack;
    let currentFolderId = directoryStack.length === 0 ?
                            "root" : directoryStack[directoryStack.length - 1];

    const data= {folderId: currentFolderId};
    const payload = {params: data};

    const loadBranchesUrl='/api/loadUserContent.php';
    
    axios.get(loadBranchesUrl, payload)
    .then(resp=>{
      setDataLists(dataLists => ({ ...dataLists, contentIds: resp.data.sort_order }))
      setDataInfo(dataInfo => ({ ...dataInfo, contentInfo: Object.assign({}, dataInfo.contentInfo, resp.data.branchId_info)}))
      setFlags(flags => ({ ...flags, branches_loaded: true }));
      callback();
    });
  };  

  const loadUserFoldersAndRepo = (callback=(()=>{})) => {
    setFlags({ ...flags, folders_loaded: false });

    const loadUserFoldersAndRepoUrl='/api/loadUserFoldersAndRepo.php';
    const payload = {};
    
    axios.get(loadUserFoldersAndRepoUrl,payload)
    .then(resp=>{
      setDataLists(dataLists => ({ ...dataLists, folderIds: resp.data.folderIds }))
      setDataInfo(dataInfo => ({ ...dataInfo, folderInfo: Object.assign({}, dataInfo.folderInfo, resp.data.folderInfo)}))
      setFlags(flags => ({ ...flags, folders_loaded: true }));
      callback();
    });
  };

  const loadUserUrls = (callback=(()=>{})) => {
    setFlags(flags => ({ ...flags, urls_loaded: false }));

    const loadUserUrlsUrl ='/api/loadUserUrls.php';
    const payload = {};
    
    axios.get(loadUserUrlsUrl,payload)
    .then(resp=>{
      setDataLists(dataLists => ({ ...dataLists, urlIds: resp.data.urlIds }))
      setDataInfo(dataInfo => ({ ...dataInfo, urlInfo: Object.assign({}, dataInfo.urlInfo, resp.data.urlInfo)}))
      setFlags(flags => ({ ...flags, urls_loaded: true }));
      callback();
    });
  };

  const loadAllCourses = (callback=(()=>{})) => {
    setFlags({ ...flags, courses_loaded: true });
    const loadCoursesUrl='/api/loadAllCourses.php';
    const data={
    }
    const payload = {
      params: data
    }
    axios.get(loadCoursesUrl, payload)
    .then(resp=>{
      setDataInfo(dataInfo => ({ ...dataInfo, courseInfo: Object.assign({}, dataInfo.courseInfo, resp.data.courseInfo) }))
      setDataLists(dataLists => ({ ...dataLists, courseIds: resp.data.courseIds }))
      setFlags(flags => ({ ...flags, courses_loaded: true }));
      callback();
    });
  };

  const loadCourseContent = (courseId, callback=(()=>{})) => {
    setFlags({ ...flags, folders_loaded: false, branches_loaded: false});
    
    const loadCoursesUrl='/api/loadCourseContent.php';
    const data={
      courseId: courseId
    }
    const payload = {
      params: data
    }

    axios.get(loadCoursesUrl,payload)
    .then(resp=>{
      setDataInfo(dataInfo => ({ 
        ...dataInfo, 
        folderInfo: Object.assign({}, dataInfo.folderInfo, resp.data.folderInfo),
        contentInfo: Object.assign({}, dataInfo.contentInfo, resp.data.branchInfo)
      }))
      setFlags({ ...flags, folders_loaded: true, branches_loaded: true});
      callback();
    });
  }

  const updateDirectoryStack = (directoryStack) => {
    setAppState(appState => ({...appState, directoryStack: directoryStack}))
  }

  const updateSelectedItems = ({selectedItems, selectedItemsType}) => {
    setAppState(appState => ({
      ...appState, 
      selectedItems: selectedItems,
      selectedItemsType: selectedItemsType,
    }))
  }

  const onDragStart = (draggedId, draggedType, sourceContainerId) => {
    console.log("onDragStart")
    const dataObjectSource = draggedType == "leaf" ? dataInfo.courseAssignmentsInfo : dataInfo.courseHeadingsInfo;
    const dataObject = dataObjectSource[draggedId];
    const sourceParentId = dataObjectSource[draggedId].parent;
    
    setAppState(appState => { 
      const newAppState = {...appState};
      newAppState.currentDraggedObject = {id: draggedId, type: draggedType, sourceContainerId: sourceContainerId, dataObject: dataObject, sourceParentId: sourceParentId};
      newAppState.originalTreeParentsAndLeaves = { 
          parents: JSON.parse(JSON.stringify(dataInfo.courseHeadingsInfo)), 
          leaves: JSON.parse(JSON.stringify(dataInfo.courseAssignmentsInfo))
      }
      newAppState.validDrop = false;
      return newAppState;
    })
  }

  const onTreeDraggableDragOver = (id, type) => {
    console.log("treeDraggableDragOver")
    // draggedType must be equal to dragOver type
    if (type != appState.currentDraggedObject.type || id == "UltimateHeader") return;

    const draggedOverItemInfo = type == "leaf" ? dataInfo.courseAssignmentsInfo : dataInfo.courseHeadingsInfo;
    const headingsChildrenListKey = type == "leaf" ? "assignmentId" : "headingId";
    const currentDraggedObjectInfo = appState.currentDraggedObject.type == "leaf" ? dataInfo.courseAssignmentsInfo : dataInfo.courseHeadingsInfo;

    const draggedOverItemParentListId = draggedOverItemInfo[id]["parent"];
    const draggedOverItemIndex = dataInfo.courseHeadingsInfo[draggedOverItemParentListId][headingsChildrenListKey]
      .findIndex(itemId => itemId == id);

    const draggedItemParentListId = currentDraggedObjectInfo[appState.currentDraggedObject.id]["parent"];

    // if the item is dragged over itself, ignore
    if (appState.currentDraggedObject.id == id || draggedItemParentListId != draggedOverItemParentListId) {
      return;
    } 

    // filter out the currently dragged item
    const items = dataInfo.courseHeadingsInfo[draggedOverItemParentListId][headingsChildrenListKey].filter(itemId => itemId != appState.currentDraggedObject.id);
    // add the dragged item after the dragged over item
    items.splice(draggedOverItemIndex, 0, appState.currentDraggedObject.id);

    // update headings
    // const newCourseHeadings = dataInfo.courseHeadingsInfo;
    // newCourseHeadings[draggedOverItemParentListId][headingsChildrenListKey] = items;
    // setDataInfo(dataInfo => ({ 
    //   ...dataInfo,
    //   courseHeadingsInfo: newCourseHeadings
    // }))
    setDataInfo(dataInfo => { 
      const newDataInfo = {...dataInfo};
      newDataInfo.courseHeadingsInfo[draggedOverItemParentListId][headingsChildrenListKey] = items;
      return newDataInfo;
    })
  };

  const onDropEnter = (listId) => {
    console.log("onDropEnter")

    // check current draggable source == tree
    // true then continue
    // false then (extract from original source, insert into tree at base level)

    // temp fix, do we want to allow assignments at base level
    if (listId == "UltimateHeader" && appState.currentDraggedObject.type == "leaf") return;

    const currentDraggedObjectInfo = appState.currentDraggedObject.dataObject;
    const previousParentId = currentDraggedObjectInfo.parent;

    if (previousParentId == listId || listId == appState.currentDraggedObject.id) // prevent heading from becoming a child of itself 
      return;
    
    const headingsChildrenListKey = appState.currentDraggedObject.type == "leaf" ? "assignmentId" : "headingId";
    const previousList = dataInfo.courseHeadingsInfo[previousParentId][headingsChildrenListKey];
    const currentList = dataInfo.courseHeadingsInfo[listId][headingsChildrenListKey];
    // remove from previous list
    if (previousParentId !== appState.currentDraggedObject.sourceParentId) {
      const indexInList = previousList.findIndex(itemId => itemId == appState.currentDraggedObject.id);
      if (indexInList > -1) {
        previousList.splice(indexInList, 1);
      }
    }
    if (listId !== appState.currentDraggedObject.sourceParentId) {
      // add to current list
      currentList.push(appState.currentDraggedObject.id);     
    }

    // // update headings
    // const newCourseHeadings = dataInfo.courseHeadingsInfo;
    // newCourseHeadings[previousParentId][headingsChildrenListKey] = previousList;
    // newCourseHeadings[listId][headingsChildrenListKey] = currentList;
    // setDataInfo(dataInfo => ({ 
    //   ...dataInfo,
    //   courseHeadingsInfo: newCourseHeadings
    // }))
    // // update dragged object
    // const newCurrentDraggedObject = appState.currentDraggedObject;
    // newCurrentDraggedObject.dataObject.parent = listId;
    // setAppState(appState => ({ 
    //   ...appState,
    //   currentDraggedObject: newCurrentDraggedObject
    // }))

    setDataInfo(dataInfo => { 
      const newDataInfo = {...dataInfo};
      newDataInfo.courseHeadingsInfo[previousParentId][headingsChildrenListKey] = previousList;
      newDataInfo.courseHeadingsInfo[listId][headingsChildrenListKey] = currentList;
      return newDataInfo;
    })
    setAppState(appState => { 
      const newAppState = {...appState};
      newAppState.currentDraggedObject.dataObject.parent = listId;
      return newAppState;
    })
  }

  const onDragEnd = () => {
    console.log("onDragEnd")
    console.log(appState)
    // dropped outsize valid dropzone
    let currTreeHeadings = dataInfo.courseHeadingsInfo;
    let currTreeAssignments = dataInfo.courseAssignmentsInfo;
    if (!appState.validDrop) {
      currTreeHeadings = appState.originalTreeParentsAndLeaves.parents;
      currTreeAssignments = appState.originalTreeParentsAndLeaves.leaves;
    }
    // updateHeadingsAndAssignments(currTreeHeadings, currTreeAssignments);

    setDataInfo(dataInfo => ({ ...dataInfo, courseHeadingsInfo: currTreeHeadings, courseAssignmentsInfo: currTreeAssignments }))
    setAppState(appState => ({ ...appState, 
      currentDraggedObject: {id: null, type: null, sourceContainerId: null},
      originalTreeParentsAndLeaves: { parents: null, leaves: null },
      validDrop: true
    }))
  }

  const onDrop = () => {
    console.log("onDrop")
    // update courseHeadingsInfo/courseAssignmentsInfo currentDraggedObject parentId
    // remove currentDraggedObject from sourceParentId children list
    if (appState.currentDraggedObject.type == "leaf") {
      const newCourseAssignments = dataInfo.courseAssignmentsInfo;
      newCourseAssignments[appState.currentDraggedObject.id] = appState.currentDraggedObject.dataObject;
      setDataInfo(dataInfo => ({ ...dataInfo, courseAssignmentsInfo: newCourseAssignments }))
    }
    const headingsChildrenListKey = appState.currentDraggedObject.type == "leaf" ? "assignmentId" : "headingId";
    const sourceParentChildrenList = dataInfo.courseHeadingsInfo[appState.currentDraggedObject.sourceParentId][headingsChildrenListKey];
    
    if (appState.currentDraggedObject.dataObject.parent !== appState.currentDraggedObject.sourceParentId) {
      const indexInSourceParentChildrenList = sourceParentChildrenList.findIndex(itemId => itemId == appState.currentDraggedObject.id);
      if (indexInSourceParentChildrenList > -1) {
        sourceParentChildrenList.splice(indexInSourceParentChildrenList, 1);
      }
    }
    
    // updateHeadingsAndAssignments(courseHeadingsInfo, courseAssignmentsInfo);
    
    // update headings
    const newCourseHeadings = dataInfo.courseHeadingsInfo;
    newCourseHeadings[appState.currentDraggedObject.sourceParentId][headingsChildrenListKey] = sourceParentChildrenList;
    if (appState.currentDraggedObject.type == "parent") newCourseHeadings[appState.currentDraggedObject.id] = appState.currentDraggedObject.dataObject;
    setDataInfo(dataInfo => ({ ...dataInfo, courseHeadingsInfo: newCourseHeadings }))
    setAppState(appState => ({ ...appState, 
      currentDraggedObject: {id: null, type: null, sourceContainerId: null},
      validDrop: true
    }))
  }

  console.log("rerendered")

  const providerValue = {
    data: {
      dataLists: dataLists,
      dataInfo: dataInfo
    },
    appState: appState,
    methods: {
      updateDirectoryStack,
      updateSelectedItems,
      loadUserContentBranches,
      loadAllCourses,
      loadUserFoldersAndRepo,
      loadUserUrls,
      loadCourseContent,
      onTreeDraggableDragOver,
      onDragStart,
      onDragEnd,
      onDropEnter,
      onDrop, 
    },
    flags: flags
  }
  // console.log(providerValue)

  return (
    <ChooserContext.Provider value={providerValue}>
      {children}
    </ChooserContext.Provider>
  );
};