var config = {
    type: Phaser.AUTO,
      width: 1400,
      height: 768,
      physics: {
          default: 'arcade',
          arcade: {
              gravity: {y: 575},
              debug: false
          }
      },
    scene: [Menu, Level1, Death]
  }
  
var game = new Phaser.Game(config);