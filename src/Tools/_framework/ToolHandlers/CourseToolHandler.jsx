import  { useRef } from 'react';
import { atom, useRecoilValue,selector, useRecoilCallback, useRecoilState, useSetRecoilState } from 'recoil'
import { searchParamAtomFamily, toolViewAtom, paramObjAtom } from '../NewToolRoot';
import { mainPanelClickAtom } from '../Panels/NewMainPanel';
import { selectedMenuPanelAtom } from '../Panels/NewMenuPanel';
import { globalSelectedNodesAtom } from '../../../_reactComponents/Drive/NewDrive';
import axios from "axios";

export const drivecardSelectedNodesAtom = atom({
  key:'drivecardSelectedNodesAtom',
  default:[]
})

export const fetchDrivesQuery = atom({
  key:"fetchDrivesQuery",
  default: selector({
    key:"fetchDrivesQuery/Default",
    get: async ()=>{
      const { data } = await axios.get(`/api/loadAvailableDrives.php`);
      return data
    },
  })
})
export const fetchDrivesSelector = selector({
  key:"fetchDrivesSelector",
  get:({get})=>{
    return get(fetchDrivesQuery);
  },
  set:({get,set},labelTypeDriveIdColorImage)=>{
    let driveData = get(fetchDrivesQuery)
    // let selectedDrives = get(selectedDriveInformation);
    let newDriveData = {...driveData};
    newDriveData.driveIdsAndLabels = [...driveData.driveIdsAndLabels];
    let params = {
      driveId:labelTypeDriveIdColorImage.newDriveId,
      label:labelTypeDriveIdColorImage.label,
      type:labelTypeDriveIdColorImage.type,
      image:labelTypeDriveIdColorImage.image,
      color:labelTypeDriveIdColorImage.color,
    }
    let newDrive;
    function duplicateFolder({sourceFolderId,sourceDriveId,destDriveId,destFolderId,destParentFolderId}){
      let contentObjs = {};
      // const sourceFolder = get(folderDictionary({driveId:sourceDriveId,folderId:sourceFolderId}));  
      const sourceFolder = get(folderDictionaryFilterSelector({driveId:sourceDriveId,folderId:sourceFolderId}));
      if (destFolderId === undefined){
        destFolderId = destDriveId;  //Root Folder of drive
        destParentFolderId = destDriveId;  //Root Folder of drive
      }

      let contentIds = {defaultOrder:[]};
      let contentsDictionary = {}
      let folderInfo = {...sourceFolder.folderInfo}
      folderInfo.folderId = destFolderId;
      folderInfo.parentFolderId = destParentFolderId;

      for (let sourceItemId of sourceFolder.contentIds.defaultOrder){
        const destItemId = nanoid();
        contentIds.defaultOrder.push(destItemId);
        let sourceItem = sourceFolder.contentsDictionary[sourceItemId]
        contentsDictionary[destItemId] = {...sourceItem}
        contentsDictionary[destItemId].parentFolderId = destFolderId;
        contentsDictionary[destItemId].itemId = destItemId;
        if (sourceItem.itemType === 'Folder'){
         let childContentObjs = duplicateFolder({sourceFolderId:sourceItemId,sourceDriveId,destDriveId,destFolderId:destItemId,destParentFolderId:destFolderId})
          contentObjs = {...contentObjs,...childContentObjs};
        }else if (sourceItem.itemType === 'DoenetML'){
          let destDoenetId = nanoid();
          contentsDictionary[destItemId].sourceDoenetId = sourceItem.doenetId;
          contentsDictionary[destItemId].doenetId = destDoenetId;
        }else if (sourceItem.itemType === 'URL'){
          let desturlId = nanoid();
          contentsDictionary[destItemId].urlId = desturlId;
        }else{
          console.log(`!!! Unsupported type ${sourceItem.itemType}`)
        }
        contentObjs[destItemId] = contentsDictionary[destItemId];
      }
      const destFolderObj = {contentIds,contentsDictionary,folderInfo}
      // console.log({destFolderObj})
      set(folderDictionary({driveId:destDriveId,folderId:destFolderId}),destFolderObj)
      return contentObjs;
    }
    if (labelTypeDriveIdColorImage.type === "new content drive"){
      newDrive = {
        driveId:labelTypeDriveIdColorImage.newDriveId,
        isShared:"0",
        label:labelTypeDriveIdColorImage.label,
        type: "content"
      }
      newDriveData.driveIdsAndLabels.unshift(newDrive)
    set(fetchDrivesQuery,newDriveData)

    const payload = { params }
    axios.get("/api/addDrive.php", payload)
  // .then((resp)=>console.log(">>>resp",resp.data))
    }else if (labelTypeDriveIdColorImage.type === "new course drive"){
      newDrive = {
        driveId:labelTypeDriveIdColorImage.newDriveId,
        isShared:"0",
        label:labelTypeDriveIdColorImage.label,
        type: "course",
        image:labelTypeDriveIdColorImage.image,
        color:labelTypeDriveIdColorImage.color,
        subType:"Administrator"
      }
      newDriveData.driveIdsAndLabels.unshift(newDrive)
    set(fetchDrivesQuery,newDriveData)

    const payload = { params }
    axios.get("/api/addDrive.php", payload)
  // .then((resp)=>console.log(">>>resp",resp.data))
    
    }else if (labelTypeDriveIdColorImage.type === "update drive label"){
      //Find matching drive and update label
      for (let [i,drive] of newDriveData.driveIdsAndLabels.entries()){
        if (drive.driveId === labelTypeDriveIdColorImage.newDriveId ){
          let newDrive = {...drive};
          newDrive.label = labelTypeDriveIdColorImage.label
          newDriveData.driveIdsAndLabels[i] = newDrive;
          break;
        }
      }
      //Set drive
    set(fetchDrivesQuery,newDriveData)
      //Save to db
      const payload = { params }
      axios.get("/api/updateDrive.php", payload)
    }else if (labelTypeDriveIdColorImage.type === "update drive color"){
    //TODO: implement      

    }else if (labelTypeDriveIdColorImage.type === "delete drive"){
      //Find matching drive and update label
      let driveIdsAndLabelsLength = newDriveData.driveIdsAndLabels;
      // for (let [i,drive] of newDriveData.driveIdsAndLabels.entries()){
        for(let i = 0; i< driveIdsAndLabelsLength.length; i++){
        for(let x=0; x<labelTypeDriveIdColorImage.newDriveId.length ;x++){
          if (driveIdsAndLabelsLength[i].driveId === labelTypeDriveIdColorImage.newDriveId[x] ){
            newDriveData.driveIdsAndLabels.splice(i,1);
            i = i - 1;
          }
        }
      }
      //Set drive
      set(fetchDrivesQuery,newDriveData)
        //Save to db
        const payload = { params }
        axios.get("/api/updateDrive.php", payload)
    }
  }
})

