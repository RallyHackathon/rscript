describe('util', function() {
	describe('toArray', function() {
		it('should convert falsey to an empty array', function() {
			expect(rsc.util.toArray()).toEqual([]);
			expect(rsc.util.toArray(false)).toEqual([]);
			expect(rsc.util.toArray(undefined)).toEqual([]);
			expect(rsc.util.toArray(null)).toEqual([]);
		});

		it('should leave arrays alone', function() {
			var a = [1, 2, 3];
			expect(rsc.util.toArray(a)).toBe(a);
		});

		it('should convert anything else to an array', function() {
			expect(rsc.util.toArray('abc')).toEqual(['abc']);
			expect(rsc.util.toArray(12)).toEqual([12]);
			expect(rsc.util.toArray({})).toEqual([{}]);
		});
	});

	describe('stringToHtml', function() {

		function getMockContainer() {
			return {
				add: function(givenConfig) {
					this.config = givenConfig;
					this.children = this.children || [];
					var child = getMockContainer();
					this.children.push(child);
					return child;
				}
			};
		}

		var rootContainer;

		beforeEach(function() {
			rootContainer = getMockContainer();
		});

		it('should leave it alone if its not a string', function() {
			var notAString = {};

			expect(rsc.util.stringToHtml(notAString)).toBe(notAString);
		});

		it('should convert the string to an html proxy', function() {
			var str = 'hello what up';

			var result = rsc.util.stringToHtml(str);

			expect(result.isRscProxy).toBe(true);

			result.resolve(rootContainer);
			expect(rootContainer.config.html).toEqual(str);
		});
	});

	describe("camelToHuman", function() {
		it('should pass non strings through', function() {
			expect(rsc.util.camelToHuman(2)).toEqual(2);
			expect(rsc.util.camelToHuman({})).toEqual({});
			expect(rsc.util.camelToHuman(null)).toEqual(null);
			expect(rsc.util.camelToHuman(undefined)).toEqual(undefined);
		});

		it('should convert camel to human', function() {
			expect(rsc.util.camelToHuman('helloThere')).toEqual('Hello There');
			expect(rsc.util.camelToHuman('whats up')).toEqual('Whats up');
			expect(rsc.util.camelToHuman('')).toEqual('');
		});

		it('should leave consecutive capital letters alone', function() {
			expect(rsc.util.camelToHuman('FormattedID')).toEqual('Formatted ID');
		});
	});
});