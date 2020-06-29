import React, { Component } from "react";
import "./selectbox.css";

class SelectBox extends Component {

  state = {
    items: [...this.props.items],
    showItems: false,
    selectedItem: null
  };

  dropDown = () => {
    this.setState(prevState => ({
      showItems: !prevState.showItems
    }));
  };

  selectItem = item => {
    this.setState({
      selectedItem: item,
      showItems: false
    });
  };

  filter = ev => {
    let items = JSON.parse(JSON.stringify(this.props.items));
    console.log(items);
    if(!!ev && !!ev.target && !!ev.target.value) {
      items.map(i=> {
        let match = i.children.filter(c=> c.label.toLowerCase().indexOf((ev.target.value).toLowerCase()) > -1);
        i.children = match;
        return i;
      });
    }
    this.setState({items});
  }

  render() {
    return (
      <div className="select-box-box">
        <div className="select-box-container">
          <div className="select-box-selected-item">
            {this.state.selectedItem ? this.state.selectedItem.value : <input type="text" onChange={this.filter.bind(this)}></input>}
          </div>
          <div className="select-box-arrow" onClick={this.dropDown}>
            <span
              className={`${
                this.state.showItems
                  ? "select-box-arrow-up"
                  : "select-box-arrow-down"
                }`}
            />
          </div>

          <div
            style={{ display: this.state.showItems ? "block" : "none" }}
            className={"select-box-items"}
          >
            {this.state.items.map(item => (
              <>
                <div>{item.parent.title}</div>
                {item.children.map(child => (
                  <div
                    key={child.value}
                  // onClick={() => this.selectItem(child)}
                  // className={this.state.selectedItem === item ? "selected" : ""}
                  >
                    {child.label}
                  </div>))}
              </>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default SelectBox;
