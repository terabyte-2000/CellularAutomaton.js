'use strict';

// TODO: Add support for gridding and clicking on cells to change their state. On second though, clicking on clicking on cells sounds like a UI thing that the user should figure out.
// TODO: Add JSDoc stuff to the library
// TODO: Instead of setting cell size, just set the number of rows and columns you want, and any gridding you might want, and the automaton should just calculate stuff for you automatically.
// IDEA: Maybe add a way to export all the generations as a JSON file or something.

/**
 * The Class that handles cell stuff - neighbors and stuff. 
 * Also holds stuff like position in the canvas, row/col in the CellularAutomaton class, state, and stuff.
 */
class Cell {
	/**
	 * @param {number} width - the width of the cell (in pixels I believe)
	 * @param {number} height - the height of the cell (in pixels I believe)
	 * @param {number} x - the x-coordinate of the cell in terms of the actual canvas/board
	 * @param {number} y - the y-coordinate of the cell in terms of the actual canvas/board
	 * @param {*} state - the state of the cell; it can really be anything - number, string, array, object, etc. It is reccommended that all cells in an automaton have the same type
	 * @param {CellularAutomaton} parent - the parent CellularAutomaton object that contains the cell
	 */
	constructor( width = 1, height = 1, x = 0, y = 0, state = 0, parent = {} ) {
		this.width = Number(width);
		this.height = Number(height);
		this.x = x;
		this.y = y;
		this.row = x / width;
		this.col = y / height;
		this.state = state;
		this._neighborhood = {};
		this.parent = parent;
	}

	setGridSettings(isGridded = false, gridLineWidth = 0, gridColor = '') {
		this.isGridded = isGridded;
		this.gridLineWidth = gridLineWidth;
		this.gridColor = gridColor;
		return this;
	}

	/**
	 * Clones the Cell it's called on
	 * @returns {Cell} a clone of the Cell
	 */
	clone() {
		const theCell = new Cell(this.width, this.height, this.x, this.y, this.state, this.parent);
		if (this.isGridded) {
			theCell.setGridSettings(this.isGridded, this.gridLineWidth, this.gridColor);
		}
		
		return theCell;
	}

	/**
		* Returns the neighbors of the cell it is called on based on the neighborhood argument. Will absolutely crash on you if you don't supply all the x, y, width, height stuff. Be careful with the storeNeighbors thingy...it takes up a whole lot of memory and so is turned off by default
		* @param {string} [neighborhood='moore']
		* @param {boolean} [storeNeighbors=false]
		* @param {boolean} [reevaluate=false]
		* @returns {Cell[]}
	*/
	neighbors(neigborhood = 'moore', storeNeighbors=false, reevaluate = false) {
		/**
		* There are two major kinds of neighborhoods - the Moore neighborhood and the von Neumann neigborhood
		* In the Moore neigborhood, all the adjacent cells (cell above, below, to the left, and to the right) and the cells that are diagonally adjacent (diagonal top left, diagonal top right, diagonal bottom left, and diagonal bottom right).
		* In the von Neumann neigborhood, only directly adjacent cells are counted (the cells above, below, to the left, and to the right)
		* For more information, see https://en.wikipedia.org/wiki/Cellular_automaton
		*/

		if (!reevaluate && storeNeighbors && this._neighborhood[neigborhood]) {
			return this._neighborhood[neigborhood];
		}



		let neighborsArr = [];
		let newRow, newCol, cell;


		if (neigborhood === 'moore') {
			for (let xOffset = -1; xOffset <= 1; xOffset++) {
				for (let yOffset = -1; yOffset <= 1; yOffset++) {
					if (xOffset === 0 && yOffset === 0) {
						continue;
					}

					newRow = this.row + xOffset;
					newCol = this.col + yOffset;

					//Make sure that each neighbor exists in the matrix
					// addCell = this.parent.state[newRow] && this.parent.state[newRow][newCol];
					cell = this.parent.state?.[newRow]?.[newCol]

					// if(addCell){
					if (cell) neighborsArr.push(cell);

				}
			}
		} else if (neigborhood === 'vonneumann') {
			if (this.parent.state[this.row - 1]) {
				//Up
				neighborsArr.push(this.parent.state[this.row - 1][this.col]);
			}
			if (this.parent.state[this.row + 1]) {
				//Down
				neighborsArr.push(this.parent.state[this.row + 1][this.col]);
			}
			if (this.parent.state[this.row][this.col - 1]) {
				//Left
				neighborsArr.push(this.parent.state[this.row][this.col - 1]);
			}
			if (this.parent.state[this.row][this.col + 1]) {
				//Right
				neighborsArr.push(this.parent.state[this.row][this.col + 1]);
			}
		}
		if(storeNeighbors){
			this._neighborhood[neigborhood] = neighborsArr;
		}
		
		return neighborsArr;

	}

	/**
	 * Filters for the neighbors with a particular state.
	 * @param {*} value
	 * @param {string} [neighborhood='moore']
	 * @returns {Cell[]}
	*/
	neighborsWithValue(value, neighborhood = 'moore') {
		// I can forsee a possible issue here. If the state is like an object or a class or something, this might not work quite properly. At least for now, I would recommend finding neighbors with value manually (in your own code) if your state is something fancy like that. This doesn't work for Arrays, Objects, or Classes but does work for Strings and Numbers.
		let allNeighbors = this.neighbors(neighborhood);
		return allNeighbors.filter((cell) => cell.state === value);
	}

	/**
	 * Gets the members of this cell's row. 
	 **** This includes itself!! ****
	 * @returns {Cell[]}
	*/
	rowMembers() {
		return this.parent.state[this.row];
	}

