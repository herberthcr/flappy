import BaseScene from './BaseScene';

class ScoreScene extends BaseScene {

  constructor(config) {
    super('ScoreScene', {...config, canGoBack: true});
  }

  create() {
    super.create();
    const bestScore = localStorage.getItem('bestScore');
    this.add.bitmapText(...this.screenCenter, "pixelfont", `Best Score: ${bestScore || 0}` , 32).setOrigin(0.5);
  }
  
}

export default ScoreScene;