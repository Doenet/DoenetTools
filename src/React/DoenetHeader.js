import React, { Component } from 'react';
import './header.css'
import doenetImage from '../media/Doenet_Logo_cloud_only.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh , faUser, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import IndexedDB from '../services/IndexedDB';
import axios from 'axios';


class DoenetHeader extends Component {

  constructor(props) {
    super(props);

    this.state = {
      showToolbox: false,
    }

    this.toolTitleToLinkMap = {
      "Admin" : "/admin/",
      "Chooser" : "/chooser/",
      "Course" : "/course/",
      "Documentation" : "/docs/",
      // "Editor" : "/editor/",
      "Gradebook": "/gradebook/",
    }

    this.username = "";
    this.access = 0;
    const url='/api/env.php';
        axios.get(url)
        .then(resp=>{
            this.username = resp.data.user;
            this.access = resp.data.access;
            this.forceUpdate();
        });

    this.setupDatabase();
  }

  setupDatabase() {
    // create a new database object
    let indexedDB = new IndexedDB(); 

    // open a connection to the database
    indexedDB.openDB((result) => {

      // retrieve data
      indexedDB.get("header_store", "page_history", (data) => {
        
        // history doesn't exist, initialize data 
        if (data == null) {
          indexedDB.insert("header_store", { 
            type: "page_history",            
            previousPageName: null,
            previousPageLink: null,
            currentPageName: this.props.toolTitle,
            currentPageLink: window.location.href
          }); 
        }

        // page not changed, retrieve previous page data, do not update history
        if (this.props.toolTitle == data.currentPageName) {
          this.previousPageButtonName = data.previousPageName;
          this.previousPageButtonLink = data.previousPageLink;
          this.forceUpdate(); 
        } else {  
          // page changed, retrieve last current page data
          this.previousPageButtonName = data.currentPageName;
          this.previousPageButtonLink = data.currentPageLink;
          
          // update page history
          if (this.props.title != data.currentPageName) 
            indexedDB.insert("header_store", { 
              type: "page_history",            
              currentPageName: this.props.toolTitle,  // set current to currentPage
              currentPageLink: window.location.href,
              previousPageName: data.currentPageName, // overwrite previous with last current
              previousPageLink: data.currentPageLink
          });
          this.forceUpdate(); 
        }
      });
    });
  }

  toogleToolbox = () => {
    if (!this.state.showToolbox) {
      document.addEventListener('click', this.toogleToolbox, false);
    } else {
      document.removeEventListener('click', this.toogleToolbox, false);
    }

    this.setState(prevState => ({
      showToolbox: !prevState.showToolbox
    }));    
  }


  render() {
    const { toolTitle, headingTitle} = this.props;

    return (
      <React.Fragment>
        <div className="headingContainerWrapper">
          <div className="headingContainer">
            <div className="toolTitle">
              <img id="doenetLogo" src={doenetImage} height='45px' />
              <span>{ toolTitle }</span>
            </div>
            {headingTitle && <div className="headingTitle">
              <span>{ headingTitle }</span>
            </div>}
            <div className="headingToolbar">
              {this.previousPageButtonName && 
              <div id="previousPageButton" data-cy="previousPageButton" onClick={()=>location.href=this.previousPageButtonLink}>
                <FontAwesomeIcon id="previousPageButtonIcon" icon={faArrowLeft}/>
                <div style={{display:"inline", marginLeft:"3px"}}>{ this.previousPageButtonName }</div>
              </div> }
              <div className="toolboxContainer" data-cy="toolboxButton" onClick={this.toogleToolbox}>  
              <FontAwesomeIcon id="toolboxButton" icon={faTh}/>
                {this.state.showToolbox && 
                <Toolbox show={this.state.showToolbox} toogleToolbox={this.toogleToolbox}>
                  {Object.keys(this.toolTitleToLinkMap).map((toolTitle, index)=> {
                    let currentUrl = window.location.href;
                    const navLinkClassName = currentUrl.includes(this.toolTitleToLinkMap[toolTitle]) ? 
                      "selectedToolboxNavLink" : "toolboxNavLink";
                    return( 
                      <div className={ navLinkClassName } key={"toolboxNavLink" + index} data-cy={"toolboxNavLinkTo" + toolTitle }>
                        <a href={ this.toolTitleToLinkMap[toolTitle] }>{ toolTitle }</a>
                      </div>
                    )
                  })}
                </Toolbox>}
              </div>
              <div id="userButton" onClick={()=>alert('User Setting Feature Not Yet Available')}>
                <FontAwesomeIcon id="userButtonIcon" icon={faUser}/>
                <div id="username" style={{display:"inline", marginLeft:"3px"}}>{ this.username }</div>
              </div>
            </div>
          </div>
        </div>        
      </React.Fragment>
    );
  }
}

const Toolbox = ({ toogleToolbox, children }) => {

  return (
    <section className="toolbox" data-cy="toolbox">
      {children}
    </section>
  );
}

export default DoenetHeader;