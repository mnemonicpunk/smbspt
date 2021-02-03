import Scene from "../scene.js";
import mnLogo from "./mnlogo.js";

export default class PreloaderScene extends Scene {
    constructor(gamekit) {
        super(gamekit);
        this.entities.push(new mnLogo(gamekit));
    }
}