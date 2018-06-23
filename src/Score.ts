import {format} from 'util';
import * as log from './logger';

export class Score {

    // Primary Key = mazeId:teamId:gameId:gameRound
    private mazeId: string = '';
    private teamId: string = '';
    private gameId: string = '';
    private gameRound: number = 0;
    
    // various score elements
    private moveCount: number = 0;
    private backtrackCount: number = 0;
    private bonusPoints: number = 0;
    
    // the final result of the game 
    private gameResult: string = '';

    /**
     * Returns a new Score object
     * @param mazeId 
     * @param teamId 
     * @param gameId 
     * @param gameRound 
     */
    constuctor(mazeId: string, teamId: string, gameId: string, gameRound: number) {
        this.mazeId = mazeId;
        this.teamId = teamId;
        this.gameId = gameId;
        this.gameRound = gameRound;

        log.debug(__filename, 'constructor()', 'Score object instantiated.  Key=' + this.getScoreKey());
    }

    private getScoreKey(): string {
        return format('%s:%s:%s:%s', this.mazeId, this.teamId, this.gameId, this.gameRound);
    }
}

export default Score;