export function normalize(diagram) {
  diagram.vertices.forEach((vertex, idx) => {
    vertex.id = idx;
  });
  diagram.edges.forEach((edge, idx) => {
    edge.id = idx;
  });
  diagram.cells.forEach((cell, idx) => {
    cell.id = idx;
  });

  return {
    vertices: diagram.vertices.map(vertex => ({
      id: vertex.id,
      x: vertex.x,
      y: vertex.y,
    })),
    edges: diagram.edges.map(edge => ({
      id: edge.id,
      v1: edge.v1.id,
      v2: edge.v2.id,
      c1: edge.c1 && edge.c1.id,
      c2: edge.c2 && edge.c2.id,
    })),
    cells: diagram.cells.map(cell => ({
      id: cell.id,
      x: cell.x,
      y: cell.y,
      neighbors: cell.neighbors.map(edge => edge.id),
      edges: cell.edges.map(halfEdge => ({
        id: halfEdge.edge.id,
        start: halfEdge.start.id,
        end: halfEdge.end.id,
        neighbor: (halfEdge.edge.c1 && halfEdge.edge.c1.id !== cell.id && halfEdge.edge.c1.id) || (halfEdge.edge.c2 && halfEdge.edge.c2.id)
      }))
    }))
  };
}
