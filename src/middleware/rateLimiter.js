const rateLimit=require('express-rate-limit');
const apiLimiter=rateLimit({windowMs:60000,max:parseInt(process.env.RATE_LIMIT_MAX||'100'),standardHeaders:true,legacyHeaders:false,message:{error:'Too many requests.'}});
const authLimiter=rateLimit({windowMs:15*60*1000,max:10,message:{error:'Too many login attempts.'}});
module.exports={apiLimiter,authLimiter};
