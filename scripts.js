$( document ).ready(function() {
    //init scripts

    var button = $("#trackerButton");

    var bgPage = chrome.extension.getBackgroundPage();
    init();

    function init() {
        button.on("change", switchButton);
        popupRefresh();
    }

    function popupRefresh() {
        log("popup refresh");
        var state = bgPage.getButtonState();
        button.attr("checked", state);
        log("updating button from storage" + state);
    }

    function switchButton() {
        bgPage.switchButtonState();
    }

    function log(it) {
        chrome.extension.getBackgroundPage().console.log(it);
    }
});
