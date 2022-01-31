import React, { useState ,useRef, useEffect} from 'react';
import { doenetComponentForegroundInactive, doenetComponentForegroundActive } from "./theme.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
// import TextArea 

export default function Form(props) {
    // const [textTerm, setTextTerm] = useState("")
    const [text, setText] = useState(props.value ? props.value : "")
    const [cancelShown, setCancelShown] = useState('hidden')
    const [formwidth,setformWidth] = useState('0px')
    const [labelVisible, setLabelVisible] = useState(props.label ? 'static' : 'none')
    const [align, setAlign] = useState(props.vertical ? 'static' : 'flex');
    const [cursorStart, setCursorStart] = useState(0);
    const [cursorEnd, setCursorEnd] = useState(0);
    const inputRef = useRef(null);

    let cleared = false;

    const formRef = useRef(0)
      useEffect(()=>{
        if(formRef && props.submitButton)  {
          let button = document.querySelector('#submitButton');
         setTimeout(function() { setformWidth(button.clientWidth); }, 1000);

        }
        // clearInput();
        // setText(props.value);
      },[formRef,props])

      useEffect(() => {
        inputRef.current.selectionStart = cursorStart;
        inputRef.current.selectionEnd = cursorEnd;
      })
    var textfield = {
        margin: `0px -${formwidth}px 0px 0px`,
        height: '24px',
        border: `2px solid black`,
        borderRadius: '5px',
        position: 'relative',
        padding: '0px 30px 0px 5px',
        color: '#000',
        overflow: 'hidden',
        width: '175px',
        resize:'none',
        alignItems:'center',
        // placeholder:'Enter Text here',
        value: `${text}`,
        whiteSpace: 'nowrap',
        outline:'none',
        fontFamily:"Open Sans",
        fontSize: '14px',
        lineHeight: '20px',
       }
       var container = {
        display: `${align}`, 
        width: '235px',
        alignItems:'center',
    }
    var tableCellContainer = {

    }     
    var cancelButton = {
        float: 'right',
        margin: '5px 0px 0px -30px',
        position: 'absolute',
        zIndex: '4',
        border: '0px',
        backgroundColor: 'transparent',
        visibility: `${cancelShown}`,
        color: '#000',
        overflow: 'hidden',
        outline: 'none'
    }
    var submitButton = {
        position: 'absolute',
        display: 'inline',
        margin: `0px -5px 0px -5px`,
        zIndex: '2',
        height: '28px',
        border: `2px solid black`,
        borderRadius: '0px 5px 5px 0px',
        backgroundColor: `${doenetComponentForegroundActive}`,
        color: '#FFFFFF',
        cursor: 'pointer',
        fontSize: '12px',
        overflow: 'hidden',
    }
    var label = {
      value: 'Label:',
      fontSize: '14px',
      marginRight: '5px',
      display: `${labelVisible}`,
      margin: '0px 5px 2px 0px'
    }
    var disable = "";
    if (props.disabled) {
        submitButton.backgroundColor = '#e2e2e2';
        submitButton.color = 'black';
        submitButton.cursor = 'not-allowed';
        textfield.cursor = 'not-allowed';
        disable = "disabled";
    }

    if (props.width) {
        if (props.width === "menu") {
          container.width = '235px';
          textfield.width = '100px';
          if(props.submitButton){
            container.width = '235px';
            textfield.width = 'auto';
          }
          if(props.label ){
            container.width = '235px';
            textfield.width = 'auto';
          }
        } 
      }
      
  if (props.value) {
      textfield.value = props.value;
  }
  if (props.placeholder) {
    textfield.placeholder = props.placeholder;
  }
  if (props.label) {
    label.value = props.label;
  }
  if (props.alert) {
    textfield.border = '2px solid #C1292E';
    submitButton.border = '2px solid #C1292E';
  }
  if (props.ariaLabel) {
    textfield.ariaLabel = props.ariaLabel;
  }
  function handleChange(e) {
    if (cleared) {
      setText("");
    } else {
      setText(e.target.value)
      cleared = false;
    }

    if (props.onChange) props.onChange(e.target.value)
    setCursorStart(e.target.selectionStart);
    setCursorEnd(e.target.selectionEnd);
  }
  function handleClick(e) {
    if (props.onClick) props.onClick(e) 
  }
    function clearInput(e) {
      if (props.clearInput) props.clearInput(e)
      setCancelShown('hidden')
      cleared = true;
      handleChange(e);
    }
    function changeTextTerm() {
        // setTextTerm(textfield.value)
        setCancelShown('visible')
        console.log("cancelShown", cancelShown)
    }
  function handleBlur(e) {
    if (props.onBlur) props.onBlur(e)
  }
  function handleKeyDown(e) {
    if (props.onKeyDown) props.onKeyDown(e)
    console.log("cancelShown", cancelShown)
  }

  let clearButton = null;
  if (props.clearInput) {
    clearButton = 
    <button
      id="clearButton"
      style={cancelButton}
      onClick={(e) => {
        clearInput(e);
      }}
    >
      <FontAwesomeIcon icon={faTimes} />
    </button>
  }

    return (
      <>
        <div style={container}>

          <p style={label}>{label?.value}</p>

          <div
          style={tableCellContainer}
          // onClick={() => { clearInput()}}
        >
          <input
            id="textarea"
            value={text}
            placeholder={textfield.placeholder}
            type="text"
            ref={inputRef}
            style={textfield}
            onKeyUp={() => {
              changeTextTerm();
            }}
            onChange={(e) => {
              handleChange(e);
            }}
            onBlur={(e) => { handleBlur(e) }}
            onKeyDown={(e) => { handleKeyDown(e) }}
            disabled={disable}
            aria-label={textfield.ariaLabel}
          />
          {clearButton}
          <button
            id="submitButton"
            style={submitButton}
            ref={formRef}
            onClick={(e) => { handleClick(e) }}
          >
            {props.submitButton ? props.submitButton : 'Submit'}
          </button>
        </div>
        </div>


      </>
    );
}