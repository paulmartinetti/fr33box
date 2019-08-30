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

    /**** design of sprites ****/
    /*
    * standard clock:
    * [0, 1] [ht, ho]
    * [2, 3] [mt, mo]
    *   
    */

    /**
     * LOVE animation grid - large
     */
    this.rowsColsA = [[10, 11, 12, 13],
    ['s', 0, 1, 's'],
    ['s', 2, 3, 's'],
    [20, 21, 22, 23]];

    this.motsA = ['word1col', 'word2col', 'word3col', 'word4col'];
    // to capture seconds = 30 to animate LOVE
    this.seconds = 0;

    this.topRow = 0;
    this.botRow = 1;

    // box array for updates
    this.boxesA = [];

};

// executed once, after assets were loaded
gameScene.create = function () {

    // setup boxes based on rowCol position and format
    let box;
    // initial x, y
    let ix;
    let iy;
    // loop rows cols from design array
    for (let row = 0; row < this.rowsColsA.length; row++) {
        for (let col = 0; col < this.rowsColsA[row].length; col++) {

            // position based on rowCol array (4x4 grid)
            ix = this.leftCur + ((this.side + this.spacer) * col);
            iy = this.topCur + ((this.side + this.spacer) * row);

            // format specific
            let format = this.rowsColsA[row][col];

            // skip a space
            if (format == 's') continue;

            // hour tens
            if (format == 0) {
                box = this.add.sprite(ix, iy, 'gauche').setOrigin(0, 0);
                box.setFrame(this.hTensCur);
            }
            // hour ones
            if (format == 1) {
                box = this.add.sprite(ix, iy, 'droite').setOrigin(0, 0);
                box.setFrame(this.hOnesCur);
            }
            // minute tens
            if (format == 2) {
                box = this.add.sprite(ix, iy, 'gauche').setOrigin(0, 0);
                box.setFrame(this.mTensCur);
            }
            // minute ones
            if (format == 3) {
                box = this.add.sprite(ix, iy, 'droite').setOrigin(0, 0);
                box.setFrame(this.mOnesCur);
            }
            // LOVE formats 10-17
            if (format > 9 && format < 20) {
                iy += 125;
                box = this.add.sprite(ix, iy, this.motsA[format - 10]).setOrigin(0, 0);
                box.setFrame(this.topRow);
            }
            if (format > 19) {
                ix += 125;
                box = this.add.sprite(ix, iy, this.motsA[format - 20]).setOrigin(0, 0);
                box.setFrame(this.botRow);
            }
            // store format for updates
            box.format = format;
            // add shape mask to each
            if (format > 9) {
                box.fenetre = this.add.sprite(ix, iy, 'mask125').setVisible(false).setOrigin(0, 0);
            } else {
                box.fenetre = this.add.sprite(ix, iy, 'mask').setVisible(false).setOrigin(0, 0);
            }
            box.setMask(box.fenetre.createBitmapMask());
            // set coordinates
            box.ix = ix;
            box.iy = iy;
            box.row = row;
            box.col = col;
            this.formatter(box);
            // store boxes for updating
            this.boxesA.push(box);
        }
    }

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

};
gameScene.formatter = function (box) {

    // left, down
    if (box.format == 0 || box.format == 10 || box.format == 20) {
        // animate - depart ending x, y
        box.dx = box.ix - this.side;
        box.dy = box.iy;
        // animate - rentree starting x, y
        box.rx = box.ix;
        box.ry = box.iy - this.side;
    }

    // right, down
    if (box.format == 1 || box.format == 11 || box.format == 21) {
        // animate - depart
        box.dx = box.ix + this.side;
        box.dy = box.iy;
        // animate - rentree
        box.rx = box.ix;
        box.ry = box.iy - this.side;
    }

    // left, up
    if (box.format == 2 || box.format == 12 || box.format == 22) {
        // animate - depart
        box.dx = box.ix - this.side;
        box.dy = box.iy;
        // animate - rentree
        box.rx = box.ix;
        box.ry = box.iy + this.side;
    }

    // right, up
    if (box.format == 3 || box.format == 13 || box.format == 23) {
        // animate - depart
        box.dx = box.ix + this.side;
        box.dy = box.iy;
        // animate - rentree
        box.rx = box.ix;
        box.ry = box.iy + this.side;
    }
}

// looping every second
gameScene.updateTime = function () {

    // checking once per second
    let time = new Date();

    let minutes = time.getMinutes();
    let hours = time.getHours();
    // more reliable than time.getSeconds();
    this.seconds++;

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
    // LOVE @ 30 seconds -- change words
    if (this.seconds == 15) {
        // pick new words
        this.rndMots();
        // update
        for (let i = 0; i < this.boxesA.length; i++) {
            let box = this.boxesA[i];
            // update LOVE boxes, formats 10-17
            if (box.format > 9 && box.format < 20) {
                // update all
                this.depart(box, this.topRow);
            } else if (box.format > 19) {
                this.depart(box, this.botRow);
            }
        }
        this.seconds = 0;
    }

    // clock - if same minute as the last second, no changes
    if (mOnes == this.mOnesCur) return;

    // assess boxes for time change
    for (let i = 0; i < this.boxesA.length; i++) {

        let box = this.boxesA[i];

        // update mOnes box
        if (box.format == 3) {
            this.depart(box, mOnes);
        }

        // check for updated mTens, or moving version (should have been a git branch!)
        if (box.format == 2 && mTens != this.mTensCur) {
            this.depart(box, mTens);
        }

        // hOnes
        if (box.format == 1 && hOnes != this.hOnesCur) {
            this.depart(box, hOnes);
        }

        // hTens
        if (box.format == 0 && hTens != this.hTensCur) {
            this.depart(box, hTens);
        }
    }

    // capture new is now Cur
    this.hTensCur = hTens;
    this.hOnesCur = hOnes;
    this.mTensCur = mTens;
    this.mOnesCur = mOnes;

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
            box.setFrame(newTime);
            //this.formatter(box);
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

// randomize word rows
gameScene.rndMots = function () {
    let tA = [0, 1, 2, 3];
    this.topRow = tA.splice(Math.round(Math.random() * 3), 1);
    this.botRow = tA.splice(Math.round(Math.random() * 2), 1);
    //console.log(this.topRow, this.botRow, tA);
    tA.push(this.topRow);
    tA.push(this.botRow);
}
/******************* no code below here, doesn't run */