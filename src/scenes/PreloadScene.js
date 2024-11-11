import Phaser, { Physics } from "phaser";
import BaseScene from './BaseScene';


class PreloadScene extends BaseScene {

    constructor(config) {
        super('PreloadScene', config);
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('sky', 'assets/sky.png');
        this.load.spritesheet('bird', 'assets/birdSprite.png', {
            frameWidth: 16, frameHeight: 16
          });
        this.load.image('pipeLower', 'assets/pipeMario.png');
        this.load.image('pipeUpper', 'assets/pipeMario2.png');
        this.load.image('pause', 'assets/pause.png');
        this.load.image('back', 'assets/back.png');
        this.load.image(this.AssetKeys.BACKGROUND, 'assets/background.png');
        this.load.image(this.AssetKeys.FOG, 'assets/fog.png');
        this.load.image(this.AssetKeys.FOREGROUND, 'assets/foreground.png');
        this.load.image(this.AssetKeys.TREES, 'assets/trees.png');
    }

    create(){
        this.scene.start('MenuScene');
    }

    update() {
    }    
}

export default PreloadScene;