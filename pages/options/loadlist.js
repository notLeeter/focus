const blockListEl = document.getElementById("blocklist");
const whiteListEl = document.getElementById("whitelist");
var blockArr = null;
var whitelistArr = null;

async function loadLists() {
    blockArr = await browser.storage.local.get('blocklist').then(obj => obj.blocklist);
    whitelistArr = await browser.storage.local.get('whitelist').then(obj => obj.whitelist);;
};

function injectData(url, listname) {
    for (const blockIndex in blockArr) {
        addListItem(blockListEl, blockArr[blockIndex], 'blocklist');
    };
    for (const whitelistIndex in whitelistArr) {
        addListItem(whiteListEl, whitelistArr[whitelistIndex], 'whitelist');
    };
};

function addListItem(list, link, listname) {
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(link));
    li.setAttribute('key', listname)
    list.appendChild(li);
};

loadLists().then(injectData);