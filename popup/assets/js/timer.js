var timestamp = 0;
const timeLeftElement = document.getElementById("time-left");

async function loadTimestamp () {
    await browser.storage.local.get('timestamp').then(object => {
        timestamp = object.timestamp;
    });
};

function timer() {
    const difference = timestamp - (new Date().getTime()/1000);
    let remaining = "no time";

    if (difference > 0) {
        const parts = {
          days: Math.floor(difference / (60 * 60 * 24)),
          hours: Math.floor((difference / (60 * 60)) % 24),
          minutes: Math.floor((difference / 60) % 60),
          seconds: Math.floor(difference % 60),
        };
        remaining = Object.keys(parts).map(part => {
            if (parts[part] === 0) return;
            return `${parts[part]} ${part}`;  
        }).join(" ");
    }

    timeLeftElement.textContent = remaining;
}

function setTimer(sec) {
    timestamp = Math.floor(new Date().getTime()/1000) + parseInt(sec);
    browser.storage.local.set({ timestamp: timestamp});
    notifyBackgroundPage(timestamp)
};

function notifyBackgroundPage(timestamp) {
    browser.runtime.sendMessage({
        focusTimestamp: timestamp,
    });
}

function listenForClicks() {
    document.addEventListener('click', (e) => {
        var timerAdd = e.target.attributes["data-timer-add"]?.nodeValue;
        if (timerAdd) {
            setTimer(timerAdd);
        }
    });
};

loadTimestamp().then(() => {
    timer();
    setInterval(timer, 1000);
    listenForClicks();
});

document.getElementById('options').href = browser.runtime.getURL(`../pages/options/options.html`);