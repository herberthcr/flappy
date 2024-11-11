import Phaser, { Physics } from "phaser";
import BaseScene from './BaseScene';

class MenuScene extends BaseScene {

    constructor(config) {
      super('MenuScene', config);

      this.menu = [
        {scene: 'PlayScene', text: 'Play'},
        {scene: 'ScoreScene', text: 'Score'},
        {scene: null, text: 'Exit'},
      ]
      this.logo = null;
      this.empat = null;
    }

    create(){
      super.create();
      this.createMenu(this.menu, this.setupMenuEvents.bind(this));

      // this.add.image(this.scale.width / 8, this.scale.height / 8, "logo");
      this.logo = this.add.image(this.config.startPosition.x/2, this.config.startPosition.y/1.8, 'logo')
      .setScale(0.25)
      .setOrigin(-0.25, 0);

      this.empat = this.add.image(this.config.startPosition.x/2, this.config.startPosition.y/10, 'empat')
      //.setScale(0.3)
      .setOrigin(-0.4, 0);
      //const fx = this.logo.postFX.addShine(1, .2, 5);
    }

    update() {
      this.moveBackgroundParalax();
    }    
  
    moveBackgroundParalax() {
      this.bg.tilePositionX += 0.05;
      this.trees.tilePositionX += 0.02;
      this.fg.tilePositionX += 0.1;
      this.fog.tilePositionX += 0.3;
    }

    setupMenuEvents(menuItem) {
      const textGO = menuItem.textGO;
      textGO.setInteractive();
      
      
      textGO.on('pointerover', () => {
        textGO.setTint(0xead476);
      })
      textGO.on('pointerout', () => {
        textGO.setTint(0xffffff);
      })
      
      textGO.on('pointerup', () => {
        this.chippingSong.stop();
        menuItem.scene && this.scene.start(menuItem.scene);
        if (menuItem.text === 'Exit') {
          this.game.destroy(true);
        }
      })
    }

}

export default MenuScene;