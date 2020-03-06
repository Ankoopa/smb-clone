class Menu extends Phaser.Scene {
    constructor() {
      super("bootGame");
    }
    create() {
        score = 0;
        playerLives = 3;

        this.add.text(config.width/2, 100, 'Main Menu', {
            fontSize: '20px',
            fill: '#ffffff'
        });

        const playBtn = this.add.image(config.width/2, config.height/2, 'play', 0);
        playBtn.setScale(0.5, 0.5); 
        playBtn.setInteractive();
        playBtn.on('pointerdown', () => {
            this.scene.start("level3");
            return false;
        })
    };
  }