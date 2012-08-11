describe('Promise', function() {
	it('should have the isRscPromise property', function() {
		var promise = new rsc.Promise(function() {});
		expect(promise.isRscPromise).toBe(true);

		// should not be writable
		promise.isRscPromise = false;
		expect(promise.isRscPromise).toBe(true);
	});

	it('should execute the resolve with the promise as the context', function() {
		var context;
		var executed = false;
		var resolve = function() {
				executed = true;
				context = this;
			};

		var promise = new rsc.Promise(resolve);

		promise.resolve();

		expect(executed).toBe(true);
		expect(context).toEqual(promise);
	});

	describe('event handling', function() {
		it('should setup a pending event handler', function() {
			debugger;
			var promise = new rsc.Promise();

			promise.defineEventProperties('myevent', 'myotherevent');

			var callback = function() {
					return 3;
				};

			promise.myevent = callback;

			expect(promise.pending.myevent).toEqual(callback);
			expect(promise.pending.myotherevent).toBeUndefined();

			promise.myotherevent = callback;
			expect(promise.pending.myotherevent).toEqual(callback);
		});

		it('should resolve pending event handlers', function() {
			var mockExtTarget = {
				on: function(eventName, handler) {
					this[eventName] = handler;
				}
			};

			var promise = new rsc.Promise(function() {
				this.cmp = mockExtTarget;
			});

			promise.defineEventProperties('myevent');

			var callback = function() {
					return 4;
				};
			promise.myevent = callback;

			expect(promise.pending.myevent).toEqual(callback);

			promise.resolve();

			expect(promise.pending.myevent).toBeUndefined();

			expect(mockExtTarget.myevent).toEqual(callback);
		});

		it('should allow wrapping callbacks', function() {
			var mockExtTarget = {
				on: function(eventName, handler) {
					this[eventName] = handler;
				}
			};

			var promise = new rsc.Promise(function() {
				this.cmp = mockExtTarget;
			});

			var givenCallback;
			var wrapper = function(callback) {
				givenCallback = callback;
				return 'wrapped successfully';
			};

			promise.defineEventProperties({
				myevent: wrapper
			});

			var providedCallback = function() {};
			promise.myevent = providedCallback;

			expect(promise.pending.myevent).toBe('wrapped successfully');
			expect(givenCallback).toEqual(providedCallback);
		});
	});

	describe('methods', function() {
		var cmp;
		var promise;
		beforeEach(function() {
			cmp = {
				foo: function() { return 'foo'; },
				bar: function() { return 'bar'; }
			};
			promise = new rsc.Promise(function() {
				this.cmp = cmp;
			});
		});

		it('should surfaceMethods with a single string', function() {
			promise.surfaceMethods('foo');
			promise.surfaceMethods('bar');

			promise.resolve();

			expect(promise.foo()).toBe('foo');
			expect(promise.bar()).toBe('bar');
		});

		it('should surfaceMethods with an array', function() {
			promise.surfaceMethods(['foo', 'bar', 'doesntexist']);

			promise.resolve();

			expect(promise.foo()).toBe('foo');
			expect(promise.bar()).toBe('bar');
			expect(promise.doesntexist()).toBeUndefined();
		});

		it('should surfaceMethods with a config', function() {
			promise.surfaceMethods({
				foo: 'diffNameForFoo',
				bar: 'diffNameForBar',
				doesntexist: 'diffNameForDoesntExist'
			});

			promise.resolve();

			expect(promise.diffNameForFoo()).toBe('foo');
			expect(promise.diffNameForBar()).toBe('bar');
			expect(promise.diffNameForDoesntExist()).toBeUndefined();
		});

		it('should surfaceMethodsAsProperties', function() {
			promise.surfaceMethodsAsProperties({
				foo: 'propNameFoo'
			});

			promise.resolve();

			expect(promise.propNameFoo).toBe('foo');
		});
	});
});