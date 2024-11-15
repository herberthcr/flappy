import BaseScene from './BaseScene';

class PlayScene extends BaseScene {

    constructor(config) {
        super('PlayScene', config);
        this.bird = null;
        this.pipes = null;
        this.gameSong = null;
        this.deathSoundEffect = null;
        this.flapSoundEffect = null;
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
        this.createBG();
        this.createBird();
        this.createPipes();
        this.createColliders();
        this.createScore();
        this.createPause();
        this.handleInputs();
        this.listenToEvents();
        this.playSongs();

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

    playSongs() {

      // main game song
      this.gameSong = this.sound.add("game");
      this.gameSong.loop = true;
      this.gameSong.volume= .2;
      this.gameSong.play();

      // death sound
      this.deathSoundEffect = this.sound.add("death");
      // flap sound
      this.flapSoundEffect = this.sound.add("flap");
      
    }


    update() {
        this.checkGameStatus();
        this.recyclePipes();
        this.moveBackgroundParalax();
    }    

    moveBackgroundParalax() {
      this.bg.tilePositionX += 0.1;
      this.trees.tilePositionX += 0.14;
      this.fg.tilePositionX += 0.2;
      this.fog.tilePositionX += 0.7;
    }

    checkGameStatus() {
        if (this.bird.getBounds().bottom >= this.config.height || this.bird.y <= 0) {
            this.gameOver();
        }
    }

    createScore() {
        this.score = 0;
        const bestScore = localStorage.getItem('bestScore');
        this.scoreText = this.add.bitmapText(16,16, "pixelfont", `Score: ${this.score}` , 32); 
        this.add.bitmapText(16,52, "pixelfont",  `Best score: ${bestScore || 0}` , 24);

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

          
        this.add.tween({
          targets:  pauseButton,
          scaleX: 3.2,
          scaleY: 3.2,
          ease: "Bounce", // 'Cubic', 'Elastic', 'Bounce', 'Back'
          duration: 3000,
          repeat: -1, // -1: infinity
          yoyo: false
        });


          pauseButton.on(Phaser.Input.Events.POINTER_DOWN, () => {
            this.isPaused = true;
            this.gameSong.pause();
            this.physics.pause();
            this.scene.pause();
            this.scene.launch('PauseScene');
          })
      }

    createColliders () {
        this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
    }

    handleInputs() {

       this.input.on(Phaser.Input.Events.POINTER_DOWN,  this.flap, this);
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
        this.gameSong.stop();
        this.physics.pause();
        this.bird.setTint(0xEE4824);
        this.saveBestScore()
        if(!this.deathSoundEffect.isPlaying) {
          this.deathSoundEffect.play();
        }

        this.time.addEvent({
            delay: 1000,
            callback: () => {
              this.scene.restart();
            },
            loop: false
          })   
      }
      
      flap() {
        this.flapSoundEffect.play();
        if (this.isPaused) {  return; }

        this.add.tween({
          targets:  this.bird,
          angle: Phaser.Math.Between(-1,-30), 
          ease: "Linear", // 'Cubic', 'Elastic', 'Bounce', 'Back'
          duration: 0.1,
          repeat: 0,
          yoyo: false,
         repeat: -1, // -1: infinity
      });
  
        this.flapSoundEffect.play();
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
          this.countDownText = this.add.bitmapText(...this.screenCenter, "pixelfont",  'Fly in: ' + this.initialTime , this.fontSize).setOrigin(0.5);

          this.add.tween({
            targets:  this.countDownText,
            scaleX: 1.01,
            scaleY: 1.01,
            ease: "Elastic", 
            duration: 6000,
            repeat: -1, // -1: infinity
            yoyo: false
          });

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
          this.gameSong.resume();
          this.timedEvent.remove();
        }
      }

}

export default PlayScene;