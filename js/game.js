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
    scene: [Loader, Menu, Level1, Level2, Level3, Death]
  }

var player;
var enemies = [];
var groundLayer, coinLayer;
var cursors

var playerLives = 0;
var score = 0;
var lastScore = 0;
var curLevel = 0;

var map, map2, map3, map4;
var sceneNames = ['level1', 'level2'];
var text;

var worldPhys, curScene;

var game = new Phaser.Game(config);

function playerController(plr, cursors){
  if (cursors.left.isDown)
  {
    plr.body.setVelocityX(-250);
    plr.anims.play('walk', true); // walk left
    plr.flipX = true; // flip the sprite to the left
  }
  else if (cursors.right.isDown)
  {
    plr.body.setVelocityX(250);
    plr.anims.play('walk', true);
    plr.flipX = false; // use the original sprite looking to the right
  } else {
    plr.body.setVelocityX(0);
    plr.anims.play('idle', true);
  }
  // jump 
  if (cursors.up.isDown && plr.body.onFloor()){
    plr.body.setVelocityY(-500);        
  }
}

function checkEnemies(enemy, idx){
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
    worldPhys.world.collide(player, enemy, enemyTouch, null, this);
  }
}

function enemyTouch(plr, enemy){
  if(enemy.body.touching.up && plr.body.touching.down){
    plr.body.setVelocityY(-200);

    enemy.alive = false;
    enemy.destroy();
    score += 5;
    text.setText(score);
  }
  else{
    // any other way to collide on an enemy will restart the game
    score = lastScore;
    playerLives--;
    curScene.start("deathScreen");
  }
}

function getCoin(plr, coin){
  console.log('coin get');
  coinLayer.removeTileAt(coin.x, coin.y); // remove the tile/coin
  score++; // add 10 points to the score
  text.setText(score); // set the text to show the current score
}

function touchedBounds(plr, levelNum){
  if(plr.body.checkWorldBounds() && plr.body.y >= 1190){
    score = 0;
    playerLives--;
    curScene.start('deathScreen');
  }
  else if(plr.body.checkWorldBounds() && plr.body.x >= 6900){
    curScene.start(sceneNames[levelNum]);
  }
}