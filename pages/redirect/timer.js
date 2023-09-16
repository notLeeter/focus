var timestamp = 0;
var url = null;

async function loadTimestamp () {
    window.location.search.substring(1);
};

const doneWarning = document.getElementById('done-warning');
const timerElement = document.getElementById("timer");

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
    else if (doneWarning.style.display === '') {
        clearInterval(timerInterval);
        doneWarning.style.display = 'block';
        window.location.replace(url);
    }

    timerElement.textContent = remaining;
}

function setTimer(sec) {
    timestamp = Math.floor(new Date().getTime()/1000) + parseInt(sec);
};

var timerInterval = null;

loadTimestamp().then(() => {
    timer();
    timerInterval = setInterval(timer, 1000);
})

timestamp = document.location.search.substring(1, 11);
url = document.location.search.substring(12);
document.getElementById('website-link').textContent = url;
document.getElementById('settings').textContent = `settings`;
document.getElementById('settings').href = browser.runtime.getURL(`../pages/options/options.html`);