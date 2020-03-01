class Menu extends Phaser.Scene {
    constructor() {
      super("bootGame");
    }
    preload() {
        this.load.image('play', 'assets/images/ui/playBtn.png');
    }
    create() {
        const playBtn = this.add.image(config.width/2, config.height/2, 'play', 0);
        playBtn.setScale(0.5, 0.5); 
        playBtn.setInteractive();
        playBtn.on('pointerdown', () => {
            this.scene.start("playGame");
            return false;
        })
    };
  }