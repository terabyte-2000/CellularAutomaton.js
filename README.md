# CellularAutomaton.js
### A fairly simple library for creating cellular automata
---

## How to use:
Note: This example uses [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life/) as the example automaton
```html
  <!-- index.html -->
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>Demonstration of CellularAutomaton.js</title> 
    </head>
    <body>
      <h1>Conway's Game of Life</h1>
      <canvas width="500px" height="500px">Oh no! Your browser does not support the HTML5 canvas element needed for this feature to work</canvas>

      <script src="script.js" type="module"></script>
    </body>
  </html>
```
```js
  // script.js

  // This is the first way to do it

  // Import the CellularAutomaton.js 
  // You may have to change the path depending on the location you have stored the script in
  import CellularAutomaton from './CellularAutomaton.js';

  // Make a new instance of the CellularAutomaton class
  var ca = new CellularAutomaton();

  // Make a random 50x50 array with the values 0 and 1 to use as the original input
  // This means that there will be 1,000 cells in the result
  var randomMatrix = ca.make_matrix(50, 50, function (){
    Math.floor(Math.random() * 2);
  });
  // Set the width and height of our canvas (which is defined above to be 500px by 500px) and the width of each cell (cells are always squares for now and here we are setting our cell width to be 10px)
  ca.setDimensions(500, 500, 10);

  // Setting the state of the automaton to our random matrix of 0s and 1s
  ca.setState(randomMatrix);

  // Bind a canvas to use for displaying the output of the cellular automaton
  ca.bindCanvas(document.querySelector('canvas'));

  // Add the rules for the cellular automaton (the state is updated by the result of the callback and the next time the callback is called, the new state is passed in)
  ca.automaton(function(matrix) {
      //Conway's game of life
      // This is the callback
      var _matrix = ca.deepCopy(matrix);
      for (var x = 0; x < matrix.length; x++) {
        for (var y = 0; y < matrix[0].length; y++) {
          var neighbors = ca.countNeighbors(_matrix, x, y);
          if ((neighbors < 2 || neighbors > 3) && _matrix[x][y] === 1) {
            matrix[x][y] = 0;
          } else if (neighbors === 3 && _matrix[x][y] === 0) {
            matrix[x][y] = 1;
          }
        }
      }
      return matrix;
  }, ['black', 'white']);
  // The last part (the black, white part) is what is the color array; a value in the matrix's color is what is at that index in the color array
  //For example, in this case the value 0 in the matrix corresponds to the color black and the value 1 corresponds to the color white

  // Draw the current state on the matrix (the random 1s and 0s)
  ca.draw(ca.state);

  // Update the state with the callback 
  // The update function takes a boolean argument that tells the object whether to automatically update the drawing on the canvas after it has updated the state (true means that it automatically updates).
  ca.update(true);
```

```js 
  // script.js

  //You can also do it this way

  // The comments in the above script also apply here

  import CellularAutomaton from './CellularAutomaton.js';

  var ca = new CellularAutomaton();

  var randomMatrix = ca.make_matrix(50, 50, function (){
    Math.floor(Math.random() * 2);
  });

  ca.setDimensions(500, 500, 10)
    .setState(randomMatrix)
    .bindCanvas(document.querySelector('canvas'))
    .automaton(function(matrix) {
      //Conway's game of life
      var _matrix = ca.deepCopy(matrix);
      for (var x = 0; x < matrix.length; x++) {
        for (var y = 0; y < matrix[0].length; y++) {
          var neighbors = ca.countNeighbors(_matrix, x, y);
          if ((neighbors < 2 || neighbors > 3) && _matrix[x][y] === 1) {
            matrix[x][y] = 0;
          } else if (neighbors === 3 && _matrix[x][y] === 0) {
            matrix[x][y] = 1;
          }
        }
      }
      return matrix;
  }, ['black', 'white'])
    .draw(ca.state)
    .update(true);
```