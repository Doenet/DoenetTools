import React, {useState,useEffect,useRef } from 'react';
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
&:hover{

  text-align:center;

}
`
const ItemGrayOut = styled.div `
padding: 17px 10px 10px 10px ;
position: relative;
display: block;
overflow: hidden;
text-align: center ;
color: grey;
background: white;
`
const MenuItem = ({content,greyOut=false,object={},currentItem}) =>{
  // console.log(`currentItem is ${currentItem}`)
  let firstItem = Object.keys(object)[0]
  // console.log("typeof(currentItem)")
  // console.log(Object.keys(object)[0])
  // console.log(currentItem)
  let isFirst=false
  if (currentItem && currentItem===firstItem){
    isFirst=true
  }
  const [ISFirst,setFirst]=useState(isFirst);
  //(currentItem?(currentItem===firstItem?"white":"black"):"black")
  const [{ x, color}, set] = useSpring(() => ({ x: 100, 
    color: (ISFirst?"white":"black"), 
 }));

  console.log(`ISFirst: ${ISFirst} `)
  // console.log(ISFirst)
 let Animation=null;
 if (!greyOut){
  Animation=(
    <Item
    style={{backgroundColor:(ISFirst?"black":"white")}}
    onMouseEnter={() => {set({ x: 0, color: "white"});setFirst(false)}}
    onMouseLeave={() => {set({ x: 100, color: "black"});setFirst(false)}}
  >
    <animated.span style={{ color }}>
      {content}
    </animated.span>
    <animated.p
style={{ transform: x.interpolate(v => `translateX(-${v}%`) }}
className="glance"
/>
  </Item>)
 } else {
Animation=(
  <ItemGrayOut>
    {content}
  </ItemGrayOut>
)
 }
  return (
    <div>
      {Animation}
    </div>
  );

};

export default MenuItem;
