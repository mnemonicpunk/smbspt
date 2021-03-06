import Scene from '../engine/scene.js';
import Entity from "../engine/entity.js";
import { StaticImageSprite, TextSprite } from "../engine/sprite.js";

import GameScene from "./gamescene.js";

class TitleEntity extends Entity {
    constructor() {
        super();
        this.sprite = new StaticImageSprite({
            image: gamekit.assets.image('title_bg').get(),
            scale: 2
        });

        this.text_banner = this.sprite.add(new TextSprite({
            x: 960/2,
            y: 810/2,
            text: "Press SPACE to start!",
            font: "36px Console",
            color: "#f0f",
            outline: true,
            alignment: "center"
        }));
        
        this.announced = false;
        this.timer = 0;
    }
    tick(scene) {
        this.timer = scene.uptime%60;

        this.text_banner.color = "#fff";
        if (this.timer > 30) {
            this.text_banner.color = "#aaa";
        }

        let bgm = gamekit.assets.sound('bgm');

        bgm.play();
        if (!this.announced) {
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
            if (ctrl.checkPressed(" ")) {
                bgm.stop();
                scene.switchScene(new GameScene());
            }
        }
    }
}

export default class TitleScene extends Scene {
    constructor() {
        super();
        this.add(new TitleEntity());
    }
}