//  FREEZE CODE BEGIN
import fetch from 'node-fetch';

if (process.argv.length === 2) {
  console.error('Expected at least one argument.');
  console.log(process.argv);
  process.exit(1);
}
//  FREEZE CODE END

// Construct your params

// WRITE YOUR CODE HERE
const params = new URLSearchParams();
params.append('name', process.argv[2]);



const response = await fetch(`http://api.genderize.io?${params.toString()}`);

// WRITE YOUR CODE HERE

//  FREEZE CODE BEGIN

const data = await response.json();
console.log(data);
//  FREEZE CODE END