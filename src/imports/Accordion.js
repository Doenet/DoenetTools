
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

    console.log('activeChild', activeChild);
  
    const handleOnClick = () => {
      onClick(label);
    };
      return (
        <div style={{ "width": "100%", "cursor": 'pointer', "fontWeight": "bold"}}>
          <div onClick={handleOnClick} data-cy="coursesAccordion" style={{display: 'flex', justifyContent: 'flex-start', alignItems:'center', color: "darkblue",opacity:'0.5', backgroundColor: isOpen && !activeChild && ' rgb(192, 220, 242)' , borderLeft: isOpen && !activeChild && '6px solid #1b216e'}}>
            {isOpen ?  <FontAwesomeIcon className="menuCustomTwirlIcon" icon={faChevronDown} style={{width:'100%',fontSize:'15px', color:'#03a1fc', border:'1px solid #03a1fc', borderRadius:'2px', width:'15px',height:'15px'}}/> :
              <FontAwesomeIcon className="menuCustomTwirlIcon" icon={faChevronRight} style={{width:'100%',fontSize:'15px', color:'#03a1fc', border:'1px solid #03a1fc',borderRadius:'2px', width:'15px',height:'15px'}} />}
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