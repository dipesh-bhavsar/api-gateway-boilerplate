process.env.JWT_SECRET='t';process.env.JWT_REFRESH_SECRET='tr';
const request=require('supertest'),{createApp}=require('../src/app'),app=createApp();
test('register returns tokens',async()=>{const r=await request(app).post('/api/v1/auth/register').send({email:'n@t.com',password:'secure123'});expect(r.status).toBe(201);expect(r.body.access_token).toBeDefined();});
test('dup 409',async()=>{await request(app).post('/api/v1/auth/register').send({email:'d@t.com',password:'secure123'});expect((await request(app).post('/api/v1/auth/register').send({email:'d@t.com',password:'secure123'})).status).toBe(409);});
test('short pwd 400',async()=>{expect((await request(app).post('/api/v1/auth/register').send({email:'x@t.com',password:'short'})).status).toBe(400);});
test('/me 401',async()=>{expect((await request(app).get('/api/v1/users/me')).status).toBe(401);});
test('/me 200',async()=>{const reg=await request(app).post('/api/v1/auth/register').send({email:'me@t.com',password:'secure123'});const r=await request(app).get('/api/v1/users/me').set('Authorization',`Bearer ${reg.body.access_token}`);expect(r.status).toBe(200);});
