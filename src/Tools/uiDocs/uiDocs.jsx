import React from 'react';
import { 
  BrowserRouter as Router, 
  Link, 
  Route 
} from 'react-router-dom';
import styled from 'styled-components';
// import GlobalFont from "../../_utils/GlobalFont.js";

//=== COMPONENT IMPORTS ===
import ActionButton from "../../_reactComponents/PanelHeaderComponents/ActionButton.jsx";
import ActionButtonGroup from "../../_reactComponents/PanelHeaderComponents/ActionButtonGroup.jsx";
import SearchBar from "../../_reactComponents/PanelHeaderComponents/SearchBar.jsx";
import ToggleButton from '../../_reactComponents/PanelHeaderComponents/ToggleButton.jsx';
import Button from "../../_reactComponents/PanelHeaderComponents/Button.jsx";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.jsx";
import Textfield from '../../_reactComponents/PanelHeaderComponents/Textfield.jsx';
import UnitMenu from '../../_reactComponents/PanelHeaderComponents/UnitMenu.jsx';
import VerticalDivider from '../../_reactComponents/PanelHeaderComponents/VerticalDivider.jsx';
import { faCode } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Increment from '../../_reactComponents/PanelHeaderComponents/IncrementMenu.jsx';

// === HOW TO ADD TO UI DOCS ===
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
  const font = () => {};
  const vertical = () => {};

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
          {name: 'Width - Menu Panel',
          propPreview: '<ActionButton width="menu" />',
          propCode: {width: 'menu'},
          description: 'Sets width to fill menu panel width'},
          {name: 'Value',
          propPreview: '<ActionButton value="Edit"/>',
          propCode: {value: 'Edit'},
          description: 'Changes the text'},
          {name: 'Icon',
            propPreview: '<ActionButton icon={<FontAwesomeIcon icon={faCode}}/>',
            propCode: {icon: <FontAwesomeIcon icon={faCode}/>},
            description: 'See Style Guide for more info on how to use FontAwesomeIcons. Adds icon in button'},
            {name: 'Value + Icon',
            propPreview: '<ActionButton icon={<FontAwesomeIcon icon={faCode}} value="code"/>',
            propCode: {icon: <FontAwesomeIcon icon={faCode}/>, value: 'code'},
            description: 'See Style Guide for more info on how to use FontAwesomeIcons. Adds icon in button'},
            {name: 'Label',
          propPreview: '<ActionButton label="What: "/>',
          propCode: {label: 'What: '},
          description: 'Adds label to button'},
          {name: 'Vertical Label',
          propPreview: '<ActionButton label="What: vertical"/>',
          propCode: {label: 'What: ', vertical},
          description: 'Adds label to componenet on top'},
          {name: 'Alert',
          propPreview: '<ActionButton alert/>',
          propCode: {alert},
          description: 'Changes to alert mode (border is red)'},
          {name: 'onClick',
          propPreview: '<ActionButton onClick={() => console.log("clicked")} />',
          propCode: {onClick: () => console.log("clicked")},
          description: 'Function called when button is clicked'},
      ]
    },
    {
      name: 'ActionButtonGroup',
      id: 'actionbuttongroup',
      code: ActionButtonGroup,
      codePreview: '<ActionButtonGroup> <ActionButton/> <ActionButton/> <ActionButton/> </ActionButtonGroup>',
      req_props: null,
      req_children: [React.createElement(ActionButton), React.createElement(ActionButton), React.createElement(ActionButton)],
      use: 'This groups related action buttons together.',
    //   props: [
    //     // {name: 'Width - Menu Panel',
    //     // propPreview: '<ActionButtonGroup width="menu" />',
    //     // propCode: {width: 'menu'},
    //     // description: 'Sets width to fill menu panel width'},
    //     // {name: 'Width - Custom',
    //     // propPreview: '<ActionButtonGroup width="500px" />',
    //     // propCode: {width: '500px'},
    //     // description: 'Sets width to custom dimensions'},
    //   ]
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
          {name: 'Width - Menu Panel',
          propPreview: '<Button width="menu" />',
          propCode: {width: 'menu'},
          description: 'Sets width to fill menu panel width'},
          {name: 'Value',
          propPreview: '<Button value="This button is amazing!"/>',
          propCode: {value: 'This button is amazing!'},
          description: 'Changes the text'},
          {name: 'Icon',
            propPreview: '<Button icon={<FontAwesomeIcon icon={faCode}}/>',
            propCode: {icon: <FontAwesomeIcon icon={faCode}/>},
            description: 'See Style Guide for more info on how to use FontAwesomeIcons. Adds icon in button'},
            {name: 'Value + Icon',
            propPreview: '<Button icon={<FontAwesomeIcon icon={faCode}} value="code"/>',
            propCode: {icon: <FontAwesomeIcon icon={faCode}/>, value: 'code'},
            description: 'See Style Guide for more info on how to use FontAwesomeIcons. Adds icon in button'},
            {name: 'Label',
          propPreview: '<Button label="What: "/>',
          propCode: {label: 'What: '},
          description: 'Adds label to button'},
          {name: 'Vertical Label',
          propPreview: '<Button label="What: " vertical/>',
          propCode: {label: 'What: ', vertical},
          description: 'Adds label to component on top'},
          {name: 'Alert',
          propPreview: '<Button alert/>',
          propCode: {alert},
          description: 'Changes to alert mode (color is red)'},
          {name: 'onClick',
          propPreview: '<Button onClick={() => console.log("clicked")} />',
          propCode: {onClick: () => console.log("clicked")},
          description: 'Function called when button is clicked'},
      ]
    },
    {
      name: 'ButtonGroup',
      id: 'buttongroup',
      code: ButtonGroup,
      codePreview: '<ButtonGroup> <Button/> <Button/> <Button/> </ButtonGroup>',
      req_props: null,
      req_children: [React.createElement(Button), React.createElement(Button), React.createElement(Button)],
      use: 'This groups related buttons together.',
    //   props: [
    //     // {name: 'Width - Menu Panel',
    //     // propPreview: '<ActionButtonGroup width="menu" />',
    //     // propCode: {width: 'menu'},
    //     // description: 'Sets width to fill menu panel width'},
    //     // {name: 'Width - Custom',
    //     // propPreview: '<ActionButtonGroup width="500px" />',
    //     // propCode: {width: '500px'},
    //     // description: 'Sets width to custom dimensions'},
    //   ]
    },
    {
      name: 'Increment',
      id: 'increment',
      code: Increment,
      codePreview: '<Increment/>',
      req_props: null,
      req_children: null,
      use: 'Text input with increment and decrement buttons. Also has dropdown menu to select given values',
      props: [
        {name: 'Font',
        propPreview: '<Increment font/>',
        propCode: {font},
        description: 'Sets menu with default font values'},
        {name: 'Range',
        propPreview: '<Increment range={[0, 12]}/>',
        propCode: {range: [0,12]},
        description: 'Sets menu with range of numbers given - inclusive. Also restricts values to those withiin the given range'},
        {name: 'Values',
        propPreview: '<Increment values={["A", "B", "C", "D", "F"]} />',
        propCode: {values: ["A", "B", "C", "D", "F"]},
        description: 'Sets menu with given values'},
        {name: 'Label',
          propPreview: '<Increment label="What: "/>',
          propCode: {label: 'What: '},
          description: 'Adds label to componenet'},
          {name: 'Vertical Label',
          propPreview: '<Increment label="What: " vertical/>',
          propCode: {label: 'What: ', vertical},
          description: 'Adds label to component on top'},
          {name: 'Alert',
        propPreview: '<Increment alert/>',
        propCode: {alert},
        description: 'Changes to alert mode (main coloring is red)'},
        {name: 'onChange',
        propPreview: '<Increment onChange={(data) => console.log(data)} />',
        propCode: {onChange: (data) => console.log(data)},
        description: 'Function called when data changes'},
      ]
    },
    {
      name: 'SearchBar',
      id: 'searchbar',
      code: SearchBar,
      codePreview: '<SearchBar/>',
      req_props: null,
      req_children: null,
      use: 'Used for finding things.',
      props: [
        {name: 'Width - Menu Panel',
        propPreview: '<SearchBar width="menu" />',
        propCode: {width: 'menu'},
        description: 'Sets width to fill menu panel width'},
        // {name: 'Label',
        //   propPreview: '<Increment label="What: "/>',
        //   propCode: {label: 'What: ', width: 'menu'},
        //   description: 'Adds label to componenet'},
      ]
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
      {name: 'Width - Menu Panel',
      propPreview: '<Textfield width="menu" />',
      propCode: {width: 'menu'},
      description: 'Sets width to fill menu panel width'},
      {name: 'Value',
      propPreview: '<Textfield value="Enter cat names"/>',
      propCode: {value: 'Enter cat names'},
      description: 'Changes the text'},
      {name: 'Label',
          propPreview: '<Textfield label="What: "/>',
          propCode: {label: 'What: '},
          description: 'Adds label to componenet'},
          {name: 'Vertical Label',
          propPreview: '<Textfield label="What: " vertical/>',
          propCode: {label: 'What: ', vertical},
          description: 'Adds label to component on top'},
      {name: 'Alert',
      propPreview: '<Textfield alert/>',
      propCode: {alert},
      description: 'Changes to alert mode (border is red)'},
      {name: 'onChange',
      propPreview: '<Textfield onChange={(data) => console.log(data)} />',
      propCode: {onChange: (data) => console.log(data)},
      description: 'Function called when data changes'},
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
        {name: 'Width - Menu Panel',
        propPreview: '<ToggleButton width="menu" />',
        propCode: {width: 'menu'},
        description: 'Sets width to fill menu panel width'},
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
        {name: 'Vertical Label',
          propPreview: '<Textfield label="What: " vertical/>',
          propCode: {label: 'What: ', vertical},
          description: 'Adds label to component on top'},
        {name: 'Icon',
        propPreview: '<ToggleButton icon={<FontAwesomeIcon icon={faCode}}/>',
        propCode: {icon: <FontAwesomeIcon icon={faCode}/>},
        description: 'See Style Guide for more info on how to use FontAwesomeIcons. Adds icon in button'},
        {name: 'Value + Icon',
        propPreview: '<ToggleButton icon={<FontAwesomeIcon icon={faCode}} value="code"/>',
        propCode: {icon: <FontAwesomeIcon icon={faCode}/>, value: 'code'},
        description: 'See Style Guide for more info on how to use FontAwesomeIcons. Adds icon in button'},
        {name: 'Alert',
        propPreview: '<ToggleButton alert/>',
        propCode: {alert},
        description: 'Changes to alert mode (main coloring is red)'},
        {name: 'onClick',
        propPreview: '<ToggleButton onClick={(data) => console.log(data)} />',
        propCode: {onClick: (data) => console.log(data)},
        description: 'Function called when toggle button is clicked. Returns true when untoggled/unclicked? and clicked(white) and true when already toggled and clicked(blue)'},
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
        },
        {name: 'Vertical Label',
        propPreview: '<UnitMenu units={["EM", "PT", "PX"]} defaults={["None", "Auto"]} label="Label: " vertical>',
        propCode: {units: ['EM', 'PT', 'PX'], defaults: ['None', 'Auto'], label: 'Label: ', vertical},
        description: 'Adds label on top of the component. Dragging on the label will increment the value.'
        },
        {name: 'Alert',
        propPreview: '<UnitMenu units={["EM", "PT", "PX"]} defaults={["None", "Auto"]} alert>',
        propCode: {units: ['EM', 'PT', 'PX'], defaults: ['None', 'Auto'], alert},
        description: 'Changes color to red'
        },
        {name: 'onChange',
        propPreview: '<UnitMenu onChange={(data) => console.log(data)} />',
        propCode: {onChange: (data) => console.log(data), units: ['EM', 'PT', 'PX']},
        description: 'Function called when data changes'},
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
      <p>This is the UI Component Library. Here you can find information on all the the React UI Components.</p>
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
          Once you’ve created or fixed a component, add the documentation for it to this file ../src/Tools/uiDocs.js and update the component spreadsheet 
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
        {/* <GlobalFont/> */}

        <NavBar>
          <div style={{marginLeft: '10px'}}>
            <h1>Components</h1>
            {/* <SearchBar width='110px'/> */}
          </div>
            <h3><Link to={`/uiDocs/new_components`} style={{color: "black"}}>New Component Guidelines</Link></h3>
          <List>
            {dataStructure.map(({ name, id}) => (
              <li key={id}><Link to={`/uiDocs/component/${id}`} style={{color: "black"}}>{name}</Link></li>
            ))}
          </List>
        </NavBar>

        <Content>
          <Route exact path='/uiDocs' component={Home}></Route>
          <Route exact path={`/uiDocs/new_components`} component={New}></Route>
          <Route path={`/uiDocs/component/:componentId`} component={Components}></Route>
        </Content>

      </div>
    </Router>
   

  );
}