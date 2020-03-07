class Level4 extends Phaser.Scene{
    constructor(){
      super("level4");
    }
    create() {
        lastScore = score;
        curLevel = 4;
        worldPhys = this.physics;
        curScene = this.scene;

        enemies = [];

        mus = this.sound.add('bgm4');
        mus.play({loop: -1});

        var enemiesPosX = [572, 2111, 4172, 5144];
        var enemiesPosY = [903, 935, 583, 871];

        map = this.make.tilemap({key: 'map4'});

        var groundTiles = map.addTilesetImage('world_tiles');

        groundLayer = map.createDynamicLayer('WorldLayer', groundTiles, 0, 0);
        groundLayer.setCollisionByExclusion([-1]);

        groundLayer.setTileIndexCallback(783, touchedVertPipe, this);
        groundLayer.setTileIndexCallback(815, touchedVertPipe, this);

        coinLayer = map.createDynamicLayer('CoinLayer', groundTiles, 0, 0);
        decLayer = map.createDynamicLayer('DecorLayer', groundTiles, 0, 0);

        this.physics.world.bounds.width = groundLayer.width;
        this.physics.world.bounds.height = groundLayer.height;

        player = this.physics.add.sprite(275, 903, 'player');
        player.setBounce(0.1);
        player.setCollideWorldBounds(true);

        //spawnEnemies(4, enemiesPosX, enemiesPosY);

        player.body.setSize(player.width-10, player.height-8);

        this.physics.add.collider(groundLayer, player);

        coinLayer.setTileIndexCallback(879, getCoin, this);

        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(player); 
        this.cameras.main.setBackgroundColor('#ccccff');

        scoreLbl = this.add.text(60, 30, "Score:", {
          fontSize: '30px',
          fill: '#ffffff'
        });
        scoreText = this.add.text(88, 65, score, {
            fontSize: '30px',
            fill: '#ffffff'
        });
    
        livesLbl = this.add.text(600, 30, "Lives:", {
          fontSize: '30px',
          fill: '#ffffff'
        });
        livesText = this.add.text(630, 65, playerLives, {
            fontSize: '30px',
            fill: '#ffffff'
        });
    
        // fix the text to the camera
        scoreLbl.setScrollFactor(0);
        scoreText.setScrollFactor(0);
        livesLbl.setScrollFactor(0);
        livesText.setScrollFactor(0);
    }
  
    update(time, delta) {
      playerController(player, cursors);
  
      enemies.forEach(function arr(enemy, idx){
        checkEnemies(enemy, idx);
      });
  
      touchedBounds(player);
  
      this.physics.overlap(player, coinLayer);
    }
  }