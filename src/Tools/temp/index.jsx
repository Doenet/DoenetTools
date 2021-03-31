import React, { lazy, Suspense, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

function One(props){
  return <div>This is One</div>
}

function DynamicLoad(props) {
  // return <p>short</p>

  let [components,setComponents] = useState([])

  useEffect(()=>{
      let loader = import("/renderers/one.js")
      loader.then((resp)=>{
        // console.log(">>>resp",resp.default(3));
        const one = resp.default({text:'this is from static path'});
        // console.log(">>>one",one)
        setComponents([<React.Fragment key='1'>{one}</React.Fragment>])
      })
        // const one2 = <One />
        // console.log(">>>one2",one2)
        // setComponents([<>{one}</>])

  },[])

  // let loader = import("/temp/one.js")
  // loader.then((resp)=>{
  //   // console.log(">>>resp",resp.default(3));
  //   const component = resp.default;
  //   console.log(">>>component",component)
  //   setComponents([<>{component}</>])
  // })


  // const One = lazy(() => import('./one.jsx'));
  // const Two = lazy(() => import('./two.jsx'));

  // axios.get('/api/test.php').then((resp) => console.log('>>>resp', resp.data));

  return (
    <>
      {/* <div>{loaded}</div> */}
      {/* <Suspense fallback={<div>Components are Loading...</div>}>
        <One />
        <Two />
      </Suspense> */}
      {/* <Suspense fallback={<div>Three is Loading...</div>}>
        <Three />
      </Suspense> */}

      {/* <ShowChildren children={[<p>test</p>]} /> */}
      <ShowChildren children={components} />

      <p>This is a p tag</p>
    </>
  );
}

function ShowChildren(props){

  return <>
  {props.children}
  </>
}



ReactDOM.render(
  <DynamicLoad />,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
