import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';


ReactDOM.render(
  <React.StrictMode>
    <p>test</p>
  </React.StrictMode>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
