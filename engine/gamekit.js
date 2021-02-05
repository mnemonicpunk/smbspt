import GameKeys from "./gamekeys.js";
import AssetManager from "./assetmanager.js";
import PreloaderScene from "./internal_assets/preloader_scene.js";

export default class GameKit {
    constructor() {
        // install the engine to the window object
        window.gamekit = this;

        console.log("Setting up buffers");
        this.canvas = document.getElementById('game_canvas');
        this.ctx = this.canvas.getContext('2d');
        this.buffer = document.createElement('canvas');
        this.buffer_ctx = this.buffer.getContext('2d');

        this.scale_x = 1;
        this.scale_y = 1;

        this.fps = 0;
        this.fps_timestamp = 0;

        this.assets = new AssetManager();
        this.controls = new GameKeys();

        this._tick_num = 60;
        this.scene = null;

        console.log("Hooking up callbacks");

        let self = this;
        window.addEventListener('resize', function() {
            self.resize();
        });
        self.resize();
        this.setResolution(this.canvas.clientWidth, this.canvas.clientHeight);

        let timestamp = performance.now();
        let current_fps = 0;
        this.fps_timestamp = timestamp;
        let _draw = function() {
            self.draw();
            if (performance.now() - timestamp > 1000/self._tick_num) {
                timestamp = performance.now();
                self.tick();
            }

            // measure fps
            current_fps++;
            if (performance.now() > self.fps_timestamp + 1000) {
                self.fps = current_fps;
                self.fps_timestamp = performance.now();
                current_fps = 0;
            }

            window.requestAnimationFrame(_draw);
        }
        _draw();
    }
    draw() {
        // first clear the screen canvas
        this.ctx.fillStyle = "#000";
        this.ctx.clearRect(0, 0, this.canvas.clientWidth, this.canvas.clientHeight);

        // then we draw the actual scene content onto the buffer
        this.buffer_ctx.fillStyle = "#000";
        this.buffer_ctx.clearRect(0, 0, this.res_w, this.res_h);
        if (this.scene != null) {
            this.buffer_ctx.save();
            this.scene.draw(this.buffer_ctx);
            this.buffer_ctx.restore();
        }

        // and then pop that buffer onto the screen
        
        let scale = this.scale_x;
        if (this.scale_y > this.scale_x) {
            scale = this.scale_y;
        }

        let resized_buffer = {
            w: this.res_w / scale,
            h: this.res_h / scale
        }

        let resized_pos = {
            x: this.canvas.width/2 - resized_buffer.w / 2,
            y: this.canvas.height/2 - resized_buffer.h / 2
        }

        this.ctx.drawImage(this.buffer, 0, 0, this.buffer.width, this.buffer.height, resized_pos.x, resized_pos.y, resized_buffer.w, resized_buffer.h);
    }
    tick() {
        if (this.scene != null) {
            this.scene.tick(this);
            if (this.scene._next_scene != null) {
                this.setScene(this.scene._next_scene);
            }            
        }
        this.controls.afterStep();
        
    }
    resize() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;

        this.scale_x = this.res_w / this.canvas.width;
        this.scale_y = this.res_h / this.canvas.height;
    }
    setResolution(w, h) {
        this.res_w = w;
        this.res_h = h;
        this.buffer.width = this.res_w;
        this.buffer.height = this.res_h;

        console.log("Screen resolution set to " + w + "x" + h);

        this.resize();
    }
    setScene(s) {
        this.scene = s;
    }
    preloadAndStartWith(scene) {
        let s = new PreloaderScene(this);
        s.followup_scene = scene;
        this.setScene(s);
    }
}