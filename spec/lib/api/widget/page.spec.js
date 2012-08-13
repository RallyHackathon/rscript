describe('page', function() {
	it('should throw an error if not given a tag', function() {
		var run = function() {
			rsc.api.page();
		};

		expect(run).toThrow();

		run = function() {
			rsc.api.page(rsc.api.stack());
		};

		expect(run).toThrow();
	})

	it('should set the tag on the proxy', function() {
		var tag = 'mytag';

		var p = rsc.api.page(tag);

		expect(p.tag).toEqual(tag);
	});

	it('should add a page to the root', function() {
		var root = {
			add: function(config) {
				this.config = config;
			}
		};

		var container = {
			up: function() {
				return root;
			}
		};

		var p = rsc.api.page('mytag');

		p.resolve(container);

		expect(root.config.xtype).toBe('container');
	});
});
