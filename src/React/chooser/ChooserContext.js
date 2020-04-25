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
    directoryStack: [],
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
    loadHeadingsAndAssignments();
  }, [])  

  const loadHeadingsAndAssignments = () => {
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
    setAppState({...appState, directoryStack: directoryStack})
  }

  const providerValue = {
    data: {
      dataLists: dataLists,
      dataInfo: dataInfo
    },
    appState: appState,
    methods: {
      updateDirectoryStack,
      loadUserContentBranches,
      loadAllCourses,
      loadUserFoldersAndRepo,
      loadUserUrls,
      loadCourseContent
    },
    flags: flags
  }
  console.log(providerValue)

  return (
    <ChooserContext.Provider value={providerValue}>
      {children}
    </ChooserContext.Provider>
  );
};