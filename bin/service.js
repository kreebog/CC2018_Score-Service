"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const log = __importStar(require("./Logger"));
const util_1 = require("util");
const mongodb_1 = require("mongodb");
const express_1 = __importDefault(require("express"));
// constant value references
const DB_URL = 'mongodb+srv://mdbuser:cc2018-mdbpw@cluster0-bxvkt.mongodb.net/';
const DB_NAME = 'cc2018';
const COL_NAME = 'scores';
const SVC_PORT = process.env.SCORE_SVC_PORT || 8080;
const ENV = process.env['NODE_ENV'] || 'PROD';
const SVC_NAME = 'score-service';
// set the logging level based on current env
log.setLogLevel((ENV == 'DVLP' ? log.LOG_LEVELS.DEBUG : log.LOG_LEVELS.INFO));
log.info(__filename, SVC_NAME, 'Starting service with environment settings for: ' + ENV);
// create the express app reference
const app = express_1.default();
let httpServer; // will be set with app.listen
let mongoDBClient; // set on successful connection to db
// connect to the database first
log.info(__filename, SVC_NAME, 'Connecting to MongoDB: ' + DB_URL);
mongodb_1.MongoClient.connect(DB_URL, (err, client) => {
    if (err) {
        log.error(__filename, util_1.format('MongoClient.connect(%s)', DB_URL), 'Error connecting to MongoDB: ' + err.message);
        return err;
    }
    let db = client.db(DB_NAME);
    let col = db.collection(COL_NAME);
    mongoDBClient = client;
    // so far so good - let's start the service
    httpServer = app.listen(SVC_PORT, function () {
        log.info(__filename, SVC_NAME, 'Listening on port ' + SVC_PORT);
        // now handle routes with express
        // get all scores
        app.get('/get', (req, res) => {
            res.status(200).send('ok');
        }); // route: /get
        // get a score
        app.get('/get/:scoreKey', (req, res) => {
            res.status(200).send('ok');
        }); // route: /get:scoreKey
        // update a score
        app.get('/update/:scoreKey', (req, res) => {
            res.status(200).send('ok');
        }); // route: /update/:scoreKey
        // delete a score
        app.get('/delete/:scoreKey', (req, res) => {
            res.status(200).send('ok');
        }); // route: /delete/:scoreKey
        // list all scores (html)
        app.get('/list', (req, res) => {
            res.status(200).send('ok');
        }); // route: /list
        // handle invalid routes
        app.get('/*', (req, res) => {
            res.status(404).send('invalid route');
        }); // route: /*
    }); // app.listen...
}); // MongoClient.conect...
/**
 * Watch for SIGINT (process interrupt signal) and trigger shutdown
 */
process.on('SIGINT', function onSigInt() {
    // all done, close the db connection
    log.info(__filename, 'onSigInt()', 'Got SIGINT - Exiting applicaton...');
    doShutdown();
});
/**
 * Watch for SIGTERM (process terminate signal) and trigger shutdown
 */
process.on('SIGTERM', function onSigTerm() {
    // all done, close the db connection
    log.info(__filename, 'onSigTerm()', 'Got SIGTERM - Exiting applicaton...');
    doShutdown();
});
/**
 * Gracefully shut down the service
 */
function doShutdown() {
    log.info(__filename, 'doShutDown()', 'Closing HTTP Server connections...');
    httpServer.close();
    log.info(__filename, 'doShutDown()', 'Closing Database connections...');
    mongoDBClient.close();
}
//# sourceMappingURL=service.js.map