export default class Scene {
    constructor() {
        this.gamekit = null;
        this.entities = [];

        this._next_scene = null;
    }
    draw(ctx) {
        for (let i=0; i<this.entities.length; i++) {
            let e = this.entities[i];
            ctx.save();
            ctx.translate(e.x, e.y);
            e.draw(ctx);
            ctx.restore();
        }
    }
    tick(gamekit) {
        this.gamekit = gamekit;

        for (let i=0; i<this.entities.length; i++) {
            let e = this.entities[i];
            e.tick(this);
        }        
    }
    controls() {
        return this.gamekit.controls;
    }
    add(entity) {
        this.entities.push(entity);
        return entity;
    }
    remove(entity) {
        let idx = -1; 
        for (let i=0; i<this.entities.length; i++) {
            if (this.entities[i] == entity) {
                idx = i;
                break;
            }
        }
        if (idx != -1) {
            this.entities.splice(idx, 1);
        }
        return entity;
    }
    filterClass(class_name) {
        let ret = [];
        for (let i=0; i<this.entities.length; i++) {
            if (this.entities[i] instanceof class_name) {
                ret.push(this.entities[i]);
            }
        }
        return ret;
    }
    switchScene(next_scene) {
        console.log("Switching scene: ");
        console.dir(next_scene);
        this._next_scene = next_scene;
    }
}