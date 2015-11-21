var test = require('tape');
var Deferred = require('../deferred');

test('Deferred is being: success, reject, notify x 2', function(t){
	t.plan(4);
	function test(){
		var def = Deferred();
		setTimeout(function(){
			def.resolve();
		}, 1);
		setTimeout(function(){
			def.reject();
		}, 2);
		setTimeout(function(){
			def.notify();
		}, 3);
		setTimeout(function(){
			def.notify();
		}, 4);
		return def.promise;
	}
	test().success(function(){
		t.ok(true);
	}).error(function(){
		t.ok(true);
	}).notify(function(){
		t.ok(true);
	});
});

test('Deferred is chainable (working resolve, reject, notify)', function(t){
	t.plan(5);
	function test(){
		var def = Deferred();
		setTimeout(function(){
			def.notify();
		}, 1);
		setTimeout(function(){
			def.reject();
		}, 2);
		setTimeout(function(){
			def.resolve();
			t.ok(true);
		}, 3);
		return def.promise;
	}
	test().then(test,
	function(){
		// error
		t.ok(true);
	}, function(){
		// notify
		t.ok(true);
	}).then(function(){
		t.ok(true);
	});
});
