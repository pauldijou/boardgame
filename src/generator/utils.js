export function neighborEdges(e1, e2) {
  return e1 && e2 && e1.start === e2.start
    || e1.start === e2.end
    || e1.end === e2.start
    || e1.end === e2.end;
}

export function neighborCells(c1, c2) {
  return c1 && c2 && c1.edges.reduce((res, edge) => {
    return res || c2.edges.indexOf(edge) >= 0;
  }, false);
}

export function floodEdges(start, predicate, operation) {
  const bucket = [ start ];
  while(bucket.length) {
    const current = bucket.unshift();
    operation(current);
    current.getNeighbors().filter(predicate).forEach(edge => {
      bucket.push(edge);
    });
  }
}

export function normalize(diagram) {
  diagram.vertices.forEach((vertex, idx) => {
    vertex.id = idx;
    vertex.edges = [];
    vertex.cells = [];
  });
  diagram.edges.forEach((edge, idx) => {
    edge.id = idx;
    edge.start.edges.push(idx);
    edge.end.edges.push(idx);
  });
  diagram.cells.forEach((cell, idx) => {
    cell.id = idx;
    cell.edges.forEach(halfEdge => {
      halfEdge.start.cells.push(idx);
    });
  });

  return {
    vertices: diagram.vertices.map(vertex => ({
      id: vertex.id,
      x: vertex.x,
      y: vertex.y,
      edges: vertex.edges,
      cells: vertex.cells,
    })),
    edges: diagram.edges.map(edge => ({
      id: edge.id,
      start: edge.start.id,
      end: edge.end.id,
      hasLeft: !!edge.left,
      hasRight: !!edge.right,
      left: edge.left && edge.left.id,
      right: edge.right && edge.right.id,
      neighbors: (edge.left ? edge.left.edges : [])
        .concat(edge.right ? edge.right.edges : [])
        .filter(e => e.id !== edge.id)
        .filter(e => neighborEdges(e, edge))
        .map(e => e.edge.id)
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
        neighbor: (halfEdge.edge.left && halfEdge.edge.left.id !== cell.id && halfEdge.edge.left.id) || (halfEdge.edge.right && halfEdge.edge.right.id)
      }))
    }))
  };
}

export function addFunctions(diagram) {
  function getVertex(id) { return diagram.vertices[id]; }
  function getEdge(id) { return diagram.edges[id]; }
  function getCell(id) { return diagram.cells[id]; }

  diagram.getVertex = getVertex;
  diagram.getEdge = getEdge;
  diagram.getCell = getCell;

  function getStart() { return getVertex(this.start); }
  function getEnd() { return getVertex(this.end); }
  function getLeft() { return getCell(this.left); }
  function getRight() { return getCell(this.right); }
  function getNeighbor() { return getCell(this.neighbor); }
  function getNeighbors() { return this.neighbors.map(getCell); }
  function getEdgeNeighbors() { return this.neighbors.map(getEdge); }
  function getEdges() { return this.edges.map(getEdge); }
  function getCells() { this.cells.map(getCell); }
  function getOrigin() { return getEdge(this.id); }

  diagram.vertices.forEach(vertex => {
    vertex.getEdges = getEdges;
    vertex.getCells = getCells;
  });
  diagram.edges.forEach(edge => {
    edge.getStart = getStart;
    edge.getEnd = getEnd;
    edge.getLeft = getLeft;
    edge.getRight = getRight;
    edge.getNeighbors = getEdgeNeighbors;
  });
  diagram.cells.forEach(cell => {
    cell.getNeighbors = getNeighbors;
    cell.getEdges = getEdges;
    cell.edges.forEach(halfEdge => {
      halfEdge.getOrigin = getOrigin;
      halfEdge.getStart = getStart;
      halfEdge.getEnd = getEnd;
      halfEdge.getNeighbor = getNeighbor;
    });
  });

  return diagram;
}
