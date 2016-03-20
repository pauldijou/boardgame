export function repartition(tiles) {
  let waterTiles = 0;
  let lowTiles = 0;
  let mediumTiles = 0;
  let highTiles = 0;
  let veryhighTiles = 0;
  tiles.forEach(({ elevation }) => {
    if (elevation < 0) { waterTiles++ }
    else if (elevation < 0.25) { lowTiles++ }
    else if (elevation < 0.50) { mediumTiles++ }
    else if (elevation < 0.75) { highTiles++ }
    else { veryhighTiles++ }
  })
  console.log(
    100 * waterTiles / tiles.length,
    100 * lowTiles / tiles.length,
    100 * mediumTiles / tiles.length,
    100 * highTiles / tiles.length,
    100 * veryhighTiles / tiles.length
  );
}
