var velocity = 300;

var config = {
    type: Phaser.AUTO,
    width: 900,
    height: 900,
    physics: {
        default: 'arcade',
        arcade: {
        debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        render: render
    }
};

var game = new Phaser.Game(config);

function preload(){
    this.load.image('map', 'map.png');  
    this.load.image('player', 'player.png');    
}

function create(){
    this.add.image(1750, 1750, 'map');

    //this.cameras.main.setBounds(0, 0, 3500, 3500);

    player = this.physics.add.image(1982, 1123, 'player');
    //player = this.add.circle(1982, 1123, 20, 0xf0f000)

    this.cameras.main.startFollow(player, true);
    //this.cameras.main.setZoom(1.5);

    // Check for user input
    cursors = this.input.keyboard.createCursorKeys();


    // Setup a group for the level stations
    levels = this.physics.add.staticGroup();

    // Bowdoin
    bowdoin = this.add.circle(1983, 1022, 15, 0x000000);
    bowdoin.name = 'Bowdoin'
    bowdoin.file = 'bowdoin.html'
    levels.add(bowdoin);

    // Government center
    government_center = this.add.circle(2148, 1188.5, 15, 0x000000);
    government_center.name = 'Government Center'
    government_center.file = 'govcenter.html'
    levels.add(government_center);

    // Park Street
    park_street = this.add.circle(1983, 1355, 15, 0x000000);
    park_street.name = 'Park Street'
    park_street.file = 'parkstreet.html'
    levels.add(park_street);

    // Haymarket
    haymarket = this.add.circle(2313, 1022, 15, 0x000000);
    haymarket.name = 'Haymarket'
    haymarket.file = 'haymarket.html'
    levels.add(haymarket);

    // Setup collider
    this.physics.add.overlap(player, levels, selectlevel, null, this);
}

function selectlevel(player, level){
    //console.log(player);
    console.log(level.name);

    if(confirm('Do you want to go to '+level.name+'?')){
        console.log('Moving to '+level.file);
    }
}

function update(){
    if (cursors.up.isDown){
        player.setVelocityY(-velocity)
    }
    else if (cursors.down.isDown){
        player.setVelocityY(velocity)
    }
    else{
        player.setVelocityY(0);
    }

    if (cursors.left.isDown){
        player.setVelocityX(-velocity)
    }
    else if (cursors.right.isDown){
        player.setVelocityX(velocity)
    }
    else{
        player.setVelocityX(0);
    }

    if(cursors.space.isDown){
        player.x = 1982;
        player.x = 1123;
        player.setVelocityY(0);
        player.setVelocityX(0);
    }
}

function render(){
}