import Scene from '../engine/scene.js';
import Background from './background.js';
import Player from './player.js';
import Poop from './poop.js';
import Salad from './salad.js';

export default class GameScene extends Scene {
    constructor(gamekit) {
        super(gamekit);
        this.add(new Background(gamekit));

        let p = this.add(new Player(gamekit));
        p.x = 64;
        p.y = 64;

        let sx = Math.floor(Math.random() * 60);
        let sy = Math.floor(Math.random() * 33);

        let s = this.add(new Salad(gamekit));
        s.x = sx*16;
        s.y = sy*16;
    }
}