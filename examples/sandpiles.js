'use strict'

let sandpiles = new CellularAutomaton();

const maxSandPerCell = 3;
const sandInMiddle = 1500;

const colorLookup = ['blue','lightblue','yellow','brown'];

const sandpilesCanvas = document.getElementById('sandpiles_canvas');
const sandpilesCellWidth = 10;
const sandpilesCellHeight = 10;
const sandpilesCanvasWidth = conwayCanvas.width;
const sandpilesCanvasHeight = conwayCanvas.height;

const sandpilesRows = sandpilesCanvasHeight/sandpilesCellHeight;
const sandpilesCols = sandpilesCanvasWidth/sandpilesCellWidth;

function sandpilesRestartArrFunction(i,j){

	let cell = new Cell(sandpilesCellWidth, sandpilesCellHeight, i*sandpilesCellWidth, j*sandpilesCellHeight, 0)
	
	if(i === Math.floor(sandpilesRows/2) && j === Math.floor(sandpilesCols/2)) cell.state = sandInMiddle;

	return cell;
}
let sandpilesRestartArr = CellularAutomaton.make2DArray(sandpilesRows, sandpilesCols, sandpilesRestartArrFunction);


function sandpilesColoringFunc(cell){
	// 0 is white and 1 is black - in case that wasn't obvious.
	let color = colorLookup[cell.state];
	return color ? color : 'red';
}

function sandpilesAutomaton(instance){
	return instance.each((cell) => {
		//ignore edges for now
		// if(cell.row === 0 || cell.col === 0 || cell.row === sandpilesRows-1 || cell.col === sandpilesCols-1) return cell.state

		let newState = cell.state;
		//Up, Down, Left, Right
		let neighbors = cell.neighbors('vonneumann');

		if(cell.state > maxSandPerCell){
			newState -= neighbors.length;
		}

		
		for(let neighbor of neighbors){
			if(neighbor.state > maxSandPerCell){
				newState++;
			}
		}
		return newState;
	});
}

sandpiles.setDimensions(sandpilesCanvasHeight, sandpilesCanvasWidth)
  .setCellDimensions(sandpilesCellWidth,sandpilesCellHeight)
  .setState(sandpilesRestartArr)
  .bindCanvas(sandpilesCanvas)
  .automaton(sandpilesAutomaton)
	.setColoringFunction(sandpilesColoringFunc)
  .draw();