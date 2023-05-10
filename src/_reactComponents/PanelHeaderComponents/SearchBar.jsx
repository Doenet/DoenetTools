import React from "react";
import {
  Icon,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
} from "@chakra-ui/react";
import { IoSearchSharp } from "react-icons/io5";

export default function Searchbar({ name = "q", defaultValue, dataTest }) {
  return (
    <>
      <InputGroup borderLeftRadius={5} size="sm">
        <InputLeftElement pointerEvents="none">
          <Icon as={IoSearchSharp} color="gray.600" />
        </InputLeftElement>
        <Input
          type="text"
          placeholder="Search..."
          border="1px solid #949494"
          borderLeftRadius={5}
          name={name}
          data-test={dataTest}
          defaultValue={defaultValue}
        />
        <InputRightAddon
          p={0}
          border="none"
          borderLeftRadius={0}
          borderRightRadius={5}
        >
          <Button
            type="submit"
            size="sm"
            borderLeftRadius={0}
            borderRightRadius={5}
            border="1px solid #949494"
            bg="doenet.mainBlue"
          >
            Search
          </Button>
        </InputRightAddon>
      </InputGroup>
    </>
  );
}

// const SearchBar = styled.input `
//     margin: 0px -${props => props.inputWidth}px 0px 0px;
//     height: 24px;
//     border: ${props => props.alert ? '2px solid var(--mainRed)' : 'var(--mainBorder)'};
//     border-radius: var(--mainBorderRadius);
//     position: relative;
//     padding: 0px 70px 0px 30px;
//     color: var(--canvastext);
//     overflow: hidden;
//     width: ${props => props.width === 'menu' ? (props.noSearchButton ? '180px' : '130px') : '220px'};
//     font-size: 14px;
//     cursor: ${props => props.disabled ? 'not-allowed' : 'auto'};
//     &:focus {
//         outline: 2px solid ${props => props.alert ? 'var(--mainRed)' : 'var(--canvastext)'};
//         outline-offset: 2px;
//     }
// `;

// const CancelButton = styled.button `
//     float: right;
//     margin: 6px 0px 0px ${props => props.marginLeft}px;
//     // margin: '6px 0px 0px 172px',
//     position: absolute;
//     z-index: 2;
//     border: 0px;
//     background-color: var(--canvas);
//     visibility: ${props => props.cancelShown};
//     color: var(--canvastext);
//     overflow: hidden;
//     outline: none;
//     border-radius: 5px;
//     &:focus {
//         outline: 2px solid var(--canvastext);
//     }
// `;

// const SubmitButton = styled.button `
//     position: absolute;
//     display: inline;
//     margin: 0px 0px 0px -60px;
//     z-index: 2;
//     height: 28px;
//     border: ${props => props.alert ? '2px solid var(--mainRed)' : "var(--mainBorder)"};
//     background-color: ${props => props.disabled ? 'var(--mainGray)' : 'var(--mainBlue)'};
//     color: ${props => props.disabled ? 'var(--canvastext)' : 'var(--canvas)'};
//     border-radius: 0px 5px 5px 0px;
//     cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
//     font-size: 12px;
//     overflow: hidden;

//     &:hover {
//         color: var(--canvastext);
//         background-color: ${props => props.disabled ? 'var(--mainGray)' : 'var(--lightBlue)'};
//     }

//     &:focus {
//         outline: 2px solid ${props => props.alert ? 'var(--mainRed)' : 'var(--canvastext)'};
//         outline-offset: 2px;
//     }
// `;

// const Label = styled.p `
//     font-size: 14px;
//     display: ${props => props.labelVisible};
//     margin: 0px 5px 2px 0px;
// `;

// const Container = styled.div `
//     display: ${props => props.align};
//     width: ${props => props.width === 'menu' ? 'var(--menuWidth)' : '220px'};
//     align-items: center;
// `;

