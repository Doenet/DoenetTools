import React, { useState } from "react";

import "./Switch.css";

function randomAlphaString(len) {
  let c = "abcdefghijklmnopqrstuvwxyz";
  let str = "";
  for (let i = 0; i < len; i++) {
    str += c[Math.round(Math.random() * 25)];
  }
  return str;
}

export default function Switch(props) {
  // props
  let id = props.id;
  if (!id) {
    // we must (should) have an id
    id = randomAlphaString(20); // a random name and id will be chosen if there is no id name is specified.
  }
  let name = props.name;

  // Section: states
  let [checked, setChecked] = useState(props.checked || false); // will be undefined if not specified which will show up like an empty string.

  let checkbox;

  if (checked) {
    checkbox = (
      <input
        type="checkbox"
        onChange={e => {
          setChecked(e.target.checked);
          props.onChange(e);
        }}
        id={id}
        name={name}
        key={id}
        checked
      />
    );
  } else {
    checkbox = (
      <input
        type="checkbox"
        onChange={e => {
          setChecked(e.target.checked);
          props.onChange(e);
        }}
        id={id}
        name={name}
        key={id}
        checked={false}
      />
    );
  }

  return (
    <div className={(props.className || "") + " switch"} key={id + "container"}>
      {checkbox}
      <label key={id + "label"} htmlFor={id}>
        {props.children}
      </label>
    </div>
  );
}
