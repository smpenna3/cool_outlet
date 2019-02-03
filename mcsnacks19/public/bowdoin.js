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

var socket = io();

var game = new Phaser.Game(config);

function preload() {
  this.load.image('sky', 'assets/sky.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.spritesheet('dude',
      'assets/dude.png',
      { frameWidth: 32, frameHeight: 48 }
  );
  this.load.image('briefcase', 'assets/briefcase.png');
  this.load.image('portal', 'assets/portal.png')

  this.load.spritesheet('slime', 'assets/DungeonSlime.png',
    { frameWidth: 28, frameHeight: 17 }
  );
  this.load.image('wall', 'assets/invisible_wall.png');
}

function create() {
  this.add.image(400, 300, 'sky');

  platforms = this.physics.add.staticGroup();
  platforms.create(400, 603, 'ground').setScale(2).refreshBody();
  platforms.create(600, 400, 'ground');
  platforms.create(50, 250, 'ground');
  platforms.create(750, 220, 'ground');

  briefcase = this.physics.add.staticGroup();
  briefcase.create(675, 182, 'briefcase');

  player = this.physics.add.sprite(100, 450, 'dude');
  slime = this.physics.add.sprite(500, 300, 'slime');

  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  player.body.setGravityY(400);
  this.physics.add.collider(player, platforms);

  slime.setBounce(0.2);
  slime.setCollideWorldBounds(true);
  slime.body.setGravityY(400);
  this.physics.add.collider(slime, platforms);

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

  this.anims.create({
    key: 'slime_right',
    frames: this.anims.generateFrameNumbers('slime', { start: 0, end: 2 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'slime_turn',
    frames: [ { key: 'slime', frame: 0 } ],
    frameRate: 20
  });

  this.anims.create({
    key: 'slime_left',
    frames: this.anims.generateFrameNumbers('slime', { start: 3, end: 5 }),
    frameRate: 10,
    repeat: -1
  });

  this.physics.add.overlap(player, briefcase, getBriefcase, null, this);

  walls = this.physics.add.staticGroup();
  walls.create(400, 375, 'wall');
  walls.create(798, 375, 'wall');
  this.physics.add.overlap(slime, walls, switchDir, null, this);
  this.physics.add.overlap(player, slime, slimed, null, this);
  slime.setVelocityX(100);
  slime.anims.play('slime_right');
}

function update() {
  cursors = this.input.keyboard.createCursorKeys();

  if (cursors.left.isDown) {
      player.setVelocityX(-160);
      player.anims.play('left', true);
  }
  else if (cursors.right.isDown) {
      player.setVelocityX(160);
      player.anims.play('right', true);
  }
  else {
     player.setVelocityX(0);
      player.anims.play('turn');
  }

  if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-600);
  }
}

function getBriefcase(player, briefcase) {
  briefcase.disableBody(true, true);

  // Make the portal out
  portal = this.physics.add.staticGroup();
  portal.create(50, 500, 'portal');

  this.physics.add.overlap(player, portal, portalOut, null, this);
}

function portalOut(player, portal){
  this.physics.pause();
  socket.emit('bowdoin', 'completed');
  sessionStorage.setItem("bowdoin", "complete");
  exit();
}

function switchDir(slime, wall) {
  slime.body.velocity.x *= -1;
  if (slime.body.velocity.x > 0) {
    slime.anims.play('slime_right');
  } else {
    slime.anims.play('slime_left');
  }
}

function slimed(player, slime) {
  this.physics.pause();
  player.setTint(0xff0000);
  player.anims.play('turn');
  gameOver = true;
  this.add.text(400, 300, 'YOU LOSE', {fontsize:'128px', fill:0xff0000});
  socket.emit('bowdoin', 'fail');
  sessionStorage.setItem("bowdoin", "fail");
  exit();
}

async function exit(){
  await sleep(2000);
  window.location.href = '/map'
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
