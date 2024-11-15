import Phaser, { Physics } from "phaser";
import BaseScene from './BaseScene';


class PreloadScene extends BaseScene {

    constructor(config) {
        super('PreloadScene', config);
    }

    preload() {

        // game objetcs
        this.load.image('sky', 'assets/sky.png');
        this.load.spritesheet('bird', 'assets/birdSprite.png', {
            frameWidth: 16, frameHeight: 16
          });
        this.load.image('pipeLower', 'assets/pipeMario.png');
        this.load.image('pipeUpper', 'assets/pipeMario2.png');

        //buttons
        this.load.image('pause', 'assets/pause.png');
        this.load.image('back', 'assets/back.png');

        // intro screens
        this.load.image('splash', 'assets/splash.png');
        this.load.image('logo', 'assets/logo.png');

        // paralax scrolling BG
        this.load.image(this.AssetKeys.BACKGROUND, 'assets/background.png');
        this.load.image(this.AssetKeys.FOG, 'assets/fog.png');
        this.load.image(this.AssetKeys.FOREGROUND, 'assets/foreground.png');
        this.load.image(this.AssetKeys.TREES, 'assets/trees.png');

         // Fonts
         this.load.bitmapFont("pixelfont", "assets/fonts/pixelfont.png", "assets/fonts/pixelfont.xml");

        //sounds
        this.load.audio('game', 'assets/sound/game.ogg');
        this.load.audio('death', 'assets/sound/death.wav');
        this.load.audio('flap', 'assets/sound/flap.wav');
        this.load.audio('chipping', 'assets/sound/chipping.mp3');
    }

    create() {
        this.scene.start("SplashScene");
    }

    update() {
    }    
}

export default PreloadScene;