export default function CourseToolHandler(props){
  console.log(">>>===CourseToolHandler")
  
  let lastAtomTool = useRef("");

  const setTool = useRecoilCallback(({set})=> (tool,lastAtomTool)=>{
    //Set starting tool
    // if (tool === ""){
    //   tool = 'courseChooser';
    //   window.history.replaceState('','','/new#/course?tool=courseChooser')
    // }
    // if (tool === lastAtomTool){ return; }

      if (tool === 'courseChooser'){
        set(toolViewAtom,(was)=>{
          let newObj = {...was}
          newObj.currentMainPanel = "DriveCards";
          newObj.currentMenus = ["CreateCourse","CourseEnroll"];
          newObj.menusTitles = ["Create Course","Enroll"];
          newObj.menusInitOpen = [true,false];
          return newObj;
        });
        set(selectedMenuPanelAtom,""); //clear selection
        set(mainPanelClickAtom,[{atom:drivecardSelectedNodesAtom,value:[]},{atom:selectedMenuPanelAtom,value:""}])
      }else if (tool === 'navigation'){
        // if (role === "Student"){
          //TODO
        // }else if (role === "Owner" || role === "Admin"){
            set(toolViewAtom,(was)=>{
              let newObj = {...was}
              newObj.currentMainPanel = "DrivePanel";
              newObj.currentMenus = ["AddDriveItems","EnrollStudents"];
              newObj.menusTitles = ["Add Items","Enrollment"];
              newObj.menusInitOpen = [true,false];

              return newObj;
            });
        // }
        set(selectedMenuPanelAtom,""); //clear selection
        set(mainPanelClickAtom,[{atom:globalSelectedNodesAtom,value:[]},{atom:selectedMenuPanelAtom,value:""}])
      }else if (tool === 'editor'){
        console.log(">>>editor!")
        // set(toolViewAtom,(was)=>{
        //   let newObj = {...was}
        //   newObj.currentMainPanel = "DriveCards";
        //   return newObj;
        // });
        set(selectedMenuPanelAtom,""); //clear selection
        set(mainPanelClickAtom,[])  //clear main panel click
      }else{
        console.log(">>>Course Tool Handler: didn't match!")
      }
  })
  const atomTool = useRecoilValue(searchParamAtomFamily('tool')) 
  const setParamObj = useSetRecoilState(paramObjAtom);
  // console.log(`>>>atomTool >${atomTool}< lastAtomTool.current >${lastAtomTool.current}<`)


  //Update panels when tool changes
  if (atomTool !== lastAtomTool.current){
    setTool(atomTool,lastAtomTool.current)
    lastAtomTool.current = atomTool;
  }else if (atomTool === '' && lastAtomTool.current === ''){
    setParamObj({tool:'courseChooser'})
  }
  return null;

}