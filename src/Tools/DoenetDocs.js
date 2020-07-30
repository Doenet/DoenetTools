import React, { Component } from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import './docs.css';
import componentDocs from '../../docs/complete-docs.json';
import ToolLayout from './ToolLayout/ToolLayout.js';
import ToolLayoutPanel from './ToolLayout/ToolLayoutPanel.js';
import { TreeView } from './TreeView/TreeView';
import query from '../queryParamFuncs';



class DoenetDocs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedComponent: null,
      searchField: ""
    };

    this.onSelectComponent = this.onSelectComponent.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.tempSet = new Set();
  }

  onSelectComponent = (componentName) => {
    this.setState({ selectedComponent: componentName });

  }

  onSearchChange = (value) => {
    this.setState({ searchField: value });
  }

  render() {
    const filteredComponents = Object.keys(componentDocs).filter(component => {
      if (component.toString().charAt(0) !== "_") {
        if (component.includes(this.state.searchField)) {
          return component.toString();
        }
      }

    })

    let parentsInfo = {
      root: {
        childContent: [],
        childFolders: [],
        childUrls: [],
        isPublic: false,
        title: "Documentation",
        type: "folder"
      }
    }

    let counter = 0;
    filteredComponents.forEach(f => {
      counter++;
      parentsInfo[f] = {
        childContent: [],
        childFolders: [],
        childUrls: [],
        isPublic: false,
        isRepo: false,
        numChild: 0,
        parentId: "root",
        publishDate: "",
        rootId: "root",
        title: f,
        type: "folder"
      }
      parentsInfo.root.childFolders.push(f);
    });

    // const searchBar = [<SearchBox onSearchChange={this.onSearchChange} />];
    const treeNodeItem = ({ title, icon }) => {
      return <div>
        {icon}
        <Link to={`/id/?docId=${title}`} style={{ color: 'white', textDecoration: 'none',fontWeight:"700" ,paddingLeft:"5px", fontSize:"20px"}}>{title}</Link>
      </div>
    };
    const leftNav = <TreeView
      containerId={'documentation'}
      containerType={'course_assignments'}
      loading={false}
      parentsInfo={parentsInfo}
      parentNodeItem={treeNodeItem}
      leafNodeItem={treeNodeItem}
      childrenInfo={{}}
      specialNodes={this.tempSet}
      hideRoot={true}
      disableSearch={true}
      treeNodeIcons={(itemType) => {
        let map = {};
        return map[itemType]
      }}
      hideRoot={true}
      treeStyles={{
        // specialChildNode: {
        //   "title": { color: "gray" },
        //   "frame": { color: "#2675ff", backgroundColor: "rgb(192, 220, 242)", paddingLeft: "5px" },
        // },
        specialParentNode: {
          "title": {
            color:"white",
            paddingLeft: "5px"
          },
          "node":{
            backgroundColor:"rgba(192, 220, 242,0.3)",
            color: "white",
            // marginRight:"10px",
            borderLeft:'8px solid #1b216e',
            height:"2.6em",
            width:"100%"
          }
        },
        parentNode: {
          "title": { color: "white" , paddingLeft:'5px',fontWeight:"700"},
          "node":{
            width:"100%",
            height:"2.6em",
          },
      
        },
        childNode: {
          "title": {
            color:"white",
            paddingLeft: "5px"
          },
          "node":{
            backgroundColor:"rgba(192, 220, 242,0.3)",
            color: "white",
            // marginRight:"10px",
            borderLeft:'8px solid #1b216e',
            height:"2.6em",
            width:"100%"
          }
        },
        // specialChildNode: {
        //   "frame": { backgroundColor: "hsl(206, 66%, 85%)", color: "#d9eefa" },
        // },
        emptyParentExpanderIcon: <span style={{ paddingLeft: "5px" }}></span>
      }}
      onLeafNodeClick={(nodeId) => {
        // this.tempSet.clear();
        // this.tempSet.add(nodeId);
        // this.forceUpdate()
        if (this.tempSet.has(nodeId)) this.tempSet.delete(nodeId);
        else this.tempSet.add(nodeId);
        this.forceUpdate();
        // this.selectDrive("Courses", nodeId)
      }}
      onParentNodeClick={(nodeId) => {
        this.tempSet.clear();
        this.tempSet.add(nodeId);
      }}
    />;


    return (
      <Router basename="/docs">
        <ToolLayout className="docs-container" toolName="Documentation" headingTitle="Documentation">
          <ToolLayoutPanel className="side-panel" key="one" panelName="Dicitonary">
            <div >
          
             <div style={{padding:"10px", marginBottom:"30px"}}> 
                <SearchBox onSearchChange={this.onSearchChange} /></div>
              {/* <Sidebar
              filteredComponents={filteredComponents}
              onSelectComponent={this.onSelectComponent}
              selectedComponent={this.state.selectedComponent} /> */}
              {leftNav}
            </div>
          </ToolLayoutPanel>

          <ToolLayoutPanel key="two" headingTitle="Viewer">
            {/* {this.state.selectedComponent && <DocsContent onSelectComponent={this.onSelectComponent} selectedComponent={this.state.selectedComponent} />} */}
            <Switch>
              <Route sensitive exact path="/" component={DocsOverview} />
              <Route sensitive exact path="/id/" component={DocsContent} />
            </Switch>
          </ToolLayoutPanel>
        </ToolLayout>
      </Router>
    )
  }
}


