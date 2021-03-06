import React, { Component } from "react";
import Node from "./Node";
import AlgorithmButton from "./AlgorithmButton";
import VisualizeButton from "./VisualizeButton";
import Legend from "./Legend";

import {
  dijkstra,
  getNodesInShortestPathOrderDijkstra,
} from "../algorithms/dijkstra";
import { dfs, getNodesInShortestPathOrderDFS } from "../algorithms/dfs";

import "./Main.css";

var START_NODE_ROW = 12;
var START_NODE_COL = 25;
var FINISH_NODE_ROW = 12;
var FINISH_NODE_COL = 35;
const ALGO_DIJKSTRA = "dijkstra";

// Returns initial grid with default start and finish nodes
const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 25; row++) {
    const currentRow = [];
    for (let col = 0; col < 60; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

// Returns a default Node.jsx
const createNode = (col, row) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
  };
};

// Returns grid with a wall at (row, col)
const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
    isStart: false,
    isFinish: false,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

// Returns grid with the start node at (row, col)
const getNewGridWithNewStart = (grid, row, col) => {
  const newGrid = grid.slice();
  newGrid[START_NODE_ROW][START_NODE_COL] = {
    ...newGrid[START_NODE_ROW][START_NODE_COL],
    isStart: false,
  };

  START_NODE_COL = col;
  START_NODE_ROW = row;

  const node = newGrid[row][col];
  const newStart = {
    ...node,
    isStart: true,
    isWall: false,
  };
  newGrid[row][col] = newStart;
  return newGrid;
};

// Returns grid with the finish node at (row, col)
const getNewGridWithNewFinish = (grid, row, col) => {
  const newGrid = grid.slice();
  newGrid[FINISH_NODE_ROW][FINISH_NODE_COL] = {
    ...newGrid[FINISH_NODE_ROW][FINISH_NODE_COL],
    isFinish: false,
  };

  FINISH_NODE_ROW = row;
  FINISH_NODE_COL = col;

  const node = newGrid[row][col];
  const newFinish = {
    ...node,
    isFinish: true,
    isWall: false,
  };
  newGrid[row][col] = newFinish;
  return newGrid;
};

export default class Main extends Component {
  constructor() {
    super();

    this.state = {
      grid: [],
      mouseIsPressed: false,
      settingStart: false,
      settingFinish: false,
      algo: "dijkstra",
      visited: 0,
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({ grid });
  }

  // If start/finish node is clicked, it can be reassigned to a new position
  handleMouseDown(row, col) {
    if (row === START_NODE_ROW && col === START_NODE_COL) {
      this.setState({ mouseIsPressed: true, settingStart: true });
    } else if (row === FINISH_NODE_ROW && col === FINISH_NODE_COL) {
      this.setState({ mouseIsPressed: true, settingFinish: true });
    } else if (this.state.settingStart) {
      const newGrid = getNewGridWithNewStart(this.state.grid, row, col);
      this.setState({
        grid: newGrid,
        mouseIsPressed: false,
        settingStart: false,
      });
    } else if (this.state.settingFinish) {
      const newGrid = getNewGridWithNewFinish(this.state.grid, row, col);
      this.setState({
        grid: newGrid,
        mouseIsPressed: false,
        settingFinish: false,
      });
    } else if (!this.state.settingStart && !this.state.settingFinish) {
      const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
      this.setState({
        grid: newGrid,
        mouseIsPressed: true,
        settingStart: false,
      });
    }
  }

  // Mouse hover
  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({ grid: newGrid });
  }

  handleMouseUp() {
    this.setState({ mouseIsPressed: false });
  }

  animate(visitedNodesInOrder, nodesInShortestPathOrder) {
    // if (!visitedNodesInOrder) {
    //   var snackbar = document.getElementById("snackbar");
    //   snackbar.className = "show";
    //   setTimeout(function () {
    //     snackbar.className = snackbar.className.replace("show", "");
    //   }, 3000);
    // } else {

    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
          this.setState({ visited: visitedNodesInOrder.length - 2 });
        }, 10 * i);
        return;
      }
      if (!visitedNodesInOrder[i].isStart && !visitedNodesInOrder[i].isFinish) {
        setTimeout(() => {
          const node = visitedNodesInOrder[i];
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited";
        }, 10 * i);
      }
    }
  }
  // }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      if (
        !nodesInShortestPathOrder[i].isStart &&
        !nodesInShortestPathOrder[i].isFinish
      ) {
        setTimeout(() => {
          const node = nodesInShortestPathOrder[i];
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-shortest-path";
        }, 50 * i);
      }
    }
  }

  // Resets all visited nodes to initial state (uncolored)
  resetAnimation(grid) {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[0].length; j++) {
        // Resets the nodes
        grid[i][j].distance = Infinity;
        grid[i][j].isVisited = false;
        grid[i][j].previousNode = null;

        if (i === START_NODE_ROW && j === START_NODE_COL) {
          document.getElementById(`node-${i}-${j}`).className =
            "node node-start";
        } else if (i === FINISH_NODE_ROW && j === FINISH_NODE_COL) {
          document.getElementById(`node-${i}-${j}`).className =
            "node node-finish";
        } else if (grid[i][j].isWall) {
          document.getElementById(`node-${i}-${j}`).className =
            "node node-wall";
        } else {
          document.getElementById(`node-${i}-${j}`).className = "node";
        }
      }
    }
  }

  visualize() {
    const algo = this.state.algo;
    this.setState({ visited: 0 });
    if (algo === ALGO_DIJKSTRA) {
      this.visualizeDijkstra();
    } else {
      this.visualizeDFS();
    }
  }

  visualizeDFS() {
    const { grid } = this.state;
    this.resetAnimation(grid);
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dfs(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrderDFS(finishNode);
    this.animate(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  visualizeDijkstra() {
    const { grid } = this.state;
    this.resetAnimation(grid);
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrderDijkstra(
      finishNode
    );
    this.animate(visitedNodesInOrder, nodesInShortestPathOrder);
  }

  render() {
    const { grid, mouseIsPressed } = this.state;

    return (
      <div className="main">
        <AlgorithmButton
          parentCallback={(data) => this.setState({ algo: data })}
        />

        <VisualizeButton onClickFunction={() => this.visualize()} />

        {/* <div id="snackbar">The end node cannot be reached!</div> */}
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div className="grid-row" key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const { row, col, isFinish, isStart, isWall } = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}
                    ></Node>
                  );
                })}
              </div>
            );
          })}
        </div>

        <Legend visited={this.state.visited} />
      </div>
    );
  }
}
