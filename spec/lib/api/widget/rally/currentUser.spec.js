describe('currentUser', function() {
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
	var name;
	var user;
	var mockContext;

	beforeEach(function() {
		rootContainer = getMockContainer();

		name = 'Sally Struthers';
		user = {
			_refObjectName: name
		};

		mockContext = {
			getUser: function() {
				return user;
			}
		};

		Rally.environment = Rally.environment || {
			getContext: function() {}
		};

		spyOn(Rally.environment, 'getContext').andReturn(mockContext);
	});

	it('should default to an html() with the current user\'s name', function() {
		var cu = rsc.api.currentUser();

		cu.resolve(rootContainer);

		expect(rootContainer.config.html).toBe('&nbsp;' + name + '&nbsp;');
	});

	it('should surface all of the users properties', function() {
		user.foo = 'foo';
		user.obj = {
			bar: 'bar',
			baz: 'baz'
		};

		var cu = rsc.api.currentUser();

		expect(cu.foo).toEqual(user.foo);
		expect(cu.obj.bar).toEqual(user.obj.bar);
	});

	it('should not surface any methods on user', function() {
		user.myMethod = function() {};

		var cu = rsc.api.currentUser();

		expect(cu.myMethod).toBeUndefined();
	});
});