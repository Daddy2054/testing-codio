import fetch from 'node-fetch';

const response = await fetch('https://api.weather.gov/alerts/active');
const data = await response.json();

console.log(data);