
global = {};
global.config = {
    debug:true,
    filter:["http://*/*","https://*/*"]
};



class Listener{
    before_request = ()=>{};
	send_headers = ()=>{};
	before_redirect = ()=>{};
	complete = ()=>{};
    error_occurred = ()=>{};
    constructor(){
        this.debugPrint("create Listener");
    }

    debugPrint(content){
        if(global.config.debug){
            console.log(content);
        }
    }
    
    clearListener(){
        chrome.webRequest.onBeforeRequest.removeListener(this.before_request);
		chrome.webRequest.onSendHeaders.removeListener(this.send_headers);
		chrome.webRequest.onBeforeRedirect.removeListener(this.before_redirect);
		chrome.webRequest.onCompleted.removeListener(this.complete);
        chrome.webRequest.onErrorOccurred.removeListener(this.error_occurred);
        return true;
    }
    setListener(){
        if(global.config.filter.length == 0){
			return;
        }
        
        this.clearListener();
        chrome.webRequest.onBeforeRequest.addListener(this.before_request = (details)=>{
            this.debugPrint("before request");
        },{urls:global.config.filter},["blocking", "requestBody"]);
        
        chrome.webRequest.onSendHeaders.addListener(this.send_headers = (details)=>{
            this.debugPrint("send headers");
        },{urls:global.config.filter},["requestHeaders"]);
    
        chrome.webRequest.onBeforeRedirect.addListener(this.before_redirect = (details) =>{
            this.debugPrint("before redirect");
        },{urls:global.config.filter},["responseHeaders"]);

        chrome.webRequest.onCompleted.addListener(this.complete = (details)=>{
            this.debugPrint("completed");
        },{urls:global.config.filter},[]);

        chrome.webRequest.onErrorOccurred.addListener(this.error_occurred = (details)=>{
            this.debugPrint("error occurred");
        },{urls:global.config.filter});

        return true;
    }
}


!function main(){
    let listener = new Listener();
    listener.setListener();
}();