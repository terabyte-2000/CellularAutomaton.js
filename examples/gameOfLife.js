'use strict';

let gameOfLife = new CellularAutomaton();

function conwaysGameOfLife(instance) {
  //Conway's game of life
  
  return instance.each((cell) => {
    let numberOfLiveNeighbors = cell.neighborsWithValue(1).length;
		const lookup = [0,0,cell.state,1,0,0,0,0,0];
		return lookup[numberOfLiveNeighbors];
		/*
		So I did this with if statements before but an lookup is probably faster. The number of live neighbors is some number between 0-8. This works well with an array with indices 0-8 (9 elements). For a bunch of reasons (listed down below), it is what it is.

		A cell is dead if neighbors < 2 regardless of state
		A cell is alive if neighbors = 3 regardless of state
		A cell is dead if neighbors > 3 regardless of state
		If neighbors = 2, then if it's alive it stays alive and if it's dead, it stays dead. 
		If you want, you can think through the logic of Conway's game of life to make sure these statements hold. I have used this to create the lookup.
		*/
		
  });
}

const conwayCanvas = document.getElementById('gameOfLifeBoard');
const conwayCellWidth = 10;
const conwayCellHeight = 10;
const conwayCanvasWidth = conwayCanvas.width;
const conwayCanvasHeight = conwayCanvas.height;

function conwayRandomArrFunction(i,j){
	return new Cell(conwayCellWidth, conwayCellHeight, i*conwayCellWidth, j*conwayCellHeight, getRandomInt(0,1))
}
let conwayRandomArr = CellularAutomaton.make2DArray(conwayCanvasHeight/conwayCellHeight, conwayCanvasWidth/conwayCellWidth, conwayRandomArrFunction);


function conwayColoringFunc(cell){
	// 0 is white and 1 is black - in case that wasn't obvious.
	return ['white','black'][cell.state]
}


gameOfLife.setDimensions(conwayCanvasHeight, conwayCanvasWidth)
  .setCellDimensions(conwayCellWidth,conwayCellHeight)
  .setState(conwayRandomArr)
  .bindCanvas(conwayCanvas)
  .automaton(conwaysGameOfLife)
	.setColoringFunction(conwayColoringFunc)
  .draw();
