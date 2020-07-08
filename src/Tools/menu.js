import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { animated, useSpring, useTransition, useChain } from 'react-spring';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import MenuItem from './menuItem.js';
const DropDown = styled.div`
      text-align:center;
      color: black;
      padding: 0px;
      font-size: 16px;
      border-radius:20px;
      `
const Icon = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 13px;
  text-align: center;
  width: 250px;
  border-radius: 4px;
  cursor: pointer;
  background-color: none;
  padding: 7px 5px;
  padding-left:55px;
  color:#333333;
  text-transform: none;
  font-weight: 700;
  border: 0.5px solid;
  border-color: #333333;
  transition: 300ms;
  margin: 0px 10px;
  `
const MenuController = styled.button`
margin:0;
background-color: #6de5ff;
  color: black;
  padding: 16px;
  font-size: 16px;
  cursor: pointer;
  display:block;
  `
const DropDownContent = styled(animated.div)`
opacity:1;
display: none;
  position: absolute;
  // background-color: #f9f9f9;
  background-color: white;
  min-width: 200px;
  border:1px solid #E2E2E2;
  //box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 9999;
  color:black;
`



const Menu = ({ currentTool, showThisRole = "", itemsToShow = {}, menuIcon, width, grayTheseOut = [], offsetPos = 0, menuWidth }) => {
  const node = useRef();
  // console.log("from menu");
  const [MenuWidth, setMenuWidth] = useState(menuWidth);
  useEffect(() => {
    setMenuWidth(node.current ? node.current.offsetWidth : 0)
    // console.log('width', node.current ? node.current.offsetWidth : 0);
    //console.log('updated items to show:::::::::::::::', itemsToShow);
  }, [node.current]);
  // console.log('items to show:', itemsToShow);
  // console.log("items to show on role", showThisRole)

  const [currentItemDisplay, setcurrentItemDisplay] = useState(Object.keys(itemsToShow).length > 0 ? showThisRole : "");
  // console.log('currentitemdisplay:', currentItemDisplay);
  // let rolesDisplay=[]
  let updateNumber = 0

  // Object.keys(itemsToShow).map(item=>{
  //   // console.log(`item is..${item}`)
  //   if (itemsToShow[item]['url']){    // exists URL
  //     // console.log("YESS")
  //     rolesDisplay.push(<p key={"op"+(updateNumber++)} 
  //   onClick={()=>
  //     window.location.href = itemsToShow[item]['url']

  //     }>{itemsToShow[item]['showText']}</p>)
  //   } else {                
  //     // console.log("NOOO")
  //               // no url, exec callBack
  //     rolesDisplay.push(<p key={"op"+(updateNumber++)} 
  //   onClick={()=>
  //     {setcurrentItemDisplay(item);

  //       itemsToShow[item]["callBackFunction"](item)
  //     }
  //     }
  //     >{itemsToShow[item]['showText']}
  //     </p>
  //     )
  //   }

  // })
  const navRef = useRef()
  const liRef = useRef()
  const [show, setShow] = useState(false);
  const fullMenuAnimation = useSpring({
    ref: navRef,
    from: { opacity: 0, transform: `translateY(-200%)` },
    // -20% for nav menu, -47% for the other
    transform: show ? `translateY(${offsetPos}%)` : `translateY(-200%)`,
    opacity: show ? 1 : 0,
    display: "block",
    flexDirection: 'column',
    width: (MenuWidth ? MenuWidth : "300px"),
    config: { friction: 15, mass: 1, tensions: 180 }
  });
  useEffect(() => {
    document.addEventListener('click', handleClick, false);
    return () => {
      document.removeEventListener('click', handleClick, false);
    };
  });
  const handleClick = e => {
    if (node.current.contains(e.target)) {
      // inside click
      setShow(!show)
    } else {
      setShow(false)
    }
  }

  const itemTransitions = useTransition(
    show ? Object.keys(itemsToShow) : [],
    item => itemsToShow[item]['showText'],
    {
      ref: liRef,
      unique: true,
      trail: 400 / Object.keys(itemsToShow).length,
      from: {
        opacity: 0, transform: 'translateY(40px)',
        margin: '0px 0px 0px 0px',
        padding: '0px',
      },
      enter: { opacity: 1, transform: 'translateY(0)' },
      leave: { opacity: 0, transform: 'translateY(40px)' }
    }
  )


  useChain(show ? [navRef, liRef] : [liRef, navRef], [
    0, 0.2
  ])

  return (
    <div ref={node}>
      <DropDown>
        <div>
          {menuIcon ?
            (
              <Icon>
                <FontAwesomeIcon
                  icon={menuIcon}
                  size={'lg'} />

              </Icon>
            )
            : // no icon
            (<button

              style={{
                // minWidth:(MenuWidth),
                // backgroundColor: "#6de5ff",
                color: "black",
                //  padding: "16px 16px 16px 16px",
                margin: "0",
                height: "20px",
                fontSize: "14px",
                cursor: "pointer",
                display: "block",
                // borderRadius: '5px'
              }}
            > <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "100px",
                display: "inline-block"
              }}>
                {currentItemDisplay}


              </div>
              {currentItemDisplay != "" ? <FontAwesomeIcon
                icon={faChevronDown}
                style={{
                  verticalAlign: "1px",
                  marginLeft: "5px"
                }}
                size={'sm'} /> : null}
            </button>

            )
          }</div>
        {/* use width somewhere in component below for consistenecy */}
        <DropDownContent
          style={Object.keys(itemsToShow).length > 1 ? fullMenuAnimation : null} >
          {itemTransitions.map(({ item, key, props }) => (
            (<animated.div
              style={props}
              key={key}
              onClick={() => {
                if (itemsToShow[item]['url']) {
                  window.location.href = itemsToShow[item]['url']
                } else {
                  setcurrentItemDisplay(item);
                  if (itemsToShow[item]["callBackFunction"]) {
                    itemsToShow[item]["callBackFunction"](item)
                  }
                }
              }}
            >
              {!grayTheseOut.includes(item) ?
                <MenuItem
                  currentTool={currentTool}
                  content={itemsToShow[item]['showText']}
                  object={itemsToShow}
                  currentItem={item}
                />
                :
                <MenuItem
                  currentTool={currentTool}
                  content={itemsToShow[item]['showText']}
                  greyOut={true} />
              }
            </animated.div>)
          ))}

        </DropDownContent>
      </DropDown>
    </div>

  )
};

export default Menu;