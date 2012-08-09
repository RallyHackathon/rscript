(function() {
	function findSrc() {
		var scripts = document.getElementsByTagName('script');

		var src;

		Ext.Array.each(scripts, function(script) {
			if(script.type === 'text/rscript') {
				src = script.innerText;
				return false;
			}
		});

		return src;
	}


	Rally.onReady(function() {
		var src = findSrc();

		if(src) {
			new rsc.Compiler(rsc).execute(src);
		}
	});
})();

