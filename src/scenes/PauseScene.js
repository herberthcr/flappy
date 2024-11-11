import BaseScene from './BaseScene';

class PauseScene extends BaseScene {
  constructor(config) {
    super('PauseScene', config);
    this.menu = [
      {scene: 'PlayScene', text: 'Continue'},
      {scene: 'MenuScene', text: 'Exit'},
    ]
  }

  create() {
    super.create();
    this.createMenu(this.menu, this.setupMenuEvents.bind(this));
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
        if (menuItem.scene && menuItem.text === 'Continue') {
            // Shutting down the Pause Scene and resuming the Play Scene
            this.scene.stop();
            this.scene.resume(menuItem.scene);
          } else {
            // Shutting PlayScene, PauseScene and running Menu
            this.scene.stop('PlayScene');
            this.scene.start(menuItem.scene);
          }
    })
  }

}

export default PauseScene;