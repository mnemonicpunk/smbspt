export default class GameKeys {
    constructor() {        
        let self = this;

        this.mouse_x = 0;
        this.mouse_y = 0;
        this.mouse_button = [false, false, false, false, false];

        this.state = {};

        window.addEventListener('keydown', function(e) {
            self.keyDown(e.key);
        });
        window.addEventListener('keyup', function(e) {
            self.keyUp(e.key);
        });
        window.addEventListener('keypress', function(e) {
            self.keyPress(e.key);
        });

        window.addEventListener('mousemove', function(e) {
            self.mouseMove(e.clientX, e.clientY);
        });
        window.addEventListener('mousedown', function(e) {
            e.preventDefault();
            self.mouseMove(e.clientX, e.clientY);
            self.mouseButton(e.button, true);
        });
        window.addEventListener('mouseup', function(e) {
            e.preventDefault();
            self.mouseMove(e.clientX, e.clientY);
            self.mouseButton(e.button, false);
        });
        window.addEventListener('contextmenu', function(e) {
            e.preventDefault();
        });
    }
    afterStep() {
        for (let i in this.state) {
            this.state[i].pressed = false;
            this.state[i].released = false;
        }
    }
    keyPress(code, state) {
        this.state[code].down = true;
    }
    keyDown(code) {
        this.state[code] = {
            down: true,
            pressed: true,
            released: false
        }
    }
    keyUp(code) {
        this.state[code] = {
            down: false,
            pressed: false,
            released: true
        }
    }

    check(code) {
        if (this.state[code] !== undefined) {
            return this.state[code].down;
        } else {
            return false;
        }
    }
    checkPressed(code) {
        if (this.state[code] !== undefined) {
            return this.state[code].pressed;
        } else {
            return false;
        }
    }
    checkReleased(code) {
        if (this.state[code] !== undefined) {
            return this.state[code].released;
        } else {
            return false;
        }
    }
    mouseMove(x, y) {
        let v = gamekit.viewport;
        let c = gamekit.canvas;

        let scale = gamekit.scale;
        let new_x = (x - v.x) * scale;
        let new_y = (y - v.y) * scale;

        if (new_x < 0 ) { new_x = 0; }
        if (new_y < 0 ) { new_y = 0; }
        if (new_x > gamekit.res_w ) { new_x = gamekit.res_w; }
        if (new_y > gamekit.res_h ) { new_y = gamekit.res_h; }

        this.mouse_x = Math.round(new_x);
        this.mouse_y = Math.round(new_y);
    }
    mouseButton(button, state) {
        this.mouse_button[button] = state;
        console.log("Button " + button + " set to " + state);
    }
    leftMouse() {
        return this.mouse_button[0].state;
    }
    rightMouse() {
        return this.mouse_button[2].state;
    }
    middleMouse() {
        return this.mouse_button[1].state;
    }
}