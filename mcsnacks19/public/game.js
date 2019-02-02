var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 666,
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

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

function create() {
  this.add.image(400, 333, 'sky');
  this.add.image(400, 45, 'star');
  this.add.image(200, 60, 'star');
  this.add.image(600, 70, 'star');
  this.add.image(50, 50, 'bomb');
  this.add.image(50, 400, 'dude');
}

function update() {

}
