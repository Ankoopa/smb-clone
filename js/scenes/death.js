class Death extends Phaser.Scene {
    constructor() {
      super("deathScreen");
    }
    preload() {
        this.load.image('play', 'assets/images/ui/playBtn.png');
    }
    create() {
        this.add.text(config.width/2, 100, 'Game Over', {
            fontSize: '20px',
            fill: '#ffffff'
        });

        const playBtn = this.add.image(config.width/2, config.height/2, 'play', 0);
        playBtn.setScale(0.5, 0.5); 
        playBtn.setInteractive();
        playBtn.on('pointerdown', () => {
            this.scene.start("level1");
        })
    };
  }