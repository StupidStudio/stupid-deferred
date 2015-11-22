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


test('Params is pass correctly', function(t){
	t.plan(5);
	var arg1 = "arg1";
	var arg2 = "arg2";
	var arg3 = "arg3";
	var arg4 = "arg4";
	function test(){
		var def = Deferred();
		setTimeout(function(){
			def.resolve(arg1, arg4);
		}, 1);
		setTimeout(function(){
			def.reject(arg2);
		}, 2);
		setTimeout(function(){
			def.notify(arg3);
		}, 3);
		setTimeout(function(){
			def.notify();
		}, 4);
		return def.promise;
	}
	test().success(function(param, param2){
		t.equal(param, arg1);
		t.equal(param2, arg4);
	}).error(function(param){
		t.equal(param, arg2);
	}).notify(function(param){
		if(param){
			t.equal(param, arg3);
		}else{
			t.notEqual(param, arg3);
		}
	});
});

test('Deferred is chainable (resolve, reject, notify)', function(t){
	t.plan(6);
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
		// error
		t.ok(true);
	}, function(){
		// notify
		t.ok(true);
	});
});
