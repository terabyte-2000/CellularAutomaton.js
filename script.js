// Start UI JavaScript

let interval1 = null;

document.getElementById('GoL_update').addEventListener("click", function update_GoL(){
  gameOfLife.update(false,50);
});

document.getElementById('GoL_autoUpdate').addEventListener("click", function autoUpdate_GoL(){
  if(!interval1){
    interval1 = setInterval(
      function(){
        document.getElementById('GoL_update').click();
      }
      , 300);
  }
});

document.getElementById('GoL_stopAutoUpdate').addEventListener("click", function stopAutoUpdate_GoL(){
  if(interval1){
    clearInterval(interval1);
    interval1 = null;
  }
});

document.getElementById('GoL_restart').addEventListener("click", function restart_GoL() {
  gameOfLife.each(() => getRandomInt(0,1));
  
  gameOfLife.draw();
});


//Start avgOfSurroundings UI

document.getElementById('blur_update').addEventListener('click', function update_blur(){
  avgOfSurroundings.update(true);
});

document.getElementById('blur_restart').addEventListener('click', function restart_blur(){
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
