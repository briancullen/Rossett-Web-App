// JQuery Twitter Feed. Coded by www.webdevdoor.com (2012) and modified from https://twitter.com/javascripts/blogger.js
function getTweets() {
 
    var displayLimit = 10;
    var twitterprofile = "rossett";
    var screenname = "Rossett School";
    var showdirecttweets = false;
    var showretweets = true;
    var showtweetlinks = true;
    var showprofilepic = true;
 
    var headerHTML = '';
    var loadingHTML = '';
    headerHTML += '<a href="https://twitter.com/" ><img src="images/twitter-bird-light-bgs.png" width="34" style="float:right;padding:3px 12px 0px 6px" alt="twitter bird" /></a>';
    headerHTML += '<a href="https://twitter.com/" ><img src="http://a0.twimg.com/profile_images/429312350/logo_normal.png" width="42" style="float:left;padding:12px 12px 0px 6px" alt="twitter bird" /></a>';
    headerHTML += '<h1>'+screenname+'<br/><span style="font-size:13px"><a href="https://twitter.com/'+twitterprofile+'" >@'+twitterprofile+'</a></span></h1>';
    loadingHTML += '<div id="loading-container"><img src="css/images/ajax-loader.gif" width="32" height="32" alt="tweet loader" /></div>';
 
    $('#twitter-feed').html(headerHTML + loadingHTML);
 
    $.getJSON('twitter_test.json',
        function(feeds) {
            //alert(feeds);
            var feedHTML = '';
            var displayCounter = 1;
            for (var i=0; i<feeds.length; i++) {
                var tweetscreenname = feeds[i].user.name;
                var tweetusername = feeds[i].user.screen_name;
                var profileimage = feeds[i].user.profile_image_url_https;
                var status = feeds[i].text;
                var isaretweet = false;
                var isdirect = false;
                var tweetid = feeds[i].id_str;
                var entities = feeds[i].entities;
 
                //If the tweet has been retweeted, get the profile pic of the tweeter
                if(typeof feeds[i].retweeted_status != 'undefined'){
                   profileimage = feeds[i].retweeted_status.user.profile_image_url_https;
                   tweetscreenname = feeds[i].retweeted_status.user.name;
                   tweetusername = feeds[i].retweeted_status.user.screen_name;
                   tweetid = feeds[i].retweeted_status.id_str
                   isaretweet = true;
                   
                   status = feeds[i].retweeted_status.text;
                   entities = feeds[i].retweeted_status.entities;
                 };
 
                 //Check to see if the tweet is a direct message
                 if (feeds[i].text.substr(0,1) == "@") {
                     isdirect = true;
                 }
 
                //console.log(feeds[i]);
 
                 if (((showretweets == true) || ((isaretweet == false) && (showretweets == false))) && ((showdirecttweets == true) || ((showdirecttweets == false) && (isdirect == false)))) {
                    if ((feeds[i].text.length > 1) && (displayCounter <= displayLimit)) {
                        if (showtweetlinks == true) {
                            status = processEntities(status, entities);
                        }
 
                        if (displayCounter == 1) {
                            feedHTML += headerHTML;
                        }
 
                        feedHTML += '<div class="twitter-article">';
                        feedHTML += '<div class="twitter-pic"><a data-rel="external" target="_blank" href="https://twitter.com/'+tweetusername+'" ><img src="'+profileimage+'"images/twitter-feed-icon.png" width="42" height="42" alt="twitter icon" /></a></div>';
                        feedHTML += '<div class="twitter-text"><p><span class="tweetprofilelink"><strong><a data-rel="external" target="_blank" href="https://twitter.com/'+tweetusername+'" >'+tweetscreenname+'</a></strong> <a data-rel="external" target="_blank" href="https://twitter.com/'+tweetusername+'" >@'+tweetusername+'</a></span><span class="tweet-time"><a data-rel="external" target="_blank" href="https://twitter.com/'+tweetusername+'/status/'+tweetid+'">'+relative_time(feeds[i].created_at)+'</a></span><br/>'+status+'</p>';

						if (isaretweet)
						{
							feedHTML += '<div class="retweetedBy"><p>Retweeted by <a data-rel="external" target="_blank" href="https://twitter.com/' + feeds[i].user.screen_name
											+ '">' + feeds[i].user.name + '</a></p></div>';
						}

						feedHTML += '</div>';
						if (entities.media != null)
						{                        
	                        for (var index = 0; index < entities.media.length; index++)
	                        {
	                        	if (entities.media[index].type != "photo")
	                        		continue;
	                        	
	                        	var media = entities.media[index];
	                        	feedHTML += '<div class="tweetImage"><img src="' + media.media_url + ':small"></div>';
	                        }
	                    }
                        
                        feedHTML += '</div>';
                        displayCounter++;
                    }
                 }
            }
 
            $('#twitter-feed').html(feedHTML);
    });
}
 

