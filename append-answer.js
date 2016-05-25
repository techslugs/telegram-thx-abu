'use strict';

var answers = require('./answers.json');

var appendAnswer = function (sourceText) {
  var answer = answers[Math.floor(Math.random()*answers.length)];
  return sourceText + "\n\r\n\r" + answer;
}

module.exports = appendAnswer;
