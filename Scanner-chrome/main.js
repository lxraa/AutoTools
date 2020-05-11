
global = {};
global.request_list = {}
global.config = {
    debug:true,
    filter:["http://*/*","https://*/*"],
    server:"http://127.0.0.1:7001",
    api:"/receive/chrome"
};


g_listener = null;
class Listener{
    before_request = ()=>{};
	send_headers = ()=>{};
	before_redirect = ()=>{};
	complete = ()=>{};
    error_occurred = ()=>{};
    constructor(){
        this.debugPrint("create Listener");
        g_listener = this;
        this.setProxy();
    }

    setProxy(){
        global.config = new Proxy(global.config,{
            set:function(obj,prop,value){
                obj[prop] = value;
                console.log("11111");
                if(prop == "filter"){
                    console.log("change filter");
                    g_listener.clearListener();
                    g_listener.setListener();
                }
            }
        })
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
    formData2body(form_data){
        
        if(typeof(form_data) != "object"){
            console.log("form data error");
            return "";
        }
        let body = "";
        Object.keys(form_data).forEach(function(k){
            for(let i of form_data[k]){
                let str = k.toString()+"="+i.toString();
                body = body + str;
            }
        });


        return body.substr(0,body.length-1);
    }
    raw2body(raw){
        let str = "";
        for(var i in raw){
            for(var j in raw[i]){
                if(typeof(raw[i][j]) == "string"){
                    str = str + raw[i][j];
                }
                else if(raw[i][j] instanceof ArrayBuffer){
                    str = str + String.fromCharCode.apply(null, new Uint8Array(raw[i][j]));
                }
                else{
                    continue;
                }
            }
        }
        return str;
    }
    handleRequest(request_id){
        let req = global.request_list[request_id];
        if(new URL(req.url).origin == global.config.server){
            return false;
        }
        console.log(JSON.stringify(global.request_list[request_id]));
        console.log(req.url);
        fetch(global.config.server+global.config.api,{
            method:"POST",
            body:JSON.stringify({data:global.request_list[request_id]}),
            headers:new Headers({"Content-Type":"application/json"})
        })
        .then(res=>res.json())
        .catch(error=>console.log("ERROR:",error))
        .then(res=>console.log("Success:",res));
        
        return true;
    }
    setListener(){
        if(global.config.filter.length == 0){
			return;
        }
        
        this.clearListener();
        chrome.webRequest.onBeforeRequest.addListener(this.before_request = (details)=>{
            
            this.debugPrint("before request");
            let id = details.timeStamp.toString();
            id = id.substr(0,id.indexOf("."));
            global.request_list[details.requestId] = {};
            global.request_list[details.requestId].requestId = details.requestId;
            global.request_list[details.requestId].type = details.type;
            global.request_list[details.requestId].method = details.method;
            global.request_list[details.requestId].url = details.url;
            global.request_list[details.requestId].id = id;
            global.request_list[details.requestId].initiator = details.initiator;

            if(details.requestBody){
                if(details.requestBody.formData){
                    global.request_list[details.requestId].body = this.formData2body(details.requestBody.formData);
                }else if(details.requestBody.raw){
                    global.request_list[details.requestId].body = this.raw2body(details.requestBody.raw);
                }else if(details.requestBody.error){
                    //可能是POST方法但是没有body
                    this.debugPrint("error body")
                }else{
                    console.log("unknown body")
                }
            }

             /*type:
            "main_frame", "sub_frame", "stylesheet", "script", "image", "font", "object", "xmlhttprequest", "ping", "csp_report", "media", "websocket", or "other"
            */
            switch(details.type){
  
                case("main_frame"):{
                    break;
                }
                case("sub_frame"):{
                    break;
                }
                case("stylesheet"):{
                    break;
                }
                case("script"):{
                    break;
                }
                case("image"):{
                    break;
                }
                case("object"):{
                    break;
                }
                case("font"):{
                    break;
                }
                case("xmlhttprequest"):{
                    break;
                }
                case("ping"):{
                    break;
                }
                case("media"):{
                    break;
                }
                case("websocket"):{
                    break;
                }

                case("csp_report"):{
                    break;
                }
                case("other"):{
                    break;
                }

                default:{
                    break;
                }
            }
            
        },{urls:global.config.filter},["blocking", "requestBody"]);
        
        chrome.webRequest.onSendHeaders.addListener(this.send_headers = (details)=>{
            this.debugPrint("send headers");
            let headers = {};
            for(let i = 0;i < details.requestHeaders.length;i++){
				headers[details.requestHeaders[i]['name']] = details.requestHeaders[i]['value'];
            }
            global.request_list[details.requestId].headers = headers;
        },{urls:global.config.filter},["requestHeaders"]);
    
        chrome.webRequest.onBeforeRedirect.addListener(this.before_redirect = (details) =>{
            this.debugPrint("before redirect");
            this.handleRequest(details.requestId);
            delete global.request_list[details.requestId];
        },{urls:global.config.filter},["responseHeaders"]);

        chrome.webRequest.onCompleted.addListener(this.complete = (details)=>{
            this.debugPrint("completed");
            this.handleRequest(details.requestId);
            delete global.request_list[details.requestId];
        },{urls:global.config.filter},[]);

        chrome.webRequest.onErrorOccurred.addListener(this.error_occurred = (details)=>{
            this.debugPrint("error occurred");
            delete global.request_list[details.requestId];
        },{urls:global.config.filter});

        return true;
    }
}


!function main(){
    let listener = new Listener();
    listener.setListener();
}();