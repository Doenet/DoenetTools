import React, { Component } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;
// import { browserHistory } from 'react-router';
import styled from 'styled-components'
import { useTable, useSortBy, useFilters, useGlobalFilter, useAsyncDebounce} from 'react-table'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useLocation,
    useHistory
} from "react-router-dom";
import query from '../queryParamFuncs';
import DoenetViewer from "./DoenetViewer";

import "../imports/table.css";
import "../imports/doenet.css";
import Accordion from "../imports/Accordion";
import ToolLayout from "./ToolLayout/ToolLayout";
import ToolLayoutPanel from "./ToolLayout/ToolLayoutPanel";
import { TreeView } from './TreeView/TreeView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';

const Styles = styled.div`
  padding: 1rem;

  table {
    border-collapse: collapse;
    border-spacing: 0;
    border: 1px solid gray;
    
    thead {
        border-bottom: 1px solid gray;
    }

    
    a {

        color: inherit;
        text-decoration: none;
    }

    .sortIcon {
        padding-left: 4px;
    }

    tbody tr:nth-child(even) {background: #CCC}
    tbody tr:nth-child(odd) {background: #FFF}

    td:first-child {
        text-align: left;
        max-width: 15rem;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    th {
        position: sticky;
        top: 0;
        background: white;
        user-select: none;
        max-width: 4rem;
        //word-wrap: break-word;
        padding: 2px;
        max-height: 10rem;
    }

    th:first-child {
        vertical-align: bottom;
        max-width: 15rem;

        p {
            margin: 5px;
        }
    }


    th > p {
        height: 100%;
    }
    th:not(:first-child) > p{
        writing-mode: vertical-rl;
        text-align: left;
        transform: rotate(180deg);

    }


    td {
        user-select: none;
        text-align: center;
        max-width: 5rem;
    }

    td, th {
        border-right: 1px solid gray;

        :last-child {
            border-right: 0;
        }
    }
  }
`
function Table({ columns, data }) {

    const filterTypes = React.useMemo(
        () => ({
            text: (rows, id, filterValue) => {
            return rows.filter(row => {
                const rowValue = row.values[id];
                return rowValue !== undefined
                ? String(rowValue)
                    .toLowerCase()
                    .startsWith(String(filterValue).toLowerCase())
                : true;
            });
            }
        }),
        []
    );

    const defaultColumn = React.useMemo(
        () => ({
            Filter: DefaultColumnFilter
        }),
        []
    );
    

    // Use the state and functions returned from useTable to build your UI
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
      state,
      visibleColumns,
      preGlobalFilteredRows,
      setGlobalFilter,
    } = useTable({
      columns,
      data,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
    },  
        useFilters, // useFilters!
        useGlobalFilter,
        useSortBy, // useGlobalFilter
    )
  
    // Render the UI for your table
    return (
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    <p>{column.render('Header')}</p>
                    <div>{column.canFilter ? column.render("Filter") : null}</div>
                    <span className = "sortIcon"> 
                        {column.isSorted ? (column.isSortedDesc ? <FontAwesomeIcon icon={faSortDown} /> : <FontAwesomeIcon icon={faSortUp} />) : <FontAwesomeIcon icon={faSort} />}
                    </span>
                    </th>
                    ))}
            </tr>
            ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    )
  }
  
function gradeSorting(a, b, columnID){
    const order = { '+': -1, '-': 1, undefined: 0 };
    const ga = a.cells[9].value
    const gb = b.cells[9].value
    
    if ((ga == null || ga == '') && (gb == null || gb == '')){
        return 0
    }

    else if (ga == null || ga == ''){
        return 1
    }

    else if (gb == null || gb == ''){
        return -1
    }

    return ga[0].localeCompare(gb[0]) || order[ga[1]] - order[gb[1]];
}

function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
  }) {
    const count = preFilteredRows.length
  
    return (
      <input
        value={filterValue || ''}
        onChange={e => {
          setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
        }}
        placeholder={`Search ${count} records...`}
      />
    )
  }


import { getCourses_CI, setSelected_CI } from "../imports/courseInfo";

function sortArraysByElementI(arrarr, i) {
    // TODO: finish
    arrarr.sort()
}

