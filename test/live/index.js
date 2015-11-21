var Deferred = require('../../deferred');

function test(){
	var def = Deferred();
	setTimeout(function(){
		def.resolve();
	},500);
	return def.promise;
}

test().success(function(){
	console.log("success");
});