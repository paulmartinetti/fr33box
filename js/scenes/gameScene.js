// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function () {

    this.gameW = this.sys.game.config.width;
    this.gameH = this.sys.game.config.height;

    


};

// executed once, after assets were loaded
gameScene.create = function () {

    //console.log('here');

    // ajoute droite
    let droite = this.add.sprite(100, 100, 'droite').setOrigin(0,0);
    droite.setFrame(4);

    // mask to animate
    let dMask = this.add.graphics().setVisible(false);
    // enter color first, then alpha value
    dMask.fillStyle(0x000000, 1);
    // params - x, y, h, w
    dMask.fillRect(150, 150, 250, 250);
    // add mask to droit
    droite.mask = new Phaser.Display.Masks.BitmapMask(this, dMask);




    // to start in the middle of the grid, have to use update() and limit
};



// no code here, doesn't run