// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function () {

    this.gameW = this.sys.game.config.width;
    this.gameH = this.sys.game.config.height;

};

// executed once, after assets were loaded
gameScene.create = function () {

    //console.log('here');

    // ajoute droite
    let droite = this.add.sprite(100, 100, 'droite').setOrigin(0,0);
    droite.setFrame(4);

    // mask to animate
    let dMask = this.add.graphics().setVisible(false);
    // enter color first, then alpha value
    dMask.fillStyle(0x000000, 1);
    // params - x, y, h, w
    dMask.fillRect(100, 100, 250, 250);
    // add mask to droit
    droite.mask = new Phaser.Display.Masks.BitmapMask(this, dMask);

    // right exit animation
    let sortDroite = this.tweens.add({
        targets: droite,
        duration: 1500,
        x: 350,
        y: 100,
        paused: false,
        callbackScopte: this,
        onComplete: function (tween, sprites) {
            console.log('done');
        }

    });


    // to start in the middle of the grid, have to use update() and limit
};
// fn context = Scene not Sprite (bg) passed 'this' in on();
gameScene.placeItem = function (pointer, localX, localY) {
    // var 'pointer' shows game scene coordinates
    // vars localX, localY show coordinates of object selected
    // with our bg, it's the same in this case
    //console.log(localX, localY);

    // check for selected item, otherwise it's just a bg click
    if (!this.selectedItem) return;

    // ui must be unblocked
    //if(if.uiBlocked) return;

    // create a new item in the position where user clicked
    let newItem = this.add.sprite(localX, localY, this.selectedItem.texture.key)

    // block UI while pet goes to eat selectedItem
    this.uiBlocked = true;

    // move this.pet to newItem (set in create fn)
    // onComplete is the callback fn
    // tween is inside scene context (passed 'this' from btn)
    let petTween = this.tweens.add({
        targets: this.pet,
        duration: 500,
        x: newItem.x,
        y: newItem.y,
        paused: false,
        callbackScope: this,
        onComplete: function (tween, sprites) {

            // make newItem disappear
            newItem.destroy();

            // listen for chewing to finish before unlocking ui
            this.pet.on('animationcomplete', function () {

                // put pet face back to frame 0
                // use setFrame after obj is created (instead of .frame())
                this.pet.setFrame(0);

                // to limit placing one item, null selectedItem, reset ui
                // this must follow stats update that needs selectedItem
                this.uiReady();
                // pass scene context (this)
            }, this);

            // newItem is reached, so play chewing animation
            this.pet.play('funnyfaces');

            // update stats (final implementation)
            this.updateStats(this.selectedItem.customStats);

        }
    });
};


// no code here, doesn't run