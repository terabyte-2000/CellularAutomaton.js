'use strict';

//TODO: Add support for gridding and clicking on cells to change their state
//TODO: Add a Cell class and use it for managing the state, counting neighbors, etc
export default class CellularAutomaton {
  constructor(){

  }
  // Methods to make stuff work
  countNeighbors(matrix, x, y) {
    let total = 0;
    for (let newX = -1; newX < 2; newX++) {
      for (let newY = -1; newY < 2; newY++) {
        var updateTotal = matrix[x + newX] && matrix[x + newX][y + newY] && matrix[x + newX][y + newY] === 1 && !(newX === 0 && newY === 0);
        if(updateTotal){
          total += matrix[x + newX][y + newY];
        }
      }
    }
    return total
  }

  //From stackoverflow: https://stackoverflow.com/questions/11301438/return-index-of-greatest-value-in-an-array/11301464
  indexOfGreatest(arr) {
    if (arr.length === 0) {
      return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
        maxIndex = i;
        max = arr[i];
      }
    }

    return maxIndex;
  }


  findDominant(matrix, x, y) {
    let count = [0, 0, 0, 0, 0, 0, 0, 0];

    for (let xOffset = -1; xOffset < 3; xOffset++) {
      for (let yOffset = -1; yOffset < 3; yOffset++) {
        if (xOffset !== 0 && yOffset !== 0) {
          if (matrix[x + xOffset] && matrix[x + xOffset][y + yOffset]) {
            count[matrix[x + xOffset][y + yOffset]] += 1;
          }
        }
      }
    }
    return indexOfGreatest(count);
  }

  deepCopy(arr){
    return JSON.parse(JSON.stringify(arr));
  }

  draw(boardState){
    for(let x = 0; x < boardState.length; x++){
      for(let y = 0; y < boardState[0].length; y++){
        this.ctx.fillStyle = this.colArray[boardState[x][y]];
        //For some reason I have to reverse the x and y for the below line for it to work
        this.ctx.fillRect(y*this.cellSide, x*this.cellSide, this.cellSide, this.cellSide);
      }
    }
  }

  make_matrix(width, height, func){
    let matrix = [];
    for(let i = 0; i < height; i++){
      matrix[i] = [];
      for(let j = 0; j < width; j++){
        matrix[i][j] = func();
      }
    }
    return matrix;
  }
  // End Methods that make stuff work

  // Note: I have a lot of 'return this' because I want people to be able to chain stuff like this:
  // new CellularAutomaton().bindCanvas(canvas).setDimensions(10, 10, 1).setState(matrix);
  // While I would not recommend giant chains, it can be kind of useful
  bindCanvas(canvas){
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    return this;
  }
  setDimensions(widthOfCanvas, heightOfCanvas, cellSideInCanvas){
    this.width = widthOfCanvas;
    this.height = heightOfCanvas;
    this.cellSide = cellSideInCanvas;
    return this;
  }
  setState(matrix){
    if(!Array.isArray(matrix)){
      throw new TypeError('passed matrix is not of type array - please pass an array');
      return;
    }else if(!Array.isArray(matrix[0])){
      throw new TypeError('you may have passed a one dimmensional array; please pass in a 2d array (matrix)');
      return;
    }else{
      this.state = this.deepCopy(matrix);
      this.width = this.state[0].length;
      this.height = this.state.length;
    }
    return this;
  }

  automaton(callback, colArray){
    if(!this.canvas || !this.ctx){
      throw new Error("No bound canvas - you must bind a canvas before you set the automaton");
      return;
    }else if(!this.state){
      throw new Error("State has not been set - you must set the state before you set the automaton");
      return;
    }else if(!callback instanceof Function){
      throw new TypeError("Callback is not a function");
      return;
    }else if(!Array.isArray(colArray) || colArray.length === 0){
      throw new TypeError('The color array is either empty or not an array');
      return;
    }else{
      this.automationFunction = callback;
      this.colArray = colArray;
      // let matrix = callback(this.state);
      // this.setState(matrix);
    }
    return this;
  }

  update(autodraw=true){
    // this.automaton(this.automationFunction, this.colArray);
    let matrix = this.automationFunction(this.state);
    this.setState(matrix);
    if(autodraw){
      this.draw(this.state);
    }
  }
}
