import BaseScene from './BaseScene';

class PlayScene extends BaseScene {

    constructor(config) {
        super('PlayScene', config);
        this.bird = null;
        this.pipes = null;
        this.velocity = 200;
        this.pipesToRender = 4;
        this.flapVelocity = 300;
        this.objectGravity = 600;  
        this.score = 0;
        this.scoreText = '';
        this.isPaused = false;

        this.currentDifficulty = 'easy';
        this.difficulties = {
          'easy': {
            pipeHorizontalDistanceRange: [450, 500],
            pipeOpeningDistanceRange: [150, 200]
          },
          'normal': {
            pipeHorizontalDistanceRange: [350, 400],
            pipeOpeningDistanceRange: [140, 190]
          },
          'hard': {
            pipeHorizontalDistanceRange: [300, 340],
            pipeOpeningDistanceRange: [120, 150]
          }
        }
    }

    create(){
        this.currentDifficulty = 'easy';
        super.create();
        this.createBird();
        this.createPipes();
        this.createColliders();
        this.createScore();
        this.createPause();
        this.handleInputs();
        this.listenToEvents();

        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('bird', { start: 9, end: 15}),
            // 24 fps default, it will play animation consisting of 24 frames in 1 second
            // in case of framerate 2 and sprite of 8 frames animations will play in
            // 4 sec; 8 / 2 = 4
            frameRate: 8,
            // repeat infinitely
            repeat: -1
          })

          this.bird.play('fly');
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

    createScore() {
        this.score = 0;
        const bestScore = localStorage.getItem('bestScore');
        this.scoreText = this.add.text(16,16, `Score: ${this.score}`, { fontSize: '32px', fill: '#000'});
        this.add.text(16, 52, `Best score: ${bestScore || 0}`, { fontSize: '18px', fill: '#000'});
    }

    createBG() {
        this.add.image(0,0,'sky').setOrigin(0);
    }
    
    createBird() {
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird')
        .setFlipX(true)
        .setScale(3)
        .setOrigin(0);

        this.bird.setBodySize(this.bird.width, this.bird.height - 8);
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

    createPause() {
       this.isPaused = false;
       const pauseButton = this.add.image(this.config.width - 10, this.config.height -10, 'pause')
           .setInteractive()
          .setScale(3)
          .setOrigin(1)

          pauseButton.on('pointerdown', () => {
            this.isPaused = true;
            this.physics.pause();
            this.scene.pause();
            this.scene.launch('PauseScene');
          })
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
      const difficulty = this.difficulties[this.currentDifficulty];
      const pipeMostX =  this.getRightMostPipe();
      let pipeVerticalDistance = Phaser.Math.Between(...difficulty.pipeOpeningDistanceRange );
      let pipeVerticalPosition = Phaser.Math.Between(0+80, this.config.height - 80- pipeVerticalDistance);
      let pipeHorizontalDistance  = Phaser.Math.Between(...difficulty .pipeHorizontalDistanceRange ); 
    
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
                this.increaseScore();
                this.saveBestScore();
                this.increaseDifficulty();
            }
          }
        })
      }

      increaseDifficulty() {
        if (this.score === 5) {
          this.currentDifficulty = 'normal';
        }
        if (this.score === 12) {
          this.currentDifficulty = 'hard';
        }
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
        this.saveBestScore()

        this.time.addEvent({
            delay: 1000,
            callback: () => {
              this.scene.restart();
            },
            loop: false
          })   
      }
      
      
      flap() {
        console.log(this.isPaused);
        if (this.isPaused) {  return; }
        this.bird.body.velocity.y = -this.flapVelocity;
      }

      increaseScore() {
        this.score++;
        this.scoreText.setText(`Score: ${this.score}`)
      }

      saveBestScore() {
        const bestScoreText = localStorage.getItem('bestScore');
        const bestScore = bestScoreText && parseInt(bestScoreText, 10);
        if (!bestScore || this.score > bestScore) {
          localStorage.setItem('bestScore', this.score);
        }
      }

      listenToEvents() {
       
        
        if (this.pauseEvent) { return; }

        this.pauseEvent = this.events.on('resume', () => {
          this.initialTime = 3;
          this.countDownText = this.add.text(...this.screenCenter, 'Fly in: ' + this.initialTime, this.fontOptions).setOrigin(0.5);
          this.timedEvent = this.time.addEvent({
            delay: 1000,
            callback: this.countDown,
            callbackScope: this,
            loop: true
          })
        })
      }

      countDown() {
        this.initialTime--;
        this.countDownText.setText('Fly in: ' + this.initialTime);
        if (this.initialTime <= 0) {
          this.isPaused = false;
          this.countDownText.setText('');
          this.physics.resume();
          this.timedEvent.remove();
        }
      }

}

export default PlayScene;