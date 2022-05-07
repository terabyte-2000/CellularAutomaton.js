let gameOfLife = new CellularAutomaton();

//Utility random integer function (adapted from  https://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range)
/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * The value is no lower than min (or the next integer greater than min
 * if min isn't an integer) and no greater than max (or the next integer
 * lower than max if max isn't an integer).
 * Using Math.round() will give you a non-uniform distribution!
*/
function getRandomInt(min=0, max=1, howMany=1) {
  min = Math.ceil(min);
  max = Math.floor(max);

  let res = [];
  for(let i = 0; i < howMany; i++){
    res[i] = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  //If howMany is just 1, they only want 1 randint. So just return the first number. Otherwise, return the array
  if(howMany === 1) return res[0]; else return res;
  // return (howMany === 1) ? res[0] : res;
  
}


function conwaysGameOfLife(instance) {
  //Conway's game of life
  
  return instance.each((cell) => {
    let neighbors = cell.countLiveNeighbors();

    if(neighbors === 3){
      // If it has three live neighbors and is dead, it becomes alive.
      //Technically we don't need the cell.state === 0 since it will be alive anyway so nobody cares
      return 1;
    }
    
    //If if has less than 2 or more than 3 live neighbors and it's alive, it becomes dead.
    //Technically we don't need the cell.state === 1 since it will be dead regardless so nobody cares!
    if(neighbors < 2 || neighbors > 3){
      return 0;
    }
    
    //If it is alive and has 2 or 3 live neighbors or is dead has does not have exactly 3 live neighbors, it stays how it is
    //Given the current configuration of the if's above, this only triggers if neighbors === 2.
    return cell.state;
  
  });
}

let conwayRandomArr = CellularAutomaton.make_matrix(60, 70, (i, j) => new Cell(10, 10, i*10, j*10, getRandomInt(0,1)) );

let conwayColoringFunc = (cell) => cell.state === 0 ? 'white' : 'black';

gameOfLife.setDimensions(600, 700, 10)
  .setState(conwayRandomArr)
  .bindCanvas(document.getElementById('gameOfLifeBoard'))
  .automaton(conwaysGameOfLife, conwayColoringFunc)
  .draw();


// Average of Surroundings (Blur effect)
let avgOfSurroundings = new CellularAutomaton();
let blurRandomArr = CellularAutomaton.make_matrix(60, 70, (i,j) => {
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

let avgOfSurr_coloringFunc = (cell) => `rgb(${cell.state[0]},${cell.state[1]}, ${cell.state[2]})`;

avgOfSurroundings
  .setDimensions(600, 700, 10)
  .setState(blurRandomArr)
  .bindCanvas(document.getElementById('avgOfSurroundingsBoard'))
  .automaton(blur, avgOfSurr_coloringFunc)
  .draw();


// Start UI JavaScript

let interval1 = null;

document.getElementById('update').addEventListener("click", function update_G_o_L(){
  gameOfLife.update();
});

document.getElementById('autoUpdate').addEventListener("click", function autoUpdate_G_o_L(){
  if(!interval1){
    interval1 = setInterval(
      function(){
        document.getElementById('update').click()
      }
      , 300);
  }
});

document.getElementById('stopAutoUpdate').addEventListener("click", function stopAutoUpdate_G_o_L(){
  if(interval1){
    clearInterval(interval1);
    interval1 = null;
  }
});

document.getElementById('restart').addEventListener("click", function restart_G_o_L() {
  let matrix = gameOfLife.each(cell => getRandomInt(0,1));
  
  gameOfLife.draw();
});


//Start avgOfSurroundings UI

document.getElementById('avgOfSurroundingsUpdate').addEventListener('click', function update_blur(){
  avgOfSurroundings.update();
});

document.getElementById('avgOfSurroundingsRestart').addEventListener('click', function restart_blur(){
  let matrix = avgOfSurroundings.each(cell => getRandomInt(0,255,3));

  avgOfSurroundings.draw();
});
