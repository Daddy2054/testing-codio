//  FREEZE CODE BEGIN
import fetch from 'node-fetch';

//  FREEZE CODE END


//api.zippopotam.us/us/90210
const response   = await fetch(`http://api.zippopotam.us/us/02138`);
// WRITE YOUR CODE HERE

//  FREEZE CODE BEGIN
const data = await response.json();
console.log(data);
//  FREEZE CODE END