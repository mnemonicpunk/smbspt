import Scene from '../engine/scene.js';
import Entity from "../engine/entity.js";
import { SheetSprite } from "../engine/sprite.js";
import { StaticImageSprite } from "../engine/sprite.js";

import GameOverScene from "./gameoverscene.js";

class Background extends Entity {
    constructor() {
        super();
        this.sprite = new StaticImageSprite({
            image: gamekit.assets.image('bg').get(),
            scale: 2
        });
    }
}

class Salad extends Entity {
    constructor() {
        super();
        this.sprite = new SheetSprite({
            image: gamekit.assets.image('salad').get(),
            columns: 1,
            rows: 1,
            scale: 2
        });
    }
    tick(scene) {
        this.timer++;
        if (this.timer > this.ttl * 5) {
            scene.remove(this);
        }

        let p = scene.filterClass(Player);
        for (let i=0; i<p.length; i++) {
            if ((p[i].x == this.x) && (p[i].y == this.y)) {
                p[i].emitDebris(scene);
                p[i].eaten++;
        
                this.x = Math.floor(Math.random() * 60) * 16;
                this.y = Math.floor(Math.random() * 33) * 16;

                gamekit.assets.sound('salad-collect').stop();
                gamekit.assets.sound('salad-collect').play();
            }
        }
    }
}

class Poop extends Entity {
    constructor() {
        super();
        this.sprite = new SheetSprite({
            image: gamekit.assets.image('poop').get(),
            columns: 1,
            rows: 4,
            scale: 2,
            image_max: 3,
            image_number: Math.floor(Math.random() * 4),
            ticks_per_frame: 15
        });

        this.ttl = 0;
    }
    tick(scene) {
        if (scene.uptime > this.ttl) {
            scene.remove(this);
        }

        let p = scene.filterClass(Player);
        for (let i=0; i<p.length; i++) {
            if (p[i].alive) {
                if ((p[i].x == this.x) && (p[i].y == this.y)) {
                    p[i].die(scene);
                }    
            }
        }        
    }
}

class Debris extends Entity {
    constructor() {
        super();
        this.sprite = new SheetSprite({
            image: gamekit.assets.image('debris').get(),
            columns: 1,
            rows: 2,
            scale: 2,
            image_max: 3,
            image_number: Math.floor(Math.random() * 4),
            ticks_per_frame: 1
        });

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

class Player extends Entity {
    constructor() {
        super();
        this.sprite = new SheetSprite({
            image: gamekit.assets.image('egg').get(),
            columns: 1,
            rows: 4,
            scale: 2,
            image_max: 2,
            ticks_per_frame: 15
        });

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
                let gos = new GameOverScene();
                gos.updateScore(this.eaten);
                scene.switchScene(gos);
            }
        } else {
            let bgm = gamekit.assets.sound('game-bgm');
            if (!bgm.isPlaying()) {
                bgm.play();
            }
    
            this.sprite.animationTick();
    
            let mspeed = 16;
            let ctrl = gamekit.controls;
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
    
                // poop on the floor and make sure it sticks around long enough
                let p = scene.add(new Poop());
                p.x = this.x;
                p.y = this.y;
                p.ttl = scene.uptime + this.eaten * 5;
    
    
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
            let d = scene.add(new Debris());
            d.x = this.x;
            d.y = this.y;
            d.xspeed = directions[i][0];
            d.yspeed = directions[i][1];
        }
        

    }
    die(scene) {
        this.emitDebris(scene);
        this.alive = false;

        gamekit.assets.sound('game-bgm').stop();
        gamekit.assets.sound('egg-death').play();
    }
    draw(ctx) {
        if (this.alive) {
            this.sprite._draw(ctx);
        }
    }
}

export default class GameScene extends Scene {
    constructor() {
        super();
        this.add(new Background());

        let p = this.add(new Player());
        p.x = 64;
        p.y = 64;

        let sx = Math.floor(Math.random() * 60);
        let sy = Math.floor(Math.random() * 33);

        let s = this.add(new Salad());
        s.x = sx*16;
        s.y = sy*16;
    }
}