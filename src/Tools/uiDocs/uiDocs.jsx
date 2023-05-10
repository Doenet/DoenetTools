import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Link,
  Route,
  Outlet,
  useParams,
} from "react-router-dom";
import styled from "styled-components";

//=== COMPONENT IMPORTS ===
import ActionButton from "../../_reactComponents/PanelHeaderComponents/ActionButton.jsx";
import ActionButtonGroup from "../../_reactComponents/PanelHeaderComponents/ActionButtonGroup.jsx";
import SearchBar from "../../_reactComponents/PanelHeaderComponents/SearchBar.jsx";
import ToggleButton from "../../_reactComponents/PanelHeaderComponents/ToggleButton.jsx";
import ToggleButtonGroup from "../../_reactComponents/PanelHeaderComponents/ToggleButtonGroup.jsx";
import Button from "../../_reactComponents/PanelHeaderComponents/Button.jsx";
import ButtonGroup from "../../_reactComponents/PanelHeaderComponents/ButtonGroup.jsx";
import Form from "../../_reactComponents/PanelHeaderComponents/Form.jsx";
import Textfield from "../../_reactComponents/PanelHeaderComponents/Textfield.jsx";
import TextArea from "../../_reactComponents/PanelHeaderComponents/TextArea.jsx";
import UnitMenu from "../../_reactComponents/PanelHeaderComponents/UnitMenu.jsx";
import VerticalDivider from "../../_reactComponents/PanelHeaderComponents/VerticalDivider.jsx";
import { faCode, faFish } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Increment from "../../_reactComponents/PanelHeaderComponents/IncrementMenu.jsx";
import DropdownMenu from "../../_reactComponents/PanelHeaderComponents/DropdownMenu.jsx";
import DateTime from "../../_reactComponents/PanelHeaderComponents/DateTime.jsx";
// import ColorImagePicker from '../../_reactComponents/PanelHeaderComponents/ColorImagePicker.jsx';
import Card from "../../_reactComponents/PanelHeaderComponents/Card.jsx";
import CollapseSection from "../../_reactComponents/PanelHeaderComponents/CollapseSection.jsx";
import ProgressBar from "../../_reactComponents/PanelHeaderComponents/ProgressBar.jsx";
import RelatedItems from "../../_reactComponents/PanelHeaderComponents/RelatedItems.jsx";
import Checkbox from "../../_reactComponents/PanelHeaderComponents/Checkbox.jsx";
import Tooltip from "../../_reactComponents/PanelHeaderComponents/Tooltip.jsx";
import DueDateBar from "../../_reactComponents/PanelHeaderComponents/DueDateBar.jsx";
import { useState } from "react";

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
  background-color: var(--solidLightBlue);
  color: var(--canvastext);
  top: 0;
  left: 0;
  overflow-x: hidden;
  z-index: 1;
`;
const Content = styled.div`
  margin-left: 240px;
`;

const List = styled.ul`
  color: var(--canvastext);
