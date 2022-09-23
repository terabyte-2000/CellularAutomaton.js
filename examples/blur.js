'use strict';

// Average of Surroundings (Blur effect)

let avgOfSurroundings = new CellularAutomaton();
let blurRandomArr = CellularAutomaton.make2DArray(60, 70, (i,j) => {
  return new Cell( 10, 10, i*10, j*10, getRandomInt(0,255,3) );
});

function blur(instance){
  return instance.each( (cell) => {
    let avgRgb = [0,0,0];
    let neighbors = cell.neighbors();

		for(let rgbValue of neighbors){
      let [r,g,b] = rgbValue.state;
      avgRgb[0] += r;
      avgRgb[1] += g;
      avgRgb[2] += b;
    }
		
		//Average the rgb's and round it to the nearest value. Even in the max all 255's case, it should still be 255
    return avgRgb.map(channel => Math.round(channel / neighbors.length));
  });
}

function avgOfSurr_coloringFunc(cell){
	return `rgb(${cell.state[0]},${cell.state[1]}, ${cell.state[2]})`;
}


avgOfSurroundings
  .setDimensions(600, 700)
  .setCellDimensions(10,10)
  .setState(blurRandomArr)
  .bindCanvas(document.getElementById('blur_canvas'))
  .automaton(blur)
	.setColoringFunction(avgOfSurr_coloringFunc)
  .draw();
