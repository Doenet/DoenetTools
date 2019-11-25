import React, { Component } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;
import crypto from 'crypto';
import nanoid from 'nanoid';
import "./chooser.css";
import DoenetHeader from './DoenetHeader';



class DoenetChooser extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      error: null,
      errorInfo: null,
    };

    const loadBranchesUrl='/api/loadAllBranches.php';
    const data={
    }
    const payload = {
      params: data
    }
    
    axios.get(loadBranchesUrl,payload)
    .then(resp=>{
      
      console.log(resp.data);
      this.branchId_info = resp.data.branchId_info;
      this.sort_order = this.publishDate_sort_order = resp.data.sort_order;
      this.data_loaded = true;
      this.forceUpdate();
    });

    this.data_loaded = false;

  }


  buildBranchBoxes(){
    this.branchBoxes = [];
    for(let branchId of this.sort_order){
      let title = this.branchId_info[branchId].title;
      let pubDate = this.branchId_info[branchId].publishDate;
      this.branchBoxes.push(
      <div key={"branchIdBox"+branchId} className="branchBox">

        <div style={{position: "relative", width: 0, height: 0}}>
        <button className="editButton" onClick={()=> {window.location.href=`/editor?branchId=${branchId}`}}>Edit</button>
        </div>

      {title}
      <div style={{"marginTop":"8px"}}>Publication Date</div>
      <div> {pubDate}</div>
      </div>);
    }
  }

  render(){

    if (!this.data_loaded){
    return <p>Loading...</p>
    }

    this.buildBranchBoxes();

    return (<React.Fragment>
      <DoenetHeader toolTitle="Chooser" headingTitle={"Choose Branches"} />
      <div id="chooserContainer">  
       
        <div id="chooserBoxes">
        {this.branchBoxes}
        </div>
      </div>
    </React.Fragment>);
  }
}

export default DoenetChooser;
