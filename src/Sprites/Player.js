class Player extends Phaser.GameObjects.Sprite {
    
    // x, y: starting sprite location
    // leftKey - key to move left
    // rightKey - key to move right

    constructor(scene, x, y, texture, frame, leftKey, rightKey, playerSpeed) {
        super(scene, x, y, texture, frame);
        
        this.left = leftKey;
        this.right = rightKey;
        this.playerSpeed = playerSpeed;

        scene.add.existing(this);
        
        return this;
    }

    update() {
        // move left
        if (this.left.isDown) {
            if (this.x > (this.displayWidth/2)) {
                console.log("Moving Left");
                this.x -= this.playerSpeed;
            }
        }

        // move right
        if (this.right.isDown) {
            if (this.x < (game.config.width - (this.displayWidth/2))) {
                console.log("Moving Right");
                this.x += this.playerSpeed;
            }
        }
    }
}