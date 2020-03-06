class Level1 extends Phaser.Scene{
  constructor(){
    super("level1");
  }
  create() {
    curLevel = 1;
    worldPhys = this.physics;
    curScene = this.scene;

    enemies = [];

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

    // add coins as tiles
    coinLayer = map.createDynamicLayer('CoinLayer', groundTiles, 0, 0);

    // set the boundaries of our game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;

    // create the player sprite
    player = this.physics.add.sprite(200, 1100, 'player');
    player.setBounce(0.1); // our player will bounce from items
    player.setCollideWorldBounds(true); // don't go out of the map

    for(var i=0;i<3;i++){
      this.enemy = this.physics.add.sprite(enemiesPosX[i], enemiesPosY[i], 'enemy');
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

    coinLayer.setTileIndexCallback(879, getCoin, this);
    // when the player overlaps with a tile with index 17, collectCoin 
    // will be called

    // set bounds so the camera won't go outside the game world
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(player);

    // set background color, so the sky is not black    
    this.cameras.main.setBackgroundColor('#ccccff');

    // this text will show the score
    text = this.add.text(20, 570, '0', {
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