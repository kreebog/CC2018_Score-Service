import {format} from 'util';
import * as log from './logger';

export class Score {
    // Primary Key = mazeId:teamId:gameId:gameRound
    private mazeId: string = '';
    private teamId: string = '';
    private gameId: string = '';
    private gameRound: number = 0;
    private scoreKey: string = '';

    // the final result of the game 
    private gameResult: string = '';

    // various score elements
    private moveCount: number = 0;
    private backtrackCount: number = 0;
    private bonusPoints: number = 0;
    
    public get BacktrackCount(): number {
        return this.backtrackCount;
    }
    public set BacktrackCount(value: number) {
        this.backtrackCount = value;
    }

    /**         Accessors         **/
    public get MazeId(): string {
        return this.mazeId;
    }
    public set MazeId(value: string) {
        this.mazeId = value;
        this.setScoreKey();
    }

    public get TeamId(): string {
        return this.teamId;
    }
    public set TeamId(value: string) {
        this.teamId = value;
        this.setScoreKey();
    }

    public get GameId(): string {
        return this.gameId;
    }
    public set GameId(value: string) {
        this.gameId = value;
        this.setScoreKey();
    }

    public get GameRound(): number {
        return this.gameRound;
    }
    public set GameRound(value: number) {
        this.gameRound = value;
        this.setScoreKey();
    }
    
    public get MoveCount(): number {
        return this.moveCount;
    }
    public set MoveCount(value: number) {
        this.moveCount = value;
    }

    public get BackTrackCount(): number {
        return this.backtrackCount;
    }
    public set BackTrackCount(value: number) {
        this.backtrackCount = value;
    }
    
    public get BonusPoints(): number {
        return this.bonusPoints;
    }
    public set BonusPoints(value: number) {
        this.bonusPoints = value;
    }
    
    public get GameResult(): string {
        return this.gameResult;
    }
    public set GameResult(value: string) {
        this.gameResult = value;
    }

    public get ScoreKey(): string {
        return this.scoreKey;
    }

    private setScoreKey() {
        this.scoreKey = format('%s:%s:%s:%s', this.mazeId, this.teamId, this.gameId, this.gameRound);
    }

    // CANNOT get a parameterized constructor to work! :(
    constuctor() { }

    public loadFromJSON(json: string) {
        let score: Score = JSON.parse(json);
        this.mazeId = score.mazeId;
        this.teamId = score.teamId;
        this.gameId = score.gameId;
        this.gameRound = score.gameRound;
        this.scoreKey = format('%s:%s:%s:%s', score.mazeId, score.teamId, score.gameId, score.gameRound);
    }
}

export default Score;