import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom';


function DynamicLoad(props){

  // return <p>short</p>

  const One = lazy(() => import("./one.jsx"));
  const Two = lazy(() => import("./two.jsx"));
  const Three = lazy(() => import("./three.jsx"));

  return <>
  <Suspense fallback={<div>Components are Loading...</div>}>
    <One />
    <Two />
    <Three />
  </Suspense>
  <p>Normal stuff</p>
  </>
}

ReactDOM.render(
  <React.StrictMode>
    <DynamicLoad />
  </React.StrictMode>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
