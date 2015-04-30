
var menuEntries = [];

var Dining = {};

Dining.ERR_EMPTY_MENU   = 'No menu data avilable at this time.';

Dining.REGATTAS         = 'REGATTAS';
Dining.COMMONS          = 'COMMONS';
Dining.EINSTEINS        = 'EINSTEINS';
Dining.BISTRO           = 'BISTRO';
Dining.CAFE             = 'CAFE';
Dining.GRILL            = 'GRILL';

Dining.COMMONS_MENU     = 'http://www.google.com/calendar/feeds/cnu.edu_tjpup58u1v03ijvc91uof8qmq0%40group.calendar.google.com/public/basic?singleevents=true&sortorder=ascending&orderby=starttime&futureevents=true&max-results=180';
Dining.REGATTAS_MENU    = 'http://www.google.com/calendar/feeds/dining@cnu.edu/public/basic?singleevents=true&sortorder=ascending&orderby=starttime&futureevents=true&max-results=180';
Dining.EINSTEINS_MENU   = 'http://mobileapps.cnu.edu/rssfeeds/einsteins_menu.xml';
Dining.EINSTEINS_HOURS  = 'http://mobileapps.cnu.edu/rssfeeds/einsteins_hours.xml';
Dining.BISTRO_MENU      = 'http://mobileapps.cnu.edu/rssfeeds/discovery_bistro_menu.xml';
Dining.BISTRO_HOURS     = 'http://mobileapps.cnu.edu/rssfeeds/discovery_bistro_hours.xml';
Dining.CAFE_HOURS       = 'http://mobileapps.cnu.edu/rssfeeds/discovery_cafe_hours.xml';
Dining.CAFE_MENU        = 'http://mobileapps.cnu.edu/rssfeeds/discovery_cafe_menu.xml';
Dining.GRILL_HOURS      = 'http://mobileapps.cnu.edu/rssfeeds/discovery_grill_hours.xml';
Dining.GRILL_MENU       = 'http://mobileapps.cnu.edu/rssfeeds/discovery_grill_menu.xml';

Dining.USE_DEFAULT_MENU = true;

// stores menu data
Dining.cache = {};

/**
 * Fetches a menu based on the type
 * of restaurant passed
 */
Dining.get = function(place, callback) {

    var hours, menus;
    
    if (place == Dining.REGATTAS) {
        diningFeed(Dining.REGATTAS_MENU, callback);
    } else if (place == Dining.COMMONS) {
        diningFeed(Dining.COMMONS_MENU, callback);
    } else if (place == Dining.EINSTEINS) {
        Dining.parseStandardDiningFeed(Dining.EINSTEINS_MENU, Dining.EINSTEINS_HOURS, callback);
    } else if (place == Dining.BISTRO) {
        Dining.parseStandardDiningFeed(Dining.BISTRO_MENU, Dining.BISTRO_HOURS, callback);
    } else if(place == Dining.CAFE) {
        Dining.parseStandardDiningFeed(Dining.CAFE_MENU, Dining.CAFE_HOURS, callback);    
    } else if(place == Dining.GRILL) {
        Dining.parseStandardDiningFeed(Dining.GRILL_MENU, Dining.GRILL_HOURS, callback);
    }
    
}

/**
 * Returns a block of text containing
 * the entire menu data
 */
Dining.parseStandardDiningFeed = function(place, hours, callback) {

    if(Dining.cache[place]) {
        return callback.call(this, null, Dining.cache[place], Dining.cache[hours]);
    }

    if(!callback && typeof hours == 'function') {
        callback = hours;
    }

    Utilities.sendGETRequest(place, function(response) {

        if(!response.responseXML) {
            return callback.call(this, Dining.ERR_EMPTY_MENU, null);
        }

        var times       = null;
        var content     = response.responseXML.getElementsByTagName('description')[1].childNodes[0].nodeValue;

        // format hours
        // var hours   = content.split('<td>');
        // hours[1]    = hours[1].replace('</td>', '');
        // hours[2]    = hours[2].replace('</td>', '');
        // hours       = hours[1] + hours[2];

        Dining.cache[place] = content;

        if(hours) {

            Utilities.sendGETRequest(Dining.EINSTEINS_HOURS, function(response) {
                
                if(response.responseXML) {
                    
                    times       = response.responseXML.getElementsByTagName('description')[1].childNodes[0].nodeValue;
                    times       = times.split('<td>')[0];

                    times       = '<strong class="bold">Schedule</strong>' + times;

                    Dining.cache[hours] = times;
                }

                callback.call(this, null, content, times);

            });

        } else {
            callback.call(this, null, content, times);
        }

    });

}

