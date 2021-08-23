import CellularAutomaton from './CellularAutomaton.js';

var ca = new CellularAutomaton();

let randomArr = ca.make_matrix(70, 60, () => Math.floor(Math.random() * 2))

ca.setDimensions(700, 600, 10)
  .setState(randomArr)
  .bindCanvas(document.getElementById('board'))
  .automaton(function (matrix) {
    //Conway's game of life
    var _matrix = ca.deepCopy(matrix);
    var neighbors_matrix = [];
    for (let x = 0; x < matrix.length; x++) {
      neighbors_matrix[x] = []
      for (let y = 0; y < matrix[0].length; y++) {
        let neighbors = ca.countNeighbors(_matrix, x, y);
        neighbors_matrix[x][y] = neighbors;
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

// Start UI JavaScript

var interval1 = null;

document.getElementById('update').addEventListener("click", function () {
  ca.update();
});

document.getElementById('autoUpdate').addEventListener("click", function(){
  if(!interval1){
    interval1 = setInterval(
      function(){
        document.getElementById('update').click()
      }
      , 300);
  }
});

document.getElementById('stopAutoUpdate').addEventListener("click", function(){
  if(interval1){
    clearInterval(interval1);
    interval1 = null;
  }
});

document.getElementById('restart').addEventListener("click", function () {
  ca.setState(ca.make_matrix(70, 60, () => Math.floor(Math.random() * 2))).draw(ca.state);
});