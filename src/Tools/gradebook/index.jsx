import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <h1>This is Gradebook Tool</h1>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
