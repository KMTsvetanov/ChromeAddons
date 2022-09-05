try{
//On first install open onboarding
    chrome.runtime.onInstalled.addListener(r => {
        // default state goes here
        // this runs ONE TIME ONLY (unless the user reinstalls your extension)
        if(r.reason == 'install'){
            //first install
            //show onboarding page
            chrome.tabs.create({
                url: 'onboarding-page.html'
            });
        };
    });


//ON page change
    chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
        //chrome.tabs.query({ active: true, lastFocusedWindow: true }, function (tabs) { // <-- can use to grab tabId if not within tabs listener...
        //const tabId = tabs[0].id; // set tabid

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

        //}); // <-- close extra listener for tabid
    });

}catch(e){
    console.log(e);
}