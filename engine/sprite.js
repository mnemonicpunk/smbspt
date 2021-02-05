export default class Sprite {
    constructor(options = {}) {
        this.nodes = [];
        this.x = 0;
        this.y = 0;
        this.x_offset = 0;
        this.y_offset = 0;
        this.x_scale = 1;
        this.y_scale = 1;
        this.rotation = 0;
        this.visible = true;
        this.alpha = 1;
        this.options = options;
        this.position_tween = 1;

        this.applyOptions(options);
    }
    applyOptions(options) {
        if (typeof options.x !== "undefined") {
            this.x = options.x;
        }
        if (typeof options.y !== "undefined") {
            this.y = options.y;
        }        
        if (typeof options.scale !== "undefined") {
            this.x_scale = options.scale;
            this.y_scale = options.scale;
        }
        if (typeof options.x_scale !== "undefined") {
            this.x_scale = options.x_scale;
        }
        if (typeof options.y_scale !== "undefined") {
            this.y_scale = options.y_scale;
        }
        if (typeof options.position_tween !== "undefined") {
            this.position_tween = options.position_tween;
        }
        if (typeof options.visible !== "undefined") {
            this.visible = options.visible;
        }        
    }
    _draw(ctx) {
        if (!this.visible) { return; }

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.scale(this.x_scale, this.y_scale);
        ctx.globalAlpha = this.alpha;
        this.draw(ctx);
        for (let i=0; i<this.nodes.length; i++) {
            this.nodes[i]._draw(ctx);
        }
        ctx.restore();
    }
    draw(ctx) {

    }
    anchor(entity) {
        if (this.position_tween == 1) {
            this.x = entity.x;
            this.y = entity.y;    
        } else {
            let diffx = entity.x - this.x;
            let diffy = entity.y - this.y;
    
            this.x += diffx*this.position_tween;
            this.y += diffy*this.position_tween;
        }
        this.animationTick();
    }
    animationTick() {
        
    }
    add(node) {
        this.nodes.push(node);
        return node;
    }
}

export class StaticImageSprite extends Sprite {
    draw(ctx) {
        let img  = this.options.image;
        ctx.drawImage(img, 0, 0);
    }
}

export class TextSprite extends Sprite {
    constructor(options) {
        super(options);

        this.font = "12px Arial";
        this.color = "#000";
        this.outline = false;
        this.outline_color = "#000";
        this.text = "";
        this.alignment = "left";

        this.applyOptions(options);
    }
    applyOptions(options) {
        super.applyOptions(options);
        if (typeof options.font !== "undefined") {
            this.font = options.font;
        }        
        if (typeof options.color !== "undefined") {
            this.color = options.color;
        }  
        if (typeof options.outline !== "undefined") {
            this.outline = options.outline;
        }   
        if (typeof options.outline_color !== "undefined") {
            this.outline_color = options.outline_color;
        }        
        if (typeof options.text !== "undefined") {
            this.text = options.text;
        }
        if (typeof options.alignment !== "undefined") {
            this.alignment = options.alignment;
        }
    }
    draw(ctx) {
        let tx = 0;
        let ty = 0;

        ctx.font = this.font;
        
        let dim = ctx.measureText(this.text);

        // determine x offset according to alignment
        switch (this.alignment) {
            case "right":
                tx -= dim.width;
                break;
            case "center":
                tx -= dim.width/2;
                break;
            default:
                break;
        }

        if (this.outline == true) {
            ctx.fillStyle = this.outline_color;

            ctx.fillText(this.text, tx-1, ty-1);
            ctx.fillText(this.text, tx-1, ty);
            ctx.fillText(this.text, tx-1, ty+1);
            ctx.fillText(this.text, tx, ty-1);
            ctx.fillText(this.text, tx, ty+1);
            ctx.fillText(this.text, tx+1, ty-1);
            ctx.fillText(this.text, tx+1, ty);
            ctx.fillText(this.text, tx+1, ty+1);
        }

        ctx.fillStyle = this.color;
        ctx.fillText(this.text, tx, ty);
    }
}

export class AnimatedSprite extends Sprite {
    constructor(options) {
        super(options);
        this.image_number = 0;
        this.image_max = 0;
        this.ticks_per_frame = 0;
        this._animation_tick = 0; 

        this.applyOptions(options);
    }
    applyOptions(options) {
        super.applyOptions(options);
        if (typeof options.image_number !== "undefined") {
            this.image_number = options.image_number;
        }        
        if (typeof options.image_max !== "undefined") {
            this.image_max = options.image_max;
        }  
        if (typeof options.ticks_per_frame !== "undefined") {
            this.ticks_per_frame = options.ticks_per_frame;
        }   
    }
    animationTick() {
        this._animation_tick++;
        if (this._animation_tick > this.ticks_per_frame) {
            this._animation_tick = 0;
            this.image_number++;
        }
        if (this.image_number > this.image_max) {
            this.image_number = 0;
        }
    }
}

export class SheetSprite extends AnimatedSprite {
    draw(ctx) {
        let img  = this.options.image;

        let num = this.image_number;
        let size_x = img.width / this.options.columns;
        let size_y = img.height / this.options.rows;
        let sx = size_x * (num % this.options.columns);
        let sy = size_y * (Math.floor(num / this.options.columns));

        ctx.drawImage(img, sx, sy, size_x, size_y, 0, 0, size_x, size_y);
    }
}