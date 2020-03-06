class Level3 extends Phaser.Scene{
  constructor(){
    super("level3");
  }
  create() {
    lastScore = score;
    curLevel = 3;
    worldPhys = this.physics;
    curScene = this.scene;

    enemies = [];

    var enemiesPosX = [572, 2111, 4172, 5144];
    var enemiesPosY = [903, 935, 583, 871];

    map = this.make.tilemap({key: 'map3'});

    var groundTiles = map.addTilesetImage('world_tiles');

    groundLayer = map.createDynamicLayer('WorldLayer', groundTiles, 0, 0);
    groundLayer.setCollisionByExclusion([-1]);

    coinLayer = map.createDynamicLayer('CoinLayer', groundTiles, 0, 0);
    decLayer = map.createDynamicLayer('DecorLayer', groundTiles, 0, 0);

    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;

    player = this.physics.add.sprite(200, 900, 'player');
    player.setBounce(0.1);
    player.setCollideWorldBounds(true);

    spawnEnemies(4, enemiesPosX, enemiesPosY);
    
    player.body.setSize(player.width-10, player.height-8);
    
    this.physics.add.collider(groundLayer, player);

    coinLayer.setTileIndexCallback(879, getCoin, this);

    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    this.cameras.main.startFollow(player); 
    this.cameras.main.setBackgroundColor('#ccccff');

    text = this.add.text(20, 570, score, {
        fontSize: '20px',
        fill: '#ffffff'
    });
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