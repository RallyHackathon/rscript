describe('util', function() {
	describe('toArray', function() {
		it('should convert falsey to an empty array', function() {
			expect(rsc.util.toArray()).toEqual([]);
			expect(rsc.util.toArray(false)).toEqual([]);
			expect(rsc.util.toArray(undefined)).toEqual([]);
			expect(rsc.util.toArray(null)).toEqual([]);
		});

		it('should leave arrays alone', function() {
			var a = [1,2,3];
			expect(rsc.util.toArray(a)).toBe(a);
		});

		it('should convert anything else to an array', function() {
			expect(rsc.util.toArray('abc')).toEqual(['abc']);
			expect(rsc.util.toArray(12)).toEqual([12]);
			expect(rsc.util.toArray({})).toEqual([{}]);
		});
	});	
});
