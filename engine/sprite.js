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
        this.alpha = 1;
        this.options = options;
    }
    _draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.x_scale, this.y_scale);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.alpha;
        this.draw(ctx);
        ctx.restore();
    }
    draw(ctx) {

    }
}

export class StaticImageSprite extends Sprite {
    draw(ctx, obj) {
        let img  = this.options.image;
        ctx.drawImage(img, 0, 0);
    }
}

export class AnimatedSprite extends Sprite {
    constructor(gamekit) {
        super(gamekit);
        this.image_number = 0;
        this.image_max = 0;
        this.ticks_per_frame = 0;
        this._animation_tick = 0;
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
    draw(ctx, obj) {
        let img  = this.options.image;

        let num = this.image_number;
        let size_x = img.width / this.options.columns;
        let size_y = img.height / this.options.rows;
        let sx = size_x * (num % this.options.columns);
        let sy = size_y * (Math.floor(num / this.options.columns));

        //console.log(num, sx, sy)

        ctx.drawImage(img, sx, sy, size_x, size_y, 0, 0, size_x, size_y);
    }
}