	/**
	 * Gets the members of this cell's column. 
	 **** This includes itself!! ****
	 * @returns {Cell[]}
	*/
	columnMembers() {
		let columnMembers = [];

		for (let row = 0; row < this.parent.state.length; row++) {
			columnMembers[row] = this.parent.state[row][this.col];
		}

		return columnMembers;
	}
}

/**
 * The class that represents the Cellular Automaton. It stores the cells and has methods for changing all their states at once. It also handles drawing the cells.
*/
class CellularAutomaton {
	constructor() {
		
	}

	/**
	 * Draws the state of the CellularAutomaton onto the canvas.
	 * @param {Cell[][]} [boardState=this.state]
	*/
	draw(boardState = this.state) {
		/*
		// Basic validation but I feel like it slows down something that's already pretty slow.
		if(!this.ctx || !this.canvas){
			throw Error('The canvas is not defined.')
		}
		*/
		// boardState = boardState || this.state;
		for (let row = 0; row < this.numOfRows; row++) {
			for (let col = 0; col < this.numOfColumns; col++) {

				//Set the appropriate color based on the color function
				//So I have to do [y][x] because like the y is basically the row and x is the column and my array is designed to be done as [row][column]
				this.ctx.fillStyle = this.coloringFunction(boardState[row][col]);

				//For some reason I have to reverse the x and y for the below line for it to work
				// this.ctx.fillRect(row*this.widthOfCell, col*this.heightOfCell, this.widthOfCell, this.heightOfCell);
				this.ctx.fillRect(col * this.widthOfCell, row * this.heightOfCell, this.widthOfCell, this.heightOfCell)
			}
		}
	}

	static make2DArray(rows, columns, func = () => 0) {
		//The height determines the number of rows
		//The width determines the number of columns
		let matrix = [];
		for (let row = 0; row < rows; row++) {
			matrix[row] = [];
			for (let col = 0; col < columns; col++) {
				matrix[row][col] = func(row, col);
			}
		}
		return matrix;
	}

	each(callback, changeState = true) {

		let newState = CellularAutomaton.make2DArray(this.numOfRows, this.numOfColumns);

		for (let row = 0; row < this.numOfRows; row++) {
			for (let col = 0; col < this.numOfColumns; col++) {
				newState[row][col] = callback(this.state[row][col]);
			}
		}

		if (changeState) {
			for (let row = 0; row < this.numOfRows; row++) {
				for (let col = 0; col < this.numOfColumns; col++) {
					this.state[row][col].state = newState[row][col];
				}
			}

		}

		return newState;
	}

	bindCanvas(canvas) {
		if (canvas instanceof HTMLCanvasElement) {
			this.canvas = canvas;
			this.ctx = canvas.getContext('2d');
			return this;
		} else {
			throw TypeError('The element you attempted to bind is not an HTML Canvas.')
		}
	}


	setDimensions(widthOfCanvas, heightOfCanvas) {
		this.widthOfCanvas = widthOfCanvas;
		this.heightOfCanvas = heightOfCanvas;
		if (this.widthOfCell && this.heightOfCell && !this.numOfRows && !this.numOfColumns) {
			//As you can see, it's really important that the height is a multiple of the height of the cell and that the width is a multiple of the width of the cell.
			// As of right now, if it isn't an exact multiple, I'll have it throw an error
			if (this.heightOfCanvas % this.heightOfCell !== 0) {
				throw new Error('The height of the canvas is not an exact multiple of the height of the cell.');
			}
			if (this.widthOfCanvas % this.widthOfCell !== 0) {
				throw new Error('The width of the canvas is not an exact multiple of the width of the cell.');
			}
			this.numOfRows = this.heightOfCanvas / this.heightOfCell;
			this.numOfColumns = this.widthOfCanvas / this.widthOfCell;
		}
		return this;
	}

	setCellDimensions(widthOfCell, heightOfCell) {
		this.widthOfCell = widthOfCell;
		this.heightOfCell = heightOfCell;

		//This validation stuff may have to change because of gridding which will change basically everything.
		if (this.widthOfCanvas && this.heightOfCanvas && !this.numOfRows && !this.numOfColumns) {
			//As you can see, it's really important that the height is a multiple of the height of the cell and that the width is a multiple of the width of the cell.
			// As of right now, if it isn't an exact multiple, I'll have it throw an error
			if (this.heightOfCanvas % this.heightOfCell !== 0) {
				throw new Error('The height of the canvas is not an exact multiple of the height of the cell.');
			}

			if (this.widthOfCanvas % this.widthOfCell !== 0) {
				throw new Error('The width of the canvas is not an exact multiple of the width of the cell.');
			}

			this.numOfRows = this.heightOfCanvas / this.heightOfCell;
			this.numOfColumns = this.widthOfCanvas / this.widthOfCell;
		}

		return this;
	}

	setState(matrix) {

		this.state = matrix;

		this.numOfColumns = this.state[0].length;
		this.numOfRows = this.state.length;


		for (let row = 0; row < this.numOfRows; row++) {
			for (let col = 0; col < this.numOfColumns; col++) {
				this.state[row][col].parent = this;
			}
		}

		return this;
	}

	automaton(callback) {
		this.automatonFunction = callback;
		return this;
	}

	setColoringFunction(colFunc) {
		this.coloringFunction = colFunc;
		return this;
	}

	update(changeState = false, iters = 1, autodraw = Boolean(this.canvas)) {
		let matrix;

		for (let i = 0; i < iters; i++) {
			matrix = this.automatonFunction(this);
		}

		if (changeState) {
			for (let row = 0; row < this.numOfRows; row++) {
				for (let col = 0; col < this.numOfColumns; col++) {
					this.state[row][col].state = matrix[row][col];
				}
			}
		}

		if (autodraw) this.draw(this.state);

		return this;
	}
}