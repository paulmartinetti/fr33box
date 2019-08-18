// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function () {

    this.gameW = this.sys.game.config.width;
    this.gameH = this.sys.game.config.height;

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

};

// executed once, after assets were loaded
gameScene.create = function () {

    // add hour left (0, 1, 2)


    // ajoute droite
    this.htens = this.add.sprite(100, 100, 'droite').setOrigin(0, 0);
    this.htens.setFrame(0);
    // mask to animate
    let dMask = this.add.graphics().setVisible(false);
    // enter color first, then alpha value
    dMask.fillStyle(0x000000, 1);
    // params - x, y, h, w
    dMask.fillRect(100, 100, 250, 250);
    // add mask to droit
    this.htens.mask = new Phaser.Display.Masks.BitmapMask(this, dMask);

    this.timedEventStats = this.time.addEvent({
        delay: 1000,
        repeat: -1,
        callback: function () {
            // update stats (final implementation) - pass stats obj
            this.updateTime();
        },
        callbackScope: this
    });

    //
    this.move(this.htens, this.format[0]);

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

gameScene.move = function (spr, obj) {

    // set x, y
    spr.x = obj.sx;
    spr.y = obj.sy;

    // right exit animation--- REPLACE W TIMELINE
    let sortDroite = this.tweens.add({
        targets: spr,
        duration: 1500,
        x: obj.fx,
        y: obj.fy,
        paused: false,
        callbackScope: this,
        onComplete: function (tween, sprites) {

            this.droite.setFrame(1);

            // set x, y
            spr.x = obj.rx;
            spr.y = obj.ry;
            
            let rentre = this.tweens.add({
                targets: spr,
                duration: 1500,
                x: obj.sx,
                y: obj.sy,
                paused: false,
                callbackScope: this,
                onComplete: function (tween, sprites) {
                    console.log('done');
                }

            })

        }

    }, this);
}

// no code here, doesn't run
