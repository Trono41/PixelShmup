class PlayerBullet extends Phaser.GameObjects.Sprite {
    
    // Construct player bullet object
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        
        // Set invisible and inactive
        this.visible = false;
        this.active = false;
        return this;
    }

    update() {

        // If active, bullet moves upward towards top of screen
        if (this.active) {
            this.y -= this.speed;
            
            // If bullet would exit screen, make inactive
            if (this.y < -(displayHeight/2)) {
                this.makeInactive();
            }
        }
    }

    makeActive() {
        // Make bullet visible and active
        this.visible = true;
        this.active = true;
    }

    makeInactive() {
        // Make bullet invisible and inactive
        this.visible = false;
        this.active = false;
    }
}