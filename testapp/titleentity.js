import Entity from "../engine/entity.js";
import GameKit from "../engine/gamekit.js";
import { StaticImageSprite } from "../engine/sprite.js";
import GameScene from "./gamescene.js";

export default class Background extends Entity {
    constructor(gamekit) {
        super(gamekit);
        this.sprite = new StaticImageSprite({
            image: gamekit.assets.getImage('title_bg')
        });
        this.sprite.x_scale = 2;
        this.sprite.y_scale = 2;   
        
        this.playing_bgm = false;
        this.text_timer = 0;
    }
    tick(scene) {
        this.sprite.x = this.x;
        this.sprite.y = this.y;


        let s = scene.gamekit.assets.getSound('bgm');
        if (s.paused) {

            var promise = s.play();

            if (promise !== undefined) {
              promise.then(_ => {
                if (this.playing_bgm == false) {
                    scene.gamekit.assets.getSound('announce').play();
                }
                this.playing_bgm = true;
              }).catch(error => {
                // Autoplay was prevented.
                // Show a "Play" button so that user can start playback.
              });
            }
        }

        this.text_timer++;
        if (this.text_timer > 60) {
            this.text_timer = 0;
        }

        if (this.playing_bgm) {
            let ctrl = scene.controls();
            if (ctrl.check(" ")) {
                s.pause();
                scene.switchScene(new GameScene(scene.gamekit));
            }
        }
    }
    draw(ctx) {
        this.sprite._draw(ctx);

        if (this.playing_bgm) {
            let txt = "Press SPACE to start!";
            ctx.font = "72px Console";

            let dim = ctx.measureText(txt);


            ctx.fillText(txt, 1920/2 - dim.width/2 - 1, 880);
            ctx.fillText(txt, 1920/2 - dim.width/2 + 1, 880);
            ctx.fillText(txt, 1920/2 - dim.width/2, 879);
            ctx.fillText(txt, 1920/2 - dim.width/2, 881);


            ctx.fillStyle = "#f0f";
            if (this.text_timer > 30) {
                ctx.fillStyle = "#ff0";
            }

            ctx.fillText(txt, 1920/2 - dim.width/2, 880);
        }
    }
}