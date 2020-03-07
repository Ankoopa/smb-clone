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
    scene: [Loader, Menu, Level1, Level2, Level3, Level4, Death]
  }

var player;
var enemies = [];
var groundLayer, decLayer, coinLayer;
var cursors;

var playerLives = 0;
var score = 0;
var lastScore = 0;
var curLevel = 0;

var map;
var sceneNames = ['level1', 'level2', 'level3', 'level4'];
var scoreLbl, livesLbl, levelLbl;
var scoreText, livesText, levelText;
var mus
var sfxCoin, sfxStomp, sfxJump, sfxDie, sfxGameOver;

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
    sfxJump.play();
  }
}

function spawnEnemies(amt, posX, posY){
  for(var i=0;i<amt;i++){
    this.enemy = worldPhys.add.sprite(posX[i], posY[i], 'enemy');
    this.enemy.velocity = 125;
    this.enemy.alive = true;
    this.enemy.touched = false;
    worldPhys.add.collider(groundLayer, this.enemy);
    enemies.push(this.enemy);
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
    sfxStomp.play();
    enemy.alive = false;
    enemy.destroy();
    score += 5;
    scoreText.setText(score);
  }
  else{
    score = lastScore;
    playerLives--;
    mus.stop();
    curScene.start("deathScreen");
  }
}

function getCoin(plr, coin){
  sfxCoin.play();
  coinLayer.removeTileAt(coin.x, coin.y); // remove the tile/coin
  score++; // add 10 points to the score
  scoreText.setText(score); // set the text to show the current score
}

function touchedBounds(plr){
  if(plr.body.checkWorldBounds() && plr.body.y >= 1190){
    mus.stop();
    score = lastScore;
    playerLives--;
    curScene.start('deathScreen');
  }
}

function touchedPipe(){
  if (cursors.down.isDown && !player.body.onFloor()){
    mus.stop();
    curScene.start(sceneNames[curLevel]);
  }
}

function touchedVertPipe(){
  curScene.start('winScreen');
}