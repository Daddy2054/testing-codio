import process from 'node:process';
import fetch from 'node-fetch';

if (process.argv.length === 2) {
  console.error('Expected at least one argument.');
  console.log(process.argv);
  process.exit(1);
}

const url = 'http://text-processing.com/api/sentiment/';
const params = new URLSearchParams();
params.append('text', process.argv[2]);

const response = await fetch(url, {method: 'POST', body: params});
const data = await response.json();

console.log(data);
