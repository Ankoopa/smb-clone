class Level1 extends Phaser.Scene{
  constructor(){
    super("level1");
  }
  create() {
    lastScore = 0;
    curLevel = 1;
    worldPhys = this.physics;
    curScene = this.scene;

    enemies = [];

    mus = this.sound.add('bgm1');
    mus.play({loop: -1});

    var enemiesPosX = [400, 3516, 5095];
    var enemiesPosY = [750, 870, 1063];
    // load the map 
    map = this.make.tilemap({key: 'map'});

    // tiles for the ground layer
    var groundTiles = map.addTilesetImage('world_tiles');
    // create the ground layer
    groundLayer = map.createDynamicLayer('WorldLayer', groundTiles, 0, 0);
    // the player will collide with this layer
    groundLayer.setCollisionByExclusion([-1]);

    groundLayer.setTileIndexCallback(553, touchedPipe, this);
    groundLayer.setTileIndexCallback(554, touchedPipe, this);

    // add coins as tiles
    coinLayer = map.createDynamicLayer('CoinLayer', groundTiles, 0, 0);

    // set the boundaries of our game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;

    // create the player sprite
    player = this.physics.add.sprite(200, 1100, 'player');
    player.setBounce(0.1); // our player will bounce from items
    player.setCollideWorldBounds(true); // don't go out of the map

    spawnEnemies(3, enemiesPosX, enemiesPosY);

    // small fix to our player images, we resize the physics body object slightly
    player.body.setSize(player.width-10, player.height-8);
    
    // player will collide with the level tiles 
    this.physics.add.collider(groundLayer, player);

    // coin sprite has an ID of 879 in the spritesheet
    coinLayer.setTileIndexCallback(879, getCoin, this);

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(player);

    // set background color, so the sky is not black    
    this.cameras.main.setBackgroundColor('#ccccff');

    // this text will show the score
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