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
    this.load.image('spikes', 'assets/spikes.png');
    this.load.image('large_cloud', 'assets/cloud_large.png');
    this.load.image('bomb', 'assets/bomb_omb.png') // Large bomb
    //this.load.image('bomb', 'assets/bomb.png'); // Small bomb
    this.load.image('small_cloud', 'assets/cloud_small.png');
    this.load.spritesheet('dude',
        'assets/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
}

function create(){
    this.add.image(400, 300, 'sky');
    this.add.text(100, 200, 'Watch out for \nspikes and bombs!', {fontSize:'40px'})
    this.add.text(100, 400, 'Collect 300 points!', {fontSize:'40px'})

    // Create a static group to hold the platforms
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 603, 'ground').setScale(2).refreshBody();

    // Create group to hold the stars
    stars = this.physics.add.group();

    // Create group to hold the bombs
    bombs = this.physics.add.group();

    // Create a group to hold the spikes
    spikes = this.physics.add.group();

    // Create a group to hold the clouds
    clouds = this.physics.add.group();

    // Create the player object
    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.body.setGravityY(1200);

    // Colliders so things work
    this.physics.add.collider(player, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.collider(platforms, spikes);
    this.physics.add.collider(player, bombs, boomBoyByeFoop, null, this);
    this.physics.add.collider(player, spikes, boomBoyByeFoop, null, this);
    this.physics.add.collider(platforms, stars);
    this.physics.add.collider(stars, spikes);

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
    this.cameras.main.scrollY = 0;
    this.cameras.main.setZoom(0.8); // 0.3 debug, 0.8 develop
    cam = this.cameras.main

    // Setup score text
    scoreText = this.add.text(10, 30, 'Score: 0', {fontSize:'36px', fill:'#301'}).setScrollFactor(0, 1).setDepth(2);
}

var current_chunk = 0;

function update(){
    this.cameras.main.scrollX = player.x-400;
    cursors = this.input.keyboard.createCursorKeys();

    // Check for left/right motion
    if (cursors.left.isDown){
        player.setVelocityX(-200);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown){
        player.setVelocityX(200);
        player.anims.play('right', true);
    }
    else{
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    // Check for jump
    if (cursors.up.isDown && player.body.touching.down){
        player.setVelocityY(-1000);
    }

    // Check if you fell off
    if(player.y > 680){
        player.setTint(0xff0000);
        player.anims.play('turn');
        gameOver = true;
        msg = (score > 300) ? "YOU WIN" : "YOU LOSE";
        this.add.text(400, 300, msg, {fontsize:'128px', fill:0xff0000});
        status = (msg == "YOU WIN") ? "complete" : "fail";
        sessionStorage.setItem("parkstreet", status);
        exit();
    }

    // Check if the player has reached the second half
    if(player.x >= current_chunk*800+200){
        generate_chunk(this);
    }

    // Score text
    scoreText.setText('Score: '+score.toString());
}

function generate_chunk(that){
    // Add more sky (background)
    next_x_center = (400+(current_chunk+1)*800)
    that.add.image(next_x_center, 300, 'sky').setDepth(-1);

    // Add more ground
    platforms.create(next_x_center, 603, 'ground').setScale(2).refreshBody();

    // Add platforms
    num_to_create = Math.round(Phaser.Math.FloatBetween(1, 4));
    console.log('Creating ' + num_to_create.toString() + ' platforms');
    for(i = 0; i < num_to_create; i++){
      x = Math.round(Phaser.Math.FloatBetween(0, 800))+(current_chunk+1)*800;
      y = Math.round(Phaser.Math.FloatBetween(60, 540));
      //console.log('Creating at ('+x.toString()+','+y.toString()+')');
      platforms.create(x, y, 'ground');
    }
    platforms.children.iterate(function (child) {
        child.setDepth(1);
    });

    // Add clouds
    clouds.create(400, 300, 'small_cloud').body.setAllowGravity(false);

    // Add stars
    num_of_stars = Math.round(Phaser.Math.FloatBetween(0, 12));
    console.log('Creating ' + num_of_stars.toString() + ' stars');
    for(i = 0; i < num_of_stars; i++){
        x = Math.round(Phaser.Math.FloatBetween(0, 800))+(current_chunk+1)*800;
        stars.create(x, 0, 'star').setBounceY(Phaser.Math.FloatBetween(0.8, 0.999));
    }

    // Add spikes
    num_of_spikes = Math.round(Phaser.Math.FloatBetween(0, 2));
    console.log('Creating ' + num_of_spikes.toString() + ' spikes');
    for(i = 0; i < num_of_spikes; i++){
        x = Math.round(Phaser.Math.FloatBetween(200, 800))+(current_chunk+1)*800;
        y = Math.round(Phaser.Math.FloatBetween(0, 1))
        if(y == 0){y = 0}
        else{y = 550}
        //console.log('Creating at ('+x.toString()+','+y.toString()+')');
        spikes.create(x, y, 'spikes');
    }
    spikes.children.iterate(function (child){
        child.setDepth(1);
    })

    // Add bombs
    num_of_bombs = Math.round(Phaser.Math.FloatBetween(0, 3));
    console.log('Creating ' + num_of_bombs.toString() + ' bombs');
    for(i = 0; i < num_of_bombs; i++){
        x = Math.round(Phaser.Math.FloatBetween(0, 800))+(current_chunk+1)*800;
        y = Math.round(Phaser.Math.FloatBetween(0, 600));
        x_vel = Phaser.Math.FloatBetween(-80, -10);
        boun = Phaser.Math.FloatBetween(0.8, 0.99)
        bombs.create(x, y, 'bomb').setVelocityX(x_vel).setBounceY(boun);
    }

    // Increase the chunks
    current_chunk += 1;

    // Bring the player to the front
    player.setDepth(1);
    console.log('Made more terrain')
}

function collectStar(player, star){
    star.disableBody(true, true);
    score += 5;
    scoreText.setText('Score: ' + score);
}

function boomBoyByeFoop(player, bomb) {
    console.log('DEAD')
    this.physics.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
    msg = (score > 300) ? "YOU WIN" : "YOU LOSE";
    this.add.text(400, 300, msg, {fontsize:'128px', fill:0xff0000});
    status = (msg == "YOU WIN") ? "complete" : "fail";
    sessionStorage.setItem("parkstreet", status);
    exit();
}

async function exit(){
    await sleep(2000);

    window.location.href = '/map'
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
