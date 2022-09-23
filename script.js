// Start UI JavaScript

let interval1 = null;

document.getElementById('update').addEventListener("click", function update_G_o_L(){
  gameOfLife.update(false,50);
});

document.getElementById('autoUpdate').addEventListener("click", function autoUpdate_G_o_L(){
  if(!interval1){
    interval1 = setInterval(
      function(){
        document.getElementById('update').click();
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
  gameOfLife.each(() => getRandomInt(0,1));
  
  gameOfLife.draw();
});


//Start avgOfSurroundings UI

document.getElementById('avgOfSurroundingsUpdate').addEventListener('click', function update_blur(){
  avgOfSurroundings.update(true);
});

document.getElementById('avgOfSurroundingsRestart').addEventListener('click', function restart_blur(){
  avgOfSurroundings.each(() => getRandomInt(0,255,3));

  avgOfSurroundings.draw();
});


document.getElementById('sandpiles_update').addEventListener('click', function(){
  sandpiles.update(true);
});

document.getElementById('sandpiles_restart').addEventListener('click', function(){

	const middleRow = Math.floor(sandpilesRows/2);
	const middleCol = Math.floor(sandpilesCols/2);
	
  sandpiles.each( (cell) => {
		if(cell.row === middleRow && cell.col === middleCol){ 
			return sandInMiddle
		}
		
		return 0
	});

  sandpiles.draw();
});
