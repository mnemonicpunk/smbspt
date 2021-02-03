import Scene from '../engine/scene.js';
import TitleEntity from './titleentity.js';

export default class TitleScene extends Scene {
    constructor(gamekit) {
        super(gamekit);
        this.add(new TitleEntity(gamekit));
    }
}