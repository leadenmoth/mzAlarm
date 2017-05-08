function getRSSFeed(feed){
    // Prepare YQL query
    var qryRSS = 'select * from rss where url='+'"'+feed+'"';
    // YQL converts RSS to JSON for us
    $.getJSON("http://query.yahooapis.com/v1/public/yql",
        {
            // These are the settings for your API call
            q: qryRSS,
            format: "json"
        },
        // Build an accordion of entries we got from YQL
        function(data) {
            $('#accordion').empty();        
            // Iterate through last X entries on RSS
            for (i=0; i<20; i++)
            {
                //Cut off the article beyond first passage
                var fullText = data.query.results.item[i]['full-text'];
                fullText = fullText.substring(0, fullText.indexOf("</p>")) + '</p>';
                //Append header, teaser text and read more button
                $('#accordion').append('<div data-role="collapsible"><h3>' + data.query.results.item[i].title + '</h3><p>' + data.query.results.item[i].pubDate + '</p><div>' + fullText + '<a href="' + data.query.results.item[i].link + '" target=_blank class="ui-btn ui-mini ui-icon-action ui-btn-icon-right">Read more</a></div></div>').collapsibleset('refresh');

            };
        });
};

$('#content').bind('pulled', function() {
    getRSSFeed('https://zona.media/rss/news.php');

    $('#content').scrollz('hidePullHeader');
    //$('#content').scrollz('height', $(document).height());    
  });
getRSSFeed('https://zona.media/rss/news.php');
