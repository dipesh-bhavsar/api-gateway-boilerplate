const express=require('express'),helmet=require('helmet'),cors=require('cors'),morgan=require('morgan'),{requestIdMiddleware}=require('./middleware/requestId'),{errorHandler}=require('./middleware/errorHandler');
function createApp(){const app=express();app.use(helmet());app.use(cors());app.use(express.json({limit:'1mb'}));app.use(morgan('combined'));app.use(requestIdMiddleware);app.use('/health',require('./routes/health'));app.use('/api/v1/auth',require('./routes/auth'));app.use('/api/v1/users',require('./routes/users'));app.use(errorHandler);return app;}
module.exports={createApp};
