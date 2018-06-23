require('dotenv').config();
import * as log from './Logger';
import { format } from 'util';
import { MongoClient } from 'mongodb';
import express from 'express';
import { Server } from 'http';

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
const app = express();
let httpServer: Server; // will be set with app.listen
let mongoDBClient: MongoClient; // set on successful connection to db

// connect to the database first
log.info(__filename, SVC_NAME, 'Connecting to MongoDB: ' + DB_URL);
MongoClient.connect(DB_URL, (err, client) => {
    if (err) {
        log.error(__filename, format('MongoClient.connect(%s)', DB_URL), 'Error connecting to MongoDB: ' + err.message);
        return err;
    }

    let db = client.db(DB_NAME);
    let col = db.collection(COL_NAME);
    mongoDBClient = client;

    // so far so good - let's start the service
    httpServer = app.listen(SVC_PORT, function() {
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
process.on('SIGINT', function onSigInt () {
    // all done, close the db connection
    log.info(__filename, 'onSigInt()', 'Got SIGINT - Exiting applicaton...');
    doShutdown()
  });

/**
 * Watch for SIGTERM (process terminate signal) and trigger shutdown
 */
process.on('SIGTERM', function onSigTerm () {
    // all done, close the db connection
    log.info(__filename, 'onSigTerm()', 'Got SIGTERM - Exiting applicaton...');
    doShutdown()
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