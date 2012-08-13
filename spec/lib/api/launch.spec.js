
describe('launch', function() {
	function getHomePageItems() {
		return rsc.__root__.items.items[0].items.items;
	}

	function getPage(tag) {
		return rsc.__root__.down('#' + tag);
	}

	function getDockedItems() {
		return rsc.__root__.getDockedItems();
	}

	describe('constants', function() {
		it('should have HomeTag defined', function() {
			expect(Ext.isString(rsc.api.HomeTag)).toBe(true);
		});
		it('should have RootId defined', function() {
			expect(Ext.isString(rsc.RootId)).toBe(true);
		});
	});

	describe('body items', function() {
		afterEach(function() {
			rsc.__root__.destroy();
			delete rsc.__root__;
		});

		it('should define rsc.__root__', function() {
			rsc.api.launch();
			expect(rsc.__root__).toBeDefined();
		});

		it('should populate with body items', function() {
			rsc.api.launch(new rsc.api.Html('hi'));

			expect(getHomePageItems().length).toBe(1);
		});

		it('should convert strings to html()', function() {
			spyOn(rsc.api, 'Html').andCallThrough();

			var s = 'im a string';
			rsc.api.launch(s);

			expect(rsc.api.Html).toHaveBeenCalled();
		});

		it('should accept an array of items', function() {
			rsc.api.launch(['hi', new rsc.api.Stack(), new rsc.api.Flow()]);

			expect(getHomePageItems().length).toBe(3);
		});
	});
	describe('pages', function() {
		it('should have the other page', function() {
			var tag = 'otherPage';
			var p = new rsc.api.Page(tag, new rsc.api.Stack());

			rsc.api.launch(null, p);

			expect(getPage(tag)).toBeDefined();
			expect(getPage(tag).items.items.length).toBe(1);
		});

		it('should accept an array of pages', function() {
			var p1 = new rsc.api.Page('p1');
			var p2 = new rsc.api.Page('p2');

			rsc.api.launch(null, [p1, p2]);

			expect(getPage('p1')).toBeDefined();
			expect(getPage('p2')).toBeDefined();
		});
	});
	describe('docked items', function() {
		it('should have the docked item', function() {
			var s = new rsc.api.Stack();

			rsc.api.launch(null, null, s);

			expect(getDockedItems().length).toBe(1);
		});
	});
});
