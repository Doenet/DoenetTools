import React, { lazy, Suspense, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
// import axios from 'axios';


// function DynamicLoad(props) {

//   let [components,setComponents] = useState([])

//   useEffect(()=>{
//       let loader = import("/renderers/one.js")
//       loader.then((resp)=>{
//         const one = resp.default({text:'this is from static path'});
//         setComponents([<React.Fragment key='1'>{one}</React.Fragment>])
//       })

//   },[])

//   // let loader = import("/temp/one.js")
//   // loader.then((resp)=>{
//   //   // console.log(">>>resp",resp.default(3));
//   //   const component = resp.default;
//   //   console.log(">>>component",component)
//   //   setComponents([<>{component}</>])
//   // })


//   // const One = lazy(() => import('./one.jsx'));
//   // const Two = lazy(() => import('./two.jsx'));

//   // axios.get('/api/test.php').then((resp) => console.log('>>>resp', resp.data));

//   return (
//     <>
//       {/* <div>{loaded}</div> */}
//       {/* <Suspense fallback={<div>Components are Loading...</div>}>
//         <One />
//         <Two />
//       </Suspense> */}
//       {/* <Suspense fallback={<div>Three is Loading...</div>}>
//         <Three />
//       </Suspense> */}

//       {components}
//       <p>This is a p tag</p>
//     </>
//   );
// }

  // <DynamicLoad />,

ReactDOM.render(
  <p>temp</p>,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
