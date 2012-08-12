describe('addNew()', function() {
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
		it('should take a type as a string', function() {
			var type = 'Foo';

			var addNew = rsc.api.addNew(type);

			addNew.resolve(rootContainer);

			expect(rootContainer.config.xtype).toBe('rallyaddnew');
			expect(rootContainer.config.recordTypes).toEqual([type]);
			expect(rootContainer.config.showAddWithDetails).toBe(false);
		});

		it('should take types as an array', function() {
			var types = ['Fio', 'Eri', 'Tarma'];

			var addNew = rsc.api.addNew(types);

			addNew.resolve(rootContainer);
			expect(rootContainer.config.recordTypes).toEqual(types);
		});

		it('should take ignored fields as a string', function() {
			var ignored = 'medeski';

			var addNew = rsc.api.addNew(null, ignored);

			addNew.resolve(rootContainer);
			expect(rootContainer.config.ignoredRequiredFields).toEqual([ignored]);
		});

		it('should take ignored fields as an array', function() {
			var ignored = ['blues', 'traveller'];

			var addNew = rsc.api.addNew(null, ignored);

			addNew.resolve(rootContainer);
			expect(rootContainer.config.ignoredRequiredFields).toEqual(ignored);
		});

		it('should take both types and ignored', function() {
			var type = 'foo';
			var ignored = ['bar', 'baz'];

			var addNew = rsc.api.addNew(type, ignored);

			addNew.resolve(rootContainer);
			expect(rootContainer.config.recordTypes).toEqual([type]);
			expect(rootContainer.config.ignoredRequiredFields).toEqual(ignored);
		});
	});

	describe('events', function() {
		it('should handle recordadd', function() {
			var addNew = rsc.api.addNew();

			var callback = function() {};

			addNew.recordadd = callback;
			expect(addNew.pending.recordadd).toEqual(callback);
		});

		it('should wrap beforerecordadd', function() {
			var callback = function() {};

			var addNew = rsc.api.addNew();

			addNew.beforerecordadd = callback;

			expect(Ext.isFunction(addNew.pending.beforerecordadd)).toBe(true);
			expect(addNew.pending.beforerecordadd).not.toEqual(callback);
		});
	})
});