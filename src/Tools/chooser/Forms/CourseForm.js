
import React from 'react';
import nanoid from 'nanoid';
import ChooserConstants from '../ChooserConstants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faTimesCircle, faPlusCircle, faSave } from '@fortawesome/free-solid-svg-icons';

class CourseForm extends React.Component {
  static defaultProps = {
    selectedCourse: null,
    selectedCourseInfo: null
  }

  constructor(props) {
    super(props);
    this.state = {
      edited: "",
      courseName: "",
      department: "",
      courseCode: "",
      section: "",
      year: "",
      semester: "Spring",
      description: "",
      roles: []
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.addRole = this.addRole.bind(this);
  }

  componentDidMount() {
    if (this.props.mode == ChooserConstants.EDIT_COURSE_INFO_MODE && this.props.selectedCourseInfo !== null) {
      let term = this.props.selectedCourseInfo.term.split(" ");
      this.setState({
        courseName: this.props.selectedCourseInfo.courseName,
        department: this.props.selectedCourseInfo.department,
        courseCode: this.props.selectedCourseInfo.courseCode,
        section: this.props.selectedCourseInfo.section,
        semester: term[0],
        year: term[1],
        description: this.props.selectedCourseInfo.description
      });
    }
  }

  handleChange(event) {
    // set edited to true once any input is detected
    this.setState({ edited: true });

    let name = event.target.name;
    let value = event.target.value;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    let term = this.state.semester + " " + this.state.year;
    if (this.props.mode == ChooserConstants.CREATE_COURSE_MODE) {
      let courseId = nanoid();
      this.props.handleNewCourseCreated({
        courseName: this.state.courseName,
        courseId: courseId,
        courseCode: this.state.courseCode,
        term: term,
        description: this.state.description,
        department: this.state.department,
        section: this.state.section,
      }, () => {
      });
    } else {
      this.props.saveCourse({
        courseName: this.state.courseName,
        courseId: this.props.selectedCourse,
        courseCode: this.state.courseCode,
        term: term,
        description: this.state.description,
        department: this.state.department,
        section: this.state.section,
        overviewId: this.props.selectedCourseInfo.overviewId,
        syllabusId: this.props.selectedCourseInfo.syllabusId
      });
    }
    this.props.handleBack("");
  }

  handleBack() {
    // popup confirm dialog if form is edited
    if (this.state.edited) {
      if (!window.confirm('All of your input will be discarded, are you sure you want to proceed?')) {
        return;
      }
    }

    this.props.handleBack("");
  }

  addRole(role) {
    //create a unike key for each new role
    var timestamp = (new Date()).getTime();
    this.state.roles['role-' + timestamp] = role;
    this.setState({ roles: this.state.roles });
  }


  render() {
    return (
      <div id="formContainer">
        <div id="formTopbar">
          <div id="formBackButton" onClick={this.handleBack} data-cy="newCourseFormBackButton">
            <FontAwesomeIcon icon={faArrowCircleLeft} style={{ "fontSize": "17px", "marginRight": "5px" }} />
            <span>Back to Chooser</span>
          </div>
        </div>
        <form onSubmit={this.handleSubmit} method="POST">
          <div className="formGroup-12">
            <label className="formLabel">COURSE NAME</label>
            <input className="formInput" required type="text" name="courseName" value={this.state.courseName}
              placeholder="Course name goes here." onChange={this.handleChange} data-cy="newCourseFormNameInput" />
          </div>
          <div className="formGroupWrapper">
            <div className="formGroup-4" >
              <label className="formLabel">DEPARTMENT</label>
              <input className="formInput" required type="text" name="department" value={this.state.department}
                placeholder="DEP" onChange={this.handleChange} data-cy="newCourseFormDepInput" />
            </div>
            <div className="formGroup-4">
              <label className="formLabel">COURSE CODE</label>
              <input className="formInput" required type="text" name="courseCode" value={this.state.courseCode}
                placeholder="MATH 1241" onChange={this.handleChange} data-cy="newCourseFormCodeInput" />
            </div>
            <div className="formGroup-4">
              <label className="formLabel">SECTION</label>
              <input className="formInput" type="number" name="section" value={this.state.section}
                placeholder="00000" onChange={this.handleChange} data-cy="newCourseFormSectionInput" />
            </div>
          </div>
          <div className="formGroupWrapper">
            <div className="formGroup-4" >
              <label className="formLabel">YEAR</label>
              <input className="formInput" required type="number" name="year" value={this.state.year}
                placeholder="2019" onChange={this.handleChange} data-cy="newCourseFormYearInput" />
            </div>
            <div className="formGroup-4">
              <label className="formLabel">SEMESTER</label>
              <select className="formSelect" required name="semester" onChange={this.handleChange} value={this.state.semester}>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Fall">Fall</option>
              </select>
            </div>
            <div className="formGroup-4">
            </div>
          </div>
          <div className="formGroup-12">
            <label className="formLabel">DESCRIPTION</label>
            <textarea className="formInput" type="text" name="description" value={this.state.description}
              placeholder="Official course description here" onChange={this.handleChange} data-cy="newCourseFormDescInput" />
          </div>
          <div className="formGroup-12">
            <label className="formLabel">ROLES</label>
            <AddRoleForm addRole={this.addRole} />
            <RoleList roles={this.state.roles} />
          </div>
          <div id="formButtonsContainer">
            <button id="formSubmitButton" type="submit" data-cy="newCourseFormSubmitButton">
              <div className="formButtonWrapper">
                {this.props.mode == ChooserConstants.CREATE_COURSE_MODE ?
                  <React.Fragment>
                    <span>Create Course</span>
                    <FontAwesomeIcon icon={faPlusCircle} style={{ "fontSize": "20px", "color": "#fff", "cursor": "pointer", "marginLeft": "8px" }} />
                  </React.Fragment>
                  :
                  <React.Fragment>
                    <span>Save Changes</span>
                    <FontAwesomeIcon icon={faSave} style={{ "fontSize": "20px", "color": "#fff", "cursor": "pointer", "marginLeft": "8px" }} />
                  </React.Fragment>
                }
              </div>
            </button>
            <button id="formCancelButton" onClick={this.handleBack} data-cy="newCourseFormCancelButton">
              <div className="formButtonWrapper">
                <span>Cancel</span>
                <FontAwesomeIcon icon={faTimesCircle} style={{ "fontSize": "20px", "color": "#fff", "cursor": "pointer", "marginLeft": "8px" }} />
              </div>
            </button>
          </div>
        </form>
      </div>
    );
  }
}

function RoleList(props) {
  return (
    <div className="roleListContainer">
      <ul style={{ "fontSize": "16px" }}>{
        Object.keys(props.roles).map(function (key) {
          return <li key={key}>{props.roles[key]}</li>
        })}
      </ul>
    </div>
  );
};

class AddRoleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: ""
    };

    this.addRole = this.addRole.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
    
  addRole(event) {
    this.props.addRole(this.state.input);
    this.setState({ input: "" });
    event.preventDefault();
  };

  handleChange(event) {
    this.setState({ input: event.target.value });
  }

  render() {
    return (
      <div className="formGroup-4" style={{ "display": "flex" }}>
        <input className="formInput" type="text" value={this.state.input} onChange={this.handleChange}
          type="text" placeholder="Admin" />
        <button type="submit" style={{ "whiteSpace": "nowrap" }} onClick={this.addRole}>Add Role</button>
      </div>
    )
  }
}

export default CourseForm;