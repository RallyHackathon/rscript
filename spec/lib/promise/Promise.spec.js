describe('Promise', function() {
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


