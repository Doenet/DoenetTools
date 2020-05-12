import React, {useState } from 'react';
import './menu.css';
import {animated,useSpring} from 'react-spring';
    const Menu = ({activeRole,roles,permissionCallback}) =>{
      const[currentRole,setCurrentRole] = useState(activeRole);
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
    return (
      <>
      <div className="dropdown">
        <button onClick={()=>{setShow(!show)}} className="dropbtn">{currentRole}</button>
        <animated.div style={roles.length>1?fullMenuAnimation:null} className="dropdown-content">
          {rolesDisplay}
        </animated.div>
      </div>
    </>
   )
    };

    export default Menu;