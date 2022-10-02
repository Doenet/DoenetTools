import React from 'react';
import Select from 'react-select';
import styled from 'styled-components';

const Container = styled.div `
    display: ${props => props.align};
    align-items: center;
`;

const Label = styled.p `
    font-size: 14px;
    display: ${props => props.labelVisible};
    margin-right: 5px;
    margin-bottom: ${props => props.align == 'flex' ? 'none' : '2px'};
`;

const DropdownMenu = (props) => {
  // console.log('right ', props.right);
  const customStyles = {
    option: (provided, state) => {
      return {
        ...provided,
        color: 'var(--canvastext)',
        backgroundColor: state.isFocused ? 'var(--lightBlue)' : state.isSelected ? 'var(--mainGray)' : 'var(--canvas)',
        ':active': { backgroundColor: 'var(--canvas)' },
      };
    },
    menu: (provided, state) => ({
      ...provided,
      width: state.selectProps.width,
      maxHeigh: state.selectProps.maxMenuHeight,
      overflow: 'scroll',
      color: 'var(--canvastext)',
      backgroundColor: state.isFocused ? 'var(--lightBlue)' : state.isSelected ? 'var(--mainGray)' : 'var(--canvas)',
      ':active': { backgroundColor: 'var(--canvas)' },
    }),
    container: (provided, state) => ({
      ...provided,
      position: props.absolute ? 'absolute' : 'relative',
      top: props.absolute && props.top ? props.top : null,
      right: props.absolute && props.right ? props.right : null,
      left: props.absolute && props.left ? props.left : null,
      bottom: props.absolute && props.bottom ? props.bottom : null,
      color: 'var(--canvastext)',
      // backgroundColor: state.isFocused ? 'var(--lightBlue)' : state.isSelected ? 'var(--mainGray)' : 'var(--canvas)',
      ':active': { backgroundColor: 'var(--canvas)' },
      //   left: props.absolute && props.left ? props.left : null,
      //   top: props.absolute && props.top ? props.top : null,
      
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      height: '20px',
      color: 'var(--canvastext)',
      backgroundColor: state.isFocused ? 'var(--lightBlue)' : state.isSelected ? 'var(--mainGray)' : 'var(--canvas)',
      ':active': { backgroundColor: 'var(--canvas)' },
      // padding: '0 6px',
      
    }),
    indicatorsContainer: (provided, state) => ({
      ...provided,
      height: '20px',
      color: 'var(--canvastext)',
      backgroundColor: state.isFocused ? 'var(--lightBlue)' : state.isSelected ? 'var(--mainGray)' : 'var(--canvas)',
      ':active': { backgroundColor: 'var(--canvas)' },
    }),
    singleValue: (provided, state) => {
      return {
        ...provided,
        color: 'var(--canvastext)',
        backgroundColor: state.isFocused ? 'var(--lightBlue)' : state.isSelected ? 'var(--mainGray)' : 'var(--canvas)',
        ':active': { backgroundColor: 'var(--canvas)' },
      };
    },
    control: (provided, state) => {
      return {
        // margin: '0px 4px 0px 4px',
        alignItems: 'center',
        fontFamily: 'Open Sans',
        color:'var(--canvastext)',
        backgroundColor: 'var(--canvas)',
        cursor: state.isDisabled ? 'not-allowed' : 'default',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        label: 'control',
        minHeight: '20px',
        height: '20px',
        width: state.selectProps.width,
        border: state.isDisabled ? '2px solid var(--mainGray)' : 'var(--mainBorder)',
        borderRadius: 'var(--mainBorderRadius)',
        position: 'relative',
        transition: 'all 100ms',
        outline: state.isFocused ? '2px solid black' : 'none',
        outlineOffset: state.isFocused ? '2px' : 'none',
        // ':focus': {
        //   outline: '2px solid black',
        //   outlineOffset: '2px'
        // },
      };
    },
  };

  const options = props.items.map(([value, label]) => {
    return { value, label };
  });

  const labelVisible = props.label ? 'static' : 'none';

  var width = '210px';

  var align = 'flex';
  var label = '';
  if (props.label) {
      label = props.label;
      if (props.vertical) {
      align = 'static';
      }
  };

  //   console.log(options, props.def);
  return (
    <Container align={align} data-test={props.dataTest}>
            <Label labelVisible={labelVisible} align={align}>{label}</Label>
    <Select
      aria-haspopup="true"
      value={options[props.valueIndex - 1]}
      defaultValue={options[props.defaultIndex - 1]}
      styles={customStyles}
      width={width}
      maxMenuHeight={props.maxMenuHeight}
      isSearchable={false}
      autoFocus={false}
      onChange={props.onChange}
      options={options}
      placeholder={props.title}
      closeMenuOnSelect={true}
      isMulti={props.isMulti ? props.isMulti : false}
      isDisabled={props.disabled ? true : false}
      aria-disabled={props.disabled ? true : false}
      data-test={`${props.dataTest} Dropdown`}
    />
    </Container>
  );
};

export default DropdownMenu;