/**
 * Returns an array of menuItems from
 * a passed xml url. Array is returned
 * as the first parameter in a callback
 * function. If no callback is passed,
 * no further action is taken.
 */
function diningFeed(place, callback) {

    if(Dining.cache[place]) {
        return callback.call(this, null, Dining.cache[place]);
    }

    menuEntries = [];

    var menuItems = [];
    
    var menu = "";
    var summary = "";
    var mealType = "";
    var date = "";
    var time = "";
    var maxEntries = 30;
    var menuItemElem;
    var onClickFunction;
    
    Utilities.sendGETRequest(place, function(response) {
        
        if (response.responseXML === null || response.responseXML === undefined || response.responseXML.getElementsByTagName("entry").length === 0) {
            return callback.call(this, Dining.ERR_EMPTY_MENU, null);
        }

        var entries = Utilities.xmlToJson(response.responseXML).feed.entry;
        
        for (var i = 0; i < maxEntries && i < entries.length; i++) {

            menu = entries[i]["content"]["#text"].split("Event Description: ")[1];
            if (menu === null || menu === undefined) {
                menu = "No menu available.";
            }
            
            while (menu.indexOf("&amp;") !== -1) {
                menu = menu.replace("&amp;", "&");
            }

            while (menu.indexOf("\n") !== -1) {
                menu = menu.replace("\n", "<br />");
            }
            
            summary = entries[i]["summary"]["#text"];
            mealType = entries[i]["title"]["#text"];
            
            summary = removeGarbage(summary);
            date = parseDateFrom(summary);
            time = parseTimeFrom(summary);

            // form menu object
            menuItems[i]         = {};
            menuItems[i].summary = summary;
            menuItems[i].date    = date;
            menuItems[i].time    = time;
            menuItems[i].meal    = mealType;
            menuItems[i].menu    = menu;
            
        }

        Dining.cache[place] = menuItems;

        // return menu array via callback
        callback.call(this, null, menuItems);

    });
}

var removeGarbage = function(summary) {

    summary = summary.split("<br>")[0];
    summary = summary.replace("&nbsp;", "");
    summary = summary.replace("\n", " ");
    summary = summary.replace("When: ", "");
    summary = summary.replace(/..../, "");
    summary = summary.split(" ");
    
    return summary;
}

var parseDateFrom = function(summary) {
    summary = summary[0] + " " + summary[1] + " " + summary[2];
    var date = new Date(summary);
    var temp = date.toString().split(" ");
    
    date = temp[0] + ", "
           + temp[1] + " "
           + date.getDate() + ", "
           + date.getFullYear();
    
    return date;
}

var parseTimeFrom = function(summary) {
    var time = [
        summary[3], 
        summary[summary.length - 2]
    ];
    return time[0] + " to " + time[1];
}

function formatMenu() {
    var tables = document.getElementById("hours-and-menus-display").getElementsByTagName("tbody");
    for (var i = 0; i < tables.length; i++) {
        var rows = tables[i].getElementsByTagName("tr");
        for (var j = 0; j < rows.length;j++)
            rows[j].style.backgroundColor = j % 2===0? "#ffffff" : "#dddddd";
    }
}

function displayModal(title, message) {
    document.getElementById("dining-modal-header").innerHTML = title;
    document.getElementById("dining-modal-content").innerHTML = message;
    document.getElementById("dining-modal").style.display = "block";
}
function closeModal() {
    document.getElementById("dining-modal").style.display = "none";
    document.getElementById("dining-modal-header").innerHTML = "";
    document.getElementById("dining-modal-content").innerHTML = "";
}