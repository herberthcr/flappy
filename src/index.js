
import Phaser, { Physics } from "phaser";
import PlayScene from './scenes/PlayScene';
import MenuScene from './scenes/MenuScene';
import PreloadScene from './scenes/PreloadScene';
import ScoreScene from './scenes/ScoreScene';
import PauseScene from './scenes/PauseScene';
import SplashScene  from './scenes/SplashScene';


const WIDTH = 400;
const HEIGHT = 600;
const BIRD_POSITION = {x: WIDTH * 0.1, y: HEIGHT / 2 };

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION
}

const Scenes = [PreloadScene, MenuScene, ScoreScene, PlayScene, PauseScene, SplashScene] ;
const createScene = Scene => new Scene(SHARED_CONFIG)
const initScenes = () => Scenes.map(createScene)

const config = {
  type: Phaser.AUTO,
  parent: "phaser-container",
  ...SHARED_CONFIG,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  pixelArt: true,
  physics: {
    // Arcarde physics plugin, manage physics simulation
    default: 'arcade',
    arcade: {
    }
  },
  fps: { forceSetTimeOut: true, target: 60 },
  scene: initScenes()
}


new Phaser.Game(config);