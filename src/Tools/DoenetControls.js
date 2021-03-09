import React from 'react';
import { 
  BrowserRouter as Router, 
  Link, 
  Route 
} from 'react-router-dom';
import styled from 'styled-components';
import GlobalFont from "../fonts/GlobalFont.js";

//=== COMPONENT IMPORTS ===
import ActionButton from "../imports/PanelHeaderComponents/ActionButton.js";
import ActionButtonGroup from "../imports/PanelHeaderComponents/ActionButtonGroup.js";
import SearchBar from "../imports/PanelHeaderComponents/SearchBar.js";
import ToggleButton from '../imports/PanelHeaderComponents/ToggleButton.js';
import Button from "../imports/PanelHeaderComponents/Button.js";
import Textfield from '../imports/PanelHeaderComponents/Textfield.js';
import UnitMenu from '../imports/PanelHeaderComponents/UnitMenu.js';
import VerticalDivider from '../imports/PanelHeaderComponents/VerticalDivider.js';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// === HOW TO ADD TO CONTROLS ===
// 1. Import the component in the COMPONENT IMPORTS SECTION above
// 2. Copy and paste this into the DATA STRUCTURE section below in alphabetical order
// {
//   name: 'Title of the component', EXAMPLE: 'UnitMenu'
//   id: 'Url addition, all lowercase', EXAMPLE: 'unitmenu'
//   code: component tag used to create it, same as import, no quotation marks, EXAMPLE: UnitMenu
//   codePreview: example of how the code looks for most basic form of the component, EXAMPLE: <UnitMenu {units: ['EM', 'PX', 'PT']}
//   req_props: {props needed for component to exist, null for most cases, written in this form: name: 'option}, EXAMPLE: {units: ['EM', 'PX', 'PT']}
//   req_children: children needed to show how the component works, null for most cases, EXAMPLE: null,
//   use: 'talk about why this thing exists', EXAMPLE: 'Adds added changable units for a textfield.'
//   props: [
//       {name: 'Title of prop', EXAMPLE: 'Label'
//       propPreview: 'example of the component code with the prop', EXAMPLE: '<UnitMenu units={['EM', 'PX', 'PT']} label='Label: '>'
//       propCode: {prop code written in this form: name: 'option'}, EXAMPLE: {units: ['EM', 'PT', 'PX'], label: 'Label: '}
//       description: 'talk about why this prop exists'}, EXAMPLE: 'Adds label in front of the component.'
//   ]
// },

const NavBar = styled.div`
  width: 240px;
  height: 100vh;
  position: fixed;
  background-color: #8FB8DE;
  color: #000;
  top: 0;
  left: 0;
  overflow-x: hidden;
  z-index: 1
`
const Content = styled.div`
  margin-left: 240px
`

const List = styled.ul`
  color: black
`

