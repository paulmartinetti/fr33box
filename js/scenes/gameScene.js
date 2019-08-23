// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function () {

    this.gameW = this.sys.game.config.width;
    this.gameH = this.sys.game.config.height;

    // grid boundaries and sprite dimensions 
    this.topCur = 25;
    this.leftCur = 25;
    this.spacer = 25;
    this.side = 250;

    // store last time check
    this.hTensCur = 0;
    this.hOnesCur = 0;
    this.mTensCur = 0;
    this.mOnesCur = 0;

    // design of sprites
    /*
    * standard clock:
    * [0, 1] [h, h]
    * [2, 3] [m, m]
    *  
    * 's' is a space option for visual effect
    * 
    */

    // original
    //rowsColsA = [[0, 1], [2, 3]];

    // moving @ each minute - if using other than a 2x2 grid - set move=false
    this.movingBoxes = false;

    // other random formats, non-moving
    //this.rowsColsA = [[0, 1, 2, 3]];
    //this.rowsColsA = [[0, 1], ['s', 2, 3]];
    //this.rowsColsA = [[0, 1], ['s'], ['s'], ['s', 's', 2, 3]];
    //this.rowsColsA = [[0, 's'], ['s', 1], ['s', 's', 2], ['s', 's', 's', 3]];

    /**
     * LOVE animation grid
     * 
     * ['s', 10, 11, 's']
     * [17 ,  0,  1,  12]
     * [16 ,  2,  3,  13]
     * ['s', 15, 14, 's']
     * 
     */
    this.rowsColsA = [['s', 10, 11, 's'], [17, 0, 1, 12], [16, 2, 3, 13], ['s', 15, 14, 's']];
    //

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
    // initial x, y
    let ix;
    let iy;
    // loop rows cols from design array
    for (let row = 0; row < this.rowsColsA.length; row++) {
        for (let col = 0; col < this.rowsColsA[row].length; col++) {

            // position based on rowCol array
            ix = this.leftCur + ((this.side + this.spacer) * col);
            iy = this.topCur + ((this.side + this.spacer) * row);

            // format specific
            let format = this.rowsColsA[row][col];

            // skip a space
            if (format == 's') continue;

            if (format == 0) {
                box = this.add.sprite(ix, iy, 'gauche').setOrigin(0, 0);
                box.format = 0;
                box.setFrame(this.hTensCur);

            }
            if (format == 1) {
                box = this.add.sprite(ix, iy, 'droite').setOrigin(0, 0);
                box.setFrame(this.hOnesCur);
            }
            if (format == 2) {
                box = this.add.sprite(ix, iy, 'gauche').setOrigin(0, 0);
                box.setFrame(this.mTensCur);
            }
            if (format == 3) {
                box = this.add.sprite(ix, iy, 'droite').setOrigin(0, 0);
                box.setFrame(this.mOnesCur);
            }
            if (format > 4) {
                box = this.add.sprite(ix, iy, 'love').setOrigin(0, 0);
                box.setFrame(format-10);
            }
            // add shape mask to each
            box.fenetre = this.add.sprite(ix, iy, 'mask').setVisible(false).setOrigin(0, 0);
            box.setMask(box.fenetre.createBitmapMask());
            // set coordinates
            box.row = row;
            box.col = col;
            box.format = format;
            this.formatter(box);
            // store boxes for updating
            this.boxesA.push(box);
        }
    }
};
gameScene.formatter = function (box) {

    // update box
    box.ix = this.leftCur + ((this.side + this.spacer) * box.col);
    box.iy = this.topCur + ((this.side + this.spacer) * box.row);
    box.fenetre.x = box.ix;
    box.fenetre.y = box.iy;

    // left, down
    if (box.format == 0) {
        // animate - depart ending x, y
        box.dx = box.ix - this.side;
        box.dy = box.iy;
        // animate - rentree starting x, y
        box.rx = box.ix;
        box.ry = box.iy - this.side;
    }

    // right, down
    if (box.format == 1) {
        // animate - depart
        box.dx = box.ix + this.side;
        box.dy = box.iy;
        // animate - rentree
        box.rx = box.ix;
        box.ry = box.iy - this.side;
    }

    // left, up
    if (box.format == 2) {
        // animate - depart
        box.dx = box.ix - this.side;
        box.dy = box.iy;
        // animate - rentree
        box.rx = box.ix;
        box.ry = box.iy + this.side;
    }

    // right, up
    if (box.format == 3) {
        // animate - depart
        box.dx = box.ix + this.side;
        box.dy = box.iy;
        // animate - rentree
        box.rx = box.ix;
        box.ry = box.iy + this.side;
    }
}

gameScene.updateTime = function () {

    // checking once per second
    let time = new Date();

    let minutes = time.getMinutes();
    let hours = time.getHours();

    // new time check values
    let mTens = 0;
    let mOnes = 0;
    let hTens = 0;
    let hOnes = 0;

    // separate minutes into tens and ones
    if (minutes < 10) {
        mTens = 0;
        mOnes = minutes;
    } else {
        mTens = Math.floor(minutes / 10);
        mOnes = minutes - (mTens * 10);
    }

    // same for hours
    if (hours < 10) {
        hTens = 0;
        hOnes = hours;
    } else {
        hTens = Math.floor(hours / 10);
        hOnes = hours - (hTens * 10);
    }

    // if same minute, no changes
    if (mOnes == this.mOnesCur) return;

    // assess boxes for time to move
    for (let i = 0; i < this.boxesA.length; i++) {

        let box = this.boxesA[i];

        // update mOnes box
        if (box.format == 3) {
            this.depart(box, mOnes);
        }

        // check for updated mTens
        if (box.format == 2 && (mTens != this.mTensCur || this.movingBoxes)) {
            this.depart(box, mTens);
        }

        // hOnes
        if (box.format == 1 && (hOnes != this.hOnesCur || this.movingBoxes)) {
            this.depart(box, hOnes);
        }

        // hTens
        if (box.format == 0 && (hTens != this.hTensCur || this.movingBoxes)) {
            this.depart(box, hTens);
        }
    }

    // new is now Cur
    this.hTensCur = hTens;
    this.hOnesCur = hOnes;
    this.mTensCur = mTens;
    this.mOnesCur = mOnes;

    // move 2x2 now, before this.rentre() begins
    if (this.movingBoxes) {
        this.topCur = 25 + Math.floor(Math.random() * (this.gameH - 25 - ((this.side + this.spacer) * 2)));
        this.leftCur = 25 + Math.floor(Math.random() * (this.gameW - 25 - ((this.side + this.spacer) * 2)));
    }
}

// animate out
gameScene.depart = function (box, newTime) {
    let depart = this.tweens.add({
        targets: box,
        duration: 1500,
        x: box.dx,
        y: box.dy,
        paused: false,
        callbackScope: this,
        onComplete: function (tween, sprites) {
            // update time
            box.setFrame(newTime);
            // tenter bouger
            this.formatter(box);
            // set x, y for rentree
            box.x = box.rx;
            box.y = box.ry;
            this.rentre(box);
        }
    }, this);
}
// animate back in
gameScene.rentre = function (box) {
    let rentre = this.tweens.add({
        targets: box,
        duration: 1500,
        x: box.ix,
        y: box.iy,
        paused: false,
        callbackScope: this
    }, this);
}

/******************* no code below here, doesn't run */