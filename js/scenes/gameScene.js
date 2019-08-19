// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function () {

    this.gameW = this.sys.game.config.width;
    this.gameH = this.sys.game.config.height;

    this.margin = 25;
    this.spacer = 25;
    this.side = 250;

    this.hTensOld = 0;
    this.hOnesOld = 0;
    this.mTensOld = 0;
    this.mOnesOld = 0;

    // design of sprites
    this.rowsColsA = [[0, 1], [2, 3]];

    // box array for updates
    this.boxesA = [];

};

// executed once, after assets were loaded
gameScene.create = function () {

    // start tracking time
    this.timedEventStats = this.time.addEvent({
        delay: 1000,
        repeat: -1,
        callback: function () {
            // update stats (final implementation) - pass stats obj
            this.updateTime();
        },
        callbackScope: this
    });

    // setup boxes based on rowCol position and format
    let box;
    let ix;
    let iy;
    // mask to animate
    let square = this.add.graphics().setVisible(false);
    // enter color first, then alpha value
    square.fillStyle(0x000000, 1);
    // loop rows cols
    for (let row = 0; row < this.rowsColsA.length; row++) {
        for (let col = 0; col < this.rowsColsA[row].length; col++) {

            // position based on rowCol array
            ix = this.margin + ((this.side + this.spacer) * col);
            iy = this.margin + ((this.side + this.spacer) * row);

            // format specific
            let format = this.rowsColsA[row][col];
            if (format == 0) {
                box = this.add.sprite(ix, iy, 'gauche').setOrigin(0, 0);
                box.format = 0;
                box.setFrame(this.hTensOld);
                // animate - depart
                box.dx = ix - this.side;
                box.dy = iy;
                // animate - rentree
                box.rx = ix;
                box.ry = iy - this.side;
            }
            if (format == 1) {
                box = this.add.sprite(ix, iy, 'droite').setOrigin(0, 0);
                box.format = 1;
                box.setFrame(this.hOnesOld);
                // animate - depart
                box.dx = ix + this.side;
                box.dy = iy;
                // animate - rentree
                box.rx = ix;
                box.ry = iy - this.side;
            }
            if (format == 2) {
                box = this.add.sprite(ix, iy, 'gauche').setOrigin(0, 0);
                box.format = 2;
                box.setFrame(this.mTensOld);
                // animate - depart
                box.dx = ix - this.side;
                box.dy = iy;
                // animate - rentree
                box.rx = ix;
                box.ry = iy + this.side;
            }
            if (format == 3) {
                box = this.add.sprite(ix, iy, 'droite').setOrigin(0, 0);
                box.format = 3;
                box.setFrame(this.mOnesOld);
                // animate - depart
                box.dx = ix + this.side;
                box.dy = iy;
                // animate - rentree
                box.rx = ix;
                box.ry = iy + this.side;
            }
            // independent of format
            box.ix = ix;
            box.iy = iy;
            // params - x, y, h, w
            square.fillRect(ix, iy, this.side, this.side);
            let mask = square.createGeometryMask();
            box.setMask(mask);
            //
            this.boxesA.push(box);
        }
    }
    //console.log(this.boxesA);
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

    //console.log(this.hTensOld, this.hOnesOld, this.mTensOld, this.mOnesOld);

}
// animate out
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
// animate back in
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

/******************* no code below here, doesn't run */