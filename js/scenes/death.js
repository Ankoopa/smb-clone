class Death extends Phaser.Scene {
    constructor() {
      super("deathScreen");
    }
    preload() {
        this.load.image('play', 'assets/images/ui/playBtn.png');
    }
    create() {
        var deathText;

        if(playerLives >= 0){
            sfxDie.play();
            deathText = "Lives Left: " + playerLives; 
        }
        else{
            sfxGameOver.play();
            deathText = "Game Over!";
        }

        this.add.text(config.width/2, 100, deathText, {
            fontSize: '20px',
            fill: '#ffffff'
        });

        const playBtn = this.add.image(config.width/2, config.height/2, 'play', 0);
        playBtn.setScale(0.5, 0.5); 
        playBtn.setInteractive();
        playBtn.on('pointerdown', () => {
            if(playerLives >= 0){
                switch(curLevel){
                    case 1:
                        this.scene.start("level1");
                        break;
                    case 2:
                        this.scene.start("level2");
                        break;
                    case 3:
                        this.scene.start("level3");
                        break;
                    case 4:
                        this.scene.start("level4");
                        break;
                }
            }
            else{
                this.scene.start("bootGame");
            }
        })
    };
  }