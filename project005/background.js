try{
//On first install open onboarding
    chrome.runtime.onInstalled.addListener(r => {
        // default state goes here
        // this runs ONE TIME ONLY (unless the user reinstalls your extension)
        if(r.reason == 'install'){
        };
    });

}catch(e){
    console.log(e);
}