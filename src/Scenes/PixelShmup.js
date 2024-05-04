class PixelShmup extends Phaser.Scene {
    constructor() {
        super("pixelShmupScene");

        this.my = {sprite: {}};

        this.playerSpeed = 5;
    }

    preload() {
        // Load assets
        // Assets from Kenney Assets "Pixel Shmup"
        // and "Impact Sounds" packs
        this.load.setPath("./assets/");
        this.load.image("playerPlane", "ship_0002.png");
        this.load.image("fighter", "ship_0016.png");
        this.load.image("interceptor", "ship_0019.png");
        this.load.image("bomber", "ship_0012.png");

        // Update instruction text
        document.getElementById('description').innerHTML = '<h2>Use A and D to move, use Space to fire</h2>'
    }

    create() {
        let my = this.my;

        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");

        my.sprite.player = new Player(this, game.config.width/2, game.config.height - 40, "playerPlane", null, this.left, this.right, 5);
    }

    update() {
        let my = this.my;

        my.sprite.player.update();
    }
}