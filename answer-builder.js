'use strict';

var AnswerBuilder = function (){
  this.format = {
    italic: {
      pattern: /(^|[^_\*])([_\*])([^_\*]+)(\2)/g,
      replacement: '$1_$3_'
    },
    bold: {
      pattern: /(__|\*\*|_\*|\*_)([^_\*]+)(__|\*\*|_\*|\*_)/g,
      replacement: '*$2*'
    },
    spoiler: {
      pattern: /(%%)([^%]+)(\1)/g, 
      replacement: function ($0, $1, $2) { return new Array($2.length + 1).join('█'); }
    }
  };
  this.data = require('./answers_data.json');
  this.cleanupRegExps = this.buildCleanupRegExps(this.data);
  this.commandRegExps = this.buildCommandRegExps(this.data);
  this.postcountRegExps = this.buildPostCountRegExps(this.data);
}

AnswerBuilder.prototype.buildCleanupRegExps = function (data) {
  var cleanupRegExps = [];
  for(var i in data.specials) {
    var specialText = data.specials[i];
    cleanupRegExps.push(new RegExp(this.escapeRegExp(specialText), 'g'))
  }
  for(var i in data.postcount.template) {
    var templateText = data.postcount.template[i];
    templateText = this.escapeRegExp(templateText).replace(/%\\\(.*\\\)/g, '.*');
    cleanupRegExps.push(new RegExp(templateText, 'g'))
  }
  return cleanupRegExps;
}

AnswerBuilder.prototype.escapeRegExp = function (str) {
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

AnswerBuilder.prototype.buildCommandRegExps = function (data) {
  var commandRegExps = {};
  for(var i in data.commands) {
    var commandText = data.commands[i];
    commandRegExps[i] = new RegExp(commandText, 'gim');
  }
  return commandRegExps;
}

AnswerBuilder.prototype.buildPostCountRegExps = function (data) {
  var postcountRegExps = {};
  for(var i in data.postcount.placeholders) {
    var regexpText = data.postcount.placeholders[i];
    postcountRegExps[i] = new RegExp(regexpText, 'gim');
  }
  return postcountRegExps;
}

AnswerBuilder.prototype.buildAnswer = function (answer) {
  this.formatText(answer);
  this.cleanupText(answer);
  this.addAbuText(answer);
  if (this.addThanksText(answer)) {
    return answer;
  }
  if (this.addBanText(answer)) {
    return answer;
  }
  this.addPostCountText(answer);
  return answer;
}

AnswerBuilder.prototype.formatText = function (answer) {
  for(var i in this.format) {
    var format = this.format[i];
    answer.text = answer.text.replace(format.pattern, format.replacement);
  }
}

AnswerBuilder.prototype.cleanupText = function (answer) {
  this.cleanupRegExps.forEach(function(cleanupRegExp) {
    answer.text = answer.text.replace(cleanupRegExp, '');
  });
}

AnswerBuilder.prototype.canAddAbuText = function (answer) {
  return this.data.authorized_abu_usernames.indexOf(answer.username) > -1;
}

AnswerBuilder.prototype.addAbuText = function (answer) {
  if (!this.canAddAbuText(answer)) {
    return false;
  } 

  answer.text = answer.text.replace(this.commandRegExps.abu, this.data.specials.abu+'$1');
  return true;
}

AnswerBuilder.prototype.addThanksText = function (answer) {
  var thxRegExp = this.commandRegExps.thx;
  if (!thxRegExp.test(answer.text)){
    thxRegExp.lastIndex = 0;
    return false;
  } 

  thxRegExp.lastIndex = 0;
  answer.text = answer.text + "\n\n" + this.data.specials.thx;
  return true;
}

AnswerBuilder.prototype.addBanText = function (answer) {
  var banRegExp = this.commandRegExps.ban;
  if (!banRegExp.test(answer.text)){
    banRegExp.lastIndex = 0;
    return false;
  } 

  banRegExp.lastIndex = 0;
  answer.text = answer.text.replace(banRegExp, '$1') + "\n\n" + this.data.specials.ban;
  banRegExp.lastIndex = 0;
  return true;
}

AnswerBuilder.prototype.addPostCountText = function (answer) {
  var postcountRegExp = this.commandRegExps.postcount;
  if (!postcountRegExp.test(answer.text)){
    postcountRegExp.lastIndex = 0;
    return false;
  } 

  postcountRegExp.lastIndex = 0;
  answer.text = answer.text + "\n\n" + this.buildPostCountText();
  return true;
}

AnswerBuilder.prototype.buildPostCountText = function () {
  var counterRegExp = this.postcountRegExps.count,
      statusRegExp = this.postcountRegExps.status,
      randomStatus = this.data.postcount.statuses[this.randomNumber(this.data.postcount.statuses.length)],
      text = this.data.postcount.template.threads_count.replace(counterRegExp, this.randomNumber(500)) + '\n'
           + this.data.postcount.template.posts_count.replace(counterRegExp, this.randomNumber(1000)) + '\n'
           + this.data.postcount.template.online_days.replace(counterRegExp, this.randomNumber(365)) + '\n'
           + this.data.postcount.template.status.replace(statusRegExp, randomStatus);
  return text;
}

AnswerBuilder.prototype.randomNumber = function (max) {
  return Math.floor(Math.random()*max);
}

module.exports = new AnswerBuilder;
