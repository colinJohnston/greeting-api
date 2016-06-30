import express from 'express';
import greetingAPI from './greeting-api';
const app = express();

app.use('/api/greeting', greetingAPI);

app.listen(3000, function () {
    console.log('Listening on port 3000');
});