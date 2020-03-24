import React, { Component, useState } from 'react';
import './menu.css';
import {animated,useSpring, useTransition, Transition, Trail} from 'react-spring';
    const Menu = ({showThisRole,roles,permissionCallback}) =>{
      console.log(`showThisRole: ${showThisRole}`)
      const[currentRole,setCurrentRole] = useState(roles.length>0?showThisRole:"N/A");
      let menuItems = ['Students',"Instructor"]
      // const [fullMenuVisible, setFullMenuVisible] = useState(false);
      let rolesDisplay=[]
      let updateNumber=0
      if (!permissionCallback){
        roles.map(item=>{
          rolesDisplay.push(<p key={"op"+(updateNumber++)} onClick={()=>{setCurrentRole(item);setShow(!show)}}>{item}</p>)
        })
      } else {
        roles.map(item=>{
          rolesDisplay.push(<p key={"op"+(updateNumber++)} 
          onClick={()=>
            {setCurrentRole(item);
              setShow(!show);
              permissionCallback(item)
            }
            }>{item}</p>)
        })
      }
      
      const [show, setShow] = useState(false);
      const fullMenuAnimation = useSpring({
        from: {opacity:0, transform:`translateY(-200%)`},
        transform: show ? `translateY(0)` : `translateY(-200%)`,
        opacity: show ? 1 : 0,
        display: "block"
      });
      
    const menuItemAnimation = useTransition(menuItems,null,{
      from: { opacity: 0 },
      enter: { opacity: 1 },
      leave: { opacity: 0 }
      // from:{
      //   opacity: 0,
      //   height: 0,
      //   transform: 'translateY(-10%)',
      // },
      // enter:{
      //   opacity: 1,
      //   height: 'auto',
      //   transform: 'translateY(0%)',
      // },
      // leave:{ opacity: 0 }
    })
    // console.log(`fullMenuVisible ${fullMenuVisible}`);
    // menuItemAnimation.map(({item,key,props})=>{
    //   console.log("something")
    //   console.log(<animated.li style={props} key={key}>{item.text}</animated.li>)
      
    // })

    return (
      <>
      <div className="dropdown">
        <button onClick={()=>{setShow(!show)}} className="dropbtn">{currentRole}</button>
        <animated.div style={roles.length>1?fullMenuAnimation:null} className="dropdown-content">
          {rolesDisplay}
        {/* <p onClick={()=>{setCurrentRole("Instructor");setShow(!show)}}>Instructor</p>
        <p onClick={()=>{setCurrentRole("Student");setShow(!show)}}>Student</p> */}
        </animated.div>
      </div>
    </>
   )
    };

    export default Menu;