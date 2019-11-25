import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMsg:"" };
  }

  componentDidCatch(error, info) {
    let errorMsg = String(error).split("\n")[0];
    this.setState({ hasError: true, errorMsg: errorMsg });
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      return <p style={{fontSize:"30px",color:"red"}}>{this.state.errorMsg}</p>;
    }
    return this.props.children;
  }
}
