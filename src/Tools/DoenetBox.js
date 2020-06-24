import React, { Component } from 'react';
import './box.css'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTh , faUser, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
// import IndexedDB from '../services/IndexedDB';
// import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import DateTimePicker from 'react-datetime-picker';
class DoenetBox extends Component {
  constructor(props) {
    super(props);

    this.updateNumber = 0;

  this.readPriviledge = false
  this.writePriviledge = false
  this.readPriviledge = this.props.readPriviledge
  this.writePriviledge = this.props.writePriviledge
    this.inputType = this.props.type;
    this.title = this.props.title;
    this.value = this.props.value;
    this.callBack = this.props.parentFunction;
    this.options = []
    this.selectBar = null
    this.className = "Section-container-odd"
    let evenOrOdd = (this.props.evenOrOdd) % 2
    if (evenOrOdd){ // odd position
      this.className = "Section-container-even"
    } 
    if (this.props.evenOrOdd==1){
      this.className +="-first";
    }
    if (this.props.lastComponent){
      this.className +="-last";
    }
    // startDate=null
    this.state = {
      date: (this.inputType==="calendar" || this.inputType==="Calendar"?new Date(this.props.value):this.props.value),
    }
    if (this.inputType==="duration"){
      // let temp = this.props.value.split(":")
      // this.value = temp.join("-")
      this.value = "2000-01-01 "+this.props.value
    }
    if (this.title=="Assignment Name: "){
   console.log(" From DoenetBox, name "+this.value) 

    }
  }
  componentWillUnmount() {
  this.setState({date:null})
  this.inputType = null;
    this.title = null;
    this.value = null;
    this.callBack = null;
    this.options = []
    this.selectBar = null
  }
  change(){

  }
  constructList(){

    this.props.options.map((val)=>{

      this.options.push(<option key={val+(this.updateNumber++)} value={val} >{val}</option>)
    })
    this.selectBar = (<select defaultValue={this.value} onChange = {(e)=>{this.value = e.target.value;this.props.parentFunction(e.target.value)}}>{this.options}</select>)

  }
  // render() {
  //   return (
  //     <DatePicker
  //       selected={this.state.startDate}
  //       onChange={this.handleChange}
  //     />
  //   );
  // }
  render(){
    if (this.inputType==="text" || this.inputType==="number" ){
      return(<React.Fragment>
        <div className = {this.className}>
          <span className="SectionText">{this.title}</span>
          <span className="SectionValue">
          {this.writePriviledge?(<input onChange={
            (e)=>{this.value = e.target.value;this.props.parentFunction(this.value);this.forceUpdate()}
            // (e)=>{this.value=e.target.value;
            // this.AssignmentInfoChanged=true;
          }
            type={this.inputType} value={this.value}></input>):
            <div>{this.value}</div>
            }
          </span>
        </div>
      </React.Fragment>)
    }
    else if (this.inputType==="checkbox"){
      return(
        <div className = {this.className}>
          <span className="SectionText">{this.title}</span>
          <div className="SectionValue">
            
          {this.writePriviledge?(<label className="switch">
          <input onChange={
            ()=>{this.value = !this.value;this.forceUpdate();this.props.parentFunction(this.value)}
            // (e)=>{this.value=e.target.value;
            // this.AssignmentInfoChanged=true;
          }
            type={this.inputType} checked={this.value}></input>
        <span className="slider round"></span>
      </label>)
          :<div>{this.value?'Yes':'No'}</div>}

          </div>
          
        </div>
      )
    }
    // else if (this.inputType==="calendar"){
    //   return (
    //     <div className = {this.className}> 
    //       <span className="SectionText">{this.title}</span>
    //       <span className="SectionValue">

    //       {!this.writePriviledge?(<DateTimePicker
    //       onChange={(date)=>{this.props.parentFunction(date.toString());this.setState({date:date})}}
    //       // onChange={(date)=>{console.log("its type is ");console.log(new Date(date).toString())}}
    //       value={this.state.date}
    //       disableClock = {true}
    //     />):(<div>{this.state.date}</div>)
      
    //   }
        
    //     </span>
    //     </div>
    //   )
    // }
    else if (this.inputType==="Calendar"){
      return (
        <div> 
          <div className = {this.className}> 
          <span className="SectionText">{this.title}</span>
          <span className="SectionValue">
        {this.writePriviledge?(<DatePicker
          selected={this.state.date}
          onChange={(date)=>{this.props.parentFunction(date.toString());
            this.setState({date:date})}}            
          showTimeSelect
          timeFormat="HH:mm:00"
          timeIntervals={15}
          timeCaption="time"
          dateFormat="yyyy-MM-d HH:mm:00"
        />)
      :(<DatePicker
        selected={this.state.date}
        onChange={(date)=>{this.props.parentFunction(date.toString());
          this.setState({date:date})}}  
          disabled          
        showTimeSelect
        timeFormat="HH:mm:00"
        timeIntervals={15}
        timeCaption="time"
        dateFormat="yyyy-MM-d HH:mm:00"
      />)}
        </span>
        </div>
          
         </div>
       )
     }
    else if (this.inputType==="select"){
      this.constructList()
      return(<React.Fragment>
        <div className = {this.className}>
          <span className="SectionText">{this.title}</span>
          <span className="SectionValue">
        {this.writePriviledge?(this.selectBar):(this.value)}
          </span>
        </div>
      </React.Fragment>)
    }

    
  }
}

export default DoenetBox;