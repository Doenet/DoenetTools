import React, { Component } from "react";
import "./selectbox.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
    const noResults = !this.state.items.filter(i=>!!i.children.length).length;
    return (
      <div className="select-box-box">
        <div className="select-box-container">
          <div className="select-box-selected-item" onClick={this.dropDown}>
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
                {!!item.children.length && <div className="parent">{item.parent.title}</div>}
                {item.children.map(child => (
                  <div className="child-container">
                    {!!child.icon && <FontAwesomeIcon icon={child.icon} style={{ paddingRight: "8px", fontSize: "15px"}}/>}
                    <div
                      key={child.value}
                    >
                      {child.label}
                    </div>
                  </div>
                  ))}
              </>
            ))}
            {noResults && <div className="parent">No match found</div>}
          </div>
        </div>
      </div>
    );
  }
}

export default SelectBox;
