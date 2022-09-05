import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { searchParamAtomFamily } from '../NewToolRoot';
import axios from 'axios';
import { serializedComponentsReviver } from '../../../Core/utils/serializedStateProcessing';
// import { CSVDownload } from 'https://cdn.skypack.dev/react-csv';
// import reactCSV from 'https://cdn.skypack.dev/react-csv';


export default function SurveyDataViewer() {
  // console.log(">>>===SurveyDataViewer")
  let doenetId = useRecoilValue(searchParamAtomFamily('doenetId'))
  let driveId = useRecoilValue(searchParamAtomFamily('driveId'))

  let [stateVariableData,setStateVariableData] = useState(null)

  useEffect(()=>{
    async function getData(doenetId){
      let {data} = await axios.get('/api/getSurveyData.php',{params:{doenetId}})
      setStateVariableData(data.responses)
    }
    if (doenetId){
      getData(doenetId);
    }

  },[doenetId])
  

  if (!driveId || !stateVariableData){
     return null; 
    }



      let columns = ["User's Name","Email","Student Id"];
      // let csvData = [];

      //Go through all stateVariable data and build header row of columns
      for (let svObj of stateVariableData){

        let svars = JSON.parse(
          svObj.stateVariables,
          serializedComponentsReviver,
        );
        for (let key of Object.keys(svars)){
          if (!columns.includes(key)){
            let value = svars[key];
            if (value?.immediateValue ||
              value?.value ||
              value?.allSelectedIndices
              ){
            columns.push(key);
            }
          }
        }

      }

      let rowsJSX = [];
      //Use header info to fill rows
      for (let [x,svObj] of Object.entries(stateVariableData)){
        let svars = JSON.parse(
          svObj.stateVariables,
          serializedComponentsReviver,
        );
        let cellsJSX = []
        for (let [i,key] of Object.entries(columns)){
          if (i > 2){
            let value = svars[key];
            let response = 'N/A';
            if (value?.immediateValue){
              response = value.immediateValue;
            }else if (value?.value){
              response = value.value;
            }else if (value?.allSelectedIndices){
              response = value.allSelectedIndices[0];
            }
            cellsJSX.push(<td key={`survey${x}-${i}`}>{response}</td>)
            
          }
        }

        cellsJSX.unshift(<td>{svObj.studentId}</td>)
        cellsJSX.unshift(<td>{svObj.email}</td>)
        cellsJSX.unshift(<td>{`${svObj.firstName} ${svObj.lastName}`}</td>)

        rowsJSX.push(<tr style={{borderBottom:'1pt solid var(--canvastext)'}}>
            {cellsJSX}
          </tr>)

      }

      let thJSX = [];
      for (let [i,column] of Object.entries(columns)){
        thJSX.push(<th key={`surveyHead${i}`} style={{width:'150px'}}>{column}</th>)
      }



      return <div style={{margin:'5px'}}>
      {/* <CSVDownload data={csvData} target="_blank" /> */}
    <table style={{borderCollapse: "collapse"}}>
      <thead>
        <tr style={{borderBottom:'2pt solid var(--canvastext)'}}>
          {thJSX}
        </tr>
      </thead>
      <tbody>
      {rowsJSX}
      </tbody>
    </table>
    
    </div>



  // const csvData = [
  //   ["firstname", "lastname", "email"],
  //   ["Ahmed", "Tomi", "ah@smthing.co.com"],
  //   ["Raed", "Labes", "rl@smthing.co.com"],
  //   ["Yezzi", "Min l3b", "ymin@cocococo.com"]
  // ];

  
  
}
