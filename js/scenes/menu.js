class Menu extends Phaser.Scene {
    constructor() {
      super("bootGame");
    }
    preload() {
        this.load.image('play', 'assets/images/ui/playBtn.png');
        this.load.atlas('player', 'assets/sprites/player.png', 'assets/sprites/json/player.json');

        this.load.spritesheet('world_tiles', 'assets/maps/tileset_world.png', {frameWidth: 32, frameHeight: 32});

        this.load.image('coin', 'assets/sprites/coinGold.png');

        this.load.atlas('player', 'assets/sprites/player.png', 'assets/sprites/json/player.json');
        this.load.atlas('enemy', 'assets/sprites/enemy.png', 'assets/sprites/json/enemy.json');
    }
    create() {
        playerLives = 3;

        this.add.text(config.width/2, 100, 'Main Menu', {
            fontSize: '20px',
            fill: '#ffffff'
        });

        const playBtn = this.add.image(config.width/2, config.height/2, 'play', 0);
        playBtn.setScale(0.5, 0.5); 
        playBtn.setInteractive();
        playBtn.on('pointerdown', () => {
            this.scene.start("level1");
            return false;
        })
    };
  }