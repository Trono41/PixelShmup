class PixelShmup extends Phaser.Scene {
    constructor() {
        super("pixelShmupScene");

        this.my = {sprite: {}};

        this.playerSpeed = 5;
        this.playerBulletSpeed = 5;

        // Number of update() calls between player's shots
        this.playerBulletCooldown = 3;
        this.playerBulletCooldownCounter =  0;

        // Number of update() calls between enemy1's shots
        this.enemy1BulletCooldown = 15;
        this.enemy1BulletCooldownCounter = 0;

        // Number of update() calls between enemy2's shots
        this.enemy2BulletCooldown = 7;
        this.enemy2BulletCooldownCounter = 0;
    }

    preload() {
        // Load assets
        // Assets from Kenney Assets "Pixel Shmup"
        this.load.setPath("./assets/");
        this.load.image("playerPlane", "ship_0002.png");
        this.load.image("playerBullet", "tile_0000.png");
        this.load.image("fighter", "ship_0016.png");
        this.load.image("interceptor", "ship_0019.png");
        this.load.image("bomber", "ship_0012.png");
        this.load.image("enemyBullet", "tile_0002.png");
        this.load.image("explosion1", "tile_0004.png");
        this.load.image("explosion2", "tile_0005.png");
        this.load.image("explosion3", "tile_0006.png");
        this.load.image("explosion4", "tile_0007.png");
        this.load.image("explosion5", "tile_0008.png");
        
        // and "Impact Sounds" packs
        this.load.audio("playerFiring", "footstep_concrete_001.ogg");
        this.load.audio("enemyDestroyed", "impactPlate_medium_001.ogg");

        // Update instruction text
        document.getElementById('description').innerHTML = '<h2>Use A and D to move, use Space to fire</h2>'
    }

    create() {
        let my = this.my;

        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        my.sprite.player = new Player(this, game.config.width/2, game.config.height - 40, "playerPlane", null, this.left, this.right, 5);
        my.sprite.player.setScale(2);

        my.sprite.enemy1 = this.add.sprite(game.config.width/2, 30, "fighter");
        my.sprite.enemy1.setScale(2.2);
        my.sprite.enemy1.flipY = true;


        // Create bullet group for player (5)
        my.sprite.playerBulletGroup = this.add.group({
            active: true,
            defaultKey: "playerBullet",
            maxSize: 5,
            runChildUpdate: true
        })

        // Create all player bullets and set them to inactive
        my.sprite.playerBulletGroup.createMultiple({
            classType: PlayerBullet,
            active: false,
            key: my.sprite.playerBulletGroup.defaultKey,
            repeat: my.sprite.playerBulletGroup.maxSize -1 
        });
        // my.sprite.playerBulletGroup.propertyVauleSet("speed", this.playerBulletSpeed);

        this.anims.create({
            key: "explosion",
            frames: [
                {key: "explosion1"},
                {key: "explosion2"},
                {key: "explosion3"},
                {key: "explosion4"},
                {key: "explosion5"}
            ],
            frameRate: 5,
            repeat: 1,
            hideOnComplete: true
        });
    }

    update() {
        let my = this.my;
        this.playerBulletCooldownCounter --;

        my.sprite.player.update();
    }
}