import GameKit from "../engine/gamekit.js";
import PreloaderScene from "../engine/internal_assets/preloader_scene.js";
import TitleScene from "./titlescene.js";
import GameScene from "./gamescene.js";

let gamekit = new GameKit();
gamekit.setResolution(1920, 1080);

gamekit.assets.loadImage("bg", "./testapp/assets/smbspt-bg.png");
gamekit.assets.loadImage("title_bg", "./testapp/assets/pt-title-screen.png");
gamekit.assets.loadImage("egg", "./testapp/assets/eggpixel.png");
gamekit.assets.loadImage("poop", "./testapp/assets/eggpoop.png");
gamekit.assets.loadImage("salad", "./testapp/assets/eggsalad.png");
gamekit.assets.loadImage("debris", "./testapp/assets/eggdebris.png");

gamekit.assets.loadSound("salad-collect", "./testapp/assets/salad-collect.mp3");
gamekit.assets.loadSound("egg-death", "./testapp/assets/egg-death.mp3");
gamekit.assets.loadSound("bgm", "./testapp/assets/meatball_salad_chip.mp3");
gamekit.assets.loadSound("game-bgm", "./testapp/assets/smbspt-game-bg.mp3");
gamekit.assets.loadSound("announce", "./testapp/assets/pt-title.mp3");
//gamekit.setScene(new PreloaderScene(gamekit));
//gamekit.setScene(new GameScene(gamekit));
//gamekit.setScene(new TitleScene(gamekit));
gamekit.preloadAndStartWith(new TitleScene(gamekit));