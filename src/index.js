
import Phaser, { Physics } from "phaser";

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    // Arcarde physics plugin, manage physics simulation
    default: 'arcade',
    arcade: {
      //debug: true,
     // gravity: {y:400}
    }
  },
  fps: { forceSetTimeOut: true, target: 60 },
  scene: {
    preload,
    create,
    update
  }
}

const velocity = 200;
const pipesToRender = 4;
const flapVelocity = 250;
let pipeHorizontalDistance = 0;
let bird = null;
let pipeOpeningDistanceRange = [100,250];


const initialBirdPosition = {
  x: config.width/10,
  y: config.height/2
}

function preload(){

  this.load.image('sky', 'assets/sky.png');
  this.load.image('bird', 'assets/bird.png');
  this.load.image('pipeLower', 'assets/pipeMario.png');
  this.load.image('pipeUpper', 'assets/pipeMario2.png');
}

function create(){
  this.add.image(0,0,'sky').setOrigin(0);
  bird = this.physics.add.sprite(initialBirdPosition.x,initialBirdPosition.y, 'bird' ).setOrigin(0);
  bird.body.gravity.y = 400;

  for(let i=0; i < pipesToRender; i++)
  {
    let pipeUpper = this.physics.add.sprite(0,  0, 'pipeUpper' ).setOrigin(0,1);
    let pipeLower = this.physics.add.sprite(0, 0, 'pipeLower' ).setOrigin(0);

    placePipe(pipeUpper, pipeLower);
  }
  
  this.input.on('pointerdown', flap);

  this.input.keyboard.on('keydown', (event) => {
     if(event.code === 'Space'){
      flap();   
    }
  })
}

function update(time, delta)
{
  if(bird.y >= config.height-bird.height || bird.y <= 0)
  {
    restarPlayerPosition();
  }
}

function placePipe(uPipe,lPipe)
{
  pipeHorizontalDistance += 400;
  let pipeVerticalDistance = Phaser.Math.Between(...pipeOpeningDistanceRange);
  let pipeVerticalPosition = Phaser.Math.Between(0+80, config.height - 80-pipeVerticalDistance);

  uPipe.x = pipeHorizontalDistance;
  uPipe.y = pipeVerticalPosition;
  lPipe.x = uPipe.x;
  lPipe.y = uPipe.y + pipeVerticalDistance;

  uPipe.body.velocity.x = -200; 
  lPipe.body.velocity.x = -200;
}

function restarPlayerPosition(){
    bird.y = initialBirdPosition.y;
    bird.x = initialBirdPosition.x;
    bird.body.velocity.y = 0;
}


function flap(){
  bird.body.velocity.y = -flapVelocity;
}

new Phaser.Game(config);