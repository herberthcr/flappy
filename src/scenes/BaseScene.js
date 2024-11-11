import Phaser from 'phaser';

class BaseScene extends Phaser.Scene {

  constructor(key, config) {
    super(key);
    this.config = config;
    this.screenCenter = [config.width / 2, config.height / 2];
    this.fontSize = 40;
    this.lineHeight = 64;
    this.fontOptions = {fontSize: `${this.fontSize}px`, fill: '#fff'};

    this.AssetKeys = {
      BACKGROUND: 'BACKGROUND',
      FOG: 'FOG',
      FOREGROUND: 'FOREGROUND',
      TREES: 'TREES',
    };
    this.chippingSong = null;
  }

  create() {
    this.createBG();
    this.createBackButton();

    this.chippingSong = this.sound.add("chipping");
    this.chippingSong.loop = true;
    this.chippingSong.volume= .5;
    this.chippingSong.play();
  }

  createBG() {
    //this.add.image(0,0,'sky').setOrigin(0);
    this.bg = this.add.tileSprite(0, 0, this.config.width, this.config.height, this.AssetKeys.BACKGROUND).setScale(3).setOrigin(0);
    this.trees = this.add.tileSprite(0, 0, this.config.width, this.config.height, this.AssetKeys.TREES).setScale(3).setOrigin(0);
    this.fg = this.add.tileSprite(0, 0, this.config.width, this.config.height, this.AssetKeys.FOREGROUND).setScale(3).setOrigin(0);
    this.fog = this.add.tileSprite(0, 0, this.config.width, this.config.height, this.AssetKeys.FOG).setScale(3).setOrigin(0);
  }



  createMenu(menu, setupMenuEvents) {
    let lastMenuPositionY = 0;
    menu.forEach(menuItem => {
      const menuPosition = [this.screenCenter[0], this.screenCenter[1]+30 + lastMenuPositionY];
      
      menuItem.textGO = this.add.bitmapText(...menuPosition, "pixelfont", menuItem.text, this.fontSize).setOrigin(0.5, 1);

      this.add.tween({
        targets:  menuItem.textGO,
        scaleX: 1.01,
        scaleY: 1.01,
        ease: "Elastic", // 'Cubic', 'Elastic', 'Bounce', 'Back'
        duration: 6000,
        repeat: -1, // -1: infinity
        yoyo: false
      });

      
      lastMenuPositionY += this.lineHeight;
      setupMenuEvents(menuItem);

    })
  }

  createBackButton() {
    if (this.config.canGoBack) {
        const backButton = this.add.image(this.config.width - 10, this.config.height -10, 'back')
          .setOrigin(1)
          .setScale(2)
          .setInteractive();

          this.add.tween({
            targets:  backButton,
            scaleX: 2.1,
            scaleY: 2.1,
            ease: "Bounce", // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1500,
            repeat: -1, // -1: infinity
            yoyo: false
          });

        backButton.on(Phaser.Input.Events.POINTER_UP, () => {
          this.scene.start('MenuScene');
        })
    }
  }
}

export default BaseScene;