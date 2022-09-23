'use strict';

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
  if(howMany === 1) return res[0];
  return res;
}