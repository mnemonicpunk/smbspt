import Scene from '../engine/scene.js';
import Entity from "../engine/entity.js";
import { StaticImageSprite } from "../engine/sprite.js";

import GameScene from "./gamescene.js";

class TitleEntity extends Entity {
    constructor() {
        super();
        this.sprite = new StaticImageSprite({
            image: gamekit.assets.image('title_bg').get(),
            scale: 2
        });
        
        this.announced = false;
        this.timer = 0;
    }
    tick(scene) {
        this.timer = scene.uptime%60;

        let bgm = gamekit.assets.sound('bgm');

        bgm.play();
        if (this.announced == false) {
            let announcers = [
                'announce2',
                'announce3'
            ]
            let announce = gamekit.assets.sound(announcers[Math.floor(Math.random() * 2)]);
            announce.play();
            this.announced = true;

        }    

        if (bgm.isPlaying()) {
            let ctrl = gamekit.controls;
            if (ctrl.check(" ")) {
                bgm.stop();
                scene.switchScene(new GameScene());
            }
        }
    }
    draw(ctx) {
        super.draw(ctx);

        if (gamekit.assets.sound('bgm').isPlaying()) {
            let txt = "Press SPACE to start!";
            ctx.font = "72px Console";

            let dim = ctx.measureText(txt);

            ctx.fillText(txt, 1920/2 - dim.width/2 - 1, 880);
            ctx.fillText(txt, 1920/2 - dim.width/2 + 1, 880);
            ctx.fillText(txt, 1920/2 - dim.width/2, 879);
            ctx.fillText(txt, 1920/2 - dim.width/2, 881);

            ctx.fillStyle = "#f0f";
            if (this.timer > 30) {
                ctx.fillStyle = "#ff0";
            }

            ctx.fillText(txt, 1920/2 - dim.width/2, 880);
        }
    }
}

export default class TitleScene extends Scene {
    constructor() {
        super();
        this.add(new TitleEntity());
    }
}