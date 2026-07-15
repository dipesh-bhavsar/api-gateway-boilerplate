process.env.JWT_SECRET='t';process.env.JWT_REFRESH_SECRET='tr';
const{signAccessToken,verifyAccessToken,signRefreshToken,verifyRefreshToken}=require('../src/services/tokenService');
test('access round-trip',()=>{const t=signAccessToken({userId:1});expect(verifyAccessToken(t).userId).toBe(1);});
test('refresh round-trip',()=>{const t=signRefreshToken({userId:2});expect(verifyRefreshToken(t).userId).toBe(2);});
test('tampered throws',()=>{expect(()=>verifyAccessToken(signAccessToken({})+'x')).toThrow();});
