import React from 'react';
import SearchBar from "../imports/PanelHeaderComponents/SearchBar.js";
import Textfield from "../imports/PanelHeaderComponents/Textfield.js";
import VerticalDivider from "../imports/PanelHeaderComponents/VerticalDivider.js";
import Button from "../imports/PanelHeaderComponents/Button.js";
import ActionButton from "../imports/PanelHeaderComponents/ActionButton.js";
// import ActionButtonGroup from "../imports/PanelHeaderComponents/ActionButtonGroup.js";
import ToggleButton from "../imports/PanelHeaderComponents/ToggleButton.js";
import ProgressBar from "../imports/PanelHeaderComponents/ProgressBar.js";
import styled, { ThemeProvider } from 'styled-components';
import ActionButtonGroup from "../imports/PanelHeaderComponents/ActionButtonGroup.js";
import UnitMenu from "../imports/PanelHeaderComponents/UnitMenu.js";

export default function attempt() {
return (
<>
<ActionButtonGroup>
  <ActionButton text='X'></ActionButton>
  <ActionButton text='Y'></ActionButton>
  <ActionButton text='Z'></ActionButton>
</ActionButtonGroup>
</>
);
};

