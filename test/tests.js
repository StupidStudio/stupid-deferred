var test = require('tape');
var Event = require('../deferred');

test('Returns the same object', function (t) {
    t.plan(1);
	var event = Event();
	var name = 'im a stupid string';
	event.on('event-string', function(param){
		t.equal(param, name);
	});
	event.trigger('event-string', name);
});


test('Passing argument', function (t) {
    t.plan(3);
    var event = Event();
	var arg1 = 'arg one';
	var arg2 = {text: 'arg two'};
	var arg3 = ['arg one'];
	event.on('event-string', function(param1, param2, param3){
		t.equal(param1, arg1);
		t.equal(param2, arg2);
		t.equal(param3, arg3);
	});
	event.trigger('event-string', arg1, arg2, arg3);
});


test('Anonymous functions should be overriden if they are "the same"', function (t) {
    t.plan(1);
    var event = Event();
    var calls = 0;
	event.on('event-string', function(){
		calls += 1;
	});
	event.on('event-string', function(){
		calls += 1;
	});
	event.on('event-string', function(){
		var test = "";
		calls += 1;
	});
	event.trigger('event-string');
	t.equal(calls, 2);
});


test('Pre-triggered call should be queued and called later on event.on', function (t) {
    t.plan(2);
    var event = Event();
    var arg1 = "arg1";
    var arg2 = "arg2";
	event.trigger('event-string', arg1, arg2);
	event.on('event-string', function(param1, param2){
		t.equal(arg1, param1);
		t.equal(arg2, param2);
	});
});