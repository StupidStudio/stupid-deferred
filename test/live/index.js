var Deferred = require('../../deferred');
function test(){
	var def = Deferred();
	def.resolve();
	def.reject();
	return def.promise;
}
test().success(function(){
	console.log("success");
}).error(function(){
	console.log("error");
}).notify(function(){
	console.log("notify");
});