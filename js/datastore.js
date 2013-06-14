
var datastore = {
	CONTACT_DETAILS_KEY: "ContactDetails",
	CONTACT_DETAILS_TIMEOUT: 86400000,
	
	CALENDAR_DETAILS_KEY: "CalendarDetails",
	CALENDAR_DETAILS_TIMEOUT: 86400000,
	
	TERM_DATES_KEY: "TermDates",
	TERM_DATES_TIMEOUT: 86400000,
		
	initialise: function () {
		var localStorage = window.localStorage;
		
		// Checks for a cache of the contact details.
		if (localStorage.getItem(this.CONTACT_DETAILS_KEY) == null)
		{
			var defaultContacts = new Object();
			defaultContacts.timeOfCache = false; 
			defaultContacts.address = ["Green Lane", "Harrogate", "HG2 9JP"];
			defaultContacts.phone = "01423 564444";
			defaultContacts.fax = "01423 502301";
			defaultContacts.email = "office@rossettschool.co.uk";
			
			defaultContacts.contactGroups = [ ];
			localStorage.setItem(this.CONTACT_DETAILS_KEY, JSON.stringify(defaultContacts));
		}
		
		if (localStorage.getItem(this.CALENDAR_DETAILS_KEY) == null)
		{
			var defaultContents = new Object();
			defaultContents.timeOfCache = false;
			defaultContents.school = [	{ displayName: "Rossett School", calendarFeed: "8c9q1b1rvpagtu226uvg2e5otvrdeqqr%40import.calendar.google.com" } ];
			localStorage.setItem(this.CALENDAR_DETAILS_KEY, JSON.stringify(defaultContents));
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
		
	clearAllStorage: function() {
		window.localStorage.clear();
		this.initialise();
	}
};