class PixelShmup extends Phaser.Scene {
    constructor() {
        super("pixelShmupScene");

        this.my = {sprite: {}};

        this.playerSpeed = 10;
        this.playerBulletSpeed = 10;
        this.spawnTimer = 0;
        this.target1 = 240;
        this.target2 = 360;
        // this.enemyBulletSpeed = 10;
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
        this.load.bitmapFont('kenneyPixelSquareFont', 'kenney_pixel_square_font_0.png', 'kenney_pixel_square_font.fnt');
        
        // and "Impact Sounds" packs
        this.load.audio("playerFiring", "footstep_concrete_001.ogg");
        this.load.audio("playerDestroyed", "impactPlate_heavy_000.ogg");
        this.load.audio("enemyFiring", "footstep_carpet_003.ogg");
        this.load.audio("enemyDestroyed", "impactPlate_medium_001.ogg");

        // Update instruction text
        document.getElementById('description').innerHTML = '<h2>Use A and D to move, use Space to fire, and use R to reset</h2>'
    }

    create() {
        let my = this.my;

        let points1 = [
            150, -60,
            150, 44,
            97, 123,
            90, 192,
            145, 288,
            286, 333,
            378, 338,
            554, 355,
            734, 368,
            863, 402,
            868, 468,
            837, 523,
            718, 551,
            556, 565,
            381, 581,
            315, 609,
            279, 669,
            311, 733,
            355, 780,
            417, 860
        ];
        
        let points2 = [
            786, -60,
            786, 26,
            827, 95,
            805, 143,
            681, 185,
            547, 208,
            362, 233,
            203, 264,
            103, 312, 
            68, 368,
            116, 466, 
            205, 492,
            370, 521,
            519, 549,
            617, 573,
            700, 590,
            770, 625,
            764, 682,
            704, 756,
            648, 860
        ];

        let points3 = [
            403, -60,
            403, 11,
            341, 43,
            191, 141,
            174, 255,
            279, 292,
            466, 317,
            637, 323,
            721, 357,
            780, 405,
            782, 474,
            676, 532,
            449, 546,
            196, 565,
            125, 626,
            169, 678,
            281, 723,
            374, 741,
            426, 772,
            454, 793,
            500, 860
        ];

        let points4 = [
            585, -60,
            585, 13,
            588, 48,
            597, 77,
            639, 107,
            694, 135,
            706, 173,
            691, 222, 
            613, 275,
            498, 307,
            422, 320,
            302, 348,
            240, 386,
            241, 441,
            318, 495,
            473, 528,
            584, 560,
            687, 592,
            738, 645,
            741, 687,
            699, 716,
            619, 727,
            483, 753,
            388, 777,
            357, 796,
            300, 860
        ];

        this.curves = [];

        this.enemyArr = [
            "fighter",
            "interceptor",
            "bomber"
        ];

        my.sprite.spawnedEnemies = [];

        this.curves.push(new Phaser.Curves.Spline(points1));
        this.curves.push(new Phaser.Curves.Spline(points2));
        this.curves.push(new Phaser.Curves.Spline(points3));
        this.curves.push(new Phaser.Curves.Spline(points4));

        this.totalEnemies = 10;
        this.currEnemies = 0;
        this.intermission = 0;
        this.wave = 1;
        this.waveCounter = this.add.bitmapText(10, 30, 'kenneyPixelSquareFont', 'Wave:  ' + this.wave, 32);

        this.score = 0;
        this.displayScore = this.add.bitmapText(10, 0, 'kenneyPixelSquareFont', 'Score:  ' + this.score, 32);

        this.gameOver = "Game over! Press R to restart";
        this.displayGameOver = this.add.bitmapText(375, 300, 'kenneyPixelSquareFont', this.gameOver, 64);
        this.displayGameOver.maxWidth = 400;
        this.displayGameOver.visible = false;

        this.left = this.input.keyboard.addKey("A");
        this.right = this.input.keyboard.addKey("D");
        this.rKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        this.space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        my.sprite.player = new Player(this, game.config.width/2, game.config.height - 40, "playerPlane", null, this.left, this.right, 5);
        my.sprite.player.setScale(2);

        // Create bullet group for player (5)
        my.sprite.playerBulletGroup = this.add.group({
            defaultKey: "playerBullet",
            maxSize: 5
        })

        my.sprite.playerBulletGroup.createMultiple({
            active: false,
            setXY: {x: -200, y: -200},
            key: my.sprite.playerBulletGroup.defaultKey,
            repeat: my.sprite.playerBulletGroup.maxSize - 1
        });

        /*my.sprite.enemyBulletGroup = this.add.group({
            defaultKey: "enemyBullet",
            maxSize: 1
        })

        my.sprite.enemyBulletGroup.createMultiple({
            visible: false,
            active: false,
            key: my.sprite.enemyBulletGroup.defaultKey,
            repeat: my.sprite.enemyBulletGroup.maxSize - 1
        });*/

        // Number of update() calls between player's shots
        this.playerBulletCooldown = 10;
        this.playerBulletCooldownCounter =  0;

        /* Number of update() calls between enemy's shots
        this.enemyBulletCooldown = 300;
        this.enemyBulletCooldownCounter = 0;*/

        // Create animation for planes being destroyed
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
            repeat: 0,
            hideOnComplete: true
        });
    }

    update() {
        let my = this.my;
        this.playerBulletCooldownCounter--;
        this.spawnTimer++;
        // this.enemyBulletCooldownCounter--;

        if (this.currEnemies < this.totalEnemies) {
            if (this.spawnTimer == this.target1) {
                this.spawnEnemies();
                this.currEnemies++;
                this.target1 += 240;
            }
            if (this.spawnTimer == this.target2) {
                this.spawnEnemies();
                this.currEnemies++;
                this.target2 += 240;
            }
        }

        if (this.currEnemies == this.totalEnemies && my.sprite.spawnedEnemies.length == 0) {
            this.waveCounter.setText('Wave  ' + this.wave + '  complete!');
            this.intermission++;
            if (this.intermission >= 300) {
                this.totalEnemies += 5;
                this.currEnemies = 0;
                this.intermission = 0;
                this.spawnTimer = 0;
                this.target1 = 240;
                this.target2 = 360;
                this.wave++;
                this.waveCounter.setText('Wave:  ' + this.wave);
            }
        }

        // player firing behavior
        if (this.space.isDown) {
            if (this.playerBulletCooldownCounter < 0) {
                let playerBullet = my.sprite.playerBulletGroup.getFirstDead();
                
                if (playerBullet != null) {
                    playerBullet.active = true;
                    playerBullet.visible = true;
                    playerBullet.x = my.sprite.player.x;
                    playerBullet.y = my.sprite.player.y - (my.sprite.player.displayHeight/3);
                    this.sound.play('playerFiring', {
                        volume: 1
                    });
                    this.playerBulletCooldownCounter = this.playerBulletCooldown;
                }
            }
        }

        if (this.rKey.isDown) {
            this.resetGame();
        }

        for (let playerBullet of my.sprite.playerBulletGroup.getChildren()) {
            for (let enemy of my.sprite.spawnedEnemies) {
                if (this.collides(enemy, playerBullet)) {
                    // add to score
                    this.score += 100;
                    this.displayScore.setText('Score:  ' + this.score);
                    
                    // play destroy animation and enemyDestroyed sound when playerBullet hits an enemy
                    this.explosion = this.add.sprite(enemy.x, enemy.y, "explosion1").setScale(2).play("explosion");
                    
                    // clear out playerBullet and enemy
                    playerBullet.y = -100;
                    enemy.stopFollow();
                    enemy.visible = false;
                    enemy.y = 900;

                    this.sound.play("enemyDestroyed", {
                        volume: 1
                    });
                }
            }
        }

        for (let playerBullet of my.sprite.playerBulletGroup.getChildren()) {
            // If playerBullet moves off the top of the screen, make it inactive
            if (playerBullet.y < -(playerBullet.displayHeight/2)) {
                playerBullet.active = false;
                playerBullet.visible = false;
            }
        }

        /* enemy firing behavior
        for (let enemy of my.sprite.spawnedEnemies) {
            if (enemy.visible == true && enemy.x < 0) {
                if (this.enemyBulletCooldownCounter < 0) {
                    let enemyBullet = my.sprite.enemyBulletGroup.getFirstDead();
                        
                    if (enemyBullet != null) {
                        enemyBullet.active = true;
                        enemyBullet.visible = true;
                        enemyBullet.x = enemy.x;
                        enemyBullet.y = enemy.y + (enemy/3);
                        this.sound.play('enemyFiring', {
                            volume: 0.2
                        });
                        this.enemyBulletCooldownCounter = this.enemyBulletCooldown;
                    }
                }
            }
        }*/

        // collision for enemy and player
        for (let enemy of my.sprite.spawnedEnemies) {
            if (this.collides(enemy, my.sprite.player)) {
                // play destroy animation and playerDestroyed sound when player and enemy make contact
                this.explosion = this.add.sprite(my.sprite.player.x, my.sprite.player.y, "explosion1").setScale(2).play("explosion");
                this.explosion = this.add.sprite(enemy.x, enemy.y, "explosion1").setScale(2).play("explosion");
                
                // clear out enemy and player
                enemy.stopFollow();
                enemy.visible = false;
                my.sprite.player.visible = false;
                my.sprite.player.x = -100;

                this.sound.play("playerDestroyed", {
                    volume: 1
                });

                this.sound.play("enemyDestroyed", {
                    volume: 1
                });

                for (let playerBullet of my.sprite.playerBulletGroup.getChildren()) {
                    playerBullet.y = -100;
                    if (playerBullet.y < -(playerBullet.displayHeight/2)) {
                        playerBullet.active = false;
                        playerBullet.visible = false;
                    }
                }
                for (let enemy of my.sprite.spawnedEnemies) {
                    enemy.visible = false;
                    enemy.stopFollow();
                    enemy.x = 1500;
                    my.sprite.spawnedEnemies = my.sprite.spawnedEnemies.filter((enemy) => enemy.x < game.config.width);
                }

                this.target1 = -1;
                this.target2 = -1;

                this.explosion.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    enemy.x = 1500;
                    my.sprite.spawnedEnemies = my.sprite.spawnedEnemies.filter((enemy) => enemy.x < game.config.width);
                    this.displayGameOver.visible = true;
                }, this);
            }
        }

        my.sprite.playerBulletGroup.incY(-this.playerBulletSpeed);
        // my.sprite.enemyBulletGroup.incY(this.enemyBulletSpeed);

        my.sprite.spawnedEnemies = my.sprite.spawnedEnemies.filter((enemy) => enemy.y < game.config.height);

        // Calls Player class update()
        my.sprite.player.update();
    }

    collides(a,b) {
        if(Math.abs(a.x - b.x) > (a.displayWidth/2 + b.displayWidth/2)) return false;
        if(Math.abs(a.y - b.y) > (a.displayHeight/3 + b.displayHeight/3)) return false;
        return true;
    }

    spawnEnemies() {
        let pickPath = Math.round(Math.random()*(this.curves.length - 1));
        let mySpline = this.curves[pickPath];
        let firstPoint = mySpline.points[0];

        let pickEnemy = Math.round(Math.random()*(this.enemyArr.length - 1));
        let myEnemy = this.enemyArr[pickEnemy];

        let tmpEnemy = this.add.follower(mySpline, firstPoint.x, firstPoint.y, myEnemy);
        tmpEnemy.setScale(2);
        if (this.my.sprite.spawnedEnemies.length < 10) {
            this.my.sprite.spawnedEnemies.push(tmpEnemy.startFollow({
                from: 0,
                to: 1,
                delay: 0,
                duration: 12500,
                ease: "Sine.easeInOut",
                repeat: 0,
                rotateToPath: true,
                rotationOffset: 90
            }));
        }
    }

    resetGame() {
        this.totalEnemies = 10;
        this.currEnemies = 0;
        this.intermission = 0;
        this.wave = 1;
        this.waveCounter.setText('Wave:  ' + this.wave);
        this.score = 0;
        this.displayScore.setText('Score:  ' + this.score);
        this.spawnTimer = 0;
        this.target1 = 240;
        this.target2 = 360;
        this.my.sprite.player.x = game.config.width/2;
        this.my.sprite.player.y = game.config.height - 40;
        this.my.sprite.player.visible = true;
        for (let playerBullet of this.my.sprite.playerBulletGroup.getChildren()) {
                playerBullet.y = -100;
            if (playerBullet.y < -(playerBullet.displayHeight/2)) {
                playerBullet.active = false;
                playerBullet.visible = false;
            }
        }
        for (let enemy of this.my.sprite.spawnedEnemies) {
            enemy.visible = false;
            enemy.stopFollow();
            enemy.x = 1500;
            this.my.sprite.spawnedEnemies = this.my.sprite.spawnedEnemies.filter((enemy) => enemy.x < game.config.width);
        }
        this.displayGameOver.visible = false;
    }
}