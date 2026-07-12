const jwt=require('jsonwebtoken');
const AS=process.env.JWT_SECRET||'dev-a',RS=process.env.JWT_REFRESH_SECRET||'dev-r';
const AT=process.env.JWT_EXPIRES_IN||'15m',RT=process.env.JWT_REFRESH_EXPIRES_IN||'7d';
module.exports={
  signAccessToken:p=>jwt.sign(p,AS,{expiresIn:AT}),
  signRefreshToken:p=>jwt.sign(p,RS,{expiresIn:RT}),
  verifyAccessToken:t=>jwt.verify(t,AS),
  verifyRefreshToken:t=>jwt.verify(t,RS),
};
