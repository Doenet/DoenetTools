import React, { Component } from 'react';
import './docs.css';
import componentDocs from '../../docs/complete-docs.json';
import ToolLayout from './ToolLayout/ToolLayout.js';
import ToolLayoutPanel from './ToolLayout/ToolLayoutPanel.js';
import { TreeView } from './TreeView/TreeView';



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

    const searchBar = [<SearchBox onSearchChange={this.onSearchChange} />];
    const leftNav = <TreeView
      containerId={'documentation'}
      containerType={'course_assignments'}
      loading={false}
      parentsInfo={parentsInfo}
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
        specialChildNode: {
          "title": { color: "gray" },
          "frame": { color: "#2675ff", backgroundColor: "rgb(192, 220, 242)", paddingLeft: "5px" },
        },
        specialParentNode: {
          "title": { color: "gray", paddingLeft: "5px" },
          "frame": { color: "#2675ff", backgroundColor: "rgb(192, 220, 242)", opacity:"0.5",paddingLeft: "5px", borderLeft: '10px solid #1b216e' },

        },
        parentNode: {
          "title": { color: "#d9eefa" },

          "contentContainer": {
            border: "none",

          }
        },
        childNode: {
          "title": {
            color: "white",
          }

        },
        specialChildNode: {
          "frame": { backgroundColor: "hsl(206, 66%, 85%)", color: "#d9eefa" },
        },
        emptyParentExpanderIcon: <span style={{paddingLeft:"5px"}}></span>
      }}
      onLeafNodeClick={(nodeId) => {
        this.tempSet.clear();
        this.tempSet.add(nodeId);
        this.forceUpdate()
        // if (this.tempSet.has(nodeId)) this.tempSet.delete(nodeId);
        // else this.tempSet.add(nodeId);
        // this.forceUpdate();
        // this.selectDrive("Courses", nodeId)
      }}
      onParentNodeClick={(nodeId) => {
        this.tempSet.clear();
        this.tempSet.add(nodeId);
        this.forceUpdate()
        // this.tempSet.clear();
        // this.tempSet.add(nodeId);
        // this.goToFolder(nodeId, customizedContentTreeParentInfo);
        // if (!this.state.splitPanelLayout) {
        //     this.splitPanelGoToFolder(nodeId, customizedContentTreeParentInfo);
        // }
        // this.forceUpdate();
        // window.location.href = `/gradebook/assignment/?assignmentId=${nodeId}`;
        this.onSelectComponent(nodeId);
      }}
    />;


    return (
      <ToolLayout className="docs-container" toolName="Documentation" headingTitle="Documentation">
        <ToolLayoutPanel className="side-panel" key="one" panelName="Dicitonary">
          <div>
            <SearchBox onSearchChange={this.onSearchChange} />
            {/* <Sidebar
              filteredComponents={filteredComponents}
              onSelectComponent={this.onSelectComponent}
              selectedComponent={this.state.selectedComponent} /> */}
              {leftNav}
          </div>
        </ToolLayoutPanel>

        <ToolLayoutPanel key="two" headingTitle="Viewer">
          {this.state.selectedComponent && <DocsContent onSelectComponent={this.onSelectComponent} selectedComponent={this.state.selectedComponent} />}
        </ToolLayoutPanel>
      </ToolLayout>
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

  render() {
    return (
      <div className="docs-content">
        <div className="docs-content-heading">
          <h1>{this.props.selectedComponent}</h1>
        </div>
        <div className="properties-container">
          <h2>Properties</h2>
          <ul>
            {Object.keys(componentDocs[this.props.selectedComponent]["properties"]).map(property => {
              return (<li className="properties-name" key={property} >
                <p>{property}: {
                  componentDocs[this.props.selectedComponent]["properties"][property]["default"] !== undefined &&
                  componentDocs[this.props.selectedComponent]["properties"][property]["default"].toString()
                }</p>
              </li>)
            })}
          </ul>
        </div>
        <div className="child-components-container">
          <h2>Child Components</h2>
          <div className="child-components">
            {componentDocs[this.props.selectedComponent]["childComponents"].map(childComponent => {
              return <div className="child-component-wrapper" key={childComponent}>
                <button className="child-component-name" onClick={() => this.props.onSelectComponent(childComponent)}>
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
          style={{width:"235px", paddingLeft: "5px",minHeight:"30px"}}

        />
      // </form>
    );
  }
};

export default DoenetDocs;