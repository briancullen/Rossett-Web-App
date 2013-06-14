
var datastore = {
	CONTACT_DETAILS_KEY: "ContactDetails",
	CONTACT_DETAILS_TIMEOUT: 864000000,
	
	TWITTER_DETAILS_KEY: "TwitterDetails",
	TWITTER_DETAILS_TIMEOUT: 172800000,
	
	CALENDAR_DETAILS_KEY: "CalendarDetails",
	CALENDAR_DETAILS_TIMEOUT: 864000000,
	
	TERM_DATES_KEY: "TermDates",
	TERM_DATES_TIMEOUT: 864000000,
		
	MESSAGES_KEY: "Messages",
	MESSAGES_READ_KEY: "MessageTimeStamp",
	MESSAGES_TIMEOUT: 86400000,
	
	initialise: function () {
		var localStorage = window.localStorage;
		
		// Checks for a cache of the contact details.
		if (localStorage.getItem(this.CONTACT_DETAILS_KEY) == null)
		{
			var defaultContacts = new Object();
			defaultContacts.timeOfCache = false; 
			defaultContacts.address = ["Green Lane", "Harrogate", "HG2 9JP"];
			defaultContacts.phone = "012423 564444";
			defaultContacts.fax = "01423 564444";
			defaultContacts.email = "office@rossettschool.co.uk";
			
			defaultContacts.contactGroups = [ ];
			localStorage.setItem(this.CONTACT_DETAILS_KEY, JSON.stringify(defaultContacts));
		}
		
		if (localStorage.getItem(this.TWITTER_DETAILS_KEY) == null)
		{
			var defaultContents = new Object();
			defaultContents.timeOfCache = false;
			defaultContents.school = { displayName: "Rossett School", twitterId: "rossett" };
			
			defaultContents.groups = [];
			localStorage.setItem(this.TWITTER_DETAILS_KEY, JSON.stringify(defaultContents));
		}
		
		if (localStorage.getItem(this.CALENDAR_DETAILS_KEY) == null)
		{
			var defaultContents = new Object();
			defaultContents.timeOfCache = false;
			defaultContents.school = [	{ displayName: "Rossett School", calendarFeed: "8c9q1b1rvpagtu226uvg2e5otvrdeqqr%40import.calendar.google.com" } ];
			localStorage.setItem(this.CALENDAR_DETAILS_KEY, JSON.stringify(defaultContents));
		}
		
		if (localStorage.getItem(this.MESSAGES_KEY) == null)
		{
			var defaultContents = new Object();
			defaultContents.timeOfCache = false;
			defaultContents.messages = [ ];
			localStorage.setItem(this.MESSAGES_KEY, JSON.stringify(defaultContents));
		}
		
		if (localStorage.getItem(this.TERM_DATES_KEY) == null)
		{
			var defaultContents = new Object();
			defaultContents.timeOfCache = false;
			defaultContents.termDates = [ ];
			localStorage.setItem(this.TERM_DATES_KEY, JSON.stringify(defaultContents));
		}		

	},

	// Checks to see if we need to refresh the cache and returns whichever
	// set we are supposed to be working with.
	// TODO: Haven't checked for error/invalid responses from the ajax request.
	getContactDetails: function() {
		var details = $.parseJSON(window.localStorage.getItem(this.CONTACT_DETAILS_KEY));
		
		var timeSinceRefresh = this.CONTACT_DETAILS_TIMEOUT
		if (details.timeOfCache != false)
		{
			var now = (new Date()).getTime();
			timeSinceRefresh = now - details.timeOfCache;
		}
		
		if (timeSinceRefresh >= this.CONTACT_DETAILS_TIMEOUT)
		{
			var response = $.ajax({
			    type: 'GET',
			    url: 'contactdetails.json',
			    dataType: 'json',
			    success: function() { },
			    data: {},
			    async: false,
			    cache: false
			});
			
			// Quick and dirty check to see if it has updated properly!
			if (response.status == 200)
			{
				details = $.parseJSON(response.responseText);
				details.timeOfCache = (new Date()).getTime();
				window.localStorage.setItem(this.CONTACT_DETAILS_KEY, JSON.stringify(details));
			}
		}
		
		return details;
	},

	// Checks to see if we need to refresh the cache and returns whichever
	// set we are supposed to be working with.
	// TODO: Haven't checked for error/invalid responses from the ajax request.
	getTwitterDetails: function() {
		var details = $.parseJSON(window.localStorage.getItem(this.TWITTER_DETAILS_KEY));
		
		var timeSinceRefresh = this.TWITTER_DETAILS_TIMEOUT
		if (details.timeOfCache != false)
		{
			var now = (new Date()).getTime();
			timeSinceRefresh = now - details.timeOfCache;
		}
		
		if (timeSinceRefresh >= this.TWITTER_DETAILS_TIMEOUT)
		{
			var response = $.ajax({
			    type: 'GET',
			    url: 'twitterdetails.json',
			    dataType: 'json',
			    success: function() { },
			    data: {},
			    async: false,
			    cache: false
			});
			
			// Quick and dirty check to see if it has updated properly!
			if (response.status == 200)
			{
				details = $.parseJSON(response.responseText);
				details.timeOfCache = (new Date()).getTime();
				window.localStorage.setItem(this.TWITTER_DETAILS_KEY, JSON.stringify(details));
			}
		}
		
		return details;
	},
	
	// Checks to see if we need to refresh the cache and returns whichever
	// set we are supposed to be working with.
	// TODO: Haven't checked for error/invalid responses from the ajax request.
	getCalendarDetails: function() {
		var details = $.parseJSON(window.localStorage.getItem(this.CALENDAR_DETAILS_KEY));
		
		var timeSinceRefresh = this.CALENDAR_DETAILS_TIMEOUT
		if (details.timeOfCache != false)
		{
			var now = (new Date()).getTime();
			timeSinceRefresh = now - details.timeOfCache;
		}
		
		if (timeSinceRefresh >= this.CALENDAR_DETAILS_TIMEOUT)
		{
			var response = $.ajax({
			    type: 'GET',
			    url: 'calendardetails.json',
			    dataType: 'json',
			    success: function() { },
			    data: {},
			    async: false,
			    cache: false
			});
			
			// Quick and dirty check to see if it has updated properly!
			if (response.status == 200)
			{
				details.calendars = $.parseJSON(response.responseText);
				details.timeOfCache = (new Date()).getTime();
				window.localStorage.setItem(this.CALENDAR_DETAILS_KEY, JSON.stringify(details));
			}
		}
		
		return details;
	},
	
	getTermDates: function() {
		var details = $.parseJSON(window.localStorage.getItem(this.TERM_DATES_KEY));
		
		var timeSinceRefresh = this.TERM_DATES_TIMEOUT
		if (details.timeOfCache != false)
		{
			var now = (new Date()).getTime();
			timeSinceRefresh = now - details.timeOfCache;
		}
		
		if (timeSinceRefresh >= this.TERM_DATES_TIMEOUT)
		{
			var response = $.ajax({
			    type: 'GET',
			    url: 'termdates.json',
			    dataType: 'json',
			    success: function() { },
			    data: {},
			    async: false,
			    cache: false
			});
			
			// Quick and dirty check to see if it has updated properly!
			if (response.status == 200)
			{
				details.termDates = $.parseJSON(response.responseText);
				details.timeOfCache = (new Date()).getTime();
				window.localStorage.setItem(this.TERM_DATES_KEY, JSON.stringify(details));
			}
		}
		
		return details;
	},
	
	// Checks to see if we need to refresh the cache and returns whichever
	// set we are supposed to be working with.
	// TODO: Haven't checked for error/invalid responses from the ajax request.
	getMessages: function() {
		var details = $.parseJSON(window.localStorage.getItem(this.MESSAGES_KEY));
		
		var timeSinceRefresh = this.MESSAGES_TIMEOUT
		if (details.timeOfCache != false)
		{
			var now = (new Date()).getTime();
			timeSinceRefresh = now - details.timeOfCache;
		}
		
		if (timeSinceRefresh >= this.MESSAGES_TIMEOUT)
		{
			var response = $.ajax({
			    type: 'GET',
			    url: 'messages.json',
			    dataType: 'json',
			    success: function() { },
			    data: {},
			    async: false,
			    cache: false
			});
			
			// Quick and dirty check to see if it has updated properly!
			if (response.status == 200)
			{
				details.messages = $.parseJSON(response.responseText);
				details.timeOfCache = (new Date()).getTime();

				for (var index = 0; index < details.messages.length; index++)
				{
					var dateParts = details.messages[index].date.split('/');
					details.messages[index].date = (new Date (dateParts[2], dateParts[1], dateParts[0])).getTime();
				}
				details.messages.sort();
				details.messages.reverse();
				
				window.localStorage.setItem(this.MESSAGES_KEY, JSON.stringify(details));
			}
		}
		
		return details;
	},
	
	markMessagesAsRead: function() {
		window.localStorage.setItem(this.MESSAGES_READ_KEY, (new Date()).getTime());		
	},
	
	getNewMessages: function() {
		var data = this.getMessages();
		var result = [];

		var lastDateRead = window.localStorage.getItem(this.MESSAGES_READ_KEY);
		
		if (lastDateRead != null)
		{
			for (var index = 0; (index < data.messages.length) && (data.messages[index].date >= lastDateRead); index++)
			{
				result.push(data.messages[index]);
			}
		}
		else result = data.messages;
		return result;
	},
	
	clearAllStorage: function() {
		window.localStorage.clear();
		this.initialise();
	}
};