// const [searchTerm, setSearchTerm] = useState('');
// const [cancelShown, setCancelShown] = useState('hidden');
// const labelVisible = props.label ? 'static' : 'none';
// const align = props.vertical ? 'static' : 'flex';
// // const [inputWidth, setInputWidth] = useState('0px');
// const [marginLeft, setMarginLeft] = useState(props.noSearchButton ? 80 : 26);
// const alert = props.alert ? props.alert : null;

// const searchBarRef = useRef(0)
// useEffect(()=>{
//   if(searchBarRef)  {
//     let searchBar = document.querySelector('#searchbar');
//     let inputWidth = searchBar.clientWidth;
//    setTimeout(function() { setMarginLeft(inputWidth - (props.noSearchButton ? 23 : 77) - (props.width ? 90 : 0)); }, 1000);
//   //  console.log((240 - buttonWidth) + 'px');

//   }

// },[searchBarRef,props])

// var searchIcon = {
//     margin: '6px 0px 0px 6px',
//     position: 'absolute',
//     zIndex: '1',
//     color: 'var(--canvastext)',
//     overflow: 'hidden'
// };

// var disable = "";
// if (props.disabled) {
//     disable = "disabled";
// };

// var searchButton =
// <SubmitButton
//     disabled={disable}
//     alert={alert}
//     onClick={searchSubmitAction}>
//     Search
// </SubmitButton>

// var width = "";
// if (props.width) {
//     width = props.width;
// };

// if (props.noSearchButton) {
//     searchButton = '';
// };

// var placeholder = "Search...";
// if (props.placeholder) {
//     placeholder = props.placeholder;
// };

// var label = "";
// if (props.label) {
//     label = props.label;
// };

// let autoFocus = false;
// if (props.autoFocus) {
//     autoFocus = true;
// };

// function clearInput() {
//     setSearchTerm('');
//     setCancelShown('hidden')
//     if (props.onChange){
//         props.onChange('');
//     }
// };

// function onChange(e) {
//     let val = e.target.value;
//     setSearchTerm(val);
//     if (val === ""){
//         setCancelShown('hidden')
//     } else {
//         setCancelShown('visible')
//     }
//     if (props.onChange){
//         props.onChange(val);
//     }
// };

// function handleBlur(e) {
//     if (props.onBlur) props.onBlur(e)
// };

// function handleKeyDown(e) {
//     if (props.onKeyDown) props.onKeyDown(e)
// };

// function searchSubmitAction() {
//     if (props.onSubmit){
//         props.onSubmit(searchTerm);
//     }
// };

// return (
//     <Container align={align} width={width}>
//         <Label id="search-label" labelVisible={labelVisible} align={align}>{label}</Label>
//         <div style={{display: "table-cell"}} >
//             <FontAwesomeIcon icon={faSearch} style={searchIcon}/>
//             <CancelButton
//                 aria-label="Clear"
//                 ref={searchBarRef}
//                 cancelShown={cancelShown}
//                 marginLeft={marginLeft}
//                 // cancelLeftMargin={cancelLeftMargin}
//                 onClick={() => { clearInput() }} >
//                 <FontAwesomeIcon icon={faTimes}/>
//             </CancelButton>
//             <SearchBar
//                 id="searchbar"
//                 type="text"
//                 width={width}
//                 noSearchButton={props.noSearchButton}
//                 placeholder={placeholder}
//                 onChange={onChange}
//                 onBlur={(e) => { handleBlur(e) }}
//                 onKeyDownCapture={(e) => { handleKeyDown(e) }}
//                 disabled={disable}
//                 alert={alert}
//                 value={searchTerm}
//                 onKeyDown={(e)=>{if (e.key === 'Enter' || e.key === "Spacebar" || e.key === " "){searchSubmitAction()}}}
//                 autoFocus={autoFocus}
//                 aria-labelledby="search-label"
//                 aria-disabled={props.disabled ? true : false}
//             />
//             <div style={{padding: '3px', display:'inline'}}></div>
//             {searchButton}
//         </div>
//     </Container>
// )
// export const SearchBar = () => {
