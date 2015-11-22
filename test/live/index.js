var Deferred = require('../../deferred');

function test(){
	var def = Deferred();
	
	setTimeout(function(){
		console.log("resolve");
		def.resolve();
		// def.reject();
		// def.notify();
	}, 1000);
	
	return def.promise;
}

// test().then(function(){
// 	// Do something (success)
// },function(){
// 	// Do something (error)
// },function(){
// 	// Do something (notify)
// });

test()
.then(test)
.then(test)
.then(function(){
	// Done
	console.log("done");
});