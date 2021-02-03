import Entity from "../engine/entity.js";
import GameKit from "../engine/gamekit.js";
import { SheetSprite } from "../engine/sprite.js";

export default class Debris extends Entity {
    constructor(gamekit) {
        super(gamekit);
        this.sprite = new SheetSprite({
            image: gamekit.assets.getImage('debris'),
            columns: 1,
            rows: 2
        });
        this.sprite.x_scale = 2;
        this.sprite.y_scale = 2;
        this.sprite.image_max = 3;
        this.sprite.image_number = Math.floor(Math.random() * 4);
        this.sprite.ticks_per_frame = 1;

        this.timer = 0;
        this.xspeed = 0;
        this.yspeed = 0;
    }
    tick(scene) {
        this.timer++;
        if (this.timer > 30) {
            scene.remove(this);
        }

        this.x += this.xspeed;
        this.y += this.yspeed;

        this.sprite.animationTick();

        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }
    draw(ctx) {
        this.sprite._draw(ctx);
    }
}