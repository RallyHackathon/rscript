describe('Cardboard', function() {
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

	describe('invoking', function() {
		it('should accept types as a string', function() {
			var type = 'justice';

			var cardboard = new rsc.api.Cardboard(type);

			cardboard.resolve(rootContainer);

			expect(rootContainer.config.xtype).toBe('rallycardboard');
			expect(rootContainer.config.types).toEqual([type]);
		});

		it('should accept types as an array', function() {
			var types = ['justice', 'new lands'];

			var cardboard = new rsc.api.Cardboard(types);

			cardboard.resolve(rootContainer);

			expect(rootContainer.config.types).toEqual(types);
		});

		it('should default to ScheduleState if no attribute provided', function() {
			var type = 'justice';

			var cardboard = new rsc.api.Cardboard(type);

			cardboard.resolve(rootContainer);

			expect(rootContainer.config.attribute).toEqual('ScheduleState');
		});
	});

	describe('filtering', function() {
		it('should setup the filter', function() {
			var filter = 'myfilter';

			var cardboard = new rsc.api.Cardboard('foo');
			cardboard.filter = filter;

			expect(cardboard.pending.filter).toEqual(filter);

			cardboard.resolve(rootContainer);

			expect(rootContainer.config.storeConfig.filters).toEqual([filter]);
		});

		it('should set a filter while running', function() {
			var refreshConfig;

			var cmp = {
				refresh: function(config) {
					refreshConfig = config;
				}
			};
			
			var filter = 'myfilter';

			var cardboard = new rsc.api.Cardboard('foo');

			cardboard.cmp = cmp;

			cardboard.filter = filter;

			expect(refreshConfig.storeConfig.filters).toEqual([filter]);
		});
	});

	describe('refreshing', function() {
		it('should surface the refresh method', function() {
			var cardboard = new rsc.api.Cardboard();

			expect(Ext.isFunction(cardboard.refresh)).toBe(true);
		});
	});
});