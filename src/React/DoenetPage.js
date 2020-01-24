import React, { Component } from 'react';
import DoenetViewer from '../React/DoenetViewer';
import axios from 'axios';


class DoenetPage extends Component {
  constructor(props){
    super(props);

    this.state = {
      error: null,
      errorInfo: null,
    };

    let url_string = window.location.href;
    var url = new URL(url_string);
    this.contentId = url.searchParams.get("contentId");


    const loadFromContentIdUrl='/open_api/loadFromContentId.php';
    const data={
      contentId: this.contentId,
    }
    // const payload = {
    //   params: data
    // }
    // console.log(payload);
    
    // axios.get(loadFromContentIdUrl,payload)
    axios.post(loadFromContentIdUrl,data)
    .then(resp=>{
      this.doenetML = resp.data.doenetML;
      this.forceUpdate();
    });

    

  }


  componentDidCatch(error, info){
    this.setState({error:error,errorInfo:info});
  }

  render() {
    if (this.doenetML === undefined){ return null;}

     //We have an error so doen't show the viewer
     if (this.state.error){

      return (<React.Fragment>
        <p style={{color: "red"}}>{this.state.error && this.state.error.toString()}</p>
        </React.Fragment>);
    }

    return (<React.Fragment>
            <DoenetViewer 
            key={"doenetviewer"} 
            free={{doenetCode: this.doenetML}} 
            contentId={this.contentId} 
            showCollaboration={true}
            />
      </React.Fragment>);
  }
}

export default DoenetPage;
