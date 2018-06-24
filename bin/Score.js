"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
class Score {
    constructor() {
        // Primary Key = mazeId:teamId:gameId:gameRound
        this._mazeId = '';
        this._teamId = '';
        this._gameId = '';
        this._gameRound = 0;
        this._scoreKey = '';
        // various score elements
        this._moveCount = 0;
        this._backtrackCount = 0;
        this._bonusPoints = 0;
        // the final result of the game 
        this._gameResult = '';
    }
    /**         Accessors         **/
    get mazeId() {
        return this._mazeId;
    }
    set mazeId(value) {
        this._mazeId = value;
        this.setScoreKey();
    }
    get teamId() {
        return this._teamId;
    }
    set teamId(value) {
        this._teamId = value;
        this.setScoreKey();
    }
    get gameId() {
        return this._gameId;
    }
    set gameId(value) {
        this._gameId = value;
        this.setScoreKey();
    }
    get gameRound() {
        return this._gameRound;
    }
    set gameRound(value) {
        this._gameRound = value;
        this.setScoreKey();
    }
    get moveCount() {
        return this._moveCount;
    }
    set moveCount(value) {
        this._moveCount = value;
    }
    get backTrackCount() {
        return this._backtrackCount;
    }
    set backTrackCount(value) {
        this._backtrackCount = value;
    }
    get bonusPoints() {
        return this._bonusPoints;
    }
    set bonusPoints(value) {
        this._bonusPoints = value;
    }
    get gameResult() {
        return this._gameResult;
    }
    set gameResult(value) {
        this._gameResult = value;
    }
    get scoreKey() {
        return this._scoreKey;
    }
    setScoreKey() {
        this._scoreKey = util_1.format('%s:%s:%s:%s', this.mazeId, this.teamId, this.gameId, this.gameRound);
    }
    // CANNOT get a parameterized constructor to work! :(
    constuctor() { }
    loadFromJSON(json) {
        let score = JSON.parse(json);
        this._mazeId = score._mazeId;
        this._teamId = score._teamId;
        this._gameId = score._gameId;
        this._gameRound = score._gameRound;
        this._scoreKey = util_1.format('%s:%s:%s:%s', score.mazeId, score.teamId, score.gameId, score.gameRound);
    }
}
exports.Score = Score;
exports.default = Score;
//# sourceMappingURL=Score.js.map