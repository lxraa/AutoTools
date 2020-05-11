const Service = require('egg').Service

class HomeService extends Service{
    async index(){
        return {
            test:"test"
        }
    }
}

module.exports = HomeService;