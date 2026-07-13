const{verifyAccessToken}=require('../services/tokenService');
function requireAuth(req,res,next){const h=req.headers.authorization;if(!h?.startsWith('Bearer '))return res.status(401).json({error:'Auth required'});try{req.user=verifyAccessToken(h.slice(7));next();}catch{res.status(401).json({error:'Invalid token'});}}
module.exports={requireAuth};
