import React from 'react'
// import { useBreadcrumbItems } from './hooks/useBreadcrumbItems'
// import BreadcrumbItem from './components/BreadcrumbItem'
// import BreadcrumbDivider from './components/BreadcrumbDivider'
// import { BreadcrumbContext } from "./BreadcrumbProvider";
// import {
//   useHistory
// } from "react-router-dom";
import { faTh} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { drivePathSyncFamily, folderDictionary, fetchDrivesQuery } from '../Drive/Drive';
import { useRecoilValue, useRecoilState, atomFamily, selectorFamily } from 'recoil';

const breadcrumbItemAtomFamily = atomFamily({
  key:"breadcrumbItemAtomFamily",
  default:selectorFamily({
    key:"breadcrumbItemAtomFamily/Default",
    get:(driveIdFolderId)=>({get})=>{
      let items = [];
      let driveId = driveIdFolderId.driveId;
      let folderId = driveIdFolderId.folderId;
      if (!driveId){
        return items
      }
      while (folderId){
        let folderInfo = get(folderDictionary({driveId,folderId}));
        if (!folderInfo.folderInfo.itemId){ break; }
        
        items.push({
          type:"Folder",
          folderId:folderInfo.folderInfo.itemId,
          label:folderInfo.folderInfo.label,
        })
        folderId = folderInfo.folderInfo.parentFolderId;
      }
      const drivesInfo = get(fetchDrivesQuery);
      let driveObj = {type:"Drive",folderId:driveId}
      for (let drive of drivesInfo.driveIdsAndLabels){
        if (drive.driveId === driveId){
          driveObj.label = drive.label;
          break;
        }
      }
      items.push(driveObj)
      return items
    }
  })
});


export const BreadcrumbContainer = (props) => {
  const [drivePath,setDrivePath] = useRecoilState(drivePathSyncFamily(props.drivePathSyncKey))
  const items = useRecoilValue(breadcrumbItemAtomFamily({driveId:drivePath.driveId,folderId:drivePath.parentFolderId}))
 
  // console.log(">>>drivePath",drivePath)
  // console.log(">>>BreadcrumbContainer",props)
  // console.log(">>>items",items)


  let leftmostBreadcrumb = <span onClick={()=>{
    setDrivePath({
      driveId:"",
      parentFolderId:"",
      itemId:"",
      type:""
    })
  }}><FontAwesomeIcon icon={faTh}/></span>

  //Don't show up if not in a drive
  if (drivePath.driveId === ""){
    return null;
  }

  let reversed = [...items];
  reversed.reverse();

  let children = [];
  for (let item of reversed){
    children.push(<span onClick={()=>{
      setDrivePath({
        driveId:drivePath.driveId,
        parentFolderId:item.folderId,
        itemId:item.folderId,
        type:"Folder"
      })
    }}>{item.label} / </span>)
  }

  return <div style={{margin:"10px"}}>{leftmostBreadcrumb} {children}</div>

  // const items = useBreadcrumbItems();
  // const { clearItems: clearBreadcrumb } = useContext(BreadcrumbContext);
  
  // let children = items.map((item, index) => (
  //   <BreadcrumbItem key={`breadcrumbItem${index}`}>
  //     {item.element}
  //   </BreadcrumbItem>
  // ));

  // const lastIndex = children.length - 1;
  // children = children.reduce((acc, child, index) => {
  //   let notLast = index < lastIndex;
  //   if (notLast) {
  //     acc.push(
  //       child,
  //       <BreadcrumbDivider key={`breadcrumbDivider${index}`}>
  //         {divider}
  //       </BreadcrumbDivider>,
  //     )
  //   } else {
  //     acc.push(child);
  //   }
  //   return acc;
  // }, [])

  // const breadcrumbContainerStyle = {
  //   listStyle: "none",
  //   display: "flex",
  //   flexWrap: "wrap",
  //   overflow: "hidden",
  //   padding:"12px 0px",
  //   alignItems: "center",
  //   width: "100%",
  //   borderBottom: "1px solid #cdcdcd",
  //   margin: "0",
  // }
  // const history = useHistory();
  // let encodeParams = (p) =>
  //   Object.entries(p)
  //     .map((kv) => kv.map(encodeURIComponent).join("="))
  //     .join("&");
  // const leftmostBreadcrumb = () =>{
  //   clearBreadcrumb();
  //   let newParams = {};
  //   newParams["path"] = `:::`;
  //   history.push("?" + encodeParams(newParams));
  
  // }

  // return (<ol style={breadcrumbContainerStyle}>{<div onClick={leftmostBreadcrumb} 
  //   style={{marginLeft:'10px',marginRight:'10px'}}
  //    >{<FontAwesomeIcon icon={faTh}/>}</div>}{children}</ol>);

};