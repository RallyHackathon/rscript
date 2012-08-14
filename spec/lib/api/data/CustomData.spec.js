describe('CustomData', function() {
	beforeEach(function() {
		spyOn(Ext.Function, 'defer').andCallFake(function(fn, millis, scope, args, appendArgs) {
			fn = Ext.Function.bind(fn, scope, args, appendArgs);
			fn();
		});
	});

	function getRecords(cd) {
		var finalRecords;
		cd.load(function(records) {
			finalrecords = rsc.Record.wrap(records);
		});

		return finalrecords;
	}

	it('should build the records using the provided builder', function() {
		var records = [{
			abc: 'a'
		}, {
			abc: 'b'
		}];

		var builder = function(record) {
				return {
					abc: record.abc + 'built'
				};
			};

		var cd = new rsc.api.CustomData(records, builder);

		var finalRecords = getRecords(cd);

		expect(finalRecords[0].abc).toEqual(records[0].abc + 'built');
		expect(finalRecords[1].abc).toEqual(records[1].abc + 'built');
	});

	it('should build the records according to the provided columns', function() {
		var records = [{
			a: 'a',
			b: 'b',
			c: 'c'
		}, {
			a: 'aa',
			d: 'dd'
		}, {
			a: 'aaa',
			c: 'ccc',
			e: 'eee'
		}];

		var cd = new rsc.api.CustomData(records, ['a', 'c']);

		var finalRecords = getRecords(cd);

		expect(finalRecords[0].a).toEqual(records[0].a);
		expect(finalRecords[0].b).toBeUndefined();
		expect(finalRecords[0].c).toEqual(records[0].c);

		expect(finalRecords[1].a).toEqual(records[1].a);
		expect(finalRecords[1].c).toEqual('');
		expect(finalRecords[1].d).toBeUndefined();

		expect(finalRecords[2].a).toEqual(records[2].a);
		expect(finalRecords[2].c).toEqual(records[2].c);
		expect(finalRecords[2].e).toBeUndefined();
	});

	it('should sort', function() {
		var records = [{
			a: 'c'
		}, {
			a: 'b'
		}, {
			a: 'z'
		}];

		var cd = new rsc.api.CustomData(records, 'a', 'a');

		var finalRecords = getRecords(cd);

		expect(finalRecords[0].a).toEqual('b');
		expect(finalRecords[1].a).toEqual('c');
		expect(finalRecords[2].a).toEqual('z');
	});
});