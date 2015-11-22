# Stupid Deferred
A simple deferred lib to be used in a browserify workflow.

## Usage

Using the deferred to resolve, reject or notify on an event.

```javascript
var Deferred = require('stupid-deferred');
function test(){
	var def = Deferred();
	
	setTimeout(function(){
		def.resolve();
		// def.reject();
		// def.notify();
	}, 1000);
	
	return def.promise;
}

test().success(function(){
	// Do something
}).error(function(){
	// Do something
}).notify(function(){
	// Do something
});
```

Using the deferred to chain promises. The chain breaks if first function (success) isn't a resolved promise.

```javascript
var Deferred = require('stupid-deferred');
function test(){
	var def = Deferred();
	
	setTimeout(function(){
		def.resolve();
		// def.reject();
		// def.notify();
	}, 1000);
	
	return def.promise;
}

test().then(function(){
	// Do something (success)
},function(){
	// Do something (error)
},function(){
	// Do something (notify)
});

test()
.then(test)
.then(test)
.then(function(){
	// Done
});
```