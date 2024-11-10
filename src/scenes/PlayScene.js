import Phaser, { Physics } from "phaser";

class PlayScene extends Phaser.Scene {

    constructor(config) {
        super('PlayScene');
        this.config = config;
        this.bird = null;
        this.pipes = null;
        this.velocity = 200;
        this.pipesToRender = 4;
        this.flapVelocity = 300;
        this.objectGravity = 600;
        this.pipeOpeningDistanceRange = [100,250] ;
        this.pipeHorizontalDistanceRange = [450,550 ];     
    }

    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('bird', 'assets/bird.png');
        this.load.image('pipeLower', 'assets/pipeMario.png');
        this.load.image('pipeUpper', 'assets/pipeMario2.png');
    }

    create(){
        this.createBG();
        this.createBird();
        this.createPipes();
        this.createColliders();
        this.handleInputs();
    }

    update() {
        this.checkGameStatus();
        this.recyclePipes();
    }    

    checkGameStatus() {
        if (this.bird.getBounds().bottom >= this.config.height || this.bird.y <= 0) {
            this.gameOver();
        }
    }

    createBG() {
        this.add.image(0,0,'sky').setOrigin(0);
    }
    
    createBird() {
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird').setOrigin(0);
        this.bird.body.gravity.y = this.objectGravity;
        this.bird.setCollideWorldBounds(true);

    }

    createPipes() {

        this.pipes = this.physics.add.group();

        for(let i=0; i < this.pipesToRender; i++)
        {
          let pipeUpper = this.pipes
            .create(0,  0, 'pipeUpper' )
            .setImmovable(true)
            .setOrigin(0,1);
          let pipeLower = this.pipes
            .create(0, 0, 'pipeLower' )
            .setImmovable(true)
            .setOrigin(0);
      
          this.placePipe(pipeUpper, pipeLower);
        }
      
        this.pipes.setVelocityX  (-200);
    }

    createColliders () {
        this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
    }

    handleInputs() {
        this.input.on('pointerdown',  this.flap, this);
        this.input.keyboard.on('keydown', (event) => {
           if(event.code === 'Space'){
            this.flap();   
          }
        })
      }

    placePipe(uPipe,lPipe)
    {
      const pipeMostX =  this.getRightMostPipe();
      let pipeVerticalDistance = Phaser.Math.Between(...this.pipeOpeningDistanceRange );
      let pipeVerticalPosition = Phaser.Math.Between(0+80, this.config.height - 80- pipeVerticalDistance);
      let pipeHorizontalDistance  = Phaser.Math.Between(...this.pipeHorizontalDistanceRange ); 
    
      uPipe.x = pipeMostX + pipeHorizontalDistance;
      uPipe.y = pipeVerticalPosition;
      lPipe.x = uPipe.x;
      lPipe.y = uPipe.y + pipeVerticalDistance;
    
    }

    recyclePipes() {
        let tempPipes = [];
      
        this.pipes.getChildren().forEach((pipe) => {
          if(pipe.getBounds().right <= 0) {
            tempPipes.push(pipe);
            if(tempPipes.length === 2) {
                this.placePipe(...tempPipes);
            }
          }
        })
      }
      
     getRightMostPipe() {
        let rightMostX = 0;
        this.pipes.getChildren().forEach( (pipe) => {
          rightMostX = Math.max(pipe.x,rightMostX);
        })
        return rightMostX;
      }
      
      gameOver() {
        this.physics.pause();
        this.bird.setTint(0xEE4824);

        this.time.addEvent({
            delay: 1000,
            callback: () => {
              this.scene.restart();
            },
            loop: false
          })   
      }
      
      
      flap() {
        this.bird.body.velocity.y = -this.flapVelocity;
      }

}

export default PlayScene;