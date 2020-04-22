import React, { forwardRef } from "react";
import "./styles.css";

export default forwardRef(({ children, heading, classes }, ref) => {
  return (
    <div ref={ref} className={classes}>
      <h3>{heading}</h3>
      <div className="body">{children}</div>
    </div>
  );
});
