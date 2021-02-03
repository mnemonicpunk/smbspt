export default class AssetManager {
    constructor() {
        console.log("AssetManager initialized");
        this.images = [];
        this.sounds = [];

        this.preload_num = 0;
        this.preload_finished = 0;
    }
    loadImage(name, url) {
        // add a preloader element to track progress
        this.preload_num++;
        
        let img = this.getImage(name);
        img.element.src = url;
    }
    getImage(name) {
        for (let i=0; i<this.images.length; i++) {
            let img = this.images[i];
            if (img.name == name) {
                return img.element;
            }
        }
        let img = {
            name: name,
            element: document.createElement('img')
        }
        this.images.push(img);

        let self = this;

        img.element.addEventListener('load', function() {
            self.assetPreloaded();
        });
        img.element.addEventListener('error', function() {
            self.assetPreloaded();
        });
        return img;
    }
    loadSound(name, url) {
        // add a preloader element to track progress
        this.preload_num++;
        
        let sound = this.getSound(name);
        sound.element.src = url;
    }
    getSound(name) {
        for (let i=0; i<this.sounds.length; i++) {
            let sound = this.sounds[i];
            if (sound.name == name) {
                return sound.element;
            }
        }
        let sound = {
            name: name,
            element: document.createElement('audio')
        }
        this.sounds.push(sound);

        let self = this;

        sound.element.addEventListener('canplaythrough', function() {
            self.assetPreloaded();
        });
        sound.element.addEventListener('error', function() {
            self.assetPreloaded();
        });
        return sound;
    }
    assetPreloaded() {
        this.preload_finished++;
    }    
    preloadFinished() {
        return this.preload_finished >= this.preload_num;
    }
}