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
    this.rowsColsA = [[0, 1], [2, 3]];
    //this.rowsColsA = [[0, 1, 2, 3]];
    //this.rowsColsA = [[0, 1], ['s', 2, 3]];
    //this.rowsColsA = [[0, 1], ['s'], ['s'], ['s', 's', 2, 3]];
    //this.rowsColsA = [[0, 's'], ['s', 1], ['s', 's', 2], ['s', 's', 's', 3]];

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
                box.format = 1;
                box.setFrame(this.hOnesCur);
            }
            if (format == 2) {
                box = this.add.sprite(ix, iy, 'gauche').setOrigin(0, 0);
                box.format = 2;
                box.setFrame(this.mTensCur);
            }
            if (format == 3) {
                box = this.add.sprite(ix, iy, 'droite').setOrigin(0, 0);
                box.format = 3;
                box.setFrame(this.mOnesCur);
            }
            // set coordinates
            box.row = row;
            box.col = col;
            this.formatter(box);
            // add shape mask to each
            box.fenetre = this.add.sprite(ix, iy, 'mask').setVisible(false).setOrigin(0, 0);
            box.setMask(box.fenetre.createBitmapMask());
            // store boxes for updating
            this.boxesA.push(box);
        }
    }
    //this.boxesA[2].fenetre.y+=100;
    //this.boxesA[2].y += 100;
};
/* gameScene.mover = function(){
    // position based on rowCol array
    
} */
gameScene.formatter = function (box) {

    // update box
    box.ix = this.leftCur + ((this.side + this.spacer) * box.col);
    box.iy = this.topCur + ((this.side + this.spacer) * box.row);

    if (box.format == 0) {
        // animate - depart ending x, y
        box.dx = box.ix - this.side;
        box.dy = box.iy;
        // animate - rentree starting x, y
        box.rx = box.ix;
        box.ry = box.iy - this.side;
    }

    if (box.format == 1){
        // animate - depart
        box.dx = box.ix + this.side;
        box.dy = box.iy;
        // animate - rentree
        box.rx = box.ix;
        box.ry = box.iy - this.side;
    }
    
    if (box.format == 2) {
        // animate - depart
        box.dx = box.ix - this.side;
        box.dy = box.iy;
        // animate - rentree
        box.rx = box.ix;
        box.ry = box.iy + this.side;
    }

    if (box.format == 3) {
        // animate - depart
        box.dx = box.ix + this.side;
        box.dy = box.iy;
        // animate - rentree
        box.rx = box.ix;
        box.ry = box.iy + this.side;
    }
}
gameScene.move2x2 = function () {
    // prepare to move 2x2 clock
    let topNew = 25 + Math.floor(Math.random() * (this.gameH - (this.side - this.spacer) * 2));
    let leftNew = 25 + Math.floor(Math.random() * (this.gameH - (this.side - this.spacer) * 2));

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

    //console.log(this.hTensCur, this.hOnesCur, this.mTensCur, this.mOnesCur);
    for (let i = 0; i < this.boxesA.length; i++) {

        let box = this.boxesA[i];

        // update mOnes box
        if (box.format == 3) {
            this.depart(box, mOnes);
        }

        // check for updated mTens -  && mTens != this.mTensCur
        if (box.format == 2) {
            this.depart(box, mTens);
        }

        // hOnes -  && hOnes != this.hOnesCur
        if (box.format == 1) {
            this.depart(box, hOnes);
        }

        // hTens -  && hTens != this.hTensCur
        if (box.format == 0) {
            this.depart(box, hTens);
        }

    }

    // new is now Cur
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
            // update time
            box.setFrame(newTime);
            // move 2x2 now
            //this.move2x2();
            //box.fenetre.x = box.ix;
            //box.fenetre.y = box.iy;
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