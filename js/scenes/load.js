class Loader extends Phaser.Scene{
    constructor(){
      super("loadGame");
    }
    preload() {
        this.load.tilemapTiledJSON('map', 'assets/maps/level1alt.json');
        this.load.tilemapTiledJSON('map2', 'assets/maps/level2.json');
        this.load.tilemapTiledJSON('map3', 'assets/maps/level3.json');
        this.load.tilemapTiledJSON('map4', 'assets/maps/level4.json');


        this.load.image('play', 'assets/images/ui/playBtn.png');

        this.load.spritesheet('world_tiles', 'assets/maps/tileset_world.png', {frameWidth: 32, frameHeight: 32});

        this.load.image('coin', 'assets/sprites/coinGold.png');

        this.load.atlas('player', 'assets/sprites/player.png', 'assets/sprites/json/player.json');
        this.load.atlas('enemy', 'assets/sprites/enemy.png', 'assets/sprites/json/enemy.json');

        this.load.audio('bgm1', 'assets/audio/bgm1.ogg');
        this.load.audio('bgm2', 'assets/audio/bgm2.ogg');
        this.load.audio('bgm3', 'assets/audio/bgm3.ogg');
        this.load.audio('bgm3', 'assets/audio/bgm4.ogg');

        this.load.audio('coin', 'assets/audio/coin.ogg');
        this.load.audio('stomp', 'assets/audio/stomp.ogg');
        this.load.audio('jump', 'assets/audio/jump.ogg');
        this.load.audio('die', 'assets/audio/die.ogg');
        this.load.audio('gameover', 'assets/audio/gameover.ogg');
    }
    create(){
        sfxCoin = this.sound.add('coin');
        sfxStomp = this.sound.add('stomp');
        sfxJump = this.sound.add('jump');
        sfxDie = this.sound.add('die');
        sfxGameOver = this.sound.add('gameover');

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