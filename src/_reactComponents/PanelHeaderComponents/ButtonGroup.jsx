import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled, { ThemeProvider } from 'styled-components';



export default function ButtonGroup(props) {
    const buttonGroup = {
        margin: "0px 2px 0px 2px",
        borderRadius: '0',
        padding: '0px 12px 0px 10px'
      };

    // if (props.width) {
    //   if (props.width === "menu") {
    //     actionGroup.width = '235px'
    //   } else {
    //     actionGroup.width = props.width
    //   }
    // }
    let elem = React.Children.toArray(props.children);
    // if (elem.length > 1) {
    //   elem = [React.cloneElement(elem[0], {num: 'first'})]
    //     .concat(elem.slice(1,-1))
    //     .concat(React.cloneElement(elem[elem.length - 1], {num: 'last'}));
    // }
    return (
      <ThemeProvider theme={buttonGroup}>{elem}</ThemeProvider>
    )
  }
// export default function ButtonGroup(props) {
//     const defaultValue = props.data.filter(d => d.default)[0].value;
//     let [currentValue, setCurrentValue] = useState(defaultValue);
//     const handleClick = function (value) {
//         setCurrentValue(value);
//         props.clickCallBack(value);
//     }

//     return (
//         <div style={{ border: '1px solid grey', width: '55px', height: '23px', borderRadius: '5px', padding: '1px', display: 'flex', alignItems: 'center' }}>
//             {props.data.map((d,i) =>
//                 <button key={i} style={{ backroundColor: "transperant", borderRadius: '5px', border: 'none', cursor: 'pointer', outline: 'none', width: '50%', height: '18px', backgroundColor: currentValue === d.value ? '#E2E2E2' : 'white' }}>
//                     <FontAwesomeIcon onClick={() => { handleClick(d.value) }} icon={d.icon} style={{ fontSize: '15px' }} />
//                 </button>
//             )}
//         </div>
//     );
// }
