
import React, { Component, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import "./accordion.css" 

export default class Accordion extends Component {

    constructor(props) {
      super(props);
      const openSections = {};
      this.state = { openSections };
    }
  
    onClick = label => {
      const {
        state: { openSections },
      } = this;
  
      const isOpen = !!openSections[label];
  
      this.setState({
        openSections: {
          [label]: !isOpen
        }
      });
    };
  
    render() {
      const {
        onClick,
        props: { children },
        state: { openSections },
      } = this;
  
      return (
        <AccordionSectionCustom
          isOpen={!!openSections[children.props.label]}
          activeChild={this.props.children.props.activeChild}
          label={children.props.label}
          onClick={onClick}>
          {children.props.children}
        </AccordionSectionCustom>
      );
    }
  }
  function AccordionSectionCustom ({onClick, isOpen, label, children, activeChild}) {

    // console.log('activeChild', activeChild);
  
    const handleOnClick = () => {
      onClick(label);
    };
      return (
        <div style={{ 
             "width": "100%",
              "cursor": 'pointer',
               "fontWeight": "bold",
               margin:"5px 0px 5px 0px"
               }}>
          <div onClick={handleOnClick} 
               data-cy="coursesAccordion" 
               style={{
                       display: 'flex', 
                       justifyContent: 'flex-start', 
                       alignItems:'center', 
                       color: "darkblue", 
                       backgroundColor: isOpen && !activeChild && ' rgba(192, 220, 242,0.3)' , 
                       borderLeft: isOpen && !activeChild && '8px solid #1b216e', 
                      //  paddingLeft: !isOpen && !activeChild && '10px', 
                      paddingLeft:"10px",
                       height:"2.6em"}}>
            {isOpen ?  <FontAwesomeIcon 
                          icon={faChevronDown} 
                          style={{ 
                            color:'white', 
                            border:'1px solid darkblue', 
                            borderRadius:'2px', 
                            width:'1.3em',
                            height:'1.2em',
                            padding:"1px",
                            marginRight:"5px"
                          }}/> :
                        <FontAwesomeIcon 
                          icon={faChevronRight} 
                          style={{ 
                            color:'darkblue', 
                            border:'1px solid darkblue',
                            borderRadius:'2px', 
                            width:'1.3em',
                            height:'1.2em',
                            padding:"1px",
                            marginRight:"5px"

                            }} />}
            {label}
          </div>
          {isOpen && (
            <div>
              {children}
            </div>
          )}
        </div>
      );
  }