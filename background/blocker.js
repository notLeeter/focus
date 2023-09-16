const filter = { urls: ["<all_urls>"], types: ["main_frame"] };
const extraInfoSpec = ["blocking"];

var blockSet = null;
var whitelistSet = null;
var timestamp = 0;

async function loadVars() {
    whitelistSet = await browser.storage.local.get('whitelist').then(obj => new Set(obj.whitelist));
    blockSet = await browser.storage.local.get('blocklist').then(obj => new Set(obj.blocklist));
    timestamp = await browser.storage.local.get('timestamp').then(obj => obj.timestamp);
};

async function removeListener() {
    if (browser.webRequest.onBeforeRequest.hasListener(webRequestListener)) {
        browser.webRequest.onBeforeRequest.removeListener(webRequestListener);
    };
}

async function webRequestListener(details) {
    if (timestamp === 0) return;
    whitelistSet = await browser.storage.local.get('whitelist').then(obj => new Set(obj.whitelist));
    if (whitelistSet.has(details.url)) return;

    blockSet = await browser.storage.local.get('blocklist').then(obj => new Set(obj.blocklist));

    var redirectUrl = browser.runtime.getURL(`../pages/redirect/redirect.html?${timestamp}&${details.url}`);

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

    whitelistSet = await browser.storage.local.get('whitelist').then(obj => new Set(obj.whitelist));
    blockSet = await browser.storage.local.get('blocklist').then(obj => new Set(obj.blocklist));

    timestamp = request.focusTimestamp;
    setTimeout(removeListener, Math.floor(timestamp * 1000 - new Date().getTime()));
    browser.webRequest.onBeforeRequest.addListener(
        webRequestListener,
        filter,
        extraInfoSpec
    );
}

browser.runtime.onMessage.addListener(handleMessage);

loadVars().then(() => {
    setTimeout(removeListener, Math.floor(timestamp * 1000 - new Date().getTime()));
    browser.webRequest.onBeforeRequest.addListener(
        webRequestListener,
        filter,
        extraInfoSpec
    );
});