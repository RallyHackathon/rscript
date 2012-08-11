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

	it('should setup a pending event handler', function() {
		debugger;
		var promise = new rsc.Promise();

		promise.defineEventProperties('myevent', 'myotherevent');

		var callback = function() { return 3; };

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

		var callback = function() { return 4; };
		promise.myevent = callback;

		expect(promise.pending.myevent).toEqual(callback);

		promise.resolve();

		expect(promise.pending.myevent).toBeUndefined();

		expect(mockExtTarget.myevent).toEqual(callback);
	});
});


