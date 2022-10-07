import React from 'react';
import styled, { ThemeProvider } from 'styled-components';

const Container = styled.div`
  display: ${(props) => props.vertical ? 'static' : 'flex'};
  width: ${props => (props.width == 'menu' ? 'var(--menuWidth)' : '')};
  // margin: 2px 0px 2px 0px
`;

export default function ButtonGroup(props) {
    const buttonGroup = {
        margin: '0px 2px 0px 2px',
        borderRadius: '0',
        padding: '0px 12px 0px 10px'
    }; 

    const verticalButtonGroup = {
      margin: '4px 4px 4px 4px',
      borderRadius: '0',
      padding: '0px 10px 0px 10px'
    }; 

    let elem = React.Children.toArray(props.children);
    // if (elem.length > 1) {
    //   elem = [React.cloneElement(elem[0], {num: 'first'})]
    //     .concat(elem.slice(1,-1))
    //     .concat(React.cloneElement(elem[elem.length - 1], {num: 'last'}));
    // }
    return (
      <Container vertical={props.vertical} width={props.width}>
        <ThemeProvider theme={props.vertical ? verticalButtonGroup : buttonGroup}>{elem}</ThemeProvider>
      </Container>
      
    )
  };
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
