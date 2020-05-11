

module.exports = (options,app)=>{
    return async function setJsonHeader(ctx,next){
        await next();
        ctx.set("Content-Type","application/json")
    }
};