function processEntities(twitterText, entities) {
	if (entities == null)
		return twitterText;
	
	var originalText = twitterText;
	if ((entities.hashtags != null) && (entities.hashtags.length > 0))
	{
		for (var index = 0; index < entities.hashtags.length; index++)
		{
			var hashtag = entities.hashtags[index];
			var length = (hashtag.indices[1] - hashtag.indices[0]);
			
			var startIndex = -1;
			if (hashtag.indices[1] == originalText.length)
			{
				startIndex = twitterText.length-length;
			}
			else {
				startIndex = twitterText.indexOf(originalText.slice(hashtag.indices[0], hashtag.indices[1]) + ' ');
			}
			
			var endIndex = startIndex + length;
			
			twitterText = twitterText.slice(0, startIndex) + '<a data-rel="external" target="_blank" href="https://twitter.com/search?q=%23' + hashtag.text + '&src=hash">#'
						+ hashtag.text + '</a>' + twitterText.slice(endIndex);
		}
	}
	
	if ((entities.user_mentions != null) && (entities.user_mentions.length > 0))
	{
		for (var index = 0; index < entities.user_mentions.length; index++)
		{
			var mention = entities.user_mentions[index];
			var length = (mention.indices[1] - mention.indices[0]);
			
			var startIndex = -1;
			if (mention.indices[1] == originalText.length)
			{
				startIndex = twitterText.length-length;
			}
			else {
				startIndex = twitterText.indexOf(originalText.slice(mention.indices[0], mention.indices[1]) + ' ');
			}

			var endIndex = startIndex + length;
			
			twitterText = twitterText.slice(0, startIndex) + '<a data-rel="external" target="_blank" href="https://twitter.com/' + mention.screen_name + '">@'
						+ mention.screen_name + '</a>' + twitterText.slice(endIndex);

		}
	}

	if ((entities.urls != null) && (entities.urls.length > 0))
	{
		for (var index = 0; index < entities.urls.length; index++)
		{
			var url = entities.urls[index];
			var length = (url.indices[1] - url.indices[0]);
			
			var startIndex = -1;
			if (url.indices[1] == originalText.length)
			{
				startIndex = twitterText.length-length;
			}
			else {
				startIndex = twitterText.indexOf(url.url + ' ');
			}
			
			var endIndex = startIndex + length;
			
			var display_url = url.display_url;
			if (display_url == null)
				display_url = url.url;
			
			twitterText = twitterText.slice(0, startIndex) + '<a data-rel="external" target="_blank" href="' + url.url + '">'
						+ display_url + '</a>' + twitterText.slice(endIndex);
		}
	}
	
	if ((entities.media != null) && (entities.media.length > 0))
	{
		for (var index = 0; index < entities.media.length; index++)
		{
			var media = entities.media[index];
			if (media.type != "photo")
				continue;

			var length = (media.indices[1] - media.indices[0]);
			
			var startIndex = -1;
			if (media.indices[1] == originalText.length)
			{
				startIndex = twitterText.length-length;
			}
			else {
				startIndex = twitterText.indexOf(media.url + ' ');
			}
			
			var endIndex = startIndex + length;
	
			twitterText = twitterText.slice(0, startIndex) + '<a data-rel="external" target="_blank" href="' + media.url + '">'
						+ media.display_url + '</a>' + twitterText.slice(endIndex);	
		}
	}

	return twitterText;
}

function relative_time(time_value) {
  var values = time_value.split(" ");
  time_value = values[1] + " " + values[2] + ", " + values[5] + " " + values[3];
  var parsed_date = Date.parse(time_value);
  var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
  var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
  var shortdate = time_value.substr(4,2) + " " + time_value.substr(0,3);
  delta = delta + (relative_to.getTimezoneOffset() * 60);

  if (delta < 60) {
    return '1m';
  } else if(delta < 120) {
    return '1m';
  } else if(delta < (60*60)) {
    return (parseInt(delta / 60)).toString() + 'm';
  } else if(delta < (120*60)) {
    return '1h';
  } else if(delta < (24*60*60)) {
    return (parseInt(delta / 3600)).toString() + 'h';
  } else if(delta < (48*60*60)) {
    //return '1 day';
    return shortdate;
  } else {
    return shortdate;
  }
}
