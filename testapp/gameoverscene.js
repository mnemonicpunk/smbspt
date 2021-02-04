import Scene from '../engine/scene.js';
import Entity from "../engine/entity.js";
import TitleScene from "./titlescene.js";

export class GameOverEntity extends Entity {
    constructor() {
        super();

        this.sprite.applyOptions({
            scale: 2
        });
        
        this.text_timer = 0;
        this.skip_timer = 0;

        this.score = 0;
        this.highscore = 0;
    }
    tick(scene) {
        this.score = scene.score;
        this.highscore = scene.highscore;

        gamekit.assets.sound('bgm').play();

        this.skip_timer++;
        this.text_timer++;
        if (this.text_timer > 60) {
            this.text_timer = 0;
        }

        if (this.skip_timer >= 300) {
            scene.switchScene(new TitleScene());    
        }
    }
    scoreString() {
        return "Your Score: " + this.score + " - Highscore: " + this.highscore;
    }
    draw(ctx) {
        super.draw(ctx);
        
        ctx.font = "144px Console";
        ctx.fillStyle = "#fff";

        let txt = "Game Over";
        let dim = ctx.measureText(txt);

        ctx.fillText(txt, 1920/2 - dim.width/2, 480);

        ctx.font = "72px Console";
        txt = this.scoreString();
        dim = ctx.measureText(txt);
        ctx.fillText(txt, 1920/2 - dim.width/2, 630);
    }
}

export default class GameOverScene extends Scene {
    constructor() {
        super();
        this.add(new GameOverEntity());

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