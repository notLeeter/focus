const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

(async () => {
    for ([listName, url] of urlParams) {
        if (url === "") continue;
        var list = await browser.storage.local.get(listName).then(obj => obj[listName]);
        if (list.includes(url)) continue;

        list.push(url)
        
        await setList(listName, list);
        document.getElementById('warning').style.display = 'block';
    }
})();

async function setList(listName, list) {
    await browser.storage.local.set({[listName]: list});
};

function listenForClicks() {
    document.addEventListener('click', async (e) => {
        var target = e.target;

        if (target.nodeName === "LI") {
            var listName = target.attributes["key"]?.nodeValue;
            var list = await browser.storage.local.get(listName).then(obj => obj[listName]);
            var index = list.indexOf(target.innerText);

            if (index > -1) {
                list.splice(index, 1);
                await setList(listName, list);
                target.remove();
            }
            
        };
    });
};

listenForClicks();