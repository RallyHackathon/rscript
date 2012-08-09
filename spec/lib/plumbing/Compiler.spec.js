describe('Compiler', function() {
	describe('construction', function() {
		it('should default to an empty environment', function() {
			expect(new rsc.Compiler().env).toEqual({});
		});
	});

	describe('compiling', function() {
		it('should throw if not given any src', function() {
			var run = function() {
				new rsc.Compiler().compile();
			};

			expect(run).toThrow();
		});

		it('should compile the src using the provided env', function() {
			var env = {
				foo: 'bar'
			};

			var compiler = new rsc.Compiler(env);

			var src = 'return foo;';

			var func = compiler.compile(src);
			var funcSrc = func.toString();

			expect(funcSrc.indexOf('(foo)') > -1).toBe(true);
			expect(funcSrc.indexOf('return foo;') > -1).toBe(true);
		});

		it('should include everything from the environment no matter what it is', function() {
			debugger;
			var env = {
				foo: undefined,
				bar: null,
				baz: function() {},
				boo: 'hello',
				buz: 123
			};

			var compiler = new rsc.Compiler(env);

			var result = compiler.compile('').toString();

			Ext.Object.each(env, function(key, value) {
				expect(result.indexOf(key) > -1).toBe(true);
			});
		});

		it('should not include anything in the env start with _', function() {
			var env = {
				foo: 'bar',
				_private: 'nope'
			};

			var compiler = new rsc.Compiler(env);
			
			var func = compiler.compile('');

			expect(func.toString().indexOf('_private')).toBe(-1);
		});
	});

	describe('execution', function() {
		it('should execute the function using the environment', function() {
			var value1 = 'bar';
			var value2 = 'boo';
			var env = {
				foo: value1,
				bar: value2
			};

			var src = 'return foo + bar;';

			var compiler = new rsc.Compiler(env);

			var result = compiler.execute(src);

			expect(result).toBe(value1 + value2);
		});
	});
});

