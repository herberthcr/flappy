import BaseScene from './BaseScene';

class ScoreScene extends BaseScene {

  constructor(config) {
    super('ScoreScene', {...config, canGoBack: true});
  }

  create() {
    super.create();
    const bestScore = localStorage.getItem('bestScore');
    const bestScoreText = this.add.bitmapText(...this.screenCenter, "pixelfont", `Best Score: ${bestScore || 0}` , 32).setOrigin(0.5);

    this.add.tween({
      targets:  bestScoreText,
      scaleX: 1.01,
      scaleY: 1.01,
      ease: "Elastic", 
      duration: 6000,
      repeat: -1, // -1: infinity
      yoyo: false
    });
  }
}

export default ScoreScene;