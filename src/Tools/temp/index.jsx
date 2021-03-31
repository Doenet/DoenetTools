import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { HotTable } from '@handsontable/react';
import Handsontable from 'handsontable';


class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      settings: {
        data: Handsontable.helper.createSpreadsheetData(15, 20),
        width: 570,
        height: 220,
      }
    }
  }

  handleChange = (setting, states) => {
    return (event) => {
      this.setState({
        settings: {
          [setting]: states[event.target.checked ? 1 : 0],
        }
      });
    }
  };

  render() {
    return (
      <div>
        <div className="controllers">
          <label><input onChange={this.handleChange('fixedRowsTop', [0, 2])} type="checkbox" />Add fixed rows</label><br/>
          <label><input onChange={this.handleChange('fixedColumnsLeft', [0, 2])} type="checkbox" />Add fixed columns</label><br/>
          <label><input onChange={this.handleChange('rowHeaders', [false, true])} type="checkbox" />Enable row headers</label><br/>
          <label><input onChange={this.handleChange('colHeaders', [false, true])} type="checkbox" />Enable column headers</label><br/>
        </div>
        <HotTable root="hot" settings={this.state.settings}/>
      </div>
    );
  }
}

ReactDOM.render(
    <MyComponent />,
  document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
