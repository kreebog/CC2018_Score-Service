import {format} from 'util';
import * as log from './logger';

export class Score {
    // Primary Key = mazeId:teamId:gameId:gameRound
    private _mazeId: string = '';
    private _teamId: string = '';
    private _gameId: string = '';
    private _gameRound: number = 0;
    private _scoreKey: string = '';

    // various score elements
    private _moveCount: number = 0;
    private _backtrackCount: number = 0;
    private _bonusPoints: number = 0;

    // the final result of the game 
    private _gameResult: string = '';

    /**         Accessors         **/
    public get mazeId(): string {
        return this._mazeId;
    }
    public set mazeId(value: string) {
        this._mazeId = value;
        this.setScoreKey();
    }

    public get teamId(): string {
        return this._teamId;
    }
    public set teamId(value: string) {
        this._teamId = value;
        this.setScoreKey();
    }

    public get gameId(): string {
        return this._gameId;
    }
    public set gameId(value: string) {
        this._gameId = value;
        this.setScoreKey();
    }

    public get gameRound(): number {
        return this._gameRound;
    }
    public set gameRound(value: number) {
        this._gameRound = value;
        this.setScoreKey();
    }
    
    public get moveCount(): number {
        return this._moveCount;
    }
    public set moveCount(value: number) {
        this._moveCount = value;
    }

    public get backTrackCount(): number {
        return this._backtrackCount;
    }
    public set backTrackCount(value: number) {
        this._backtrackCount = value;
    }
    
    public get bonusPoints(): number {
        return this._bonusPoints;
    }
    public set bonusPoints(value: number) {
        this._bonusPoints = value;
    }
    
    public get gameResult(): string {
        return this._gameResult;
    }
    public set gameResult(value: string) {
        this._gameResult = value;
    }

    public get scoreKey(): string {
        return this._scoreKey;
    }

    private setScoreKey() {
        this._scoreKey = format('%s:%s:%s:%s', this.mazeId, this.teamId, this.gameId, this.gameRound);
    }

    // CANNOT get a parameterized constructor to work! :(
    constuctor() { }

    public loadFromJSON(json: string) {
        let score: Score = JSON.parse(json);
        this._mazeId = score._mazeId;
        this._teamId = score._teamId;
        this._gameId = score._gameId;
        this._gameRound = score._gameRound;
        this._scoreKey = format('%s:%s:%s:%s', score.mazeId, score.teamId, score.gameId, score.gameRound);
    }
}

export default Score;