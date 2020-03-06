class Level2 extends Phaser.Scene{
  constructor(){
    super("level2");
  }
  preload() {
      // map made with Tiled in JSON format
      //this.load.tilemapTiledJSON('map2', 'assets/maps/level2.json');
      // tiles in spritesheet 
  }
  create() {
    curLevel = 2;
    worldPhys = this.physics;
    curScene = this.scene;
    enemies = [];

    var enemiesPosX = [1480, 3681, 5716, 7230];
    var enemiesPosY = [903, 1031, 743, 903];

    map2 = this.make.tilemap({key: 'map2'});

    var groundTiles = map.addTilesetImage('world_tiles');

    groundLayer = map.createDynamicLayer('WorldLayer', groundTiles, 0, 0);
    groundLayer.setCollisionByExclusion([-1]);

    coinLayer = map.createDynamicLayer('CoinLayer', groundTiles, 0, 0);

    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;

    player = this.physics.add.sprite(200, 900, 'player');
    player.setBounce(0.1);
    player.setCollideWorldBounds(true);

    for(var i=0;i<4;i++){
      this.enemy = this.physics.add.sprite(enemiesPosX[i], enemiesPosY[i], 'enemy');
      var spawnX = Phaser.Math.Between(20, config.width - 20);
      this.enemy.velocity = 125;
      this.enemy.alive = true;
      this.enemy.touched = false;
      this.physics.add.collider(groundLayer, this.enemy);
      enemies.push(this.enemy);
  } 
    // small fix to our player images, we resize the physics body object slightly
    player.body.setSize(player.width, player.height-8);
    
    // player will collide with the level tiles 
    this.physics.add.collider(groundLayer, player);
    //this.physics.add.collider(player, enemy);

    coinLayer.setTileIndexCallback(879, getCoin, this);
    // when the player overlaps with a tile with index 17, collectCoin 
    // will be called
    //this.physics.add.overlap(player, enemy, touchedEnemy, null, this);

    // player walk animation
    this.anims.create({
        key: 'walk',
        frames: this.anims.generateFrameNames('player', {prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2}),
        frameRate: 10,
        repeat: -1
    });
    // idle with only one frame, so repeat is not neaded
    this.anims.create({
        key: 'idle',
        frames: [{key: 'player', frame: 'p1_stand'}],
        frameRate: 10,
    });

    this.anims.create({
      key: 'edie',
      frames: [{key: 'enemy', frame: 'squish'}],
      frameRate: 10,
    });

    this.anims.create({
      key: 'ewalk',
      frames: this.anims.generateFrameNames('enemy', {prefix: 'walk', start: 1, end: 2}),
      frameRate: 10,
      repeat: 1
    });

    cursors = this.input.keyboard.createCursorKeys();

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map2.widthInPixels, map2.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(player);

    // set background color, so the sky is not black    
    this.cameras.main.setBackgroundColor('#ccccff');

    this.cameras.main.setZoom(1);

    // this text will show the score
    text = this.add.text(20, 570, score, {
        fontSize: '20px',
        fill: '#ffffff'
    });
    // fix the text to the camera
    text.setScrollFactor(0);
  }

  update(time, delta) {
    playerController(player, cursors);

    enemies.forEach(function arr(enemy, idx){
      checkEnemies(enemy, idx);
    });

    touchedBounds(player, curLevel);

    this.physics.overlap(player, coinLayer);
  }
}