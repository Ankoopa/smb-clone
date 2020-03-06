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
  
var game = new Phaser.Game(config);