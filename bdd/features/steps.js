const {Given, When, Then} = require('@cucumber/cucumber');
const assert = require('assert');
const isEven = require('../isEven');

Given('The number is {float}', function (float) {
    this.number = float;
  });
  
  When('asking if the number is even', function () {
    this.actualAnswer = isEven(this.number);
  });
  
  Then('I should see the output {string}', function (string) {
    assert.equal(this.actualAnswer, string);
  });