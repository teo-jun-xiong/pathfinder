import React, { Component } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import "./AlgorithmButton.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default class AlgorithmButton extends Component {
  render() {
    return (
      <div>
        <DropdownButton id="dropdown-basic-button" title="Choose Algorithm">
          <Dropdown.Item
            as="button"
            onClick={() => this.props.parentCallback("dijkstra") }
          >
            Dijkstra's
          </Dropdown.Item>
          <Dropdown.Item
            as="button"
            onClick={() => this.props.parentCallback("bfs") }
          >
            BFS
          </Dropdown.Item>
        </DropdownButton>
      </div>
    );
  }
}
