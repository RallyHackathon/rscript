
// no stores or models
var combobox = new ComboBox('Favorite Beer', ['Coors', 'Rolling Rock', "O'Douls"]);

launch(combobox);
// or
combobox.renderTo('#myDiv');


var grid = new Grid('UserStory', ['ObjectID', 'Name'], {
	property: 'Name',
	operator: 'contains',
	value: 'cake'
});


// convenience methods for common needs
var currentUser = new CurrentUser();


// simple data oriented methods
get(['UserStory', 'Defect'], 10, null, function(userStories, defects) {
	alert('got back ' + userStories.length + ' stories, and ' + defects.length + ' defects');
});

create('UserStory', { Name: 'my new story', ScheduleState: 'Defined' });

create('UserStory', { Name: 'my new story', ScheduleState: 'Defined' }, function(newStory) {
	alert("successfully created " + newStory.Name);
});


// third party stuff, why not?
var tweets = new Tweets('sencha', 100);
launch(new Grid(tweets, ['Text', 'CreatedAt']));

