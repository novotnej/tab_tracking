var buttonState = false;
var currentUrl = "";
initBg();

function getButtonState() {
    return buttonState;
}

function initBg() {
    chrome.tabs.onActivated.addListener(tabActivatedListener);
}

function switchButtonState() {
    if (buttonState) {
        sendStop();
    }
    return buttonState = !buttonState;
}

function processActivatedTab(tab) {
    //log(tab);
    if (tab.active && tab.status === "complete") {
        var cleanUrl = getCleanUrl(tab.url);
        if (currentUrl != cleanUrl) {
            currentUrl = cleanUrl;
            sendStart(currentUrl);
        }
    }
}

function tabActivatedListener(info) {
    //log("tabActivated");
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

function sendMessage(message) {
    log(message);
}

function sendStart(url) {
    if (buttonState) {
        sendMessage(getTimeStamp() + " START " + url);
        //log(getTimeStamp() + " START: " + url);
    } else {
        log(getTimeStamp() + " NOT SENDING SIGNAL, url " + url);
    }
}

function sendStop() {
    //notify server
    sendMessage(getTimeStamp() + " STOP");
}

function getTimeStamp() {
    return Math.round((new Date()).getTime() / 1000);
}

function log(e) {
    console.log(e);
}