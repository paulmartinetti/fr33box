// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function () {

    this.gameW = this.sys.game.config.width;
    this.gameH = this.sys.game.config.height;

    this.margin = 25;
    this.spacer = 25;
    this.side = 250;
    this.fois = 1;

};

// executed once, after assets were loaded
gameScene.create = function () {

    // ajoute droite
    this.htens = this.add.sprite(25, 25, 'droite').setOrigin(0, 0);
    //this.htens.setFrame(0);
    // params - x and y of mask
    this.htens.mask = this.maskMe(this.htens.x,this.htens.y);

    // test move
    this.depart(this.htens);

    /* this.timedEventStats = this.time.addEvent({
        delay: 1000,
        repeat: -1,
        callback: function () {
            // update stats (final implementation) - pass stats obj
            this.updateTime();
        },
        callbackScope: this
    }); */
    // to start in the middle of the grid, have to use update() and limit
};

gameScene.updateTime = function () {
    var time = new Date();

    var hours = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();

    if (hours < 10) {
        hours = "0" + hours;
    }
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    console.log(hours + ":" + minutes + ":" + seconds);

}

gameScene.depart = function (spr) {
    let depart = this.tweens.add({
        targets: spr,
        duration: 1500,
        x: -225,
        y: 25,
        paused: false,
        callbackScope: this,
        onComplete: function (tween, sprites) {
            spr.setFrame(1);
            // set x, y
            spr.x = 25;
            spr.y = -225;
            this.rentre(spr);
        }
    }, this);
}
gameScene.rentre = function (spr) {
    let rentre = this.tweens.add({
        targets: spr,
        duration: 1500,
        x: 25,
        y: 25,
        paused: false,
        callbackScope: this,
        onComplete: function (tween, sprites) {
            console.log('here')
        }
    }, this);
}
gameScene.maskMe = function (ix, iy) {
    // mask to animate
    let dMask = this.add.graphics().setVisible(false);
    // enter color first, then alpha value
    dMask.fillStyle(0x000000, 1);
    // params - x, y, h, w
    dMask.fillRect(ix, iy, this.side, this.side);
    // add mask to droit
    return new Phaser.Display.Masks.BitmapMask(this, dMask);
}

/******************* no code below here, doesn't run */
// globals
let side = 250;
let space = 25;
this.multi = 1;

// gameH = 1000, each number is 250, so we start in the middle
this.format = [
    {
        sx: space,
        sy: space,
        fx: -1 * side,
        fy: space,
        rx: space,
        ry: -1 * side
    },
    {
        sx: (2 * space) + side,
        sy: space,
        fx: (2 * space) + (2 * side),
        fy: space,
        rx: (2 * space) + side,
        ry: -1 * side
    },
    {
        sx: space,
        sy: (2 * space) + side,
        fx: -1 * side,
        fy: (2 * space) + side,
        rx: space,
        ry: (2 * space) + (2 * side)
    },
    {
        sx: (2 * space) + side,
        sy: (2 * space) + side,
        fx: (2 * space) + (2 * side),
        fy: (2 * space) + side,
        rx: (2 * space) + side,
        ry: (2 * space) + (2 * side)
    }
];