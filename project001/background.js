try{
//On first install open onboarding
    chrome.runtime.onInstalled.addListener(r => {
        // default state goes here
        // this runs ONE TIME ONLY (unless the user reinstalls your extension)
        if(r.reason == 'install'){
        };
    });


//ON page change
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete' && /^http/.test(tab.url)) {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ["./contentScript.js"]
            })
                .then(() => {
                    console.log("INJECTED THE FOREGROUND SCRIPT.");
                })
                .catch(err => console.log(err));
        }
    });

    chrome.runtime.onMessage.addListener((message, sender, response) => {
        // 2. A page requested user data, respond with a copy of `user`
        if (message.name == "fetchWords") {
            // const apiKey = '';
            // const dateSrt = new Date().toISOString().slice(0, 10); // 2020-01-01
            // const apiCall = "https://catfact.ninja/fact";
            const apiCall = "http://localhost:8183/admin";

            // We Call API...
            fetch(apiCall).then(function (res) {
                // wait for response...
                if (res.status != 200) {
                    response({word: "Error", desc: "There was a problem with the API call 001"});
                    return;
                }
                res.json().then(function (data) {
                    // send the response...
                    response({word: data.fact, desc: data.length});
                })
            }).catch(function (err) {
                response({word: "Error", desc: "There was a problem with the API call 002"});
            })
        }

        return true;
    });
}catch(e){
    console.log(e);
}