var config = {
    type: Phaser.AUTO,
    width: 3500,
    height: 3500,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: {y: 333 },
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
    game.load.image('map', 'map.png');

    
}

function create(){
    this.add.image(1750, 1750, 'map');
    // Set the background color for behind the map
    game.stage.backgroundColor = '#2d2d2d';

    //  Make our game world 3500x3500, the image is 3300x3300
    game.world.setBounds(0, 0, 3500, 3500);

    cursors = game.input.keyboard.createCursorKeys();
}

function update(){
    if (cursors.up.isDown){
        game.camera.y -= 4;
    }
    else if (cursors.down.isDown){
        game.camera.y += 4;
    }

    if (cursors.left.isDown){
        game.camera.x -= 4;
    }
    else if (cursors.right.isDown){
        game.camera.x += 4;
    }
}

function render(){
    game.debug.cameraInfo(game.camera, 32, 32);
}