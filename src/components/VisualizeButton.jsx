import React, { Component } from "react";

import "bootstrap/dist/css/bootstrap.min.css";

export default class VisualizeButton extends Component {
  render() {
    return (
      <div>
        <button
          id="visualize"
          className="btn btn-primary"
          onClick={() => this.props.onClickFunction()}
        >
          {" "}
          Visualize
        </button>
      </div>
    );
  }
}
