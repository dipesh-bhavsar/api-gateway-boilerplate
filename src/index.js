require('dotenv').config();const{createApp}=require('./app');
const app=createApp();
app.listen(process.env.PORT||4000,()=>console.log(`Gateway :${process.env.PORT||4000}`));
