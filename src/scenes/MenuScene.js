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

      this.logo = this.add.image(this.config.startPosition.x/2, this.config.startPosition.y/2.5, 'logo')
      .setScale(0.25)
      .setOrigin(-0.20, 0);
      const fx = this.logo.postFX.addShine(1, .2, 5);

      this.add.tween({
        targets:  this.logo,
        scaleX: 0.26,
        scaleY: 0.26,
        ease: "Elastic", 
        duration: Phaser.Math.Between(4000,6000),
        repeat: -1, // -1: infinity
        yoyo: false
      });
      
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
      
      
      textGO.on(Phaser.Input.Events.POINTER_OVER, () => {
        textGO.setTint(0xead476);
      })
      textGO.on(Phaser.Input.Events.POINTER_OUT, () => {
        textGO.setTint(0xffffff);
      })
      
      textGO.on(Phaser.Input.Events.POINTER_UP, () => {
        this.chippingSong.stop();
        menuItem.scene && this.scene.start(menuItem.scene);
        if (menuItem.text === 'Exit') {
          this.game.destroy(true);
        }
      })
    }

}

export default MenuScene;