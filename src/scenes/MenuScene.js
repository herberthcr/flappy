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
    }

    create(){
      super.create();
      this.createMenu(this.menu, this.setupMenuEvents.bind(this));
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
        textGO.setStyle({fill: '#ff0'});
      })
      textGO.on('pointerout', () => {
        textGO.setStyle({fill: '#fff'});
      })
      
      textGO.on('pointerup', () => {
        menuItem.scene && this.scene.start(menuItem.scene);
        if (menuItem.text === 'Exit') {
          this.game.destroy(true);
        }
      })
    }

}

export default MenuScene;