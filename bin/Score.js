"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
class Score {
    constructor() {
        // Primary Key = mazeId:teamId:gameId:gameRound
        this.mazeId = '';
        this.teamId = '';
        this.gameId = '';
        this.gameRound = 0;
        this.scoreKey = '';
        // the final result of the game 
        this.gameResult = '';
        // various score elements
        this.moveCount = 0;
        this.backtrackCount = 0;
        this.bonusPoints = 0;
    }
    get BacktrackCount() {
        return this.backtrackCount;
    }
    set BacktrackCount(value) {
        this.backtrackCount = value;
    }
    /**         Accessors         **/
    get MazeId() {
        return this.mazeId;
    }
    set MazeId(value) {
        this.mazeId = value;
        this.setScoreKey();
    }
    get TeamId() {
        return this.teamId;
    }
    set TeamId(value) {
        this.teamId = value;
        this.setScoreKey();
    }
    get GameId() {
        return this.gameId;
    }
    set GameId(value) {
        this.gameId = value;
        this.setScoreKey();
    }
    get GameRound() {
        return this.gameRound;
    }
    set GameRound(value) {
        this.gameRound = value;
        this.setScoreKey();
    }
    get MoveCount() {
        return this.moveCount;
    }
    set MoveCount(value) {
        this.moveCount = value;
    }
    get BackTrackCount() {
        return this.backtrackCount;
    }
    set BackTrackCount(value) {
        this.backtrackCount = value;
    }
    get BonusPoints() {
        return this.bonusPoints;
    }
    set BonusPoints(value) {
        this.bonusPoints = value;
    }
    get GameResult() {
        return this.gameResult;
    }
    set GameResult(value) {
        this.gameResult = value;
    }
    get ScoreKey() {
        return this.scoreKey;
    }
    setScoreKey() {
        this.scoreKey = util_1.format('%s:%s:%s:%s', this.mazeId, this.teamId, this.gameId, this.gameRound);
    }
    // CANNOT get a parameterized constructor to work! :(
    constuctor() { }
    loadFromJSON(json) {
        let score = JSON.parse(json);
        this.mazeId = score.mazeId;
        this.teamId = score.teamId;
        this.gameId = score.gameId;
        this.gameRound = score.gameRound;
        this.scoreKey = util_1.format('%s:%s:%s:%s', score.mazeId, score.teamId, score.gameId, score.gameRound);
    }
}
exports.Score = Score;
exports.default = Score;
//# sourceMappingURL=Score.js.map