//  FREEZE CODE BEGIN
import process from 'node:process';
import fetch from 'node-fetch';

if (process.argv.length === 2) {
  console.error('Expected at least one argument.');
  console.log(process.argv);
  process.exit(1);
}
//  FREEZE CODE END

// Construct your params
// WRITE YOUR CODE HERE

//https://datausa.io/api/data?drilldowns=Nation&measures=Population&year=latest
const params = new URLSearchParams();
params.append('drilldowns', "Nation");
params.append('measures', "Population");
params.append('year', process.argv[2]);



const response = await fetch(`https://datausa.io/api/data?${params.toString()}`);


// WRITE YOUR CODE HERE

//  FREEZE CODE BEGIN

const data = await response.json();
console.log(data);
//  FREEZE CODE END