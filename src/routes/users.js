const express=require('express'),{requireAuth}=require('../middleware/auth'),{apiLimiter}=require('../middleware/rateLimiter'),router=express.Router();
router.use(requireAuth,apiLimiter);
router.get('/me',(req,res)=>res.json({user:req.user}));
module.exports=router;
