var map;
var player;
var enemy;
var cursors;
var groundLayer, coinLayer;
var text;
var score = 0;
var overlapTriggered = false;

class Level1 extends Phaser.Scene{
  constructor(){
    super("level1");
  }
  preload() {
      // map made with Tiled in JSON format
      this.load.tilemapTiledJSON('map', 'assets/maps/level1alt.json');
      // tiles in spritesheet 
      this.load.spritesheet('world_tiles', 'assets/maps/tileset_world.png', {frameWidth: 32, frameHeight: 32});
      // simple coin image
      this.load.image('coin', 'assets/sprites/coinGold.png');
      // player animations
      this.load.atlas('player', 'assets/sprites/player.png', 'assets/sprites/json/player.json');
      this.load.atlas('enemy', 'assets/sprites/enemy.png', 'assets/sprites/json/enemy.json');
  }
  create() {
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
    
    enemy = this.physics.add.sprite(400, 750, 'enemy');
    enemy.setCollideWorldBounds(true);
    enemy.velocity = 125;
    enemy.alive = true
    enemy.touched = false;
    
    // small fix to our player images, we resize the physics body object slightly
    player.body.setSize(player.width, player.height-8);
    enemy.body.setSize(enemy.width, enemy.height);
    
    // player will collide with the level tiles 
    this.physics.add.collider(groundLayer, player);
    this.physics.add.collider(groundLayer, enemy);
    //this.physics.add.collider(player, enemy);

    coinLayer.setTileIndexCallback(879, collectCoin, this);
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
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(player);

    // set background color, so the sky is not black    
    this.cameras.main.setBackgroundColor('#ccccff');

    this.cameras.main.setZoom(1);

    // this text will show the score
    text = this.add.text(20, 570, '0', {
        fontSize: '20px',
        fill: '#ffffff'
    });
    // fix the text to the camera
    text.setScrollFactor(0);
  }

  update(time, delta) {
    if (cursors.left.isDown)
    {
      player.body.setVelocityX(-250);
      player.anims.play('walk', true); // walk left
      player.flipX = true; // flip the sprite to the left
    }
    else if (cursors.right.isDown)
    {
      player.body.setVelocityX(250);
      player.anims.play('walk', true);
      player.flipX = false; // use the original sprite looking to the right
    } else {
      player.body.setVelocityX(0);
      player.anims.play('idle', true);
    }
    // jump 
    if (cursors.up.isDown && player.body.onFloor()){
      player.body.setVelocityY(-500);        
    }

    if(enemy.touched){
      this.scene.start('deathScreen');
      return;
    }

    if(enemy.alive){
      if(enemy.body.blocked.right){
        enemy.body.setVelocityX(-125);
        enemy.velocity = -125
      }
      else if(enemy.body.blocked.left){
        enemy.body.setVelocityX(125);
        enemy.velocity = 125;
      }
      else{
        enemy.body.setVelocityX(enemy.velocity);
        enemy.anims.play('ewalk', true);
      }
    }
    //console.log(enemy.body.blocked);

    //console.log(player.body.x);
    //console.log(player.body.y);

    if(player.body.checkWorldBounds() && player.body.y >= 1190){
      score = 0;
      this.scene.start('deathScreen');
    }
    else if(player.body.checkWorldBounds() && player.body.x >= 6900){
      this.scene.start('level2');
    }

    this.physics.world.collide(player, enemy, function(player, enemy){
      if(enemy.body.touching.up && player.body.touching.down){

          // in this case just jump again
          enemy.alive = false;
          enemy.destroy();
      }
      else{

          // any other way to collide on an enemy will restart the game
          score = 0;
          this.scene.start("deathScreen");
      }
    }, null, this);

    this.physics.overlap(player, coinLayer, this.getCoin);
  }
}

function getCoin(player, coin){
  console.log('coin get');
  coinLayer.removeTileAt(coin.x, coin.y); // remove the tile/coin
  score++; // add 10 points to the score
  text.setText(score); // set the text to show the current score
}

/*
function touchedEnemy(){
  console.log('touched Enemy.');
  if(enemy.body.touching.up){
    enemy.destroy();
    enemy.alive = false;
    score += 5;
  }
  else{
    enemy.touched = true;
  }
}
*/