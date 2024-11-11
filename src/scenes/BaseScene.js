import Phaser from 'phaser';

class BaseScene extends Phaser.Scene {

  constructor(key, config) {
    super(key);
    this.config = config;
    this.screenCenter = [config.width / 2, config.height / 2];
    this.fontSize = 34;
    this.lineHeight = 42;
    this.fontOptions = {fontSize: `${this.fontSize}px`, fill: '#fff'};

    this.AssetKeys = {
      BACKGROUND: 'BACKGROUND',
      FOG: 'FOG',
      FOREGROUND: 'FOREGROUND',
      TREES: 'TREES',
    };

  }
  create() {
    //this.add.image(0, 0, 'sky').setOrigin(0);
    this.createBG();
    this.createBackButton();

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
      const menuPosition = [this.screenCenter[0], this.screenCenter[1] + lastMenuPositionY];
      menuItem.textGO = this.add.text(...menuPosition, menuItem.text, this.fontOptions).setOrigin(0.5, 1);
      lastMenuPositionY += this.lineHeight;
      setupMenuEvents(menuItem);

    })
  }

  createBackButton() {
    if (this.config.canGoBack) {
        const backButton = this.add.image(this.config.width - 10, this.config.height -10, 'back')
          .setOrigin(1)
          .setScale(2)
          .setInteractive()
        backButton.on('pointerup', () => {
          this.scene.start('MenuScene');
        })
    }
  }
}

export default BaseScene;