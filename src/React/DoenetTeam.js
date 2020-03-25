import React, { Component } from 'react';
import DoenetHeader from './DoenetHeader';
import axios from 'axios';
axios.defaults.withCredentials = true;


class DoenetTest extends Component {
  constructor(props){
    super(props);

    //Load data for teams for the logged in individual
    const phpUrl = '/api/getTeams.php';
    const data = {}
    const payload = {
      params: data
    }

    axios.get(phpUrl, payload)
      .then(resp => {
        
        if (resp.data.success === 1){
          this.teamNames = resp.data.teamNames;
          this.rosters = resp.data.rosters;
          this.setState({ready:true,addToTeamSelected:this.teamNames[0]})
        }else{
          //handle fail
        }
        
        // console.log(resp.data);
        
        
      })
      .catch((error) => {
        this.setState({ error: error })
      })

    this.state = {
      newTeamName: "",
      userName: "",
      fullName: "",
      selectedTeam: null,
      error: null,
      errorInfo: null,
      ready: false,
      addToTeamSelected: "",
    };


  }


  componentDidCatch(error, info){

    this.setState({error:error,errorInfo:info});
  }

  render() {

    if (!this.state.ready){
      return <p>loading...</p>
    }
    
     //We have an error so doen't show the viewer
     if (this.state.error){

      return (<React.Fragment>
        <p style={{color: "red"}}>{this.state.error && this.state.error.toString()}</p>
        </React.Fragment>);
    }
    console.log(this.teamNames)
    console.log(this.rosters);

    let teamNameOptions = [];
    for (let teamName of this.teamNames){
    teamNameOptions.push(<option key={teamName}>{teamName}</option>)
    }
    let removeTeamSelect = <select>{teamNameOptions}</select>
    let selectTeamSelect = <select onChange={(e)=>{this.setState({addToTeamSelected:e.target.value});
    }}>{teamNameOptions}</select>
    
    let addMemberInput = <>Full Name: <input type="text" />Username: <input type="text" /><button>Add</button></>
    
    let teamTableRows = [];
    for (let rosterObj of this.rosters[this.state.addToTeamSelected]){
      console.log(rosterObj);
      teamTableRows.push(<tr key={"roster"+rosterObj.userName}><td>{rosterObj.fullName}</td><td>{rosterObj.userName}</td></tr>)
      }
    let teamTable = <table><thead><tr><th>Full Name</th><th>User Name</th></tr></thead><tbody>{teamTableRows}</tbody></table>
    return (<>
         <DoenetHeader toolTitle="Team" headingTitle={""} />   

    <h3>Create a team</h3>
    <input type="text" /><button>Create</button>

    <h3>Remove a team</h3>
    {removeTeamSelect}<button>Remove</button>
    <h3>Add a member to {this.state.addToTeamSelected}</h3>
    {selectTeamSelect}<br /><br />
    {teamTable}<br /><br />
    {addMemberInput}

    </>);

   
  }
}

export default DoenetTest;

// mode={{solutionType:"displayed",allowViewSolutionWithoutRoundTrip:true}}
