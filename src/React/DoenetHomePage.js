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
      'editor': [
        {
          icon: chalkboardTeacher,
          head:'Create Lessons',
          body:'Doenet has features that will allow you to create assignments, assessment, and learning activities that are not only innovative, but that can also be customized to the students needs. ',
        },
        {
          icon: diagnoses,
          head:'Assign work to students',
          body:'As the instructor you will be able to provide an innovative learning experience for your students. You are able to assign work to students',
        },
        {
          icon: plusCircle,
          head:'Create Exams to students',
          body:'Able to create exams to the students. Innovative learning experience for your students.  Doenet has features that will allow you to create learning activities that are not only innovative, but that can also be customized to the students needs. ',
        },
        {
          icon:chartBarGrading,
          head:' Automatic Grading System',
          body:'Automatic Grading system based on students exam results ',
        }

      ],
      'home': [
        {
          icon:chalkboard,
          head:'Interactive Classes',
          body:'Organize classroom discussions. Design highly relevant learning activities. Influencing the learning of students by creating innovate and interactive content for students.',
        }, 
        {
          icon: handHoldingUsd,
          head:'Paid for Creating Content',
          body:'An an author, you will be directly influencing the learning of students by creating innovate and interactive content for students.  You will also be able to see how students are interacting with your content using our data.',
        },
        {
          icon: signInAlt,
          head:'Portfolio Feature',
          body:'An an author, you will be directly influencing the learning of students by creating innovate and interactive content for students.  You will also be able to see how students are interacting with your content using our data.',
        },
        {
          icon: database,
          head:'Control on your Data',
          body:'An an author, you will be directly influencing the learning of students by creating innovate and interactive content for students.  You will also be able to see how students are interacting with your content using our data.',
        }
      ],
      
      'course': [
        {
          icon: Search,
          head:'Find Effective Content',
          body:'Unique learning experience for students.  As a student, you will have access to a contextual library of high quality content through which you can do you assignments and learning activities.',
        }, 
        {
          icon: addressCard,
          head:'',
          body:'Doenet provides a unique learning experience for students.  As a student, you will have access to a contextual library of high quality content through which you can do you assignments and learning activities.  Doenet will also offer customizable tools so that you can learn in your own way.',
        },
        {
          icon: searchPlus,
          head:'',
          body:'Doenet provides a unique learning experience for students.  As a student, you will have access to a contextual library of high quality content through which you can do you assignments and learning activities.  Doenet will also offer customizable tools so that you can learn in your own way.',
        },
        {
          icon: searchPlus,
          head:'',
          body:'Doenet provides a unique learning experience for students.  As a student, you will have access to a contextual library of high quality content through which you can do you assignments and learning activities.  Doenet will also offer customizable tools so that you can learn in your own way.',
        }

      ],
      'exam': [
        {
          icon: addressBook,
          head:'',
          body:'Doenet will provide several tools for educational researchers, with access to data being teh most powerful.  Using the data from Doenet, you will be able to see exactly how students interact with content, and perform on assessmentsa and activities.  From here, research can be done to improve and expand this already-innovative tool. ',
        }, 
        {
          icon: book,
          head:'',
          body:'Doenet will provide several tools for educational researchers, with access to data being teh most powerful.  Using the data from Doenet, you will be able to see exactly how students interact with content, and perform on assessmentsa and activities.  From here, research can be done to improve and expand this already-innovative tool. ',
        },
        {
          icon: searchPlus,
          head:'',
          body:'Doenet will provide several tools for educational researchers, with access to data being teh most powerful.  Using the data from Doenet, you will be able to see exactly how students interact with content, and perform on assessmentsa and activities.  From here, research can be done to improve and expand this already-innovative tool. ',
        },
        {
          icon: searchPlus,
          head:'',
          body:'Doenet will provide several tools for educational researchers, with access to data being teh most powerful.  Using the data from Doenet, you will be able to see exactly how students interact with content, and perform on assessmentsa and activities.  From here, research can be done to improve and expand this already-innovative tool. ',
        }
      ]
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
    console.log(this.state);
     //We have an error so doen't show the viewer
     if (this.state.error){

      return (<React.Fragment>
        <p style={{color: "red"}}>{this.state.error && this.state.error.toString()}</p>
        </React.Fragment>);
    }

    return (
      <React.Fragment>
           
            <div className="heading-banner">
              <div className="heading-banner-text">
                <h1 className="heading-title">DOENET</h1>
                <p className="heading-subtitle">The Distributed Open Education Network</p>
              </div>
            </div>
            <div className="Features">
         
              

              <div className="container">
                <div className="section-text">
                  <h1 className="section-headline">Create, Assign and Store Content</h1>
                  <p>The Distributed Open Education Network (Doenet) that is, at its core, a mechanism for measuring and
                     sharing student interactions with web pages and storing anonymized data in an open distributed data warehouse.  
                     The Doenet platform will include tools for authoring interactive educational content, conducting educational 
                     research using the content, and discovering the most effective content based on the research results. </p>
                </div>
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
            </div>
            
              
              
             
            </div>
            <div className="footer">
              <div className="footer-grid-column">
                <div className="footer-logo-container">

                  <p>2019 Doenet. All rights reserved.</p>
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
    console.log('tab content is', this.props.tabContent)
    
    return (
      <>
      
        {this.props.tabContent.map((tile, value) => (
          <div className="tab-content-wrapper" key={value}>
          <div >
            <FontAwesomeIcon className="fa-2x" icon={tile.icon}/>
          </div>
          <div className="tab-content-head">
            <a className="tab-content-head"></a> 
            <h2>{tile.head}</h2> 
           
          </div>
          <div className="tab-content-text">
          <p className="tab-content-text"> 
            {tile.body}
          </p>
          </div>
        </div>
        ))}
      
      
      </>
      
     
    )
  }
}


export default DoenetHomePage;