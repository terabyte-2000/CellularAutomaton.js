'use strict';

//TODO: Add support for gridding and clicking on cells to change their state


class Cell{
  constructor(width=1, height=1, x=0, y=0, state=0, parent=[[]], gridSettings={isGridded: false, gridLineWidth: 0, gridColor: ''}){
    this.width = Number(width);
    this.height = Number(height);
    this.x = x;
    this.y = y;
    this.row = x/width;
    this.col = y/height;
    this.state = state;
    this.parent = parent;
    if(gridSettings.isGridded){
      this.isGridded = true;
      this.gridColor = gridSettings.gridColor;
      this.gridLineWidth = gridSettings.gridLineWidth;
    }else{
      this.isGridded = false;
    } 
  }

  clone(){
    return new Cell(this.width, this.height, this.x, this.y, this.state, this.parent, this.gridSettings);
  }


  neighbors(neigborhood='moore') {
    /**
    * There are two major kinds of neighborhoods - the Moore neighborhood and the von Neumann neigborhood
    * In the Moore neigborhood, all the adjacent cells (cell above, below, to the left, and to the right) and the cells that are diagonally adjacent (diagonal top left, diagonal top right, diagonal bottom left, and diagonal bottom right).
    * In the von Neumann neigborhood, only directly adjacent cells are counted (the cells above, below, to the left, and to the right)
    * For more information, see https://en.wikipedia.org/wiki/Cellular_automaton
    */
    let neighborsArr = [];
    let addCell = false;
    let newRow,newCol;

    //Optional processing in case you happen to include spaces, mix case, etc. I'm on the fence on whether or not to include this. I'm commenting it out for now
    // neighborhood = neighborhood.toLowerCase().replace(/\s+/g,'');
    
    if(neigborhood === 'moore'){
      for (let xOffset = -1; xOffset < 2; xOffset++) {
        for (let yOffset = -1; yOffset < 2; yOffset++) {
          if(xOffset === 0 && yOffset === 0){
            continue;
          }
          
          newRow = this.row + xOffset;
          newCol = this.col + yOffset;

          //Make sure that each neighbor exists in the matrix
          addCell = this.parent.state[newRow] && this.parent.state[newRow][newCol];
        
  
          if(addCell){
            let cell = this.parent.state[newRow][newCol];
            neighborsArr.push(cell);
          }
        }
      }
    }else if(neigborhood === 'vonneumann'){
      if(this.parent.state[this.row-1]){
        //Up
        neighborsArr.push(this.parent.state[this.row-1][this.col]);
      }
      if(this.parent.state[this.row+1]){
        //Down
        neighborsArr.push(this.parent.state[this.row+1][this.col]);
      }
      if(this.parent.state[this.row][this.col-1]){
        //Left
        neighborsArr.push(this.parent.state[this.row][this.col-1]);
      }
      if(this.parent.state[this.row][this.col+1]){
        //Right
        neighborsArr.push(this.parent.state[this.row][this.col+1]);
      }
    }
    return neighborsArr;
  }

  liveNeighbors(neighborhood='moore'){
    let allNeighbors = this.neighbors(neighborhood);
    let livingNeighbors = [];
    for(let neighbor of allNeighbors){
      if(neighbor.state !== 0) livingNeighbors.push(neighbor);
    }

    return livingNeighbors;
  }
  countLiveNeighbors(neighborhood='moore') {
    return this.liveNeighbors(neighborhood).length;
  }
}

class CellularAutomaton {
  static get Cell(){
    return Cell;
  }
  // Methods to make stuff work
  
  

  draw(boardState=this.state){
    // boardState = boardState || this.state;
    for(let x = 0; x < boardState.length; x++){
      for(let y = 0; y < boardState[0].length; y++){

        //Set the appropriate color based on the color function
        this.ctx.fillStyle = this.colFunc(boardState[x][y]);
        
        //For some reason I have to reverse the x and y for the below line for it to work
        this.ctx.fillRect(x*this.cellSide, y*this.cellSide, this.cellSide, this.cellSide);
      }
    }
  }

  static make_matrix(width, height, func){
    let matrix = [];
    for(let i = 0; i < height; i++){
      matrix[i] = [];
      for(let j = 0; j < width; j++){
        matrix[i][j] = func(i, j);
      }
    }
    return matrix;
  }
  
  each(callback, changeState=true){
    let newState = CellularAutomaton.make_matrix(this.state[0].length, this.state.length, () => 0);
    
    for(let x = 0; x < this.state.length; x++){
      for(let y = 0; y < this.state[0].length; y++){
        newState[x][y] = callback(this.state[x][y]);
      }
    }

    if(changeState){
      
      for(let x = 0; x < this.state.length; x++){
        for(let y = 0; y < this.state[0].length; y++){
          this.state[x][y].state = newState[x][y];
        }
      }
      
    }
    
    return newState;
  }
  // End Methods that make stuff work

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

    
    this.state = matrix;
    this.width = this.state[0].length;
    this.height = this.state.length;

    for(let x = 0; x < this.state.length; x++){
      for(let y = 0; y < this.state[0].length; y++){
        this.state[x][y].parent = this;
      }
    }
    
    return this;
  }

  automaton(callback, colFunc){
    
    this.automationFunction = callback;
    this.colFunc = colFunc;
    
    return this;
  }

  update(changeState=false, autodraw=true){  
    let matrix = this.automationFunction(this);

    if(changeState){
      for(let x = 0; x < this.state.length; x++){
        for(let y = 0; y < this.state[0].length; y++){
          this.state[x][y].state = matrix[x][y];
        }
      }
    }
    
    if(autodraw) this.draw(this.state);

    return this;
  }
}