
import React, { Component, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

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
          label={children.props.label}
          onClick={onClick}>
          {children.props.children}
        </AccordionSectionCustom>
      );
    }
  }
  class AccordionSectionCustom extends Component {
  
    onClick = () => {
      this.props.onClick(this.props.label);
    };
  
    render() {
      const {
        onClick,
        props: { isOpen, label },
      } = this;
  
      return (
        <div style={{ "width": "100%", "cursor": 'pointer' }}>
          <div onClick={onClick} data-cy="coursesAccordion" style={{color: "#03a1fc", backgroundColor: isOpen && '#d9eefa' }}>
            {isOpen ?  <FontAwesomeIcon className="menuCustomTwirlIcon" icon={faChevronDown} /> :
              <FontAwesomeIcon className="menuCustomTwirlIcon" icon={faChevronRight} />}
            {label}
          </div>
          {isOpen && (
            <div>
              {this.props.children}
            </div>
          )}
        </div>
      );
    }
  }