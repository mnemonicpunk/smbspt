export default class GameKeys {
    constructor() {        
        let self = this;

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

}