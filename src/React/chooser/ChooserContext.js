import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const ChooserContext = createContext();

export const ChooserProvider = ({ children }) => {
  const [dataLists, setDataLists] = useState({
    userContent: {},
  });
  const [dataInfo, setDataInfo] = useState({
    userContentInfo: {},
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
  // 

  useEffect(() => {
    const loadHeadingsAndAssignments = () => {
      const url = "/api/getHeaderAndAssignmentInfo.php";
      axios(url).then(resp => {
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

        setDataInfo({
          ...dataInfo,
          courseHeadingsInfo: tempHeadingsInfo, 
          courseAssignmentsInfo: tempAssignmentsInfo, 
        })
        setFlags({
          ...flags,
          assignments_and_headings_loaded: true
        });
      })
    } 
    loadHeadingsAndAssignments();
    console.log("useEffect")
  }, [JSON.stringify(dataInfo.courseAssignmentsInfo), JSON.stringify(dataInfo.courseHeadingsInfo)])

  console.log("rerender")
  // useEffect(() => {
    //   const loadUserContentBranches = () => {
    //     setFlags({
    //       ...flags,
    //       branches_loaded: false
    //     });
    //     // TODO: persist directoryStack info
    //     let currentFolderId = this.state.directoryStack.length === 0 ?
    //                             "root" : this.state.directoryStack[this.state.directoryStack.length - 1];
    
    //     const data={folderId: currentFolderId};
    //     const payload = {params: data};
    
    //     const loadBranchesUrl='/api/loadUserContent.php';
        
    //     axios.get(loadBranchesUrl, payload)
    //     .then(resp=>{
    //       setDataInfo({
    //         ...dataInfo,
    //         userContentInfo: Object.assign({}, userContentInfo, resp.data.branchId_info)
    //       })
    //       setDataLists({
    //         ...dataLists,
    //         userContent: resp.data.sort_order
    //       })
    //       setFlags({
    //         ...flags,
    //         branches_loaded: true
    //       });
    //     });
    //   };
    //   // loadUserContentBranches();
    // }, [data.userContentBranches])

  // HANDLES EVENTS / STATE MANIPULATION
  const handleAppParamChange = (obj) => {
      const newAppParam = Object.assign({}, appParam, obj);
      setAppParam(newAppParam);
  }

  const loadUserFoldersAndRepo = () => {

  };

  const loadUserUrls = () => {

  };

  const loadAllCourses = () => {

  };


  const providerValue = {
    data: {
      dataLists: dataLists,
      dataInfo: dataInfo
    },
    methods: {
      handleAppParamChange
    },
    flags: flags
  }

  return (
    <ChooserContext.Provider value={providerValue}>
      {children}
    </ChooserContext.Provider>
  );
};