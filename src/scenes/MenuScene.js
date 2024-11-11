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
      .setOrigin(-0.4, 0);

      this.add.tween({
        targets:  this.empat,
        scaleX: 1.01,
        scaleY: 1.01,
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