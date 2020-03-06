class Death extends Phaser.Scene {
    constructor() {
      super("deathScreen");
    }
    preload() {
        this.load.image('dead', 'assets/images/ui/death-scrn.png');
        this.load.image('restart', 'assets/images/ui/restart.png');
        this.load.image('menu', 'assets/images/ui/menu.png');
    }
    create() {
        const dead = this.add.image(config.width/2, 2*config.height/5, 'dead', 0);
        dead.setScale(1.15, 1.15);

        this.add.text(500, 3*config.height/5, 'Game Over', {
            fontSize: '50px',
            fill: '#ffffff'
        });

        const rsttBtn = this.add.image(config.width/3, 4*config.height/5, 'restart', 0);
        rsttBtn.setScale(1, 1); 
        rsttBtn.setInteractive();
        rsttBtn.on('pointerdown', () => {
            this.scene.start("level1");
        })

        // change icon
        const homeBtn = this.add.image(2*config.width/3, 4*config.height/5, 'menu', 0);
        homeBtn.setScale(1, 1);
        homeBtn.setInteractive();
        homeBtn.on('pointerdown', () => {
            this.scene.start("bootGame");
        })
    };
  }