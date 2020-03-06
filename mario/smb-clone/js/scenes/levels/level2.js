var enemies = [];
var groundLayer, coinLayer;
var text;
var worldPhys;
var curScene;

class Level2 extends Phaser.Scene{
  constructor(){
    super("level2");
  }
  preload() {
      // level background
      this.load.image('bg', 'assets/images/backgrounds/lvl02-bg.png');
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
    this.add.image(config.width/2, config.height/2, 'bg', 0).setScrollFactor(0);

    worldPhys = this.physics;
    curScene = this.scene;

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
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    // make the camera follow the player
    this.cameras.main.startFollow(player);

    // set background color, so the sky is not black    
    this.cameras.main.setBackgroundColor('#ccccff');

    this.cameras.main.setZoom(1);

    // this text will show the score
    text = this.add.text(20, 650, '0', {
      fontSize: '40px',
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

    enemies.forEach(function arr(enemy, idx){
      if(enemy.alive){
        enemy.anims.play('ewalk', true);
        if(enemy.body.blocked.right){
          enemy.body.setVelocityX(-125);
          enemy.velocity = -125;
        }
        else if(enemy.body.blocked.left){
          enemy.body.setVelocityX(125);
          enemy.velocity = 125;
        }
        else{
          enemy.body.setVelocityX(enemy.velocity);
        }
        worldPhys.world.collide(player, enemy, function(player, enemy){
          if(enemy.body.touching.up && player.body.touching.down){
              player.body.setVelocityY(-200);
              // in this case just jump again
              enemy.alive = false;
              enemy.destroy();
          }
          else{
              // any other way to collide on an enemy will restart the game
              score = 0;
              curScene.start("deathScreen");
          }
        }, null, this);
      }
    })

    if(player.body.checkWorldBounds() && player.body.y >= 1190){
      score = 0;
      this.scene.start('deathScreen');
    }
    else if(player.body.checkWorldBounds() && player.body.x >= 6900){
      this.scene.start('level2');
    }

    this.physics.overlap(player, coinLayer);
  }
}

function getCoin(player, coin){
  console.log('coin get');
  coinLayer.removeTileAt(coin.x, coin.y); // remove the tile/coin
  score++; // add 10 points to the score
  text.setText(score); // set the text to show the current score
}