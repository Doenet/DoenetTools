import React from 'react';
import nanoid from 'nanoid';
import ChooserConstants from '../ChooserConstants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faTimesCircle, faPlusCircle, faSave } from '@fortawesome/free-solid-svg-icons';

class UrlForm extends React.Component {
  static defaultProps = {
    selectedUrl: null,
    selectedUrlInfo: null
  }

  constructor(props) {
    super(props);
    this.state = {
      edited: "",
      title: "",
      url: "",
      description: "",
      usesDoenetAPI: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  componentDidMount() {
    if (this.props.mode == ChooserConstants.EDIT_URL_INFO_MODE && this.props.selectedUrlInfo !== null) {
      this.setState({
        title: this.props.selectedUrlInfo.title,
        url: this.props.selectedUrlInfo.url,
        description: this.props.selectedUrlInfo.description,
        usesDoenetAPI: this.props.selectedUrlInfo.usesDoenetAPI
      });
    }
  }

  handleChange(event) {
    // set edited to true once any input is detected
    this.setState({ edited: true });
    let name = event.target.name;
    let value = event.target.value;
    if (event.target.type == "checkbox") {
      value = event.target.checked;
    }
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    if (this.props.mode == ChooserConstants.CREATE_URL_MODE) {
      let urlId = nanoid();
      this.props.handleNewUrlCreated({
        urlId: urlId,
        title: this.state.title,
        url: this.state.url,
        description: this.state.description,
        usesDoenetAPI: this.state.usesDoenetAPI
      }, () => {
      });
    } else {
      this.props.saveUrl({
        urlId: this.props.selectedUrl,
        title: this.state.title,
        url: this.state.url,
        description: this.state.description,
        usesDoenetAPI: this.state.usesDoenetAPI
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

  render() {

    return (
      <div id="formContainer">
        <div id="formTopbar">
          <div id="formBackButton" onClick={this.handleBack} data-cy="urlFormBackButton">
            <FontAwesomeIcon icon={faArrowCircleLeft} style={{ "fontSize": "17px", "marginRight": "5px" }} />
            <span>Back to Chooser</span>
          </div>
        </div>
        <form onSubmit={this.handleSubmit} method="POST">
          <div className="formGroup-12">
            <label className="formLabel">TITLE</label>
            <input className="formInput" required type="text" name="title" value={this.state.title}
              placeholder="Doenet Homepage" onChange={this.handleChange} data-cy="urlFormTitleInput" />
          </div>
          <div className="formGroup-12" >
            <label className="formLabel">URL</label>
            <input className="formInput" required type="text" name="url" value={this.state.url}
              placeholder="https://www.doenet.org/" onChange={this.handleChange} data-cy="urlFormUrlInput" />
          </div>
          <div className="formGroup-12">
            <label className="formLabel">DESCRIPTION</label>
            <textarea className="formInput" type="text" name="description" value={this.state.description}
              placeholder="URL description here" onChange={this.handleChange} data-cy="urlFormDescInput" />
          </div>
          <div className="formGroup-12" >
            <label className="formLabel" style={{ "display": "inline-block" }}>Uses DoenetML</label>
            <input className="formInput" type="checkbox" name="usesDoenetAPI" checked={this.state.usesDoenetAPI}
              onChange={this.handleChange} data-cy="urlFormUsesDoenetAPICheckbox" style={{ "width": "auto", "marginLeft": "7px" }} />
          </div>
          <div id="formButtonsContainer">
            <button id="formSubmitButton" type="submit" data-cy="urlFormSubmitButton">
              <div className="formButtonWrapper">
                {this.props.mode == ChooserConstants.CREATE_URL_MODE ?
                  <React.Fragment>
                    <span>Add New URL</span>
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
            <button id="formCancelButton" onClick={this.handleBack} data-cy="urlFormCancelButton">
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

export default UrlForm;