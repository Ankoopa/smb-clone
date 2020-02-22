class Menu extends Phaser.Scene {
    constructor() {
      super("bootGame");
    }
    create() {
      const helloButton = this.add.text(400, 400, 'New Game', { fill: '#ffb6c1' });
      helloButton.setInteractive();
      helloButton.on('pointerdown', () => { 
        this.scene.start("playGame");
      });
    }
  }