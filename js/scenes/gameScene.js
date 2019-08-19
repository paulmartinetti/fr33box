// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function () {

    this.gameW = this.sys.game.config.width;
    this.gameH = this.sys.game.config.height;

    // grid boundaries and sprite dimensions 
    this.margin = 25;
    this.spacer = 25;
    this.side = 250;

    // store last time check
    this.hTensOld = 0;
    this.hOnesOld = 0;
    this.mTensOld = 0;
    this.mOnesOld = 0;

    // design of sprites
    /*
    * standard clock:
    * [0, 1] [h, h]
    * [2, 3] [m, m]
    *  
    * 's' is a space option for visual effect
    * 
    */
    this.rowsColsA = [[0, 1], [2, 3]];
    //this.rowsColsA = [[0, 1, 2, 3]];
    //this.rowsColsA = [[0, 1], ['s', 2, 3]];
    //this.rowsColsA = [[0, 1], ['s'], ['s'], ['s', 's', 2, 3]];

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
    // mask to animate
    let square = this.add.graphics().setVisible(false);
    // enter color first, then alpha value
    square.fillStyle(0x000000, 1);
    // loop rows cols from design array
    for (let row = 0; row < this.rowsColsA.length; row++) {
        for (let col = 0; col < this.rowsColsA[row].length; col++) {

            // position based on rowCol array
            ix = this.margin + ((this.side + this.spacer) * col);
            iy = this.margin + ((this.side + this.spacer) * row);

            // format specific
            let format = this.rowsColsA[row][col];

            // skip a space
            if (format == 's') continue;

            if (format == 0) {
                box = this.add.sprite(ix, iy, 'gauche').setOrigin(0, 0);
                box.format = 0;
                box.setFrame(this.hTensOld);
                // animate - depart ending x, y
                box.dx = ix - this.side;
                box.dy = iy;
                // animate - rentree starting x, y
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
            // add shape mask to each
            // params - x, y, h, w
            square.fillRect(ix, iy, this.side, this.side);
            let mask = square.createGeometryMask();
            box.setMask(mask);
            // store boxes for updating
            this.boxesA.push(box);
        }
    }
    //console.log(this.boxesA);
};

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
    if (mOnes == this.mOnesOld) return;

    //console.log(this.hTensOld, this.hOnesOld, this.mTensOld, this.mOnesOld);
    for (let i = 0; i < this.boxesA.length; i++) {

        let box = this.boxesA[i];

        // update mOnes box
        if (box.format == 3) {
            this.depart(box, mOnes);
        }

        // check for updated mTens
        if (box.format == 2 && mTens != this.mTensOld) {
            this.depart(box, mTens);
        }

        // hOnes
        if (box.format == 1 && hOnes != this.hOnesOld) {
            this.depart(box, hOnes);
        }

        // hTens
        if (box.format == 0 && hTens != this.hTensOld) {
            this.depart(box, hTens);
        }

    }

    // new is now old
    this.hTensOld = hTens;
    this.hOnesOld = hOnes;
    this.mTensOld = mTens;
    this.mOnesOld = mOnes;

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
        callbackScope: this,
        onComplete: function (tween, sprites) {
            console.log('voila')
        }
    }, this);
}

/******************* no code below here, doesn't run */