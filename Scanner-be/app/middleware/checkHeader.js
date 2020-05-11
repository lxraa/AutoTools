module.exports = (options,app)=>{
    return async function checkHeader(ctx,next){
        await next();
    }

}