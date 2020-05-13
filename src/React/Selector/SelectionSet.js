import React, {useState,
  // useEffect,useRef 
} from 'react';
import styled from 'styled-components';
import {
  HashRouter as Router, // TODO: try not to use HashRouter, user BrownserRouter instead
  // Switch,
  // Route,
  Link,
} from "react-router-dom";
// import {animated,useSpring} from 'react-spring';
// TO-DO: add documentation for this componenet
// documentation for this componenet how options work
/**
 * first selectionSet takes in allElements and determines if it is a independent item or set
 * if it is an independent item then it checks if it is a link or not
 * the callBack will check either the key exists in OverloadingFunctionOnItems or 
 *   if the key has a value called 'callBack' or
 * exists a CommonCallBack function. By arranging this way the program will prioritize either callBack function
 * exists in OverloadingFunctionOnItems or as a 'callBack' value of the key
 */
const IndependentItemNotSelected = styled.div`

font-size: 18px;

`
const IndependentItemSelected = styled.div `
padding-left: 5px;
font-size: 18px;


background-color: gainsboro;
border-left: 5px solid green;
`
const ItemNotSelected = styled.div`
padding-left: 10px;
font-size: 18px;

`
const ItemSelected = styled.div `
padding-left: 5px;
font-size: 18px;


background-color: gainsboro;
border-left: 5px solid green;
`
const Set = styled.div`
font-size: 18px;

`
const SelectionSet = ({allElements,CommonCallBack,type="",forceSelected=""}) =>{
  console.log("from SelectionSet")
  const [openSet,setOpenSet]=useState([""]);
  const [selectedItem,setSelectedItem] = useState("");
  console.log(`selectedItem: ${selectedItem}`)
  console.log(`forceSelected: ${forceSelected}`)
  if (selectedItem!=""){
    forceSelected = selectedItem
  }

  let updateNumber =0 ;
  let sets=[]
  let branch = null;
  Object.keys(allElements).map((item)=>{
    const IndependentItemNotSelectedStyle = {
      fontSize: "18px",
      display:"flex",
      justifyContent: "flex-start",
      padding: "2px",
      margin: "1px 0px 1px 0px",
      cursor: "pointer",
      color:(allElements[item]['grayOut']?"grey":"black"),
      textDecoration:"none"
    }
    const IndependentItemSelectedStyle = {
      fontSize: "18px",
      display:"flex",
      justifyContent: "flex-start",
      paddingLeft: "5px",
      margin: "1px 0px 1px 0px",    
      backgroundColor: "gainsboro",
      borderLeft: "5px solid green",
      cursor: "pointer",
      color:(allElements[item]['grayOut']?"grey":"black"),      
      textDecoration:"none"
    }


    if (allElements[item]['type']==="IndependentItem"){ // individual items
      if (selectedItem===allElements[item]['thisElementLabel'] || forceSelected===allElements[item]['thisElementLabel']){
        if (type==="Link"){
          console.log("this000")
          branch = (
            <Link
              style={IndependentItemSelectedStyle}
              to={`/${allElements[item]['thisElementLabel']}`}
              key={updateNumber++}
              onClick={()=>{
                console.log("calling THIS")
                if (selectedItem!=allElements[item]['thisElementLabel']){
                  setSelectedItem(allElements[item]['thisElementLabel'])
                }
                if (allElements[item]['OverloadingFunctionOnItems'] && allElements[item]['OverloadingFunctionOnItems'][allElements[item]['thisElementLabel']]){
                  allElements[item]['OverloadingFunctionOnItems'][allElements[item]['thisElementLabel']]()
                } 
                else if (allElements[item]['callBack']){
                  allElements[item]['callBack']()
                }
                else if (CommonCallBack(allElements[item]['thisElementLabel'])) {
                  CommonCallBack(allElements[item]['thisElementLabel']);
                }
                //allElements[item]['callBack'](e)
              }
            }
            >
            {allElements[item]['thisElementLabel']}
                  
            </Link>
          )
        } else {
          branch=(
            <IndependentItemSelected
          key={updateNumber++}
          onClick={()=>{
            if (selectedItem!=allElements[item]['thisElementLabel']){
              setSelectedItem(allElements[item]['thisElementLabel'])
            }
            if (allElements[item]['OverloadingFunctionOnItems'] && allElements[item]['OverloadingFunctionOnItems'][allElements[item]['thisElementLabel']]){
              allElements[item]['OverloadingFunctionOnItems'][allElements[item]['thisElementLabel']]()
            } 
            else if (allElements[item]['callBack']){
              allElements[item]['callBack']()
            }
            else if (CommonCallBack(allElements[item]['thisElementLabel'])) {
              CommonCallBack(allElements[item]['thisElementLabel']);
            }
            //allElements[item]['callBack'](e)
          }
        }
            >
            {allElements[item]['thisElementLabel']}
            </IndependentItemSelected>
        )
        }
        
      } else{ //"IndependentItem" and not selected
        if (type==="Link"){
          console.log("this001")
          branch = (
            <Link
              style={IndependentItemNotSelectedStyle}
              to={`/${allElements[item]['thisElementLabel']}`}
              key={updateNumber++}
              onClick={()=>{
                console.log("calling 001")
                if (selectedItem!=allElements[item]['thisElementLabel']){
                  setSelectedItem(allElements[item]['thisElementLabel'])
                }
                if (allElements[item]['OverloadingFunctionOnItems'] && allElements[item]['OverloadingFunctionOnItems'][allElements[item]['thisElementLabel']]){
                  allElements[item]['OverloadingFunctionOnItems'][allElements[item]['thisElementLabel']]()
                } 
                else if (allElements[item]['callBack']){
                  allElements[item]['callBack']()
                }
                else if (CommonCallBack(allElements[item]['thisElementLabel'])) {
                  CommonCallBack(allElements[item]['thisElementLabel']);
                }
                //allElements[item]['callBack'](e)
              }
            }
            >
            {allElements[item]['thisElementLabel']}
                  
            </Link>
          )
        }
        else {
          branch = (<IndependentItemNotSelected
            key={updateNumber++}
            onClick={()=>{
              if (selectedItem!=allElements[item]['thisElementLabel']){
                setSelectedItem(allElements[item]['thisElementLabel'])
              }
              if (allElements[item]['OverloadingFunctionOnItems'] && allElements[item]['OverloadingFunctionOnItems'][allElements[item]['thisElementLabel']]){
                allElements[item]['OverloadingFunctionOnItems'][allElements[item]['thisElementLabel']]()
              } 
              else if (allElements[item]['callBack']){
                allElements[item]['callBack']()
              }
              else if (CommonCallBack(allElements[item]['thisElementLabel'])) {
                CommonCallBack(allElements[item]['thisElementLabel']);
              }
              //allElements[item]['callBack'](e)
            }
          }
            >
            {allElements[item]['thisElementLabel']}
            </IndependentItemNotSelected>
            )
        }
        
      }
      sets.push(branch)
    } 
      
      
      ////////////////////////////////////////////////////////////////////////
      

      
    //#################################################################
    if (allElements[item]['type']==="IndependentSet"){ // individual set
      // making the set name
      sets.push(<Set
        key={updateNumber++} 
        onClick={()=>{
          
            // push() will not work as it return the length not an array

          if (openSet.includes(allElements[item]['thisElementLabel'])){
            let name = allElements[item]['thisElementLabel']
            // setSelectedItem(""); OPTIONAL
            setOpenSet(openSet.filter(item=>item!==name));

          } else {
          setOpenSet(openSet=>openSet.concat(allElements[item]['thisElementLabel']))   

          }
      }}     
      >
        {allElements[item]['thisElementLabel']}
        </Set>)


        if (openSet.includes(allElements[item]['thisElementLabel'])){
          allElements[item]['subSet'].forEach(labelOfEachChoice => {
            if (type==="Link"){
              // default not selected
              branch = (
                <Link
                  to={`/${labelOfEachChoice}`}
                  key={updateNumber++}
                  onClick={()=>{
                    if (selectedItem!=labelOfEachChoice){
                      setSelectedItem(labelOfEachChoice)
                    }
                    if (allElements[item]['OverloadingFunctionOnItems'] && allElements[item]['OverloadingFunctionOnItems'][labelOfEachChoice]){
                      allElements[item]['OverloadingFunctionOnItems'][labelOfEachChoice]()
                    } else {
                      CommonCallBack(labelOfEachChoice);
                    }
                  }
                }
                >
                  <ItemNotSelected>
                      {labelOfEachChoice}
                  </ItemNotSelected>
                </Link>
              )
              if (selectedItem===labelOfEachChoice){
                branch = (
                  <Link
                    to={`/${labelOfEachChoice}`}
                    key={updateNumber++}
                    onClick={()=>{
                      if (selectedItem!=labelOfEachChoice){
                        setSelectedItem(labelOfEachChoice)
                      }
                      if (allElements[item]['OverloadingFunctionOnItems'] && allElements[item]['OverloadingFunctionOnItems'][labelOfEachChoice]){
                        allElements[item]['OverloadingFunctionOnItems'][labelOfEachChoice]()
                      } else {
                        CommonCallBack(labelOfEachChoice);
                      }
                    }
                  }
                  >
                    <ItemSelected>
                        {labelOfEachChoice}
                    </ItemSelected>
                  </Link>
                )
              }
            } else {
              branch=(
                <ItemNotSelected
              key={updateNumber++}
                onClick={()=>{
                  if (selectedItem!=labelOfEachChoice){
                    setSelectedItem(labelOfEachChoice)
                  }
                  if (allElements[item]['OverloadingFunctionOnItems'] && allElements[item]['OverloadingFunctionOnItems'][labelOfEachChoice]){
                    allElements[item]['OverloadingFunctionOnItems'][labelOfEachChoice]()
                  } else {
                    CommonCallBack(labelOfEachChoice);
                  }
                }
              }
                >
                {labelOfEachChoice}
                </ItemNotSelected>
            )
            }

            /////////////////////////////////////////////
            if (selectedItem===labelOfEachChoice){
              
              branch=(
                <ItemSelected
              key={updateNumber++}
              onClick={()=>{
                if (selectedItem!=labelOfEachChoice){
                  setSelectedItem(labelOfEachChoice)
                }
                if (allElements[item]['OverloadingFunctionOnItems'] && allElements[item]['OverloadingFunctionOnItems'][labelOfEachChoice]){
                  allElements[item]['OverloadingFunctionOnItems'][labelOfEachChoice]()
                } else {
                  CommonCallBack(labelOfEachChoice);
                }
              }
              }

                >
                {labelOfEachChoice}
                </ItemSelected>
            )
              
            }
            
            
              
          sets.push(branch)
          });
        }
      
      
      

    }
  })


if (type==="Link"){
  return(
    <Router>
      <>{sets}</>
    </Router>
  )
}
return (
  <div >
    {sets}
  </div>
)
};
export default SelectionSet;