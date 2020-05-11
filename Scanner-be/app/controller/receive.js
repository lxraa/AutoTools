const Controller = require("egg").Controller;
const mongoose = require("mongoose");

let request_demo = {
    body:"",
    headers:{},
    id:"",
    initiator:"",
    method:"",
    type:"",
    url:""
}
let request_schema = mongoose.Schema({
    body:String,
    headers:Object,
    id:String,
    initiator:String,
    method:String,
    type:String,
    url:String
});

let request_model = mongoose.model("Request",request_schema);
class ReceiveController extends Controller{
    async chrome(){
        const {ctx} = this;
        if(global.mongo_connected == undefined){
            mongoose.connect("mongodb://localhost/requests");
            global.mongo_connected = true;
        }else{
            // console.log("connected");
        }

        let a_req = ctx.request.body.data;
        request_model.insertMany([a_req],function(err,docs){
            
        });
        ctx.body = JSON.stringify({code:1})
    }
}

module.exports = ReceiveController;