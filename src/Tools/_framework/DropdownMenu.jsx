import React from 'react';
import ReactDOM from 'react-dom';
//import Dropdown from 'rc-dropdown';
//import Menu, { Item as MenuItem, Divider } from 'rc-menu';
//import 'rc-dropdown/assets/index.css';
import Select from 'react-select';

const DropdownMenu = (props) => {
    
    // const menuItems = props.items.map( ([key, value])  => {
    //     console.log(">>>key", key)
    //     console.log(">>>value", value)
    //     return (
    //     <MenuItem key={key}>{value}</MenuItem>
    //     )
    // })

    // const menuItemsWithDivider = menuItems.reduce((a, c) => a.concat(c), [])

    // const menu = (
    //     <Menu onSelect={props.callBack}> 
    //         {menuItemsWithDivider}
    //     </Menu>
    //   );

    // return (
    //     <Dropdown
    //         trigger={['click']}
    //         overlay={menu}
    //         animation="slide-up"
    //         closeOnSelect={false}
    //         //onVisibleChange={onVisibleChange}
    //     >
    //         <button style={{backgroundColor: "white", width: 100, border: "2 px solid", borderRadius: "5px" }}>{props.title}</button>
    //     </Dropdown>
    // )

    const customStyles = {
        option: (provided, state) =>{

            //console.log(">>> state", state)
            //console.log(">>> provided", provided)

            return ({
                ...provided,
              //   borderBottom: '1px dotted pink',
              color: "black",
              //   padding: 20,
              backgroundColor: state.isSelected ? "hsl(209,54%,82%)" : "white",
              ":active": {backgroundColor: "white"},
              })
        },
        menu: (provided, state) => ({
            ...provided,
            width: state.selectProps.width
        }),
        control: (provided, state) => {

            console.log(">>> state", state)
            console.log(">>> provided", provided)

            return ({
                // none of react-select's styles are passed to <Control />
                alignItems: "center",
                backgroundColor: "hsl(0, 0%, 100%)",
                cursor: "default",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                label: "control",
                minHeight: 38,
                width: state.selectProps.width,
                borderWidth: "2px",
                borderStyle: "solid",
                borderColor: "black",
                borderRadius: "5px",
                position: "relative",
                transition: "all 100ms",
                ":focus": {
                    outline: "none",
                },
              })
        },
        // singleValue: (provided, state) => {
        //   const opacity = state.isDisabled ? 0.5 : 1;
        //   const transition = 'opacity 300ms';
      
        //   return { ...provided, opacity, transition };
        // }
      }

    const options = props.items.map(([value, label]) => {
        //console.log("value", value, "label", label)
        return {value, label}
    })
    console.log(">>>", options)
    return (
        <Select
        //value={selectedOption}
        styles={customStyles}
        width = {props.width}
        isSearchable = {false}
        autoFocus = {false}
        onChange={props.callBack}
        options={options}
        placeholder = {props.title}
        closeMenuOnSelect = {false}
        isMulti = {props.isMulti ? props.isMulti : false}
      />
    )
}

export default DropdownMenu
