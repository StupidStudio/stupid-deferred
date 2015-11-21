var Deferred = require('../../deferred');
// function test(){
// 	var def = Deferred();
// 	def.resolve();
// 	def.reject();
// 	return def.promise;
// }
// test().success(function(){
// 	console.log("success");
// }).error(function(){
// 	console.log("error");
// }).notify(function(){
// 	console.log("notify");
// });
var arg1 = "arg1";
var arg2 = "arg2";
var arg3 = "arg3";
function test(){
	var def = Deferred();
	setTimeout(function(){
		def.resolve(arg1, "test1");
	}, 1);
	setTimeout(function(){
		def.reject(arg2, "test2");
	}, 2);
	setTimeout(function(){
		def.notify(arg3, "test3"); 
	}, 3);
	return def.promise;
}
test().success(function(param, param2){
	console.log("success", arg1 === param, "test1" === param2);
}).error(function(param){
	// console.log("error", param, arg2);
}).notify(function(param){
	// console.log("notify", param, arg3);
});