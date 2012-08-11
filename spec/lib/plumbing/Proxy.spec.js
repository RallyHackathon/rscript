describe('Proxy', function() {
	it('should have the isRscProxy property', function() {
		var proxy = new rsc.Proxy(function() {});
		expect(proxy.isRscProxy).toBe(true);

		// should not be writable
		proxy.isRscProxy = false;
		expect(proxy.isRscProxy).toBe(true);
	});

	it('should execute the resolve with the proxy as the context', function() {
		var context;
		var executed = false;
		var resolve = function() {
				executed = true;
				context = this;
			};

		var proxy = new rsc.Proxy(resolve);

		proxy.resolve();

		expect(executed).toBe(true);
		expect(context).toEqual(proxy);
	});

	describe('event handling', function() {
		it('should setup a pending event handler', function() {
			var proxy = new rsc.Proxy();

			proxy.defineEventProperties('myevent', 'myotherevent');

			var callback = function() {
					return 3;
				};

			proxy.myevent = callback;

			expect(proxy.pending.myevent).toEqual(callback);
			expect(proxy.pending.myotherevent).toBeUndefined();

			proxy.myotherevent = callback;
			expect(proxy.pending.myotherevent).toEqual(callback);
		});

		it('should resolve pending event handlers', function() {
			var mockExtTarget = {
				on: function(eventName, handler) {
					this[eventName] = handler;
				}
			};

			var proxy = new rsc.Proxy(function() {
				this.cmp = mockExtTarget;
			});

			proxy.defineEventProperties('myevent');

			var callback = function() {
					return 4;
				};
			proxy.myevent = callback;

			expect(proxy.pending.myevent).toEqual(callback);

			proxy.resolve();

			expect(proxy.pending.myevent).toBeUndefined();

			expect(mockExtTarget.myevent).toEqual(callback);
		});

		it('should allow wrapping callbacks', function() {
			var mockExtTarget = {
				on: function(eventName, handler) {
					this[eventName] = handler;
				}
			};

			var proxy = new rsc.Proxy(function() {
				this.cmp = mockExtTarget;
			});

			var givenCallback;
			var wrapper = function(callback) {
				givenCallback = callback;
				return 'wrapped successfully';
			};

			proxy.defineEventProperties({
				myevent: wrapper
			});

			var providedCallback = function() {};
			proxy.myevent = providedCallback;

			expect(proxy.pending.myevent).toBe('wrapped successfully');
			expect(givenCallback).toEqual(providedCallback);
		});
	});

	describe('methods', function() {
		var cmp;
		var proxy;
		beforeEach(function() {
			cmp = {
				foo: function() { return 'foo'; },
				bar: function() { return 'bar'; }
			};
			proxy = new rsc.Proxy(function() {
				this.cmp = cmp;
			});
		});

		it('should surfaceMethods with a single string', function() {
			proxy.surfaceMethods('foo');
			proxy.surfaceMethods('bar');

			proxy.resolve();

			expect(proxy.foo()).toBe('foo');
			expect(proxy.bar()).toBe('bar');
		});

		it('should surfaceMethods with an array', function() {
			proxy.surfaceMethods(['foo', 'bar', 'doesntexist']);

			proxy.resolve();

			expect(proxy.foo()).toBe('foo');
			expect(proxy.bar()).toBe('bar');
			expect(proxy.doesntexist()).toBeUndefined();
		});

		it('should surfaceMethods with a config', function() {
			proxy.surfaceMethods({
				foo: 'diffNameForFoo',
				bar: 'diffNameForBar',
				doesntexist: 'diffNameForDoesntExist'
			});

			proxy.resolve();

			expect(proxy.diffNameForFoo()).toBe('foo');
			expect(proxy.diffNameForBar()).toBe('bar');
			expect(proxy.diffNameForDoesntExist()).toBeUndefined();
		});

		it('should surfaceMethodsAsProperties', function() {
			proxy.surfaceMethodsAsProperties({
				foo: 'propNameFoo'
			});

			proxy.resolve();

			expect(proxy.propNameFoo).toBe('foo');
		});
	});
});