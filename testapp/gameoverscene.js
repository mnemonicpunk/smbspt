import Scene from '../engine/scene.js';
import Entity from "../engine/entity.js";
import TitleScene from "./titlescene.js";
import { TextSprite } from "../engine/sprite.js";

class GameOverEntity extends Entity {
    constructor() {
        super();

        this.sprite.applyOptions({
            scale: 2
        });

        this.text_banner1 = this.sprite.add(new TextSprite({
            x: 960/2,
            y: 440/2,
            text: "GAME OVER",
            font: "72px Console",
            color: "#fff",
            alignment: "center"
        }));

        this.text_banner2 = this.sprite.add(new TextSprite({
            x: 960/2,
            y: 630/2,
            text: this.scoreString(),
            font: "36px Console",
            color: "#fff",
            alignment: "center"
        }));

        this.score = 0;
        this.highscore = 0;
    }
    tick(scene) {
        this.score = scene.score;
        this.highscore = scene.highscore;

        this.text_banner2.text = this.scoreString();

        gamekit.assets.sound('bgm').play();

        if (scene.uptime >= 300 || gamekit.controls.checkReleased(" ")) {
            scene.switchScene(new TitleScene());    
        }
    }
    scoreString() {
        return "Your Score: " + this.score + " - Highscore: " + this.highscore;
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