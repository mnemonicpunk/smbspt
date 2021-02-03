import Scene from '../engine/scene.js';
import GameOverEntity from './gameoverentity.js';

export default class GameOverScene extends Scene {
    constructor(gamekit) {
        super(gamekit);
        this.add(new GameOverEntity(gamekit));

        this.score = 0;
        this.highscore = localStorage.getItem('highscore') || 0;
    }
    updateScore(score) {
        this.score = score;
        if (this.score > this.highscore) {
            this.highscore = this.score;
            localStorage.setItem('highscore', this.score);
        }
    }
}