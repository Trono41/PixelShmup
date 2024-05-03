class PixelShmup extends Phaser.Scene {
    constructor() {
        super("pixelShmupScene");
    }

    preload() {
        // Load assets
        // Assets from Kenney Assets "Pixel Shmup"
        // and "Impact Sounds" packs
        this.load.setPath("./assets/");
        this.load.image("player", "ship_0002.png");
        this.load.image("fighter", "ship_0016.png");
        this.load.image("interceptor", "ship_0019.png");
        this.load.image("bomber", "ship_0012.png");

        // Update instruction text
        document.getElementById('description').innerHTML = '<h2> Use A and D to move, use Space to fire</h2>'
    }

    create() {
        this.playerSprite = this.add.sprite(100, 300, "player");

        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    }

    update() {
        if (this.aKey.isDown) {
            this.playerSprite.x -= 1;
            if (this.playerSprite.x <= 0)
                this.playerSprite.x = 0;
        }
    }
}