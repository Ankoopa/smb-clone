var config = {
    type: Phaser.AUTO,
      width: 1280,
      height: 720,
      physics: {
          default: 'arcade',
          arcade: {
              gravity: {y: 575},
              debug: true
          }
      },
    scene: [Menu, Level1, Level2, Level3, Death]
  }

var player;
var groundLayer, coinLayer;
var cursors
var score = 0;
var map, map2, map3, map4;
var text;

var worldPhys, curScene;

var game = new Phaser.Game(config);