class Sidebar extends Component {

  render() {
    return (
      <div className="sidebar">
        <ul>
          {this.props.filteredComponents.map(componentName => {
            if (componentName === this.props.selectedComponent) {
              return (<li key={componentName}>
                <button className="selected-component-name"
                  onClick={() => this.props.onSelectComponent(componentName)}>
                  {componentName}
                </button>
              </li>)
            } else {
              return (<li key={componentName} >
                <button className="sidebar-component-name" onClick={() => this.props.onSelectComponent(componentName)}>
                  {componentName}
                </button>
              </li>)
            }
          })}
        </ul>
      </div>
    )
  }
}

class DocsContent extends Component {
constructor(props) {
  super(props);
  // this.state = {
  //   docId: query.getURLSearchParam(this.props.location.search, "docId")
  // }
}
  render() {
    const docId = query.getURLSearchParam(this.props.location.search, "docId");
    console.log(docId);
    return (
      <div className="docs-content">
        <div className="docs-content-heading">
          <h1>{docId}</h1>
        </div>
        <div className="properties-container">
          <h2>Properties</h2>
          <ul>
            {Object.keys(componentDocs[docId]["properties"]).map(property => {
              return (<li className="properties-name" key={property} >
                <p>{property}: {
                  componentDocs[docId]["properties"][property]["default"] !== undefined &&
                  componentDocs[docId]["properties"][property]["default"].toString()
                }</p>
              </li>)
            })}
          </ul>
        </div>
        <div className="child-components-container">
          <h2>Child Components</h2>
          <div className="child-components">
            {componentDocs[docId]["childComponents"].map(childComponent => {
              return <div className="child-component-wrapper" key={childComponent}>
                <button className="child-component-name" 
                // onClick={() => this.props.onSelectComponent(childComponent)}
                >
                  {childComponent}
                </button>
              </div>
            })}
          </div>
        </div>
      </div>
    )
  }
}

class SearchBox extends Component {

  handleChange = e => {
    this.props.onSearchChange(e.target.value);
  };

  render() {
    return (
      // <form className="search">
      <input
        // className="search-input"
        onChange={this.handleChange}
        placeholder="Search components..."
        style={{ width: "200px", padding: "10px", 
        // minHeight: "40px" 
      }}

      />
      // </form>
    );
  }
};

class DocsOverview extends Component {

  render() {
    return (
      <span></span>
    );
  }
};

export default DoenetDocs;