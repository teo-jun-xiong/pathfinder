import React, { Component } from "react";
import start from "../images/start.png";
import finish from "../images/finish.png";
import visited from "../images/visited.png"
import wall from "../images/wall.png";
import path from "../images/path.png";
import "./Legend.css"
import "bootstrap/dist/css/bootstrap.min.css";

export default class Legend extends Component {
  render() {
    return (
      <div className="legend">
        <table className="table table-borderless">
          <tbody>
            <tr>
              <td>
                <img src={start} alt="start"></img>
              </td>
              <td>
                <img src={finish} alt="finish"></img>
              </td>
              <td>
                <img src={visited} alt="visited"></img>
              </td>
              <td>
                <img src={wall} alt="wall"></img>
              </td>
              <td>
                <img src={path} alt="path"></img>
              </td>
            </tr>

            <tr>
                <td><span className="caption">Start</span></td>
                <td><span className="caption">End</span></td>
                <td><span className="caption">{this.props.visited === 0 ? "Visited" : this.props.visited}</span></td>
                <td><span className="caption">Wall</span></td>
                <td><span className="caption">Path</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
