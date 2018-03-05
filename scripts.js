$( document ).ready(function() {
    //init scripts

    var button = $("#trackerButton");
    var buttonState = false;
    init();

    var currentUrl = "";

    function init() {
        button.on("change", switchButton);
        chrome.tabs.onActivated.addListener(tabActivatedListener);
    }


    function switchButton() {
        if (buttonState) {
            buttonState = false;
            sendStop();
        } else {
            buttonState = true;
            //no need to sendStart() - will be sent with first tab change
        }
        log("Switch button, new state: " + buttonState);
        button.attr("trackingstatus", buttonState);
    }

    function processActivatedTab(tab) {
        if (tab.active && tab.status === "complete") {
            //log(tab);
            var cleanUrl = getCleanUrl(tab.url);
            if (currentUrl != cleanUrl) {
                currentUrl = cleanUrl;
                sendStart(currentUrl);
            }
        }
    }

    function tabActivatedListener(info) {
        chrome.tabs.get(info.tabId, processActivatedTab);
    }

    /**
     * returns second level domain of a given url
     * @param string url
     */
    function getCleanUrl(url) {
        var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
        if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
            return match[2];
        }
        else {
            return null;
        }
    }

    function sendStart(url) {
        if (buttonState) {
            log(getTimeStamp() + "Sending start signal to server: " + url);
        } else {
            log(getTimeStamp() + " NOT SENDING SIGNAL, url " + url);
        }
    }

    function sendStop() {
        //notify server
        log(getTimeStamp() + "Sending stop signal to server");
    }

    function getTimeStamp() {
        return Math.round((new Date()).getTime() / 1000);
    }

    function log(it) {
        chrome.extension.getBackgroundPage().console.log(it);
    }
});
