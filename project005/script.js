
chrome.runtime.sendMessage({name: "fetchWords"}, (res) => {
    alert('a')
    // Wait for response

    console.log(res);

    document.querySelector('h1').innerHTML = res.word;
    document.querySelector('p').innerHTML = res.desc;
});