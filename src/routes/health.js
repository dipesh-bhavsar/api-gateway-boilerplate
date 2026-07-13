const express=require('express'),router=express.Router(),start=Date.now();
router.get('/',(_,res)=>res.json({status:'ok',uptime:Math.round((Date.now()-start)/1000)}));
router.get('/ready',(_,res)=>res.json({ready:true}));
module.exports=router;
