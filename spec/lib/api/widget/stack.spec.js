describe('stack()', function() {
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
		it('should not blow up with no parameters', function() {
			var s = rsc.stack();

			s.resolve(rootContainer);

			var config = rootContainer.config;

			expect(Ext.isObject(config)).toBe(true);
			expect(config.xtype).toBe('container');
			expect(config.html).toBeUndefined();
		});

		it('should accept options and pass them onto the container', function() {
			var options = {
				width: 200,
				height: 300,
				foo: 'bar'
			};

			var s = rsc.stack(options);

			s.resolve(rootContainer);

			var config = rootContainer.config;

			expect(config.xtype).toBe('container');
			expect(config.width).toEqual(options.width);
			expect(config.height).toEqual(options.height);
			expect(config.foo).toEqual(options.foo);
		});

		it('should accept children without options', function() {
			var child1Text = 'child1';
			var child2Text = 'child2';

			var child1 = rsc.text(child1Text);
			var child2 = rsc.text(child2Text);

			var s = rsc.stack(child1, child2);

			s.resolve(rootContainer);

			var config = rootContainer.config;
			expect(Ext.isObject(config)).toBe(true);
			expect(config.xtype).toBe('container');

			expect(rootContainer.children.length).toBe(1);
			expect(rootContainer.children[0].children.length).toBe(2);
		});
	});

	describe('add', function() {
		// hmmmm, need to think about this
	});
});

