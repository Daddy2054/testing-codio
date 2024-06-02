import process from 'node:process';
import fetch from 'node-fetch';

if (process.argv.length === 2) {
  console.error('Expected at least one argument.');
  console.log(process.argv);
  process.exit(1);
}

const params = new URLSearchParams();
params.append('area', process.argv[2].toUpperCase());

const response = await fetch(`https://api.weather.gov/alerts/active?${params.toString()}`);
const data = await response.json();

console.log(data);