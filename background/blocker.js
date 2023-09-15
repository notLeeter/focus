const filter = { urls: ["<all_urls>"], types: ["main_frame"] };
import { blockSet, whitelistArr } from "./sets.js"
const extraInfoSpec = ["blocking"];

var timestamp = 0;

async function loadTimestamp() {
    await browser.storage.local.get('timestamp').then(object => {
        timestamp = object.timestamp;
    });
};

async function removeListener() {
    if (browser.webRequest.onBeforeRequest.hasListener(webRequestListener)) {
        browser.webRequest.onBeforeRequest.removeListener(webRequestListener);
    };
}

async function webRequestListener(details) {
    if (whitelistArr.some(v => details.url.includes(v))) return;

    var redirectUrl = browser.runtime.getURL(`../pages/redirect.html?${timestamp}&${details.url}`);

    var loadedUrl = details.url.replace(/^https?:\/\/(?:[^\/]+?\.)?([^\/]+\.[a-z]+).*$/, '$1');
    var blocked = blockSet.has(loadedUrl);

    if (blocked) {
        if (details.method == "GET") {
            return {
                redirectUrl: redirectUrl
            };
        }
    }
};

async function handleMessage(request) {
    if (!request.focusTimestamp) return;

    timestamp = request.focusTimestamp;
    setTimeout(removeListener, Math.floor(timestamp * 1000 - new Date().getTime()));
    browser.webRequest.onBeforeRequest.addListener(
        webRequestListener,
        filter,
        extraInfoSpec
    );
}

browser.runtime.onMessage.addListener(handleMessage);

loadTimestamp().then(() => {
    setTimeout(removeListener, Math.floor(timestamp * 1000 - new Date().getTime()));
    browser.webRequest.onBeforeRequest.addListener(
        webRequestListener,
        filter,
        extraInfoSpec
    );
});