`;

export default function Attempt() {
  const [actionResult, setActionResult] = useState("");

  const font = () => {};
  const vertical = () => {};
  const verticalLabel = () => {};
  const disabled = () => {};
  const absolute = () => {};
  const left = () => {};
  const noSearchButton = () => {};
  const donutIcon = () => {};
  const showProgress = () => {};

  //=== DATA STRUCTURE SECTION ===
  let dataStructure = [
    {
      name: "ActionButton",
      id: "actionbutton",
      code: ActionButton,
      codePreview: "<ActionButton/>",
      req_props: null,
      req_children: null,
      use: "This is the simpler button styling. Can be used in ActionButtonGroup to place related buttons together.",
      props: [
        {
          name: "Width - Menu Panel",
          propPreview: '<ActionButton width="menu" />',
          propCode: { width: "menu", dataTest: "ActionButton width example" },
          description: "Sets width to fill menu panel width",
        },
        {
          name: "Value",
          propPreview: '<ActionButton value="Edit"/>',
          propCode: {
            value: "Edit",
            dataTest: "ActionButton Edit Value example",
          },
          description: "Changes the text",
        },
        {
          name: "Icon",
          propPreview: "<ActionButton icon={<FontAwesomeIcon icon={faCode}}/>",
          propCode: { icon: <FontAwesomeIcon icon={faCode} /> },
          description:
            "See Style Guide for more info on how to use FontAwesomeIcons. Adds icon in button",
        },
        {
          name: "Value + Icon",
          propPreview:
            '<ActionButton icon={<FontAwesomeIcon icon={faCode}} value="code"/>',
          propCode: { icon: <FontAwesomeIcon icon={faCode} />, value: "code" },
          description:
            "See Style Guide for more info on how to use FontAwesomeIcons. Adds icon in button",
        },
        {
          name: "Label",
          propPreview: '<ActionButton label="What: "/>',
          propCode: { label: "What: " },
          description: "Adds label to button",
        },
        {
          name: "Vertical Label",
          propPreview: '<ActionButton label="What: " vertical/>',
          propCode: { label: "What: ", vertical },
          description: "Adds label to componenet on top",
        },
        {
          name: "Alert",
          propPreview: "<ActionButton alert/>",
          propCode: { alert },
          description: "Changes to alert mode (border is red)",
        },
        {
          name: "onClick",
          propPreview:
            '<ActionButton onClick={() => setActionResult("ActionButton clicked")} />',
          propCode: {
            dataTest: "ActionButton click example",
            onClick: () => setActionResult("ActionButton clicked"),
          },
          description: "Function called when button is clicked",
        },
        {
          name: "Disabled",
          propPreview: "<ActionButton disabled />",
          propCode: { disabled },
          description: "Makes button not able to be used.",
        },
      ],
    },
    {
      name: "ActionButtonGroup",
      id: "actionbuttongroup",
      code: ActionButtonGroup,
      codePreview:
        "<ActionButtonGroup> <ActionButton/> <ActionButton/> <ActionButton/> </ActionButtonGroup>",
      req_props: null,
      req_children: [
        React.createElement(ActionButton),
        React.createElement(ActionButton),
        React.createElement(ActionButton),
      ],
      use: "This groups related action buttons together.",
      props: [
        //     // {name: 'Width - Menu Panel',
        //     // propPreview: '<ActionButtonGroup width="menu" />',
        //     // propCode: {width: 'menu'},
        //     // description: 'Sets width to fill menu panel width'},
        //     // {name: 'Width - Custom',
        //     // propPreview: '<ActionButtonGroup width="500px" />',
        //     // propCode: {width: '500px'},
        //     // description: 'Sets width to custom dimensions'},
        {
          name: "Vertical",
          propPreview: "<ActionButtonGroup vertical />",
          propCode: { vertical },
          description: "Aligns buttons vertically",
        },
        {
          name: "Label",
          propPreview: '<ActionButtonGroup label="What: "/>',
          propCode: { label: "What: " },
          description: "Adds label to button",
        },
        {
          name: "Vertical Label",
          propPreview: '<ActionButtonGroup label="What: " verticalLabel/>',
          propCode: { label: "What: ", verticalLabel },
          description: "Adds label to component on top",
        },
      ],
    },
    {
      name: "Button",
      id: "button",
      code: Button,
      codePreview: "<Button/>",
      req_props: null,
      req_children: null,
      use: "This style is more eye-catching. It is meant to be used when you want the user to do this thing! Click this button here!!",
      props: [
        {
          name: "Width - Menu Panel",
          propPreview: '<Button width="menu" />',
          propCode: { width: "menu" },
          description: "Sets width to fill menu panel width",
        },
        {
          name: "Value",
          propPreview: '<Button value="This button is amazing!"/>',
          propCode: { value: "This button is amazing!" },
          description: "Changes the text",
        },
        {
          name: "Icon",
          propPreview: "<Button icon={<FontAwesomeIcon icon={faCode}}/>",
          propCode: { icon: <FontAwesomeIcon icon={faCode} /> },
          description:
            "See Style Guide for more info on how to use FontAwesomeIcons. Adds icon in button",
        },
        {
          name: "Value + Icon",
          propPreview:
            '<Button icon={<FontAwesomeIcon icon={faCode}} value="code"/>',
          propCode: { icon: <FontAwesomeIcon icon={faCode} />, value: "code" },
          description:
            "See Style Guide for more info on how to use FontAwesomeIcons. Adds icon in button",
        },
        {
          name: "Label",
          propPreview: '<Button label="What: "/>',
          propCode: { label: "What: " },
          description: "Adds label to button",
        },
        {
          name: "Vertical Label",
          propPreview: '<Button label="What: " vertical/>',
          propCode: { label: "What: ", vertical },
          description: "Adds label to component on top",
        },
        {
          name: "Alert",
          propPreview: "<Button alert/>",
          propCode: { alert },
          description: "Changes to alert mode (color is red)",
        },
        {
          name: "onClick",
          propPreview: '<Button onClick={() => console.log("clicked")} />',
          propCode: { onClick: () => console.log("clicked") },
          description: "Function called when button is clicked",
        },
        {
          name: "Disabled",
          propPreview: "<Button disabled />",
          propCode: { disabled },
          description: "Makes button not able to be used.",
        },
      ],
    },
    {
      name: "ButtonGroup",
      id: "buttongroup",
      code: ButtonGroup,
      codePreview: "<ButtonGroup> <Button/> <Button/> <Button/> </ButtonGroup>",
      req_props: null,
      req_children: [
        React.createElement(Button),
        React.createElement(Button),
        React.createElement(Button),
      ],
      use: "This groups related buttons together.",
      props: [
        {
          name: "Vertical",
          propPreview: "<ButtonGroup vertical />",
          propCode: { vertical },
          description: "Makes buttons align vertically",
        },
        // {name: 'Width - Menu Panel',
        // propPreview: '<ActionButtonGroup width="menu" />',
        // propCode: {width: 'menu'},
        // description: 'Sets width to fill menu panel width'},
        // {name: 'Width - Custom',
        // propPreview: '<ActionButtonGroup width="500px" />',
        // propCode: {width: '500px'},
        // description: 'Sets width to custom dimensions'},
      ],
    },
    {
      name: "Card",
      id: "card",
      code: Card,
      codePreview: "<Card/>",
      req_props: null,
      req_children: null,
      use: "Card is an eye-catching button that brings that user to more content or a new location.",
      props: [
        // {
        //   name: 'Width - Menu Panel',
        //   propPreview: '<Button width="menu" />',
        //   propCode: { width: 'menu' },
        //   description: 'Sets width to fill menu panel width',
        // },
        {
          name: "Value",
          propPreview: '<Card value="Click Me!"/>',
          propCode: { value: "Click Me!" },
          description: "Changes the text",
        },
        {
          name: "Icon",
          propPreview: "<Card icon={<FontAwesomeIcon icon={faCode}}/>",
          propCode: { icon: <FontAwesomeIcon icon={faCode} /> },
          description:
            "See Style Guide for more info on how to use FontAwesomeIcons. Adds icon in button",
        },
        {
          name: "Label",
          propPreview: '<Card label="What: "/>',
          propCode: { label: "What: " },
          description: "Adds label to card",
        },
        {
          name: "Vertical Label",
          propPreview: '<Card label="What: " vertical/>',
          propCode: { label: "What: ", vertical },
          description: "Adds label to component on top",
        },
        {
          name: "Alert",
          propPreview: "<Card alert/>",
          propCode: { alert },
          description: "Changes to alert mode (color is red)",
        },
        {
          name: "onClick",
          propPreview: '<Card onClick={() => console.log("clicked")} />',
          propCode: { onClick: () => console.log("clicked") },
          description: "Function called when button is clicked",
        },
        {
          name: "Disabled",
          propPreview: "<Card disabled />",
          propCode: { disabled },
          description: "Makes button not able to be used.",
        },
      ],
    },
    {
      name: "Checkbox",
      id: "checkbox",
      code: Checkbox,
      codePreview: "<Checkbox/>",
      req_props: null,
      req_children: null,
      use: "Shows state of item",
      props: [
        {
          name: "Checked",
          propPreview: "<Checkbox checked></Checkbox>",
          propCode: { checked: "true" },
          description: "Sets state of checkbox",
        },
        {
          name: "Checked Icon",
          propPreview:
            "<Checkbox checked checkedIcon={icon: <FontAwesomeIcon icon={faCode} />}></Checkbox>",
          propCode: {
            checkedIcon: <FontAwesomeIcon icon={faCode} />,
            checked: "true",
          },
          description: "Sets icon when checked",
        },
        {
          name: "Unchecked Icon",
          propPreview:
            "<Checkbox uncheckedIcon={icon: <FontAwesomeIcon icon={faFish} />}></Checkbox>",
          propCode: { uncheckedIcon: <FontAwesomeIcon icon={faFish} /> },
          description: "Sets icon when unchecked",
        },
        {
          name: "Label",
          propPreview: '<Checkbox label="What: "/>',
          propCode: { label: "What: " },
          description: "Adds label to button",
        },
        {
          name: "Vertical Label",
          propPreview: '<Checkbox label="What: " vertical/>',
          propCode: { label: "What: ", vertical },
          description: "Adds label to component on top",
        },
        {
          name: "Disabled",
          propPreview: "<Checkbox disabled></Checkbox>",
          propCode: { disabled: "true" },
          description: "Sets to disabled",
        },
      ],
    },
    {
      name: "CollapseSection",
      id: "collapsesection",
      code: CollapseSection,
      codePreview: "<CollapseSection/>",
      req_props: null,
      req_children: null,
      use: "Displays additional text when the header is clicked.",
      props: [
        {
          name: "Width - Menu Panel",
          propPreview: '<CollapseSection width="menu" />',
          propCode: { width: "menu" },
          description: "Sets width to fill menu panel width",
        },
        {
          name: "Title",
          propPreview: '<CollapseSection title="Look Here!"/>',
          propCode: { title: "Look Here!" },
          description: "Changes the title",
        },
        {
          name: "Vertical Label",
          propPreview: '<CollapseSection label="What: " vertical/>',
          propCode: { label: "What: ", vertical },
          description: "Adds label to component on top",
        },
        {
          name: "Disabled",
          propPreview: "<CollapseSection disabled />",
          propCode: { disabled },
          description: "Makes collapse section not able to be used",
        },
      ],
    },
    {
      name: "DateTime",
      id: "datetime",
      code: DateTime,
      codePreview: "<DateTime/>",
      req_props: null,
      req_children: null,
      use: "Allows user to pick date and time",
      props: [
        {
          name: "Width",
          propPreview: '<DateTime width="menu" />',
          propCode: { width: "menu" },
          description: "Sets width to fill menu panel width",
        },
        {
          name: "Value",
          propPreview: '<DateTime value={new Date("09/23/2000")}/>',
          propCode: { value: new Date("09/23/2000") },
          description: "Sets the value of the date-time picker",
        },
        {
          name: "Label",
          propPreview: '<DateTime label = "Datetime"/>',
          propCode: { label: "Datetime" },
          description: "Sets a label",
        },
        {
          name: "Vertical Label",
          propPreview: '<DateTime label = "Datetime" vertical/>',
          propCode: { label: "Datetime", vertical: true },
          description: "Sets a vertical label",
        },
        {
          name: "DatePicker",
          propPreview: "<DateTime datePicker={false}/>",
          propCode: { datePicker: false },
          description:
            "Toggle the date picker, set it to false if only the time picker is needed",
        },
        {
          name: "Timepicker",
          propPreview: "<DateTime timePicker={false}/>",
          propCode: { timePicker: false },
          description:
            "Toggle the time picker, set it to false if only the date picker is needed",
        },
        {
          name: "Precision",
          propPreview: '<DateTime precision = "seconds"/>',
          propCode: { precision: "seconds" },
          description: "Change precision of the time picker.",
        },
        {
          name: "Disabled",
          propPreview: "<DateTime disabled= {true} />",
          propCode: { disabled: true },
          description: "disables component",
        },
        {
          name: "Alert",
          propPreview: "<DateTime alert />",
          propCode: { alert: true },
          description: "alerts component",
        },
        {
          name: "Placeholder",
          propPreview: '<DateTime placeholder = "enter start date" />',
          propCode: { placeholder: "enter start date" },
          description: "Set custom placeholder.",
        },
        {
          name: "onChange",
          propPreview:
            "<DateTime onChange = {(value) => console.log(value)} />",
          propCode: { onChange: (value) => console.log(value) },
          description: "Function called when data changes.",
        },
        {
          name: "onBlur",
          propPreview: "<DateTime onBlur = {(value) => console.log(value)} />",
          propCode: { onBlur: (value) => console.log(value) },
          description: "Function called when component blurred.",
        },
        {
          name: "onKeyDown",
          propPreview: "<DateTime onKeyDown={(e) => console.log(e.key)} />",
          propCode: { onKeyDown: (e) => console.log(e.key) },
          description: "Function called when component a key is pressed",
        },
      ],
    },
    {
      name: "DropdownMenu",
      id: "dropdownmenu",
      code: DropdownMenu,
      codePreview: '<DropdownMenu items = {[[1, "one"], [2, "two"]]}/>',
      req_props: {
        items: [
          [1, "one"],
          [2, "two"],
        ],
      },
      req_children: null,
      use: "This is used for selecting one option out of multiple",
      props: [
        {
          name: "Items",
          propPreview:
            '<DropdownMenu items = {[[1, "one"], [2, "two"], [3, "three"]]} />',
          propCode: {
            items: [
              [1, "one"],
              [2, "two"],
              [3, "three"],
            ],
          },
          description: "Sets options",
        },
        {
          name: "Default Index",
          propPreview:
            '<DropdownMenu items = {[[1, "one"], [2, "two"]]} defaultIndex={"1"}/>',
          propCode: {
            items: [
              [1, "one"],
              [2, "two"],
            ],
            defaultIndex: "1",
          },
          description: "Sets default value index. Indexing starts at 1",
        },
        {
          name: "Label",
          propPreview:
            '<DropdownMenu items = {[[1, "one"], [2, "two"]]} label="Dropdown Menu" />',
          propCode: {
            items: [
              [1, "one"],
              [2, "two"],
            ],
            label: "Dropdown Menu",
          },
          description: "Sets a label",
        },
        {
          name: "Vertical Label",
          propPreview:
            '<DropdownMenu items = {[[1, "one"], [2, "two"]]} label = "Datetime" vertical/>',
          propCode: {
            items: [
              [1, "one"],
              [2, "two"],
            ],
            label: "Dropdown Menu",
            vertical: true,
          },
          description: "Sets a vertical label",
        },
        {
          name: "Title",
          propPreview:
            '<DropdownMenu items = {[[1, "one"], [2, "two"]]} title="Choose your favorite number"/>',
          propCode: {
            items: [
              [1, "one"],
              [2, "two"],
            ],
            title: "Choose your favorite number",
          },
          description: "Sets default text",
        },
        {
          name: "Value Index",
          propPreview:
            '<DropdownMenu items = {[[1, "one"], [2, "two"]]} valueIndex={"2"} title="Choose your favorite number"/>',
          propCode: {
            items: [
              [1, "one"],
              [2, "two"],
            ],
            title: "Choose your favorite number",
            valueIndex: "1",
          },
          description: "To manually set the value of the dropdown",
        },
        {
          name: "Absolute",
          propPreview:
            '<DropdownMenu items = {[[1, "one"], [2, "two"]]} absolute title="Choose your favorite number"/>',
          propCode: {
            items: [
              [1, "one"],
              [2, "two"],
            ],
            title: "Choose your favorite number",
            absolute: "absolute",
          },
          description:
            'To position the element absolutely - "absolute" or "relative" only',
        },
        {
          name: "Absolute Position",
          propPreview:
            '<DropdownMenu items = {[[1, "one"], [2, "two"]]} absolute left title="Choose your favorite number"/>',
          propCode: {
            items: [
              [1, "one"],
              [2, "two"],
            ],
            title: "Choose your favorite number",
            absolute: "absolute",
            left,
          },
          description:
            'To position the element when set to absolute - "top" or "bottom" or "right" or "left" only',
        },
        {
          name: "Width - Menu Panel",
          propPreview:
            '<DropdownMenu items = {[[1, "one"], [2, "two"]]} width="menu" />',
          propCode: {
            items: [
              [1, "one"],
              [2, "two"],
            ],
            width: "menu",
          },
          description: "Sets width to fill menu panel width",
        },
        {
          name: "Width - Custom",
          propPreview:
            '<DropdownMenu items = {[[1, "one"], [2, "two"]]} width="500px" />',
          propCode: {
            items: [
              [1, "one"],
              [2, "two"],
            ],
            width: "500px",
          },
          description: "Sets width to custom dimensions",
        },
        {
          name: "onChange",
          propPreview:
            '<DropdownMenu items = {[[1, "one"], [2, "two"]]} onChange={(({ value }) => console.log(">>>", value)} />',
          propCode: {
            items: [
              [1, "one"],
              [2, "two"],
            ],
            onChange: ({ value }) => console.log(">>>", value),
          },
          description: "Function called when data changes",
        },
        {
          name: "Disabled",
          propPreview:
            '<DropdownMenu items = {[[1, "one"], [2, "two"], [3, "three"]]} disabled/>',
          propCode: {
            items: [
              [1, "one"],
              [2, "two"],
              [3, "three"],
            ],
            disabled,
          },
          description: "Makes disabled",
        },
      ],
    },
    {
      name: "Due Date Bar",
      id: "duedatebar",
      code: DueDateBar,
      codePreview:
        '<DueDateBar startDate={new Date("2022-01-01 00:00:00")} dueDate={new Date("2025-12-31 23:59:59")} />',
      req_props: {
        startDate: new Date("2022-01-01 00:00:00"),
        endDate: new Date("2025-12-31 23:59:59"),
      },
      req_children: null,
      use: "To track if the assignment is completed, in progress, or overdue. Required props are startDate and endDate.",
      props: [
        {
          name: "Case: Overdue",
          propPreview:
            '<DueDateBar startDate={new Date("2022-01-01 00:00:00")} dueDate={new Date("2022-11-01 23:59:59")} />',
          propCode: {
            startDate: new Date("2022-01-01 00:00:00"),
            endDate: new Date("2022-11-01 23:59:59"),
          },
          description: "Set the due date bar to overdue state.",
        },
        {
          name: "isCompleted",
          propPreview:
            '<DueDateBar isCompleted startDate={new Date("2022-01-01 00:00:00")} dueDate={new Date("2025-12-31 23:59:59")} />',
          propCode: {
            isCompleted: true,
            startDate: new Date("2022-01-01 00:00:00"),
            endDate: new Date("2025-12-31 23:59:59"),
          },
          description: "Set the due date bar to completed state.",
        },
      ],
    },
    {
      name: "Increment",
      id: "increment",
      code: Increment,
      codePreview: "<Increment/>",
      req_props: null,
      req_children: null,
      use: "Text input with increment and decrement buttons. Also has dropdown menu to select given values",
      props: [
        {
          name: "Width",
          propPreview: '<Increment width="menu" />',
          propCode: { width: "menu" },
          description: "Sets width to fill menu panel width",
        },
        {
          name: "Font",
          propPreview: "<Increment font/>",
          propCode: { font },
          description: "Sets menu with default font values",
        },
        {
          name: "Min",
          propPreview: "<Increment min={-1} />",
          propCode: { min: -1 },
          description:
            "Restricts the menu to have values greater or equal to min",
        },
        {
          name: "Max",
          propPreview: "<Increment max={5}/>",
          propCode: { max: 5 },
          description:
            "Restricts the menu to have values smaller or equal to max",
        },
        {
          name: "Value",
          propPreview: "<Increment value=5 />",
          propCode: { value: 5 },
          description: "Sets value displayed",
        },
        {
          name: "Values",
          propPreview: '<Increment values={["A", "B", "C", "D", "F"]} />',
          propCode: { values: ["A", "B", "C", "D", "F"] },
          description: "Sets menu with given values",
        },
        {
          name: "Restricted",
          propPreview: "<Increment restricted values = {[1, 5, 9, 14]}/>",
          propCode: {
            values: [1, 5, 9, 14],
            restricted: true,
          },
          description:
            "Restricts the values to the ones in the menu. If all the values numeric and value entered not in the given values, the value is set to the closest one.",
        },
        {
          name: "Label",
          propPreview: '<Increment label="What: "/>',
          propCode: { label: "What: " },
          description: "Adds label to componenet",
        },
        {
          name: "Vertical Label",
          propPreview: '<Increment label="What: " vertical/>',
          propCode: { label: "What: ", vertical },
          description: "Adds label to component on top",
        },
        {
          name: "Alert",
          propPreview: "<Increment alert/>",
          propCode: { alert },
          description: "Changes to alert mode (main coloring is red)",
        },
        {
          name: "onChange",
          propPreview: "<Increment onChange={(data) => console.log(data)} />",
          propCode: { onChange: (data) => console.log(data) },
          description: "Function called when data changes",
        },
        {
          name: "onBlur",
          propPreview: "<Increment onBlur={(data) => console.log(data)} />",
          propCode: { onBlur: (data) => console.log(data) },
          description: "Function called when component blurred",
        },
        {
          name: "onKeyDown",
          propPreview: "<Increment onKeyDown={(e) => console.log(e.key)} />",
          propCode: { onKeyDown: (e) => console.log(e.key) },
          description: "Function called when a key is pressed",
        },
        {
          name: "Placeholder",
          propPreview: '<Increment placeholder = "Type a number" />',
          propCode: { placeholder: "Type a number" },
          description: "Add a placeholder for the field",
        },
        {
          name: "Disabled",
          propPreview: "<Increment disabled />",
          propCode: { disabled: true },
          description: "Makes button not able to be used.",
        },
      ],
    },
    {
      name: "ProgressBar",
      id: "progressbar",
      code: ProgressBar,
      codePreview: "<ProgressBar/>",
      req_props: null,
      req_children: null,
      use: "Currently used to track the progress of uploads. The progress prop must ALWAYS be defined.",
      props: [
        {
          name: "Donut Icon",
          propPreview: "<ProgressBar donutIcon />",
          propCode: { donutIcon, progress: 0.4 },
          description: "Progress bar with a donut icon",
        },
        {
          name: "Progress",
          propPreview: "<ProgressBar progress={0.4}/>",
          propCode: { progress: 0.4 },
          description: "Sets the progress of the bar",
        },
        {
          name: "Width",
          propPreview: "<ProgressBar width=400 />",
          propCode: { width: 400, progress: 0.4 },
          description:
            "Changes the width of the component in px; pass in the number without any units; default width is var(--menuWidth)=200px which must be updated manually",
        },
        {
          name: "Progress Label",
          propPreview: '<ProgressBar showProgress"/>',
          propCode: { showProgress, progress: 0.4 },
          description: "Adds progress label to componenet",
        },
        {
          name: "Label",
          propPreview: '<ProgressBar label="What: "/>',
          propCode: { label: "What: ", progress: 0.4 },
          description: "Adds label to componenet",
        },
        {
          name: "Vertical Label",
          propPreview: '<ProgressBar label="What: " vertical/>',
          propCode: { label: "What: ", vertical, progress: 0.4 },
          description: "Adds label to component on top",
        },
      ],
    },
    {
      name: "RelatedItems",
      id: "relateditems",
      code: RelatedItems,
      codePreview: "<RelatedItems/>",
      req_props: null,
      req_children: null,
      use: "Currently used to track version history. The styling on this component could be improved in the future by making <option> a part of RelatedItems.",
      props: [
        {
          name: "Options",
          propPreview:
            "<RelatedItems options={[<option value='apple'>apple</option>, <option value='pear'>pear</option>, <option value='banana'>banana</option>]} />",
          propCode: {
            options: [
              <option key="apple" value="apple">
                apple
              </option>,
              <option key="pear" value="pear">
                pear
              </option>,
              <option key="banana" value="banana">
                banana
              </option>,
            ],
          },
          description: "Adds options to the select component",
        },
        {
          name: "Width - Menu Panel",
          propPreview: '<RelatedItems width="menu" />',
          propCode: { width: "menu" },
          description: "Sets width to fill menu panel width",
        },
        {
          name: "Width",
          propPreview: '<RelatedItems width="100px" />',
          propCode: { width: "100px" },
          description: "Sets width to custom amount",
        },
        {
          name: "Size",
          propPreview: '<RelatedItems size="8" />',
          propCode: { size: "8" },
          description: "Sets size (height) to custom amount",
        },
        {
          name: "Label",
          propPreview: '<RelatedItems label="What: "/>',
          propCode: { label: "What: " },
          description: "Adds label to componenet",
        },
        {
          name: "Vertical Label",
          propPreview: '<RelatedItems label="What: " vertical/>',
          propCode: { label: "What: ", vertical },
          description: "Adds label to component on top",
        },
        {
          name: "onChange",
          propPreview:
            "<RelatedItems onChange={(data) => console.log(data)} />",
          propCode: { onChange: (data) => console.log(data) },
          description: "Function called when data changes",
        },
        {
          name: "onClick",
          propPreview:
            '<RelatedItems onClick={() => console.log("clicked")} />',
          propCode: { onClick: () => console.log("clicked") },
          description: "Function called when component is clicked",
        },
        {
          name: "onBlur",
          propPreview:
            "<RelatedItems onBlur={(e) => console.log(e.target.value)} />",
          propCode: { onBlur: (e) => console.log(e.target.value) },
          description: "Function called when component blurs",
        },
        {
          name: "onKeyDown",
          propPreview: "<RelatedItems onKeyDown={(e) => console.log(e.key)} />",
          propCode: { onKeyDown: (e) => console.log(e.key) },
          description: "Function called when key hit with focus on component",
        },
        {
          name: "Alert",
          propPreview: "<RelatedItems alert/>",
          propCode: { alert },
          description: "Changes to alert mode (border is red)",
        },
        {
          name: "Disabled",
          propPreview: "<RelatedItems disabled />",
          propCode: { disabled },
          description: "Makes component not able to be used",
        },
      ],
    },
    {
      name: "SearchBar",
      id: "searchbar",
      code: SearchBar,
      codePreview: "<SearchBar/>",
      req_props: null,
      req_children: null,
      use: "Used for finding things.",
      props: [
        {
          name: "Width - Menu Panel",
          propPreview: '<SearchBar width="menu" />',
          propCode: { width: "menu" },
          description: "Sets width to fill menu panel width",
        },
        {
          name: "No Search Button",
          propPreview: "<SearchBar noSearchButton />",
          propCode: { noSearchButton, width: "menu" },
          description: "Removes button from search bar",
        },
        {
          name: "Placeholder",
          propPreview: '<SearchBar placeholder="Enter cat names..."/>',
          propCode: { placeholder: "Enter cat names..." },
          description: "Adds placeholder to component",
        },
        {
          name: "Label",
          propPreview: '<SearchBar label="What: "/>',
          propCode: { label: "What: " },
          description: "Adds label to componenet",
        },
        {
          name: "Vertical Label",
          propPreview: '<SearchBar label="What: " vertical/>',
          propCode: { label: "What: ", vertical },
          description: "Adds label to component on top",
        },
        {
          name: "onChange",
          propPreview: "<SearchBar onChange={(data) => console.log(data)} />",
          propCode: { onChange: (data) => console.log(data) },
          description: "Function called when data changes",
        },
        {
          name: "onBlur",
          propPreview:
            "<SearchBar onBlur={(e) => console.log(e.target.value)} />",
          propCode: { onBlur: (e) => console.log(e.target.value) },
          description: "Function called when component blurs",
        },
        {
          name: "onKeyDown",
          propPreview: "<SearchBar onKeyDown={(e) => console.log(e.key)} />",
          propCode: { onKeyDown: (e) => console.log(e.key) },
          description: "Function called when key hit with focus on component",
        },
        {
          name: "Alert",
          propPreview: "<SearchBar alert/>",
          propCode: { alert },
          description: "Changes to alert mode (border is red)",
        },
        {
          name: "Disabled",
          propPreview: "<SearchBar disabled />",
          propCode: { disabled },
          description: "Makes button not able to be used.",
        },
      ],
    },
    {
      name: "TextArea",
      id: "textarea",
      code: TextArea,
      codePreview: "<TextArea/>",
      req_props: null,
      req_children: null,
      use: "This is where you can enter text.",
      props: [
        {
          name: "Width - Menu Panel",
          propPreview: '<TextArea width="menu" />',
          propCode: { width: "menu" },
          description: "Sets width to fill menu panel width",
        },
        {
          name: "Value",
          propPreview: '<TextArea value="Enter cat names"/>',
          propCode: { value: "Enter cat names" },
          description: "Changes the text",
        },
        {
          name: "Placeholder",
          propPreview: '<TextArea placeholder="Enter cat names"/>',
          propCode: { placeholder: "Enter cat names" },
          description: "Adds placeholder to component",
        },
        {
          name: "Label",
          propPreview: '<TextArea label="What: "/>',
          propCode: { label: "What: " },
          description: "Adds label to componenet",
        },
        {
          name: "Vertical Label",
          propPreview: '<TextArea label="What: " vertical/>',
          propCode: { label: "What: ", vertical },
          description: "Adds label to component on top",
        },
        {
          name: "Alert",
          propPreview: "<TextArea alert/>",
          propCode: { alert },
          description: "Changes to alert mode (border is red)",
        },
        {
          name: "onChange",
          propPreview: "<TextArea onChange={(data) => console.log(data)} />",
          propCode: { onChange: (data) => console.log(data) },
          description: "Function called when data changes",
        },
        {
          name: "onBlur",
          propPreview:
            "<Textfield onBlur={(e) => console.log(e.target.value)} />",
          propCode: { onBlur: (e) => console.log(e.target.value) },
          description: "Function called when component blurs",
        },
        {
          name: "onKeyDown",
          propPreview: "<Textfield onKeyDown={(e) => console.log(e.key)} />",
          propCode: { onKeyDown: (e) => console.log(e.key) },
          description: "Function called when key hit with focus on component",
        },
        {
          name: "Disabled",
          propPreview: "<TextArea disabled />",
          propCode: { disabled },
          description: "Makes TextArea not able to be used.",
        },
      ],
    },
    {
      name: "Textfield",
      id: "textfield",
      code: Textfield,
      codePreview: "<Textfield/>",
      req_props: null,
      req_children: null,
      use: "This is where you can enter text.",
      props: [
        {
          name: "Width - Menu Panel",
          propPreview: '<Textfield width="menu" />',
          propCode: { width: "menu" },
          description: "Sets width to fill menu panel width",
        },
        {
          name: "Value",
          propPreview: '<Textfield value="Enter cat names"/>',
          propCode: { value: "Enter cat names" },
          description: "Changes the text",
        },
        {
          name: "Placeholder",
          propPreview: '<Textfield placeholder="Enter cat names"/>',
          propCode: { placeholder: "Enter cat names" },
          description: "Adds placeholder to component",
        },
        {
          name: "Label",
          propPreview: '<Textfield label="What: "/>',
          propCode: { label: "What: " },
          description: "Adds label to componenet",
        },
        {
          name: "Vertical Label",
          propPreview: '<Textfield label="What: " vertical/>',
          propCode: { label: "What: ", vertical },
          description: "Adds label to component on top",
        },
        {
          name: "Alert",
          propPreview: "<Textfield alert/>",
          propCode: { alert },
          description: "Changes to alert mode (border is red)",
        },
        {
          name: "onChange",
          propPreview:
            "<Textfield onChange={(e) => console.log(e.target.value)} />",
          propCode: { onChange: (e) => console.log(e.target.value) },
          description: "Function called when data changes",
        },
        {
          name: "onBlur",
          propPreview:
            "<Textfield onBlur={(e) => console.log(e.target.value)} />",
          propCode: { onBlur: (e) => console.log(e.target.value) },
          description: "Function called when component blurs",
        },
        {
          name: "onKeyDown",
          propPreview: "<Textfield onKeyDown={(e) => console.log(e.key)} />",
          propCode: { onKeyDown: (e) => console.log(e.key) },
          description: "Function called when key hit with focus on component",
        },
        {
          name: "Disabled",
          propPreview: "<Textfield disabled />",
          propCode: { disabled },
          description: "Makes Textf dield not able to be used.",
        },
      ],
    },
    {
      name: "Form",
      id: "form",
      code: Form,
      codePreview: "<Form/>",
      req_props: null,
      req_children: null,
      use: "This is where you can enter text.",
      props: [
        {
          name: "Width - Menu Panel",
          propPreview: '<Form width="menu" />',
          propCode: { width: "menu" },
          description: "Sets width to fill menu panel width",
        },
        {
          name: "Submit Button Text",
          propPreview: '<Form submitButton="add Text" />',
          propCode: { submitButton: "Add Text Here" },
          description: "Changes the button text",
        },
        {
          name: "Value",
          propPreview: '<Form value="Sprinkles"/>',
          propCode: { value: "Sprinkles" },
          description: "Changes the text",
        },
        {
          name: "Placeholder",
          propPreview: '<Form placeholder="Enter cat names"/>',
          propCode: { placeholder: "Enter cat names" },
          description: "Adds placeholder to component",
        },
        {
          name: "Label",
          propPreview: '<Form label="What: "/>',
          propCode: { label: "What: " },
          description: "Adds label to component",
        },
        {
          name: "Vertical Label",
          propPreview: '<Form label="What: " vertical/>',
          propCode: { label: "What: ", vertical },
          description: "Adds label to component on top",
        },
        {
          name: "Alert",
          propPreview: "<Form alert/>",
          propCode: { alert },
          description: "Changes to alert mode (border is red)",
        },
        {
          name: "onChange",
          propPreview: "<Form onChange={(data) => console.log(data)} />",
          propCode: { onChange: (data) => console.log(data) },
          description: "Function called when data changes",
        },
        {
          name: "onClick",
          propPreview: '<Form onClick={() => console.log("clicked")} />',
          propCode: { onClick: () => console.log("clicked") },
          description: "Function called when form button is clicked",
        },
        {
          name: "onBlur",
          propPreview: "<Form onBlur={(e) => console.log(e.target.value)} />",
          propCode: { onBlur: (e) => console.log(e.target.value) },
          description: "Function called when component blurs",
        },
        {
          name: "onKeyDown",
          propPreview: "<Form onKeyDown={(e) => console.log(e.key)} />",
          propCode: { onKeyDown: (e) => console.log(e.key) },
          description: "Function called when key hit with focus on component",
        },
        {
          name: "Disabled",
          propPreview: "<Form disabled />",
          propCode: { disabled },
          description: "Makes component not able to be used",
        },
        {
          name: "clearInput",
          propPreview:
            "<Form clearInput={(e) => {console.log(e.target.value)} />",
          propCode: { clearInput: () => console.log("clear") },
          description: "Makes clear button available",
        },
      ],
    },
    {
      name: "ToggleButton",
      id: "togglebutton",
      use: "This is button toggles back and forth. It is a controlled component, so you must always pass the button the status of its state using isSelected.",
      code: ToggleButton,
      codePreview: "<ToggleButton/>",
      req_props: null,
      req_children: null,
      props: [
        {
          name: "Width - Menu Panel",
          propPreview: '<ToggleButton width="menu" />',
          propCode: { width: "menu" },
          description: "Sets width to fill menu panel width",
        },
        {
          name: "Value",
          propPreview: '<ToggleButton value="Select me"/>',
          propCode: { value: "Select me" },
          description: "Changes the value",
        },
        {
          name: "isSelected",
          propPreview: "<ToggleButton isSelected=true/>",
          propCode: { isSelected: true },
          description: "Sets state of toggle button",
        },
        {
          name: "Label",
          propPreview: '<ToggleButton label="What: "/>',
          propCode: { label: "What: " },
          description: "Adds label to button",
        },
        {
          name: "Vertical Label",
          propPreview: '<Textfield label="What: " vertical/>',
          propCode: { label: "What: ", vertical },
          description: "Adds label to component on top",
        },
        {
          name: "Icon",
          propPreview: "<ToggleButton icon={<FontAwesomeIcon icon={faCode}}/>",
          propCode: { icon: <FontAwesomeIcon icon={faCode} /> },
          description:
            "See Style Guide for more info on how to use FontAwesomeIcons. Adds icon in button",
        },
        {
          name: "Value + Icon",
          propPreview:
            '<ToggleButton icon={<FontAwesomeIcon icon={faCode}} value="code"/>',
          propCode: { icon: <FontAwesomeIcon icon={faCode} />, value: "code" },
          description:
            "See Style Guide for more info on how to use FontAwesomeIcons. Adds icon in button",
        },
        {
          name: "Alert",
          propPreview: "<ToggleButton alert/>",
          propCode: { alert },
          description: "Changes to alert mode (main coloring is red)",
        },
        {
          name: "onClick",
          propPreview: "<ToggleButton onClick={(data) => console.log(data)} />",
          propCode: { onClick: (data) => console.log(data) },
          description:
            "Function called when toggle button is clicked. Use with isSelected to change state on click",
        },
        {
          name: "Disabled",
          propPreview: "<Increment disabled />",
          propCode: { disabled },
          description: "Makes button not able to be used.",
        },
      ],
    },
    {
      name: "ToggleButtonGroup",
      id: "togglebuttongroup",
      code: ToggleButtonGroup,
      codePreview:
        "<ToggleButtonGroup> <ToggleButton/> <ToggleButton/> <ToggleButton/> </ToggleButtonGroup>",
      req_props: null,
      req_children: [
        React.createElement(ToggleButton),
        React.createElement(ToggleButton),
        React.createElement(ToggleButton),
      ],
      use: "This groups related Toggle buttons together.",
      props: [
        //     // {name: 'Width - Menu Panel',
        //     // propPreview: '<ToggleButtonGroup width="menu" />',
        //     // propCode: {width: 'menu'},
        //     // description: 'Sets width to fill menu panel width'},
        //     // {name: 'Width - Custom',
        //     // propPreview: '<ToggleButtonGroup width="500px" />',
        //     // propCode: {width: '500px'},
        //     // description: 'Sets width to custom dimensions'},
        {
          name: "Vertical",
          propPreview: "<ToggleButtonGroup vertical />",
          propCode: { vertical },
          description: "Aligns buttons vertically",
        },
      ],
    },
    {
      name: "Tooltip",
      id: "tooltip",
      code: Tooltip,
      codePreview: "<Tooltip/>",
      req_props: null,
      req_children: null,
      use: "Adds description of elements",
      props: [
        {
          name: "Icon",
          propPreview: "<Tooltip  icon={<FontAwesomeIcon icon={faCode}/>}> />",
          propCode: { icon: <FontAwesomeIcon icon={faCode} /> },
          description:
            "See Style Guide for more info on how to use FontAwesomeIcons. Changes icon in circle",
        },
        {
          name: "Text",
          propPreview: '<Tooltip text="This is the tooltip for a tooltip"/>',
          propCode: { text: "This is the tooltip for a tooltip" },
          description: "Changes text in textbox",
        },
      ],
    },
    {
      name: "UnitMenu",
      id: "unitmenu",
      code: UnitMenu,
      codePreview: '<UnitMenu units={["EM", "PT", "PX"]}/>',
      req_props: { units: ["EM", "PT", "PX"] },
      req_children: null,
      use: "Textfield with attached menu. Current application is displaying and changing units of values",
      props: [
        {
          name: "Value",
          propPreview: "<UnitMenu value=5 />",
          propCode: { value: 5, units: ["EM", "PT", "PX"] },
          description: "Sets value displayed",
        },
        {
          name: "Units",
          propPreview: '<UnitMenu units={["EM", "PT", "PX"]}/>',
          propCode: { units: ["EM", "PT", "PX"] },
          description:
            "Adds the units to the menu. Required for the component to work.",
        },
        {
          name: "Defaults",
          propPreview:
            '<UnitMenu units={["EM", "PT", "PX"]} defaults={["None", "Auto"]}/>',
          propCode: { units: ["EM", "PT", "PX"], defaults: ["None", "Auto"] },
          description:
            "Defaults are unitless values defined by us somewhere else. The word in the array will appear in the textfield and a - will appear on the main button.",
        },
        {
          name: "Label",
          propPreview:
            '<UnitMenu units={["EM", "PT", "PX"]} defaults={["None", "Auto"]} label="Label: ">',
          propCode: {
            units: ["EM", "PT", "PX"],
            defaults: ["None", "Auto"],
            label: "Label: ",
          },
          description:
            "Adds label in front of the component. Dragging on the label will increment the value.",
        },
        {
          name: "Vertical Label",
          propPreview:
            '<UnitMenu units={["EM", "PT", "PX"]} defaults={["None", "Auto"]} label="Label: " vertical>',
          propCode: {
            units: ["EM", "PT", "PX"],
            defaults: ["None", "Auto"],
            label: "Label: ",
            vertical,
          },
          description:
            "Adds label on top of the component. Dragging on the label will increment the value.",
        },
        {
          name: "Alert",
          propPreview:
            '<UnitMenu units={["EM", "PT", "PX"]} defaults={["None", "Auto"]} alert>',
          propCode: {
            units: ["EM", "PT", "PX"],
            defaults: ["None", "Auto"],
            alert,
          },
          description: "Changes color to red",
        },
        {
          name: "onChange",
          propPreview: "<UnitMenu onChange={(data) => console.log(data)} />",
          propCode: {
            onChange: (data) => console.log(data),
            units: ["EM", "PT", "PX"],
          },
          description: "Function called when data changes",
        },
        {
          name: "Disabled",
          propPreview: "<UnitMenu disabled />",
          propCode: { disabled, units: ["EM", "PT", "PX"] },
          description: "Makes button not able to be used.",
        },
      ],
    },
    {
      name: "VerticalDivider",
      id: "verticaldivider",
      code: VerticalDivider,
      codePreview: "<VerticalDivider/>",
      req_props: null,
      req_children: null,
      use: "Creates visual separation.",
      props: [
        {
          name: "Height",
          propPreview: '<VerticalDivider height="200px" />',
          propCode: {
            height: "200px",
          },
          description: "Changes height of divider",
        },
      ],
    },
  ];
  // === END OF DATA STRUCTURE SECTION ===

  //HOME PAGE
  function Home() {
    return (
      <div>
        <h1>Hi!</h1>
        <p>
          This is the UI Component Library. Here you can find information on all
          the the React UI Components.
        </p>
        <p style={{ display: "inline" }}>You will need </p>
        <p style={{ color: "blue", display: "inline" }}>
          import ComponentName from
          "../imports/PanelHeaderComponents/ComponentName.js"
        </p>
        <p style={{ display: "inline" }}>
          {" "}
          to add the component to a new file.
        </p>
      </div>
    );
  }

  //NEW COMPONENT PAGE
  function New() {
    return (
      <div>
        <h1>Features of A Standard Doenet Component</h1>
        <p>
          These are the guidelines for creating components for user input on
          Doenet. They are guidelines -- you can break them (and should if
          something looks ridiculous), but make sure you have a reason why you
          need to and that you can convince someone else of that reason. Once
          you’ve created or fixed a component, add the documentation for it to
          this file ../src/Tools/uiDocs.js and update the component spreadsheet
          <a
            href="https://docs.google.com/spreadsheets/d/16aaVroOz-l_DX3QGsVN9m-z0yE5LGFPH9HHLsUQKZCs/edit?usp=sharing"
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            here
          </a>
          .{" "}
        </p>
        <hr />

        <h2>Comments on Accessibility</h2>
        <p>
          All clickable elements need to have a focus indicator. Our standard is
          a 2px border that matches the element's current border with a 2px
          offset. See styling
          <a
            href="https://docs.google.com/document/d/16YDi2lUs6CjUYHfZBwjbBBtaWgJyY1uNbSRf3cj44D8/edit#bookmark=id.u2sku2msba84"
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            here{" "}
          </a>{" "}
        </p>
        <p>
          All clickable elements also need an aria-label. Some elements, like
          buttons, do this for you, so adding an additional aria-label is
          considered bad practice. The naming techniques and accessible name
          guidance sections will be the most helpful. Read more
          <a
            href="https://www.w3.org/WAI/ARIA/apg/practices/names-and-descriptions/"
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            here{" "}
          </a>
        </p>
        <p>
          All components must follow standard keyboard and aria practices for
          that specific element. Find the element you are working on here and
          add the required keyboard interactions and aria information that it
          lists. Here is the
          <a
            href="https://www.w3.org/WAI/ARIA/apg/patterns/"
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            link{" "}
          </a>
        </p>
        <hr />

        <h2>States to Consider (* denotes required)</h2>
        <p>
          *<i>disabled</i> - remove ability for user to interact with component,
          see styling
          <a
            href="https://docs.google.com/document/d/16YDi2lUs6CjUYHfZBwjbBBtaWgJyY1uNbSRf3cj44D8/edit#bookmark=id.997keaoy7se2"
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            here
          </a>
        </p>
        <p>
          *<i>alert</i> - if component requires user's attention, give red
          #C1292E border, see styling
          <a
            href="https://docs.google.com/document/d/16YDi2lUs6CjUYHfZBwjbBBtaWgJyY1uNbSRf3cj44D8/edit#bookmark=id.tptn3i5d03g0"
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            here
          </a>
        </p>
        <hr />

        <h2>Standard Props (* denotes required)</h2>
        <p>
          <i>width</i> = menu (235px) is the only option, otherwise the size
          should be a default based on input (text, icons, ...)
        </p>
        <p>
          <i>value</i> = information expected to be shown on component (text on
          Button)
        </p>
        <p>
          <i>icon</i> = small image that can be displayed, if it can show text -
          it can have an icon. More info
          <a
            href="https://docs.google.com/document/d/16YDi2lUs6CjUYHfZBwjbBBtaWgJyY1uNbSRf3cj44D8/edit#bookmark=id.lsq5rugnowwg"
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            here
          </a>
        </p>
        <p>
          <i>value + icon</i> = ability to have icon and value together
        </p>
        <p>
          <i>label</i> = text before componenet telling user what it is for,
          14px font size
        </p>
        <p>
          <i>vertical label</i> = ability to have label stack on top of
          component, label must be there for vertical label to work
        </p>
        <p>
          <i>placeholder</i> = default shown before user input
        </p>
        <p>
          *<i>margin</i> = default is 0px, make 4px left and right margin with
          2px bottom margin on label if prop margin
        </p>
        <p>
          *<i>aria-label</i> = built in HTML accessibility requirement
        </p>
        <p>
          <i>onClick</i> = you know what this is, don’t use callback function
        </p>
        <p>
          <i>onChange</i> = okay you probably know this as well, no callback
          function!
        </p>
        <p>
          <i>onBlur</i> = same idea
        </p>
        <p>
          <i>onKeyDown</i> = same thing here
        </p>
        {/* <p>
          <i>onHover</i> = you can guess this, see
          <a
            href="https://docs.google.com/document/d/16YDi2lUs6CjUYHfZBwjbBBtaWgJyY1uNbSRf3cj44D8/edit#bookmark=id.4fxdjra8uv4t"
            target="_blank"
          >
            {' '}
            here{' '}
          </a>
        </p> */}
        {/* <p>
          <i>onFocus</i> = yeah, you know this, too; styling shown
          <a
            href="https://docs.google.com/document/d/16YDi2lUs6CjUYHfZBwjbBBtaWgJyY1uNbSRf3cj44D8/edit#bookmark=id.u2sku2msba84"
            target="_blank"
          >
            {' '}
            here{' '}
          </a>
        </p> */}
        <hr />

        <h2>Comments on Styling</h2>
        <p>
          Only use the colors found on the
          <a
            href="https://docs.google.com/document/d/16YDi2lUs6CjUYHfZBwjbBBtaWgJyY1uNbSRf3cj44D8/edit#bookmark=id.i1tjp0kzqemb"
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            Style Guide!!{" "}
          </a>{" "}
          (Unless you've talked to Clara or Kevin about it...)
        </p>
        <p>
          Give it a border or a color, as shown
          <a
            href="https://docs.google.com/document/d/16YDi2lUs6CjUYHfZBwjbBBtaWgJyY1uNbSRf3cj44D8/edit#bookmark=id.53fu07uoic4t"
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            here{" "}
          </a>
        </p>
        <p>
          Don’t apply the font to the component, fonts will be called in the
          Tool that loads it
        </p>
      </div>
    );
  }

  //COMPONENT PAGES
  function Components() {
    const { componentId } = useParams();
    const component = dataStructure.find(({ id }) => id === componentId);
    var display = component.code;
    var children = component.req_children;

    //PROPS SECTION
    function Props(component) {
      if (component.props) {
        return component.props.map(
          ({ name, propPreview, propCode, description }) => (
            <div key={name}>
              <h3 key={name}>{name}</h3>
              <p key={name + "code"} style={{ color: "blue" }}>
                {propPreview}
              </p>
              <p key={description}>{description}</p>
              {React.createElement(display, propCode, children)}
            </div>
          ),
        );
      } else {
        return <p>Nothing to see here</p>;
      }
    }
    return (
      <div>
        <h1>{component.name}</h1>
        <p style={{ color: "blue" }}>{component.codePreview}</p>
        {React.createElement(
          display,
          component.req_props,
          component.req_children,
        )}

        <hr />

        <h2>Why would I use this?</h2>
        <p>{component.use}</p>

        <hr />

        <h2>Props</h2>
        {Props(component)}
      </div>
    );
  }

  //CENTRAL LAYOUT
  function Layout() {
    return (
      <>
        <NavBar>
          <div style={{ marginLeft: "10px" }}>
            <h1>Components</h1>
            {actionResult == "" ? null : (
              <>
                <p data-test="action result">{actionResult}</p>
                <button
                  onClick={() => setActionResult("")}
                  data-test="clear action result"
                >
                  Clear actionResult
                </button>
              </>
            )}
            {/* <SearchBar width='110px'/> */}
          </div>
          <h3>
            <Link to={`new_components`} style={{ color: "black" }}>
              New Component Guidelines
            </Link>
          </h3>
          <List>
            {dataStructure.map(({ name, id }) => (
              <li key={id} data-test={`componentLink${id}`}>
                <Link to={`component/${id}`} style={{ color: "black" }}>
                  {name}
                </Link>
              </li>
            ))}
          </List>
        </NavBar>
        <Content>
          <Outlet />
        </Content>
      </>
    );
  }

  //ROUTER SECTION
  return (
    <Router basename="/src/Tools">
      <Routes>
        <Route path="/uiDocs" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path={`new_components`} element={<New />} />
          <Route path={`component/:componentId`} element={<Components />} />
        </Route>
      </Routes>
    </Router>
  );
}
