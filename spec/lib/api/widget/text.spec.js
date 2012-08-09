describe('text()', function() {
	var mockContainer;

	beforeEach(function() {
		mockContainer = {
			add: function(givenConfig) {
				this.config = givenConfig;
			}
		};
	});

	it('should not blow up with no parameters', function() {
		var t = rsc.text();

		t.resolve(mockContainer);

		var config = mockContainer.config;

		expect(Ext.isObject(config)).toBe(true);
		expect(config.xtype).toBe('container');
		expect(config.style.fontSize).toBeDefined();
		expect(config.html).toBe('');
	});

	it('should accept just a size parameter', function() {
		var size = 20;
		var t = rsc.text(size);

		t.resolve(mockContainer);

		var config = mockContainer.config;

		expect(config.style.fontSize).toBe('' + size + 'px');
	});

	it('should accept just a text parameter', function() {
		var text = 'hello';
		var t = rsc.text(text);

		t.resolve(mockContainer);

		var config = mockContainer.config;

		expect(config.html).toEqual(text);
		expect(config.style.fontSize).toBeDefined();
	});

	it('should accept both a size and text parameter', function() {
		var size = 40;
		var text = 'big text';

		var t = rsc.text(size, text);

		t.resolve(mockContainer);

		var config = mockContainer.config;

		expect(config.html).toEqual(text);
		expect(config.style.fontSize).toBe('' + size + 'px');
	});
});

