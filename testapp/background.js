import Entity from "../engine/entity.js";
import GameKit from "../engine/gamekit.js";
import { StaticImageSprite } from "../engine/sprite.js";

export default class Background extends Entity {
    constructor(gamekit) {
        super(gamekit);
        this.sprite = new StaticImageSprite({
            image: gamekit.assets.getImage('bg')
        });
        this.sprite.x_scale = 2;
        this.sprite.y_scale = 2;
    }
    tick(scene) {
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }
    draw(ctx) {
        this.sprite._draw(ctx);
    }
}