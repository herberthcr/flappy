import Phaser from "phaser";

class SplashScene extends Phaser.Scene {

    constructor() {
        super("SplashScene");
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);   
    }

    create() {
        this.add.image(this.scale.width / 2, this.scale.height / 2, "splash");
        //debugger
        //  const fx = logo.postFX.addShine(1, .2, 5);
        
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                const main_camera = this.cameras.main.fadeOut(2500, 0, 0, 0);
                // Fadeout complete
                main_camera.once("camerafadeoutcomplete", () => {
                    this.scene.start('MenuScene');
                });
            }
        });
    }
}

export default SplashScene;