class GradebookOverview extends Component {
    constructor(props) {
        super(props);

        this.state = {
            overviewLoaded: false,
        }
        
        this.students = null;
        this.overviewData = null;
        this._assignmentsTable = null;
        this.tempSet = new Set();

        
        this.assignments = {};
        for (let row in props.assignment_data) {
            let [assignmentId, assignmentName] = props.assignment_data[row];
            this.assignments[row] = { assignmentId, assignmentName };
        }

        this.courseIdPayload = { params: { courseId:props.courseId } };
        this.loadGradebookEnrollment();
    }

    //**produces 
    //this.students
    loadGradebookEnrollment = () => {

        axios.get('/api/loadGradebookEnrollment.php', this.courseIdPayload)
            .then(resp => {
                let data = resp.data
    
                this.students = {}
                for (let row of data) {
                    let [userId,
                        firstName,
                        lastName,
                        courseCredit,
                        courseGrade,
                        overrideCourseGrade] = row;
    
                    this.students[userId] = {
                        firstName,
                        lastName,
                        courseCredit,
                        courseGrade,
                        overrideCourseGrade,
                    };
                }
    
                this.getOverviewData();


            }).catch(err => console.log((err.response).toString()));
            
      }


    //**produces 
    //this.overviewData
    getOverviewData() {

        axios.get('/api/loadGradebookOverview.php', this.courseIdPayload)
        .then(resp => {
            let data = resp.data

            this.overviewData = {}
            for (let userId in this.students) { // initialize object
                
                this.overviewData[userId] = {
                    grade: (this.students)[userId].grade,
                    assignments: {}
                }

                for (let i in this.assignments) {
                    let assignmentId = this.assignments[i].assignmentId
                    this.overviewData[userId].assignments[assignmentId] = null
                }
            }

            for (let user_assignment in data) {
                let [assignmentId,
                    assignmentName,
                    credit,
                    userId] = data[user_assignment]

                this.overviewData[userId].assignments[assignmentId] = credit
            }

            //console.log(this.overviewData);
            
            this.setState({ overviewLoaded: true })
        }).catch(err => console.log(err));
    }

    get assignmentsTable() {
        
        if (this._assignmentsTable !== null) {
            return this._assignmentsTable;
        }

        this._assignmentsTable = {};

        this._assignmentsTable.headers = [
            {
                Header: "Name",
                accessor: "name",
            },
        ];

        for (let i in this.assignments) {
            let { assignmentId, assignmentName } = this.assignments[i];
            
            this._assignmentsTable.headers.push(
                {
                    Header: <Link to={`/assignment/?assignmentId=${assignmentId}`}>{assignmentName}</Link>,
                    accessor: assignmentId,
                    disableFilters: true
                    //Cell: <Link to={`/assignment/?assignmentId=${assignmentId}`}>{assignmentName}</Link>
                }
            )
        }


        this._assignmentsTable.headers.push(
            {
                Header: "Weighted Credt",
                accessor: "weight",
                disableFilters: true
                
            }
        )
        this._assignmentsTable.headers.push(
            {
                Header: "Grade",
                accessor: "grade",
                sortType: gradeSorting,
                disableFilters: true
            },
        )


        this._assignmentsTable.rows = [];

        for (let userId in this.students) {
            
            let firstName = this.students[userId].firstName,
                lastName = this.students[userId].lastName,
                credit = this.students[userId].courseCredit,
                generatedGrade = this.students[userId].courseGrade,
                overrideGrade = this.students[userId].overrideCourseGrade;
            let grade = overrideGrade ? overrideGrade : generatedGrade

            let row = {}

            row["name"] = firstName + " " + lastName
            console.log("here", firstName);
            
            for (let i in this.assignments) {
                let { assignmentId, assignmentName } = this.assignments[i]
                row[assignmentId] = (this.overviewData[userId].assignments[assignmentId]) * 100 + "%"
            }

            row["weight"] = credit
            row["grade"] = grade

            
            this._assignmentsTable.rows.push(row);
        }

        console.log("assignment table", this._assignmentsTable);
        

        return this._assignmentsTable
    }


