// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function () {

    this.gameW = this.sys.game.config.width;
    this.gameH = this.sys.game.config.height;

    this.moving = true;

    this.llc = [
        {
            sx: 100,
            sy: 100,
            fx: 350,
            fy: 100
        },
        {
            sx: 100,
            sy: 350,
            fx: 100,
            fy: 100
        }
    ];

    this.ind = 0;
    this.min = 0;

};

// executed once, after assets were loaded
gameScene.create = function () {

    //console.log('here');

    // ajoute droite
    this.droite = this.add.sprite(100, 100, 'droite').setOrigin(0, 0);
    this.droite.setFrame(0);

    // mask to animate
    let dMask = this.add.graphics().setVisible(false);
    // enter color first, then alpha value
    dMask.fillStyle(0x000000, 1);
    // params - x, y, h, w
    dMask.fillRect(100, 100, 250, 250);
    // add mask to droit
    this.droite.mask = new Phaser.Display.Masks.BitmapMask(this, dMask);

    this.moving = false;

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
gameScene.update = function () {

    //console.log(this.ind);

    // move
    if (!this.moving && this.min < 10) {
        //console.log('here');
        this.move(this.droite, this.llc[this.ind]);
    }

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
