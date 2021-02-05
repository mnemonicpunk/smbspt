import Scene from '../engine/scene.js';
import Entity from "../engine/entity.js";
import { SheetSprite, StaticImageSprite } from "../engine/sprite.js";

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
        let sound_collect = gamekit.assets.sound('salad-collect');

        scene.filter.withClass(Player, p => {
            if ((p.x == this.x) && (p.y == this.y)) {
                p.emitDebris(scene);
                p.eaten++;
        
                this.x = Math.floor(Math.random() * 60) * 16;
                this.y = Math.floor(Math.random() * 33) * 16;

                sound_collect.stop();
                sound_collect.play();
            }
        });
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
            ticks_per_frame: 9,
            alpha: 0
        });

        this.ttl = 0;
    }
    tick(scene) {
        this.sprite.alpha += 0.2;
        if (this.sprite.alpha > 1) {
            this.sprite.alpha = 1;
        }
        if (scene.uptime > this.ttl) {
            scene.remove(this);
        }

        scene.filter.withClass(Player, p => {
            if ((p.alive) &&(p.x == this.x) && (p.y == this.y)) {
                p.die(scene);
            }    
        });
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
    }
    tick(scene) {
        this.timer++;
        if (this.timer > 30) {
            scene.remove(this);
        }
    }
}

class Player extends Entity {
    constructor() {
        super();
        this.render_layer = 1000000;
        this.sprite = new SheetSprite({
            image: gamekit.assets.image('egg').get(),
            columns: 1,
            rows: 4,
            scale: 2,
            image_max: 2,
            ticks_per_frame: 3,
            position_tween: 0.25
        });

        this.dir = 0;
        this.move_ticks = 0;
        this.eaten = 0;
        this.alive = true;
        this.death_timer = 0;
    }
    tick(scene) {
        let bgm = gamekit.assets.sound('game-bgm');
        let mspeed = 16;

        let ctrl = gamekit.controls;
        if (ctrl.check("a") && this.dir != 0) {
            this.dir = 2;
        }
        if (ctrl.check("d") && this.dir != 2) {
            this.dir = 0;
        }        
        if (ctrl.check("w") && this.dir != 1) {
            this.dir = 3;
        }
        if (ctrl.check("s") && this.dir != 3) {
            this.dir = 1;
        }

        this.sprite.visible = this.alive;

        if (this.alive) {
            if (!bgm.isPlaying()) {
                bgm.play();
            }
        
            this.move_ticks++; 
            if (this.move_ticks >= 3) {
                if (this.eaten > 0) {
                    // poop on the floor and make sure it sticks around long enough
                    let p = scene.add(new Poop());
                    p.x = this.x;
                    p.y = this.y;
                    p.ttl = scene.uptime + this.eaten * 5;
                }
    
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
        } else {
            this.death_timer++;
            if (this.death_timer>120) {
                let gos = new GameOverScene();
                gos.updateScore(this.eaten);
                scene.switchScene(gos);
            }
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