export default function attempt() {

//=== DATA STRUCTURE SECTION ===
  let dataStructure = [
    {
      name: 'ActionButton',
      id: 'actionbutton',
      code: ActionButton,
      codePreview: '<ActionButton/>',
      req_props: null,
      req_children: null,
      use: 'This is the simpler button styling. Can be used in ActionButtonGroup to place related buttons together.',
      props: [
          {name: 'Size',
          propPreview: '<ActionButton size="medium"/>',
          propCode: {size: 'medium'},
          description: 'The default is small, as shown above.'},
          {name: 'Value',
          propPreview: '<ActionButton value="Edit"/>',
          propCode: {value: 'Edit'},
          description: 'Changes the text'},
          {name: 'Alert',
          propPreview: '<ActionButton alert/>',
          propCode: {alert},
          description: 'Changes to alert mode (border is red)'},
      ]
    },
    {
      name: 'ActionButtonGroup',
      id: 'actionbuttongroup',
      code: ActionButtonGroup,
      codePreview: '<ActionButtonGroup> <ActionButton/> <ActionButton/> <ActionButton/> </ActionButtonGroup>',
      req_props: null,
      req_children: [React.createElement(ActionButton), React.createElement(ActionButton), React.createElement(ActionButton)],
      use: 'This groups related action buttons together.'
    },
    {
      name: 'Button',
      id: 'button',
      code: Button,
      codePreview: '<Button/>',
      req_props: null,
      req_children: null,
      use: 'This style is more eye-catching. It is meant to be used when you want the user to do this thing! Click this button here!!',
      props: [
          {name: 'Size',
          propPreview: '<Button size="medium"/>',
          propCode: {size: 'medium'},
          description: 'The default is small, as shown above.'},
          {name: 'Value',
          propPreview: '<Button value="This button is amazing!"/>',
          propCode: {value: 'This button is amazing!'},
          description: 'Changes the text'},
          {name: 'Alert',
          propPreview: '<Button alert/>',
          propCode: {alert},
          description: 'Changes to alert mode (color is red)'},
      ]
    },
    {
      name: 'SearchBar',
      id: 'searchbar',
      code: SearchBar,
      codePreview: '<SearchBar/>',
      req_props: null,
      req_children: null,
      use: 'Used for finding things.'
    },
    {
    name: 'Textfield',
    id: 'textfield',
    code: Textfield,
    codePreview: '<Textfield/>',
    req_props: null,
    req_children: null,
    use: 'This is where you can enter text.',
    props: [
      {name: 'Size',
      propPreview: '<Textfield size="medium"/>',
      propCode: {size: 'medium'},
      description: 'The default is small, as shown above.'},
      {name: 'Value',
      propPreview: '<Textfield value="Enter cat names"/>',
      propCode: {value: 'Enter cat names'},
      description: 'Changes the text'},
      {name: 'Alert',
      propPreview: '<Textfield alert/>',
      propCode: {alert},
      description: 'Changes to alert mode (border is red)'},
      ]
    },
    {
      name: 'ToggleButton',
      id: 'togglebutton',
      use: 'This is button toggles back and forth',
      code: ToggleButton,
      codePreview: '<ToggleButton/>',
      req_props: null,
      req_children: null,
      props: [
        {name: 'Size',
        propPreview: '<ToggleButton size="medium"/>',
        propCode: {size: 'medium'},
        description: 'The default is small, as shown above.'},
        {name: 'Value',
        propPreview: '<ToggleButton value="Select me"/>',
        propCode: {value: 'Select me'},
        description: 'Changes the value'},
        // {name: 'isSelected',
        // propPreview: '<ToggleButton isSelected/>',
        // propCode: {'isSelected'},
        // description: 'If added, starts the button in selected state.'},
        {name: 'Switch Value',
        propPreview: '<ToggleButton switch_value="frog"/>',
        propCode: {switch_value: 'frog'},
        description: 'Sets different text value for when the button is selected'},
        {name: 'Label',
        propPreview: '<ToggleButton label="What: "/>',
        propCode: {label: 'What: '},
        description: 'Adds label to button'},
        {name: 'Icon',
        propPreview: '<ToggleButton icon={<FontAwesomeIcon icon={faCode}}/>',
        propCode: {icon: <FontAwesomeIcon icon={faCode}/>},
        description: 'See Style Guide for more info on how to use FontAwesomeIcons. Adds icon in button'},
        {name: 'Alert',
        propPreview: '<ToggleButton alert/>',
        propCode: {alert},
        description: 'Changes to alert mode (main coloring is red)'},
      ]
    },
    {
      name: 'UnitMenu',
      id: 'unitmenu',
      code: UnitMenu,
      codePreview: '<UnitMenu units={["EM", "PT", "PX"]}/>',
      req_props: {units: ['EM', 'PT', 'PX']},
      req_children: null,
      use: 'Textfield with attached menu. Current application is displaying and changing units of values',
      props: [
        {name: 'Units',
        propPreview: '<UnitMenu units={["EM", "PT", "PX"]}/>',
        propCode: {units: ['EM', 'PT', 'PX']},
        description: 'Adds the units to the menu. Required for the component to work.'},
        {name: 'Defaults',
        propPreview: '<UnitMenu units={["EM", "PT", "PX"]} defaults={["None", "Auto"]}/>',
        propCode: {units: ['EM', 'PT', 'PX'], defaults: ['None', 'Auto']},
        description: 'Defaults are unitless values defined by us somewhere else. The word in the array will appear in the textfield and a - will appear on the main button.'},
        {name: 'Label',
        propPreview: '<UnitMenu units={["EM", "PT", "PX"]} defaults={["None", "Auto"]} label="Label: ">',
        propCode: {units: ['EM', 'PT', 'PX'], defaults: ['None', 'Auto'], label: 'Label: '},
        description: 'Adds label in front of the component. Dragging on the label will increment the value.'
        }
        ]
      },
    {
      name: 'VerticalDivider',
      id: 'verticaldivider',
      code: VerticalDivider,
      codePreview: '<VerticalDivider/>',
      req_props: null,
      req_children: null,
      use: 'Creates visual separation.'
    }
  ];
  // === END OF DATA STRUCTURE SECTION ===

//HOME PAGE
  function Home() {
    return (
    <div>
      <h1>Hi!</h1>
      <p>This is the Component Library. Use it wisely.</p>
      <p style={{display: "inline"}}>You will need </p>
      <p style={{color: "blue", display: "inline"}}>import ComponentName from "../imports/PanelHeaderComponents/ComponentName.js"</p>
      <p style={{display: "inline"}}> to add the component to a new file.</p>
    </div>
    );
  }

//NEW COMPONENT PAGE 
  function  New() {
    return (
      <div>
        <h1>Features of A Standard Doenet Component</h1>
        <p>These are the guidelines for creating components for user input on Doenet. 
          They are guidelines -- you can break them (and should if something looks ridiculous), 
          but make sure you have a reason why you need to and that you can convince someone else of that reason. 
          Once you’ve created or fixed a component, add the documentation for it to this file ../src/Tools/DoenetControls.js and update the component spreadsheet 
          <a href='https://docs.google.com/spreadsheets/d/16aaVroOz-l_DX3QGsVN9m-z0yE5LGFPH9HHLsUQKZCs/edit?usp=sharing' target='_blank'> here</a>. </p>
          <hr/>

        <h2>States to Consider (* denotes required)</h2>
          <p>*<i>disabled</i> - remove ability for user to interact with component, see styling  
          <a href='https://docs.google.com/document/d/16YDi2lUs6CjUYHfZBwjbBBtaWgJyY1uNbSRf3cj44D8/edit#bookmark=id.997keaoy7se2' target='_blank'> here</a></p>
          <p><i>required</i> - if component requires user input, see styling 
          <a href='https://docs.google.com/document/d/16YDi2lUs6CjUYHfZBwjbBBtaWgJyY1uNbSRf3cj44D8/edit#bookmark=id.tptn3i5d03g0' target='_blank'> here</a></p>
          <hr/>

        <h2>Standard Props (* denotes required)</h2>
          <p>*<i>aria-label</i> = built in HTML accessibility requirement</p>
          <p><i>value</i> = information expected to be shown on component (text on Button)</p>
          <p><i>icon</i> = small image that can be displayed, if it can show text - it can have an icon. More info
          <a href='https://docs.google.com/document/d/16YDi2lUs6CjUYHfZBwjbBBtaWgJyY1uNbSRf3cj44D8/edit#bookmark=id.lsq5rugnowwg' target='_blank'> here</a></p>
          <p><i>placeholder</i> = default shown before user input, use light gray (#e2e2e2) font</p>
          <p><i>size</i> = small, medium, large as shown 
          <a href='https://docs.google.com/document/d/16YDi2lUs6CjUYHfZBwjbBBtaWgJyY1uNbSRf3cj44D8/edit#bookmark=id.1q2bsnet5j1p' target='_blank'> here </a>
          - this includes font size</p>
          <p>*<i>margin</i> = 0px default, make it able to be changed when called</p>
          <p><i>width</i> = choose default based on where/how component will be implemented, consider whether width can be changed - add if needed</p>
          <p><i>height</i> = same concept as width</p>
          <p><i>onClick</i> = you know what this is, don’t use callback function</p>
          <p><i>onChange</i> = okay you probably know this as well, no callback function!</p>
          <p><i>onHover</i> = you can guess this, see 
          <a href='https://docs.google.com/document/d/16YDi2lUs6CjUYHfZBwjbBBtaWgJyY1uNbSRf3cj44D8/edit#bookmark=id.4fxdjra8uv4t' target='_blank'> here </a></p>
          <p><i>onFocus</i> = yeah, you know this, too; styling shown 
          <a href='https://docs.google.com/document/d/16YDi2lUs6CjUYHfZBwjbBBtaWgJyY1uNbSRf3cj44D8/edit#bookmark=id.u2sku2msba84' target='_blank'> here </a></p>
          <hr/>

        <h2>Comments on Styling</h2>
          <p>Only use the colors found on the 
          <a href='https://docs.google.com/document/d/16YDi2lUs6CjUYHfZBwjbBBtaWgJyY1uNbSRf3cj44D8/edit#bookmark=id.i1tjp0kzqemb' target='_blank'> Style Guide!! </a> (Unless you've talked to Clara or Kevin about it...)</p>
          <p>Give it a border or a color, as shown 
          <a href='https://docs.google.com/document/d/16YDi2lUs6CjUYHfZBwjbBBtaWgJyY1uNbSRf3cj44D8/edit#bookmark=id.53fu07uoic4t' target='_blank'> here </a></p>
          <p>Don’t apply the font to the component, fonts will be called in the Tool that loads it</p>
      </div>
    )
  }  

//COMPONENT PAGES
  function Components({ match }) {

    const component = dataStructure.find(({ id }) => id === match.params.componentId)
    var display = component.code

    //PROPS SECTION
    function Props(component) {
      if (component.props) {
        return (component.props.map(({ name,propPreview,propCode,description }) => (
          <div key={name}>
            <h3 key={name}>{name}</h3>
            <p key={name + 'code'} style={{color: "blue"}}>{propPreview}</p>
            <p key={description}>{description}</p>
            {React.createElement(display, propCode)}
          </div>)))
      }
      else {
        return (<p>Nothing to see here</p>)
      }


    }
    return (
      <div>
        <h1>{component.name}</h1>
        <p style={{color: "blue"}}>{component.codePreview}</p>
        {React.createElement(display, component.req_props, component.req_children)}

        <hr/>

        <h2>Why would I use this?</h2>
        <p>{component.use}</p>

        <hr/>

        <h2>Props</h2>
        {Props(component)}

      </div>
    )
  };

  //ROUTER SECTION
  return (
    <Router>
      <div>
        <GlobalFont/>

        <NavBar>
          <div style={{marginLeft: '10px'}}>
            <h1>Components</h1>
            {/* <SearchBar width='110px'/> */}
          </div>
            <h3><Link to={`/controls/new_components`} style={{color: "black"}}>New Component Guidelines</Link></h3>
          <List>
            {dataStructure.map(({ name, id}) => (
              <li key={id}><Link to={`/controls/component/${id}`} style={{color: "black"}}>{name}</Link></li>
            ))}
          </List>
        </NavBar>

        <Content>
          <Route exact path='/controls' component={Home}></Route>
          <Route exact path={`/controls/new_components`} component={New}></Route>
          <Route path={`/controls/component/:componentId`} component={Components}></Route>
        </Content>

      </div>
    </Router>
   

  );
}