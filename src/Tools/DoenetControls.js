import React from 'react';
import SearchBar from "../imports/PanelHeaderComponents/SearchBar.js";
import Textfield from "../imports/PanelHeaderComponents/Textfield.js";
import VerticalDivider from "../imports/PanelHeaderComponents/VerticalDivider.js";
import Button from "../imports/PanelHeaderComponents/Button.js";
import ActionButton from "../imports/PanelHeaderComponents/ActionButton.js";
import ToggleButton from "../imports/PanelHeaderComponents/ToggleButton.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCode, faFish } from '@fortawesome/free-solid-svg-icons';

export default function attempt() {
return (
<div>
  <h1>DoenetControls</h1>
  <p>This is how all of the Panel Header Components look. It also has all of the props you can give them and how they work!</p>

  <h2>Calling Components</h2>
  <p style={{display: "inline"}}>You will need </p>
  <p style={{color: "blue", display: "inline"}}>import ComponentName from "../imports/PanelHeaderComponents/ComponentName.js"</p>
  <p style={{display: "inline"}}> to add the component to a new file.</p>
  <br></br>
  <p style={{display: "inline"}}>To call the component, use </p>
  <p style={{color: "blue", display: "inline"}}>ComponentName</p>
  <p style={{display: "inline"}}> within standard html tags. Using a self-closing tag is the easiest!! The ComponentName is the underlined header at the start of each section.</p>
  <br/>

  <h2><u>ActionButton</u></h2>
  <p>This is the simpler button styling. See Button below for another option.</p>
  <ActionButton/>

  <h3>Size</h3>
  <p style={{color: "blue"}}>size="medium"</p>
  <p>The default is small, as shown above.</p>
  <ActionButton size="medium"/>

  <h3>Text</h3>
  <p style={{color: "blue"}}>text="Edit"</p>
  <ActionButton text="Edit" />

  <h3>Placement</h3>
  <p>These buttons look good next to each other.</p>
  <ActionButton text="Edit"/>
  <ActionButton text="Add"/>
  <ActionButton text="Delete"/>
  
  <h2><u>Button</u></h2>
  <p>This style is more eye-catching. It is meant to be used when you want the user to do this thing! Click this button here!!</p>
  <Button/>
  
  <h3>Size</h3>
  <p style={{color: "blue"}}>size="medium"</p>
  <p>The default is small, as shown above.</p>
  <Button size="medium"/> 

  <h3>Text</h3>
  <p style={{color: "blue"}}>text="This button is amazing!!!"</p>
  <p>This prop changes the text on the button.</p>
  <Button text="This button is amazing!!!"/>

  {/* <h2><u>ProgressBar</u></h2>
  <p>Shows current progress</p>
  <p>Donut is on infinite loop</p>
  <ProgressBar percent='5'/> */}

  <h2><u>SearchBar</u></h2>
  <p>Used for finding things.</p>
  <p>The x works for clearing the bar.</p>
  <SearchBar/>

  <h2><u>Textfield</u></h2>
  <p>This is where you can enter text.</p>
  <Textfield/>

  <h3>Size</h3>
  <p style={{color: "blue"}}>size="medium"</p>
  <p>The default is small, as shown above.</p>
  <Textfield size="medium"/>

  <h3>Text</h3>
  <p style={{color: "blue"}}>text="Enter cat names"</p>
  <Textfield text="Enter cat names" />

  <h2><u>ToggleButton</u></h2>
  <p>This button is used to show if something is on/selected. It could show the user what mode they are in.</p>
  <ToggleButton/>

  <h3>Size</h3>
  <p style={{color: "blue"}}>size="medium"</p>
  <p>The default is always small, as shown above.</p>
  <ToggleButton size="medium"/> 

  <h3>Text</h3>
  <p style={{color: "blue"}}>text="Select me"</p>
  <ToggleButton text="Select me" />

  <h3>isSelected</h3>
  <p style={{color: "blue"}}>isSelected</p>
  <p>If added, starts the button in selected state.</p>
  <ToggleButton isSelected/>

  <h3>Switch Text</h3>
  <p style={{color: "blue"}}>switch_text="frog"</p>
  <p>Text changes to this value when selected.</p>
  <ToggleButton switch_text="frog"/>

  <h3>Label</h3>
  <p style={{color: "blue"}}>label="What: "</p>
  <p>Adds label to button</p>
  <ToggleButton label="What: "/>

  <h3>Icon</h3>
  <p style={{color: "blue"}}>Import ( faCode ) from '@fortawesome/free-solid-svg-icons'</p>
  <p style={{color: "blue"}}>icon=(*FontAwesomeIcon icon=(faCode)/*)</p>
  <p style={{color: "blue"}}>* is less than and greater than for HTML tags and ( is the curly bracket. If I wrote it in that notation, it appears like this: {<FontAwesomeIcon icon={faCode}/>}</p>
  <p>See <a target="_blank" href="https://docs.google.com/document/d/16YDi2lUs6CjUYHfZBwjbBBtaWgJyY1uNbSRf3cj44D8/edit">Style Guide</a> for more info on how to use FontAwesomeIcons</p>
  <p>Adds icon in button</p>
  <ToggleButton icon={<FontAwesomeIcon icon={faCode}/>}/>

  <h3>Icon and Text</h3>
  <p style={{color: "blue"}}>icon=(*FontAwesomeIcon icon=(faFish)/*) text="Fish"</p>
  <p style={{color: "blue"}}>See Icon above for proper formatting.</p>
  <p>Adds icon with text to button</p>
  <ToggleButton icon={<FontAwesomeIcon icon={faFish}/>} text="Fish"/>

  <h2><u>VerticalDivider</u></h2>
  <p>Creates visual separation. It is only avaliable vertical and at this size currently.</p>
  <VerticalDivider/>
  
</div>
);
};