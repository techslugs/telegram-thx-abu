var test = require('tape');
var answerBuilder = require('../answer-builder.js');
var data = require('../answers_data.json');

test('spoiler test', function(t){
	t.deepEqual(answerBuilder.buildAnswer({username: undefined, text: "%%spoiler%%"}).text, '███████', "Bad spoiler")
	t.deepEqual(answerBuilder.buildAnswer({username: undefined, text: "%spoiler%"}).text, '%spoiler%', "Bad spoiler - should use 2 %'s instead of 1")
	t.deepEqual(answerBuilder.buildAnswer({username: undefined, text: "%%spoiler"}).text, '%%spoiler', "Bad spoiler - misses %% in the end")
	t.deepEqual(answerBuilder.buildAnswer({username: undefined, text: "spoiler%%"}).text, 'spoiler%%', "Bad spoiler - misses %% in the beginning")
	t.deepEqual(answerBuilder.buildAnswer({username: undefined, text: "text%%spoiler%%text"}).text, 'text███████text', "Bad spoiler - in text")
	t.end()
})

test('italic test', function(t){
	t.deepEqual(answerBuilder.buildAnswer({username: undefined, text: "*italic*"}).text, '_italic_', "Bad italic - asteriks")
	t.deepEqual(answerBuilder.buildAnswer({username: undefined, text: "text*italic*text"}).text, 'text_italic_text', "Bad italic with asteriks - in text")
	t.deepEqual(answerBuilder.buildAnswer({username: undefined, text: "_italic_"}).text, '_italic_', "Bad italic - underscore")
	t.deepEqual(answerBuilder.buildAnswer({username: undefined, text: "text_italic_text"}).text, 'text_italic_text', "Bad italic with underscore - in text")
	t.deepEqual(answerBuilder.buildAnswer({username: undefined, text: "_italic"}).text, "_italic", "Bad italic with underscore in the begging")
	t.deepEqual(answerBuilder.buildAnswer({username: undefined, text: "italic_"}).text, "italic_", "Bad italic with underscore in the end")
	t.deepEqual(answerBuilder.buildAnswer({username: undefined, text: "*italic"}).text, "*italic", "Bad italic with asteriks in the begging")
	t.deepEqual(answerBuilder.buildAnswer({username: undefined, text: "italic*"}).text, "italic*", "Bad italic with asteriks in the end")
	t.end()
})

test('bold test', function(t){
	t.deepEqual(answerBuilder.buildAnswer({username: undefined, text: "__bold__"}).text, '*bold*', "Bad bold - underscores")
	t.deepEqual(answerBuilder.buildAnswer({username: undefined, text: "text__bold__text"}).text, 'text*bold*text', "Bad bold with underscores - in text")
	t.deepEqual(answerBuilder.buildAnswer({username: undefined, text: "**bold**"}).text, '*bold*', "Bad bold - asterikses")
	t.deepEqual(answerBuilder.buildAnswer({username: undefined, text: "text**bold**text"}).text, 'text*bold*text', "Bad bold with asterikses - in text")
	t.deepEqual(answerBuilder.buildAnswer({username: undefined, text: "__bold"}).text, "__bold", "Bad bold with underscores in the begging")
	t.deepEqual(answerBuilder.buildAnswer({username: undefined, text: "bold__"}).text, "bold__", "Bad bold with underscores in the end")
	t.deepEqual(answerBuilder.buildAnswer({username: undefined, text: "**bold"}).text, "**bold", "Bad bold with asterikses in the begging")
	t.deepEqual(answerBuilder.buildAnswer({username: undefined, text: "bold**"}).text, "bold**", "Bad bold with asterikses in the end")
	t.end()
})

test('##Abu## test', function(t){
	for(var i in data.authorized_abu_usernames) {
			t.deepEqual(answerBuilder.buildAnswer({username: data.authorized_abu_usernames[i], text: "/abu goj"}).text, "*##Abu##* goj", "Authorized username - "+data.authorized_abu_usernames[i])
			t.deepEqual(answerBuilder.buildAnswer({username: data.authorized_abu_usernames[i], text: "/abu "}).text, "*##Abu##* ", "Authorized username - "+data.authorized_abu_usernames[i])
		}
	t.deepEqual(answerBuilder.buildAnswer({username: "unauthorized", text: "/abu goj"}).text, "/abu goj", 'Unauthorized username - text should not be translated')
	t.end()
})

test('thx Abu test', function(t){
	t.deepEqual(answerBuilder.buildAnswer({username: undefined, text: "Спасибо Абу"}).text, "Спасибо Абу\n\n_Абу благословил этот пост._", "Bad \"Thx Abu\" text")
	t.deepEqual(answerBuilder.buildAnswer({username: undefined, text: "Спасибо     Абу"}).text, "Спасибо     Абу\n\n_Абу благословил этот пост._", "Bad \"Thx Abu\" text")
	t.deepEqual(answerBuilder.buildAnswer({username: undefined, text: "Спасибо, Абу"}).text, "Спасибо, Абу\n\n_Абу благословил этот пост._", "Bad \"Thx Abu\" text")
	t.deepEqual(answerBuilder.buildAnswer({username: undefined, text: "Спасибо,    Абу"}).text, "Спасибо,    Абу\n\n_Абу благословил этот пост._", "Bad \"Thx Abu\" text")
	t.deepEqual(answerBuilder.buildAnswer({username: undefined, text: "Спасибо, badtext Абу"}).text, "Спасибо, badtext Абу", "Bad \"Thx Abu\" text - should only tolerate whitespaces, while a non-whitespace character(s) have been found")
	t.deepEqual(answerBuilder.buildAnswer({username: undefined, text: "Спасибо badtext Абу"}).text, "Спасибо badtext Абу", "Bad \"Thx Abu\" text - should only tolerate whitespaces, while a non-whitespace character(s) have been found")
	t.deepEqual(answerBuilder.buildAnswer({username: undefined, text: "text Спасибо Абу text"}).text, "text Спасибо Абу text\n\n_Абу благословил этот пост._", "Bad \"Thx Abu\" text - in text")
	t.end()
})
/*
TODO: 
	-ban
	-postcount
*/