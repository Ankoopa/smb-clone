var config = {
    type: Phaser.AUTO,
    width: 1408,
    height: 768,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 500},
            debug: false
        }
    },
    scene: {
        key: 'main',
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var map;
var player;
var cursors;
var groundLayer;
var text;

function preload() {
    this.load.tilemapTiledJSON('titleMap', 'assets/maps/title.json');
}

function create() {
    // load the map 
    map = this.make.tilemap({key: 'map'});

    // tiles for the ground layer
    var groundTiles = map.addTilesetImage('tiles');
    // create the ground layer
    groundLayer = map.createDynamicLayer('ground', groundTiles, 0, 0);
    // the player will collide with this layer
    groundLayer.setCollisionByExclusion([-1]);

    // set the boundaries of our game world
    this.physics.world.bounds.width = groundLayer.width;
    this.physics.world.bounds.height = groundLayer.height;



    // player walk animation
    // this.anims.create({
    //     key: 'walk',
    //     frames: this.anims.generateFrameNames('player', {prefix: 'p1_walk', start: 1, end: 11, zeroPad: 2}),
    //     frameRate: 10,
    //     repeat: -1
    // });

    // // idle with only one frame, so repeat is not needed
    // this.anims.create({
    //     key: 'idle',
    //     frames: [{key: 'player', frame: 'p1_stand'}],
    //     frameRate: 10,
    // });
}

function update(time, delta) {
    
}