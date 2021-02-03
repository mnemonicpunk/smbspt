import Entity from "../engine/entity.js";
import GameKit from "../engine/gamekit.js";
import { SheetSprite } from "../engine/sprite.js";
import Player from './player.js';

export default class Salad extends Entity {
    constructor(gamekit) {
        super(gamekit);
        this.sprite = new SheetSprite({
            image: gamekit.assets.getImage('salad'),
            columns: 1,
            rows: 1
        });
        this.sprite.x_scale = 2;
        this.sprite.y_scale = 2;
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
            if ((p[i].x == this.x) && (p[i].y == this.y)) {
                p[i].emitDebris(scene);

                p[i].eaten++;
                let sx = Math.floor(Math.random() * 60);
                let sy = Math.floor(Math.random() * 33);
        
                this.x = sx*16;
                this.y = sy*16;    
                this.sprite.x = this.x;            
                this.sprite.y = this.y;

                let s = scene.gamekit.assets.getSound('salad-collect');
                s.pause();
                s.currentTime = 0;
                s.play();
            }
        }
    }
    draw(ctx) {
        this.sprite._draw(ctx);
    }
}