// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function () {

    this.gameW = this.sys.game.config.width;
    this.gameH = this.sys.game.config.height;

    // gameH = 1000, each number is 250, so we start in the middle
    this.ulc = [
        {
            sx: 250,
            sy: 250,
            fx: 0,
            fy: 250
        },
        {
            sx: 250,
            sy: 0,
            fx: 250,
            fy: 250
        }
    ];
    // put 25 pixels between and below
    this.urc = [
        {
            sx: 525,
            sy: 250,
            fx: 775,
            fy: 250
        },
        {
            sx: 525,
            sy: 0,
            fx: 525,
            fy: 250
        }
    ];

};

// executed once, after assets were loaded
gameScene.create = function () {

    // add hour left (0, 1, 2)
    

    // ajoute droite
    this.hR = this.add.sprite(100, 100, 'droite').setOrigin(0, 0);
    this.hDroite.setFrame(0);
    // mask to animate
    let dMask = this.add.graphics().setVisible(false);
    // enter color first, then alpha value
    dMask.fillStyle(0x000000, 1);
    // params - x, y, h, w
    dMask.fillRect(100, 100, 250, 250);
    // add mask to droit
    this.droite.mask = new Phaser.Display.Masks.BitmapMask(this, dMask);

    this.timedEventStats = this.time.addEvent({
        delay: 1000,
        repeat: -1,
        callback: function () {
            // update stats (final implementation) - pass stats obj
            this.updateTime();
        },
        callbackScope: this
    }); 

    // to start in the middle of the grid, have to use update() and limit
};
gameScene.updateTime = function (){
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

    // start
    this.moving = true;

    // right exit animation
    let sortDroite = this.tweens.add({
        targets: spr,
        duration: 1500,
        x: obj.fx,
        y: obj.fy,
        paused: false,
        callbackScope: this,
        onComplete: function (tween, sprites) {
            this.moving = false;

            this.ind++;
            if (this.ind > 1) {
                this.ind = 0;
            } else {
                this.min++;
                this.droite.setFrame(this.min);
            }

        }

    }, this);
}

// no code here, doesn't run