    render() {
        if (!this.state.overviewLoaded) {
            return (<div>
                <p>Loading...</p>
                <p>If this takes too long you can try refreshing the page.</p>
            </div>)
        }

        return (
            <Styles>
                <Table columns = {this.assignmentsTable.headers} data = {this.assignmentsTable.rows}/>
            </Styles>
        )
    }
}

class GradebookAssignmentView extends Component {
    constructor(props) {
        super(props)

        this.courseIdPayload = { params: { courseId:props.courseId } };

        const url = new URL(window.location.href);
        this.assignmentId = url.searchParams.get("assignmentId");
        
        this.assignmentIdPayload = { params: { assignmentId:this.assignmentId } };

        
        this.assignmentsLoaded = false;
        this.students = null;
        this.assignmentData = null;
        this._attemptsTable = null;

        this.assignments = {}
        for (let row of props.assignment_data) {
            let [assignmentId,
                assignmentName] = row;

            this.assignments[assignmentId] = assignmentName; // note: this is in a different format than it is in overview
        }
        this.state = {
            assignmentLoaded: false,
            assignmentId: this.assignmentId,
            assignmentList: this.assignments
        }
        this.loadGradebookEnrollment();
    }

    //TODO: FIX THIS AND USE assignment data from parent
    loadGradebookEnrollment() {
        
        axios.get("/api/loadGradebookEnrollment.php",this.courseIdPayload).then(resp => {
            let data = resp.data

            this.students = {}
            for (let row of data) {
                
                let [userId,
                    firstName,
                    lastName] = row;
                
                
                this.students[userId] = {
                    firstName: firstName,
                    lastName: lastName,
                };
            }
            
            
            this.getAssignmentData();
        }).catch(err => console.log((err.response).toString()));

       
    }

    componentDidUpdate() {
        if (!this.state.assignmentLoaded) {
            this.getAssignmentData();
        }
    }

    getAssignmentData() {
        
        
        axios.get('/api/loadGradebookAssignmentAttempts.php',this.assignmentIdPayload)
        .then(resp => {
            let data = resp.data
            
            this.assignmentData = {}
            for (let userId in this.students) { // initialize object
                this.assignmentData[userId] = {
                    credit: null,
                    attempts: {}
                }
            }

            
            console.log("datt", data);
            
            for (let row of data) {
                console.log("row", row);
                
                let [userId,
                    attemptNumber,
                    assignmentCredit,
                    assignmentCreditOverride,
                    attemptCredit,
                    attemptCreditOverride
                    ] = row;

                this.assignmentData[userId].grade = assignmentCredit // we need to do this in this block so that userId is defined
                this.assignmentData[userId].attempts[attemptNumber] = attemptCredit
            }


            this.setState({ assignmentLoaded: true });
        }).catch(err => console.log(("error: ",err)));
    }

    get attemptsTable() {
        if (this._attemptsTable != null) {
            return this._attemptsTable;
        }

        this._attemptsTable = {};

        // find the max number of attempts, table has number of cols based on max
        let maxAttempts = 0;
        for (let student in this.assignmentData) {
            let len = Object.keys(this.assignmentData[student].attempts).length;

            if (len > maxAttempts) maxAttempts = len;
        }

        this._attemptsTable.headers = [
            {
                Header: "Student",
                accessor: "student",
            }
        ];

        for (let i = 1; i <= maxAttempts; i++) {
            this._attemptsTable.headers.push(
            {
                Header: "Attempt " + i,
                accessor: "a"+i,
                disableFilters: true
            })
        }

        this._attemptsTable.headers.push({
            Header: "Assignment Grade",
            accessor: "grade",
            disableFilters: true
        })

        this._attemptsTable.rows = [];
        
        for (let userId in this.students) {
            let { firstName,
                lastName } = this.students[userId];
            
            let row = {};

            row["student"] = firstName + " " + lastName

            for (let i = 1; i <= maxAttempts; i++) {
                let attemptCredit = this.assignmentData[userId].attempts[i];

                row[("a"+i)] = 
                <Link to={`/attempt/?assignmentId=${this.state.assignmentId}&userId=${userId}&attemptNumber=${i}`}>
                {
                    attemptCredit ? attemptCredit * 100 + "%" : "" // if attemptCredit is `undefined`, we still want a table cell so that the footer column still shows up right.
                }
                </Link>
            }

            row["grade"] = this.assignmentData[userId].grade ? this.assignmentData[userId].grade : ""
            
            this._attemptsTable.rows.push(row);
        }

        return this._attemptsTable;
    }

