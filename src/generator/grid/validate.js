// Schema
// {
// vertices: [{x, y}, ...],
// edges: [{v1: VertexId, v1: VertexId, c1: CellId, c2: CellId}],
// cells: [{
//   x,
//   y,
//   neighbors: [CellId, ...],
//   edges: [{id: EdgeId, start: VertexId, end: VertexId, neighbor: CellId}, ...]
// }, ...]
// }

function isVertexIdCreator(grid) {
  const length = grid.vertices.length;
  return function (id) {
    return (typeof id === 'number') && (id < length);
  }
}

function isEdgeIdCreator(grid) {
  const length = grid.edges.length;
  return function (id) {
    return (typeof id === 'number') && (id < length);
  }
}

function isCellIdCreator(grid) {
  const length = grid.cells.length;
  return function (id) {
    return (typeof id === 'number') && (id < length);
  }
}

function isVertex(vertex, { isVertexId }) {
  return vertex && isVertexId(vertex.id) && (typeof vertex.x === 'number') && (typeof vertex.y === 'number');
}

function hasVertices(grid, options) {
  return Array.isArray(grid.vertices) && grid.vertices.every(v => isVertex(v, options));
}

function isCell(cell, options) {
  return cell && options.isCellId(cell.id) && Array.isArray(cell.edges) && cell.edges.every(e => isOrientedEdge(e, options)) && (typeof cell.x === 'number') && (typeof cell.y === 'number') && Array.isArray(cell.neighbors) && cell.neighbors.length > 0 && cell.neighbors.every(options.isCellId);
}

function hasCells(grid, options) {
  return Array.isArray(grid.cells) && grid.cells.every(c => isCell(c, options));
}

function isOrientedEdge(edge, { isVertexId, isEdgeId }) {
  return edge && isEdgeId(edge.id) && isVertexId(edge.start) && isVertexId(edge.end) && isEdgeId(edge.neighbor);
}

function isEdge(edge, { isVertexId, isCellId }) {
  return edge && isEdgeId(edge.id) && isVertexId(edge.start) && isVertexId(edge.end) && isCellId(edge.left) && isCellId(edge.right);
}

function hasEdges(grid, options) {
  return Array.isArray(grid.edges) && grid.edges.every(e => isEdge(e, options));
}

export default function validate(grid) {
  const options = {
    isVertexId: isVertexIdCreator(grid),
    isEdgeId: isEdgeIdCreator(grid),
    isCellId: isCellIdCreator(grid),
  };
  return (typeof grid === 'object')
    && hasVertices(grid, options)
    && hasCells(grid, options)
    && hasEdges(grid, options);
}
