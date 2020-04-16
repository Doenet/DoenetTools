import React from 'react';
import './menuItem.css';
import {animated,useSpring} from 'react-spring';
import styled from 'styled-components';
const Item = styled.div `
padding: 17px 10px 10px 10px ;
position: relative;
height: 60px;
display: block;
overflow: hidden;
text-align: left ;
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
text-align: left ;
color: grey;
background: white;
`
const MenuItem = ({content,greyOut=false}) =>{
  const [{ x, color }, set] = useSpring(() => ({ x: 100, color: "black", 
 }));
 let Animation=null;
 if (!greyOut){
  Animation=(
    <Item
    onMouseEnter={() => set({ x: 0, color: "white"})} 
    onMouseLeave={() => set({ x: 100, color: "black"})}
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
