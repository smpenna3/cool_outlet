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

function preload(){
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude',
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

function create(){
    this.add.image(400, 300, 'sky');

    // Create a static group to hold the platforms
    platforms = this.physics.add.staticGroup();

    // Create group to hold the stars
    stars = this.physics.add.group();

    // Create group to hold the bombs
    bombs = this.physics.add.group();

    // Create the player object
    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.body.setGravityY(1200);
    
    // Colliders so things work
    this.physics.add.collider(player, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(player, bombs, boomBoyByeFoop, null, this);

    // Create player animations
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    // Setup the camera
    this.cameras.main.startFollow(player, true);
    this.cameras.main.setZoom(2);
}

function update(){
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

function collectStar(player, star){
    star.disableBody(true, true);
    score += 5;
    scoreText.setText('Score: ' + score);
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