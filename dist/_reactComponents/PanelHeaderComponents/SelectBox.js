import React, {useState, useEffect, useRef} from "../../_snowpack/pkg/react.js";
import "./selectbox.css.proxy.js";
import cloneDeep from "../../_snowpack/pkg/lodash/cloneDeep.js";
function SelectBox({items}) {
  const node = useRef();
  const [item, setItem] = useState(items);
  const [value, setValue] = useState("");
  const [showItems, setShowItems] = useState(false);
  useEffect(() => {
    document.addEventListener("click", handleClick, false);
    return () => {
      document.removeEventListener("click", handleClick, false);
    };
  });
  const handleClick = (event) => {
    if (node.current.contains(event.target)) {
      setShowItems(!showItems);
    } else {
      setShowItems(false);
    }
  };
  const selectChild = (child, parent) => {
    setValue(child.label);
    child.callback(child, parent);
  };
  const filter = (ev) => {
    let itemsCopy = cloneDeep(items);
    console.log(itemsCopy);
    setValue(ev.target.value);
    if (!!ev && !!ev.target && !!ev.target.value) {
      itemsCopy.map((i) => {
        let match = i.children.filter((c) => c.label.toLowerCase().indexOf(ev.target.value.toLowerCase()) > -1);
        i.children = match;
        return i;
      });
    }
    setItem(itemsCopy);
  };
  const noResults = !item.filter((i) => !!i.children.length).length;
  return /* @__PURE__ */ React.createElement("div", {
    className: "select-box-box",
    ref: node
  }, /* @__PURE__ */ React.createElement("div", {
    className: "select-box-container"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "select-box-selected-item"
  }, /* @__PURE__ */ React.createElement("input", {
    type: "text",
    value,
    onChange: filter.bind(this)
  })), /* @__PURE__ */ React.createElement("div", {
    className: "select-box-arrow"
  }, /* @__PURE__ */ React.createElement("span", {
    className: `${showItems ? "select-box-arrow-up" : "select-box-arrow-down"}`
  })), /* @__PURE__ */ React.createElement("div", {
    style: {display: showItems ? "block" : "none"},
    className: "select-box-items"
  }, item.map((i) => /* @__PURE__ */ React.createElement(React.Fragment, null, !!i.children.length && /* @__PURE__ */ React.createElement("div", {
    className: "parent"
  }, i.parent.title), i.children.map((child) => /* @__PURE__ */ React.createElement("div", {
    className: "child-container"
  }, /* @__PURE__ */ React.createElement("div", {
    key: child.value,
    onClick: selectChild.bind(this, child, i)
  }, child.label))))), noResults && /* @__PURE__ */ React.createElement("div", {
    className: "parent"
  }, "No match found"))));
}
export default SelectBox;
