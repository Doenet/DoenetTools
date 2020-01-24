import React, { Component } from 'react';
import './homepage.css';
import { NBSP } from '../Doenet/components/SingleCharacterComponents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit as userEdit } from '@fortawesome/free-solid-svg-icons';
import { faAddressCard as addressCard } from '@fortawesome/free-solid-svg-icons';
import { faChalkboardTeacher as chalkboardTeacher} from '@fortawesome/free-solid-svg-icons';
import { faSearchPlus as searchPlus} from '@fortawesome/free-solid-svg-icons';
import { faAddressBook as addressBook} from '@fortawesome/free-solid-svg-icons';
import {  faBook as book} from '@fortawesome/free-solid-svg-icons';
import {  faDiagnoses as diagnoses} from '@fortawesome/free-solid-svg-icons';
import {  faChartBar as chartBarGrading} from '@fortawesome/free-solid-svg-icons';
import {  faPlusCircle as plusCircle} from '@fortawesome/free-solid-svg-icons';
import {  faSignInAlt as signInAlt} from '@fortawesome/free-solid-svg-icons';
import {  faDatabase as database} from '@fortawesome/free-solid-svg-icons';
import {  faHandHoldingUsd as handHoldingUsd} from '@fortawesome/free-solid-svg-icons';
import {  faChalkboard as chalkboard} from '@fortawesome/free-solid-svg-icons';
import {  faSearch as Search} from '@fortawesome/free-solid-svg-icons';

import logo from '../media/Doenet_Logo_Frontpage.png';







const person = {
  "editor":"this is editor"
}
class DoenetHomePage extends Component {
  constructor(props){
    super(props);

    this.state = {
      error: null,
      errorInfo: null,
      selectedCategory: "instructor",
      Bullets_Text:"editor" ,
      Bullets_image:"",
      Category_Text:"",
      Category_image:"",
      BackgroundColor:"",
      Bullets_link:"",
      activeTab: "editor",
    };

    this.categoryContent = {
      'instructor':{text: 'Instructor Text',
                    bullet_text:"instructor bullet text",
                    link:"#"
                    },
      'author':{text: 'Author Text',
                bullet_text:"author bullet text",
                link:"#"},
                    
      'learner':{text: 'Learner Text',
                bullet_text:"learner bullet text",
                link:"#"},
      'educational-researcher':{text: 'Educational Researcher Text',
                bullet_text:"educational researcher bullet text",
                link:"#"},
    };

    this.tabContent = {
      'editor': {
      text: 'As the instructor you will be able to provide an innovative learning experience for your students.  Doenet has features that will allow you to create assignments, assessment, and learning activities that are not only innovative, but that can also be customized to the students needs. '
      },
      'home': {
        text: 'An an author, you will be directly influencing the learning of students by creating innovate and interactive content for students.  You will also be able to see how students are interacting with your content using our data.'
      },
      'course': {
        text: 'Doenet provides a unique learning experience for students.  As a student, you will have access to a contextual library of high quality content through which you can do you assignments and learning activities.  Doenet will also offer customizable tools so that you can learn in your own way.  '
      },
      'exam': {
        text: 'Doenet will provide several tools for educational researchers, with access to data being teh most powerful.  Using the data from Doenet, you will be able to see exactly how students interact with content, and perform on assessmentsa and activities.  From here, research can be done to improve and expand this already-innovative tool. '
      },
    }
  }

  ChangeColor=(color)=> {
      this.setState({BackgroundColor:color})
      this.ChangeColorDefault()
  }
  ChangeColorDefault=()=>{
    this.setState({BackgroundColor:""})
  }
  changeTextonHover = (text) => {
    if (this.state.selectedCategory==="instructor") {
      text+=" instructor"
    }
    else if (this.state.selectedCategory==="author"){
      text+=" Author"
    }
    else if (this.state.selectedCategory==="learner"){
      text+=" learner"
    }
    else if (this.state.selectedCategory==="educational-researcher"){
      text+=" educational-researcher"
    }
    this.setState ({Bullets_Text:text})
  }
  changeTextandImageonHover = (text,image) => {
    this.setState ({Bullets_Text:text});
    this.setState ({Bullets_image:image});
  }
  Category_ShowTextonClick = (text) =>{
    this.setState ({Category_Text:text})
  }
  showCategoryText=() => {
    return (this.state.Category_Text)
  }
  showDefaultText = () => {
    return (this.state.Bullets_Text)
  }

  changeImageonHover = (what) => {
    this.setState ({Bullets_Text:what})
  }
  Category_ShowImageonClick = (text) =>{
    this.setState ({Category_Text:text})
  }
  showCategoryImage=() => {
    return (this.state.Category_Text)
  }
  showDefaultImage = () => {
    return (this.state.Bullets_image)
  }

