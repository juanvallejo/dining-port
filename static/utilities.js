/**
* Provided under the MIT License (c) 2014
* See LICENSE @file for details.
*
* @file common.js
*
* @author juanvallejo, Austin Schaffer
* @date 10/15/14
*
* Contains global information for the mobile application.
*/

var Utilities = {};

/**
 * Sends an XMLHttpRequest GET request to
 * a specified url
 */
Utilities.sendGETRequest = function(url, callback) {

    var request;
    var ie = false;

    if(ENV == ENV_OFFLINE) {
        url = '/apis/' + url;
    } else if(ENV == ENV_OFFLINE_NOSERVER) {
        url = 'http://navigator-fixed.rhcloud.com/apis/' + url;
    }

    if (window.XMLHttpRequest) {
        request = new XMLHttpRequest();
    } else {
        ie = true;
        request = new ActiveXObject("Microsoft.XMLHTTP");
    }

    request.open("GET", url, true);
    request.send();

    if(ie) {
        request.attachEvent('onreadystatechange', handleStateChange);
    } else {
        request.addEventListener('readystatechange', handleStateChange);
    }
    
    /**
     * Handles statechanges in the request
     * @return xml request object containing
     * returned data
     */
    function handleStateChange() {
        if(this.status == 200 && this.readyState == 4) {
            callback.call(this, this);
        }
    }

}

Utilities.xmlDoc = function(url) {

    if (ENV == ENV_OFFLINE) {
        url = '/apis/' + url;
    }

    // Returns an xml document from a url
    if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
    }

    else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    xmlhttp.open("GET", url, false);
    xmlhttp.send();

    return xmlhttp.responseXML;

}

Utilities.xmlToJson = function(xml) {
    // Create the return object
    var obj = {};
 
    if (xml.nodeType == 1) { // element
        // do attributes
        if (xml.attributes.length > 0) {
            obj["@attributes"] = {};
            for (var j = 0; j < xml.attributes.length; j++) {
                var attribute = xml.attributes.item(j);
                obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
            }
        }
    }
    else if (xml.nodeType == 3) { // text
        obj = xml.nodeValue;
    }
 
    // do children
    if (xml.hasChildNodes()) {
        for (var i = 0; i < xml.childNodes.length; i++) {
            var item = xml.childNodes.item(i);
            var nodeName = item.nodeName;
            if (typeof(obj[nodeName]) == "undefined") {
                obj[nodeName] = Utilities.xmlToJson(item);
            }
            else {
                if (typeof(obj[nodeName].push) == "undefined") {
                    var old = obj[nodeName];
                    obj[nodeName] = [];
                    obj[nodeName].push(old);
                }
                obj[nodeName].push(Utilities.xmlToJson(item));
            }
        }
    }
    return obj;
};

var has = function(s, array) {
    for (var i = 0;i < array.length;i++) {
        if (array[i] === s)
            return true;
    }
    return false;
}

var convertHours = function(a) {
    var h = a[0];
    var m = a[1];
    var meridiem = "AM";
    if (h >= 12) {
        meridiem = "PM";
        if (h > 12) {
            h-=12;
        }
    }
    if (h == 00)
        h = 12;
    return h + ":" + m + " " + meridiem
}

String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
        return typeof args[number] !== 'undefined' ? args[number] : match;
    });
};
