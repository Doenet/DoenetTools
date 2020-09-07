import React from 'react';
import Textfield from "../imports/PanelHeaderComponents/Textfield.js";
import SearchBar from "../imports/PanelHeaderComponents/SearchBar.js";
import VerticalDivider from "../imports/PanelHeaderComponents/VerticalDivider.js";
import Button from "../imports/PanelHeaderComponents/Button.js";
import ActionButton from "../imports/PanelHeaderComponents/ActionButton.js";
import ToggleButton from "../imports/PanelHeaderComponents/ToggleButton.js";

export default function attempt() {
return (
<div>
  <p>Button</p>
  <Button/>
  <p>ToggleButton</p>
  <ToggleButton/>
  <p>ActionButton</p>
  <ActionButton/>
  <p>textfield</p>
  <Textfield/>
  <p>searchbar</p>
  <SearchBar/>
  
</div>
);
};

