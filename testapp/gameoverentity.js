import Entity from "../engine/entity.js";
import GameKit from "../engine/gamekit.js";
import { StaticImageSprite } from "../engine/sprite.js";
import TitleScene from "./titlescene.js";

export default class Background extends Entity {
    constructor(gamekit) {
        super(gamekit);

        this.sprite.x_scale = 2;
        this.sprite.y_scale = 2;   
        
        this.playing_bgm = false;
        this.text_timer = 0;
        this.skip_timer = 0;

        this.score = 0;
        this.highscore = 0;
    }
    tick(scene) {
        this.sprite.x = this.x;
        this.sprite.y = this.y;

        this.score = scene.score;
        this.highscore = scene.highscore;

        let s = scene.gamekit.assets.getSound('bgm');
        if (s.paused) {

            var promise = s.play();

            if (promise !== undefined) {
              promise.then(_ => {

              }).catch(error => {
                // Autoplay was prevented.
                // Show a "Play" button so that user can start playback.
              });
            }
        }

        this.skip_timer++;
        this.text_timer++;
        if (this.text_timer > 60) {
            this.text_timer = 0;
        }


        if (this.skip_timer >= 300) {
            s.pause();
            scene.switchScene(new TitleScene(scene.gamekit));    
        }
    }
    scoreString() {
        return "Your Score: " + this.score + " - Highscore: " + this.highscore;
    }
    draw(ctx) {
        this.sprite._draw(ctx);
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