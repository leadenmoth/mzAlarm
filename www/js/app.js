// Download and save RSS
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
            // Store downloaded RSS for future use
            
            localStorage.setItem('rss',JSON.stringify(data.query.results.item));
            // Iterate through last X entries on RSS
            $('#accordion').empty();
            localStorage.setItem('counter', 0);
            localStorage.setItem('alarmText', '');

            appendRSS(Number(localStorage.getItem('counter')));
            
        });
};

// Append new entries to feed
function appendRSS(counter) {
    // Figure out how many entries left to load 
    // (Mediazona's RSS has 50 entries, but let's not hardcode)
    var feed = JSON.parse(localStorage.getItem("rss"));
    var limit = Object.keys(feed).length - 1;
    var delta;
    if (limit - counter - 20 >= 0) {
        delta = 20;
    } else if (limit - counter >= 0) {
        delta = limit - counter;
    } else {
        delta = 0;
    }
    for (i=counter; i<counter + delta; i++)
    {
        //Cut off the article beyond first passage
        var entry = feed[i];
        var fullText = entry['full-text'];
        fullText = fullText.substring(0, fullText.indexOf("</p>")) + '</p>';

        //Append header, teaser text and read more button
        $('#accordion').append('<div data-role="collapsible"><h3>' + entry.title + '</h3><p>' + entry.pubDate + '</p><div>' + fullText + '<a href="' + entry.link + '" target=_blank class="ui-btn ui-mini ui-icon-action ui-btn-icon-right ui-alt-icon ui-nodisc-icon">Read more</a></div></div>').collapsibleset('refresh');
        
        localStorage.setItem('alarmText', localStorage.getItem('alarmText') + '. '+ entry.title);

    };
    localStorage.setItem('counter', Number(localStorage.getItem('counter')) + 20);
}


// Read out accordion elements on expansion
$(document).on("collapsibleexpand", "#accordion > div", function(){
    headline = $(this).find('h3').text();
    readItem(headline.substring(0, headline.indexOf("click to ")));
    // Add handler to stop reading on collapse
    // We don't add it on page creation because it fires immediately for each collapsed element
    $(this).collapsible({
        collapse: function() {
            readItem('');
        }
    });
});

// Prepare text for alarm clock

// Pull to refresh
$('#content').bind('pulled', function() {
    getRSSFeed('https://zona.media/rss/news.php');

    $('#content').scrollz('hidePullHeader');
});

$('#content').bind('bottomreached', function() {
    appendRSS(Number(localStorage.getItem('counter')));
})

getRSSFeed('https://zona.media/rss/news.php');

document.addEventListener('deviceready', function () {
    $('#content').scrollz('hidePullHeader');
    
    $("#setAlarm").on("change paste keyup", function() {
        localStorage.setItem('time', $(this).val());
        console.log(localStorage.getItem('time'));
        setupAlarm(Number($(this).val().substr(0,2)), Number($(this).val().substr(3,2)));
    });
    
}, false);

// Read text
function readItem(item) {
    TTS
        .speak({
            text: item,
            locale: 'ru-RU',
            rate: 1.00
        }, function () {
            //alert('success');
        }, function (reason) {
            //alert(reason);
        });
};

function setupAlarm(hr, min){
    window.wakeuptimer.wakeup( function(result){
        if (result.type==='wakeup') {
            readItem(localStorage.getItem('alarmText'));
            //alert('Alarm went off!' + result.extra);
        } else if(result.type==='set'){
            console.log('wakeup alarm set--' + result);
        } else {
            console.log('wakeup unhandled type (' + result.type + ')');
        }
        
    }, function(){},
       // a list of alarms to set
       {
            alarms : [{
                type : 'onetime',
                time : { hour : hr, minute : min },
                extra : { message : 'json containing app-specific information to be posted when alarm triggers' },
                message : 'Alarm has expired!'
           }]
       }
    );
};