import React, {useState} from 'react';
import './menuItem.css';
import {animated,useSpring} from 'react-spring';
import styled from 'styled-components';
const Item = styled.div `
padding: 17px 10px 10px 10px ;
position: relative;
height: 60px;
display: block;
overflow: hidden;
cursor: pointer;
color: black;
background: white;
`
const ItemGrayOut = styled.div `
padding: 17px 10px 10px 10px ;
position: relative;
height: 60px;
display: block;
overflow: hidden;
text-align: center ;
color: grey;
background: white;
`
const MenuItem = ({content,greyOut=false,object={},currentItem,currentTool}) =>{
  let firstItem = Object.keys(object)[0]

  let isFirst=false
  if (currentItem && currentItem===firstItem){
    isFirst=true
  }
  const [ISFirst,setFirst]=useState(isFirst);
  //(currentItem?(currentItem===firstItem?"white":"black"):"black")
  const [{ x, color}, set] = useSpring(() => ({ x: 100, 
    color: (ISFirst?"white":"black"), 
 }));

 let Animation=null;
 let thisPadding="17px 10px 10px 10px"
 let thisHeight= "60px"
 if (!greyOut){
   if (currentTool==="Profile" || currentTool==="Gradebook"){
      thisPadding="25px 10px 0px 10px";
      thisHeight= "35px"
   }
  Animation=(
    <div
    style={{
      backgroundColor:(ISFirst?"black":"white"),
      color:"black",
      padding: thisPadding ,
      position: "relative",
      height: thisHeight,
      display: "block",
      overflow: "hidden",
      cursor: "pointer",
  
  }}
    onMouseEnter={() => {set({ x: 0, color: "white"});setFirst(false)}}
    onMouseLeave={() => {set({ x: 100, color: "black"});setFirst(false)}}
  >
    <animated.span style={{ color:color}}>
  {content}
</animated.span>
    <animated.p
style={{ transform: x.interpolate(v => `translateX(-${v}%`)}}
className="glance"
/>

  </div>)
 } else {
Animation=(
  <div
  style={{
    padding: "17px 10px 10px 10px ",
    position: "relative",
    height: (currentTool==="Profile" || currentTool==="Gradebook"?"35px":"60px"),
    display: "block",
    overflow: "hidden",
    textAlign: "center" ,
    color: "grey",
    background: "white",
  }}
  >
    {content}
  </div>
)
 }
  return (
    <div>
      {Animation}
    </div>
  );

};

export default MenuItem;
