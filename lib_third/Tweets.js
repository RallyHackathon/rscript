
rsc.api.Tweets = function(username, count) {
	return Ext.create('Ext.data.Store', {
		fields: [{
			name: 'CreatedAt', type: 'Date', mapping: 'created_at'
		}, {
			name: 'Text', type: 'String', mapping: 'text'
		}],

		autoLoad: true,

    	proxy: {
    	    type: 'jsonp',
    	    url : 'http://api.twitter.com/1/statuses/user_timeline.json',
    	    extraParams: {
    	    	screen_name: username,
    	    	count: count,
    	    	include_rts: 1
    	    }
    	}
	});
};

