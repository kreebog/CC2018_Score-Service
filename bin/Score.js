"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const log = __importStar(require("./logger"));
class Score {
    constructor() {
        // Primary Key = mazeId:teamId:gameId:gameRound
        this.mazeId = '';
        this.teamId = '';
        this.gameId = '';
        this.gameRound = 0;
        // various score elements
        this.moveCount = 0;
        this.backtrackCount = 0;
        this.bonusPoints = 0;
        // the final result of the game 
        this.gameResult = '';
    }
    /**
     * Returns a new Score object
     * @param mazeId
     * @param teamId
     * @param gameId
     * @param gameRound
     */
    constuctor(mazeId, teamId, gameId, gameRound) {
        this.mazeId = mazeId;
        this.teamId = teamId;
        this.gameId = gameId;
        this.gameRound = gameRound;
        log.debug(__filename, 'constructor()', 'Score object instantiated.  Key=' + this.getScoreKey());
    }
    getScoreKey() {
        return util_1.format('%s:%s:%s:%s', this.mazeId, this.teamId, this.gameId, this.gameRound);
    }
}
exports.Score = Score;
exports.default = Score;
//# sourceMappingURL=Score.js.map