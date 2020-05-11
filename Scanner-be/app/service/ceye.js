const Service = require("egg").Service;

let token = "392024686b005880e32a239d7a77b9d7";

class CeyeService extends Service{
    async get(){
        let api = "http://api.ceye.io/v1/records?token={token}&type=http&filter=".replace("{token}",token);
        await fetch(api,{method:"get"}).then(res=>res.json()).then(res=>{
            console.log(res);
        });
    }
}

module.exports = CeyeService;