describe('Promise', function() {
	it('should have the isRscPromise property', function() {
		var promise = new rsc.Promise(function() {});
		expect(promise.isRscPromise).toBe(true);
	});

	it('should execute the resolve', function() {
		var executed = false;
		var resolve = function() {
			executed = true;
		};

		var promise = new rsc.Promise(resolve);

		promise.resolve();

		expect(executed).toBe(true);
	});
});


