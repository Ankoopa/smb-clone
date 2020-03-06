class Loader extends Phaser.Scene{
    constructor(){
      super("loadGame");
    }
    preload() {
        this.load.tilemapTiledJSON('map', 'assets/maps/level1alt.json');
        this.load.tilemapTiledJSON('map2', 'assets/maps/level2.json');
        this.load.tilemapTiledJSON('map3', 'assets/maps/level3.json');


        this.load.image('play', 'assets/images/ui/playBtn.png');
        this.load.atlas('player', 'assets/sprites/player.png', 'assets/sprites/json/player.json');

        this.load.spritesheet('world_tiles', 'assets/maps/tileset_world.png', {frameWidth: 32, frameHeight: 32});

        this.load.image('coin', 'assets/sprites/coinGold.png');

        this.load.atlas('player', 'assets/sprites/player.png', 'assets/sprites/json/player.json');
        this.load.atlas('enemy', 'assets/sprites/enemy.png', 'assets/sprites/json/enemy.json');
    }
    create(){
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('player', {prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2}),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: [{key: 'player', frame: 'p1_stand'}],
            frameRate: 10,
        });

        this.anims.create({
        key: 'ewalk',
        frames: this.anims.generateFrameNames('enemy', {prefix: 'walk', start: 1, end: 2}),
        frameRate: 10,
        repeat: 1
        });

        cursors = this.input.keyboard.createCursorKeys();
    }
    update(){
        this.scene.start('bootGame');
    }
}