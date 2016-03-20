// Schema
// {
// vertices: [{x, y}, ...],
// edges: [{v1: Vertex, v1: Vertex, c1: Cell, c2: Cell}],
// cells: [{
//   x,
//   y,
//   neighbors: [Cell, ...],
//   edges: [{start: Vertex, end: Vertex, edge: Edge}, ...]
// }, ...]
// }

function isVertex(vertex) {
  return vertex && (typeof vertex.x === 'number') && (typeof vertex.y === 'number');
}

function hasVertices(grid) {
  return Array.isArray(grid.vertices) && grid.vertices.every(isVertex);
}

function isCell(cell) {
  return cell && Array.isArray(cell.edges) && cell.edges.every(isOrientedEdge)
    && (typeof cell.x === 'number') && (typeof cell.y === 'number') && Array.isArray(cell.neighbors) && cell.neighbors.length > 0;
}

function hasCells(grid) {
  return Array.isArray(grid.cells) && grid.cells.every(isCell);
}

function isOrientedEdge(edge) {
  return edge && isVertex(edge.start) && isVertex(edge.end) && isEdge(edge.edge);
}

function isEdge(edge) {
  return edge && isVertex(edge.v1) && isVertex(edge.v2);
}

function hasEdges(grid) {
  return Array.isArray(grid.edges) && grid.edges.every(isEdge);
}

export default function validate(grid) {
  return (typeof grid === 'object')
    && hasVertices(grid)
    && hasCells(grid)
    && hasEdges(grid);
}
