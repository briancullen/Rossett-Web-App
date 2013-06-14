
var app = {
	

    // Application Constructor
    initialize: function() {
	this.bindEvents();
    },
    
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        
        window.applicationCache.addEventListener ('updateready', function (e) {
        	if(window.applicationCache.status === window.applicationCache.UPDATEREADY)
        	{
				if (confirm("This WebApp has updated - reload now?"))
				{
					window.location.reload();
				}
			}
        });
            	
        $('#newsletterPage').on("pageinit", function() {
        	$('#newsletter_canvas').load("newsletter.html");
        });


        $('#homePage').on("pageinit", function() {
        	$('#cacheClearButton').on("vclick", function() {
        		window.applicationCache.update();
        		datastore.clearAllStorage();
        	});
        	       	
        });        
  
        $('#calendarPage').on("pageshow", function (event, ui) {
        	if (!navigator.onLine) {
	       		alert("You cannot open the calendar as you are currently offline");
	        	$.mobile.changePage('#termDatesPage', { transition: "slide", role: "page" });
	        	return;
	        }
        	
       		$('#calendar_canvas').fullCalendar("today");
        	
    		var data = datastore.getCalendarDetails();     	
    		var currentTimeStamp = $('#calendarFeedPanel').data("timeStamp");
    		if ((currentTimeStamp === undefined) || (currentTimeStamp != data.timeOfCache))
    		{
    			$('#calendarFeedPanel').data("timeStamp", data.timeOfCache);
    			$('#calendarFeedPanel').html(Mustache.render(
    					'<fieldset data-role="controlgroup">\
    				    	<legend>Calendars</legend>\
    						{{#calendars}}\
    				    		<input type="checkbox" id="{{calendarFeed}}">\
    				    		<label for="{{calendarFeed}}">{{displayName}}</label>\
    						{{/calendars}}\
    					</fieldset>', data));
    			
    			
    			$('#calendarFeedPanel input[type=checkbox]').first().attr("checked", "checked");
    			$('#calendarFeedPanel').trigger("create");
    			
    			$('#calendarFeedPanel input[type=checkbox]').on("change", function() {
    				if (this.checked)
    				{
    					$('#calendar_canvas').fullCalendar("addEventSource", "http://www.google.com/calendar/feeds/" + this.id + "/public/basic");
    				}
    				else {
    					$('#calendar_canvas').fullCalendar("removeEventSource", "http://www.google.com/calendar/feeds/" + this.id + "/public/basic");
    				}
    			});
    			
    			$('#calendar_canvas').fullCalendar("removeAllEventSources");
    			$('#calendar_canvas').fullCalendar("addEventSource", "http://www.google.com/calendar/feeds/" + data.calendars[0].calendarFeed + "/public/basic");
       		}
        });
        
        $('#calendarPage').on("pageinit", function () {        	
    		$('#calendar_canvas').fullCalendar({
    			timeFormat: '',   			
    			eventClick: function(event) { 
    				$('#calendarEventDialog div[data-role=header]').html("<h1>" + event.title + "</h1>");
    				$('#calendarEventDetails').html(Mustache.render('\
    		    			<table>\
    							<tbody>\
    		    				<tr><td><strong>Title</strong></td>\
    							<td>{{title}}</td></tr>\
    							<tr><td><strong>Start</strong></td>\
    							<td>{{start}}</td></tr>\
    							<tr><td><strong>End</strong></td>\
    							<td>{{end}}</td></tr>\
    							<tr><td><strong>Location</strong></td>\
    	    					<td>{{location}}</td></tr>\
    							<tr><td><strong>Description</strong></td>\
    	    					<td>{{description}}</td></tr>\
    							</tbody>\
    						</table>', event));
    				
    				if ((event.url != null) && (event.url != ""))
    				{
    					$('#calendarEventDetails').append('<a data-role="button" href="' + event.url
    							+ '" target="_blank">Event Details on the Web</a>');
    					$('#calendarEventDetails a').button();
    				}
    				
    				//$.mobile.changePage('#calendarEventDialog', { transition: "slideup", role: "dialog" });
    				$('#calendarEventDialog').popup('open');
    				return false;
    			},
    			loading: function(isLoading, view) 
    			{
    				if(isLoading)
    				{
    					$.mobile.loading("show");
    				}
    				else
    				{
    					$.mobile.loading("hide");
    				}
    			}
    		});
    	});

    	$('#contactPage').on("pageshow", function() {
    		var data = datastore.getContactDetails();
    		
    		var currentTimeStamp = $('#generalContactDetails').data("timeStamp");
    		
    		if ((currentTimeStamp === undefined) || (currentTimeStamp != data.timeOfCache))
    		{
	    		$('#generalContactDetails').empty();
	    		$('#generalContactDetails').data("timeStamp", data.timeOfCache);
	    		$('#generalContactDetails').append(Mustache.render('\
	    			<div class="ui-grid-a ui-bar-b" style="margin-bottom: 10px; border-radius: 8px 8px; border-color: rgb(4,64,98);">\
		    			<div class="ui-block-a"><p><strong>Phone</strong></p></div>\
						<div class="ui-block-b"><p>{{phone}}</p></div>\
						<div class="ui-block-a"><p><strong>Fax</strong></p></div>\
						<div class="ui-block-b"><p>{{fax}}</p></div>\
						<div class="ui-block-a"><p><strong>Email</strong></p></div>\
						<div class="ui-block-b"><p>{{email}}</p></div>\
	    				<div class="ui-block-a"><p><strong>Address</strong></p></div>\
	    				<div class="ui-block-b"><p>{{address}}</p></div>\
	    			</div>', data));
	
	    		$('#groupContactDetails').empty();
	    		$('#groupContactDetails').append(Mustache.render('{{#contactGroups}}\
	            		<div data-role="collapsible" data-theme="b" data-content-theme="b">\
						<h3>{{groupname}}</h3>\
						<table data-role="table" data-mode="reflow" class="ui-responsive table-stroke ui-table ui-table-reflow">\
							<thead>\
							<tr>\
								<th data-priority="1">Position</th>\
								<th data-priority="persist">Name</th>\
								<th data-priority="2">email</th>\
								<th data-priority="3">phone</th>\
							</tr>\
							</thead>\
							<tbody>\
	    						{{#details}}\
								<tr>\
									<td>{{role}}</td>\
									<td>{{name}}</td>\
									<td>{{email}}</td>\
									<td>{{phone}}</td>\
								</tr>\
								{{/details}}\
							</tbody>\
						</table>\
	    				</div>\
	    				{{/contactGroups}}', data));
	    		$('#otherContactDetails').empty();
	    		$('#otherContactDetails').append(Mustache.render('<div data-role="collapsible" data-theme="b" data-content-theme="b">\
	    			<h3>Other Contact Details</h3>\
						<table data-role="table" data-mode="reflow" class="ui-responsive table-stroke ui-table ui-table-reflow">\
							<thead>\
							<tr>\
								<th data-priority="persist">Description</th>\
								<th data-priority="1">phone</th>\
							</tr>\
							</thead>\
							<tbody>\
	    						{{#otherContacts}}\
								<tr>\
									<td>{{description}}</td>\
									<td>{{phone}}</td>\
								</tr>\
								{{/otherContacts}}\
							</tbody>\
						</table>\
	    				</div>', data));

	    		$('#groupContactDetails').find('div[data-role=collapsible]').collapsible();
	    		$('#groupContactDetails').find('table[data-mode=reflow]').table();
	    		$('#groupContactDetails').collapsibleset("refresh");
	    		
	    		$('#otherContactDetails').find('div[data-role=collapsible]').collapsible();
	    		$('#otherContactDetails').find('table[data-mode=reflow]').table();
    		}
    	});
    	
    	$('#termDatesPage').on('pageshow', function () {
       		var data = datastore.getTermDates();
    		
    		var currentTimeStamp = $('#termdates_canvas').data("timeStamp");
    		
    		if ((currentTimeStamp === undefined) || (currentTimeStamp != data.timeOfCache))
    		{
 	    		$('#termdates_canvas').empty();
	    		$('#termdates_canvas').data("timeStamp", data.timeOfCache);
	    		
	    		$('#termdates_canvas').append(Mustache.render('\
	    				<table data-role="table" style="width: 100%;" class="table-stroke ui-table">\
							<thead>\
							<tr>\
								<th data-priority="1">Date</th>\
								<th data-priority="2">Event</th>\
							</tr>\
							</thead>\
							<tbody>\
	    						{{#termDates}}\
								<tr>\
									<td><p class="eventName">{{date}}</p></td>\
									<td><p class="eventName">{{event}}</p><p class="eventDescription">{{description}}</p></td>\
								</tr>\
								{{/termDates}}\
							</tbody>\
						</table>\
	    				</div>', data));

	    		$('#termdates_canvas').find('table[data-mode=reflow]').table();	    		   			
    		}
	
    	});
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
    },
};
