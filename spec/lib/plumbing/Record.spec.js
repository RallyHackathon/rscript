describe('Record', function() {
	it('should wrap the record', function() {
		var model = Ext.define('MyModel', {
			extend: 'Ext.data.Model',
			fields: ['Foo', 'BAr']
		});

		var record = new model({Foo: 'yupfoo', BAr: 'yupbar'});

		var wrapped = new rsc.Record(record);

		expect(wrapped.Foo).toBe('yupfoo');
		expect(wrapped.BAr).toBe('yupbar');

		wrapped.Foo = 'changed';

		expect(record.get('Foo')).toBe('changed');
	});
});