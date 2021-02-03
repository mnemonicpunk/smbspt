import Entity from "../engine/entity.js";
import GameKit from "../engine/gamekit.js";
import { SheetSprite } from "../engine/sprite.js";
import Poop from "./poop.js";
import Debris from "./debris.js";

import GameOverScene from "./gameoverscene.js";

export default class Player extends Entity {
    constructor(gamekit) {
        super(gamekit);
        this.sprite = new SheetSprite({
            image: gamekit.assets.getImage('egg'),
            columns: 1,
            rows: 4
        });
        this.sprite.x_scale = 2;
        this.sprite.y_scale = 2;
        this.sprite.image_max = 3;
        this.sprite.ticks_per_frame = 15;      

        this.dir = 0;
        this.move_ticks = 0;

        this.eaten = 0;

        this.alive = true;
        this.death_timer = 0;
    }
    tick(scene) {
        if (this.alive == false) {
            this.death_timer++;
            if (this.death_timer>120) {
                let gos = new GameOverScene(scene.gamekit);
                gos.updateScore(this.eaten);
                scene.switchScene(gos);
            }
        } else {
            let s = scene.gamekit.assets.getSound('game-bgm');
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
    
            this.sprite.animationTick();
    
            let mspeed = 16;
            let ctrl = scene.controls();
            if (ctrl.check("a")) {
                this.dir = 2;
            }
            if (ctrl.check("d")) {
                this.dir = 0;
            }        
            if (ctrl.check("w")) {
                this.dir = 3;
            }
            if (ctrl.check("s")) {
                this.dir = 1;
            }
    
            this.move_ticks++; 
            if (this.move_ticks >= 3) {
    
                let p = scene.add(new Poop(scene.gamekit));
                p.x = this.x;
                p.y = this.y;
                p.ttl = this.eaten;
    
    
                if (this.dir == 0) {
                    this.x += mspeed;
                }
                if (this.dir == 2) {
                    this.x -= mspeed;
                }
                if (this.dir == 1) {
                    this.y += mspeed;
                }
                if (this.dir == 3) {
                    this.y -= mspeed;
                }
                this.move_ticks = 0;
            }
    
            // if we are outside the play space: die
            if ((this.x < 0) || (this.y < 0) || (this.x >= 1920/2) || (this.y >= 1080/2)) {
                this.die(scene);
            }
            
            let diffx = this.x - this.sprite.x;
            let diffy = this.y - this.sprite.y;
    
            this.sprite.x += diffx*0.25;
            this.sprite.y += diffy*0.25;
        }
    }
    emitDebris(scene) {
        let directions = [
            [-1, -1],
            [-1, 0],
            [-1, 1],
            [0, -1],
            [0, 1], 
            [1, -1],
            [1, 0],
            [1, 1],                       
        ]
        for (let i=0; i<directions.length; i++) {
            let d = scene.add(new Debris(scene.gamekit));
            d.x = this.x;
            d.y = this.y;
            d.xspeed = directions[i][0];
            d.yspeed = directions[i][1];
        }
        

    }
    die(scene) {
        this.emitDebris(scene);
        this.alive = false;

        let s = scene.gamekit.assets.getSound('game-bgm');
        s.pause();
        s.currentTime = 0;

        s = scene.gamekit.assets.getSound('egg-death');
        s.pause();
        s.currentTime = 0;
        s.play();
    }
    draw(ctx) {
        if (this.alive) {
            this.sprite._draw(ctx);
        }
    }
}