  componentDidCatch(error, info){
    this.setState({error:error,errorInfo:info});
  }

  handleCategoryButtonOnClick = (category) => {
    this.setState({selectedCategory: category});
  }

  getCategoryContent = (categoryKey) => {
    return this.categoryContent[categoryKey];   
  }

  handleTabOnClick = (tabId) => {
    this.setState({activeTab: tabId});
  }

  getTabContent = (tabId) => {
    return this.tabContent[tabId];   
  }
  
  render() {
    // console.log(this.state);
     //We have an error so doen't show the viewer
     if (this.state.error){

      return (<React.Fragment>
        <p style={{color: "red"}}>{this.state.error && this.state.error.toString()}</p>
        </React.Fragment>);
    }
    //this opens up the activity with collaboration open (then they can close it if they want)
  //   <ul>
  //   <li><b>Date</b> January 8th, 2020</li>
  //   <li><b>Location</b> Vincent Hall Room 20, University of Minnesota</li>
  //   <li><b>Agenda</b> TBA</li>
  // </ul>
  // Contact us section info@doenet.org
  // Discussions page zoom hangout discussions@doenet.org
  // Try it out section.  indexedDB Stored Editor - one doc . Documentation
    return (
      <React.Fragment>
        <div className="homepage-stripes-container">
           
            <div className="heading-banner">
                <img src={logo} />
            </div>

              <div className="cloud-color section">
                <div className="section-text">
                  <h1 className="section-headline">The Distributed Open Education Network</h1>
                  <h4 style={{marginTop: "0px"}}>The free and open data-driven educational technology platform</h4>
                
                  <p style={{textAlign: "left"}}>The Distributed Open Education Network (Doenet) is, at its core, a mechanism for measuring and
                     sharing student interactions with web pages and storing anonymized data in an open distributed data warehouse.  
                     The Doenet platform will include tools for authoring interactive educational content, conducting educational 
                     research using the content, and discovering the most effective content based on the research results. </p>

                  <p style={{textAlign:"left"}}>The Doenet platform is just getting started.  We are excited to introduce early versions of two projects: DoenetML, a markup language for authoring interactive online activities, and DoenetAPI, a library for connecting web pages to the Doenet data layer, enabling tracking of student data across web pages and multiuser interactives.</p>
                </div>
              </div> 

              <div className="chocolate-color section">
                <div className="section-text">
                  <h1 className="section-headline">Introducing DoenetML</h1>
                  <p style={{textAlign:"left"}}>The markup language DoenetML allows you to build richly interactive activities by focusing on the meaning of the elements you wish to create.  Based on <a href="http://pretextbook.org">PreTeXt</a>, DoenetML looks similar to HTML, with descriptive tags such as <code>&lt;point&gt;</code>, <code>&lt;intersection&gt;</code>, and <code>&lt;answer&gt;</code>.</p>

                  <p style={{textAlign:"left"}}>You can experiment with a preliminary version of DoenetML by clicking the Guest Editor button.  Only a small subset of DoenetML tags are implemented in this version.</p>
                    <button onClick={()=>location.href = "/guestEditor/?contentId=974ce22bae0fa1d313c9aa203e4eb32488c842de1be30780110cd887ce0a3555"}>Guest Editor</button>


                    
                    <p style={{marginTop:"14px",marginBottom:"2px"}}>You can use the guest editor to explore additional sample DoenetML activities.</p>
                    <div style={{display:"inline-flex",flexDirection: "column"}}>
                    <span> <button style={{margin:"3px"}} onClick={()=>location.href = "/guestEditor/?contentId=a11c2db8fcc6280a91e763fcdf01de8b0770afffa4e70c5ef8d2fa670564eda4"}>A line through two points</button> </span>
                    <span> <button style={{margin:"3px"}} onClick={()=>location.href = "/guestEditor/?contentId=19b3992f020a2d6c738eaad37d19a81908e9f7508b51586ad90d6b9af294b4c8"}>The derivative of a quadratic</button> </span>
                    <span><button style={{margin:"3px"}} onClick={()=>location.href = "/guestEditor/?contentId=ea679d587429fbeab982f296857eb856db3214da7327797553f285fe5ce72de3"}>Undamped pendulum simulation</button> </span>
                    </div>
                </div>
              </div> 
              
              <div className="shadow-color section">
                <div className="section-text">
                  <h1 className="section-headline">Introducing DoenetAPI</h1>
                  <p  style={{textAlign:"left"}}>DoenetAPI saves data from web pages, allowing instructors to evaluate student perfomance on any web page using DoenetAPI.  In addition, multiple users can collaborate on content written using DoenetAPI.  Collaboration is started by clicking 
                    on the "Collaborate" button at the top right of interactive content. From there you can join an existing group or create your own.    </p>
                    <p>Click on a button below to navigate to a demo.</p>
                    <div style={{marginBottom:"5px"}}> <button style={{margin:"3px"}} onClick={()=>location.href = "/page/?contentId=4ff81bb91641a2ee576c7ba9a0be61382568b99ca7f166a8520747e60e61cd01"}>Demo 1a</button> 
                    <button style={{margin:"3px"}}  onClick={()=>location.href = "/page/?contentId=9158f1944b46e39d2bcf7bd912c291d9ace59b882c0059615fd002b6e69b66d9"}>Demo 1b</button>
                    <button  style={{margin:"3px"}} onClick={()=>location.href = "/page/?contentId=0184d996a7394bcf9e45cabd1de64cf9e04962e48a2ad952ca149dc4bed8ba63"} >Demo 1c</button></div>
                    <div><button style={{margin:"3px"}} onClick={()=>location.href = "/page/?contentId=aa689f00de1272a608bb731918ba45901567f71b8810955b39cb651ebdc021a8"}>Demo 2a</button> 
                    <button style={{margin:"3px"}}  onClick={()=>location.href = "/page/?contentId=6626b57cc3dcb369ddfb4ef412d514692613701c773ad31f9359d589a2a26674"}>Demo 2b</button>
                    <button  style={{margin:"3px"}} onClick={()=>location.href = "/page/?contentId=e7337aea5a4558326669a88ba737eea65bbe044d16e1c889b793eff94549dded"} >Demo 2c</button></div>
                </div>
              </div> 

              


              
              
             

              {/* <div className="shadow-color section">
                <div className="section-text">
                  <h1 className="section-headline">Doenet Discussions</h1>
                  <p>You are welcome to join our discussion!  We usually meet the second Wednesday of every month to 
                    discuss the progress of the Doenet project, answer questions and discuss related educational technology.
                  </p>
                  <div style={{width:"400px",}}>
                    <a href="/discussion">Next Discussion January 8th, 2020</a>
                 
                  </div>
                  
                </div>
              </div>  */}

              {/* <div className="cloud-color-section">
                <div className="Flex-container">
                  <div className="tabs-container">
                    <ul>
                      <Tab title="Instructor" tabId="editor" activeTab={this.state.activeTab}
                        onClick={() => this.handleTabOnClick("editor")}/>
                      <Tab title="Author" tabId="home" activeTab={this.state.activeTab}
                        onClick={() => this.handleTabOnClick("home")}/>
                      <Tab title="Learner" tabId="course" activeTab={this.state.activeTab}
                        onClick={() => this.handleTabOnClick("course")}/>
                      <Tab title="Educational Researcher" tabId="exam" activeTab={this.state.activeTab}
                        onClick={() => this.handleTabOnClick("exam")}/>
                    </ul>
                  </div>
                  <div className="tab-content-container">
                    <TabContent tabContent={this.getTabContent(this.state.activeTab)} />
                  </div>
              </div>
            </div> */}
              
             
           
            <div className="footer">
              <div className="footer-logo-container">
                <h4 style={{marginBottom: "0px"}}>Contact us</h4> 
                <div style={{marginBottom: "20px"}}><a href="mailto:info@doenet.org">info@doenet.org</a></div>
                <p> 
                  <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">
                    <img alt="Creative Commons License" style={{borderWidth:0}} src="https://i.creativecommons.org/l/by/4.0/88x31.png" /></a>
                    <br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International License</a>.
                    </p>
              </div>
            </div>
        </div>
      </React.Fragment>);
  }
}

class Category extends Component {

  render() {
    if (this.props.category === this.props.selected) {
      return(
        <li>
            <button className="selected-category" onClick={this.props.onClick}>{this.props.title}</button>
        </li>
      )
    } else {
      return(
        <li>
          <button className="category" onClick={this.props.onClick}>{this.props.title}</button>
        </li>
      )
    }
  }
}

class CategoryContent extends Component {

  render() {
    return (
      <div className="category-content-wrapper">
        <div className="category-content-text"><h1>{this.props.categoryContent.text}</h1></div>
      </div>
    )
  }
}

class Tab extends Component {
  render() {
    if (this.props.tabId === this.props.activeTab) {
      return(
        <li>
          <button className="active-tab tab" onClick={this.props.onClick}>{this.props.title}</button>
        </li>
      )
    } else {
      return(
        <li>
          <button className="tab" onClick={this.props.onClick}>{this.props.title}</button>
        </li>
      )
    }
  }
}

class TabContent extends Component {

  render() {
    return (
      <div className="tab-content-wrapper">
        <div className="tab-content-text"><a className="tab-content-text">{this.props.tabContent.text}</a></div>
      </div>
    )
  }
}

export default DoenetHomePage;