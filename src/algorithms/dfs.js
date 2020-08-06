export function dfs(grid, startNode, finishNode) {
  const visitedNodesInOrder = [];
  const stack = [];
  startNode.distance = 0;
  stack.push(startNode);
  let count = 0;

  while (!!stack.length) {
    count++;
    const currentNode = stack.pop();
    const currentNeighbors = getUnvisitedNeighbors(currentNode, grid);

    // If we encounter a wall, we skip it.
    if (currentNode.isWall) {
      continue;
    }

    for (const node of currentNeighbors) {
      stack.push(node);
      node.distance = currentNode.distance + 1;
      node.previousNode = currentNode;
    }

    // If the closest node is at a distance of infinity,
    // we must be trapped and should therefore stop.
    if (count >= 650 || currentNode.distance === Infinity) {
      return visitedNodesInOrder;
    }

    currentNode.isVisited = true;
    visitedNodesInOrder.push(currentNode);

    if (currentNode === finishNode) {
      return visitedNodesInOrder;
    }
  }

  // If there are no more nodes in the stack, and the array was not returned
  // in the while loop, return this array (e.g. startNode is trapped around walls)
  if (stack.length === 0) {
    return visitedNodesInOrder;
  }
}

// Returns an array of unviisted neighbors of node (up, down, left, right)
function getUnvisitedNeighbors(node, grid) {
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((neighbor) => !neighbor.isVisited);
}

// Backtracks from the finishNode to find the shortest path.
// Only works when called *after* the dfs method above.
export function getNodesInShortestPathOrderDFS(finishNode) {
  const nodesInShortestPathOrder = [];
  let currentNode = finishNode;
  while (currentNode !== null) {
    nodesInShortestPathOrder.unshift(currentNode);
    currentNode = currentNode.previousNode;
  }
  return nodesInShortestPathOrder;
}
