"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const path_1 = __importDefault(require("path"));
const log = __importStar(require("./Logger"));
const util_1 = require("util");
const mongodb_1 = require("mongodb");
const express_1 = __importDefault(require("express"));
const Score_1 = require("./Score");
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
// configure pug
app.set('views', 'views');
app.set('view engine', 'pug');
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
        /* now handle routes with express */
        // get all scores
        app.get('/get', (req, res) => {
            col.find({}).toArray((err, docs) => {
                if (err) {
                    log.error(__filename, req.path, JSON.stringify(err));
                    return res.status(500).json({ 'status': util_1.format('Error gettings cores from "%s": %s', COL_NAME, err.message) });
                }
                if (docs.length == 0) {
                    res.status(200).json({ 'status': 'No scores found.' });
                }
                else {
                    res.status(200).json(docs);
                }
            });
        }); // route: /get
        // get a score
        app.get('/get/:scoreKey', (req, res) => {
            res.status(200).send('ok');
        }); // route: /get:scoreKey
        // add a new score or update an existing score
        app.get('/add_update/:mazeId/:teamId/:gameId/:gameRound/:moveCount/:backTrackCount/:bonusPoints/:gameResult', (req, res) => {
            let score = new Score_1.Score();
            score.mazeId = req.params.mazeId;
            score.teamId = req.params.teamId;
            score.gameId = req.params.gameId;
            score.gameRound = req.params.gameRound;
            score.moveCount = req.params.moveCount;
            score.backTrackCount = req.params.backTrackCount;
            score.bonusPoints = req.params.bonusPoints;
            score.gameResult = req.params.gameResult;
            // search the collection for a maze with the right id
            col.find({ _scoreKey: score.scoreKey }).toArray((err, docs) => {
                if (err) {
                    log.error(__filename, req.path, JSON.stringify(err));
                    return res.status(500).json({ 'status': util_1.format('Error finding "%s" in "%s": %s', score.scoreKey, COL_NAME, err.message) });
                }
                // Insert score if one is not found.  Update score if it's already in the DB
                if (docs.length > 0) {
                    log.debug(__filename, req.path, util_1.format('Updating score %s.', score.scoreKey));
                    col.update({ _scoreKey: score.scoreKey }, score);
                    res.status(200).json({ result: 'Score Updated' });
                }
                else {
                    log.debug(__filename, req.path, util_1.format('Inserting score %s.', score.scoreKey));
                    col.insert(score);
                    res.status(200).json({ result: 'Score Inserted' });
                }
            });
        });
        // update a score
        app.get('/update/:scoreKey', (req, res) => {
            res.status(200).send('ok');
        }); // route: /update/:scoreKey
        // delete a score
        app.get('/delete/:scoreKey', (req, res) => {
            // delete the first document with the matching mazeId
            let scoreKey = req.params.scoreKey;
            col.deleteOne({ _scoreKey: scoreKey }, function (err, results) {
                if (err) {
                    log.error(__filename, req.path, JSON.stringify(err));
                    return res.status(500).json({ 'status': util_1.format('Error finding "%s" in "%s": %s', scoreKey, COL_NAME, err.message) });
                }
                // send the result code with deleted doc count
                res.status(200).json({ 'status': 'ok', 'count': results.deletedCount });
                log.info(__filename, req.path, util_1.format('%d document(s) deleted', results.deletedCount));
            });
        }); // route: /delete/:scoreKey
        // list all scores (html)
        app.get('/list', (req, res) => {
            col.find({}).toArray((err, docs) => {
                if (err) {
                    log.error(__filename, req.path, JSON.stringify(err));
                    return res.status(500).json({ 'status': util_1.format('Error gettings cores from "%s": %s', COL_NAME, err.message) });
                }
                res.render('list', {
                    contentType: 'text/html',
                    responseCode: 200,
                    scores: docs
                });
            });
        }); // route: /list
        // Handle favicon requests - using the BCBST favicon.ico
        app.get('/favicon.ico', (req, res) => {
            res.setHeader('Content-Type', 'image/x-icon');
            res.status(200).sendFile(path_1.default.resolve('views/favicon.ico'));
        }); // route: /favicon.ico
        // handle invalid routes
        app.get('/*', (req, res) => {
            res.status(404).send('invalid route' + req.url);
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