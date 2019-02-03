var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

var score = 0;
var scoreText;

var game = new Phaser.Game(config);

function preload() {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('star', 'assets/star.png');
  this.load.image('bomb', 'assets/bomb.png');
  this.load.spritesheet('dude',
      'assets/dude.png',
      { frameWidth: 32, frameHeight: 48 }
  );
}

var platforms;

function create() {
  this.add.image(400, 300, 'sky');

  platforms = this.physics.add.staticGroup();
  platforms.create(400, 603, 'ground').setScale(2).refreshBody();
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  stars = this.physics.add.group({
    key: 'star',
    repeat: 11,
    setXY: { x: 12, y: 0, stepX: 70 }
  });

  stars.children.iterate(function(child) {
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  });

  this.physics.add.collider(stars, platforms);

  player = this.physics.add.sprite(100, 450, 'dude');

  player.setBounce(0.8);
  player.setCollideWorldBounds(true);
  player.body.setGravityY(1200);
  player.body.setGravityX(100);
  this.physics.add.collider(player, platforms);

  this.physics.add.overlap(player, stars, collectStar, null, this);

  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [ { key: 'dude', frame: 4 } ],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
    frameRate: 10,
    repeat: -1
  });

  scoreText = this.add.text(16, 27.3489243, 'sCoRe: 0', {fontSize:'36px', fill:'#301'});

  bombs = this.physics.add.group();
  this.physics.add.collider(bombs, platforms);
  this.physics.add.collider(player, bombs, boomBoyByeFoop, null, this);
}

function update() {
  cursors = this.input.keyboard.createCursorKeys();

  if (cursors.left.isDown)
  {
      player.setVelocityX(-160);

      player.anims.play('left', true);
  }
  else if (cursors.right.isDown)
  {
      player.setVelocityX(160);

      player.anims.play('right', true);
  }
  else
  {
    //  player.setVelocityX(0);

      player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down)
  {
      player.setVelocityY(-2000);
  }
}

function collectStar(player, star) {
  star.disableBody(true, true);
  score += 5;
  scoreText.setText('ScOrE: ' + score);

  if (stars.countActive(true) === 0) {
    stars.children.iterate(function (child) {
      child.enableBody(true, child.x, 0, true, true);
    });

    var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

    var bomb = bombs.create(x, 16, 'bomb');
    bomb.setBounce(1);
    bomb.setCollideWorldBounds(true);
    bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    // Comment
    // Move the platforms
    num_platforms = platforms.children.entries.length;

    // Disable all platforms except the last
    for(i = 1; i < num_platforms; i++){
      platforms.children.entries[i].disableBody(true, true);
    }

    // Create new platforms
    num_to_create = Math.round(Phaser.Math.FloatBetween(1, 4));
    console.log('Creating ' + num_to_create.toString() + ' platforms');
    for(i = 1; i < num_to_create; i++){
      x = Math.round(Phaser.Math.FloatBetween(0, 800));
      y = Math.round(Phaser.Math.FloatBetween(0, 540));
      console.log('Creating at ('+x.toString()+','+y.toString()+')');
      platforms.create(x, y, 'ground');
    }
  }
}

function boomBoyByeFoop(player, bomb) {
  this.physics.pause();
  player.setTint(0xff0000);
  player.anims.play('turn');
  gameOver = true;
  this.add.text(400, 300, 'YOU LOSE', {fontsize:'128px', fill:0xff0000})
  exit();
}

async function exit(){
  await sleep(2000);

  window.location.href = '/map'
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}