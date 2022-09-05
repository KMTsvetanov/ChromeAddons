document.querySelector("body > div.L3eUgb > div.o3j99.LLD4me.yr19Zb.LS8OJ > div > img").style.transitionDuration = '3.0s';
document.querySelector("body > div.L3eUgb > div.o3j99.LLD4me.yr19Zb.LS8OJ > div > img").style.transform = 'rotate(3600deg)';

// 1. Send a message to the service worker
chrome.runtime.sendMessage({"name": "fetchWords"}, (response) => {
    // 3. Got an asynchronous response with the data from the service worker
    console.log(response);
    document.querySelector("div#SIvCob").innerHTML =response.word;
});