class Level2 extends Phaser.Scene{
  constructor(){
    super("level2");
  }
  create() {
    lastScore = score;
    curLevel = 2;
    worldPhys = this.physics;
    curScene = this.scene;

    enemies = [];

    mus = this.sound.add('bgm2');
    mus.play({loop: -1});

    var enemiesPosX = [1480, 3681, 5716, 7230];
    var enemiesPosY = [903, 1031, 743, 903];

    map = this.make.tilemap({key: 'map2'});

    var groundTiles = map.addTilesetImage('world_tiles');

    groundLayer = map.createDynamicLayer('WorldLayer', groundTiles, 0, 0);
    groundLayer.setCollisionByExclusion([-1]);

    groundLayer.setTileIndexCallback(561, touchedPipe, this);
    groundLayer.setTileIndexCallback(562, touchedPipe, this);

    coinLayer = map.createDynamicLayer('CoinLayer', groundTiles, 0, 0);
    decLayer = map.createDynamicLayer('DecorLayer', groundTiles, 0, 0);

    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;

    player = this.physics.add.sprite(83, 999, 'player');
    player.setBounce(0.1);
    player.setCollideWorldBounds(true);

    spawnEnemies(3, enemiesPosX, enemiesPosY);

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