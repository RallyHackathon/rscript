


new Template('UserStory', new CurrentUser().ownerFilter, 
	'<div>' +
		'<div>{{Name}}</div>' + 
		'<div>{{Description}}</div>' +
	'</div>'
);


get('UserStory', new CurrentUser().ownerFilter, function(records) {
	s.add(new Template(records, '<div>{{Name}}</div>'));
});

get('UserStory', new CurrentUser().ownerFilter, function(records) {
	records.forEach(function(record)) {
		s.add()
	});
});


get(['UserStory', 'Defect', 'Task'], null, function(userStories, defects, tasks) {
	var records = join(userStories, defects, tasks);
	var columns = ['FormattedID', 'Name', 'Owner'];
	var customData = new CustomData(records, columns);
	s.add(new Grid(customData, columns));
});

new CustomData(records, function(record) {
	return {
		Name: record.Name,
		Tasks: record.Tasks.length,
		Defects: records.Defects.length
	};
});