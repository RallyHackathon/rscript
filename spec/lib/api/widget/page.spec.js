describe('Page', function() {
	it('should throw an error if not given a tag', function() {
		var run = function() {
			new rsc.api.Page();
		};

		expect(run).toThrow();

		run = function() {
			new rsc.api.Page(new rsc.api.Stack());
		};

		expect(run).toThrow();
	})

	it('should set the tag on the proxy', function() {
		var tag = 'mytag';

		var p = new rsc.api.Page(tag);

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

		var p = new rsc.api.Page('mytag');

		p.resolve(container);

		expect(root.config.xtype).toBe('container');
	});
});
