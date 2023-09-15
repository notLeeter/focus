browser.runtime.onInstalled.addListener(setup);

function setup(details) {
    if (details.reason === "install") {
        browser.storage.local.set({
            timestamp: 0 // make sure local storage is setup properly
        });
    }
}