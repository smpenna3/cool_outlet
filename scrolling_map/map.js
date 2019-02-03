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

    cursors = this.input.keyboard.createCursorKeys();

    this.add.circle(1983, 1022, 15, 0x000000)
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
}

function render(){
}