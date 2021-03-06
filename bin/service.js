"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
let bodyParser = require('body-parser');
require('dotenv').config();
const url_1 = __importDefault(require("url"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const mongodb_1 = require("mongodb");
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const cc2018_ts_lib_1 = require("cc2018-ts-lib");
// constants from environment variables (or .env file)
const ENV = process.env['NODE_ENV'] || 'PROD';
const DB_NAME = 'cc2018';
const DB_URL = util_1.format('%s://%s:%s@%s/%s', process.env['DB_PROTOCOL'], process.env['DB_USER'], process.env['DB_USERPW'], process.env['DB_URL'], DB_NAME);
const SVC_PORT = process.env.SCORE_SVC_PORT || 8080;
const DELETE_PASSWORD = process.env.DELETE_PASSWORD;
// grab the logger singleton
const log = cc2018_ts_lib_1.Logger.getInstance();
// standard local constants
const COL_NAME = 'scores';
const SVC_NAME = 'score-service';
// set the logging level based on current env
log.setLogLevel(parseInt(process.env['LOG_LEVEL'] || '3')); // defaults to "INFO"
log.info(__filename, SVC_NAME, 'Starting service with environment settings for: ' + ENV);
// create the express app reference
const app = express_1.default();
let httpServer; // will be set with app.listen
let mongoDBClient; // set on successful connection to db
// configure pug
app.set('views', 'views');
app.set('view engine', 'pug');
// enable compression
app.use(compression_1.default());
// add body-parser
app.use(bodyParser.json());
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
        // allow CORS for this application
        app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
            next();
        });
        /* now handle routes with express */
        /**
         * Base scores get route:
         *  /get returns all
         *  /get?scoreKey=<SCOREKEY> returns a specific score
         *  /get?teamId=<TEAMID> returns all scores for a specific team
         *  /get?mazeId=<MAZEID> returns all scores for a specific maze
         */
        app.get('/get', (req, res) => {
            let searchCriteria = {};
            if (req.url.includes('?')) {
                let urlParts = url_1.default.parse(req.url, true);
                searchCriteria = urlParts.query;
            }
            col.find(searchCriteria).toArray((err, docs) => {
                if (err) {
                    log.error(__filename, req.url, JSON.stringify(err));
                    return res.status(500).json({ status: util_1.format('Error getting scores from "%s": %s', COL_NAME, err.message) });
                }
                if (docs.length == 0) {
                    res.status(200).json({ status: 'No scores found.' });
                }
                else {
                    res.status(200).json(docs);
                }
            });
        }); // route: /get
        // get a score by scoreKey
        app.get('/get/:scoreKey', (req, res) => {
            let scoreKey = req.params.scoreKey;
            // search the collection and return first score with matching key
            col.find({ scoreKey: scoreKey }).toArray((err, docs) => {
                if (err) {
                    log.error(__filename, req.url, JSON.stringify(err));
                    return res.status(500).json({
                        status: util_1.format('Error finding "%s" in "%s": %s', scoreKey, COL_NAME, err.message)
                    });
                }
                // Insert score if one is not found.  Update score if it's already in the DB
                if (docs.length == 0) {
                    log.debug(__filename, req.url, util_1.format('No score with scoreId" %s.', scoreKey));
                    res.status(200).json({ status: util_1.format('Score not found: %s', scoreKey) });
                }
                else {
                    log.debug(__filename, req.url, util_1.format('Score "%s" found, returning json...', scoreKey));
                    res.status(200).json(docs[0]);
                }
            });
        }); // route: /get:scoreKey
        // just shove a whole score from request body into the database all at once
        app.post('/score', (req, res) => {
            col.insert(req.body);
            log.debug(__filename, req.url, util_1.format('Score posted: ', req.body));
        });
        // add a new score or update an existing score
        app.get('/add_update/:mazeId/:teamId/:gameId/:gameRound/:moveCount/:backtrackCount/:bonusPoints/:gameResult', (req, res) => {
            let score = new cc2018_ts_lib_1.Score();
            score.setMazeId(req.params.mazeId);
            score.setTeamId(req.params.teamId);
            score.setGameId(req.params.gameId);
            score.setGameRound(req.params.gameRound);
            score.setMoveCount(req.params.moveCount);
            score.setBacktrackCount(req.params.backtrackCount);
            score.setBonusPoints(req.params.bonusPoints);
            score.setGameResult(req.params.gameResult);
            // search the collection for a maze with the right id
            col.find({ scoreKey: score.getScoreKey() }).toArray((err, docs) => {
                if (err) {
                    log.error(__filename, req.url, JSON.stringify(err));
                    return res.status(500).json({
                        status: util_1.format('Error finding "%s" in "%s": %s', score.getScoreKey(), COL_NAME, err.message)
                    });
                }
                // Update score if it's already in the DB, otherwise insert new score
                if (docs.length > 0) {
                    log.debug(__filename, req.url, util_1.format('Updating score %s.', score.getScoreKey()));
                    console.log(JSON.stringify(score));
                    col.update({ scoreKey: score.getScoreKey() }, score);
                    res.status(200).json({ status: 'Score Updated' });
                }
                else {
                    log.debug(__filename, req.url, util_1.format('Inserting score %s.', score.getScoreKey()));
                    col.insert(score);
                    res.status(200).json({ status: 'Score Inserted' });
                }
            });
        });
        // delete a score
        app.get('/delete/:scoreKey/:password', (req, res) => {
            // delete the first document with the matching mazeId
            let scoreKey = req.params.scoreKey;
            // PASSWORD FOR DELETES FOUND IN ENVIRONMENT VARIABLES
            if (DELETE_PASSWORD != req.params.password)
                return res.status(401).json({ status: 'Missing or incorrect password.' });
            col.deleteOne({ scoreKey: scoreKey }, function (err, results) {
                if (err) {
                    log.error(__filename, req.url, JSON.stringify(err));
                    return res.status(500).json({
                        status: util_1.format('Error finding "%s" in "%s": %s', scoreKey, COL_NAME, err.message)
                    });
                }
                // send the result code with deleted doc count
                res.status(200).json({ status: 'ok', count: results.deletedCount });
                log.warn(__filename, req.url, util_1.format('%d document(s) deleted', results.deletedCount));
            });
        }); // route: /delete/:scoreKey
        // list all scores (html)
        app.get('/list', (req, res) => {
            col.find({}).toArray((err, docs) => {
                if (err) {
                    log.error(__filename, req.url, JSON.stringify(err));
                    return res.status(500).json({ status: util_1.format('Error gettings cores from "%s": %s', COL_NAME, err.message) });
                }
                res.render('list', {
                    contentType: 'text/html',
                    responseCode: 200,
                    scores: docs,
                    GAME_RESULTS: cc2018_ts_lib_1.GAME_RESULTS
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
            log.debug(__filename, req.url, 'Invalid route, rendering index.');
            res.render('index', {
                contentType: 'text/html',
                responseCode: 404,
                host: req.headers.host
            });
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