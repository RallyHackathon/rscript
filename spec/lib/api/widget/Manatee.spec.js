describe('Manatee', function() {

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

	it('should be an image', function() {
		var m = new rsc.api.Manatee();

		m.resolve(rootContainer);

		expect(rootContainer.config.xtype).toBe('container');
		expect(rootContainer.config.width > 0).toBe(true);
		expect(rootContainer.config.height > 0).toBe(true);
		expect(rootContainer.config.html.indexOf('img') > -1).toBe(true);
	});
});
