import Filter from "./filter.js";

export default class Scene {
    constructor() {
        this.entities = [];
        this.render_order = [];
        this.render_order_stale = true;

        this.filter = new Filter(this.entities);
        this.uptime = 0;

        this._next_scene = null;
    }
    draw(ctx) {
        if (this.render_order_stale) {
            this.generateRenderOrder();
            this.render_order_stale = false;
        }
        for (let i=0; i<this.render_order.length; i++) {
            let e = this.render_order[i];
            ctx.save();
            ctx.translate(e.x, e.y);
            e.draw(ctx);
            ctx.restore();
        }
    }
    tick() {
        this.filter.list = this.entities;

        for (let i=0; i<this.entities.length; i++) {
            let e = this.entities[i];
            e.tick(this);
        }   
        for (let i=0; i<this.entities.length; i++) {
            let e = this.entities[i];
            e._builtinMovement(this);
        }
        for (let i=0; i<this.entities.length; i++) {
            let e = this.entities[i];
            e.sprite.anchor(e);
        }        

        this.uptime++;
    }    
    add(entity) {
        this.entities.push(entity);
        this.render_order_stale = true;
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
        this.render_order_stale = true;
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
        this._next_scene = next_scene;
    }
    generateRenderOrder() {
        let order = [];

        for (let i=0; i<this.entities.length; i++) {
            let e = this.entities[i];
            let insert_index = -1;

            for (let j=0; j<order.length; j++) {
                if (order[j].render_layer > e.render_layer) {
                    insert_index = j;
                }
            }
            if (insert_index == -1) {
                insert_index = order.length;
            }
            order.splice(insert_index, 0, e);
        }
        this.render_order = order;
    }
}