    render() {
        if (!this.state.assignmentLoaded) {
            return (<div>
                <p>Loading...</p>
                <p>If this takes too long you can try refreshing the page.</p>
            </div>);
        }

        const url = new URL(window.location.href);
        let newAssignmentId = url.searchParams.get("assignmentId");

        if (this.state.assignmentId !== newAssignmentId) {
            this.assignmentData = null;
            this._attemptsTable = null;
            this.setState({ assignmentId: newAssignmentId, assignmentLoaded: false });
            return (<div>
                <p>Loading new assignment...</p>
                <p>If this takes too long you can try refreshing the page.</p>
            </div>);
        }

        return (<div>
            <h2>{this.assignments[this.state.assignmentId]}</h2>
            <Styles>
                <Table columns = {this.attemptsTable.headers} data = {this.attemptsTable.rows}/>
            </Styles>
        </div>);
        
    }
}

class GradebookAttemptView extends Component {
    constructor(props) {
        super(props)

        const url = new URL(window.location.href);
   
        this.state = {
            attemptLoaded: false,
            assignmentId: url.searchParams.get("assignmentId"),
            userId: url.searchParams.get("userId"),
            attemptNumber: url.searchParams.get("attemptNumber"),
        }

        this.assignmentAttempted = false;
        this.assignmentsLoaded = false;
        this.assignments = null;
        this.studentsLoaded = false;
        this.students = null;
        this.doenetML = null;
        this.stateVariables = null;
        this.variant = null;
        this.credit = null;
        this.attemptCredit = null;
        this.timestamp = null;
        this.getDoenetML();
    }


    getDoenetML() {
        let assignmentAttemptPayload = { params: { 
            assignmentId:this.state.assignmentId,
            userId:this.state.userId,
            attemptNumber:this.state.attemptNumber,
         } };

        axios.get('/api/loadAssignmentAttempt.php',assignmentAttemptPayload)
        .then(resp => {

            let data = resp.data;
            
            this.assignmentAttempted = data.assignmentAttempted;
            this.doenetML = data.doenetML;
            this.stateVariables = data.stateVariables;
            this.variant = data.variant;
            this.assignmentCredit = data.assignmentCredit;
            this.assignmentCreditOverride = data.assignmentCreditOverride;
            this.attemptCredit = data.attemptCredit;
            this.attemptCreditOverride = data.attemptCreditOverride;
            this.timestamp = data.timestamp;

            this.setState({ attemptLoaded: true });
        }).catch(err => console.log((err.response).toString()));


        
    }

    render() {
        if (!this.state.attemptLoaded) {
            return (<div>
                <p>Loading...</p>
                <p>If this takes too long you can try refreshing the page.</p>
            </div>);
        }
        //
        const url = new URL(window.location.href);
        url.searchParams.get("attemptNumber")

        let newAssignmentId = url.searchParams.get("assignmentId");
        let assignmentChanged = (newAssignmentId !== this.state.assignmentId);

        let newUserId = url.searchParams.get("userId");
        let userIdChanged = (newUserId !== this.state.userId);

        let newAttemptNumber = url.searchParams.get("attemptNumber");
        let attemptNumberChanged = (newAttemptNumber !== this.state.attemptNumber);

        if (assignmentChanged || userIdChanged || attemptNumberChanged) {
            this.doenetML = null;
            this.setState({
                assignmentId: newAssignmentId,
                userId: newUserId,
                attemptNumber: newAttemptNumber,
                attemptLoaded: false
            });
            return (<div>
                <p>Loading new attempt...</p>
                <p>If this takes too long you can try refreshing the page.</p>
            </div>);
        }

        {/* TODO: check for attempts taken */}

        

        if(!this.assignmentAttempted){
            return (<p>
                No Attempts Made
            </p>);
        }

        return(<p>
            Doenet Viewer Here

        </p>)

        //Read Only Assignment Attempt View
        // return (<DoenetViewer
        //     key={"doenetviewer"}
        //     doenetML={this.doenetML}
        //     flags={{ }}
        //      />)
    }
}

