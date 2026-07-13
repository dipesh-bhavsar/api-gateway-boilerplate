const{ZodError}=require('zod');
function errorHandler(err,req,res,next){if(err instanceof ZodError)return res.status(400).json({error:'Validation failed',details:err.flatten()});console.error(`[${req.id}]`,err.message);res.status(err.status||500).json({error:err.message||'Internal server error'});}
module.exports={errorHandler};
