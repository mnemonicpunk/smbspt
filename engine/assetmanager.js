export class mnAsset {
    constructor(name) {
        this.name = name;
        this.url = "";
        this.loaded = false;
        this.element = null;
    }
    get() {
        return this.element;
    }    
    load(url) {
        this.element.src = url;
    }
}

export class mnImage extends mnAsset {
    constructor(name) {
        super(name);
        this.element = document.createElement('img');

        let self = this;
        this.element.addEventListener('load', function() {
            self.loaded = true;
        });
        this.element.addEventListener('error', function() {
            self.loaded = true;
        });
    }
    get() {
        return this.element;
    } 
}

export class mnSound extends mnAsset {
    constructor(name) {
        super(name);
        this.element = document.createElement('audio');

        let self = this;
        this.element.addEventListener('canplaythrough', function() {
            self.loaded = true;
        });
        this.element.addEventListener('error', function() {
            self.loaded = true;
        });        
    }
    stop() {
        this.element.pause();
        this.element.currentTime = 0; 
    }
    play() {
        if (this.element.paused) {
            let promise = this.element.play();

            if (promise !== undefined) {
                promise.then(_ => {

                }).catch(error => {
                    console.log("Unable to play sound '" + this.name + "'");
                });
            }
        }        
    }
    isPlaying() {
        return !this.element.paused;
    }
}

export default class AssetManager {
    constructor() {
        console.log("AssetManager initialized");
        this.images = [];
        this.sounds = [];
    }
    loadImage(name, url) {
        this.image(name).load(url);
    }
    image(name) {
        for (let i=0; i<this.images.length; i++) {
            let img = this.images[i];
            if (img.name == name) {
                return img;
            }
        }
        let img = new mnImage(name);
        this.images.push(img);
        return img;
    }
    loadSound(name, url) {
        this.sound(name).load(url);
    }
    sound(name) {
        for (let i=0; i<this.sounds.length; i++) {
            let sound = this.sounds[i];
            if (sound.name == name) {
                return sound;
            }
        }
        let sound = new mnSound(name);
        this.sounds.push(sound);
        return sound;
    }
    preloadFinished() {
        let count = 0;
        for (let i in this.images) {
            if (this.images[i].loaded) {
                count++;    
            }
        }
        for (let i in this.sounds) {
            if (this.sounds[i].loaded) {
                count++;    
            }
        }

        return (count >= (parseInt(this.images.length) + parseInt(this.sounds.length)));
    }
}