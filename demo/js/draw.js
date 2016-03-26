import { grid, context, inputs } from './elements';

function formatVoronoi(ratios, point) {
  return {
    x: ratios.width * point.x,
    y: ratios.height * point.y
  };
}

function formatHexagon(ratios, point) {
  return {
    x: ratios.width * (point.x + 2/3),
    y: ratios.height * (point.x / 2 + point.y + 1/2)
  };
}

function drawCell(cell, ratios, format) {
  if (cell.ocean) {
    // if (cell.elevation < -0.95) {
    //   context.fillStyle = `rgba(180,71,10, 1)`;
    // } else if (cell.elevation < -0.5) {
    //   context.fillStyle = `rgba(13,200,15, ${Math.abs(cell.elevation)})`;
    // } else {
    //   context.fillStyle = `rgba(13,71,161, ${0.4 + Math.abs(cell.elevation)})`;
    // }
    context.fillStyle = `rgba(13,71,161, ${0.4 + Math.abs(cell.elevation)})`;
  } else if (cell.water) {
    context.fillStyle = '#2f9ceb';
  } else {
    context.fillStyle = `rgba(0,0,0, ${Math.max(0, cell.elevation)})`;
  }

  context.beginPath();
  const start = format(ratios, cell.edges[0].start);
  context.moveTo(start.x, start.y);

  cell.edges.forEach(edge => {
    const end = format(ratios, edge.end);
    context.lineTo(end.x, end.y);
  })
  context.fill();
  context.closePath();
}

function drawEdge(edge, ratios, format) {
  if (edge.rivers) {
    context.strokeStyle = '#369eea';
    context.lineWidth = 1 + 2 * edge.rivers.length;
  } else {
    context.strokeStyle = '#000';
    context.lineWidth = 1;
  }

  context.beginPath();
  const v1 = format(ratios, edge.v1);
  const v2 = format(ratios, edge.v2);
  context.moveTo(v1.x, v1.y);
  context.lineTo(v2.x, v2.y);
  context.stroke();
  context.closePath();
}

export default function draw(world, config) {
  const start = performance.now();
  const format = inputs.gridTypeVoronoi.checked ? formatVoronoi : formatHexagon;
  const ratios = { width: grid.width / config.width, height: grid.height / config.height };
  world.grid.cells.forEach(cell => drawCell(cell, ratios, format));
  world.grid.edges.forEach(edge => drawEdge(edge, ratios, format));
  console.debug('Duration world drawing:', Math.round(performance.now() - start), 'ms');
}
