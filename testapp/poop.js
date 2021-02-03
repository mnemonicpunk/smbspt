import Entity from "../engine/entity.js";
import GameKit from "../engine/gamekit.js";
import { SheetSprite } from "../engine/sprite.js";
import Player from './player.js';

export default class Poop extends Entity {
    constructor(gamekit) {
        super(gamekit);
        this.sprite = new SheetSprite({
            image: gamekit.assets.getImage('poop'),
            columns: 1,
            rows: 4
        });
        this.sprite.x_scale = 2;
        this.sprite.y_scale = 2;
        this.sprite.image_max = 3;
        this.sprite.image_number = Math.floor(Math.random() * 4);
        this.sprite.ticks_per_frame = 15;

        this.ttl = 0;
        this.timer = 0;
    }
    tick(scene) {
        this.timer++;
        if (this.timer > this.ttl * 5) {
            scene.remove(this);
        }

        this.sprite.animationTick();

        this.sprite.x = this.x;
        this.sprite.y = this.y;

        let p = scene.filterClass(Player);
        for (let i=0; i<p.length; i++) {
            if (p[i].alive) {
                if ((p[i].x == this.x) && (p[i].y == this.y)) {
                    p[i].die(scene);
                }    
            }
        }        
    }
    draw(ctx) {
        this.sprite._draw(ctx);
    }
}