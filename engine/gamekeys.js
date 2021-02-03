export default class GameKeys {
    constructor() {        
        let self = this;

        this.state = {};

        window.addEventListener('keydown', function(e) {
            self.key(e.key, true);
        });
        window.addEventListener('keyup', function(e) {
            self.key(e.key, false);
        });
    }
    afterStep() {
        for (let i in this.state) {
            this.state[i].pressed = false;
            this.state[i].released = false;
        }
    }
    key(code, state) {
        let s = {
            down: state,
            pressed: false,
            released: false

        }

        // if we are already tracking this key
        if (this.state[code] !== undefined) {
            s = this.state[code];
        }

        s.down = state;
        if (state) {
            s.pressed = true;
        } else {
            s.released = true;
        }
        this.state[code] = s;
    }
    check(code) {
        if (this.state[code] !== undefined) {
            return this.state[code].down;
        } else {
            return false;
        }
    }
}