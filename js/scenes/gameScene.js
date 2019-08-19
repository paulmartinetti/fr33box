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

    this.hTensOld = 0;
    this.hOnesOld = 0;
    this.mTensOld = 0;
    this.mOnesOld = 0;

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

    this.timedEventStats = this.time.addEvent({
        delay: 1000,
        repeat: -1,
        callback: function () {
            // update stats (final implementation) - pass stats obj
            this.updateTime();
        },
        callbackScope: this
    });
};

gameScene.updateTime = function () {

    let time = new Date();

    let minutes = time.getMinutes();
    let hours = time.getHours();
    
    // separate minutes into tens and ones
    if (minutes < 10) {
        this.mTensOld = 0;
        this.mOnesOld = minutes;
    } else {
        this.mTensOld = Math.floor(minutes / 10);
        this.mOnesOld = minutes - (this.mTensOld * 10);
    }

    if (hours < 10) {
        this.hTensOld = 0;
        this.hOnesOld = hours;
    } else {
        this.hTensOld = Math.floor(hours / 10);
        this.hOnesOld = hours - (this.hTensOld * 10);
    }
    


    console.log(((this.hTensOld*10) + this.hOnesOld)+"h"+((this.mTensOld*10)+this.mOnesOld));

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
            spr.setFrame(this.mOnesOld);
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