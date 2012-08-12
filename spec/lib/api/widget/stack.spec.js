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
			var s = rsc.api.stack();

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

			var s = rsc.api.stack(options);

			s.resolve(rootContainer);

			var config = rootContainer.config;

			expect(config.xtype).toBe('container');
			expect(config.width).toEqual(options.width);
			expect(config.height).toEqual(options.height);
			expect(config.foo).toEqual(options.foo);
		});

		it('should accept children without options', function() {
			var child1Html = 'child1';
			var child2Html = 'child2';

			var child1 = rsc.api.html(child1Html);
			var child2 = rsc.api.html(child2Html);

			var s = rsc.api.stack(child1, child2);

			s.resolve(rootContainer);

			var config = rootContainer.config;
			expect(Ext.isObject(config)).toBe(true);
			expect(config.xtype).toBe('container');

			expect(rootContainer.children.length).toBe(1);
			expect(rootContainer.children[0].children.length).toBe(2);
		});

		it('should turn string children into html() proxies', function() {

			spyOn(rsc.api, 'html').andCallThrough();

			var s = rsc.api.stack('thing 1', 'thing 2');

			s.resolve(rootContainer);

			var config = rootContainer.config;
			expect(Ext.isObject(config)).toBe(true);
			expect(config.xtype).toBe('container');

			expect(rootContainer.children.length).toBe(1);
			expect(rootContainer.children[0].children.length).toBe(2);

			expect(rsc.api.html.callCount).toBe(2);
		});
	});

	describe('add', function() {
		// hmmmm, need to think about this
	});
});