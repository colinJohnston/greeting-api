import express from 'express';
import dirty from 'dirty';
import bodyParser from 'body-parser';
const jsonParser = bodyParser.json();

//connect to database
let connected = false;
const db = new dirty('data/greeting.db').on('load', function() {
    connected = true;
});

const intitalState = {
    greeting: {
        greetingCount: 0
    }
};

//middleware to check db connection
const isDatabaseReady = function (req, res, next) {
    if (!connected) {
        res.status(503).json({
            error: {
                message: "database isn't available yet"
            }
        });
    }
    next();
};

const router = express.Router();

router.use(isDatabaseReady);

router.get('/', function (req, res) {
    var greeting = db.get(getIP(req));
    res.setHeader('Content-Type', 'application/json');
    res.json(greeting || intitalState);
});

router.put('/', jsonParser, function (req, res) {
    var ip = getIP(req);
    db.set(ip, req.body);
    console.log('saved greeting ', ip, req.body);
    res.sendStatus(201);
});

function getIP(req) {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}

export default router