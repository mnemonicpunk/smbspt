import Entity from "../entity.js";
import GameKit from "../gamekit.js";
import { StaticImageSprite } from "../sprite.js";
import mn_logo_img from './mn_logo_img.js';
import mn_logo_jingle from './mn_logo_jingle.js';

export default class mnLogo extends Entity {
    constructor(gamekit) {
        super(gamekit);

        let img = document.createElement('img');
        img.src = mn_logo_img;

        this.sprite = new StaticImageSprite({
            image: img
        });

        this.jingle = document.createElement('audio');
        this.jingle.src = mn_logo_jingle;
        this.jingle_played = false;

        this.progress = 0;

        this.followup_scene = null;
    }
    tick(scene) {
        this.progress++;

        let self = this;
        if (this.jingle_played == false) {
            var promise = this.jingle.play();
            if (promise !== undefined) {
                promise.then(_ => {
                    self.jingle_played = true;
                }).catch(error => {
                    // Autoplay was prevented.
                    // Show a "Play" button so that user can start playback.
                });
            }    
        }

        let fade_d = 30;
        let show_d = 120;

        if (!gamekit.assets.preloadFinished()) {
            if (this.progress >= (fade_d+show_d)) {
                this.progress = fade_d+show_d;
            }
        }

        this.sprite.alpha = 1;
        if (this.progress <= fade_d) {
            this.sprite.alpha = (this.progress/fade_d);
        }
        if (this.progress >= fade_d+show_d) {
            this.sprite.alpha = 1-((this.progress-(fade_d+show_d))/fade_d);
        }
        if (this.progress >= (2*fade_d)+show_d) {
            this.sprite.alpha = 0;
            if (scene.followup_scene != null) {
                console.log("Preload finished, launching app!");
                scene.switchScene(scene.followup_scene);
            } else {
                console.log("Error: Missing scene to switch to")
            }
            
        }

    }
    draw(ctx) {
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite._draw(ctx);
    }
}

