import React from "react";
import { useLocation } from "react-router-dom";

export default function NotFound(props) {
  // console.log(">>>===NotFound")
  const location = useLocation();

  let urlParamsObj = Object.fromEntries(new URLSearchParams(location.search));
  return (
    <div style={props.style}>
      <h1>Sorry! &quot;{urlParamsObj?.path}&quot; was not found.</h1>
    </div>
  );
}
