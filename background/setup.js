browser.runtime.onInstalled.addListener(setup);

function setup(details) {
    if (details.reason === "install") {
        browser.storage.local.set({
            timestamp: 0, // make sure local storage is setup properly
            blocklist: new Array(
            "discord.com",
            "youtube.com",
            "tiktok.com",
            "twitter.com",
            "x.com",
            "netflix.com",
            "primevideo.com",
            "hulu.com",
            "9animetv.to",
            "crunchyroll.com",
            "krunker.io",
            "reddit.com",
            "twitch.tv",
            "instagram.com",
            "snapchat.com",
            "facebook.com",
            "pinterest.com",
            "telegram.com",
            "tumblr.com",
            "ifunny.co",
            "9gag.com",
            "4chan.org",
            "omegle.com",
            "gab.com",
            "roblox.com",
            "pixiv.net"
            ),
            whitelist: new Array(
                "music.youtube.com"
            )
        });
    };
};