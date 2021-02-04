import Sprite from './sprite.js';

export default class Entity {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.xspeed = 0;
        this.yspeed = 0;
        this.sprite = new Sprite();
    }
    draw(ctx) {
        this.sprite._draw(ctx);
    }
    tick() {

    }
    _builtinMovement(scene) {
        this.x += this.xspeed;
        this.y += this.yspeed;
    }
}