export default class DoenetGradebook extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            errorInfo: null,
            assignmentsLoaded: false,
        };

        getCourses_CI(this.loadAssignments);

        this.assignments = null;
    }
    
    //**produces 
    //this.courseId
    //this.assignments
    loadAssignments = (courseListArray,selectedCourseObj) => {
        // this.courseId = selectedCourseObj.courseId;
        this.courseId = 'aI8sK4vmEhC5sdeSP3vNW';
        this.courseLongName = selectedCourseObj.longname;
        const courseIdPayload = { params: { courseId:this.courseId } }
        axios.get('/api/loadAssignments.php', courseIdPayload)
        .then(resp => {
            let data = resp.data;
            this.assignment_data = data;

            this.assignments = {};
            for (let row of data) {
                let [assignmentId, assignmentName] = row;
                this.assignments[assignmentId] = assignmentName;
            }
            this.setState({ assignmentsLoaded: true });
        }).catch(err => console.log((err.response).toString()));
    }

    componentDidCatch(error, info) {
        this.setState({ error, errorInfo: info });
    }

    get navItems() {
        let navItems = [];
        for (let assignmentId in this.assignments) {
            let assignmentName = this.assignments[assignmentId];
            navItems.push(
                <div style={{ width: "100%", borderBottom: "solid #6e6e6e 1px", marginBottom: ".5em" }} key={`navItem_${assignmentId}`}>
                    <Link to={`/assignment/?assignmentId=${assignmentId}`} className="gradebookNavLink">{assignmentName}</Link>
                </div>
            );
        }

        // TODO: sort navItems, didn't have internet when I wrote this method

        return navItems;
    }

    render() {
        if (this.state.error !== null) {
            return (<div>
                <p>Oops! Something went wrong. Try reloading the page or contacting support.</p>
                <p>Error Info: {JSON.stringify(this.state.errorInfo)}</p>
            </div>)
        }

        if (!this.state.assignmentsLoaded) {
            return (<div>
                <p>Loading...</p>
                <p>If this takes too long you can try refreshing the page.</p>
            </div>)
        }
        let parentsInfo = {
            root: {
                childContent: [],
                childFolders: [],
                childUrls: [],
                isPublic: false,
                title: "See All Assignments",
                type: "folder"
            }
        }

        let counter = 0;

        for (let assignmentId in this.assignments) {
            let assignmentName = this.assignments[assignmentId];
            counter++;
            parentsInfo[assignmentId] = {
                childContent: [],
                childFolders: [],
                childUrls: [],
                isPublic: false,
                isRepo: false,
                numChild: counter,
                parentId: "root",
                publishDate: "",
                rootId: "root",
                title: assignmentName,
                type: "folder"
            }
            parentsInfo.root.childFolders.push(assignmentId);
        }


        const TreeNodeItem = ({ title, icon }) => {
            let assignmentId = '';
            for (let key in this.assignments) {
                if (this.assignments[key] === title) {
                    assignmentId = key;
                }
            }
            return <div>
                {icon}
                <Link to={`/assignment/?assignmentId=${assignmentId}`} style={{ color: 'white', fontSize: "20px", fontWeight: "700", textDecoration: 'none' }}>{title}</Link>
            </div>
        };

        const leftNav = <Accordion>
            <div label="ASSIGNMENTS">
                <TreeView
                    containerId={'assignments'}
                    containerType={'course_assignments'}
                    loading={!this.state.assignmentsLoaded}
                    parentsInfo={parentsInfo}
                    childrenInfo={{}}
                    parentNodeItem={TreeNodeItem}
                    leafNodeItem={TreeNodeItem}
                    specialNodes={this.tempSet}
                    hideRoot={true}
                    disableSearch={true}
                    treeNodeIcons={(itemType) => {
                        let map = {};
                        return map[itemType]
                    }}
                    treeStyles={{
                        specialChildNode: {
                            "title": { color: "gray" },
                            "frame": { color: "#2675ff", backgroundColor: "pink", paddingLeft: "5px" },
                        },
                        specialParentNode: {
                            "title": {
                                color: "white",
                                paddingLeft: "5px"
                            },
                            "node": {
                                backgroundColor: "rgba(192, 220, 242,0.3)",
                                color: "white",
                                // marginRight:"10px",
                                borderLeft: '8px solid #1b216e',
                                height: "2.6em",
                                width: "100%"
                            }
                        },
                        parentNode: {
                            "title": { color: "white", paddingLeft: '5px', fontWeight: "700" },
                            "node": {
                                width: "100%",
                                height: "2.6em",
                            },

                        },
                        childNode: {
                            "title": {
                                color: "white",
                                paddingLeft: "5px"
                            },
                            "node": {
                                backgroundColor: "rgba(192, 220, 242,0.3)",
                                color: "white",
                                // marginRight:"10px",
                                borderLeft: '8px solid #1b216e',
                                height: "2.6em",
                                width: "100%"
                            }
                        },

                       
                          expanderIcons: {
                            opened: <FontAwesomeIcon icon={faChevronDown}
                              style={{
                                padding: '1px',
                                width: '1.3em',
                                height: '1.2em',
                                border: "1px solid darkblue",
                                borderRadius: '2px',
                                marginLeft: "5px"
          
                              }}
                            />,
                            closed: <FontAwesomeIcon icon={faChevronRight}
                              style={{
                                padding: '1px',
                                width: '1.3em',
                                height: '1.2em',
                                border: "1px solid darkblue",
                                borderRadius: "2px",
                                marginLeft: "5px"
                              }} />,
                          }                


                    }}
                    onLeafNodeClick={(nodeId) => {
                        if (this.tempSet.has(nodeId)) this.tempSet.delete(nodeId);
                        else this.tempSet.add(nodeId);
                        this.forceUpdate();

                    }}
                    onParentNodeClick={(nodeId) => {
                        this.tempSet.clear();
                        this.tempSet.add(nodeId);
                        // this.forceUpdate()

                        // window.location.href = `/gradebook/assignment/?assignmentId=${nodeId}`;
                    }}
                />
            </div>
        </Accordion>;

        const handleLeftNavSearch = function (e) {
            const searchTerm = e.target.value || '';
            let filteredAssignmentList = {};
            const copyAssignments = JSON.parse(JSON.stringify(this.assignments));
            for (let key in copyAssignments) {
                if (copyAssignments[key].toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) {
                    filteredAssignmentList[key] = copyAssignments[key];
                }
            }
            this.setState({ assignmentList: filteredAssignmentList });
        }

        return (
            <Router basename="/gradebook">
                <ToolLayout toolName="Gradebook" headingTitle={this.courseLongName} >
                    <ToolLayoutPanel key="one" panelName="Left Nav">

                        <div style={{ padding: "5px 0px", color: "white" }}>
                            <Link to="/" className="gradebookNavItem" style={{ paddingLeft:"5px", color: "white" , textDecoration:"none", fontSize:"16px", fontWeight:"700"}}>See All Assignments</Link>
                            <div>
                                <div style={{ padding: "10px", marginBottom: "30px" }} >
                                    <input
                                        className="search-input"
                                        onChange={handleLeftNavSearch.bind(this)}
                                        placeholder="Search Assignments"
                                        style={{ width: "200px", paddingLeft: "5px", minHeight: "30px" }}

                                    />
                                </div>


                            </div>
                            {leftNav}
                        </div>
                    </ToolLayoutPanel>
                    <ToolLayoutPanel key="two" panelName="Grades Panel">
                        <div style={{ padding: "5px" }}>
                            <Switch>
                                <Route sensitive exact path="/" render={(props) => (<GradebookOverview courseId={this.courseId} assignment_data={this.assignment_data} />)} />
                                <Route sensitive exact path="/assignment/" render={(props) => (<GradebookAssignmentView courseId={this.courseId} assignment_data={this.assignment_data} />)} />
                                <Route sensitive exact path="/attempt/" render={(props) => (<GradebookAttemptView />)} />
                            </Switch>
                        </div>
                    </ToolLayoutPanel>
                </ToolLayout>
            </Router>
        );
    }
}