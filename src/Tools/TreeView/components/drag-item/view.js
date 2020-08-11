import React, { forwardRef } from "react";
import "./styles.css";

export default forwardRef(({ children, styles, classValue }, ref) => {
  return (
    <div className={`${classValue}`} style={styles} ref={ref}>
      {children}
    </div>
  );
});
